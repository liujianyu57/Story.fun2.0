// ============================================================
// StoryFun 侧边导航栏加载器 (桌面端)
// 替代顶部 header，参考抖音 Web 侧边导航风格
// 自动注入 sidebar 到页面中（内嵌模式，不依赖 fetch）
// ============================================================

(function() {
    'use strict';

    // 内嵌侧边栏样式
    function injectStyles() {
        if (document.getElementById('sb-injected-styles')) return;
        var style = document.createElement('style');
        style.id = 'sb-injected-styles';
        style.textContent = [
            '.app-sidebar{position:fixed;top:0;left:0;bottom:0;z-index:900;width:220px;background:rgba(10,10,10,0.92);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-right:1px solid rgba(255,255,255,0.06);display:flex;flex-direction:column;padding:0 12px;transition:transform 0.3s ease;overflow-y:auto}',
            '.sb-logo{display:flex;align-items:center;gap:10px;padding:20px 12px 24px;text-decoration:none;flex-shrink:0}',
            '.sb-logo-img{width:32px;height:32px;border-radius:8px;flex-shrink:0}',
            '.sb-logo-text{font-size:18px;font-weight:700;color:#fff;letter-spacing:-0.3px;white-space:nowrap}',
            '.sb-logo-sub{font-size:10px;color:#a78bfa;font-weight:400;line-height:1.2}',
            '.sb-nav{display:flex;flex-direction:column;gap:2px;flex:1;padding:4px 0}',
            '.sb-nav-item{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;color:#a1a1aa;text-decoration:none;font-size:15px;font-weight:500;transition:all 0.2s ease;cursor:pointer;border:none;background:none;text-align:left;width:100%}',
            '.sb-nav-item:hover{background:rgba(255,255,255,0.06);color:#fff}',
            '.sb-nav-item.active{color:#fff;background:rgba(167,139,250,0.12)}',
            '.sb-nav-item svg{width:22px;height:22px;flex-shrink:0;stroke:currentColor;fill:none}',
            '.sb-nav-item .sb-label{white-space:nowrap}',
            '.sb-bottom{padding:12px 0 20px;border-top:1px solid rgba(255,255,255,0.06);flex-shrink:0}',
            '.sb-user{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;transition:background 0.15s;text-decoration:none}',
            '.sb-user:hover{background:rgba(255,255,255,0.06)}',
            '.sb-user-avatar{width:32px;height:32px;border-radius:50%;object-fit:cover;border:1.5px solid rgba(255,255,255,0.15);flex-shrink:0;background:rgba(255,255,255,0.08)}',
            '.sb-user-info{flex:1;min-width:0}',
            '.sb-user-name{font-size:13px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
            '.sb-user-sub{font-size:11px;color:#71717a}',
            '.sb-main-offset{margin-left:220px}',
            '@media(max-width:768px){.app-sidebar{display:none}}'
        ].join('');
        document.head.appendChild(style);
    }

    // 内嵌侧边栏 HTML
    function buildSidebarHTML() {
        return '' +
            '<aside class="app-sidebar" id="appSidebar">' +
                '<a href="index.html" class="sb-logo">' +
                    '<img src="image/storyfun-logo-icon.png" alt="StoryFun" class="sb-logo-img">' +
                    '<div>' +
                        '<div class="sb-logo-text">StoryFun</div>' +
                        '<div class="sb-logo-sub">故事即力量</div>' +
                    '</div>' +
                '</a>' +
                '<nav class="sb-nav" id="sbNav">' +
                    '<a href="1011.html" class="sb-nav-item" data-page="1011.html">' +
                        '<svg viewBox="0 0 24 24" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/></svg>' +
                        '<span class="sb-label">1011</span>' +
                    '</a>' +
                    '<a href="recommend.html" class="sb-nav-item" data-page="recommend.html">' +
                        '<svg viewBox="0 0 24 24" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></svg>' +
                        '<span class="sb-label">推荐</span>' +
                    '</a>' +
                    '<a href="index.html" class="sb-nav-item" data-page="index.html">' +
                        '<svg viewBox="0 0 24 24" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' +
                        '<span class="sb-label">剧场</span>' +
                    '</a>' +
                    '<a href="actors.html" class="sb-nav-item" data-page="actors.html">' +
                        '<svg viewBox="0 0 24 24" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' +
                        '<span class="sb-label">角色 IP</span>' +
                    '</a>' +
                    '<a href="studio.html" class="sb-nav-item" data-page="studio.html">' +
                        '<svg viewBox="0 0 24 24" stroke-width="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>' +
                        '<span class="sb-label">经纪人</span>' +
                    '</a>' +
                    '<a href="narrator.html" class="sb-nav-item" data-page="narrator.html">' +
                        '<svg viewBox="0 0 24 24" stroke-width="1.8"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>' +
                        '<span class="sb-label">创作</span>' +
                    '</a>' +
                    '<a href="fund-dashboard.html" class="sb-nav-item" data-page="fund-dashboard.html">' +
                        '<svg viewBox="0 0 24 24" stroke-width="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' +
                        '<span class="sb-label">资金</span>' +
                    '</a>' +
                    '<a href="rewards.html" class="sb-nav-item" data-page="rewards.html">' +
                        '<svg viewBox="0 0 24 24" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
                        '<span class="sb-label">奖励</span>' +
                    '</a>' +
                    '<a href="whitepaper.html" class="sb-nav-item" data-page="whitepaper.html">' +
                        '<svg viewBox="0 0 24 24" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' +
                        '<span class="sb-label">白皮书</span>' +
                    '</a>' +
                '</nav>' +
                '<div class="sb-bottom">' +
                    '<a href="profile-center.html" class="sb-user" id="sbUser">' +
                        '<img class="sb-user-avatar" id="sbAvatarImg" src="" alt="avatar">' +
                        '<div class="sb-user-info">' +
                            '<div class="sb-user-name" id="sbUserName">登录</div>' +
                            '<div class="sb-user-sub">查看个人主页 ›</div>' +
                        '</div>' +
                    '</a>' +
                '</div>' +
            '</aside>';
    }

    // 注入 sidebar HTML 到 body 最前面
    function injectSidebarHTML() {
        var html = buildSidebarHTML();
        var temp = document.createElement('div');
        temp.innerHTML = html;
        var sidebar = temp.querySelector('.app-sidebar');
        if (sidebar) {
            document.body.insertBefore(sidebar, document.body.firstChild);
        }
    }

    // 执行 sidebar 中的脚本逻辑
    function runSidebarScripts() {
        // 高亮当前页面
        var path = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.sb-nav-item').forEach(function(item) {
            var href = item.getAttribute('href');
            if (href === path) {
                item.classList.add('active');
            }
        });

        // 给 body 添加偏移 class
        document.body.classList.add('sb-main-offset');

        // 刷新登录状态
        function refreshAuth() {
            var isLoggedIn = !!localStorage.getItem('storyfun_token');
            var avatarImg = document.getElementById('sbAvatarImg');
            var nameEl = document.getElementById('sbUserName');
            if (avatarImg && nameEl) {
                if (isLoggedIn) {
                    var savedAvatar = localStorage.getItem('storyfun_avatar');
                    if (savedAvatar) avatarImg.src = savedAvatar;
                    else avatarImg.src = 'image/character-empty-state.svg';
                    var savedName = localStorage.getItem('storyfun_nickname');
                    nameEl.textContent = savedName || '用户';
                } else {
                    avatarImg.src = 'image/character-empty-state.svg';
                    nameEl.textContent = '登录';
                }
            }
        }
        refreshAuth();
    }

    // 主流程
    function init() {
        injectStyles();
        injectSidebarHTML();
        runSidebarScripts();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();