/* ============================================================
   Story.fun 商城公共弹窗组件（shop.js）
   自包含样式（不依赖页面 .modal-overlay/.modal-card），任何页面可调用
   window.openShop() 打开；商品列表（道具/订阅分区）+ 独立购买弹窗
   购买/开通/续费均弹出独立弹窗确认，不在商城弹窗底部内嵌购买
   视觉：极简白 · 大留白 · 细字重标题 · 克制圆角与阴影
   ============================================================ */
window.Shop = (function () {
  var pendingKey = null;

  var ITEMS = [
    { key: 'supply', name: '体力补给包', icon: '🧃', price: 10, unit: 'USDC', tile: '#FFF3E2',
      desc: '补满角色体力至 168h，按角色等级消耗。' },
    { key: 'manual', name: '训练手册', icon: '📘', price: 0.1, unit: 'USDC', tile: '#EDF2FF',
      desc: '角色升级材料，升级时按角色等级消耗。' },
    { key: 'clawWeek', name: 'Story Claw 周卡', icon: '🐾', price: 800, unit: 'STORY', tile: '#EAF6EF', claw: 'week',
      desc: '购买后立即生效，7 天自动运营：自动补体力、体力耗尽自动休息、自动安排最优演出。<br>期间所有角色产出 +5%。' },
    { key: 'clawMonth', name: 'Story Claw 月卡', icon: '🐾', price: 3000, unit: 'STORY', tile: '#EAF6EF', claw: 'month',
      desc: '同周卡，有效期 30 天。<br>续费延长有效期，产出加成不叠加。' },
  ];

  function findItem(key) {
    for (var i = 0; i < ITEMS.length; i++) if (ITEMS[i].key === key) return ITEMS[i];
    return { key: key, name: key, icon: '📦', price: 0, unit: '', tile: '#F2F2F5' };
  }

  // ---- 全局样式（keyframes + 悬浮态）----
  function injectStyles() {
    if (document.getElementById('sfShopStyles')) return;
    var s = document.createElement('style');
    s.id = 'sfShopStyles';
    s.textContent = [
      '@keyframes sfPop{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}',
      '.sf-card{transition:border-color .2s,box-shadow .2s,transform .2s}',
      '.sf-card:hover{border-color:#d6d6de;box-shadow:0 4px 18px rgba(0,0,0,.06);transform:translateY(-1px)}',
      '.sf-btn{transition:background .2s,box-shadow .2s,transform .15s}',
      '.sf-btn:hover{background:#000;box-shadow:0 2px 10px rgba(0,0,0,.22)}',
      '.sf-btn:active{transform:scale(.97)}',
      '.sf-ghost{transition:background .2s}',
      '.sf-ghost:hover{background:#f6f6f8}',
      '.sf-close{transition:background .2s}',
      '.sf-close:hover{background:rgba(0,0,0,.08)}',
      '.sf-qty-btn{transition:background .2s}',
      '.sf-qty-btn:hover{background:#f6f6f8}',
      'input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}',
    ].join('');
    document.head.appendChild(s);
  }

  // ---- 商城弹窗（商品列表）----
  function mount() {
    if (document.getElementById('shopModal')) return;
    injectStyles();
    var d = document.createElement('div');
    d.id = 'shopModal';
    d.style.cssText = 'position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(15,23,42,0.5);backdrop-filter:blur(8px);';
    d.innerHTML =
      '<div style="background:#fff;border-radius:20px;max-width:440px;width:calc(100% - 32px);max-height:82vh;overflow-y:auto;padding:24px 20px 20px;position:relative;box-shadow:0 24px 64px rgba(0,0,0,.18);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang SC","Segoe UI",Roboto,sans-serif;animation:sfPop .2s ease;">' +
      '<div style="font-size:18px;font-weight:650;color:#1d1d1f;letter-spacing:-.01em;margin:0 0 4px;">商城</div>' +
      '<button onclick="Shop.close()" class="sf-close" style="position:absolute;top:18px;right:18px;width:28px;height:28px;border-radius:50%;border:none;background:rgba(0,0,0,0.04);cursor:pointer;display:grid;place-items:center;font-size:0.95rem;color:#86868b;line-height:1;">✕</button>' +
      '<div id="shopList"></div>' +
      '</div>';
    document.body.appendChild(d);
    d.addEventListener('click', function (e) { if (e.target === d) close(); });
  }

  // ---- 独立购买弹窗（盖在商城之上）----
  function mountBuy() {
    if (document.getElementById('shopBuyModal')) return;
    injectStyles();
    var d = document.createElement('div');
    d.id = 'shopBuyModal';
    d.style.cssText = 'position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;background:rgba(15,23,42,0.5);backdrop-filter:blur(8px);';
    d.innerHTML =
      '<div style="background:#fff;border-radius:20px;max-width:360px;width:calc(100% - 32px);padding:24px 22px 20px;position:relative;box-shadow:0 24px 64px rgba(0,0,0,.18);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang SC","Segoe UI",Roboto,sans-serif;animation:sfPop .2s ease;">' +
      '<button onclick="Shop.closeBuyModal()" class="sf-close" style="position:absolute;top:16px;right:16px;width:28px;height:28px;border-radius:50%;border:none;background:rgba(0,0,0,0.04);cursor:pointer;display:grid;place-items:center;font-size:0.95rem;color:#86868b;line-height:1;">✕</button>' +
      '<div id="shopBuyIcon" style="width:56px;height:56px;border-radius:16px;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:26px;"></div>' +
      '<div id="shopBuyTitle" style="font-size:16px;font-weight:650;color:#1d1d1f;text-align:center;letter-spacing:-.01em;margin:0 0 8px;"></div>' +
      '<div id="shopBuyDesc" style="font-size:12.5px;color:#6e6e73;line-height:1.7;text-align:center;margin-bottom:16px;"></div>' +
      '<div id="shopBuyQtyRow" style="display:flex;align-items:center;justify-content:center;margin-bottom:14px;">' +
      '<button onclick="Shop.stepBuy(-1)" class="sf-qty-btn" style="width:38px;height:38px;border:1px solid #e4e4ea;border-right:none;border-radius:12px 0 0 12px;background:#fff;cursor:pointer;font-size:1.05rem;color:#1d1d1f;">−</button>' +
      '<input id="shopBuyQty" type="number" min="1" value="1" style="width:56px;height:38px;text-align:center;border:1px solid #e4e4ea;background:#fff;font-size:15px;font-weight:600;color:#1d1d1f;outline:none;">' +
      '<button onclick="Shop.stepBuy(1)" class="sf-qty-btn" style="width:38px;height:38px;border:1px solid #e4e4ea;border-left:none;border-radius:0 12px 12px 0;background:#fff;cursor:pointer;font-size:1.05rem;color:#1d1d1f;">+</button>' +
      '</div>' +
      '<div id="shopBuyStatus" style="font-size:12px;color:#86868b;text-align:center;margin-bottom:8px;"></div>' +
      '<div id="shopBuyTotal" style="font-size:18px;font-weight:700;color:#1d1d1f;text-align:center;letter-spacing:-.01em;margin-bottom:18px;"></div>' +
      '<div style="display:flex;gap:10px;">' +
      '<button id="shopBuyConfirm" onclick="Shop.confirmBuy()" class="sf-btn" style="flex:1;height:44px;border:none;border-radius:12px;background:#1d1d1f;color:#fff;font-size:15px;font-weight:600;cursor:pointer;">购买</button>' +
      '<button onclick="Shop.closeBuyModal()" class="sf-ghost" style="flex:1;height:44px;border:1px solid #e4e4ea;border-radius:12px;background:#fff;color:#6e6e73;font-size:15px;font-weight:600;cursor:pointer;">取消</button>' +
      '</div>' +
      '</div>';
    document.body.appendChild(d);
    d.addEventListener('click', function (e) { if (e.target === d) closeBuyModal(); });
  }

  function open() {
    mount();
    closeBuyModal();
    render();
    document.getElementById('shopModal').style.display = 'flex';
  }
  function close() {
    closeBuyModal();
    var m = document.getElementById('shopModal');
    if (m) m.style.display = 'none';
  }

  // 状态胶囊
  function chipHtml(it, cs, isActive) {
    var base = 'display:inline-flex;align-items:center;gap:5px;padding:2px 9px;border-radius:999px;font-size:11px;font-weight:500;line-height:1.6;';
    if (it.claw) {
      if (isActive) {
        return '<span style="' + base + 'background:rgba(208,48,80,.08);color:#c02b4a;font-weight:600;"><span style="width:5px;height:5px;border-radius:50%;background:#c02b4a;"></span>激活中 · 剩 ' + Math.ceil(cs.remainMs / 86400000) + ' 天</span>';
      }
      return '<span style="' + base + 'background:#f2f2f5;color:#86868b;">未激活</span>';
    }
    return '<span style="' + base + 'background:#f2f2f5;color:#6e6e73;">持有 ' + ItemStore.count(it.key) + '</span>';
  }

  function cardHtml() {
    var html = '';
    var lastGroup = null;
    ITEMS.forEach(function (it) {
      var group = it.claw ? '订阅' : '道具';
      if (group !== lastGroup) {
        html += '<div style="font-size:11px;font-weight:600;letter-spacing:.08em;color:#86868b;margin:' + (lastGroup ? '20px 2px 10px' : '8px 2px 10px') + ';">' + group + '</div>';
        lastGroup = group;
      }
      var cs = it.claw ? ItemStore.clawState() : null;
      var isActive = !!cs;
      var btnText = it.claw ? (isActive ? '续费' : '开通') : '购买';
      html += '<div class="sf-card" onclick="Shop.openBuyModal(\'' + it.key + '\')" style="display:flex;align-items:center;gap:14px;padding:14px;border:1px solid #ececf1;border-radius:16px;margin-bottom:10px;background:#fff;cursor:pointer;">'
        + '<span style="width:46px;height:46px;border-radius:14px;background:' + it.tile + ';display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">' + it.icon + '</span>'
        + '<div style="flex:1;min-width:0;">'
        + '<div style="font-size:15px;font-weight:650;color:#1d1d1f;letter-spacing:-.01em;">' + it.name + '</div>'
        + '<div style="font-size:12px;color:#6e6e73;line-height:1.55;margin-top:3px;">' + it.desc + '</div>'
        + '</div>'
        + '<div style="text-align:right;flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:6px;">'
        + '<div><span style="font-size:15px;font-weight:750;color:#1d1d1f;letter-spacing:-.01em;">' + it.price + '</span> <span style="font-size:11px;color:#86868b;">' + it.unit + '</span></div>'
        + chipHtml(it, cs, isActive)
        + '</div>'
        + '<button onclick="event.stopPropagation();Shop.openBuyModal(\'' + it.key + '\')" class="sf-btn" style="flex-shrink:0;padding:8px 16px;border-radius:10px;border:none;background:#1d1d1f;color:#fff;font-size:13px;font-weight:600;cursor:pointer;">' + btnText + '</button>'
        + '</div>';
    });
    return html;
  }

  function render() {
    document.getElementById('shopList').innerHTML = cardHtml();
  }

  // ---- 购买弹窗：打开（按商品类型填充）----
  function openBuyModal(key) {
    mountBuy();
    pendingKey = key;
    var it = findItem(key);
    var cs = it.claw ? ItemStore.clawState() : null;
    var isActive = !!cs;
    document.getElementById('shopBuyIcon').style.background = it.tile;
    document.getElementById('shopBuyIcon').textContent = it.icon;
    document.getElementById('shopBuyTitle').textContent = it.name;
    document.getElementById('shopBuyDesc').innerHTML = it.desc;
    var qtyRow = document.getElementById('shopBuyQtyRow');
    var status = document.getElementById('shopBuyStatus');
    var total = document.getElementById('shopBuyTotal');
    var confirmBtn = document.getElementById('shopBuyConfirm');
    if (it.claw) {
      var days = it.claw === 'week' ? 7 : 30;
      qtyRow.style.display = 'none';
      status.style.color = isActive ? '#c02b4a' : '#86868b';
      status.textContent = isActive ? '激活中 · 剩 ' + Math.ceil(cs.remainMs / 86400000) + ' 天' : '当前未激活';
      total.innerHTML = '<div>' + it.price + ' ' + it.unit + '</div>'
        + '<div style="font-size:12px;color:#86868b;font-weight:500;margin-top:2px;">' + (isActive ? '续费延长 ' + days + ' 天' : '开通后 ' + days + ' 天生效') + '</div>';
      confirmBtn.textContent = isActive ? '续费' : '开通';
    } else {
      qtyRow.style.display = 'flex';
      document.getElementById('shopBuyQty').value = 1;
      status.style.color = '#86868b';
      status.textContent = '单价 ' + it.price + ' ' + it.unit + '/个';
      refreshBuyTotal();
      confirmBtn.textContent = '购买';
    }
    document.getElementById('shopBuyModal').style.display = 'flex';
  }
  function closeBuyModal() {
    pendingKey = null;
    var m = document.getElementById('shopBuyModal');
    if (m) m.style.display = 'none';
  }
  function stepBuy(delta) {
    var el = document.getElementById('shopBuyQty');
    el.value = Math.max(1, (parseInt(el.value, 10) || 1) + delta);
    refreshBuyTotal();
  }
  function refreshBuyTotal() {
    if (!pendingKey) return;
    var it = findItem(pendingKey);
    if (it.claw) return;
    var n = Math.max(1, parseInt(document.getElementById('shopBuyQty').value, 10) || 1);
    document.getElementById('shopBuyTotal').textContent = '合计 ' + (it.price * n) + ' ' + it.unit;
  }
  function confirmBuy() {
    if (!pendingKey) return;
    var it = findItem(pendingKey);
    if (it.claw) {
      // Claw：购买即生效（订阅模式），重复续费延长有效期
      var wasActive = !!ItemStore.clawState();
      ItemStore.activateClaw(it.claw);
      var days = it.claw === 'week' ? 7 : 30;
      closeBuyModal();
      render();
      toast(wasActive ? it.name + ' 已续费，延长 ' + days + ' 天' : 'Story Claw 已开通（' + days + ' 天）');
    } else {
      var n = Math.max(1, parseInt(document.getElementById('shopBuyQty').value, 10) || 1);
      ItemStore.buy(pendingKey, n);
      closeBuyModal();
      render();
      toast('已购买 ' + n + ' 个' + it.name);
    }
  }

  function toast(msg) {
    var t = document.getElementById('shopToast');
    if (!t) {
      t = document.createElement('div'); t.id = 'shopToast';
      t.style.cssText = 'position:fixed;top:72px;left:50%;transform:translateX(-50%);z-index:100001;background:rgba(0,0,0,.85);color:#fff;padding:10px 18px;border-radius:999px;font-size:.85rem;opacity:0;transition:opacity .25s;pointer-events:none;white-space:nowrap;';
      document.body.appendChild(t);
    }
    t.textContent = msg; t.style.opacity = '1';
    clearTimeout(t._t); t._t = setTimeout(function () { t.style.opacity = '0'; }, 2200);
  }

  return { open: open, close: close, openBuyModal: openBuyModal, closeBuyModal: closeBuyModal, stepBuy: stepBuy, confirmBuy: confirmBuy };
})();
window.openShop = function () { window.Shop.open(); };
