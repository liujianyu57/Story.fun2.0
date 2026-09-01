// ============================================================
// StoryFun 桌面端顶栏加载器
// 自包含 Desktop Header 样式 + HTML + 交互逻辑
// 所有页面统一引入此脚本即可
// ============================================================

(function() {
    'use strict';

    // 动态引入商城依赖：items.js（ItemStore）→ shop.js（商城弹窗）
    // 带时间戳版本号，避免浏览器缓存旧文件
    (function() {
        if (!document.getElementById('itemsJs')) {
            var a = document.createElement('script');
            a.id = 'itemsJs'; a.src = 'items.js?v=' + Date.now();
            document.head.appendChild(a);
        }
        if (!document.getElementById('shopJs')) {
            var s = document.createElement('script');
            s.id = 'shopJs'; s.src = 'shop2.js?v=' + Date.now();
            document.head.appendChild(s);
        }
    })();
    // 购买入口兜底：依赖未加载完成时点击，先加载再打开
    // target：无 → 商店；'supply'/'manual' → 数量购买弹窗；'sub' → 订阅弹窗
    window.openShopSafe = function(target) {
        function go() {
            if (typeof window.ItemStore === 'undefined' || typeof window.Shop === 'undefined') return false;
            if (target === 'sub') { window.Shop.openSub(); }
            else if (target === 'supply' || target === 'manual') { window.Shop.openBuyModal(target); }
            else { window.Shop.open(); }
            return true;
        }
        if (go()) return;
        var need = [];
        if (typeof window.ItemStore === 'undefined') need.push('items.js');
        if (typeof window.Shop === 'undefined') need.push('shop2.js');
        var loaded = 0;
        need.forEach(function(src) {
            var s = document.createElement('script');
            s.src = src + '?v=' + Date.now();
            s.onload = function() { loaded++; if (loaded === need.length) go(); };
            document.head.appendChild(s);
        });
        setTimeout(go, 800);
    };

    // 内嵌 Desktop Header 样式
    function injectStyles() {
        if (document.getElementById('dh-injected-styles')) return;
        var style = document.createElement('style');
        style.id = 'dh-injected-styles';
        style.textContent = [
            '.desktop-header{position:fixed;top:0;left:0;right:0;justify-content:flex-end;z-index:151;height:56px;padding:0 20px;display:flex;align-items:center;gap:12px;background:#fff;border-bottom:none}',
            '.desktop-header .dh-search{position:absolute;left:50%;transform:translateX(-50%);width:520px;min-width:0;display:flex;align-items:center;gap:8px;padding:4px 14px;border-radius:999px;background:rgba(0,0,0,0.04);border:1px solid transparent;transition:all .2s}',
            '.desktop-header .dh-search:focus-within{border-color:#000000;background:#fff;box-shadow:0 0 0 3px rgba(0, 0, 0,.12)}',
            '.desktop-header .dh-search svg{width:16px;height:16px;flex-shrink:0;color:rgba(0,0,0,.35)}',
            '.desktop-header .dh-search input{flex:1;border:none;outline:none;background:none;font-size:13px;color:#13202e;font-family:inherit}',
            '.desktop-header .dh-search input::placeholder{color:rgba(0,0,0,.35)}',
            '.desktop-header .dh-search-btn{padding:3px 12px;height:auto;border-radius:999px;border:none;background:rgba(0,0,0,.06);color:rgba(0,0,0,.5);font-size:12px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;margin-right:-4px}',
            '.desktop-header .dh-search-btn:hover{background:#000000;color:#fff;border-color:#000000}',
            '.desktop-header .dh-search-btn svg{width:18px;height:18px}',
            '.dh-search-dropdown{display:none;position:absolute;left:0;right:0;top:100%;margin-top:6px;background:#fff;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.1);border:1px solid rgba(0,0,0,.06);padding:16px;z-index:200;max-height:360px;overflow-y:auto}',
            '.dh-search-dropdown.show{display:block}',
            '.dh-search-dropdown .sd-section{margin-bottom:14px}',
            '.dh-search-dropdown .sd-section:last-child{margin-bottom:0}',
            '.dh-search-dropdown .sd-section-title{font-size:12px;font-weight:600;color:#5e6f83;margin-bottom:8px}',

            '.dh-search-dropdown .sd-list{display:flex;flex-direction:column;gap:2px}',
            '.dh-search-dropdown .sd-item{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-radius:8px;font-size:13px;color:#13202e;cursor:pointer;transition:background .1s}',
            '.dh-search-dropdown .sd-item:hover{background:rgba(0,0,0,.03)}',
            '.dh-search-dropdown .sd-item .sd-del{color:#5e6f83;font-size:11px;padding:2px 6px;border-radius:4px;cursor:pointer;border:none;background:none}',
            '.dh-search-dropdown .sd-item .sd-del:hover{color:#f45b69}',
            '.desktop-header .dh-icon-btn{width:36px;height:36px;border-radius:50%;border:none;background:none;color:rgba(0,0,0,.55);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;position:relative;flex-shrink:0}',
            '.desktop-header .dh-icon-btn:hover{background:rgba(0,0,0,.06);color:#13202e}',
            '.desktop-header .dh-icon-btn svg{width:20px;height:20px}',
            '.desktop-header .dh-notify-dot{position:absolute;top:6px;right:6px;width:8px;height:8px;border-radius:50%;background:#ff2d55;border:1.5px solid #fff}',
            '.desktop-header .dh-publish-btn{display:inline-flex;align-items:center;gap:4px;padding:6px 16px;border-radius:999px;border:none;background:#000000;color:#fff;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;flex-shrink:0}',
            '.desktop-header .dh-publish-btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0, 0, 0,.3)}',
            '.desktop-header .dh-publish-btn svg{width:16px;height:16px}',
            '.dh-publish-wrap{position:relative;flex-shrink:0}',
            '.dh-publish-dropdown{position:absolute;top:calc(100% + 8px);right:0;min-width:150px;background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.1);padding:4px;opacity:0;visibility:hidden;transform:translateY(-6px);transition:all .22s ease;z-index:300}',
            '.dh-publish-wrap:hover .dh-publish-dropdown{opacity:1;visibility:visible;transform:translateY(0)}',
            '.dh-publish-item{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:8px;color:#1C1C1E;text-decoration:none;font-size:13px;font-weight:600;transition:background .15s;white-space:nowrap}',
            '.dh-publish-item:hover{background:rgba(0,0,0,.04)}',
            '.dh-publish-item svg{width:16px;height:16px;flex-shrink:0;color:#8E8E93}',
            '.desktop-header .dh-avatar{width:34px;height:34px;border-radius:50%;object-fit:contain;cursor:pointer;border:1.5px solid rgba(0,0,0,.08);flex-shrink:0;transition:border-color .15s}',
            '.desktop-header .dh-avatar:hover{border-color:#000000}',
            '.desktop-header .dh-login-btn{padding:6px 16px;border-radius:999px;border:1px solid #000000;background:none;color:#000000;font-size:13px;font-weight:600;cursor:pointer;flex-shrink:0;transition:all .15s}',
            '.desktop-header .dh-login-btn:hover{background:rgba(0, 0, 0,.12)}',
            '.desktop-header .dh-usdc-badge{display:inline-flex;align-items:center;gap:6px;padding:3px 4px 3px 14px;border-radius:999px;background:rgba(0,0,0,.04);font-size:12px;font-weight:600;color:#13202e;flex-shrink:0;cursor:pointer;position:relative}',
            '.desktop-header .dh-usdc-badge svg{width:14px;height:14px;flex-shrink:0}',
            '.desktop-header .dh-usdc-badge .dh-avatar-wrap{margin:0}',
            '.desktop-header .dh-usdc-badge .dh-avatar{width:30px;height:30px;border:none}',
            '.desktop-header .auth-login-btn{margin-left:auto}',
            '@media(min-width:769px){.desktop-header{left:160px;right:0}body{padding-top:56px}}',
            '@media(max-width:768px){.desktop-header{display:none}}',
            '/* ── 商店 hover 下拉（无遮罩）── */',
            '@media(min-width:769px){',
            '.dh-shop-wrap{position:relative;flex-shrink:0;display:flex;align-items:center}',
            '.dh-shop-dropdown{position:absolute;top:calc(100% + 8px);right:0;width:340px;background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.1);padding:12px;opacity:0;visibility:hidden;transform:translateY(-6px);transition:all .22s ease;z-index:300}',
            '.dh-shop-wrap:hover .dh-shop-dropdown{opacity:1;visibility:visible;transform:translateY(0)}',
            '}',
            '/* ── Notify Dropdown (matches notifications.html cards) ── */',
            '@media(min-width:769px){',
            '.dh-notify-wrap{position:relative;flex-shrink:0;display:flex;align-items:center;gap:4px}',
            '.dh-notify-dropdown{position:absolute;top:calc(100% + 8px);right:0;width:460px;max-height:540px;background:#f8f9fb;border:1px solid rgba(0,0,0,.06);border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.1);opacity:0;visibility:hidden;transform:translateY(-6px);transition:all .22s ease;z-index:300;overflow:hidden;display:flex;flex-direction:column}',
            '.dh-notify-wrap:hover .dh-notify-dropdown{opacity:1;visibility:visible;transform:translateY(0)}',
'.dh-notify-dropdown .dn-header{display:flex;align-items:center;justify-content:center;padding:12px 16px 8px;flex-shrink:0;gap:24px}',
'.dh-notify-dropdown .dn-tab{padding:6px 0 4px;border:none;background:none;font-size:13px;font-weight:500;color:#8896a8;cursor:pointer;position:relative;transition:color .2s}',
'.dh-notify-dropdown .dn-tab.active{color:#1a1a2e;font-weight:600}',
'.dh-notify-dropdown .dn-tab.active::after{content:"";position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:16px;height:2.5px;border-radius:2px;background:#000000}',
            '.dh-notify-dropdown .dn-scroll{flex:1;overflow-y:auto;padding:4px 8px 8px}',
'.dh-notify-dropdown .notify-item[data-category="social"]{display:none}',
            '.dh-notify-dropdown .dn-scroll::-webkit-scrollbar{width:0}',
            '/* mirror notifications.html card styles */',
            '.dh-notify-dropdown .notify-item{display:flex;flex-direction:column;gap:0;padding:12px 14px 8px;position:relative;background:#fff;border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,.03);margin-bottom:8px;transition:box-shadow .15s;cursor:pointer}',
            '.dh-notify-dropdown .notify-item:active{box-shadow:0 2px 8px rgba(0,0,0,.06)}',
            '.dh-notify-dropdown .notify-item[data-category="revenue"]{padding:12px 16px 10px}',
            '.dh-notify-dropdown .revenue-row{display:flex;align-items:flex-start;gap:12px}',
            '.dh-notify-dropdown .social-row{display:flex;align-items:center;gap:12px;}',
            '.dh-notify-dropdown .notify-icon{width:36px;height:36px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:17px}',
            '.dh-notify-dropdown .notify-icon.avatar{overflow:hidden;background:#f0f2f5}',
            '.dh-notify-dropdown .notify-icon.avatar img{width:100%;height:100%;object-fit:cover}',
            '.dh-notify-dropdown .notify-icon.revenue{background:rgba(0, 0, 0,.08)}',
            '.dh-notify-dropdown .notify-content{flex:1;min-width:0}',
            '.dh-notify-dropdown .revenue-title{display:inline-block;font-size:9px;font-weight:600;color:#000000;background:rgba(0, 0, 0,.08);padding:2px 7px;border-radius:5px;margin-bottom:5px}',
            '.dh-notify-dropdown .notify-desc{font-size:13px;color:#1a1a2e;line-height:1.45;font-weight:400}',
            '.dh-notify-dropdown .notify-desc strong{font-weight:700}',
            '.dh-notify-dropdown .revenue-amount{font-size:13px;font-weight:700;margin-top:3px}',
            '.dh-notify-dropdown .rcv-usdc{color:#000000}',
            '.dh-notify-dropdown .rcv-story{color:#000000}',
            '.dh-notify-dropdown .notify-meta{font-size:10px;color:#8896a8;margin-top:5px}',
            '.dh-notify-dropdown .notify-time{font-size:10px;color:#8896a8;opacity:.7;margin-top:2px}',
            '.dh-notify-dropdown .notify-thumb{width:36px;height:36px;border-radius:7px;flex-shrink:0;overflow:hidden;background:#f0f2f5}',
            '.dh-notify-dropdown .notify-thumb img{width:100%;height:100%;object-fit:cover}',
            '.dh-notify-dropdown .notify-item.unread::before{content:\'\';position:absolute;left:7px;top:18px;width:5px;height:5px;border-radius:50%;background:#000000}',
            '.dh-notify-dropdown .rev-act-btn{flex-shrink:0;padding:5px 12px;border-radius:999px;border:none;background:#000000;color:#fff;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;align-self:center}',
            '.dh-notify-dropdown .follow-btn{flex-shrink:0;padding:4px 10px;border-radius:999px;border:1px solid #000000;background:transparent;color:#000000;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap}',
            '.dh-notify-dropdown .follow-btn.mutual{background:rgba(0, 0, 0,.08);border-color:transparent}',
            '.dh-notify-dropdown .sact-btn{display:inline-flex;align-items:center;gap:3px;padding:4px 10px;border-radius:999px;border:1px solid #eef0f4;background:transparent;color:#5e6f83;font-size:11px;font-weight:500;cursor:pointer}',
            '.dh-notify-dropdown .social-actions{display:flex;gap:6px;margin-top:8px}',
            '.dh-notify-dropdown .notify-footer{display:flex;justify-content:flex-end;margin-top:6px}',
            '.dh-notify-dropdown .notify-more{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;border:none;background:transparent;color:#8896a8;font-size:13px;cursor:pointer;letter-spacing:1px}',
            '.dh-notify-dropdown .delete-dropdown{position:absolute;top:100%;right:0;margin-top:3px;background:#fff;border:1px solid #eef0f4;border-radius:8px;box-shadow:0 4px 14px rgba(0,0,0,.08);padding:3px 0;min-width:64px;z-index:5;display:none;text-align:center}',
            '.dh-notify-dropdown .delete-dropdown.show{display:block}',
            '.dh-notify-dropdown .delete-btn{display:block;width:100%;padding:6px 12px;border:none;background:transparent;color:#f45b69;font-size:11px;font-weight:500;cursor:pointer}',
            '}'
        ].join('');
        document.head.appendChild(style);
    }

    // 内嵌 Desktop Header HTML
    function buildHeaderHTML() {
        return '' +
            '<div class="desktop-header" id="desktopHeader">' +
                '<div class="dh-search" id="dhSearch">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>' +
                    '<input type="text" id="dhSearchInput" placeholder="搜索..." autocomplete="off"><button class="dh-search-btn" id="dhSearchBtn">搜索</button>' +
                    '<div class="dh-search-dropdown" id="dhSearchDropdown">' +
                        '<div class="sd-section" id="sdRecentSection" style="display:none">' +
                            '<div class="sd-section-title">🕐 最近搜索</div>' +
                            '<div class="sd-list" id="sdRecentList"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="dh-shop-wrap">' +
                    '<button class="dh-icon-btn" title="商店">' +
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
                    '</button>' +
                    '<div class="dh-shop-dropdown">' +
                        '<div style="font-size:14px;font-weight:700;color:#13202e;padding:2px 4px 10px;">商店</div>' +
                        '<div id="dhShopList"></div>' +
                    '</div>' +
                '</div>' +
                '<div class="dh-notify-wrap">' +
                    '<button class="dh-icon-btn" title="通知">' +
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' +
                        '<span class="dh-notify-dot"></span>' +
                    '</button>' +
                    '<div class="dh-notify-dropdown" id="dhNotifyDropdown">' +
                        '<div class="dn-header"><button class="dn-tab active" onclick="dhSwitchTab(event,\'revenue\')">系统<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#ff2d55;margin-left:5px;vertical-align:middle"></span></button><button class="dn-tab" onclick="dhSwitchTab(event,\'social\')">互动<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#ff2d55;margin-left:5px;vertical-align:middle"></span></button></div>' +
                        '<div class="dn-scroll">' +
                            '<!-- IP 被签约 -->' +
                            '<div class="notify-item unread" data-category="revenue"><div class="revenue-row"><div class="notify-icon avatar"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" alt=""></div><div class="notify-content"><div class="revenue-title">签约角色 IP</div><div class="notify-desc">@Jack 签约了角色 IP <strong>苏婉清</strong></div><div class="revenue-amount">你获得分成 <span class="rcv-usdc">126.80 USDC</span></div><div class="notify-meta">12分钟前</div></div><button class="rev-act-btn" onclick="location.href=\'rewards.html\'">领取</button></div><div class="notify-footer"><button class="notify-more" onclick="dhToggleDelete(event,this)">···</button><div class="delete-dropdown"><button class="delete-btn" onclick="dhDeleteNotify(event,this)">删除</button></div></div></div>' +
                            '<!-- 体力不足 -->' +
                            '<div class="notify-item unread" data-category="revenue"><div class="revenue-row"><div class="notify-icon avatar"><img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" alt=""></div><div class="notify-content"><div class="revenue-title">角色管理</div><div class="notify-desc"><strong>赵无极</strong> 体力不足，尽快补充体力或休息</div><div class="revenue-amount">当前体力 <span style="color:#f59e0b">0</span></div><div class="notify-meta">28分钟前</div></div><button class="rev-act-btn" onclick="location.href=\'studio.html\'">补充</button></div><div class="notify-footer"><button class="notify-more" onclick="dhToggleDelete(event,this)">···</button><div class="delete-dropdown"><button class="delete-btn" onclick="dhDeleteNotify(event,this)">删除</button></div></div></div>' +
                            '<!-- 演出收益到账 -->' +
                            '<div class="notify-item" data-category="revenue"><div class="revenue-row"><div class="notify-icon revenue">🎬</div><div class="notify-content"><div class="revenue-title">演出收益</div><div class="notify-desc">2026/6/15 ～ 2026/6/21 演出结束</div><div class="revenue-amount">你获得收益 <span class="rcv-story">415.70 STORY</span></div><div class="notify-meta">2小时前</div></div><button class="rev-act-btn" onclick="location.href=\'rewards.html\'">领取</button></div><div class="notify-footer"><button class="notify-more" onclick="dhToggleDelete(event,this)">···</button><div class="delete-dropdown"><button class="delete-btn" onclick="dhDeleteNotify(event,this)">删除</button></div></div></div>' +
                            '<!-- 点赞视频 -->' +
                            '<div class="notify-item unread" data-category="social"><div class="social-row"><div class="notify-icon avatar"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" alt=""></div><div class="notify-content"><div class="notify-desc"><strong>李云飞</strong></div><div class="notify-desc" style="font-weight:400">赞了你的视频</div><div class="notify-time">18分钟前</div></div><div class="notify-thumb"><img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=200&q=80" alt=""></div></div><div class="notify-footer"><button class="notify-more" onclick="dhToggleDelete(event,this)">···</button><div class="delete-dropdown"><button class="delete-btn" onclick="dhDeleteNotify(event,this)">删除</button></div></div></div>' +
                            '<!-- 点赞短剧 -->' +
                            '<div class="notify-item unread" data-category="social"><div class="social-row"><div class="notify-icon avatar"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" alt=""></div><div class="notify-content"><div class="notify-desc"><strong>苏婉清</strong></div><div class="notify-desc" style="font-weight:400">赞了你的短剧 《凤骨琉璃》</div><div class="notify-time">42分钟前</div></div><div class="notify-thumb"><img src="https://images.unsplash.com/photo-1512070679279-8988d32161be?auto=format&fit=crop&w=200&q=80" alt=""></div></div><div class="notify-footer"><button class="notify-more" onclick="dhToggleDelete(event,this)">···</button><div class="delete-dropdown"><button class="delete-btn" onclick="dhDeleteNotify(event,this)">删除</button></div></div></div>' +
                            '<!-- 收藏视频 -->' +
                            '<div class="notify-item unread" data-category="social"><div class="social-row"><div class="notify-icon avatar"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" alt=""></div><div class="notify-content"><div class="notify-desc"><strong>林梦瑶</strong></div><div class="notify-desc" style="font-weight:400">收藏了你的视频</div><div class="notify-time">1小时前</div></div><div class="notify-thumb"><img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=200&q=80" alt=""></div></div><div class="notify-footer"><button class="notify-more" onclick="dhToggleDelete(event,this)">···</button><div class="delete-dropdown"><button class="delete-btn" onclick="dhDeleteNotify(event,this)">删除</button></div></div></div>' +
                            '<!-- 收藏短剧 -->' +
                            '<div class="notify-item unread" data-category="social"><div class="social-row"><div class="notify-icon avatar"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" alt=""></div><div class="notify-content"><div class="notify-desc"><strong>苏婉清</strong></div><div class="notify-desc" style="font-weight:400">收藏了你的短剧 《凤骨琉璃》</div><div class="notify-time">42分钟前</div></div><div class="notify-thumb"><img src="https://images.unsplash.com/photo-1512070679279-8988d32161be?auto=format&fit=crop&w=200&q=80" alt=""></div></div><div class="notify-footer"><button class="notify-more" onclick="dhToggleDelete(event,this)">···</button><div class="delete-dropdown"><button class="delete-btn" onclick="dhDeleteNotify(event,this)">删除</button></div></div></div>' +
                            '<!-- 收到评论 -->' +
                            '<div class="notify-item unread" data-category="social"><div class="social-row"><div class="notify-icon avatar"><img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" alt=""></div><div class="notify-content"><div class="notify-desc"><strong>赵无极</strong></div><div class="notify-desc" style="font-weight:400">评论了你：剧情太精彩了，期待下一集！</div><div class="notify-time">1小时前</div></div><div class="notify-thumb"><img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=200&q=80" alt=""></div></div><div class="social-actions"><button class="sact-btn">回复评论</button><button class="sact-btn">♡ 赞</button></div><div class="notify-footer"><button class="notify-more" onclick="dhToggleDelete(event,this)">···</button><div class="delete-dropdown"><button class="delete-btn" onclick="dhDeleteNotify(event,this)">删除</button></div></div></div>' +
                            '<!-- 互相关注 -->' +
                            '<div class="notify-item unread" data-category="social"><div class="social-row"><div class="notify-icon avatar"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" alt=""></div><div class="notify-content"><div class="notify-desc"><strong>苏婉清</strong></div><div class="notify-desc" style="font-weight:400">关注了你</div><div class="notify-time">5小时前</div></div><button class="follow-btn mutual">互关</button></div><div class="notify-footer"><button class="notify-more" onclick="dhToggleDelete(event,this)">···</button><div class="delete-dropdown"><button class="delete-btn" onclick="dhDeleteNotify(event,this)">删除</button></div></div></div>' +
                            '<!-- 有人关注我 -->' +
                            '<div class="notify-item unread" data-category="social"><div class="social-row"><div class="notify-icon avatar"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" alt=""></div><div class="notify-content"><div class="notify-desc"><strong>林梦瑶</strong></div><div class="notify-desc" style="font-weight:400">关注了你</div><div class="notify-time">3小时前</div></div><button class="follow-btn" >关注</button></div><div class="notify-footer"><button class="notify-more" onclick="dhToggleDelete(event,this)">···</button><div class="delete-dropdown"><button class="delete-btn" onclick="dhDeleteNotify(event,this)">删除</button></div></div></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
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

    // 注入 HTML 到 body 最前面（如果已存在则跳过渲染，但仍确保商店 hover 入口存在）
    function ensureShopBtn() {
        var header = document.getElementById('desktopHeader');
        if (!header) return;
        if (header.querySelector('.dh-icon-btn[title="商店"]')) return; // 已有
        var btn = document.createElement('button');
        btn.className = 'dh-icon-btn';
        btn.title = '商店';
        btn.style.cssText = 'width:36px;height:36px;border-radius:50%;border:none;background:none;color:rgba(0,0,0,.55);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;transition:background .15s;';
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';
        var wrap = document.createElement('div');
        wrap.className = 'dh-shop-wrap';
        var dd = document.createElement('div');
        dd.className = 'dh-shop-dropdown';
        dd.innerHTML = '<div style="font-size:14px;font-weight:700;color:#13202e;padding:2px 4px 10px;">商店</div><div id="dhShopList"></div>';
        wrap.appendChild(btn);
        wrap.appendChild(dd);
        var notify = header.querySelector('.dh-icon-btn[title="通知"]') || header.querySelector('.dh-notify-wrap');
        if (notify) {
            // 找到 notify 在 header 下的直接子节点（insertBefore 要求目标为 header 直接子级）
            var target = notify;
            while (target.parentNode && target.parentNode !== header) target = target.parentNode;
            if (target.parentNode === header) header.insertBefore(wrap, target);
            else header.appendChild(wrap);
        } else {
            header.appendChild(wrap);
        }
    }
    function injectHeaderHTML() {
        if (!document.getElementById('desktopHeader')) {
            var html = buildHeaderHTML();
            var temp = document.createElement('div');
            temp.innerHTML = html;
            var header = temp.querySelector('.desktop-header');
            if (header) {
                document.body.insertBefore(header, document.body.firstChild);
            }
        }
        ensureShopBtn();
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

    // 增强已有 header：给发布按钮和通知按钮添加下拉菜单
    function enhanceExistingHeader() {
        var header = document.getElementById('desktopHeader');
        if (!header) return false;

        // --- Publish button wrap ---
        var pubBtn = header.querySelector('.dh-publish-btn');
        if (pubBtn && !(pubBtn.parentNode && pubBtn.parentNode.classList.contains('dh-publish-wrap'))) {
            var wrap = document.createElement('div');
            wrap.className = 'dh-publish-wrap';

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

            pubBtn.parentNode.insertBefore(wrap, pubBtn);
            wrap.appendChild(pubBtn);
            wrap.appendChild(dropdown);
        }

        // --- Notify button wrap ---
        var notifyBtn = header.querySelector('.dh-icon-btn[title="通知"]');
        if (notifyBtn && !(notifyBtn.parentNode && notifyBtn.parentNode.classList.contains('dh-notify-wrap'))) {
            var nWrap = document.createElement('div');
            nWrap.className = 'dh-notify-wrap';

            var nDropdown = document.createElement('div');
            nDropdown.className = 'dh-notify-dropdown';
            nDropdown.innerHTML =
                '<div class="dn-header"><button class="dn-tab active" onclick="dhSwitchTab(event,\'revenue\')">系统</button><button class="dn-tab" onclick="dhSwitchTab(event,\'social\')">互动</button></div>' +
                '<div class="dn-scroll">' +
                    '<div class="notify-item unread" data-category="revenue"><div class="revenue-row"><div class="notify-icon avatar"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" alt=""></div><div class="notify-content"><div class="revenue-title">签约角色 IP</div><div class="notify-desc">@Jack 签约了角色 IP <strong>苏婉清</strong></div><div class="revenue-amount">你获得分成 <span class="rcv-usdc">126.80 USDC</span></div><div class="notify-meta">12分钟前</div></div><button class="rev-act-btn" onclick="location.href=\'rewards.html\'">领取</button></div><div class="notify-footer"><button class="notify-more" onclick="dhToggleDelete(event,this)">···</button><div class="delete-dropdown"><button class="delete-btn" onclick="dhDeleteNotify(event,this)">删除</button></div></div></div>' +
                    '<div class="notify-item unread" data-category="revenue"><div class="revenue-row"><div class="notify-icon avatar"><img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" alt=""></div><div class="notify-content"><div class="revenue-title">角色管理</div><div class="notify-desc"><strong>赵无极</strong> 体力不足，尽快补充体力或休息</div><div class="revenue-amount">当前体力 <span style="color:#f59e0b">0</span></div><div class="notify-meta">28分钟前</div></div><button class="rev-act-btn" onclick="location.href=\'studio.html\'">补充</button></div><div class="notify-footer"><button class="notify-more" onclick="dhToggleDelete(event,this)">···</button><div class="delete-dropdown"><button class="delete-btn" onclick="dhDeleteNotify(event,this)">删除</button></div></div></div>' +
                    '<div class="notify-item" data-category="revenue"><div class="revenue-row"><div class="notify-icon revenue">🎬</div><div class="notify-content"><div class="revenue-title">演出收益</div><div class="notify-desc">2026/6/15 ～ 2026/6/21 演出结束</div><div class="revenue-amount">你获得收益 <span class="rcv-story">415.70 STORY</span></div><div class="notify-meta">2小时前</div></div><button class="rev-act-btn" onclick="location.href=\'rewards.html\'">领取</button></div><div class="notify-footer"><button class="notify-more" onclick="dhToggleDelete(event,this)">···</button><div class="delete-dropdown"><button class="delete-btn" onclick="dhDeleteNotify(event,this)">删除</button></div></div></div>' +
                    '<div class="notify-item unread" data-category="social"><div class="social-row"><div class="notify-icon avatar"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" alt=""></div><div class="notify-content"><div class="notify-desc"><strong>李云飞</strong></div><div class="notify-desc" style="font-weight:400">赞了你的视频</div><div class="notify-time">18分钟前</div></div><div class="notify-thumb"><img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=200&q=80" alt=""></div></div><div class="notify-footer"><button class="notify-more" onclick="dhToggleDelete(event,this)">···</button><div class="delete-dropdown"><button class="delete-btn" onclick="dhDeleteNotify(event,this)">删除</button></div></div></div>' +
                    '<div class="notify-item unread" data-category="social"><div class="social-row"><div class="notify-icon avatar"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" alt=""></div><div class="notify-content"><div class="notify-desc"><strong>苏婉清</strong></div><div class="notify-desc" style="font-weight:400">赞了你的短剧 《凤骨琉璃》</div><div class="notify-time">42分钟前</div></div><div class="notify-thumb"><img src="https://images.unsplash.com/photo-1512070679279-8988d32161be?auto=format&fit=crop&w=200&q=80" alt=""></div></div><div class="notify-footer"><button class="notify-more" onclick="dhToggleDelete(event,this)">···</button><div class="delete-dropdown"><button class="delete-btn" onclick="dhDeleteNotify(event,this)">删除</button></div></div></div>' +
                    '<div class="notify-item unread" data-category="social"><div class="social-row"><div class="notify-icon avatar"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" alt=""></div><div class="notify-content"><div class="notify-desc"><strong>林梦瑶</strong></div><div class="notify-desc" style="font-weight:400">收藏了你的视频</div><div class="notify-time">1小时前</div></div><div class="notify-thumb"><img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=200&q=80" alt=""></div></div><div class="notify-footer"><button class="notify-more" onclick="dhToggleDelete(event,this)">···</button><div class="delete-dropdown"><button class="delete-btn" onclick="dhDeleteNotify(event,this)">删除</button></div></div></div>' +
                    '<div class="notify-item unread" data-category="social"><div class="social-row"><div class="notify-icon avatar"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" alt=""></div><div class="notify-content"><div class="notify-desc"><strong>苏婉清</strong></div><div class="notify-desc" style="font-weight:400">收藏了你的短剧 《凤骨琉璃》</div><div class="notify-time">42分钟前</div></div><div class="notify-thumb"><img src="https://images.unsplash.com/photo-1512070679279-8988d32161be?auto=format&fit=crop&w=200&q=80" alt=""></div></div><div class="notify-footer"><button class="notify-more" onclick="dhToggleDelete(event,this)">···</button><div class="delete-dropdown"><button class="delete-btn" onclick="dhDeleteNotify(event,this)">删除</button></div></div></div>' +
                    '<div class="notify-item unread" data-category="social"><div class="social-row"><div class="notify-icon avatar"><img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" alt=""></div><div class="notify-content"><div class="notify-desc"><strong>赵无极</strong></div><div class="notify-desc" style="font-weight:400">评论了你：剧情太精彩了，期待下一集！</div><div class="notify-time">1小时前</div></div><div class="notify-thumb"><img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=200&q=80" alt=""></div></div><div class="social-actions"><button class="sact-btn">回复评论</button><button class="sact-btn">♡ 赞</button></div><div class="notify-footer"><button class="notify-more" onclick="dhToggleDelete(event,this)">···</button><div class="delete-dropdown"><button class="delete-btn" onclick="dhDeleteNotify(event,this)">删除</button></div></div></div>' +
                    '<div class="notify-item unread" data-category="social"><div class="social-row"><div class="notify-icon avatar"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" alt=""></div><div class="notify-content"><div class="notify-desc"><strong>苏婉清</strong></div><div class="notify-desc" style="font-weight:400">关注了你</div><div class="notify-time">5小时前</div></div><button class="follow-btn mutual">互关</button></div><div class="notify-footer"><button class="notify-more" onclick="dhToggleDelete(event,this)">···</button><div class="delete-dropdown"><button class="delete-btn" onclick="dhDeleteNotify(event,this)">删除</button></div></div></div>' +
                    '<div class="notify-item unread" data-category="social"><div class="social-row"><div class="notify-icon avatar"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" alt=""></div><div class="notify-content"><div class="notify-desc"><strong>林梦瑶</strong></div><div class="notify-desc" style="font-weight:400">关注了你</div><div class="notify-time">3小时前</div></div><button class="follow-btn">关注</button></div><div class="notify-footer"><button class="notify-more" onclick="dhToggleDelete(event,this)">···</button><div class="delete-dropdown"><button class="delete-btn" onclick="dhDeleteNotify(event,this)">删除</button></div></div></div>' +
                '</div>';

            notifyBtn.parentNode.insertBefore(nWrap, notifyBtn);
            nWrap.appendChild(notifyBtn);
            nWrap.appendChild(nDropdown);
        }

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

    // 给 header 通知下拉条目打上子类型标记（revenue: ip/manage/show；social: like/save/comment/follow）
    // 依据条目内文本判断，避免逐条改写长 HTML 字符串
    function classifyHeaderNotifyItems() {
        document.querySelectorAll('.dh-notify-dropdown .notify-item').forEach(function(item) {
            var cat = item.getAttribute('data-category');
            if (!cat) return;
            var text = item.textContent || '';
            if (cat === 'revenue') {
                var rt = 'ip';
                if (text.indexOf('角色管理') !== -1) rt = 'manage';
                else if (text.indexOf('演出') !== -1 || text.indexOf('收益') !== -1) rt = 'show';
                item.setAttribute('data-revtype', rt);
            } else {
                var st = 'like';
                if (text.indexOf('收藏') !== -1) st = 'save';
                else if (text.indexOf('评论') !== -1) st = 'comment';
                else if (text.indexOf('关注') !== -1) st = 'follow';
                item.setAttribute('data-sotype', st);
            }
        });
    }

    // 通知设置联动：按「激活 tab + 通知设置」统一计算 header 下拉条目可见性，并刷新红点
    function dhApplyNotifyFilter() {
        var dd = document.querySelector('.dh-notify-dropdown');
        if (!dd) return;
        var settings = (typeof window.StoryFunNotify !== 'undefined') ? window.StoryFunNotify.getSettings() : null;
        var activeTabEl = dd.querySelector('.dn-tab.active');
        var tabText = activeTabEl ? (activeTabEl.textContent || '').trim() : '系统';
        var tabCat = tabText.indexOf('互动') !== -1 ? 'social' : 'revenue';

        var anyUnreadVisible = false;
        dd.querySelectorAll('.notify-item').forEach(function(item) {
            var cat = item.getAttribute('data-category');
            var sub = cat === 'revenue' ? item.getAttribute('data-revtype') : item.getAttribute('data-sotype');
            var enabled = true;
            if (settings) {
                enabled = settings.master && window.StoryFunNotify.isNotifyEnabled(cat, sub);
            }
            if (!enabled || cat !== tabCat) { item.style.display = 'none'; return; }
            item.style.display = 'flex';
            if (item.classList.contains('unread')) anyUnreadVisible = true;
        });

        var dot = document.querySelector('.desktop-header .dh-notify-dot');
        if (dot) dot.style.display = anyUnreadVisible ? '' : 'none';
    }

    // 动态加载 notify-settings.js（如果尚未加载）
    function ensureNotifySettingsScript(callback) {
        if (typeof window.StoryFunNotify !== 'undefined') { callback(); return; }
        var script = document.createElement('script');
        script.src = 'notify-settings.js';
        script.onload = callback;
        script.onerror = callback;
        document.head.appendChild(script);
    }

    // Tab switch in notify dropdown
    window.dhSwitchTab = function(e, cat) {
        e.stopPropagation();
        var btn = e.target;
        var dd = btn.closest('.dh-notify-dropdown');
        if (!dd) return;
        // Toggle active
        dd.querySelectorAll('.dn-tab').forEach(function(t){t.classList.remove('active')});
        btn.classList.add('active');
        dhApplyNotifyFilter();
    };

    // Delete helpers for notify dropdown
    window.dhToggleDelete = function(e, btn) {
        e.stopPropagation();
        var dd = btn.parentElement.querySelector('.delete-dropdown');
        if (!dd) return;
        // Close all other dropdowns in the notify panel
        var panel = btn.closest('.dh-notify-dropdown');
        if (panel) {
            panel.querySelectorAll('.delete-dropdown.show').forEach(function(d) { d.classList.remove('show'); });
        }
        dd.classList.toggle('show');
    };
    window.dhDeleteNotify = function(e, btn) {
        e.stopPropagation();
        var item = btn.closest('.notify-item');
        if (item) item.remove();
    };

    // 主流程
    function init() {
        injectStyles();
        if (!enhanceExistingHeader()) {
            injectHeaderHTML();
        }
        ensureShopBtn();
        bindSearch();
        // 商店 hover：进入时渲染一次（不在鼠标移动中反复重渲染，避免打断点击）
        document.addEventListener('mouseover', function (e) {
            var wrap = e.target && e.target.closest ? e.target.closest('.dh-shop-wrap') : null;
            if (!wrap || wrap._rendered) return;
            wrap._rendered = true;
            if (window.Shop && window.Shop.renderCenter) window.Shop.renderCenter();
        });
        document.addEventListener('mouseout', function (e) {
            var wrap = e.target && e.target.closest ? e.target.closest('.dh-shop-wrap') : null;
            if (wrap && e.relatedTarget && !wrap.contains(e.relatedTarget)) wrap._rendered = false;
        });
        // 初始渲染一次（页面加载后下拉内容就绪）
        if (window.Shop && window.Shop.renderCenter) window.Shop.renderCenter();
        // 通知设置联动：打标 + 按设置过滤下拉条目与红点
        ensureNotifySettingsScript(function() {
            classifyHeaderNotifyItems();
            dhApplyNotifyFilter();
        });
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