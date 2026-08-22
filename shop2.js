/* ============================================================
   Story.fun 购买组件（shop.js）
   自包含样式（不依赖页面 .modal-overlay/.modal-card），任何页面可调用
   场景直达购买，无商品列表页：
   - 商店（🛒 入口）：4 件商品快捷行（无描述，直达对应弹窗）
   - 数量购买弹窗：补给包 / 训练手册（数量 + 合计）
   - 订阅弹窗：Story Claw 周卡 / 月卡权益计划卡（上下对比）
   - 订阅确认弹窗：开通 / 续费二次确认
   ============================================================ */
window.Shop = (function () {
  var pendingKey = null;      // 数量购买弹窗当前商品

  var ITEMS = [
    { key: 'supply', name: '体力补给包', icon: '🧃', price: 10, unit: 'USDC', tile: '#FFF3E2',
      desc: '补满角色体力，按角色等级消耗。' },
    { key: 'manual', name: '训练手册', icon: '📘', price: 10, unit: 'USDC', tile: '#EDF2FF',
      desc: '角色升级材料，升级时按角色等级消耗。' },
    { key: 'clawWeek', name: 'Story Claw 周卡', icon: '🐾', price: 800, unit: 'STORY', tile: '#EAF6EF', claw: 'week', days: 7,
      benefits: ['自动使用体力包进行补充', '无体力包时自动休息', '自动安排最优演出', '产出STORY +5%'] },
    { key: 'clawMonth', name: 'Story Claw 月卡', icon: '🐾', price: 3000, unit: 'STORY', tile: '#EAF6EF', claw: 'month', days: 30,
      benefits: ['自动使用体力包进行补充', '无体力包时自动休息', '自动安排最优演出', '产出STORY +5%'] },
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
      '@keyframes sfPop{from{opacity:0}to{opacity:1}}',
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

  var FONT = "-apple-system,BlinkMacSystemFont,'SF Pro Text','PingFang SC','Segoe UI',Roboto,sans-serif";
  var OVERLAY = 'position:fixed;inset:0;display:none;background:rgba(15,23,42,0.5);backdrop-filter:blur(8px);';
  var CARD = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#fff;border-radius:20px;padding:24px 20px 20px;box-shadow:0 24px 64px rgba(0,0,0,.18);font-family:' + FONT + ';animation:sfPop .2s ease;';
  var CLOSE = 'position:absolute;top:16px;right:16px;width:28px;height:28px;border-radius:50%;border:none;background:rgba(0,0,0,0.04);cursor:pointer;display:grid;place-items:center;font-size:0.95rem;color:#86868b;line-height:1;';

  // ============================================================
  //  商店（轻量快捷入口，无描述）
  // ============================================================
  function mount() {
    if (document.getElementById('shopModal')) return;
    injectStyles();
    var d = document.createElement('div');
    d.id = 'shopModal';
    d.style.cssText = 'position:fixed;inset:0;display:none;background:transparent;';
    d.innerHTML = '<div style="' + CARD + 'width:360px;max-width:calc(100% - 32px);flex-shrink:0;">'
      + '<div style="font-size:18px;font-weight:650;color:#1d1d1f;letter-spacing:-.01em;margin:0 0 14px;">商店</div>'
      + '<button onclick="Shop.close()" class="sf-close" style="' + CLOSE + '">✕</button>'
      + '<div id="shopList"></div>'
      + '</div>';
    document.body.appendChild(d);
    d.addEventListener('click', function (e) { if (e.target === d) close(); });
  }

  function centerRow(it) {
    var cs = it.claw ? ItemStore.clawState() : null;
    var isActive = !!cs;
    var btnText = it.claw ? (isActive ? '续费' : '开通') : '购买';
    var act = it.claw ? "Shop.openSub()" : "Shop.openBuyModal('" + it.key + "')";
    return '<div class="sf-card" onclick="' + act + '" style="display:flex;align-items:center;gap:12px;padding:10px 12px;border:1px solid #ececf1;border-radius:14px;margin-bottom:8px;background:#fff;cursor:pointer;">'
      + '<span style="width:36px;height:36px;border-radius:11px;background:' + it.tile + ';display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">' + it.icon + '</span>'
      + '<span style="flex:1;font-size:14px;font-weight:600;color:#1d1d1f;">' + it.name + '</span>'
      + '<span style="font-size:13px;font-weight:700;color:#1d1d1f;letter-spacing:-.01em;">' + it.price + ' <span style="font-size:10px;color:#86868b;font-weight:500;">' + it.unit + '</span></span>'
      + '<button onclick="event.stopPropagation();' + act + '" class="sf-btn" style="flex-shrink:0;padding:7px 14px;border-radius:9px;border:none;background:#1d1d1f;color:#fff;font-size:12px;font-weight:600;cursor:pointer;">' + btnText + '</button>'
      + '</div>';
  }

  function renderCenter() {
    var html = '';
    ITEMS.forEach(function (it) { html += centerRow(it); });
    // 桌面端 header 下拉（#dhShopList）与移动端卡片（#shopList）各自存在才填充
    ['shopList', 'dhShopList'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  }

  function open() {
    mount();
    closeBuyModal();
    closeSub();
    renderCenter();
    document.getElementById('shopModal').style.display = 'block';
  }
  function close() {
    closeBuyModal();
    closeSub();
    var m = document.getElementById('shopModal');
    if (m) m.style.display = 'none';
  }

  // ============================================================
  //  数量购买弹窗（补给包 / 训练手册）
  // ============================================================
  function mountBuy() {
    if (document.getElementById('shopBuyModal')) return;
    injectStyles();
    var d = document.createElement('div');
    d.id = 'shopBuyModal';
    d.style.cssText = OVERLAY + 'z-index:100000;';
    d.innerHTML = '<div style="' + CARD + 'width:340px;max-width:calc(100% - 32px);flex-shrink:0;">'
      + '<button onclick="Shop.closeBuyModal()" class="sf-close" style="' + CLOSE + '">✕</button>'
      + '<div id="shopBuyIcon" style="width:52px;height:52px;border-radius:15px;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:24px;"></div>'
      + '<div id="shopBuyTitle" style="font-size:16px;font-weight:650;color:#1d1d1f;text-align:center;letter-spacing:-.01em;margin:0 0 8px;"></div>'
      + '<div id="shopBuyDesc" style="font-size:12.5px;color:#6e6e73;line-height:1.7;text-align:center;margin-bottom:16px;"></div>'
      + '<div id="shopBuyQtyRow" style="display:flex;align-items:center;justify-content:center;margin-bottom:14px;">'
      + '<button onclick="Shop.stepBuy(-1)" class="sf-qty-btn" style="width:38px;height:38px;border:1px solid #e4e4ea;border-right:none;border-radius:12px 0 0 12px;background:#fff;cursor:pointer;font-size:1.05rem;color:#1d1d1f;">−</button>'
      + '<input id="shopBuyQty" type="number" min="1" value="1" style="width:56px;height:38px;text-align:center;border:1px solid #e4e4ea;background:#fff;font-size:15px;font-weight:600;color:#1d1d1f;outline:none;">'
      + '<button onclick="Shop.stepBuy(1)" class="sf-qty-btn" style="width:38px;height:38px;border:1px solid #e4e4ea;border-left:none;border-radius:0 12px 12px 0;background:#fff;cursor:pointer;font-size:1.05rem;color:#1d1d1f;">+</button>'
      + '</div>'
      + '<div id="shopBuyStatus" style="font-size:12px;color:#86868b;text-align:center;margin-bottom:8px;"></div>'
      + '<div id="shopBuyTotal" style="font-size:18px;font-weight:700;color:#1d1d1f;text-align:center;letter-spacing:-.01em;margin-bottom:18px;"></div>'
      + '<div style="display:flex;gap:10px;">'
      + '<button id="shopBuyConfirm" onclick="Shop.confirmBuy()" class="sf-btn" style="flex:1;height:44px;border:none;border-radius:12px;background:#1d1d1f;color:#fff;font-size:15px;font-weight:600;cursor:pointer;">购买</button>'
      + '<button onclick="Shop.closeBuyModal()" class="sf-ghost" style="flex:1;height:44px;border:1px solid #e4e4ea;border-radius:12px;background:#fff;color:#6e6e73;font-size:15px;font-weight:600;cursor:pointer;">取消</button>'
      + '</div>'
      + '</div>';
    document.body.appendChild(d);
    d.addEventListener('click', function (e) { if (e.target === d) closeBuyModal(); });
  }

  function openBuyModal(key) {
    var it = findItem(key);
    if (it.claw) { openSub(); return; } // 订阅卡走订阅弹窗
    mountBuy();
    pendingKey = key;
    document.getElementById('shopBuyIcon').style.background = it.tile;
    document.getElementById('shopBuyIcon').textContent = it.icon;
    document.getElementById('shopBuyTitle').textContent = it.name;
    document.getElementById('shopBuyDesc').innerHTML = it.desc;
    document.getElementById('shopBuyQtyRow').style.display = 'flex';
    document.getElementById('shopBuyQty').value = 1;
    document.getElementById('shopBuyStatus').textContent = '单价 ' + it.price + ' ' + it.unit;
    refreshBuyTotal();
    document.getElementById('shopBuyConfirm').textContent = '购买';
    document.getElementById('shopBuyModal').style.display = 'block';
  }
  function closeBuyModal() {
    pendingKey = null;
    var m = document.getElementById('shopBuyModal');
    if (m) m.style.display = 'none';
  }
  function stepBuy(delta) {
    var el = document.getElementById('shopBuyQty');
    var v = parseInt(el.value, 10) || 1;
    el.value = Math.max(1, v + delta); // 补给包/手册均 ±1
    refreshBuyTotal();
  }
  function refreshBuyTotal() {
    if (!pendingKey) return;
    var it = findItem(pendingKey);
    var n = Math.max(1, parseInt(document.getElementById('shopBuyQty').value, 10) || 1);
    document.getElementById('shopBuyTotal').textContent = '合计 ' + (it.price * n) + ' ' + it.unit;
  }
  function confirmBuy() {
    if (!pendingKey) return;
    var it = findItem(pendingKey);
    var n = Math.max(1, parseInt(document.getElementById('shopBuyQty').value, 10) || 1);
    ItemStore.buy(pendingKey, n);
    closeBuyModal();
    renderCenter();
    toast('购买成功，已放入道具背包（经纪人页面）');
    try { document.dispatchEvent(new CustomEvent('sf:items-changed', { detail: { n: n } })); } catch (e) {}
  }

  // ============================================================
  //  订阅弹窗（顶部选卡 → 权益 → 底部一键开通/续费）
  // ============================================================
  var subKind = 'week'; // 当前选中卡种（week / month）

  function mountSub() {
    if (document.getElementById('shopSubModal')) return;
    injectStyles();
    var d = document.createElement('div');
    d.id = 'shopSubModal';
    d.style.cssText = OVERLAY + 'z-index:100000;';
    d.innerHTML = '<div style="' + CARD + 'width:460px;max-width:calc(100% - 32px);flex-shrink:0;padding:28px 24px 24px;">'
      + '<div style="font-size:20px;font-weight:650;color:#1d1d1f;letter-spacing:-.01em;margin:0 0 6px;">Story Claw 订阅</div>'
      + '<div style="font-size:13px;color:#86868b;margin:0 0 14px;">购买即生效 · 续费延长有效期</div>'
      + '<button onclick="Shop.closeSub()" class="sf-close" style="' + CLOSE + '">✕</button>'
      + '<div id="shopSubStatus" style="display:none;margin:0 0 14px;"></div>'
      + '<div id="shopSubCards" style="display:flex;gap:12px;margin-bottom:20px;"></div>'
      + '<div style="font-size:12px;font-weight:600;letter-spacing:.08em;color:#86868b;margin:0 2px 10px;">权益</div>'
      + '<div id="shopSubBenefits" style="background:#F8F8FA;border-radius:16px;padding:16px 18px;margin-bottom:20px;"></div>'
      + '<button id="shopSubBtn" onclick="Shop.confirmSub()" class="sf-btn" style="width:100%;height:48px;border:none;border-radius:13px;background:#1d1d1f;color:#fff;font-size:16px;font-weight:600;cursor:pointer;">确认开通</button>'
      + '</div>';
    document.body.appendChild(d);
    d.addEventListener('click', function (e) { if (e.target === d) closeSub(); });
  }

  // 顶部选卡大卡片（图标 + 时间 + 大字费用）
  function subCard(it) {
    var sel = subKind === it.claw;
    var short = it.claw === 'week' ? '周卡' : '月卡';
    return '<div class="sf-card" onclick="Shop.selectSub(\'' + it.claw + '\')" style="flex:1;padding:18px 12px 16px;border:1.5px solid ' + (sel ? '#2E9E6B' : '#ececf1') + ';border-radius:16px;background:' + (sel ? '#F4FBF6' : '#fff') + ';cursor:pointer;text-align:center;">'
      + '<span style="width:44px;height:44px;border-radius:14px;background:' + it.tile + ';display:inline-flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:10px;">' + it.icon + '</span>'
      + '<div style="font-size:15px;font-weight:650;color:#1d1d1f;">' + short + '</div>'
      + '<div style="font-size:12px;font-weight:600;color:' + (sel ? '#2E9E6B' : '#86868b') + ';margin-top:3px;">' + it.days + ' 天</div>'
      + '<div style="font-size:24px;font-weight:750;color:#1d1d1f;letter-spacing:-.01em;margin-top:10px;">' + it.price + '</div>'
      + '<div style="font-size:11px;color:#86868b;margin-top:2px;">' + it.unit + '</div>'
      + '</div>';
  }

  function renderSub() {
    document.getElementById('shopSubCards').innerHTML = subCard(findItem('clawWeek')) + subCard(findItem('clawMonth'));
    // 权益区：按当前选中卡种
    var it = findItem(subKind === 'week' ? 'clawWeek' : 'clawMonth');
    var benefits = '';
    it.benefits.forEach(function (b) {
      benefits += '<div style="display:flex;align-items:center;gap:10px;padding:6px 0;font-size:13.5px;color:#4a4a50;">'
        + '<span style="width:18px;height:18px;border-radius:50%;background:#EAF6EF;display:inline-flex;align-items:center;justify-content:center;color:#2E9E6B;font-size:11px;font-weight:800;flex-shrink:0;">✓</span>' + b + '</div>';
    });
    document.getElementById('shopSubBenefits').innerHTML = benefits;
    // 底部按钮 + 顶部状态
    var cs = ItemStore.clawState();
    var isActive = !!cs;
    document.getElementById('shopSubBtn').textContent = isActive ? '确认续费' : '确认开通';
    var st = document.getElementById('shopSubStatus');
    if (isActive) {
      st.style.display = 'block';
      st.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;line-height:1.6;background:rgba(208,48,80,.08);color:#c02b4a;"><span style="width:6px;height:6px;border-radius:50%;background:#c02b4a;"></span>激活中 · ' + ItemStore.formatExpiry(cs.expireAt) + ' 到期</span>';
    } else {
      st.style.display = 'none';
    }
  }

  function selectSub(kind) {
    if (subKind === kind) return;
    subKind = kind;
    renderSub();
  }

  function openSub() {
    mountSub();
    var cs = ItemStore.clawState();
    subKind = (cs && cs.kind) || 'week';
    renderSub();
    document.getElementById('shopSubModal').style.display = 'block';
  }
  function closeSub() {
    var m = document.getElementById('shopSubModal');
    if (m) m.style.display = 'none';
  }

  // 一键开通 / 续费（无二次确认）
  function confirmSub() {
    var it = findItem(subKind === 'week' ? 'clawWeek' : 'clawMonth');
    var wasActive = !!ItemStore.clawState();
    ItemStore.activateClaw(subKind);
    closeSub();
    if (document.getElementById('shopModal') && document.getElementById('shopModal').style.display === 'flex') renderCenter();
    // 通知宿主页面（studio 等）刷新 Claw 状态
    try { document.dispatchEvent(new CustomEvent('sf:claw-changed')); } catch (e) {}
    toast(wasActive ? it.name + ' 已续费，延长 ' + it.days + ' 天' : 'Story Claw 已开通（' + it.days + ' 天）');
  }

  function toast(msg) {
    var t = document.getElementById('shopToast');
    if (!t) {
      t = document.createElement('div'); t.id = 'shopToast';
      t.style.cssText = 'position:fixed;top:72px;left:50%;transform:translateX(-50%);z-index:100002;background:rgba(0,0,0,.85);color:#fff;padding:10px 18px;border-radius:999px;font-size:.85rem;opacity:0;transition:opacity .25s;pointer-events:none;white-space:nowrap;';
      document.body.appendChild(t);
    }
    t.textContent = msg; t.style.opacity = '1';
    clearTimeout(t._t); t._t = setTimeout(function () { t.style.opacity = '0'; }, 2200);
  }

  return {
    open: open, close: close, renderCenter: renderCenter,
    openBuyModal: openBuyModal, closeBuyModal: closeBuyModal, stepBuy: stepBuy, confirmBuy: confirmBuy,
    openSub: openSub, closeSub: closeSub, selectSub: selectSub, confirmSub: confirmSub,
  };
})();
window.openShop = function () { window.Shop.open(); };
