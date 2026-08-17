# Story.fun 产品原型 Demo

> AI 内容 + Web3 经济 的产品原型。纯前端 HTML 原型，无需安装任何环境，用浏览器直接打开即可演示。

## 🚀 怎么打开

直接用浏览器（Chrome / Edge / Safari 均可）打开根目录下的任意 `.html` 文件即可。
建议从 **`index.html`**（首页）开始演示。

> 提示：`video/` 文件夹里的视频较大（共 84MB），如果只是看页面效果可以不用管它。

## 📄 页面清单

### 核心页面（演示主线）

| 页面 | 说明 |
|---|---|
| `index.html` | 首页 · 内容推荐流（推荐短剧、角色、活动） |
| `recommend.html` | 推荐页 · 短视频信息流 + 榜单 |
| `actors.html` | 角色广场 · 浏览 AI 角色 IP（NFT） |
| `actor-profile.html` | 角色主页 · 角色详情、作品、数据 |
| `create-actor.html` | 创建角色 |
| `edit-actor.html` | 编辑角色资料 |
| `drama-player.html` | 短剧播放器（点击任意短剧封面进入） |
| `narrator.html` | 解说/旁白内容页 |
| `studio.html` | 创作者工作台 · 内容创作与发布管理 |
| `publish.html` | 发布内容 |
| `edit-drama.html` | 编辑短剧 |
| `edit-video.html` | 编辑视频 |
| `publish-video.html` | 发布视频 |

### 用户中心

| 页面 | 说明 |
|---|---|
| `profile-center.html` | 个人中心（桌面/移动通用版） |
| `profile-center-ios.html` | 个人中心（iOS 风格版，从个人中心左下角入口切换） |
| `actors_ios.html` | 角色广场（iOS 风格版，从角色广场右下角按钮切换） |
| `user-profile-visitor.html` | 访客视角的他人主页 |
| `notifications.html` | 通知中心 |
| `task.html` | 任务中心 |
| `watch-history.html` | 观看历史 |
| `rewards.html` | 奖励中心 |
| `referral.html` | 邀请好友 |
| `mobile-login.html` | 手机端登录 |

### 经济系统

| 页面 | 说明 |
|---|---|
| `fund-dashboard.html` | 资金/经济看板（STORY 代币、收益） |
| `social.html` | 社区动态 |
| `search.html` | 搜索页 |
| `search-results.html` | 搜索结果 |
| `whitepaper.html` | 白皮书 |
| `about.html` | 关于我们 · 产品介绍 |

### 内容专题页

| 页面 | 说明 |
|---|---|
| `1011.html` | 专题故事《1011》 |
| `1011-museum.html` | 1011 博物馆 |
| `1011诺亚方舟.html` | ⚠ 已移入 `_archive/`（无页面引用，旧版专题） |

### 公共组件（被多个页面共用，一般无需直接打开）

| 文件 | 说明 |
|---|---|
| `header.html` | 顶部导航模板 |
| `bottom-nav.html` | 底部导航模板 |
| `sidebar.html` | 侧边栏模板（当前未被使用） |
| `load-header.js` / `load-desktop-header.js` | 顶部导航加载器（桌面端） |
| `load-bottom-nav.js` | 底部导航加载器 |
| `load-sidebar.js` | 侧边栏加载器（桌面端） |
| `search.js` | ⭐ 全局搜索功能（10 个页面共用，改搜索逻辑只改这一个文件） |
| `auth.js` | 登录/用户状态（23 个页面共用） |
| `actor-card.js` / `drama-card.js` | 角色卡片 / 短剧卡片组件 |
| `cm-panel.js` / `cm-panel.css` | 社区/内容管理面板 |
| `ai-chat.js` | AI 对话逻辑 |
| `player-controls.js` / `screen-fullscreen.js` | 播放器控件 / 全屏 |
| `recommend-perf.js` | 推荐页性能优化 |
| `load-sidebar.js` | 侧边栏 |

### 后台管理（`admin/` 文件夹）

管理后台页面，与前台原型配套，用于演示运营侧功能。

## 🗂 目录说明

- `image/` — 页面图片（已优化压缩为 JPG，共约 5MB）
- `video/` — 演示视频（4 个，共约 84MB）
- `_archive/` — 备份夹：存放不再使用的旧文件（临时文件、旧版专题页、闲置图片），确认不需要后可手动删除

## 📚 产品文档

- `Story.fun 经济模型二期升级方案.md` — 经济模型设计文档（STORY 代币、Creator Pass、Story Store、交易市场等）

## 🧹 近期优化记录（2025-08）

1. **图片瘦身**：17 张超大 PNG 图（共 53MB）压缩为高质量 JPG（共 5MB），视觉无差别，页面加载明显变快。原图仍在 git 历史中可恢复。
2. **代码去重**：搜索功能原来在 10 个页面里各复制了一份（共约 25KB），现提取为公共文件 `search.js`，以后改搜索只改一处。
3. **清理归档**：临时文件 `.!32821!recommend.html`、旧版专题 `1011诺亚方舟.html`、闲置图片 `hero-winter.png`、`role-card-img.png` 移入 `_archive/`。

## ⚠️ 已知待确认事项

- `about.html`（关于我们）目前没有任何页面链接到它，如果需要在导航里加入口，请告知。
- `edit-actor.html`、`sidebar.html` 也暂未被引用，如确认不再需要可移入 `_archive/`。
- 演示时点击 1011 专题里的角色卡片会跳转播放页，封面图参数传的是文件名（如 `cover-pyramid.jpg`），播放页会显示默认封面兜底，如需显示对应封面可告知修复。
