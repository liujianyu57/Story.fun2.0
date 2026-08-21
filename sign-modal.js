/* ============================================================
   Story.fun 签约弹窗公共组件（sign-modal.js）
   自包含样式 + 结构 + 确认/成功状态流转（样式原样参考 actors.html 的 mint modal）
   任何页面可调用：window.SignModal.open(config) / SignModal.close()

   config 字段：
     name / title / image / tag / price / pricing('curve'|'fixed') / coeff(可空) / total / minted
     onConfirm(done)   点「确认签约」→ 业务完成后调 done() → 切成功态
     onPriceHelp(name) ? 按钮回调（页面级价格 tooltip），不传则隐藏
     success: {
       text (HTML),
       primary:  { label, href? | onClick? },  默认「查看我的角色」→ studio.html
       secondary:{ label, onClick? }           默认「继续浏览」→ 关闭；传 null 只留主按钮
     }
   ============================================================ */
window.SignModal = (function () {
  var current = null; // { overlay, config }

  function injectStyles() {
    if (document.getElementById('sfSignStyles')) return;
    var s = document.createElement('style');
    s.id = 'sfSignStyles';
    s.textContent = [
      '.mint-modal-overlay{position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(15,23,42,0.45);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}',
      '.mint-modal-overlay.active{display:flex}',
      '.mint-modal{width:min(440px,100%);background:var(--surface);border-radius:28px;box-shadow:0 40px 80px rgba(15,23,42,0.18);overflow:hidden;transform:scale(0.92) translateY(12px);opacity:0;transition:all 0.4s cubic-bezier(0.22,1,0.36,1)}',
      '.mint-modal-overlay.active .mint-modal{transform:scale(1) translateY(0);opacity:1}',
      '.mint-modal-close{position:absolute;top:16px;right:16px;width:32px;height:32px;border-radius:50%;border:none;background:rgba(0,0,0,0.04);color:var(--text-muted);font-size:1.2rem;cursor:pointer;display:grid;place-items:center;transition:all 0.2s ease;z-index:2}',
      '.mint-modal-close:hover{background:rgba(0,0,0,0.08);color:var(--text)}',
      '.mint-modal-hero{position:relative;width:100%;aspect-ratio:3/2;overflow:hidden;background:#f0f5fa}',
      '.mint-modal-hero img{width:100%;height:100%;object-fit:cover;display:block}',
      '.mint-modal-hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.08) 100%)}',
      '.mint-modal-badge{position:absolute;left:16px;bottom:16px;padding:6px 14px;border-radius:999px;background:rgba(255,255,255,.92);backdrop-filter:blur(8px);color:var(--text);font-size:0.78rem;font-weight:600}',
      '.mint-modal-body{padding:24px 28px 28px;display:flex;flex-direction:column;gap:20px}',
      '.mint-modal-header{display:flex;align-items:baseline;justify-content:space-between;gap:8px}',
      '.mint-modal-header h2{margin:0;font-size:1rem;font-weight:600;color:var(--text-muted);flex-shrink:0}',
      '.mint-modal-actor-name{font-size:1.5rem;font-weight:800;color:var(--text);letter-spacing:-0.02em;line-height:1.2;text-align:right}',
      '.mint-price-bar{background:var(--bg);border-radius:16px;padding:22px 20px 18px}',
      '.mpb-badge-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px}',
      '.mpb-pricing-tag{display:inline-flex;align-items:center;gap:3px;padding:2px 10px;border-radius:999px;font-size:0.7rem;font-weight:600;letter-spacing:0.02em;background:rgba(0,0,0,0.10);color:var(--accent);white-space:nowrap}',
      '.mpb-pricing-tag.fixed{background:rgba(101,117,134,0.10);color:var(--text-muted)}',
      '.mpb-pricing-tag .actor-price-help{width:16px;height:16px;font-size:0.55rem}',
      '.mpb-price-row{display:flex;align-items:baseline;gap:8px;margin-bottom:24px}',
      '.mpb-price-value{font-size:1.6rem;font-weight:800;color:var(--accent);letter-spacing:-0.03em;line-height:1.2}',
      '.mpb-price-label{font-size:0.78rem;color:var(--text-muted);font-weight:500}',
      '.mpb-coeff-inline{display:inline-flex;align-items:center;gap:4px;font-size:0.7rem;font-weight:500;color:var(--text-muted);white-space:nowrap;margin-left:auto}',
      '.mpb-coeff-inline strong{font-weight:700;color:var(--accent);font-variant-numeric:tabular-nums}',
      '.mpb-coeff-inline .actor-price-help{width:16px;height:16px;font-size:0.55rem}',
      '.actor-price-help{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:rgba(0,0,0,0.04);color:var(--text-muted);font-size:0.6rem;font-weight:700;cursor:pointer;transition:all 0.2s ease;border:none;padding:0;line-height:1}',
      '.actor-price-help:hover{background:var(--accent);color:#fff}',
      '.mpb-progress{font-size:0.8rem;color:var(--text-muted);line-height:1.4;margin-top:6px;padding-top:10px;border-top:1px solid var(--border)}',
      '.mpb-progress strong{color:var(--text);font-weight:700}',
      '.mint-slippage-notice{text-align:center;font-size:0.78rem;color:var(--text-muted);padding:6px 0 2px;opacity:0.85}',
      '.mint-modal-footer{display:flex;flex-direction:column;gap:10px}',
      '.mint-modal-footer .mint-btn{width:100%;padding:16px;border-radius:999px;border:none;font-size:1rem;font-weight:700;cursor:pointer;transition:all 0.25s ease}',
      '.mint-modal-footer .mint-btn.primary{background:#000000;color:#fff}',
      '.mint-modal-footer .mint-btn.primary:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,0,0,0.35)}',
      '.mint-modal-footer .mint-btn.primary:disabled{opacity:0.5;cursor:not-allowed;transform:none !important;box-shadow:none !important}',
      '.mint-modal-footer .mint-btn.secondary{background:transparent;color:var(--text-muted);font-weight:600;font-size:0.9rem;padding:12px}',
      '.mint-modal-footer .mint-btn.secondary:hover{color:var(--text);background:rgba(0,0,0,0.03)}',
      '.mint-modal-success{display:none;flex-direction:column;align-items:center;gap:10px;padding:48px 28px 32px;text-align:center;position:relative;overflow:hidden}',
      '.mint-modal-success.show{display:flex}',
      '.stamp-icon-wrap{position:relative;width:80px;height:80px;margin-bottom:6px}',
      '.stamp-seal{width:80px;height:80px;border-radius:50%;background:#e53935;display:grid;place-items:center;color:#fff;font-size:1.3rem;font-weight:900;box-shadow:0 4px 20px rgba(229,57,53,0.35);position:relative;transform:scale(0) rotate(-30deg);opacity:0;transition:none;letter-spacing:0.04em;border:3px solid #c62828}',
      '.mint-modal-success.show .stamp-seal{animation:stamp-drop 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards;animation-delay:0.3s}',
      '.stamp-seal-inner{display:flex;flex-direction:column;align-items:center;gap:0;line-height:1}',
      '.stamp-seal-inner span:first-child{font-size:1.6rem}',
      '.stamp-seal-inner span:last-child{font-size:0.6rem;font-weight:700;letter-spacing:0.08em;margin-top:-2px}',
      '.stamp-ripple{position:absolute;inset:-12px;border-radius:50%;border:2px solid rgba(229,57,53,0.15);transform:scale(0);opacity:0}',
      '.mint-modal-success.show .stamp-ripple{animation:ripple-out 0.6s ease-out forwards;animation-delay:0.6s}',
      '.stamp-ripple:nth-child(2){inset:-24px;border-width:1.5px}',
      '.mint-modal-success.show .stamp-ripple:nth-child(2){animation-delay:0.7s}',
      '@keyframes stamp-drop{0%{transform:scale(0) rotate(-30deg);opacity:0}50%{transform:scale(1.25) rotate(6deg);opacity:1}70%{transform:scale(0.92) rotate(-2deg);opacity:1}85%{transform:scale(1.04) rotate(1deg);opacity:1}100%{transform:scale(1) rotate(0deg);opacity:1}}',
      '@keyframes ripple-out{0%{transform:scale(0.5);opacity:0.6}100%{transform:scale(1.5);opacity:0}}',
      '.mint-modal-success .success-content{display:flex;flex-direction:column;align-items:center;gap:8px;opacity:0;transform:translateY(12px);transition:all 0.5s cubic-bezier(0.22,1,0.36,1);width:100%}',
      '.mint-modal-success.show .success-content{opacity:1;transform:translateY(0);transition-delay:0.5s}',
      '.mint-modal-success h2{margin:0;font-size:1.25rem;font-weight:700}',
      '.mint-modal-success p{margin:4px 0 0;color:var(--text-muted);font-size:0.9rem;line-height:1.6}',
      '.mint-modal-success .success-actions{display:flex;flex-direction:column;gap:10px;margin-top:14px;width:100%}',
      '.mint-modal-success .success-btn{width:100%;padding:14px;border-radius:999px;border:none;font-size:0.95rem;font-weight:700;cursor:pointer;transition:all 0.25s ease}',
      '.mint-modal-success .success-btn.primary{background:#000000;color:#fff}',
      '.mint-modal-success .success-btn.primary:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(0,0,0,0.35)}',
      '.mint-modal-success .success-btn.secondary{background:transparent;color:var(--text-muted);font-weight:600;padding:12px}',
      '.mint-modal-success .success-btn.secondary:hover{color:var(--text);background:rgba(0,0,0,0.03)}',
      '@media (max-width:768px){',
      '.mint-modal-overlay{padding:12px;align-items:flex-end}',
      '.mint-modal{border-radius:24px 24px 0 0;border-bottom-left-radius:0;border-bottom-right-radius:0}',
      '.mint-modal-overlay.active .mint-modal{transform:translateY(0)}',
      '.mint-modal-body{padding:18px 18px 22px;gap:14px}',
      '.mint-modal-header h2{font-size:0.9rem}',
      '.mint-modal-actor-name{font-size:1.2rem}',
      '.mint-price-bar{padding:14px 14px 14px;border-radius:14px}',
      '.mpb-price-value{font-size:1.35rem}',
      '.mint-slippage-notice{font-size:0.72rem}',
      '.mint-modal-footer .mint-btn{padding:14px;font-size:0.95rem;border-radius:999px}',
      '.mint-modal-success{padding:36px 20px 24px}',
      '}',
      '@media (max-width:599px){',
      '.mint-modal-overlay{padding:0;align-items:flex-end}',
      '.mint-modal{border-radius:20px 20px 0 0;border-bottom-left-radius:0;border-bottom-right-radius:0}',
      '.mint-modal-overlay.active .mint-modal{transform:translateY(0)}',
      '.mint-modal-hero{aspect-ratio:16/10}',
      '.mint-modal-body{padding:16px 16px 20px;gap:12px}',
      '.mint-modal-header h2{font-size:0.85rem;color:#8e8e93}',
      '.mint-modal-actor-name{font-size:1.1rem;font-weight:800;letter-spacing:-0.02em}',
      '.mint-price-bar{padding:14px 12px 12px;border-radius:14px;background:rgba(0,0,0,0.015)}',
      '.mpb-price-value{font-size:1.3rem}',
      '.mpb-price-row{margin-bottom:14px}',
      '.mint-slippage-notice{font-size:0.68rem;color:#8e8e93}',
      '.mint-modal-footer .mint-btn{padding:12px;font-size:0.9rem;border-radius:999px;font-weight:700}',
      '.mint-modal-footer .mint-btn.primary{background:linear-gradient(135deg,#000000,#00c89a)}',
      '.mint-modal-footer .mint-btn.primary:active{transform:scale(0.97)}',
      '.mint-modal-footer .mint-btn.secondary{color:#8e8e93}',
      '.mint-modal-success{padding:32px 16px 20px}',
      '}'
    ].join('');
    document.head.appendChild(s);
  }

  function open(config) {
    injectStyles();
    close();

    var pricing = config.pricing === 'fixed' ? 'fixed' : 'curve';
    var remain = (config.total || 0) - (config.minted || 0);
    var help = '<button class="actor-price-help" type="button">?</button>';
    var coeffRow = config.coeff
      ? '<span class="mpb-coeff-inline">价格系数 <strong>' + config.coeff + '</strong>' + help + '</span>' : '';
    var slip = (pricing === 'curve')
      ? '<div class="mint-slippage-notice">已开启 1% 滑点保护，价格超出时将取消交易</div>' : '';

    var overlay = document.createElement('div');
    overlay.className = 'mint-modal-overlay';
    overlay.innerHTML =
      '<div class="mint-modal" role="dialog" aria-modal="true">' +
        '<button class="mint-modal-close" type="button" aria-label="关闭弹窗">✕</button>' +
        '<div class="mint-modal-hero">' +
          '<img src="' + config.image + '" alt="角色预览" />' +
          '<div class="mint-modal-hero-overlay"></div>' +
          '<div class="mint-modal-badge">' + (config.tag || '角色 IP') + '</div>' +
        '</div>' +
        '<div class="mint-modal-body">' +
          '<div class="mint-modal-header">' +
            '<h2>' + config.title + '</h2>' +
            '<div class="mint-modal-actor-name">' + config.name + '</div>' +
          '</div>' +
          '<div class="mint-price-bar">' +
            '<div class="mpb-badge-row">' +
              '<span class="mpb-pricing-tag' + (pricing === 'fixed' ? ' fixed' : '') + '">' + (pricing === 'fixed' ? '固定价格' : '曲线价格') + help + '</span>' +
              coeffRow +
            '</div>' +
            '<div class="mpb-price-row">' +
              '<span class="mpb-price-value">' + config.price + '</span>' +
              '<span class="mpb-price-label">签约价</span>' +
            '</div>' +
            '<div class="mpb-progress">总发行 <strong>' + (config.total || 0).toLocaleString() + '</strong> · 剩余 <strong>' + Math.max(0, remain).toLocaleString() + '</strong></div>' +
          '</div>' +
          slip +
          '<div class="mint-modal-footer">' +
            '<button class="mint-btn primary" type="button">确认签约</button>' +
            '<button class="mint-btn secondary" type="button">取消</button>' +
          '</div>' +
        '</div>' +
        '<div class="mint-modal-success">' +
          '<div class="stamp-icon-wrap">' +
            '<div class="stamp-seal"><div class="stamp-seal-inner"><span>✓</span><span>签约</span></div></div>' +
            '<div class="stamp-ripple"></div>' +
            '<div class="stamp-ripple"></div>' +
          '</div>' +
          '<div class="success-content">' +
            '<h2>签约成功</h2>' +
            '<p>' + (config.success ? config.success.text : '') + '</p>' +
            '<div class="success-actions">' +
              (config.success && config.success.primary ? '<button class="success-btn primary" type="button">' + config.success.primary.label + '</button>' : '') +
              (config.success && config.success.secondary ? '<button class="success-btn secondary" type="button">' + config.success.secondary.label + '</button>' : '') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    current = { overlay: overlay, config: config };

    // 关闭相关
    overlay.querySelector('.mint-modal-close').addEventListener('click', close);
    overlay.querySelector('.mint-btn.secondary').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && current && current.overlay === overlay) close(); });

    // ? 价格帮助（始终显示；默认内置气泡说明，调用方传 onPriceHelp 则覆盖为页面实现）
    var isCurve = pricing === 'curve';
    var defaultHelpText = isCurve
      ? '签约价随已签约数按联合曲线上涨，越早签约越便宜。'
      : '该角色 IP 采用固定价格，销量变化不影响签约价。';
    overlay.querySelectorAll('.actor-price-help').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        if (typeof config.onPriceHelp === 'function') { config.onPriceHelp(config.name); return; }
        showHelpBubble(b, defaultHelpText);
      });
    });

    // 确认签约 → 业务 → 成功态
    var confirmBtn = overlay.querySelector('.mint-btn.primary');
    confirmBtn.addEventListener('click', function () {
      if (confirmBtn.disabled) return;
      confirmBtn.disabled = true;
      var orig = confirmBtn.textContent;
      confirmBtn.textContent = '签约中…';
      var done = function () {
        showSuccess(overlay, config);
      };
      if (typeof config.onConfirm === 'function') {
        try { config.onConfirm(done); } catch (e) { confirmBtn.disabled = false; confirmBtn.textContent = orig; }
      } else {
        done();
      }
    });

    // 成功态按钮
    var s = config.success || {};
    if (s.primary) {
      overlay.querySelector('.success-btn.primary').addEventListener('click', function () {
        if (typeof s.primary.onClick === 'function') s.primary.onClick();
        if (s.primary.href) { window.location.href = s.primary.href; return; }
        close();
      });
    }
    if (s.secondary) {
      overlay.querySelector('.success-btn.secondary').addEventListener('click', function () {
        if (typeof s.secondary.onClick === 'function') s.secondary.onClick();
        close();
      });
    }

    overlay.classList.add('active');
  }

  function showSuccess(overlay, config) {
    var body = overlay.querySelector('.mint-modal-body');
    var success = overlay.querySelector('.mint-modal-success');
    if (body) body.style.display = 'none';
    if (success) success.classList.add('show');
  }

  // 内置问号说明气泡（组件默认行为）
  function showHelpBubble(anchor, text) {
    var old = document.querySelector('.sgn-help-bubble');
    if (old) old.remove();
    var r = anchor.getBoundingClientRect();
    var b = document.createElement('div');
    b.className = 'sgn-help-bubble';
    b.style.cssText = 'position:fixed;z-index:10002;background:rgba(26,35,47,.95);color:#fff;font-size:12px;line-height:1.7;padding:10px 14px;border-radius:10px;max-width:260px;box-shadow:0 8px 24px rgba(0,0,0,.25);';
    b.textContent = text;
    document.body.appendChild(b);
    var bw = b.offsetWidth, bh = b.offsetHeight;
    var left = Math.min(Math.max(8, r.left + r.width / 2 - bw / 2), window.innerWidth - bw - 8);
    var top = r.bottom + 8;
    if (top + bh > window.innerHeight - 8) top = Math.max(8, r.top - bh - 8);
    b.style.left = left + 'px';
    b.style.top = top + 'px';
    function dismiss() {
      if (b.parentNode) b.remove();
      document.removeEventListener('click', dismiss, true);
      document.removeEventListener('keydown', esc);
    }
    function esc(e) { if (e.key === 'Escape') dismiss(); }
    setTimeout(dismiss, 2600);
    document.addEventListener('click', dismiss, true);
    document.addEventListener('keydown', esc);
  }

  function close() {
    if (current) {
      var o = current.overlay;
      current = null;
      if (o && o.parentNode) o.parentNode.removeChild(o);
    }
  }

  return { open: open, close: close };
})();
