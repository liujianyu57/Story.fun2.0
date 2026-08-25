// ============================================================
//  Story.fun - 角色 IP 卡片公共组件 (actor-card.js)
//
//  功能：
//    1. 自动注入角色 IP 卡片完整 CSS（含三档响应式：桌面/平板/手机）
//    2. 提供发行标识徽章系统（官方/合作/认证/社区）
//    3. 提供角色头像与片酬数据库
//    4. 提供卡片渲染 API renderActorCard / renderActorCardList
//    5. 提供交互初始化 hooks（排序/签约弹窗/价格曲线/片酬弹窗等）
//
//  用法：
//    <script src="actor-card.js"></script>
//    <script>
//      var cards = renderActorCardList([...]);
//      document.getElementById('actorGrid').innerHTML = cards;
//      initActorCardInteractions();
//    </script>
//
//  卡片数据结构：
//    {
//      id: '1',                              // 角色 ID
//      name: 'Luna',                         // 角色名
//      avatar: 'https://...',                // 头像图
//      description: '未来偶像型AI角色...',    // 描述
//      issuanceType: 'official',             // 发行标识: official/partner/certified/community
//      pricing: 'curve',                     // 定价模式: curve/fixed
//      collection: 'C001',                   // 角色 IP 编号
//      total: 5000,                          // 总发行量
//      minted: 5000,                         // 已签约数
//      available: 0,                         // 剩余数（可选，自动计算为 total - minted）
//      holders: 4900,                        // 持有者数
//      price: '10 USDC',                     // 当前签约价（显示用）
//      initPrice: 30,                        // 初始价格（计算用数值）
//      creator: 'storyfun_labs',             // 发行者
//      views: '2.6万',                       // 完播数据
//      heat: 3.3,                            // 热度系数
//      bannerClass: 'banner-1'               // banner 渐变 class（可选）
//    }
// ============================================================

