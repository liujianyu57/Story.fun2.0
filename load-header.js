// ============================================================
//  Story.fun - 统一 Header 加载脚本
//  自包含 Header 样式（自动注入），各页面无需重复编写
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
  background: linear-gradient(45deg, #05DF72 0%, #00BBA7 50%, #00B8DB 100%);
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
  color: #00BBA7;
  border-radius: 999px;
}
.story-header-wrapper .header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}
.story-header-wrapper .lang-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 6px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 32px;
  font-family: "SF Pro", "PingFang SC", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #60646C;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.story-header-wrapper .lang-btn:hover {
  background: rgba(0,0,0,0.04);
}
.story-header-wrapper .lang-btn svg {
  flex-shrink: 0;
}
.story-header-wrapper .auth-container {
  display: flex;
  align-items: center;
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
  background: linear-gradient(45deg, #05DF72 0%, #00BBA7 50%, #00B8DB 100%);
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
  background: linear-gradient(45deg, #05DF72 0%, #00BBA7 50%, #00B8DB 100%);
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
  color: #00BBA7;
  background: rgba(0, 187, 167, 0.08);
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
  /* Hide brand logo & text on mobile; show hamburger */
  .story-header-wrapper .header-logo-img,
  .story-header-wrapper .brand-text {
    display: none;
  }
  .story-header-wrapper .hamburger-btn {
    display: flex;
  }
  .story-header-wrapper .nav-links {
    display: none;
  }
  .story-header-wrapper .lang-btn span {
    display: none;
  }
  .story-header-wrapper .mobile-drawer-overlay {
    display: block;
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
      { href: 'index.html', label: '剧场' },
      { href: 'actors.html', label: 'NFT' },
      { href: 'narrator.html', label: '创作' },
      { href: 'rewards.html', label: '收益' },
      { href: 'mining.html', label: '挖矿' },
      { href: 'about.html', label: '关于我们' },
    ];

    const navLinksHtml = navItems.map(item => {
      const activeClass = item.href === currentPage ? ' active' : '';
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
      }
    });

    // 绑定移动端抽屉事件
    bindMobileDrawerEvents();

    document.dispatchEvent(new CustomEvent('header-loaded'));
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
      <img class="header-logo-img" src="image/storyfun-logo-icon.png" width="29" height="29" alt="Story.fun" />
      <span class="brand-text">Story.fun</span>
    </div>

    <nav class="nav-links">
      <a class="nav-link" href="index.html">剧场</a>
      <a class="nav-link" href="actors.html">NFT</a>
      <a class="nav-link" href="narrator.html">创作</a>
      <a class="nav-link" href="rewards.html">收益</a>
      <a class="nav-link" href="mining.html">挖矿</a>
      <a class="nav-link" href="about.html">关于我们</a>
    </nav>
    <div class="header-actions">
      <button class="lang-btn" aria-label="Language">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60646C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span>Language</span>
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
  fetch(headerPath)
    .then(response => {
      if (!response.ok) throw new Error('Header 加载失败');
      return response.text();
    })
    .then(insertHeaderHtml)
    .catch(err => {
      console.warn('Header fetch 失败，尝试 XHR 或直接回退:', err);
      tryLoadHeaderByXHR();
    });
})();
