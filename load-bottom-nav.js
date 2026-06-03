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
/* ── Story.fun Bottom Navigation Styles ── */
.bottom-nav-wrapper {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(60px);
  -webkit-backdrop-filter: blur(60px);
  border-top: 0.5px solid #D9D9E0;
}

.bottom-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  max-width: 100%;
  margin: 0 auto;
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex: 1;
  height: 100%;
  padding: 4px 4px 2px;
  text-decoration: none;
  color: #60646C;
  transition: color 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.bottom-nav-item.active {
  color: #1C2024;
}

.bottom-nav-icon {
  width: 28px;
  height: 28px;
  display: block;
  flex-shrink: 0;
}

.bottom-nav-label {
  font-family: "SF Pro", "PingFang SC", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 0.008em;
  text-align: center;
}

/* ── 只在 H5 手机宽度下显示 ── */
@media (max-width: 768px) {
  .bottom-nav-wrapper {
    display: block;
  }

  /* 给页面底部留出空间，避免内容被底部导航遮挡 */
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
    document.dispatchEvent(new CustomEvent('bottom-nav-loaded'));
  }

  // ============================================================
  //  Fallback HTML
  // ============================================================
  function insertFallbackBottomNav() {
    const html = `<div class="bottom-nav-wrapper">
  <div class="bottom-nav">
    <a class="bottom-nav-item" href="recommend.html" data-tab="recommend">
      <svg class="bottom-nav-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.0013 2.33337C20.3165 2.33337 25.668 7.68487 25.668 14C25.668 20.3152 20.3165 25.6667 14.0013 25.6667C7.68606 25.6667 2.33464 20.3152 2.33464 14C2.33464 7.68487 7.68606 2.33337 14.0013 2.33337Z" stroke="currentColor" stroke-width="1.4"/>
        <path d="M11.668 9.91671L19.8346 14L11.668 18.0834V9.91671Z" fill="currentColor"/>
      </svg>
      <span class="bottom-nav-label">推荐</span>
    </a>
    <a class="bottom-nav-item" href="index.html" data-tab="theater">
      <svg class="bottom-nav-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M24.8376 14.0001C24.8376 19.9861 19.9849 24.8388 13.9989 24.8388C8.01281 24.8388 3.16016 19.9861 3.16016 14.0001C3.16016 8.014 8.01281 3.16135 13.9989 3.16135C19.9849 3.16135 24.8376 8.014 24.8376 14.0001Z" fill="none" stroke="currentColor" stroke-width="1.49333" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18.9263 14.4331C19.2596 14.2407 19.2596 13.7595 18.9263 13.5671L11.9101 9.51633C11.5768 9.32388 11.1601 9.56444 11.1601 9.94934V18.0509C11.1601 18.4358 11.5768 18.6763 11.9101 18.4839L18.9263 14.4331Z" fill="currentColor"/>
      </svg>
      <span class="bottom-nav-label">剧场</span>
    </a>

    <a class="bottom-nav-item" href="actors.html" data-tab="nft">
      <svg class="bottom-nav-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.9053 2.66797C13.9639 2.63382 14.0361 2.63382 14.0947 2.66797L23.6611 8.24805C23.719 8.2818 23.7549 8.34415 23.7549 8.41113V19.5889C23.7549 19.6559 23.719 19.7182 23.6611 19.752L14.0947 25.332C14.0361 25.3662 13.9639 25.3662 13.9053 25.332L4.33887 19.752C4.28101 19.7182 4.24512 19.6558 4.24512 19.5889V8.41113C4.24512 8.34415 4.28101 8.2818 4.33887 8.24805L13.9053 2.66797Z" stroke="currentColor" stroke-width="1.49"/>
        <path d="M22.6563 8.44303C23.016 8.24379 23.4695 8.3734 23.669 8.73307C23.8682 9.09289 23.7377 9.54634 23.3779 9.74576C21.6325 10.7132 20.1068 11.5637 18.5801 12.4137C17.0633 13.2582 15.5452 14.1028 13.8125 15.0631V24.3102C13.8125 24.7217 13.4788 25.0553 13.0674 25.0553C12.656 25.0552 12.3223 24.7216 12.3223 24.3102V14.4225L7.04103 11.3434C6.68599 11.136 6.56634 10.6791 6.77345 10.3239C6.98081 9.96862 7.43763 9.84903 7.79298 10.0563L13.584 13.4333C13.5983 13.4416 13.6115 13.4515 13.625 13.4606C15.1372 12.6218 16.4962 11.8682 17.8545 11.112C19.3813 10.2619 20.9093 9.41129 22.6563 8.44303ZM8.43947 5.54069C8.64694 5.18573 9.10378 5.0659 9.459 5.27311L13.6924 7.74283C14.0472 7.95035 14.1671 8.40721 13.96 8.76237C13.7526 9.11733 13.2957 9.237 12.9404 9.02994L8.70704 6.56022C8.35201 6.35277 8.23224 5.89593 8.43947 5.54069Z" fill="currentColor"/>
      </svg>
      <span class="bottom-nav-label">NFT</span>
    </a>
    <a class="bottom-nav-item" href="narrator.html" data-tab="create">
      <svg class="bottom-nav-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.168 4.66666H5.83464C5.1903 4.66666 4.66797 5.18899 4.66797 5.83332V8.16666C4.66797 8.81099 5.1903 9.33332 5.83464 9.33332H22.168C22.8123 9.33332 23.3346 8.81099 23.3346 8.16666V5.83332C23.3346 5.18899 22.8123 4.66666 22.168 4.66666Z" stroke="currentColor" stroke-width="1.49" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10.5013 14H5.83464C5.1903 14 4.66797 14.5223 4.66797 15.1667V22.1667C4.66797 22.811 5.1903 23.3333 5.83464 23.3333H10.5013C11.1456 23.3333 11.668 22.811 11.668 22.1667V15.1667C11.668 14.5223 11.1456 14 10.5013 14Z" stroke="currentColor" stroke-width="1.49" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.332 14H23.332" stroke="currentColor" stroke-width="1.49" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.332 18.6667H23.332" stroke="currentColor" stroke-width="1.49" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.332 23.3333H23.332" stroke="currentColor" stroke-width="1.49" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="bottom-nav-label">创作</span>
    </a>
    <a class="bottom-nav-item" href="profile-center.html" data-tab="profile">
      <svg class="bottom-nav-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.6738 14.7305H9.32617C5.687 14.7307 2.74512 17.6443 2.74512 21.1992V21.627C2.74512 21.9042 2.84106 22.0808 3.04688 22.2393C3.29137 22.4274 3.70498 22.5944 4.33105 22.7158C5.5846 22.9589 7.33226 22.9619 9.32617 22.9619H17.6738C19.7503 22.9619 21.4958 22.9583 22.7275 22.7158C23.3418 22.5949 23.7369 22.4302 23.9668 22.2471C24.1582 22.0946 24.2549 21.9177 24.2549 21.627V21.1992C24.2549 17.6433 21.3131 14.7305 17.6738 14.7305ZM13.7178 2.74512C10.9195 2.74521 8.66017 4.9865 8.66016 7.71777C8.66016 10.4489 10.9194 12.6894 13.7178 12.6895C16.5157 12.6895 18.7754 10.448 18.7754 7.71777C18.7754 4.98744 16.5159 2.74512 13.7178 2.74512Z" stroke="currentColor" stroke-width="1.49"/>
      </svg>
      <span class="bottom-nav-label">我的</span>
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