(function () {
  'use strict';

  // ============================================================
  //  样式注入（仅注入一次）
  // ============================================================
  function injectStyles() {
    if (document.getElementById('story-actor-card-styles')) return;

    var css = '\
/* ═══ Story.fun Actor Card (by actor-card.js) ═══ */\
\
/* ── 基础变量（如页面未定义则回退） ── */\
.actor-card-scope { --bg: #f7fbff; --surface: #ffffff; --accent: #000000; --accent-soft: rgba(0, 0, 0, 0.16); --text: #1a232f; --text-muted: #657586; --border: #e6eff7; font-family: "Segoe UI", Roboto, "PingFang SC", "Helvetica Neue", Arial, sans-serif; }\
.actor-card-scope * { box-sizing: border-box; }\
\
/* ═══ 卡片骨架 ═══ */\
.ac-grid { display: grid; gap: 20px; }\
.ac-grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }\
.ac-card {\
  background: var(--surface);\
  border: none;\
  border-radius: 24px;\
  overflow: hidden;\
  display: flex;\
  flex-direction: column;\
  box-shadow: 0 2px 12px rgba(27,45,71,0.06);\
  cursor: pointer;\
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);\
}\
.ac-card:hover {\
  transform: translateY(-4px);\
  box-shadow: 0 16px 40px rgba(27,45,71,0.10), 0 2px 8px rgba(27,45,71,0.04);\
}\
.ac-card-banner {\
  position: relative;\
  height: 220px;\
  overflow: hidden;\
  flex-shrink: 0;\
}\
.ac-card-banner::after {\
  content: "";\
  position: absolute;\
  inset: 0;\
  background: linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.06) 100%);\
  pointer-events: none;\
}\
.ac-avatar { width: 100%; height: 100%; position: absolute; inset: 0; }\
.ac-avatar img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); }\
.ac-card:hover .ac-avatar img { transform: scale(1.04); }\
.ac-card-body {\
  padding: 20px 20px 16px;\
  display: flex;\
  flex-direction: column;\
  gap: 12px;\
  flex: 1;\
}\
.ac-card-body h3 {\
  margin: 0;\
  font-size: 1.25rem;\
  font-weight: 700;\
  letter-spacing: -0.01em;\
  line-height: 1.25;\
  color: var(--text);\
}\
.ac-card-body p {\
  margin: 0;\
  color: var(--text-muted);\
  line-height: 1.5;\
  font-size: 0.85rem;\
  letter-spacing: 0.01em;\
  overflow: hidden;\
  text-overflow: ellipsis;\
  white-space: nowrap;\
}\
\
.ac-collection-tag {\
  position: absolute;\
  left: 12px;\
  bottom: 12px;\
  z-index: 3;\
  padding: 3px 10px;\
  border-radius: 999px;\
  font-size: 0.62rem;\
  font-weight: 700;\
  letter-spacing: 0.02em;\
  color: #fff;\
  background: rgba(15, 23, 42, 0.55);\
  backdrop-filter: blur(4px);\
  border: 1px solid rgba(255,255,255,0.35);\
  pointer-events: none;\
}\
\
/* ═══ 统计行 ═══ */\
.ac-stats {\
  display: flex;\
  gap: 8px;\
  padding: 4px 0 0;\
}\
.ac-stat-item {\
  flex: 1;\
  cursor: pointer;\
  display: flex;\
  flex-direction: column;\
  align-items: center;\
  gap: 1px;\
  padding: 10px 6px 8px;\
  border-radius: 12px;\
  background: var(--bg);\
  transition: all 0.25s ease;\
  position: relative;\
}\
.ac-stat-item:hover { background: rgba(0,0,0,0.03); }\
.ac-stat-label {\
  font-size: 0.65rem;\
  font-weight: 600;\
  letter-spacing: 0.04em;\
  text-transform: uppercase;\
  color: var(--text-muted);\
}\
.ac-stat-item .ac-num {\
  font-size: 1.1rem;\
  font-weight: 700;\
  letter-spacing: -0.02em;\
  color: #ff3b30;\
  transition: color 0.2s;\
}\
.ac-stat-item:hover .ac-num { color: var(--accent); }\
\
/* ═══ 价格行（默认隐藏，按钮区替代） ═══ */\
.ac-price-row { display: none; }\
\
/* ═══ 操作按钮区 ═══ */\
.ac-action-area { margin-top: 8px; }\
.ac-mint-btn {\
  width: 100%;\
  padding: 13px 16px;\
  font-size: 0.92rem;\
  font-weight: 700;\
  border-radius:999px;\
  border: none;\
  background: #000000;\
  color: #fff;\
  cursor: pointer;\
  transition: all 0.25s ease;\
  display: flex;\
  align-items: center;\
  justify-content: center;\
  gap: 6px;\
}\
.ac-mint-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0, 0, 0,0.35); }\
.ac-trade-btn {\
  width: 100%;\
  padding: 13px 16px;\
  font-size: 0.92rem;\
  font-weight: 700;\
  border-radius:999px;\
  border: none;\
  background: linear-gradient(135deg, #f59e0b, #f97316);\
  color: #fff;\
  cursor: pointer;\
  transition: all 0.25s ease;\
}\
.ac-trade-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(245,158,11,0.35); }\
\
/* ═══ 售罄状态 ── 交易按钮组 ═══ */\
.ac-actions-soldout {\
  display: flex;\
  gap: 10px;\
  align-items: center;\
  flex: 1;\
  width: 100%;\
}\
.ac-actions-soldout .ac-floor-tag {\
  display: flex;\
  flex-direction: column;\
  align-items: flex-start;\
  gap: 0;\
  padding: 2px 14px 2px 0;\
  border-right: 1px solid var(--border);\
  flex-shrink: 0;\
  min-width: 0;\
}\
.ac-actions-soldout .ac-floor-tag .ac-fpt-label {\
  font-size: 0.65rem;\
  font-weight: 500;\
  color: var(--text-muted);\
  line-height: 1.2;\
  letter-spacing: 0.02em;\
}\
.ac-actions-soldout .ac-floor-tag .ac-fpt-value {\
  font-size: 0.95rem;\
  font-weight: 700;\
  color: var(--text);\
  line-height: 1.3;\
}\
.ac-actions-soldout .ac-trade-btn { flex: 1; min-width: 0; }\
\
/* ═══ 底部脚注 ═══ */\
.ac-meta-foot {\
  text-align: center;\
  font-size: 0.68rem;\
  color: rgba(0,0,0,0.3);\
  padding: 4px 0 0;\
  white-space: nowrap;\
  overflow: hidden;\
  text-overflow: ellipsis;\
}\
\
/* ═══ 帮助按钮 ═══ */\
.ac-price-help {\
  display: inline-flex;\
  align-items: center;\
  justify-content: center;\
  width: 18px;\
  height: 18px;\
  border-radius: 50%;\
  background: rgba(0,0,0,0.04);\
  color: var(--text-muted);\
  font-size: 0.6rem;\
  font-weight: 700;\
  cursor: pointer;\
  transition: all 0.2s ease;\
  border: none;\
  padding: 0;\
  line-height: 1;\
}\
.ac-price-help:hover { background: var(--accent); color: #fff; }\
\
/* ═══ 平板：600px - 960px ═══ */\
@media (min-width: 600px) and (max-width: 960px) {\
  .ac-grid-4 { grid-template-columns: repeat(2, 1fr); gap: 16px; }\
  .ac-card { border-radius: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03); border: 0.5px solid rgba(0,0,0,0.05); }\
  .ac-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.06), 0 12px 28px rgba(0,0,0,0.05); }\
  .ac-card:active { transform: scale(0.985); transition: transform 0.15s ease; }\
  .ac-card-banner { height: 165px; }\
  .ac-card-body { padding: 14px 14px 12px; gap: 8px; }\
  .ac-card-body h3 { font-size: 1.08rem; font-weight: 700; letter-spacing: -0.015em; }\
  .ac-card-body p { font-size: 0.76rem; color: #8e8e93; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }\
  .ac-stats { gap: 4px; }\
  .ac-stat-item { padding: 6px 4px 5px; border-radius: 10px; background: rgba(0,0,0,0.015); }\
  .ac-stat-item:hover { background: rgba(0,0,0,0.04); }\
  .ac-stat-label { font-size: 0.6rem; color: #8e8e93; font-weight: 500; letter-spacing: 0.03em; }\
  .ac-stat-item .ac-num { font-size: 0.95rem; font-weight: 700; letter-spacing: -0.015em; }\
  .ac-mint-btn { padding: 10px 14px; font-size: 0.82rem; font-weight: 600; border-radius:999px; background: linear-gradient(135deg, #000000, #00c89a); box-shadow: 0 2px 6px rgba(0, 0, 0,0.16); }\
  .ac-mint-btn:active { transform: scale(0.97); box-shadow: 0 1px 3px rgba(0, 0, 0,0.1); }\
  .ac-actions-soldout { gap: 6px; }\
  .ac-actions-soldout .ac-floor-tag { padding: 2px 8px 2px 0; }\
  .ac-actions-soldout .ac-floor-tag .ac-fpt-label { font-size: 0.62rem; color: #8e8e93; }\
  .ac-actions-soldout .ac-floor-tag .ac-fpt-value { font-size: 0.88rem; }\
  .ac-trade-btn { padding: 10px 14px; font-size: 0.82rem; border-radius:999px; background: linear-gradient(135deg, #f59e0b, #f97316); box-shadow: 0 2px 6px rgba(245,158,11,0.16); }\
  .ac-trade-btn:active { transform: scale(0.97); box-shadow: 0 1px 3px rgba(245,158,11,0.1); }\
  .ac-collection-tag { left: 10px; bottom: 10px; font-size: 0.58rem; padding: 2px 8px; }\
}\
\
/* ═══ 手机：< 600px ═══ */\
@media (max-width: 599px) {\
  .ac-grid-4 { grid-template-columns: repeat(2, 1fr); gap: 10px; }\
  .ac-card { border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 3px 10px rgba(0,0,0,0.03); border: 0.5px solid rgba(0,0,0,0.05); }\
  .ac-card:hover { transform: translateY(-2px); box-shadow: 0 3px 8px rgba(0,0,0,0.06), 0 8px 20px rgba(0,0,0,0.05); }\
  .ac-card:active { transform: scale(0.985); transition: transform 0.15s ease; }\
  .ac-card-banner { height: 140px; }\
  .ac-card-body { padding: 12px 12px 10px; gap: 6px; }\
  .ac-card-body h3 { font-size: 0.95rem; font-weight: 700; letter-spacing: -0.015em; }\
  .ac-card-body p { font-size: 0.7rem; color: #8e8e93; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }\
  .ac-stats { gap: 3px; }\
  .ac-stat-item { padding: 5px 3px 4px; border-radius: 8px; background: rgba(0,0,0,0.015); }\
  .ac-stat-item:hover { background: rgba(0,0,0,0.04); }\
  .ac-stat-label { font-size: 0.55rem; color: #8e8e93; font-weight: 500; letter-spacing: 0.03em; }\
  .ac-stat-item .ac-num { font-size: 0.85rem; font-weight: 700; letter-spacing: -0.015em; }\
  .ac-action-area { margin-top: 6px; }\
  .ac-mint-btn { padding: 9px 12px; font-size: 0.78rem; font-weight: 600; border-radius:999px; }\
  .ac-trade-btn { padding: 9px 12px; font-size: 0.78rem; font-weight: 600; border-radius:999px; }\
  .ac-meta-foot { font-size: 0.62rem; }\
  .ac-collection-tag { left: 8px; bottom: 8px; font-size: 0.55rem; padding: 2px 8px; }\
}\
';
    var style = document.createElement('style');
    style.id = 'story-actor-card-styles';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  // ============================================================
  //  数据常量
  // ============================================================

  /** 角色头像数据库 */
  var ACTOR_AVATARS = {
    'Luna': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
    '苏婉清': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&q=80',
    '李云飞': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
    '林梦瑶': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
    '赵无极': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80',
    '上官婉儿': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'
  };

  /** 片酬升级表 */
  var UPGRADE_TABLE = [
    { level: 1, threshold: 0,      multiplier: 1.0 },
    { level: 2, threshold: 10000,  multiplier: 2.0 },
    { level: 3, threshold: 50000,  multiplier: 3.5 },
    { level: 4, threshold: 200000, multiplier: 5.5 },
    { level: 5, threshold: 500000, multiplier: 8.0 }
  ];

  var DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80';

  // 片酬金币图标（全站统一规范）
  var COIN_SVG = '<svg viewBox="0 0 24 24" style="width:12px;height:12px;vertical-align:-1px;margin-right:3px;flex-shrink:0;"><circle cx="12" cy="12" r="10" fill="#f5b042"/><circle cx="12" cy="12" r="10" stroke="#d9951a" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="7" stroke="rgba(255,255,255,.6)" stroke-width="1.2" fill="none"/><path d="M12 8l.9 1.9 2.1.2-1.6 1.4.5 2-1.9-1-1.9 1 .5-2-1.6-1.4 2.1-.2L12 8z" fill="#fff"/></svg>';

  // ============================================================
  //  工具函数
  // ============================================================

  function escapeHTML(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/'/g, '&#39;');
  }

  function parseChineseNum(str) {
    if (!str) return 0;
    var s = str.replace(/,/g, '');
    var match = s.match(/^([\d.]+)万$/);
    if (match) return parseFloat(match[1]) * 10000;
    return parseFloat(s) || 0;
  }

  function formatThreshold(n) {
    if (n === 0) return '0';
    if (n >= 10000) return (n / 10000).toFixed(0).replace(/\.0$/, '') + '万';
    return n.toLocaleString();
  }

  /** 计算价格系数 */
  function computePriceCoefficient(P0) {
    if (P0 == null || P0 <= 0) return 0;
    var x = P0 / 100;
    if (P0 <= 100) return x;
    var powX = Math.pow(x, 1.3);
    return 1.6 * powX / (powX + 0.6);
  }

  /** 计算 IP 片酬 */
  function computeIPPower(initPrice, heat) {
    return computePriceCoefficient(initPrice || 0) * (heat || 0);
  }

  /** 获取角色最高可升级等级 */
  function getMaxUpgradeLevel(viewsStr) {
    var viewsNum = parseChineseNum(viewsStr);
    var maxLevel = 1;
    for (var i = UPGRADE_TABLE.length - 1; i >= 0; i--) {
      if (viewsNum >= UPGRADE_TABLE[i].threshold) {
        maxLevel = UPGRADE_TABLE[i].level;
        break;
      }
    }
    return maxLevel;
  }

  // ============================================================
  //  渲染函数
  // ============================================================

  /**
   * 渲染单张角色 IP 卡片
   * @param {Object} data 卡片数据
   * @returns {string} HTML 字符串
   */
  function renderActorCard(data) {
    data = data || {};
    var name = data.name || '';
    var avatar = data.avatar || ACTOR_AVATARS[name] || DEFAULT_AVATAR;
    var issuanceType = data.issuanceType || 'community';
    var pricing = data.pricing || 'curve';
    var collection = data.collection || '';
    var total = parseInt(data.total) || 0;
    var minted = parseInt(data.minted) || 0;
    var available = data.available != null ? parseInt(data.available) : Math.max(total - minted, 0);
    var price = data.price || '10 USDC';
    var initPrice = parseFloat(data.initPrice) || 0;
    var creator = data.creator || '';
    var views = data.views || '0';
    var heat = parseFloat(data.heat) || 0;
    var ipPower = computeIPPower(initPrice, heat);
    var maxLevel = getMaxUpgradeLevel(views);
    var maxMultiplier = UPGRADE_TABLE[maxLevel - 1] ? UPGRADE_TABLE[maxLevel - 1].multiplier : 1.0;
    var isSoldout = available <= 0;
    var bannerClass = data.bannerClass || 'banner-1';
    var id = data.id || '';

    // Banner 渐变
    var bannerBg = '';
    if (bannerClass === 'banner-1') bannerBg = 'background:linear-gradient(135deg, #e0f7ff 0%, #ffffff 100%);';
    else if (bannerClass === 'banner-2') bannerBg = 'background:linear-gradient(135deg, #ffe4e7 0%, #fff9fb 100%);';
    else if (bannerClass === 'banner-3') bannerBg = 'background:linear-gradient(135deg, #edeaff 0%, #f9f8ff 100%);';
    else if (bannerClass) bannerBg = 'background:' + bannerClass + ';';

    // 价格帮助按钮
    var priceHelpBtn = '<button class="ac-price-help" onclick="event.stopPropagation(); window._acOpenPriceTooltip && window._acOpenPriceTooltip(event, \'' + id + '\', \'' + escapeHTML(name) + '\', \'' + pricing + '\', ' + initPrice + ', ' + total + ', ' + minted + ');">?</button>';

    // 统计行
    var statsHTML = '<div class="ac-stats">' +
      '<span class="ac-stat-item" data-stat="ip-power">' +
        '<span class="ac-num">' + COIN_SVG + ipPower.toFixed(2) + ' <span style="font-size:0.58em;color:var(--text-muted);">片酬/h</span></span>' +
      '</span>' +
    '</div>';

    // 价格行
    var priceLabel = pricing === 'curve' ? '签约价' : '签约价';
    var priceStatus = isSoldout ? ' · 已售罄' : (' · 剩余 ' + available.toLocaleString() + ' 个');
    var priceRow = '<div class="ac-price-row">' +
      '<span class="ac-price-label">' + priceLabel + ' ' + priceHelpBtn + priceStatus + '</span>' +
      '<span class="ac-price-value">' + escapeHTML(price) + '</span>' +
    '</div>';

    // 操作区
    var actionHTML = '';
    if (isSoldout) {
      actionHTML = '<div class="ac-action-area">' +
        '<button class="ac-trade-btn" data-actor="' + escapeHTML(name) + '">' + escapeHTML(price) + ' · 交易</button>' +
      '</div>';
    } else {
      actionHTML = '<div class="ac-action-area">' +
        '<button class="ac-mint-btn" data-actor="' + escapeHTML(name) + '" data-total-supply="' + total + '" data-minted="' + minted + '" data-available="' + available + '" data-price="' + escapeHTML(price) + '" data-pricing="' + pricing + '" data-collection="' + escapeHTML(collection) + '" data-init-price="' + initPrice + '" data-avatar="' + escapeHTML(avatar) + '">' + escapeHTML(price) + ' 签约</button>' +
      '</div>';
    }

    // 脚注
    var metaParts = [];
    var remainText = isSoldout ? '已售罄' : '剩余 ' + available.toLocaleString();
    metaParts.push(remainText);
    if (creator) metaParts.push('@' + creator);
    var metaFoot = '<div class="ac-meta-foot">' + metaParts.join(' · ') + '</div>';

    return '<article class="ac-card" data-actor="' + escapeHTML(name) + '" data-id="' + id + '" data-issuance-type="' + issuanceType + '" data-pricing="' + pricing + '" data-total="' + total + '" data-minted="' + minted + '" data-available="' + available + '" data-price="' + escapeHTML(price) + '" data-init-price="' + initPrice + '" data-creator="' + escapeHTML(creator) + '" data-collection="' + escapeHTML(collection) + '" data-views="' + escapeHTML(views) + '" data-heat="' + heat + '" data-avatar="' + escapeHTML(avatar) + '">' +
      '<div class="ac-card-banner" style="' + bannerBg + '">' +
        '<div class="ac-avatar">' +
          '<img src="' + avatar + '" alt="角色 ' + escapeHTML(name) + '" loading="lazy" />' +
        '</div>' +
        (collection ? '<div class="ac-collection-tag">' + escapeHTML(collection) + '</div>' : '') +
      '</div>' +
      '<div class="ac-card-body">' +
        '<div>' +
          '<h3>' + escapeHTML(name) + '</h3>' +
        '</div>' +
        statsHTML +
        priceRow +
        actionHTML +
        metaFoot +
      '</div>' +
    '</article>';
  }

  /**
   * 批量渲染角色 IP 卡片列表
   * @param {Array} items 卡片数据数组
   * @returns {string} HTML 字符串
   */
  function renderActorCardList(items) {
    items = Array.isArray(items) ? items : [];
    return items.map(renderActorCard).join('');
  }

  /**
   * 渲染包装了 grid 的卡片列表
   * @param {Array} items 卡片数据数组
   * @param {string} gridClass 网格 class（默认 'ac-grid ac-grid-4'）
   * @returns {string} HTML 字符串
   */
  function renderActorCardGrid(items, gridClass) {
    var cls = gridClass || 'ac-grid ac-grid-4';
    return '<div class="actor-card-scope"><div class="' + cls + '">' + renderActorCardList(items) + '</div></div>';
  }

  // ============================================================
  //  交互初始化（排序）
  // ============================================================

  /**
   * 初始化角色卡片的排序交互
   * @param {Object} options
   * @param {string} options.sortContainerId   - 排序标签容器 ID
   * @param {string} options.gridSelector      - 卡片容器选择器（默认 '.ac-grid, .grid'）
   * @param {string} options.defaultSort       - 默认排序（默认 'price-asc'）
   */
  function initActorSorting(options) {
    options = options || {};
    var containerId = options.sortContainerId || 'sortContainer';
    var gridSelector = options.gridSelector || '.ac-grid, .grid';
    var defaultSort = options.defaultSort || 'power-desc';

    var sortContainer = document.getElementById(containerId);
    if (!sortContainer) return;

    var grid = document.querySelector(gridSelector);
    if (!grid) return;

    var currentSort = defaultSort;
    var priceDir = 'desc';

    function getSortVal(card, sortKey) {
      switch (sortKey) {
        case 'price':
          return parseFloat((card.dataset.price || '0').replace(/[^0-9.]/g, '')) || 0;
        case 'power-desc':
          var pw = computeIPPower(parseFloat(card.dataset.initPrice) || 0, parseFloat(card.dataset.heat) || 0);
          return isNaN(pw) ? 0 : pw;
        case 'heat-desc':
          return parseChineseNum(card.dataset.heat);
        default:
          return 0;
      }
    }

    function applySort() {
      var cards = Array.from(grid.querySelectorAll('.ac-card, .card'));
      var sorted = cards.sort(function (a, b) {
        var valA = getSortVal(a, currentSort);
        var valB = getSortVal(b, currentSort);
        var multi = (currentSort === 'price' && priceDir === 'asc') ? 1 : -1;
        return (valA - valB) * multi;
      });
      sorted.forEach(function (card) {
        grid.appendChild(card);
      });
    }

    function setActive(tag) {
      sortContainer.querySelectorAll('[data-sort]').forEach(function (t) { t.classList.remove('active'); });
      tag.classList.add('active');
    }

    function updatePriceArrow(tag) {
      if (!tag || tag.dataset.sort !== 'price') return;
      var up = tag.querySelector('.s-arrow.up');
      var down = tag.querySelector('.s-arrow.down');
      if (up && down) {
        up.classList.toggle('active', priceDir === 'asc');
        down.classList.toggle('active', priceDir === 'desc');
      }
    }

    sortContainer.querySelectorAll('[data-sort]').forEach(function (tag) {
      tag.addEventListener('click', function () {
        var key = this.dataset.sort;
        if (key === 'price') {
          if (currentSort === 'price') {
            priceDir = priceDir === 'asc' ? 'desc' : 'asc';
          } else {
            priceDir = 'desc';
          }
          currentSort = 'price';
        } else {
          currentSort = key;
        }
        // 价格标签的箭头高亮随 priceDir 更新
        updatePriceArrow(sortContainer.querySelector('[data-sort="price"]'));
        setActive(this);
        applySort();
      });
    });

    // 初始化价格箭头状态（默认降序）
    updatePriceArrow(sortContainer.querySelector('[data-sort="price"]'));

    // 若 defaultSort 对应的标签未带 active，则补上
    var defaultTag = sortContainer.querySelector('[data-sort="' + currentSort + '"]');
    if (defaultTag && !defaultTag.classList.contains('active')) {
      setActive(defaultTag);
    }

    // 初始排序
    applySort();
  }

  // ============================================================
  //  暴露全局 API
  // ============================================================
  window.renderActorCard = renderActorCard;
  window.renderActorCardList = renderActorCardList;
  window.renderActorCardGrid = renderActorCardGrid;
  window.initActorSorting = initActorSorting;
  window.computePriceCoefficient = computePriceCoefficient;
  window.computeIPPower = computeIPPower;
  window.ACTOR_AVATARS_IP = ACTOR_AVATARS;
  window.UPGRADE_TABLE = UPGRADE_TABLE;
  window.parseChineseNum = parseChineseNum;
  window.formatThreshold = formatThreshold;

  // 自动注入样式
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyles);
  } else {
    injectStyles();
  }
})();