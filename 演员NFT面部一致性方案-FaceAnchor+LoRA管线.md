# 演员 NFT 面部一致性方案：Face Anchor + LoRA 管线

> Story.fun 演员 NFT（生活形象/定妆照）→ DramaOS（剧中形象）
> 演员 NFT 铸造时训练面部 LoRA → DramaOS 使用时加载 LoRA 锁定面容
> 不管换什么戏服、场景、发型，脸始终是同一张

---

## 一、问题定义

**Story.fun**：用户创建/铸造演员 NFT，上传的是演员的"生活形象照"或"定妆照"

**DramaOS**：用户用 NFT 做短剧时，演员需要穿戏服、换场景，但脸应该和 NFT 形象一致

**核心挑战**：AI 生图/生成视频时，如何保证同一个演员在不同剧集中面部一致，同时允许服装、场景、发饰自由变化？

---

## 二、技术架构：Face Anchor + LoRA 管线

```
Story.fun 铸造演员 NFT                 DramaOS 制作短剧
══════════════════════                 ══════════════════
用户上传多角度形象照                     用户选演员 NFT → 用其 LoRA
        │                                      │
  面部特征提取 + LoRA 训练                  指定戏服/场景 Prompt
        │                                      │
  LoRA 权重 → 写入 NFT 元数据               AI 生成 = LoRA(脸锁定) + Prompt(衣服/场景)
        │                                      │
  (一次训练，终身复用)                  所有镜头/所有剧集脸都一致
```

---

## 三、Step 1：Story.fun铸造阶段 — 训练面部 LoRA

### 3.1 用户上传形象照

- 上传至少 **3-5 张**多角度面部清晰照（正面、半侧、全侧）
- 系统自动做**面部检测**，裁切出脸部区域，排除背景干扰
- 检测不通过时提示"请重新上传，面部需清晰可见"

### 3.2 训练 LoRA 模型

- 使用 SDXL / FLUX 的 LoRA 训练管线
- 训练权重 ≈ 20MB，一次训练终身复用
- LoRA 权重上传至 IPFS 或 Arweave → 得到 CID

### 3.3 NFT 元数据扩展

铸造后演员 NFT 的 metaplex metadata 扩展含：

```json
{
  "name": "苏婉清",
  "image": "ipfs://...avatar.png",
  "attributes": [
    { "trait_type": "性别", "value": "女" },
    { "trait_type": "种族", "value": "人族" },
    { "trait_type": "定位", "value": "古风" }
  ],
  "properties": {
    "face_lora_cid": "ipfs://...lora.safetensors",
    "face_lora_trigger": "swq_face",
    "face_samples": 5,
    "face_verified": true
  }
}
```

关键属性：

| 字段 | 说明 |
|---|---|
| `face_lora_cid` | LoRA 权重文件的 IPFS CID |
| `face_lora_trigger` | 触发词，Prompt 中引用即可激活该面部 |
| `face_samples` | 训练用的面部裁剪图数量 |
| `face_verified` | 面部一致性验证通过标志 |

---

## 四、Step 2：DramaOS 使用阶段 — 载入 LoRA 锁定面容

### 4.1 选角流程

```
用户在 DramaOS 新建角色
    ↓
弹出"从我的演员 NFT 中选择"
    ↓
读取 NFT metadata → 提取 face_lora_cid
    ↓
从 IPFS 下载 LoRA 权重 → 注入 AI 生成管线
    ↓
用户只需描述服装/场景，不需要再描述脸
```

### 4.2 Prompt 拼接规则

```
最终 Prompt = [LoRA 触发词] + [用户描述的服装/场景] + [质量后缀]

示例：
swq_face, 古装红袍, 长发, 站在城墙上, 夕阳, 黄金光晕, 8k, cinematic
↑ 触发词锁定脸    ↑ 服饰/场景由用户自由描述
```

### 4.3 角色视图生成

DramaOS 中的角色卡片（正面/侧面/背面视图）全部使用同一 LoRA：

