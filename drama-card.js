// ============================================================
//  Story.fun - 短剧卡片公共组件 (drama-card.js)
//
//  功能：
//    1. 自动注入短剧卡片完整 CSS（含移动端适配）
//    2. 提供短剧认证徽章系统（官方/合作/认证/社区）
//    3. 提供通用角色 IP 数据库（头像 + 挖矿算力）
//    4. 提供卡片渲染 API renderDramaCard / renderDramaCardList
//
//  用法：
//    <script src="drama-card.js"></script>
//    <script>
//      document.querySelector('.gallery').innerHTML = renderDramaCardList([...]);
//    </script>
//
//  卡片数据结构（renderDramaCard 入参）：
//    {
//      title:  '凤骨琉璃',                 // 标题（必填）
//      cover:  'image/fenggu_cover.jpg',   // 封面图
//      category: '古风',                    // 分类（data-category，用于筛选）
//      sort:   'recommended',              // 排序标记（data-sort，用于筛选）
//      certType: 'official',               // 认证类型：official/partner/creator/community
//      actors: ['苏婉清', '李云飞'],        // 参演角色 IP 名称数组
//      views:  '22.3万',                   // 观看数
//      heat:   '333.2万',                  // 热度
//      rating: '4.8',                      // 评分
//      badge:  '古风',                     // 角标文本（默认取 category）
//      episodes: '全44集',                 // 集数
//      creator: 'JACK',                    // 创作者昵称
//      creatorAvatar: 'https://...',       // 创作者头像
//      link:   'drama-detail.html'         // 卡片点击跳转（默认 drama-detail.html）
//    }
// ============================================================

