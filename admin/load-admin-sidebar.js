/**
 * admin/load-admin-sidebar.js
 * 后台管理左侧导航栏 — 共享组件
 * 在页面中放 <div id="admin-sidebar-placeholder"></div> 并引入此脚本即可
 */
(function() {
  // ── 防止重复注入 ──
  if (document.getElementById('admin-sidebar-injected')) return;

  // ── 检测当前页面 ──
  var page = (function() {
    var name = window.location.pathname.split('/').pop() || '';
    if (name.indexOf('admin-mining-detail') !== -1) return 'detail';
    if (name.indexOf('admin-mining') !== -1) return 'mining';
    if (name.indexOf('admin-1011-config') !== -1) return 'config';
    if (name.indexOf('admin-1011-stories') !== -1) return 'stories';
    if (name.indexOf('admin-1011') !== -1) return '1011';
    return 'other';
  })();


  // ── CSS ──
  var style = document.createElement('style');
  style.id = 'admin-sidebar-injected-css';
  style.textContent = [
    '.admin-layout { display:flex; min-height:100vh; }',
    '.admin-sidebar { position:fixed; top:0; left:0; bottom:0; width:220px; background:#13202e; color:#fff; display:flex; flex-direction:column; z-index:200; overflow-y:auto; }',
    '.admin-sidebar-brand { display:flex; align-items:center; gap:10px; padding:18px 20px; font-size:1rem; font-weight:700; border-bottom:1px solid rgba(255,255,255,0.06); flex-shrink:0; }',
    '.admin-sidebar-brand a { color:#fff; text-decoration:none; display:flex; align-items:center; gap:10px; }',
    '.admin-sidebar-nav { flex:1; padding:12px 0; display:flex; flex-direction:column; gap:2px; }',
    '.admin-sidebar-section-label { padding:10px 20px 4px; font-size:0.68rem; font-weight:600; text-transform:uppercase; letter-spacing:0.12em; color:#5e7a94; }',
    '.admin-sidebar-item { display:flex; align-items:center; gap:10px; padding:10px 20px; font-size:0.85rem; font-weight:500; color:rgba(255,255,255,0.65); text-decoration:none; transition:all 0.15s; border-left:3px solid transparent; }',
    '.admin-sidebar-item:hover { color:#fff; background:rgba(255,255,255,0.06); }',
    '.admin-sidebar-item.active { color:#05DF72; background:rgba(0,223,114,0.08); border-left-color:#05DF72; font-weight:600; }',
    '.admin-sidebar-item .emoji { font-size:1rem; width:22px; text-align:center; flex-shrink:0; }',
    '.admin-sidebar-footer { border-top:1px solid rgba(255,255,255,0.06); padding:12px 0; flex-shrink:0; }',
    '.admin-sidebar-user { display:flex; align-items:center; gap:10px; padding:8px 20px; font-size:0.78rem; color:rgba(255,255,255,0.40); }',
    '.admin-main { flex:1; margin-left:220px; min-height:100vh; background:var(--bg,#f5faff); }',
    '.admin-main-inner { max-width:1200px; margin:0 auto; padding:24px 32px; }',
    '@media (max-width:768px) {',
    '  .admin-sidebar { width:56px; }',
    '  .admin-sidebar-brand span, .admin-sidebar-item span:not(.emoji), .admin-sidebar-section-label, .admin-sidebar-user { display:none; }',
    '  .admin-sidebar-brand { justify-content:center; padding:18px 0; }',
    '  .admin-sidebar-item { justify-content:center; padding:12px 0; border-left-width:0; }',
    '  .admin-sidebar-item .emoji { font-size:1.2rem; width:auto; }',
    '  .admin-main { margin-left:56px; }',
    '  .admin-main-inner { padding:16px; }',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  // ── 查找 placeholder ──
  var placeholder = document.getElementById('admin-sidebar-placeholder');
  if (!placeholder) return;

  // ── 构建导航链接 ──
  var navItems = [
    { section: '导航' },
    { href: 'admin-mining.html', emoji: '', label: '挖矿结算管理', match: 'mining' },
    { href: 'admin-1011-stories.html', emoji: '', label: '1011故事收集', match: 'stories' },
    { href: 'admin-1011.html', emoji: '', label: '1011分享审核', match: '1011' },
    { href: 'admin-1011-config.html', emoji: '', label: '1011任务配置', match: 'config' },

  ];


  var navHtml = '';
  navItems.forEach(function(item) {
    if (item.section) {
      navHtml += '<div class="admin-sidebar-section-label">' + item.section + '</div>';
      return;
    }
    var isActive = (item.match === page) || (page === 'detail' && item.match === 'mining');
    navHtml += '<a class="admin-sidebar-item' + (isActive ? ' active' : '') + '" href="' + item.href + '">';
    if (item.emoji) { navHtml += '<span class="emoji">' + item.emoji + '</span>'; }
    navHtml += '<span>' + item.label + '</span>';
    navHtml += '</a>';
  });

  // ── 构建完整布局 ──
  var layout = document.createElement('div');
  layout.className = 'admin-layout';
  layout.innerHTML =
    '<aside class="admin-sidebar" id="adminSidebar">' +
      '<div class="admin-sidebar-brand"><a href="admin-mining.html">⚙️ <span>管理后台</span></a></div>' +
      '<a class="admin-sidebar-item exit" href="../index.html" style="border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:14px;margin-bottom:4px;">🎭 <span>返回用户端</span></a>' +
      '<nav class="admin-sidebar-nav">' + navHtml + '</nav>' +
      '<div class="admin-sidebar-footer"><div class="admin-sidebar-user">Story.fun Admin</div></div>' +
    '</aside>' +
    '<main class="admin-main"><div class="admin-main-inner" id="adminMainInner"></div></main>';

  // ── 存入所有 body 子节点（除了 placeholder 和 self script） ──
  var contentNodes = [];
  var selfScript = document.querySelector('script[src*="load-admin-sidebar"]');
  while (placeholder.nextSibling) {
    var sib = placeholder.nextSibling;
    if (sib === selfScript || (sib.tagName && sib.tagName.toLowerCase() === 'script' && sib.src && sib.src.indexOf('load-admin-sidebar') !== -1)) {
      placeholder.parentNode.removeChild(sib);
      continue;
    }
    contentNodes.push(sib);
    placeholder.parentNode.removeChild(sib);
  }

  // ── 替换 placeholder 为 layout ──
  placeholder.parentNode.replaceChild(layout, placeholder);

  // ── 将内容移入 mainInner ──
  var mainInner = document.getElementById('adminMainInner');
  if (mainInner) {
    contentNodes.forEach(function(n) { mainInner.appendChild(n); });

    // 展平 .app-shell
    var oldShell = mainInner.querySelector('.app-shell');
    if (oldShell) {
      while (oldShell.firstChild) {
        mainInner.insertBefore(oldShell.firstChild, oldShell);
      }
      mainInner.removeChild(oldShell);
    }
  }

  // ── 标记已注入 ──
  var flag = document.createElement('meta');
  flag.id = 'admin-sidebar-injected';
  flag.name = 'admin-sidebar-injected';
  document.head.appendChild(flag);
})();
