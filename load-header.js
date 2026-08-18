// ============================================================
//  Story.fun - 统一 Header 加载脚本
//  自包含 Header 样式（自动注入），各页面无需重复编写
//  桌面端 (≥769px)：左侧固定侧边导航栏（抖音 Web 风格）
//  移动端 (≤768px)：保持原底部导航
// ============================================================

(function() {
  let currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (!currentPage || currentPage === '' || currentPage.endsWith('/')) {
    currentPage = 'index.html';
  }
  const headerPath = 'header.html';

  // ============================================================
  //  注入 Header 样式（仅一次）
  // ============================================================
  function injectHeaderStyles() {
    if (document.getElementById('story-header-styles')) return;

    const css = `
/* ── Story.fun Header Styles ── */
.story-header-wrapper .header {
  width: 100%;
  background: #ffffff;
  border-bottom: 0.5px solid #D9D9E0;
}
.story-header-wrapper .header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1440px;
  margin: 0 auto;
  padding: 16px 44px;
  width: 100%;
  box-sizing: border-box;
}
.story-header-wrapper .brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.story-header-wrapper .header-logo-svg,
.story-header-wrapper .header-logo-img {
  width: 29px;
  height: 29px;
  display: block;
  object-fit: contain;
}
.story-header-wrapper .brand-text {
  font-family: "SF Pro", "PingFang SC", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-weight: 590;
  font-size: 19.64px;
  background: linear-gradient(45deg, #000000 0%, #1a1a1a 50%, #666666 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
}
.story-header-wrapper .nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}
.story-header-wrapper .nav-link {
  font-family: "SF Pro", "PingFang SC", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: #60646C;
  text-decoration: none;
  padding: 10px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.story-header-wrapper .nav-link:hover {
  color: #1C2024;
  background: rgba(0,0,0,0.03);
}
.story-header-wrapper .nav-link.active {
  color: #000000;
  border-radius: 999px;
}

/* ── 1011 Dropdown ── */
.story-header-wrapper .nav-dropdown {
  position: relative;
  display: inline-flex;
}
.story-header-wrapper .nav-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 140px;
  background: #ffffff;
  border: 0.5px solid #ECECF0;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.10);
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-6px);
  transition: all 0.22s ease;
  z-index: 300;
  padding: 4px;
}
.story-header-wrapper .nav-dropdown:hover .nav-dropdown-menu,
.story-header-wrapper .nav-dropdown-menu:hover {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.story-header-wrapper .nav-dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  font-family: "SF Pro", "PingFang SC", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  color: #1C2024;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.15s ease;
  white-space: nowrap;
}
.story-header-wrapper .nav-dropdown-item:hover {
  background: #F5F5F7;
}
.story-header-wrapper .nav-dropdown-item.active {
  color: #000000;
  background: rgba(0, 0, 0,0.08);
}
.story-header-wrapper .header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}
.story-header-wrapper .search-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 6px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius:999px;
  font-family: "SF Pro", "PingFang SC", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #60646C;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.story-header-wrapper .search-btn:hover {
  background: rgba(0,0,0,0.04);
}
.story-header-wrapper .search-btn svg {
  flex-shrink: 0;
}
.story-header-wrapper .auth-container {
  display: flex;
  align-items: center;
}

/* ── Brand Dropdown (Logo 下拉菜单) ── */
.story-header-wrapper .brand-logo-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  user-select: none;
}
.story-header-wrapper .brand-logo-wrapper:hover {
  opacity: 0.85;
}
.story-header-wrapper .brand-dropdown-arrow {
  color: #8b8d98;
  transition: transform 0.22s ease;
  flex-shrink: 0;
}
.story-header-wrapper .brand-dropdown-arrow.open {
  transform: rotate(180deg);
}
.story-header-wrapper .brand-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  min-width: 170px;
  background: #ffffff;
  border: 0.5px solid #ECECF0;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.10);
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-6px);
  transition: all 0.22s ease;
  z-index: 200;
}
.story-header-wrapper .brand-dropdown.open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.story-header-wrapper .brand-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 18px;
  font-family: "SF Pro", "PingFang SC", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #1C2024;
  text-decoration: none;
  transition: background 0.15s ease;
  white-space: nowrap;
}
.story-header-wrapper .brand-dropdown-item:hover {
  background: #F5F5F7;
}
.story-header-wrapper .brand-dropdown-item:first-child {
  border-bottom: 0.5px solid #ECECF0;
}
@media (max-width: 768px) {
  .story-header-wrapper .brand-dropdown {
    left: 0;
    min-width: 150px;
  }
}

/* ── Auth Button ── */

.story-header-wrapper .auth-login-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 0;
  font-family: "Rubik", "PingFang SC", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  background: linear-gradient(45deg, #000000 0%, #1a1a1a 50%, #666666 100%);
  cursor: pointer;
  transition: opacity 0.2s ease;
  white-space: nowrap;
}
.story-header-wrapper .auth-login-btn:hover {
  opacity: 0.9;
}

/* ── Hamburger Button (hidden on desktop) ── */
.story-header-wrapper .hamburger-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
}

/* ── Mobile Navigation Drawer ── */
.story-header-wrapper .mobile-drawer-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
.story-header-wrapper .mobile-drawer-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.story-header-wrapper .mobile-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  z-index: 2001;
  background: #ffffff;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  flex-direction: column;
  padding: 24px 20px;
  gap: 8px;
  box-shadow: 4px 0 24px rgba(0,0,0,0.08);
}
.story-header-wrapper .mobile-drawer.open {
  transform: translateX(0);
}
.story-header-wrapper .mobile-drawer-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 20px;
  border-bottom: 0.5px solid #D9D9E0;
  margin-bottom: 8px;
}
.story-header-wrapper .mobile-drawer-logo {
  width: 29px;
  height: 29px;
  object-fit: contain;
}
.story-header-wrapper .mobile-drawer-brand {
  font-family: "SF Pro", "PingFang SC", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-weight: 590;
  font-size: 19.64px;
  background: linear-gradient(45deg, #000000 0%, #1a1a1a 50%, #666666 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.story-header-wrapper .mobile-drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}
.story-header-wrapper .mobile-drawer-link {
  font-family: "SF Pro", "PingFang SC", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #1C2024;
  text-decoration: none;
  padding: 14px 16px;
  border-radius: 12px;
  transition: background 0.15s ease;
}
.story-header-wrapper .mobile-drawer-link:hover {
  background: rgba(0,0,0,0.04);
}
.story-header-wrapper .mobile-drawer-link.active {
  color: #000000;
  background: rgba(0, 0, 0, 0.08);
}
.story-header-wrapper .mobile-drawer-close {
  align-self: flex-end;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: rgba(0,0,0,0.04);
  border-radius: 50%;
  cursor: pointer;
  margin-bottom: 8px;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .story-header-wrapper .header-inner {
    padding: 16px 40px;
  }
}
@media (max-width: 768px) {
  .story-header-wrapper .header-inner {
    padding: 12px 20px;
    flex-wrap: nowrap;
    gap: 8px;
  }
  /* Hide brand logo & text & arrow on mobile; show hamburger */
  .story-header-wrapper .header-logo-img,
  .story-header-wrapper .brand-text,
  .story-header-wrapper .brand-dropdown-arrow {
    display: none;
  }
  .story-header-wrapper .hamburger-btn {
    display: flex;
  }
  .story-header-wrapper .nav-links {
    display: none;
  }
  .story-header-wrapper .mobile-drawer-overlay {
    display: block;
  }
}
@media (max-width: 768px) {
  .story-header-wrapper .header {
    display: none !important;
  }
}
@media (max-width: 480px) {
  .story-header-wrapper .header-inner {
    padding: 10px 16px;
  }
  .story-header-wrapper .nav-link {
    font-size: 13px;
    padding: 8px 10px;
  }
}

/* ============================================================
   桌面端侧边导航栏 (>768px) — 抖音 Web 风格
   ============================================================ */
@media (min-width: 769px) {
  /* 所有页面内容右移，为侧边栏留出空间 */
  body {
    padding-left: 220px;
  }

  .story-header-wrapper .header {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 220px;
    background: #0d1525;
    border-bottom: none;
    border-right: 0.5px solid rgba(255, 255, 255, 0.08);
    z-index: 1000;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .story-header-wrapper .header-inner {
    flex-direction: column;
    height: 100%;
    padding: 20px 14px;
    gap: 14px;
    max-width: none;
    margin: 0;
    align-items: stretch;
    justify-content: flex-start;
  }

  /* Logo 区域 */
  .story-header-wrapper .brand {
    width: 100%;
    justify-content: flex-start;
    padding: 4px 8px 14px;
    border-bottom: 0.5px solid rgba(255, 255, 255, 0.06);
    margin-bottom: 4px;
  }

  .story-header-wrapper .brand-logo-wrapper {
    gap: 8px;
  }

  .story-header-wrapper .brand-text {
    color: #e8edf5;
    font-size: 18px;
    font-weight: 700;
  }

  .story-header-wrapper .brand-dropdown-arrow {
    color: rgba(255, 255, 255, 0.5);
  }

  /* 导航链接 — 纵向排列 */
  .story-header-wrapper .nav-links {
    flex-direction: column;
    width: 100%;
    gap: 2px;
    flex: 0 1 auto;
  }

  .story-header-wrapper .nav-link {
    width: 100%;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #8896a8;
    transition: all 0.2s ease;
    box-sizing: border-box;
  }

  .story-header-wrapper .nav-link:hover {
    color: #e8edf5;
    background: rgba(255, 255, 255, 0.06);
  }

  .story-header-wrapper .nav-link.active {
    color: #000000;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  /* 搜索 & 用户区 — 推到底部 */
  .story-header-wrapper .header-actions {
    width: 100%;
    flex-direction: column;
    gap: 4px;
    padding: 14px 8px 8px;
    margin-top: auto;
    border-top: 0.5px solid rgba(255, 255, 255, 0.06);
  }

  .story-header-wrapper .search-btn {
    width: 100%;
    justify-content: flex-start;
    padding: 10px 14px;
    border-radius:999px;
    color: #8896a8;
    font-size: 14px;
    gap: 10px;
    height: auto;
    background: transparent;
  }

  .story-header-wrapper .search-btn:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #e8edf5;
  }

  .story-header-wrapper .search-btn svg * {
    stroke: #8896a8;
  }

  .story-header-wrapper .search-btn:hover svg * {
    stroke: #000000;
  }

  .story-header-wrapper .auth-login-btn {
    width: 100%;
    justify-content: center;
    padding: 10px 16px;
    font-size: 14px;
    border-radius:999px;
  }

  .story-header-wrapper .auth-container {
    width: 100%;
  }

  /* 1011 子菜单 — 内嵌展开（hover 显示） */
  .story-header-wrapper .nav-dropdown {
    flex-direction: column;
    width: 100%;
  }

  .story-header-wrapper .nav-dropdown-menu {
    position: static;
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0 0 0 14px;
    opacity: 1;
    visibility: visible;
    transform: none;
    display: none;
    min-width: auto;
  }

  .story-header-wrapper .nav-dropdown:hover .nav-dropdown-menu,
  .story-header-wrapper .nav-dropdown-menu:hover {
    display: block;
  }

  .story-header-wrapper .nav-dropdown-item {
    color: #8896a8;
    font-size: 13px;
    padding: 8px 14px;
    border-radius: 6px;
  }

  .story-header-wrapper .nav-dropdown-item:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #e8edf5;
  }

  .story-header-wrapper .nav-dropdown-item.active {
    color: #000000;
    background: rgba(0, 0, 0, 0.1);
  }

  /* Brand 下拉菜单位置修正 */
  .story-header-wrapper .brand-dropdown {
    left: 0;
    top: calc(100% + 8px);
    background: #141f33;
    border: 0.5px solid rgba(255, 255, 255, 0.10);
  }

  .story-header-wrapper .brand-dropdown-item {
    color: #e8edf5;
  }

  .story-header-wrapper .brand-dropdown-item:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  .story-header-wrapper .brand-dropdown-item:first-child {
    border-bottom: 0.5px solid rgba(255, 255, 255, 0.08);
  }

  /* 桌面端隐藏汉堡按钮和移动端抽屉 */
  .story-header-wrapper .hamburger-btn {
    display: none !important;
  }

  .story-header-wrapper .mobile-drawer-overlay {
    display: none !important;
  }

  .story-header-wrapper .mobile-drawer {
    display: none !important;
  }
}

`;

    const style = document.createElement('style');
    style.id = 'story-header-styles';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  // ============================================================
  //  构建移动端抽屉导航 HTML
  // ============================================================
  function buildMobileDrawerHtml() {
    const navItems = [
      { href: '1011.html', label: '1011' },
      { href: 'index.html', label: '剧场' },
      { href: 'actors.html', label: '角色 IP' },
      { href: 'studio.html', label: '经纪人' },
      { href: 'narrator.html', label: '创作' },
      { href: 'publish.html', label: '发布' },
      { href: 'whitepaper.html', label: '白皮书' },
    ];

    const is1011Page = currentPage === '1011.html' || currentPage === 'task.html';
    const isPublishPage = currentPage === 'publish.html' || currentPage === 'publish-video.html' || currentPage === 'create-actor.html';
    const navLinksHtml = navItems.map(item => {
      const activeClass = item.href === currentPage ? ' active' : '';
      if (item.href === '1011.html') {
        return `
<a class="mobile-drawer-link${is1011Page ? ' active' : ''}" style="cursor:default;">1011 ▾</a>
<div style="display:flex;flex-direction:column;padding-left:20px;gap:2px;">
  <a class="mobile-drawer-link${currentPage === '1011.html' ? ' active' : ''}" href="1011.html" style="font-size:14px;padding:10px 16px;">1011专题</a>
  <a class="mobile-drawer-link${currentPage === '1011-museum.html' ? ' active' : ''}" href="1011-museum.html" target="_blank" style="font-size:14px;padding:10px 16px;">1011博物馆</a>
  <a class="mobile-drawer-link${currentPage === 'task.html' ? ' active' : ''}" href="task.html" style="font-size:14px;padding:10px 16px;">1011诺亚方舟</a>
</div>`;
      }
      if (item.href === 'publish.html') {
        return `
<a class="mobile-drawer-link${isPublishPage ? ' active' : ''}" style="cursor:default;">发布 ▾</a>
<div style="display:flex;flex-direction:column;padding-left:20px;gap:2px;">
  <a class="mobile-drawer-link${currentPage === 'publish.html' ? ' active' : ''}" href="publish.html" style="font-size:14px;padding:10px 16px;">发布短剧</a>
  <a class="mobile-drawer-link${currentPage === 'publish-video.html' ? ' active' : ''}" href="publish-video.html" style="font-size:14px;padding:10px 16px;">发布视频</a>
  <a class="mobile-drawer-link${currentPage === 'create-actor.html' ? ' active' : ''}" href="create-actor.html" style="font-size:14px;padding:10px 16px;">发行角色IP</a>
</div>`;
      }
      return `<a class="mobile-drawer-link${activeClass}" href="${item.href}">${item.label}</a>`;
    }).join('');

    return `
<div class="mobile-drawer-overlay" id="mobileDrawerOverlay"></div>
<nav class="mobile-drawer" id="mobileDrawer">
  <button class="mobile-drawer-close" id="mobileDrawerClose" aria-label="Close menu">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4L4 12" stroke="#1C2024" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M4 4L12 12" stroke="#1C2024" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
  <div class="mobile-drawer-header">
    <img class="mobile-drawer-logo" src="image/storyfun-logo-icon.png" width="29" height="29" alt="Story.fun" />
    <span class="mobile-drawer-brand">Story.fun</span>
  </div>
  <div class="mobile-drawer-nav">
    ${navLinksHtml}
  </div>
</nav>`;
  }

  // ============================================================
  //  绑定移动端抽屉事件
  // ============================================================
  function bindMobileDrawerEvents() {
    const hamburger = document.querySelector('.hamburger-btn');
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('mobileDrawerOverlay');
    const closeBtn = document.getElementById('mobileDrawerClose');

    if (!hamburger || !drawer || !overlay) return;

    function openDrawer() {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);
  }

  // ============================================================
  //  插入 Header HTML
  // ============================================================
  function insertHeaderHtml(html) {
    injectHeaderStyles();

    // 用 wrapper 包裹以应用命名空间样式
    const wrappedHtml = '<div class="story-header-wrapper">' + html + '</div>';

    const placeholders = document.querySelectorAll('#header-placeholder');
    if (placeholders.length > 0) {
      placeholders.forEach(placeholder => {
        placeholder.outerHTML = wrappedHtml;
      });
    }

    // 追加移动端抽屉导航 HTML
    const wrapper = document.querySelector('.story-header-wrapper');
    if (wrapper) {
      wrapper.insertAdjacentHTML('beforeend', buildMobileDrawerHtml());
    }

    // 标记当前页面导航为 active
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
        // 如果该 nav-link 位于 nav-dropdown 内，标记父级 1011 link 也 active
        const parentDropdown = link.closest('.nav-dropdown');
        if (parentDropdown) {
          const parentLink = parentDropdown.querySelector('.nav-link');
          if (parentLink) parentLink.classList.add('active');
        }
      }
    });
    // 标记 dropdown-item 的 active
    const dropItems = document.querySelectorAll('.nav-dropdown-item');
    dropItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href === currentPage && href) {
        item.classList.add('active');
      }
    });

    // 绑定移动端抽屉事件
    bindMobileDrawerEvents();

    // 绑定 Logo 下拉菜单
    bindBrandDropdown();

    document.dispatchEvent(new CustomEvent('header-loaded'));
  }

  // ============================================================
  //  绑定 Logo 下拉菜单点击事件
  // ============================================================
  function bindBrandDropdown() {
    const wrapper = document.getElementById('brandLogoWrapper');
    const dropdown = document.getElementById('brandDropdown');
    const arrow = document.querySelector('.brand-dropdown-arrow');
    if (!wrapper || !dropdown) return;

    wrapper.addEventListener('click', function(e) {
      // 如果点击的是下拉菜单的 a 链接，不做 toggle 处理（让 a 的默认跳转生效）
      if (e.target.closest('.brand-dropdown')) return;
      e.stopPropagation();
      dropdown.classList.toggle('open');
      if (arrow) arrow.classList.toggle('open');
    });

    // 点击页面其他地方关闭
    document.addEventListener('click', function() {
      dropdown.classList.remove('open');
      if (arrow) arrow.classList.remove('open');
    });
  }


  // ============================================================
  //  Fallback HTML（当 header.html 加载失败时使用）
  // ============================================================
  function insertHeaderFallback() {
    const html = `
<div class="header">
  <div class="header-inner">
    <div class="brand">
      <button class="hamburger-btn" aria-label="Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20" stroke="#1C2024" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 12H20" stroke="#1C2024" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 18H20" stroke="#1C2024" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="brand-logo-wrapper" id="brandLogoWrapper">
        <img class="header-logo-img" src="image/storyfun-logo-icon.png" width="29" height="29" alt="Story.fun" />
        <span class="brand-text">Story.fun</span>
        <svg class="brand-dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 5L6 8L9 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="brand-dropdown" id="brandDropdown">
          <a class="brand-dropdown-item" href="index.html">🎭 用户端</a>
          <a class="brand-dropdown-item" href="admin/admin-mining.html">⚙️ 后台管理</a>
        </div>
      </div>
    </div>

    <nav class="nav-links">
      <div class="nav-dropdown">
        <a class="nav-link nav-link-1011" href="1011.html">1011</a>
        <div class="nav-dropdown-menu">
          <a class="nav-dropdown-item" href="1011.html">1011专题</a>
          <a class="nav-dropdown-item" href="1011-museum.html" target="_blank">1011博物馆</a>
          <a class="nav-dropdown-item" href="task.html">1011诺亚方舟</a>
        </div>
      </div>
      <a class="nav-link" href="recommend.html">推荐</a>
      <a class="nav-link" href="index.html">剧场</a>
      <a class="nav-link" href="actors.html">角色 IP</a>
      <a class="nav-link" href="studio.html">经纪人</a>
      <a class="nav-link" href="narrator.html">创作</a>
      <div class="nav-dropdown">
        <a class="nav-link" href="publish.html">发布</a>
        <div class="nav-dropdown-menu">
          <a class="nav-dropdown-item" href="publish.html">发布短剧</a>
          <a class="nav-dropdown-item" href="publish-video.html">发布视频</a>
          <a class="nav-dropdown-item" href="create-actor.html">发行角色IP</a>
        </div>
      </div>
      <a class="nav-link" href="whitepaper.html">白皮书</a>
    </nav>
    <div class="header-actions">
      <button class="search-btn" aria-label="Search">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60646C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      </button>
      <div class="auth-container" id="authContainer"></div>
    </div>
  </div>
</div>
`;
    insertHeaderHtml(html);
  }

  // ============================================================
  //  XHR 回退加载
  // ============================================================
  function tryLoadHeaderByXHR() {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', headerPath);
      xhr.onload = function() {
        if (xhr.status === 200 || xhr.status === 0) {
          insertHeaderHtml(xhr.responseText);
        } else {
          console.warn('Header XHR 状态异常:', xhr.status);
          insertHeaderFallback();
        }
      };
      xhr.onerror = function() {
        console.warn('Header XHR 失败');
        insertHeaderFallback();
      };
      xhr.send();
    } catch (error) {
      console.warn('Header XHR 异常:', error);
      insertHeaderFallback();
    }
  }

  // ============================================================
  //  主加载流程
  // ============================================================
  // 立即使用内联 HTML 渲染（保证 Web 端始终可见），
  // 然后异步尝试加载 header.html 以获取最新版本
  var headerRendered = false;
  injectHeaderStyles();

  function renderInlineHeader() {
    if (headerRendered) return;
    headerRendered = true;
    insertHeaderFallback();
  }

  // 立即渲染
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderInlineHeader);
  } else {
    renderInlineHeader();
  }
})();