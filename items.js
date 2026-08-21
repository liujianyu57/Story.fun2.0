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
    // 返回 { expireAt, remainMs } 或 null（未激活/已过期）
    clawState: function () {
      const s = load();
      if (!s.clawActive) return null;
      if (s.clawActive.expireAt <= Date.now()) {
        s.clawActive = null; save(s); return null;
      }
      return { expireAt: s.clawActive.expireAt, remainMs: s.clawActive.expireAt - Date.now() };
    },

    // 激活 Claw（kind: 'week'|'month'），消耗 1 张对应库存；重复激活只延长有效期
    activateClaw: function (kind) {
      const type = kind === 'week' ? 'clawWeek' : 'clawMonth';
      const s = load();
      if ((s[type] || 0) < 1) return { ok: false, reason: 'no-stock' };
      const days = kind === 'week' ? 7 : 30;
      const base = s.clawActive && s.clawActive.expireAt > Date.now() ? s.clawActive.expireAt : Date.now();
      s[type] -= 1;
      s.clawActive = { expireAt: base + days * 86400000 };
      save(s);
      return { ok: true, expireAt: s.clawActive.expireAt };
    },

    // ---- 消耗规则（与 PRD 一致）----
    // 补满体力按等级固定消耗补给包：Lv1~5 = 1/2/5/13/32
    supplyNeeded: function (level) { return [0, 1, 2, 5, 13, 32][level] || 1; },
    // 升级按路径消耗训练手册：Lv1→2=100, 2→3=200, 3→4=400, 4→5=800
    manualNeeded: function (level) { return [0, 100, 200, 400, 800][level] || 100; },
  };
})();

window.ITEM_DEFS = {
  supply:    { key: 'supply',    name: '体力补给包', icon: '🧃', price: 10,    unit: 'USDC', desc: '补满角色体力' },
  manual:    { key: 'manual',    name: '训练手册',   icon: '📘', price: 0.1,  unit: 'USDC', desc: '升级角色' },
  clawWeek:  { key: 'clawWeek',  name: 'Story Claw 周卡',  icon: '🐾', price: 800,  unit: 'STORY', desc: '7 天自动运营' },
  clawMonth: { key: 'clawMonth', name: 'Story Claw 月卡',  icon: '🐾', price: 3000, unit: 'STORY', desc: '30 天自动运营' },
};
