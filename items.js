/* ============================================================
   Story.fun 道具系统（demo 实现）
   库存 localStorage 持久化 + 模拟支付（不真实扣款）
   道具：体力补给包 supply / 训练手册 manual / Story Claw 周卡 clawWeek / Story Claw 月卡 clawMonth
   ============================================================ */
window.ItemStore = (function () {
  const KEY = 'sf2_items_v1';
  const DEF = { supply: 0, manual: 0, clawWeek: 0, clawMonth: 0, clawActive: null };

  function load() {
    try {
      return Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY) || '{}'));
    } catch (e) { return Object.assign({}, DEF); }
  }
  function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }

  return {
    get: function () { return load(); },

    count: function (type) { return load()[type] || 0; },

    add: function (type, n) {
      const s = load(); s[type] = (s[type] || 0) + n; save(s); return s[type];
    },

    // 消耗库存；不足返回 false
    spend: function (type, n) {
      const s = load();
      if ((s[type] || 0) < n) return false;
      s[type] -= n; save(s); return true;
    },

    // 模拟支付购买（demo：直接成功入库）
    buy: function (type, n) { this.add(type, n); return true; },

    // ---- Claw 状态 ----
    // 返回 { expireAt, kind, remainMs } 或 null（未激活/已过期）
    clawState: function () {
      const s = load();
      if (!s.clawActive) return null;
      if (s.clawActive.expireAt <= Date.now()) {
        s.clawActive = null; save(s); return null;
      }
      return { expireAt: s.clawActive.expireAt, kind: s.clawActive.kind || 'week', remainMs: s.clawActive.expireAt - Date.now() };
    },

    // 开通/续费 Claw（kind: 'week'|'month'）：购买即生效，不占库存；重复开通只延长有效期
    activateClaw: function (kind) {
      const s = load();
      const days = kind === 'month' ? 30 : 7;
      const base = s.clawActive && s.clawActive.expireAt > Date.now() ? s.clawActive.expireAt : Date.now();
      s.clawActive = { expireAt: base + days * 86400000, kind: kind };
      save(s);
      return { ok: true, expireAt: s.clawActive.expireAt };
    },

    // 调试用：切换 Claw 激活状态（激活 ↔ 未激活），返回 'on' | 'off'
    toggleClawDebug: function () {
      const s = load();
      if (s.clawActive && s.clawActive.expireAt > Date.now()) {
        s.clawActive = null;
      } else {
        s.clawActive = { expireAt: Date.now() + 7 * 86400000, kind: 'week' };
      }
      save(s);
      return s.clawActive ? 'on' : 'off';
    },

    // ---- 到期时间格式化（本地时区，纯数字 YYYY-MM-DD HH:mm，语言无关）----
    formatExpiry: function (ms) {
      const d = new Date(ms);
      const pad = function (n) { return n < 10 ? '0' + n : '' + n; };
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    },

    // ---- 消耗规则（与 PRD 一致）----
    // 补满体力按等级固定消耗补给包：Lv1~5 = 1/2/5/13/32
    supplyNeeded: function (level) { return [0, 1, 2, 5, 13, 32][level] || 1; },
    // 升级按路径消耗训练手册：Lv1→2=1, 2→3=2, 3→4=4, 4→5=8
    manualNeeded: function (level) { return [0, 1, 2, 4, 8][level] || 1; },
  };
})();

window.ITEM_DEFS = {
  supply:    { key: 'supply',    name: '体力补给包', icon: '🧃', price: 10,    unit: 'USDC', desc: '补满角色体力', detail: '补满角色体力，按角色等级消耗。' },
  manual:    { key: 'manual',    name: '训练手册',   icon: '📘', price: 10,   unit: 'USDC', desc: '升级角色', detail: '角色升级材料，升级时按角色等级消耗。' },
  clawWeek:  { key: 'clawWeek',  name: 'Story Claw 周卡',  icon: '🐾', price: 800,  unit: 'STORY', desc: '7 天自动运营', detail: '购买后立即生效，7 天自动运营：\n· 期间所有角色产出 +5%\n· 自动安排最优演出\n· 自动补充体力\n· 体力耗尽自动休息\n续费延长有效期，产出加成不叠加。' },
  clawMonth: { key: 'clawMonth', name: 'Story Claw 月卡',  icon: '🐾', price: 3000, unit: 'STORY', desc: '30 天自动运营', detail: '购买后立即生效，30 天自动运营：\n· 期间所有角色产出 +5%\n· 自动安排最优演出\n· 自动补充体力\n· 体力耗尽自动休息\n续费延长有效期，产出加成不叠加。' },
};
