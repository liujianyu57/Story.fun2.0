// ============================================================
// StoryFun 桌面端顶栏加载器
// 自包含 Desktop Header 样式 + HTML + 交互逻辑
// 所有页面统一引入此脚本即可
// ============================================================

(function() {
    'use strict';

    // 内嵌 Desktop Header 样式
    function injectStyles() {
        if (document.getElementById('dh-injected-styles')) return;
        var style = document.createElement('style');
        style.id = 'dh-injected-styles';
        style.textContent = [
            '.desktop-header{position:fixed;top:0;left:0;right:0;justify-content:flex-end;z-index:151;height:56px;padding:0 20px;display:flex;align-items:center;gap:12px;background:#fff;border-bottom:none}',
            '.desktop-header .dh-search{position:absolute;left:50%;transform:translateX(-50%);width:520px;min-width:0;display:flex;align-items:center;gap:8px;padding:4px 14px;border-radius:999px;background:rgba(0,0,0,0.04);border:1px solid transparent;transition:all .2s}',
            '.desktop-header .dh-search:focus-within{border-color:#00b388;background:#fff;box-shadow:0 0 0 3px rgba(0,179,136,.12)}',
            '.desktop-header .dh-search svg{width:16px;height:16px;flex-shrink:0;color:rgba(0,0,0,.35)}',
            '.desktop-header .dh-search input{flex:1;border:none;outline:none;background:none;font-size:13px;color:#13202e;font-family:inherit}',
            '.desktop-header .dh-search input::placeholder{color:rgba(0,0,0,.35)}',
            '.desktop-header .dh-search-btn{padding:3px 12px;height:auto;border-radius:6px;border:none;background:rgba(0,0,0,.06);color:rgba(0,0,0,.5);font-size:12px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;margin-right:-4px}',
            '.desktop-header .dh-search-btn:hover{background:#00b388;color:#fff;border-color:#00b388}',
            '.desktop-header .dh-search-btn svg{width:18px;height:18px}',
            '.dh-search-dropdown{display:none;position:absolute;left:0;right:0;top:100%;margin-top:6px;background:#fff;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.1);border:1px solid rgba(0,0,0,.06);padding:16px;z-index:200;max-height:360px;overflow-y:auto}',
            '.dh-search-dropdown.show{display:block}',
            '.dh-search-dropdown .sd-section{margin-bottom:14px}',
            '.dh-search-dropdown .sd-section:last-child{margin-bottom:0}',
            '.dh-search-dropdown .sd-section-title{font-size:12px;font-weight:600;color:#5e6f83;margin-bottom:8px}',
            '.dh-search-dropdown .sd-tags{display:flex;flex-wrap:wrap;gap:6px}',
            '.dh-search-dropdown .sd-tag{padding:4px 12px;border-radius:999px;background:rgba(0,0,0,.04);font-size:12px;color:#13202e;cursor:pointer;transition:all .15s;border:none;font-family:inherit}',
            '.dh-search-dropdown .sd-tag:hover{background:rgba(0,179,136,.1);color:#00b388}',
            '.dh-search-dropdown .sd-list{display:flex;flex-direction:column;gap:2px}',
            '.dh-search-dropdown .sd-item{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-radius:8px;font-size:13px;color:#13202e;cursor:pointer;transition:background .1s}',
            '.dh-search-dropdown .sd-item:hover{background:rgba(0,0,0,.03)}',
            '.dh-search-dropdown .sd-item .sd-del{color:#5e6f83;font-size:11px;padding:2px 6px;border-radius:4px;cursor:pointer;border:none;background:none}',
            '.dh-search-dropdown .sd-item .sd-del:hover{color:#f45b69}',
            '.desktop-header .dh-icon-btn{width:36px;height:36px;border-radius:50%;border:none;background:none;color:rgba(0,0,0,.55);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;position:relative;flex-shrink:0}',
            '.desktop-header .dh-icon-btn:hover{background:rgba(0,0,0,.06);color:#13202e}',
            '.desktop-header .dh-icon-btn svg{width:20px;height:20px}',
            '.desktop-header .dh-notify-dot{position:absolute;top:6px;right:6px;width:8px;height:8px;border-radius:50%;background:#ff2d55;border:1.5px solid #fff}',
            '.desktop-header .dh-publish-btn{display:inline-flex;align-items:center;gap:4px;padding:6px 16px;border-radius:999px;border:none;background:#00b388;color:#fff;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;flex-shrink:0}',
            '.desktop-header .dh-publish-btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,179,136,.3)}',
            '.desktop-header .dh-publish-btn svg{width:16px;height:16px}',
            '.dh-publish-wrap{position:relative;flex-shrink:0}',
            '.dh-publish-dropdown{position:absolute;top:calc(100% + 8px);right:0;min-width:150px;background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.1);padding:4px;opacity:0;visibility:hidden;transform:translateY(-6px);transition:all .22s ease;z-index:300}',
            '.dh-publish-wrap:hover .dh-publish-dropdown{opacity:1;visibility:visible;transform:translateY(0)}',
            '.dh-publish-item{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:8px;color:#1C1C1E;text-decoration:none;font-size:13px;font-weight:600;transition:background .15s;white-space:nowrap}',
            '.dh-publish-item:hover{background:rgba(0,0,0,.04)}',
            '.dh-publish-item svg{width:16px;height:16px;flex-shrink:0;color:#8E8E93}',
            '.desktop-header .dh-avatar{width:34px;height:34px;border-radius:50%;object-fit:contain;cursor:pointer;border:1.5px solid rgba(0,0,0,.08);flex-shrink:0;transition:border-color .15s}',
            '.desktop-header .dh-avatar:hover{border-color:#00b388}',
            '.desktop-header .dh-login-btn{padding:6px 16px;border-radius:999px;border:1px solid #00b388;background:none;color:#00b388;font-size:13px;font-weight:600;cursor:pointer;flex-shrink:0;transition:all .15s}',
            '.desktop-header .dh-login-btn:hover{background:rgba(0,179,136,.12)}',
            '.desktop-header .dh-usdc-badge{display:inline-flex;align-items:center;gap:6px;padding:3px 4px 3px 14px;border-radius:999px;background:rgba(0,0,0,.04);font-size:12px;font-weight:600;color:#13202e;flex-shrink:0;cursor:pointer;position:relative}',
            '.desktop-header .dh-usdc-badge svg{width:14px;height:14px;flex-shrink:0}',
            '.desktop-header .dh-usdc-badge .dh-avatar-wrap{margin:0}',
            '.desktop-header .dh-usdc-badge .dh-avatar{width:30px;height:30px;border:none}',
            '.desktop-header .auth-login-btn{margin-left:auto}',
'@media(min-width:769px){.desktop-header{left:160px;right:0}body{padding-top:56px}}',
'@media(max-width:768px){.desktop-header{display:none}}'
        ].join('');
        document.head.appendChild(style);
    }

    // 内嵌 Desktop Header HTML
    function buildHeaderHTML() {
        return '' +
            '<div class="desktop-header" id="desktopHeader">' +
                '<div class="dh-search" id="dhSearch">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>' +
                    '<input type="text" id="dhSearchInput" placeholder="搜索短剧、角色、用户..." autocomplete="off"><button class="dh-search-btn" id="dhSearchBtn">搜索</button>' +
                    '<div class="dh-search-dropdown" id="dhSearchDropdown">' +
                        '<div class="sd-section" id="sdHotSection">' +
                            '<div class="sd-section-title">🔥 热门搜索</div>' +
                            '<div class="sd-tags" id="sdHotTags"></div>' +
                        '</div>' +
                        '<div class="sd-section" id="sdRecentSection" style="display:none">' +
                            '<div class="sd-section-title">🕐 最近搜索</div>' +
                            '<div class="sd-list" id="sdRecentList"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<button class="dh-icon-btn" title="通知">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' +
                    '<span class="dh-notify-dot"></span>' +
                '</button>' +
                '<div class="dh-publish-wrap">' +
                    '<button class="dh-publish-btn">' +
                        '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 5v6M5 8h6"/></svg>发布' +
                    '</button>' +
                    '<div class="dh-publish-dropdown">' +
                        '<a class="dh-publish-item" href="publish.html">' +
                            '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="12" height="12" rx="3"/><path d="M2 6h12M6 14V6"/></svg>发布短剧' +
                        '</a>' +
                        '<a class="dh-publish-item" href="publish-video.html">' +
                            '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1.5" y="3" width="13" height="10" rx="2"/><polygon points="7,5.5 7,10.5 11.5,8" fill="currentColor"/></svg>发布视频' +
                        '</a>' +
                        '<a class="dh-publish-item" href="create-actor.html">' +
                            '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="5" r="2"/><path d="M2 14v-1.3a2.7 2.7 0 0 1 2.7-2.7h2.6a2.7 2.7 0 0 1 2.7 2.7V14"/></svg>发行角色IP' +
                        '</a>' +
                    '</div>' +
                '</div>' +
                '<div class="auth-container" id="authContainer"></div>' +
            '</div>';
    }

    // 注入 HTML 到 body 最前面（如果已存在则跳过）
    function injectHeaderHTML() {
        if (document.getElementById('desktopHeader')) return;
        var html = buildHeaderHTML();
        var temp = document.createElement('div');
        temp.innerHTML = html;
        var header = temp.querySelector('.desktop-header');
        if (header) {
            document.body.insertBefore(header, document.body.firstChild);
        }
    }

    // 绑定搜索交互
    function bindSearch() {
        var inp = document.getElementById('dhSearchInput');
        var dropdown = document.getElementById('dhSearchDropdown');
        var searchBox = document.getElementById('dhSearch');
        var searchBtn = document.getElementById('dhSearchBtn');
        if (!inp || !dropdown || !searchBox) return;

        renderSearchDropdown();

        inp.addEventListener('focus', function() {
            renderSearchDropdown();
            dropdown.classList.add('show');
        });

        inp.addEventListener('input', function() {
            if (inp.value.trim()) {
                dropdown.classList.remove('show');
            } else {
                renderSearchDropdown();
                dropdown.classList.add('show');
            }
        });

        inp.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                var q = inp.value.trim();
                if (q) doSearch(q);
            }
        });

        searchBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var q = inp.value.trim();
            if (q) doSearch(q);
        });

        document.addEventListener('click', function(e) {
            if (!searchBox.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }

    function doSearch(query) {
        if (!query || !query.trim()) return;
        query = query.trim();
        saveRecentSearch(query);
        location.href = 'search-results.html?q=' + encodeURIComponent(query);
    }

    function saveRecentSearch(q) {
        var list = JSON.parse(localStorage.getItem('dh_recent_searches') || '[]');
        list = list.filter(function(item) { return item !== q; });
        list.unshift(q);
        if (list.length > 8) list.pop();
        localStorage.setItem('dh_recent_searches', JSON.stringify(list));
    }

    function renderSearchDropdown() {
        var hotTags = ['凤骨琉璃', '打斗精彩片段', '古风短剧', '1011', 'AI短剧', '苏婉清', '星际拓荒者', '时间管理局'];
        var hotEl = document.getElementById('sdHotTags');
        if (hotEl) {
            hotEl.innerHTML = hotTags.map(function(t) {
                return '<button class="sd-tag">' + t + '</button>';
            }).join('');
        }
        var recent = JSON.parse(localStorage.getItem('dh_recent_searches') || '[]');
        var recentSection = document.getElementById('sdRecentSection');
        var recentList = document.getElementById('sdRecentList');
        if (recentSection && recentList && recent.length > 0) {
            recentSection.style.display = '';
            recentList.innerHTML = recent.map(function(r) {
                return '<div class="sd-item"><span>' + r + '</span><button class="sd-del">✕</button></div>';
            }).join('');
        } else if (recentSection) {
            recentSection.style.display = 'none';
        }
    }

    // 绑定搜索下拉的点击事件（通过事件委托）
    document.addEventListener('click', function(e) {
        var sdTag = e.target.closest('.sd-tag');
        if (sdTag) {
            doSearch(sdTag.textContent);
        }
        var sdItem = e.target.closest('.sd-item');
        if (sdItem && !e.target.closest('.sd-del')) {
            var span = sdItem.querySelector('span');
            if (span) doSearch(span.textContent);
        }
        var sdDel = e.target.closest('.sd-del');
        if (sdDel) {
            var item = sdDel.closest('.sd-item');
            if (item) {
                var q = item.querySelector('span').textContent;
                var list = JSON.parse(localStorage.getItem('dh_recent_searches') || '[]');
                list = list.filter(function(i) { return i !== q; });
                localStorage.setItem('dh_recent_searches', JSON.stringify(list));
                renderSearchDropdown();
            }
        }
    });

    // 增强已有 header：给发布按钮添加下拉菜单
    function enhanceExistingHeader() {
        var header = document.getElementById('desktopHeader');
        if (!header) return false;

        var btn = header.querySelector('.dh-publish-btn');
        if (!btn) return false;

        // 如果已被包裹，跳过
        if (btn.parentNode && btn.parentNode.classList.contains('dh-publish-wrap')) return true;

        // 创建包裹容器
        var wrap = document.createElement('div');
        wrap.className = 'dh-publish-wrap';

        // 创建下拉菜单
        var dropdown = document.createElement('div');
        dropdown.className = 'dh-publish-dropdown';
        dropdown.innerHTML =
            '<a class="dh-publish-item" href="publish.html">' +
                '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="12" height="12" rx="3"/><path d="M2 6h12M6 14V6"/></svg>发布短剧' +
            '</a>' +
            '<a class="dh-publish-item" href="publish-video.html">' +
                '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1.5" y="3" width="13" height="10" rx="2"/><polygon points="7,5.5 7,10.5 11.5,8" fill="currentColor"/></svg>发布视频' +
            '</a>' +
            '<a class="dh-publish-item" href="create-actor.html">' +
                '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="5" r="2"/><path d="M2 14v-1.3a2.7 2.7 0 0 1 2.7-2.7h2.6a2.7 2.7 0 0 1 2.7 2.7V14"/></svg>发行角色IP' +
            '</a>';

        // 用 wrap 替换 btn
        btn.parentNode.insertBefore(wrap, btn);
        wrap.appendChild(btn);
        wrap.appendChild(dropdown);

        return true;
    }

    // 动态加载 auth.js（如果尚未加载）
    function ensureAuthScript(callback) {
        if (typeof initAuth === 'function') { callback(); return; }
        var script = document.createElement('script');
        script.src = 'auth.js';
        script.onload = callback;
        script.onerror = callback;
        document.head.appendChild(script);
    }

    // 主流程
    function init() {
        injectStyles();
        if (!enhanceExistingHeader()) {
            injectHeaderHTML();
        }
        bindSearch();
        // 确保 auth.js 已加载，然后渲染头像
        ensureAuthScript(function() {
            setTimeout(function() {
                if (typeof initAuth === 'function') initAuth();
            }, 50);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();