(function () {
  'use strict';

  // ============================================================
  //  卡片样式注入（仅注入一次）
  // ============================================================
  function injectStyles() {
    if (document.getElementById('story-drama-card-styles')) return;

    var css = `
/* ── Story.fun Drama Card (by drama-card.js) ── */

/* ═══ 短剧标识徽章 ═══ */
.drama-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 999px;
  color: #1a1a2e;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.3px;
  white-space: nowrap;
  vertical-align: middle;
  line-height: 1.3;
}
.drama-badge .badge-icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}
/* 官方短剧 — 金色 */
.drama-badge.official {
  background: linear-gradient(135deg, #ffd700, #f59e0b);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.35);
}
/* 合作方短剧 — 蓝色 */
.drama-badge.partner {
  background: linear-gradient(135deg, #60a5fa, #6366f1);
  color: #1a232f;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
}
/* 认证创作者短剧 — 紫色 */
.drama-badge.creator {
  background: linear-gradient(135deg, #a78bfa, #8b5cf6);
  color: #1a232f;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.35);
}
/* 社区短剧 — 灰色 */
.drama-badge.community {
  background: linear-gradient(135deg, #94a3b8, #64748b);
  color: #1a232f;
  box-shadow: 0 2px 4px rgba(100, 116, 139, 0.25);
}

/* ═══ 卡片骨架 ═══ */
.card { position: relative; }
.card .card-cert-corner {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
}
.card-wrapper { display: flex; flex-direction: column; cursor: pointer; }
.card {
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  box-shadow: 0 2px 12px rgba(27, 45, 71, 0.06);
  border: 1px solid var(--border);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}
.card:hover { transform: translateY(-5px); box-shadow: 0 4px 20px rgba(27, 45, 71, 0.10); }
.card-thumb-wrap { position: relative; overflow: hidden; }
.card-thumb { width: 100%; aspect-ratio: 2/3; object-fit: cover; display: block; }
.card-body { display: none; }

/* ═══ 卡片角标（标题/分类/集数/创作者） ═══ */
.card-caption { padding: 8px 2px 0; }
.card-caption h3 { margin: 0; font-size: 0.95rem; line-height: 1.25; font-weight: 600; color: var(--text); }
.card-caption .caption-row { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
.card-caption .caption-row .caption-left { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
.card-caption .caption-row .caption-right { flex-shrink: 0; margin-left: 12px; font-size: 0.72rem; color: var(--text-muted); font-weight: 500; white-space: nowrap; display: flex; align-items: center; gap: 4px; }
.caption-creator { display: flex; align-items: center; gap: 4px; }
.caption-creator-avatar { width: 18px; height: 18px; border-radius: 50%; object-fit: cover; flex-shrink: 0; border: 1px solid var(--border); }
.card-caption .badge, .card-caption .episode {
  display: inline-flex;
  align-items: center;
  border-radius: 4px;
  padding: 3px 7px;
  font-size: 0.68rem;
  font-weight: 500;
  border: 1px solid var(--border);
  color: var(--text-muted);
  background: transparent;
}

/* ═══ 卡片统计层（左下角） ═══ */
.card-stats {
  position: absolute;
  bottom: 8px;
  left: 10px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.7rem;
  font-weight: 500;
  color: #fff;
  pointer-events: none;
}
.card-stats .cs-stat { display: inline-flex; align-items: center; gap: 3px; color: #fff; }
.card-stats .cs-stat svg { width: 12px; height: 12px; flex-shrink: 0; opacity: 0.9; stroke: #fff; }
.card-stats .cs-rating { color: #fff; }
.card-stats .cs-rating svg { stroke: #fff; opacity: 1; }

/* ═══ 参演角色 IP 头像（挖矿面板风格） ═══ */
.card-actors {
  position: absolute;
  bottom: 34px;
  left: 10px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0;
  background: none;
  border-top: none;
  margin: 0;
  pointer-events: none;
}
.card-actor-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0;
  cursor: pointer;
  transition: transform 0.2s ease;
  pointer-events: auto;
}
.card-actor-item:hover { transform: translateY(-2px); }
.card-actor-avatar-wrap { position: relative; width: 36px; height: 36px; flex-shrink: 0; }
.card-actor-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
  transition: border-color 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
.card-actor-item:hover .card-actor-avatar { border-color: var(--accent); }
.card-actor-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.card-actor-mining-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #34d399;
  border: 2px solid rgba(0, 0, 0, 0.7);
  animation: cardMiningPulse 2s ease-in-out infinite;
}
@keyframes cardMiningPulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 5px rgba(52, 211, 153, 0.5); }
  50% { opacity: 0.3; box-shadow: 0 0 1px rgba(52, 211, 153, 0.15); }
}
.card-actor-tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: 8px;
  padding: 5px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.card-actor-item:hover .card-actor-tooltip { opacity: 1; }
.card-actor-tooltip .ct-power { font-size: 0.75rem; font-weight: 700; color: #3affb1; line-height: 1.2; }
.card-actor-tooltip .ct-unit { font-size: 0.6rem; font-weight: 500; color: rgba(255, 255, 255, 0.4); letter-spacing: 0.04em; line-height: 1.2; }
.card-actors-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 10px;
  padding: 4px 8px;
  border: 0.5px solid rgba(255, 255, 255, 0.08);
}
.card-actor-name { display: none; }
.card-foot { display: none; }

/* ═══ 移动端适配 ═══ */
@media (max-width: 760px) {
  .card {
    background: var(--surface);
    box-shadow: 0 2px 12px rgba(27, 45, 71, 0.06);
    border: 1px solid var(--border);
    min-height: auto;
  }
  .card:hover { box-shadow: 0 4px 20px rgba(27, 45, 71, 0.10); }
  .card-body { padding: 10px 12px 10px; }
  .card-body h3 { font-size: 0.85rem; margin-bottom: 0; }
  .card-body p { display: none; color: var(--text-muted); }
  .card-meta { display: none; }
  .card-thumb { aspect-ratio: 2/3; }
  .card-actors { bottom: 30px; left: 8px; padding: 0; border-top: none; }
  .card-actor-name { display: none; color: var(--text-muted); }
  .card-actor-avatar { width: 26px; height: 26px; border-width: 1.5px; border-color: rgba(255, 255, 255, 0.6); }
  .card-actor-avatar-wrap { width: 26px; height: 26px; }
  .card-actors-list {
    gap: 3px;
    padding: 3px 6px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border: 0.5px solid rgba(255, 255, 255, 0.12);
  }
  .card-actor-item { gap: 0; }
  .card-caption .caption-left .badge { display: none; }
  .episode { background: rgba(0, 0, 0, 0.04); color: var(--text-muted); }
  .badge { background: var(--accent-soft); color: var(--accent); }
}
`;

    var style = document.createElement('style');
    style.id = 'story-drama-card-styles';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  // ============================================================
  //  短剧标识配置（与 index.html 现有逻辑保持一致）
  // ============================================================
  var BADGE_CONFIG = {
    official:  { cls: 'official',  icon: '🏅', label: '官方', fullLabel: '官方短剧' },
    partner:   { cls: 'partner',   icon: '🤝', label: '合作', fullLabel: '合作方短剧' },
    creator:   { cls: 'creator',   icon: '✅', label: '认证', fullLabel: '认证创作者短剧' },
    community: { cls: 'community', icon: '🌐', label: '社区', fullLabel: '社区短剧' }
  };

  function getBadgeHTML(certType, longText) {
    var cfg = BADGE_CONFIG[certType] || BADGE_CONFIG.community;
    return '<span class="drama-badge ' + cfg.cls + '">' + cfg.icon + ' ' + (longText ? cfg.fullLabel : cfg.label) + '</span>';
  }

  // ============================================================
  //  角色 IP 数据库（与 actors.html / index.html 保持一致）
  // ============================================================
  var ACTOR_AVATARS = {
    'Luna': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    '苏婉清': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    '李云飞': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    '林梦瑶': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    '赵无极': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    '上官婉儿': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  };
  var ACTOR_POWER = {
    'Luna': '5,230',
    '苏婉清': '8,562',
    '李云飞': '6,230',
    '林梦瑶': '5,891',
    '赵无极': '7,105',
    '上官婉儿': '4,720'
  };
  var DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80';

  // ============================================================
  //  统计层图标（保持与 index.html 原有 SVG 一致）
  // ============================================================
  var ICONS = {
    views: '<svg viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M1 8s2.5-5.5 7-5.5 7 5.5 7 5.5-2.5 5.5-7 5.5-7-5.5-7-5.5z"/><circle cx="8" cy="8" r="2"/></svg>',
    heat: '<svg viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2c-2 3-3.5 6-3.5 9 0 2.5 1.5 4 3.5 4s3.5-1.5 3.5-4c0-3-1.5-6-3.5-9z"/></svg>',
    rating: '<svg viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><polygon points="8 1.5 9.8 5.5 14 6 10.8 9 11.6 13 8 11 4.4 13 5.2 9 2 6 6.2 5.5"/></svg>'
  };

  // ============================================================
  //  渲染工具
  // ============================================================
  function escapeHTML(str) {
    var entityMap = {
      '&': '\x26amp;',
      '<': '\x26lt;',
      '>': '\x26gt;',
      '"': '\x26quot;',
      "'": '\x26#39;'
    };
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return entityMap[c];
    });
  }

  /**
   * 渲染单个参演角色 IP 头像
   */
  function renderActorItem(name) {
    var avatarUrl = ACTOR_AVATARS[name] || DEFAULT_AVATAR;
    var power = ACTOR_POWER[name] || '—';
    var href = 'actor-profile.html?name=' + encodeURIComponent(name);
    return '<div class="card-actor-item" onclick="event.stopPropagation(); location.href=\'' + href + '\'">' +
      '<div class="card-actor-avatar-wrap">' +
        '<div class="card-actor-avatar"><img src="' + avatarUrl + '" alt="' + escapeHTML(name) + '" loading="lazy" /></div>' +
        '<div class="card-actor-mining-dot"></div>' +
      '</div>' +
      '<div class="card-actor-tooltip"><span class="ct-power">' + power + '</span><span class="ct-unit">STORY/h</span></div>' +
      '<span class="card-actor-name">' + escapeHTML(name) + '</span>' +
    '</div>';
  }

  /**
   * 渲染一张短剧卡片（生成的 DOM 结构与 index.html 原有卡片完全一致）
   * @param {Object} data 卡片数据（字段见文件头注释）
   * @returns {string} 卡片 HTML 字符串
   */
  function renderDramaCard(data) {
    data = data || {};
    var title = escapeHTML(data.title || '');
    var cover = escapeHTML(data.cover || '');
    var category = escapeHTML(data.category || '');
    var sort = escapeHTML(data.sort || '');
    var certType = data.certType || 'community';
    var actors = Array.isArray(data.actors) ? data.actors : [];
    var views = escapeHTML(data.views || '');
    var heat = escapeHTML(data.heat || '');
    var rating = escapeHTML(data.rating || '');
    var badge = escapeHTML(data.badge || data.category || '');
    var episodes = escapeHTML(data.episodes || '');
    var creator = escapeHTML(data.creator || '');
    var creatorAvatar = escapeHTML(data.creatorAvatar || '');
    var link = escapeHTML(data.link || 'drama-detail.html');

    var certHTML = '<div class="card-cert-corner">' + getBadgeHTML(certType, false) + '</div>';

    var actorsHTML = '';
    if (actors.length > 0) {
      var actorItems = actors.map(renderActorItem).join('');
      actorsHTML = '<div class="card-actors"><div class="card-actors-list">' + actorItems + '</div></div>';
    }

    var statsHTML = '';
    if (views || heat || rating) {
      statsHTML = '<div class="card-stats">' +
        (views ? '<span class="cs-stat">' + ICONS.views + views + '</span>' : '') +
        (heat ? '<span class="cs-stat">' + ICONS.heat + heat + '</span>' : '') +
        (rating ? '<span class="cs-stat cs-rating">' + ICONS.rating + '<span>' + rating + '</span></span>' : '') +
      '</div>';
    }

    var captionLeft = '';
    if (badge) captionLeft += '<span class="badge">' + badge + '</span>';
    if (episodes) captionLeft += '<span class="episode">' + episodes + '</span>';

    var creatorHTML = '';
    if (creator || creatorAvatar) {
      creatorHTML = '<div class="caption-right"><div class="caption-creator">' +
        (creatorAvatar ? '<img class="caption-creator-avatar" src="' + creatorAvatar + '" alt="' + creator + '" />' : '') +
        (creator ? '@' + creator : '') +
      '</div></div>';
    }

    return '<div class="card-wrapper" onclick="location.href=\'' + link + '\'">' +
      '<article class="card" data-category="' + category + '" data-sort="' + sort + '">' +
        certHTML +
        '<div class="card-thumb-wrap">' +
          '<img class="card-thumb" src="' + cover + '" alt="' + title + '" />' +
          actorsHTML +
        '</div>' +
        statsHTML +
      '</article>' +
      '<div class="card-caption"><h3>' + title + '</h3>' +
        '<div class="caption-row">' +
          '<div class="caption-left">' + captionLeft + '</div>' +
          creatorHTML +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /**
   * 批量渲染多张短剧卡片
   * @param {Array} items 卡片数据数组
   * @returns {string} 卡片 HTML 拼接字符串
   */
  function renderDramaCardList(items) {
    items = Array.isArray(items) ? items : [];
    return items.map(renderDramaCard).join('');
  }

  // ============================================================
  //  暴露全局 API（供各页面直接调用）
  // ============================================================
  window.renderDramaCard = renderDramaCard;
  window.renderDramaCardList = renderDramaCardList;
  window.getBadgeHTML = getBadgeHTML;
  window.BADGE_CONFIG = BADGE_CONFIG;
  window.ACTOR_AVATARS = ACTOR_AVATARS;
  window.ACTOR_POWER = ACTOR_POWER;

  // 自动注入样式
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyles);
  } else {
    injectStyles();
  }
})();