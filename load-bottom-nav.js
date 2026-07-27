// ============================================================
//  Story.fun - 底部导航栏加载脚本 (H5 手机端)
//  在屏幕宽度 ≤ 768px 时自动显示
// ============================================================

(function() {
  'use strict';

  let currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (!currentPage || currentPage === '' || currentPage.endsWith('/')) {
    currentPage = 'index.html';
  }

  // ============================================================
  //  注入底部导航样式（仅一次）
  // ============================================================
  function injectBottomNavStyles() {
    if (document.getElementById('story-bottom-nav-styles')) return;

    const css = `
/* ── Story.fun Bottom Navigation ── */
.bottom-nav-wrapper {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border-top: 0.5px solid rgba(0, 0, 0, 0.08);
}

.bottom-nav {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 52px;
  padding-bottom: env(safe-area-inset-bottom, 0);
  max-width: 100%;
  margin: 0 auto;
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 3px;
  flex: 1;
  height: 100%;
  padding: 0 0 6px;
  text-decoration: none;
  color: #8E8E93;
  transition: color 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.bottom-nav-item.active {
  color: #00BBA7;
}

.bottom-nav-icon {
  width: 26px;
  height: 26px;
  display: block;
  flex-shrink: 0;
}

.bottom-nav-label {
  font-family: "SF Pro", "PingFang SC", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
  font-size: 10px;
  line-height: 1;
  letter-spacing: 0.02em;
  text-align: center;
}

.bottom-nav-item.active .bottom-nav-label {
  font-weight: 600;
}

/* 创作 - 仅加号，无文字，垂直居中 */
.bottom-nav-item.bottom-nav-create {
  justify-content: center;
  padding-bottom: 2px;
}

.bottom-nav-icon-create {
  width: 28px;
  height: 28px;
  display: block;
  flex-shrink: 0;
}

/* 暗色导航 - 首页视频沉浸 */
.bottom-nav-wrapper.nav-dark {
  background: rgba(15, 24, 37, 0.82);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border-top: 0.5px solid rgba(255, 255, 255, 0.08);
}

.bottom-nav-wrapper.nav-dark .bottom-nav-item {
  color: rgba(255, 255, 255, 0.55);
}

.bottom-nav-wrapper.nav-dark .bottom-nav-item.active {
  color: #00BBA7;
}

/* ── 只在 H5 手机宽度下显示 ── */
@media (max-width: 768px) {
  .bottom-nav-wrapper {
    display: block;
  }

  body {
    padding-bottom: 60px;
  }
}
`;

    const style = document.createElement('style');
    style.id = 'story-bottom-nav-styles';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  // ============================================================
  //  激活当前页面对应的 tab 项
  // ============================================================
  function activateCurrentTab() {
    const items = document.querySelectorAll('.bottom-nav-item');
    items.forEach(item => {
      const href = item.getAttribute('href');
      if (href === currentPage) {
        item.classList.add('active');
      }
    });
  }

  // ============================================================
  //  插入底部导航 HTML
  // ============================================================
  function insertBottomNav(html) {
    injectBottomNavStyles();

    const wrappedHtml = '<div class="story-bottom-nav-wrapper">' + html + '</div>';

    const placeholders = document.querySelectorAll('#bottom-nav-placeholder');
    if (placeholders.length > 0) {
      placeholders.forEach(placeholder => {
        placeholder.outerHTML = wrappedHtml;
      });
    }

    activateCurrentTab();
    updateHomeNavItem();
    applyNavTheme();
    bindHomeToggle();
    document.dispatchEvent(new CustomEvent('bottom-nav-loaded'));
  }

  // ============================================================
  //  首页按钮双页面模式
  //  - recommend.html → 显示"首页" → 跳转 index.html
  //  - index.html → 显示"返回" → 跳转 recommend.html
  // ============================================================
  function updateHomeNavItem() {
    var navHome = document.getElementById('navHome');
    if (!navHome) return;

    var label = navHome.querySelector('.bottom-nav-label');

    if (currentPage === 'index.html') {
      sessionStorage.setItem('nav_return_mode', '1');
      label.textContent = '返回';
      navHome.setAttribute('href', 'recommend.html');
      navHome.classList.add('active');
    } else if (currentPage === 'recommend.html') {
      sessionStorage.removeItem('nav_return_mode');
      label.textContent = '首页';
      navHome.setAttribute('href', 'index.html');
    } else if (sessionStorage.getItem('nav_return_mode') === '1') {
      label.textContent = '返回';
      navHome.setAttribute('href', 'index.html');
    } else {
      label.textContent = '首页';
      navHome.setAttribute('href', 'recommend.html');
    }
  }

  // ============================================================
  //  首页点击切换 Feed/列表
  // ============================================================
  function bindHomeToggle() {
    // 首页按钮已改为双页面跳转模式，不再拦截点击做 feed/list 切换
  }

  // ============================================================
  //  首页暗色导航
  // ============================================================
  function applyNavTheme() {
    const isHome = currentPage === 'recommend.html';
    const wrapper = document.querySelector('.bottom-nav-wrapper');
    if (wrapper) {
      wrapper.classList.toggle('nav-dark', isHome);
    }
  }

  // ============================================================
  //  Fallback HTML
  // ============================================================
  function insertFallbackBottomNav() {
    const html = `<div class="bottom-nav-wrapper">
  <div class="bottom-nav">
    <a class="bottom-nav-item" href="recommend.html" data-tab="home" id="navHome">
      <svg class="bottom-nav-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform:rotate(90deg)">
        <path d="M20 8l-4-4m0 0l-4 4m4-4v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4 16l4 4m0 0l4-4m-4 4V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="bottom-nav-label">首页</span>
    </a>
    <a class="bottom-nav-item" href="actors.html" data-tab="actors">
      <svg class="bottom-nav-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3h12l8 8H3V3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M3 11v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M7 14h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M7 17h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span class="bottom-nav-label">演员IP</span>
    </a>
    <a class="bottom-nav-item bottom-nav-create" href="publish.html" data-tab="create">
      <svg class="bottom-nav-icon-create" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.5"/>
        <path d="M12 7v10M7 12h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </a>
    <a class="bottom-nav-item" href="studio.html" data-tab="studio">
      <svg class="bottom-nav-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="7" y="12" width="3" height="4" rx="0.5" stroke="currentColor" stroke-width="1.3"/>
        <rect x="14" y="12" width="3" height="4" rx="0.5" stroke="currentColor" stroke-width="1.3"/>
        <path d="M2 7h20M10 12v4m4-4v4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      </svg>
      <span class="bottom-nav-label">经纪工坊</span>
    </a>
    <a class="bottom-nav-item" href="profile-center.html" data-tab="profile">
      <svg class="bottom-nav-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/>
        <path d="M5 21a7 7 0 0 1 14 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span class="bottom-nav-label">我</span>
    </a>
  </div>
</div>`;
    insertBottomNav(html);

  }

  // ============================================================
  //  XHR 回退加载
  // ============================================================
  function tryLoadByXHR() {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'bottom-nav.html');
      xhr.onload = function() {
        if (xhr.status === 200 || xhr.status === 0) {
          insertBottomNav(xhr.responseText);
        } else {
          console.warn('Bottom nav XHR 状态异常:', xhr.status);
          insertFallbackBottomNav();
        }
      };
      xhr.onerror = function() {
        console.warn('Bottom nav XHR 失败');
        insertFallbackBottomNav();
      };
      xhr.send();
    } catch (error) {
      console.warn('Bottom nav XHR 异常:', error);
      insertFallbackBottomNav();
    }
  }

  // ============================================================
  //  主加载流程
  // ============================================================
  fetch('bottom-nav.html')
    .then(response => {
      if (!response.ok) throw new Error('Bottom nav 加载失败');
      return response.text();
    })
    .then(insertBottomNav)
    .catch(err => {
      console.warn('Bottom nav fetch 失败，尝试 XHR 或直接回退:', err);
      tryLoadByXHR();
    });
})();