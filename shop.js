/* ============================================================
   Story.fun 商城公共弹窗组件（shop.js）
   自包含样式（不依赖页面 .modal-overlay/.modal-card），任何页面可调用
   window.openShop() 打开；道具描述 + 内嵌数量选择 + 模拟购买
   ============================================================ */
window.Shop = (function () {
  var pendingKey = null;

  function mount() {
    if (document.getElementById('shopModal')) return;
    var d = document.createElement('div');
    d.id = 'shopModal';
    d.style.cssText = 'position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(15,23,42,0.45);backdrop-filter:blur(4px);';
    d.innerHTML =
      '<div style="background:#fff;border-radius:16px;max-width:460px;width:calc(100% - 32px);max-height:82vh;overflow-y:auto;padding:22px 20px 18px;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.25);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;">' +
      '<div style="font-size:1rem;font-weight:800;color:#13202e;margin:0 0 14px;">🛒 商城</div>' +
      '<button onclick="Shop.close()" style="position:absolute;top:14px;right:14px;width:32px;height:32px;border-radius:50%;border:none;background:rgba(0,0,0,0.05);cursor:pointer;display:grid;place-items:center;font-size:1.1rem;color:#667;line-height:1;">✕</button>' +
      '<div id="shopList"></div>' +
      '<div id="shopBuyPanel" style="display:none;margin-top:14px;padding:14px;border:1px dashed #d5d9e0;border-radius:12px;background:#f7f8fa;">' +
      '<div id="shopBuyTitle" style="font-size:0.9rem;font-weight:700;color:#13202e;margin-bottom:10px;"></div>' +
      '<div style="display:flex;align-items:center;gap:8px;justify-content:center;">' +
      '<button onclick="Shop.step(-1)" style="width:32px;height:32px;border-radius:8px;border:1px solid #d5d9e0;background:#fff;cursor:pointer;font-size:1.05rem;color:#13202e;">−</button>' +
      '<input id="shopQty" type="number" min="1" value="1" style="width:68px;text-align:center;border:1px solid #d5d9e0;border-radius:8px;padding:5px;font-size:0.95rem;color:#13202e;">' +
      '<button onclick="Shop.step(1)" style="width:32px;height:32px;border-radius:8px;border:1px solid #d5d9e0;background:#fff;cursor:pointer;font-size:1.05rem;color:#13202e;">+</button>' +
      '</div>' +
      '<div id="shopTotal" style="font-size:0.85rem;color:#667;text-align:center;margin-top:8px;"></div>' +
      '<div style="margin-top:10px;display:flex;gap:8px;justify-content:center;">' +
      '<button onclick="Shop.confirm()" style="flex:1;padding:9px 0;border:none;border-radius:999px;background:#13202e;color:#fff;font-size:0.9rem;font-weight:600;cursor:pointer;">购买</button>' +
      '<button onclick="Shop.closeBuy()" style="flex:1;padding:9px 0;border:1px solid #d5d9e0;border-radius:999px;background:#fff;color:#667;font-size:0.9rem;font-weight:600;cursor:pointer;">取消</button>' +
      '</div>' +
      '</div>' +
      '</div>';
    document.body.appendChild(d);
    d.addEventListener('click', function (e) { if (e.target === d) close(); });
  }

  function open() {
    mount();
    closeBuy();
    render();
    document.getElementById('shopModal').style.display = 'flex';
  }
  function close() {
    var m = document.getElementById('shopModal');
    if (m) m.style.display = 'none';
  }

  function cardHtml() {
    var items = [
      { key: 'supply', name: '体力补给包', icon: '🧃', price: 10, unit: 'USDC',
        desc: '补满角色体力至 168h。<br>按角色等级消耗：Lv1-5 分别 1 / 2 / 5 / 13 / 32 个。' },
      { key: 'manual', name: '训练手册', icon: '📘', price: 0.1, unit: 'USDC',
        desc: '角色升级材料。<br>升级消耗：Lv1→5 分别 100 / 200 / 400 / 800 本。' },
      { key: 'clawWeek', name: 'Story Claw 周卡', icon: '🐾', price: 800, unit: 'STORY', claw: 'week',
        desc: '购买后立即生效，7 天自动运营：自动补体力、体力耗尽自动休息、自动安排最优演出。<br>期间所有角色产出 +5%。' },
      { key: 'clawMonth', name: 'Story Claw 月卡', icon: '🐾', price: 3000, unit: 'STORY', claw: 'month',
        desc: '同周卡，有效期 30 天。<br>续费延长有效期，产出加成不叠加。' },
    ];
    var html = '';
    items.forEach(function (it) {
      var cs = it.claw ? ItemStore.clawState() : null;
      var isActive = !!cs;
      var statusHtml = it.claw
        ? (isActive ? '激活中 · 剩 ' + Math.ceil(cs.remainMs / 86400000) + ' 天' : '未激活')
        : ('我有 ' + ItemStore.count(it.key));
      var btnHtml = it.claw
        ? '<button onclick="Shop.buyClaw(\'' + it.claw + '\')" style="flex-shrink:0;padding:5px 14px;border-radius:8px;border:none;background:#13202e;color:#fff;font-size:0.8rem;cursor:pointer;">' + (isActive ? '续费' : '开通') + '</button>'
        : '<button onclick="Shop.openBuy(\'' + it.key + '\')" style="flex-shrink:0;padding:5px 14px;border-radius:8px;border:none;background:#13202e;color:#fff;font-size:0.8rem;cursor:pointer;">购买</button>';
      html += '<div style="display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border:1px solid #e5e8ee;border-radius:12px;margin-bottom:10px;background:#fff;">'
        + '<span style="font-size:1.4rem;line-height:1;">' + it.icon + '</span>'
        + '<div style="flex:1;min-width:0;">'
        + '<div style="font-size:0.92rem;font-weight:700;color:#13202e;">' + it.name + '</div>'
        + '<div style="font-size:0.76rem;color:#667;line-height:1.6;margin-top:3px;">' + it.desc + '</div>'
        + '</div>'
        + '<div style="text-align:right;flex-shrink:0;">'
        + '<div style="font-size:0.8rem;font-weight:800;color:#d03050;">' + it.price + ' ' + it.unit + '</div>'
        + '<div style="font-size:0.7rem;color:#99a;margin-top:2px;">' + statusHtml + '</div>'
        + '</div>'
        + btnHtml
        + '</div>';
    });
    return html;
  }

  function render() {
    document.getElementById('shopList').innerHTML = cardHtml();
  }

  function openBuy(key) {
    pendingKey = key;
    var it = findItem(key);
    document.getElementById('shopQty').value = 1;
    document.getElementById('shopBuyTitle').textContent = it.icon + ' ' + it.name + ' · ' + it.price + ' ' + it.unit + '/个';
    refreshTotal();
    document.getElementById('shopBuyPanel').style.display = 'block';
  }
  function closeBuy() {
    pendingKey = null;
    var p = document.getElementById('shopBuyPanel');
    if (p) p.style.display = 'none';
  }
  function step(delta) {
    var el = document.getElementById('shopQty');
    el.value = Math.max(1, (parseInt(el.value, 10) || 1) + delta);
    refreshTotal();
  }
  function refreshTotal() {
    if (!pendingKey) return;
    var it = findItem(pendingKey);
    var n = Math.max(1, parseInt(document.getElementById('shopQty').value, 10) || 1);
    document.getElementById('shopTotal').textContent = '合计 ' + (it.price * n) + ' ' + it.unit;
  }
  function confirm() {
    if (!pendingKey) return;
    var it = findItem(pendingKey);
    var n = Math.max(1, parseInt(document.getElementById('shopQty').value, 10) || 1);
    ItemStore.buy(pendingKey, n);
    closeBuy();
    render();
    toast('已购买 ' + n + ' 个' + it.name);
  }

  // Claw 周卡/月卡：购买即生效（订阅模式），无需库存与二次确认
  function buyClaw(kind) {
    var it = findItem(kind === 'week' ? 'clawWeek' : 'clawMonth');
    var wasActive = !!ItemStore.clawState();
    ItemStore.activateClaw(kind);
    render();
    var days = kind === 'week' ? 7 : 30;
    toast(wasActive ? it.name + ' 已续费，延长 ' + days + ' 天' : 'Story Claw 已开通（' + days + ' 天）');
  }

  function findItem(key) {
    var map = {
      supply: { name: '体力补给包', icon: '🧃', price: 10, unit: 'USDC' },
      manual: { name: '训练手册', icon: '📘', price: 0.1, unit: 'USDC' },
      clawWeek: { name: 'Story Claw 周卡', icon: '🐾', price: 800, unit: 'STORY' },
      clawMonth: { name: 'Story Claw 月卡', icon: '🐾', price: 3000, unit: 'STORY' },
    };
    return map[key] || { name: key, icon: '📦', price: 0, unit: '' };
  }

  function toast(msg) {
    var t = document.getElementById('shopToast');
    if (!t) {
      t = document.createElement('div'); t.id = 'shopToast';
      t.style.cssText = 'position:fixed;top:72px;left:50%;transform:translateX(-50%);z-index:99999;background:rgba(0,0,0,.85);color:#fff;padding:10px 18px;border-radius:999px;font-size:.85rem;opacity:0;transition:opacity .25s;pointer-events:none;white-space:nowrap;';
      document.body.appendChild(t);
    }
    t.textContent = msg; t.style.opacity = '1';
    clearTimeout(t._t); t._t = setTimeout(function () { t.style.opacity = '0'; }, 2200);
  }

  return { open: open, close: close, openBuy: openBuy, closeBuy: closeBuy, step: step, confirm: confirm, buyClaw: buyClaw };
})();
window.openShop = function () { window.Shop.open(); };