- 正面视图：`[trigger], 正面, 半身, 看向镜头`
- 侧面视图：`[trigger], 侧面, 45度角`
- 背面视图：`[trigger], 背面, 转身回眸`

### 4.4 分镜/视频生成

- 每个分镜的 Prompt 都注入 LoRA 触发词
- LoRA 锁定面容，Prompt 控制服装、场景、动作、光影
- **所有分镜、所有剧集，脸始终一致**

---

## 五、用户可调整 vs 不可调整

| 维度 | 用户可在 DramaOS 调整 | 锁定方式 |
|---|---|---|
| 服装/戏服 | ✅ 通过 Prompt 自由描述 | LoRA 不锁定服装 |
| 发型/发饰 | ✅ 通过 Prompt 自由描述 | LoRA 不锁定发型 |
| 场景/背景 | ✅ 自由选择/描述 | 完全自由 |
| 表情/情绪 | ✅ 通过 Prompt 控制 | 捕捉自 LoRA 训练的基础脸型 |
| **面容（五官结构）** | ❌ 不能改 | **LoRA 锁定** |
| **肤色/肤质** | ✅ 可微调（妆容、光影） | Prompt 控制 |

---

## 六、两平台完整协作流程

```
┌─────────────────────────────────────────────────────────┐
│                    Story.fun 平台                         │
│                                                           │
│  [上传形象照(多角度)] → [面部裁剪] → [LoRA训练]           │
│                                                           │
│  LoRA权重 → IPFS                                         │
│  触发词 + CID → 写入 NFT metadata                         │
│                                                           │
│  演员 NFT v2 元数据:                                       │
│   • 姓名 / 简介 / 形象照                                  │
│   • face_lora_cid → IPFS 上的 LoRA 权重                   │
│   • face_lora_trigger → 触发词                            │
│   • face_verified → 已验证                                │
└──────────────────────────┬──────────────────────────────┘
                           │ NFT 元数据（链上+链下）
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    DramaOS 平台                           │
│                                                           │
│  [读取NFT元数据] → [下载LoRA权重] → [注入AI生成管线]       │
│                                                           │
│  用户在 DramaOS 中                                        │
│   • 选演员 → 自动加载面部 LoRA                             │
│   • 描述服装/场景 → 拼成完整 Prompt                        │
│   • 生成角色视图(正/侧/背) → 脸不变                        │
│   • 生成各分镜/视频 → 每帧脸不变                           │
│                                                           │
│  最终效果：演员 NFT 的脸 + 用户设计的戏服/场景              │
└─────────────────────────────────────────────────────────┘
```

---

## 七、开发工作项

| # | 模块 | 文件/位置 | 描述 | 优先级 |
|---|---|---|---|---|
| 1 | **面部检测/裁剪** | `create-actor.html` | 上传后自动面部检测、多角度筛选、裁切 | P0 |
| 2 | **LoRA 训练服务** | 后端（待建） | 接收面部裁切图 → 训练 LoRA → 上传 IPFS → 返回 CID | P0 |
| 3 | **NFT 元数据升级** | Metaplex | metadata 扩展 `face_lora_cid` / `face_lora_trigger` | P0 |
| 4 | **DramaOS 选角 LoRA 加载** | `dramaos.html` | 选演员时读 metadata → 下载 LoRA → 注入生成管线 | P0 |
| 5 | **Prompt 引擎** | `dramaos.html` | 自动拼接 `[触发词] + [用户描述的服装/场景]` | P1 |
| 6 | **批量面部训练** | 后管工具 | 已有演员 NFT 批量训练 LoRA（数据迁移） | P1 |

---

## 八、未来扩展

- **跨平台互认**：DramaOS 生成的视频回流 Story.fun 时，自动识别 LoRA 一致性
- **面部微调**：允许用户在一定范围内调整年龄、妆容（LoRA + ControlNet）
- **多人同框**：多个演员 NFT 的 LoRA 同时加载，保持多人面部各自一致
