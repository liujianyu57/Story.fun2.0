// ============================================================
//  Story.fun - Privy 模拟登录/注册系统
// ============================================================

// ============================================================
//  用户数据（模拟 Privy 登录）
// ============================================================
const PRIVY_MOCK_USER = {
  id: 'user_privy_001',
  name: '加密小白',
  bio: '在Web3的世界里探索短剧的无限可能。创作者、收藏家、梦想家。',
  email: 'crypto@story.fun',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  wallet: '0x7A2b3fD81234567890abcdef1234567890abCDEF',
  isLoggedIn: false,
  // 登录方式：'email' | 'wallet' | null
  authMethod: null,
  // 用户持有的角色 NFT 列表（持有 1 个及以上即可与任意角色进行 AI 对话）
  actorNfts: [

    'Luna', '苏婉清', '李云飞', '林梦瑶', '赵无极', '上官婉儿',
    '叶倾城', '慕容云', '花木兰', '东方朔', '柳如是', '萧景琰', '江小鱼'
  ], // 模拟：默认持有全部 13 个示例角色 NFT


  // 模拟的币种余额
  balances: {
    story: 10123,
    usdc: { Solana: 100.23, Ethereum: 0, BSC: 100.23, Arbitrum: 0 },
    usdt: { Solana: 500.00, Ethereum: 500.00, BSC: 0, Arbitrum: 0 }
  }
};

// ============================================================
//  状态管理 — 从 localStorage 恢复登录态
// ============================================================
function loadUserFromStorage() {
  try {
    const saved = localStorage.getItem('storyfun_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.isLoggedIn) return parsed;
    }
  } catch (e) {}
  return null;
}

function saveUserToStorage(user) {
  try {
    localStorage.setItem('storyfun_user', JSON.stringify(user));
  } catch (e) {}
}

function clearUserFromStorage() {
  try {
    localStorage.removeItem('storyfun_user');
  } catch (e) {}
}

const storedUser = loadUserFromStorage();
let currentUser = storedUser ? { ...PRIVY_MOCK_USER, ...storedUser, balances: { ...PRIVY_MOCK_USER.balances, ...(storedUser.balances || {}) } } : { ...PRIVY_MOCK_USER, isLoggedIn: false };

// ============================================================
//  DOM 就绪后初始化
// ============================================================
// 监听 header 加载完成事件（由 load-header.js 触发）
// 如果 header 已存在（直接内联的情况），则直接初始化
document.addEventListener('DOMContentLoaded', function() {
  // 检查是否已有 header（没有使用 load-header.js 的情况）
  const existingHeader = document.querySelector('.header');
  if (existingHeader) {
    initAuth();
  }
});

// 监听 load-header.js 发出的 header-loaded 事件
document.addEventListener('header-loaded', function() {
  initAuth();
});

function initAuth() {
  // 注入样式（只注入一次），然后查找所有 .auth-container 并渲染
  injectAuthStyles();
  const containers = document.querySelectorAll('.auth-container');
  containers.forEach(container => {
    renderAuthUI(container);
  });
}

// ============================================================
//  Inject dropdown styles
// ============================================================
function injectAuthStyles() {
  if (document.getElementById('authStyles')) return;
  const css = `
  /* ===== Login Modal Styles (shared across all pages) ===== */
  .auth-modal-overlay { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 24px; background: rgba(15,23,42,0.4); backdrop-filter: blur(4px); opacity: 0; visibility: hidden; transition: all 0.3s ease; }
  .auth-modal-overlay.active { opacity: 1; visibility: visible; }
  .auth-modal { background: var(--surface, #ffffff); border-radius: 28px; width: 100%; max-width: 420px; box-shadow: 0 40px 80px rgba(27,45,71,0.2); overflow: hidden; transform: scale(0.95) translateY(10px); transition: transform 0.3s ease; }
  .auth-modal-overlay.active .auth-modal { transform: scale(1) translateY(0); }
  .auth-modal-close { position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border-radius: 50%; border: none; background: rgba(0,0,0,0.04); cursor: pointer; display: grid; place-items: center; font-size: 1.1rem; color: var(--text-muted, #5e6f83); transition: all 0.2s; z-index: 1; }
  .auth-modal-close:hover { background: rgba(0,0,0,0.08); color: var(--text, #13202e); }
  .auth-modal-header { text-align: center; padding: 36px 28px 20px; position: relative; }
  .auth-modal-logo { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--accent, #00b388), #00d4a3); display: grid; place-items: center; color: #fff; font-weight: 700; font-size: 1.3rem; margin: 0 auto 16px; box-shadow: 0 4px 16px rgba(0,179,136,0.3); }
  .auth-modal-header h2 { margin: 0 0 6px; font-size: 1.4rem; color: var(--text, #13202e); }
  .auth-modal-header p { margin: 0; color: var(--text-muted, #5e6f83); font-size: 0.92rem; }
  .auth-modal-body { padding: 8px 28px 32px; display: flex; flex-direction: column; gap: 12px; }
  .auth-social-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 14px; border-radius: 14px; border: 1px solid var(--border, #deeaf7); background: var(--surface, #ffffff); color: var(--text, #13202e); font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
  .auth-social-btn:hover { border-color: var(--accent, #00b388); background: var(--accent-soft, rgba(0, 179, 136, 0.12)); }
  .auth-social-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .auth-divider { display: flex; align-items: center; gap: 12px; color: var(--text-muted, #5e6f83); font-size: 0.85rem; margin: 4px 0; }
  .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--border, #deeaf7); }
  .auth-wallet-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 14px; border-radius: 14px; border: 2px dashed var(--accent, #00b388); background: var(--accent-soft, rgba(0,179,136,0.12)); color: var(--accent, #00b388); font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
  .auth-wallet-btn:hover { background: rgba(0,179,136,0.2); }
  .auth-modal-tos { text-align: center; color: var(--text-muted, #5e6f83); font-size: 0.82rem; line-height: 1.6; margin: 4px 0 0; }
  .auth-modal-tos a { color: var(--accent, #00b388); text-decoration: none; }
  .auth-modal-tos a:hover { text-decoration: underline; }

  /* ===== Auth Dropdown Styles ===== */
  .auth-user-menu{position:relative;display:inline-block}
  .auth-avatar{width:48px;height:48px;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;cursor:pointer;border:3px solid rgba(0,0,0,0);box-sizing:border-box}
  .auth-avatar img{width:100%;height:100%;object-fit:cover;display:block}

  .auth-dropdown{position:absolute;right:0;top:64px;width:340px;background:#fff;border-radius:16px;padding:18px;box-shadow:0 18px 40px rgba(22,33,51,0.08);border:1px solid rgba(22,33,51,0.04);opacity:0;transform:translateY(-8px);pointer-events:none;transition:all 220ms ease;z-index:9999}
  .auth-dropdown.active,.auth-dropdown.active{opacity:1;transform:translateY(0);pointer-events:auto}

  .auth-dropdown-top{display:flex;cursor:pointer;gap:12px;align-items:center;padding-bottom:12px}
  .auth-dropdown-top-avatar{width:56px;height:56px;border-radius:50%;object-fit:cover}
  .auth-dropdown-main{font-weight:700;font-size:18px;color:#0b1720}
  .auth-dropdown-sub{color:#8b98a6;margin-top:4px}

  .auth-network-badge{display:flex;align-items:center;gap:8px;padding:10px 12px;margin:4px 0 8px;background:linear-gradient(135deg,rgba(153,69,255,0.08),rgba(20,241,149,0.08));border-radius:10px;font-weight:600;font-size:13px;color:#0b1720}
  .auth-network-badge svg{flex-shrink:0}

  .auth-balance-list{margin-top:8px}
  .auth-balance-item{display:flex;align-items:center;justify-content:space-between;background:#f7f8f9;padding:12px;border-radius:12px;margin-bottom:10px}
  .auth-balance-left{display:flex;align-items:center;gap:12px}
  .auth-token-icon{width:44px;height:44px;border-radius:10px;flex:0 0 44px}
  .token-story{background:linear-gradient(135deg,#00c2a8,#00b3ff);}
  .token-usdc{background:linear-gradient(135deg,#0bb07b,#10a37a);}
  .auth-token-name{font-weight:700}
  .auth-token-sub{color:#7d8a94;font-size:13px}
  .auth-balance-amount{font-weight:700;color:#0b1720}

   .auth-balance-actions{display:flex;gap:16px;padding:12px 0}
   .btn{padding:12px 20px;border-radius:28px;font-weight:700;cursor:pointer;border:0;flex:1}
  .btn-primary{background:linear-gradient(90deg,#00c2a8,#00b3ff);color:#fff}
  .btn-outline{background:transparent;border:2px solid #10b39a;color:#0b1720}

  .auth-dropdown-divider{height:1px;background:#eef2f4;margin:8px 0;border-radius:1px}
  .auth-dropdown-item{display:flex;align-items:center;gap:10px;padding:12px 6px;color:#0b1720;text-decoration:none}
  .auth-dropdown-item span{font-size:18px}
  .auth-dropdown-logout{color:#0b1720}

  /* Deposit Modal Styles */
  .deposit-overlay{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(15,23,42,0.4);backdrop-filter:blur(4px)}
  .deposit-card{width:100%;max-width:500px;max-height:560px;background:#fff;border-radius:16px;padding:24px;box-shadow:0 40px 80px rgba(27,45,71,0.2);display:flex;flex-direction:column;gap:20px;overflow:hidden}
  .deposit-header{display:flex;justify-content:space-between;align-items:center}
  .deposit-title{font-weight:700;font-size:18px;color:#1C2024}
  .deposit-close{width:24px;height:24px;border:none;background:transparent;cursor:pointer;display:grid;place-items:center;color:#60646C;font-size:18px;border-radius:50%;transition:background 0.2s;padding:0}
  .deposit-close:hover{background:rgba(0,0,0,0.06)}
  .deposit-body{display:flex;flex-direction:column;gap:32px}
  .deposit-info-banner{display:flex;align-items:center;gap:10px;padding:16px;background:rgba(1,186,178,0.16);border-radius:12px}
  .deposit-info-text{flex:1;font-size:12px;line-height:16px;color:#01BAB2}
  .deposit-field-group{display:flex;flex-direction:column;gap:8px}
  .deposit-field-label{font-weight:510;font-size:16px;color:#1C2024}
  .deposit-select-field{display:flex;justify-content:space-between;align-items:center;padding:8px 10px 8px 16px;height:48px;background:#F0F0F3;border-radius:12px;border:none;cursor:pointer}
  .deposit-select-left{display:flex;align-items:center;gap:12px}
  .deposit-crypto-icon{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;font-size:14px;flex-shrink:0}
  .deposit-crypto-usdc{background:#2775CA;color:#fff}
  .deposit-crypto-eth{background:#627EEA;color:#fff}
  .deposit-select-label{font-size:16px;color:#1C2024}
  .deposit-select-chevron{width:24px;height:24px;display:grid;place-items:center;color:#60646C;font-size:14px}
  .deposit-network-helper{font-size:12px;color:#8B8D98}
  .deposit-address-field{display:flex;align-items:center;gap:16px;padding:16px;border:1px solid #D9D9E0;border-radius:12px}
  .deposit-address-text{flex:1;font-size:16px;color:#1C2024;word-break:break-all;font-family:"SF Mono",monospace}
  .deposit-copy-btn{width:24px;height:24px;border:none;background:transparent;cursor:pointer;display:grid;place-items:center;color:#60646C;font-size:16px;border-radius:4px;padding:0;transition:color 0.2s}
  .deposit-copy-btn:hover{color:#00b388}
  .deposit-copy-btn.copied{color:#00b388}
  .deposit-qr-container{display:flex;gap:10px}
  .deposit-qr-image{width:160px;height:160px;border-radius:8px;object-fit:cover;background:#f0f4f8}
  .deposit-warning-text{display:flex;flex-direction:column;gap:6px}
  .deposit-warning-text p{margin:0;font-size:12px;line-height:16px;color:#60646C}

  /* Wallet Deposit Flow Styles */
  .deposit-back-btn{width:28px;height:28px;border:none;background:transparent;cursor:pointer;display:grid;place-items:center;color:#60646C;border-radius:8px;transition:all .15s;padding:0;flex-shrink:0}
  .deposit-back-btn:hover{background:rgba(0,0,0,.05);color:#1C2024}
  .deposit-back-btn svg{width:18px;height:18px}
  .deposit-step-title{font-weight:700;font-size:18px;color:#1C2024;flex:1}
  .dw-coin-list{display:flex;flex-direction:column;gap:6px;overflow-y:auto;flex:1;min-height:0}
  .dw-coin-item{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:12px;background:#F7F8F9;cursor:pointer;transition:all .15s;border:2px solid transparent;flex-shrink:0}
  .dw-coin-item:hover{border-color:#00b388;background:rgba(0,179,136,.06)}
  .dw-coin-item:active{transform:scale(.98)}
  .dw-selectable-row.selected{border-color:#00b388!important;background:rgba(0,179,136,.08)!important}
  .dw-coin-item.zero-balance{display:none}
  .dw-coin-icon{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;flex-shrink:0}
  .dw-coin-icon.story{background:linear-gradient(135deg,#00c2a8,#00b3ff)}
  .dw-coin-icon.usdc{background:linear-gradient(135deg,#0bb07b,#10a37a)}
  .dw-coin-icon.usdt{background:linear-gradient(135deg,#26A17B,#26A17B)}
  .dw-coin-icon-wrap{position:relative;display:inline-flex;flex-shrink:0}
  .dw-chain-badge{position:absolute;bottom:-4px;right:-4px;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff;font-weight:700;line-height:1;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.1)}
  .dw-coin-info{flex:1;min-width:0}
  .dw-coin-name{font-weight:700;font-size:15px;color:#1C2024}
  .dw-coin-chain{font-size:12px;color:#8B8D98;display:flex;align-items:center;gap:4px}
  .dw-coin-chain svg{flex-shrink:0}
  .dw-coin-balance{text-align:right}
  .dw-coin-balance-amount{font-weight:700;font-size:16px;color:#1C2024}
  .dw-coin-balance-label{font-size:11px;color:#8B8D98}
  .dw-coin-chevron{color:#C7C7CC;flex-shrink:0}
  .dw-selected-coin{display:flex;align-items:center;gap:10px;padding:12px 16px;background:#F0F0F3;border-radius:12px;margin-bottom:16px}
  .dw-amount-input-wrap{display:flex;align-items:baseline;justify-content:space-between;gap:6px;padding:20px 0 16px;border-bottom:2px solid #EEF2F4;transition:border-color .2s}
  .dw-amount-input-wrap:focus-within{border-bottom-color:#00b388}
  .dw-amount-input-wrap input{width:auto;min-width:0;max-width:200px;background:transparent;border:none;outline:none;font-size:36px;font-weight:700;color:#1C2024;font-family:inherit;text-align:left;-moz-appearance:textfield}
  .dw-amount-input-wrap input::-webkit-outer-spin-button,
  .dw-amount-input-wrap input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
  .dw-amount-input-wrap input::placeholder{color:#8B8D98;font-weight:400}
  .dw-amount-suffix{font-weight:700;font-size:20px;color:#1C2024;white-space:nowrap}
  .dw-quick-btns{display:flex;gap:8px;justify-content:center;padding-top:12px}
  .dw-quick-btn{padding:8px 16px;border-radius:999px;border:1px solid #EEF2F4;background:#F7F8F9;font-size:13px;font-weight:600;color:#5E6F83;cursor:pointer;transition:all .15s;font-family:inherit}
  .dw-quick-btn:hover{border-color:#00b388;color:#00b388;background:rgba(0,179,136,.06)}
  .dw-quick-btn:active{transform:scale(.96)}
  .dw-conversion-hint{font-size:12px;color:#8B8D98;line-height:16px;margin-top:8px;display:flex;align-items:center;gap:4px}
  .dw-swap-row{display:flex;align-items:center;justify-content:center;gap:16px;padding:16px;background:#F7F8F9;border-radius:14px;width:100%}
  .dw-swap-side{display:flex;align-items:center;gap:10px;min-width:0}
  .dw-swap-icon-wrap{position:relative;width:40px;height:40px;flex-shrink:0}
  .dw-swap-icon{width:40px;height:40px;border-radius:10px;display:grid;place-items:center}
  .dw-swap-icon.usdc{background:linear-gradient(135deg,#0bb07b,#10a37a)}
  .dw-swap-icon.usdt{background:linear-gradient(135deg,#26A17B,#26A17B)}
  .dw-swap-chain{position:absolute;bottom:-4px;right:-4px;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:7px;color:#fff;font-weight:700;line-height:1;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.1)}
  .dw-swap-text{display:flex;flex-direction:column;gap:2px;min-width:0}
  .dw-swap-text-label{font-size:12px;color:#8B8D98;line-height:1}
  .dw-swap-text-coin{font-weight:700;font-size:15px;color:#1C2024;line-height:1}
  .dw-swap-arrow{font-size:20px;color:#C7C7CC;flex-shrink:0}
  .dw-summary{display:flex;flex-direction:column;gap:16px}
  .dw-summary-row{display:flex;justify-content:space-between;align-items:center;padding:12px 0}
  .dw-summary-label{font-size:14px;color:#60646C}
  .dw-summary-value{font-weight:700;font-size:16px;color:#1C2024}
  .dw-divider{height:1px;background:#EEF2F4;margin:8px 0}
  .dw-method-list{display:flex;flex-direction:column;gap:10px}
  .dw-method-item{display:flex;align-items:center;gap:14px;padding:20px;border-radius:16px;background:#F7F8F9;cursor:pointer;transition:all .15s;border:2px solid transparent}
  .dw-method-item:hover{border-color:#00b388;background:rgba(0,179,136,.06)}
  .dw-method-item:active{transform:scale(.98)}
  .dw-chain-icons{display:flex;align-items:center;gap:6px}
  .dw-chain-icons img,.dw-chain-icons svg{width:18px;height:18px;border-radius:50%;object-fit:cover;flex-shrink:0}
  .dw-method-icon{width:48px;height:48px;display:grid;place-items:center;flex-shrink:0;border-radius:14px}
  .dw-method-icon.wallet-icon{background:linear-gradient(135deg,rgba(153,69,255,.15),rgba(20,241,149,.15))}
  .dw-method-icon.wallet-icon svg{color:#9945FF}
  .dw-method-icon.transfer-icon{background:linear-gradient(135deg,rgba(0,179,136,.12),rgba(0,179,136,.05))}
  .dw-method-icon.transfer-icon svg{color:#00b388}
  .dw-method-info{flex:1;min-width:0}
  .dw-method-name{font-weight:700;font-size:16px;color:#1C2024}
  .dw-method-desc{font-size:12px;color:#8B8D98;margin-top:2px}
  .dw-sign-btn{display:flex;justify-content:center;align-items:center;padding:14px 16px;background:linear-gradient(90deg,#00c2a8,#00b3ff);border:none;border-radius:14px;color:#fff;font-weight:700;font-size:16px;cursor:pointer;transition:all .2s;width:100%}
  .dw-sign-btn:hover{opacity:.9}
  .dw-sign-btn:active{transform:scale(.98)}
  .dw-sign-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
  
  /* Withdraw Modal Styles */
  .withdraw-overlay{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(15,23,42,0.4);backdrop-filter:blur(4px)}
  .withdraw-card{width:100%;max-width:500px;background:#fff;border-radius:16px;padding:24px;box-shadow:0 40px 80px rgba(27,45,71,0.2);display:flex;flex-direction:column;gap:32px}
  .withdraw-header{display:flex;justify-content:space-between;align-items:center}
  .withdraw-title{font-weight:700;font-size:18px;color:#1C2024}
  .withdraw-close{width:24px;height:24px;border:none;background:transparent;cursor:pointer;display:grid;place-items:center;color:#60646C;font-size:18px;border-radius:50%;transition:background 0.2s;padding:0}
  .withdraw-close:hover{background:rgba(0,0,0,0.06)}
  .withdraw-body{display:flex;flex-direction:column;gap:16px}
  .withdraw-balance-banner{display:flex;flex-direction:column;gap:6px;padding:16px;background:rgba(1,186,178,0.16);border-radius:12px}
  .withdraw-balance-label{font-size:12px;line-height:16px;color:#01BAB2}
  .withdraw-balance-amount{font-weight:700;font-size:30px;line-height:36px;color:#01BAB2}
  .withdraw-field-group{display:flex;flex-direction:column;gap:8px}
  .withdraw-field-label{font-weight:510;font-size:16px;color:#1C2024}
  .withdraw-input-field{display:flex;justify-content:space-between;align-items:center;padding:8px 10px 8px 16px;height:48px;background:#F0F0F3;border-radius:12px;border:none}
  .withdraw-input-field input{flex:1;background:transparent;border:none;outline:none;font-size:16px;color:#1C2024;font-family:inherit;min-width:0}
  .withdraw-scan-btn{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;background:transparent;border-radius:8px;cursor:pointer;color:#60646C;flex-shrink:0;transition:all 0.2s;padding:0}
  .withdraw-scan-btn:hover{color:#00BBA7;background:rgba(0,187,167,0.1)}
  .withdraw-connect-btn{display:flex;align-items:center;gap:4px;padding:4px 10px;border-radius:999px;border:1px solid rgba(153,69,255,.3);background:linear-gradient(135deg,rgba(153,69,255,.08),rgba(20,241,149,.08));cursor:pointer;white-space:nowrap;font-size:12px;font-weight:600;color:#9945FF;font-family:inherit;transition:all .15s;flex-shrink:0}
  .withdraw-connect-btn:hover{background:linear-gradient(135deg,rgba(153,69,255,.16),rgba(20,241,149,.16));border-color:rgba(153,69,255,.5)}
  .withdraw-connect-btn svg{width:14px;height:14px;flex-shrink:0}
  @media (min-width: 769px) { .withdraw-scan-btn { display: none; } }
  /* H5 扫码弹窗 */
  .qr-scanner-overlay{position:fixed;inset:0;z-index:10001;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,0.85);padding:24px}
  .qr-scanner-close{position:absolute;top:20px;right:20px;width:40px;height:40px;border-radius:50%;border:none;background:rgba(255,255,255,0.15);color:#fff;font-size:22px;cursor:pointer;display:grid;place-items:center;transition:background 0.2s;z-index:10}
  .qr-scanner-close:hover{background:rgba(255,255,255,0.25)}
  .qr-scanner-video{width:100%;max-width:360px;border-radius:16px;overflow:hidden}
  .qr-scanner-hint{color:rgba(255,255,255,0.7);font-size:14px;margin-top:20px;text-align:center}
  .qr-scanner-loading{color:#fff;font-size:16px;text-align:center}
  .withdraw-input-field input::placeholder{color:#60646C}
  .withdraw-input-hint{font-size:12px;line-height:16px;color:#8B8D98}
  .withdraw-input-suffix{font-weight:700;font-size:16px;color:#1C2024;white-space:nowrap}
  .withdraw-select-field{display:flex;justify-content:space-between;align-items:center;padding:8px 10px 8px 16px;height:48px;background:#F0F0F3;border-radius:12px;border:none;cursor:pointer}
  .withdraw-select-left{display:flex;align-items:center;gap:12px}
  .withdraw-crypto-icon{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;font-size:14px;flex-shrink:0}
  .withdraw-crypto-eth{background:#627EEA;color:#fff}
  .withdraw-select-label{font-size:16px;color:#1C2024}
  .withdraw-select-chevron{width:24px;height:24px;display:grid;place-items:center;color:#60646C;font-size:14px}
  .withdraw-quick-amounts{display:flex;gap:8px}
  .withdraw-quick-btn{flex:1;display:flex;justify-content:center;align-items:center;padding:6px 8px;border:1px solid #D9D9E0;background:#fff;border-radius:12px;font-weight:510;font-size:14px;color:#1C2024;cursor:pointer;transition:all 0.2s}
  .withdraw-quick-btn:hover{border-color:#00b388;color:#00b388}
  .withdraw-submit-btn{display:flex;justify-content:center;align-items:center;padding:10px 16px;background:linear-gradient(45deg,#05DF72 0%,#00BBA7 50%,#00B8DB 100%);border:none;border-radius:88px;color:#fff;font-weight:700;font-size:14px;cursor:pointer;transition:opacity 0.2s;width:100%}
  .withdraw-submit-btn:hover{opacity:0.9}
  .withdraw-warning-text{display:flex;flex-direction:column;gap:6px}
  .withdraw-warning-text p{margin:0;font-size:12px;line-height:16px;color:#60646C}
  .auth-copy-btn{width:22px;height:22px;border:none;background:transparent;color:var(--text-muted,#8b98a6);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0;padding:0;border-radius:4px}
  .auth-copy-btn:hover{color:var(--accent,#00b388);background:rgba(0,0,0,.04)}
  .auth-copy-btn svg{width:14px;height:14px}

   /* ===== Logout Confirm Modal ===== */
   .logout-confirm-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(15,23,42,0.4);backdrop-filter:blur(4px);opacity:0;visibility:hidden;transition:all .3s ease}
   .logout-confirm-overlay.active{opacity:1;visibility:visible}
   .logout-confirm-card{background:#fff;border-radius:20px;width:100%;max-width:320px;padding:24px;text-align:center;box-shadow:0 20px 60px rgba(27,45,71,0.2);transform:scale(.95) translateY(10px);transition:transform .3s ease}
   .logout-confirm-overlay.active .logout-confirm-card{transform:scale(1) translateY(0)}
   .logout-confirm-icon{font-size:40px;margin-bottom:12px}
   .logout-confirm-title{font-size:17px;font-weight:700;color:#13202e;margin-bottom:6px}
   .logout-confirm-desc{font-size:14px;color:#5e6f83;margin-bottom:24px}
   .logout-confirm-actions{display:flex;gap:12px}
   .logout-confirm-actions button{flex:1;padding:12px;border-radius:14px;border:none;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s}
   .logout-confirm-actions .btn-cancel{background:rgba(0,0,0,.06);color:#13202e}
   .logout-confirm-actions .btn-cancel:active{background:rgba(0,0,0,.12)}
   .logout-confirm-actions .btn-confirm{background:#f45b69;color:#fff}
   .logout-confirm-actions .btn-confirm:active{background:#d94355}

   /* ===== USDC + Avatar 连通胶囊 (桌面端顶栏) ===== */
  .dh-usdc-badge{display:inline-flex;align-items:center;padding:0;border-radius:999px;background:rgba(0,0,0,.04);cursor:pointer;flex-shrink:0;transition:all .15s;height:36px}
  .dh-usdc-badge:hover{background:rgba(0,0,0,.08)}
  .dh-usdc-amount{padding:0 4px 0 14px;font-size:12px;font-weight:600;color:#13202e;white-space:nowrap;line-height:36px}
  .dh-usdc-avatar-wrap{width:34px;height:34px;border-radius:50%;overflow:hidden;border:1.5px solid rgba(0,0,0,.08);flex-shrink:0;margin:1px;margin-left:6px;transition:border-color .15s}
  .dh-usdc-badge:hover .dh-usdc-avatar-wrap{border-color:#00b388}
  .dh-usdc-avatar-wrap img{width:100%;height:100%;object-fit:cover;display:block}
  `;

  const style = document.createElement('style');
  style.id = 'authStyles';
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}

// ============================================================
//  渲染登录/用户菜单
// ============================================================
function renderAuthUI(container) {
  if (currentUser.isLoggedIn) {
    // 根据登录方式展示不同内容：邮箱登录展示充值/提现按钮，钱包登录不展示
    const isEmail = currentUser.authMethod === 'email';
    var displayName = currentUser.name || (isEmail ? currentUser.email : 'User');
    var walletAddr = currentUser.wallet || '0x7A2b3fD81234567890abcdef1234567890abCDEF';
  var shortWallet = walletAddr.slice(0,6) + '...' + walletAddr.slice(-4);
  var subLabel = isEmail ? '邮箱用户' : '钱包用户';
    const usdcDisplay = typeof currentUser.balances?.usdc === 'number' ? `${currentUser.balances.usdc.toFixed(2)}` : '-';
    container.innerHTML = `
      <div class="auth-user-menu">
        <div class="dh-usdc-badge" onclick="toggleDropdown(event)">
          <span class="dh-usdc-amount">${usdcDisplay} USDC</span>
          <div class="dh-usdc-avatar-wrap">
            <img src="${currentUser.avatar}" alt="${currentUser.name}" />
          </div>
        </div>
        <div class="auth-dropdown" id="authDropdown">
          <div class="auth-dropdown-top" onclick="openProfileCenter()">
            <div class="auth-dropdown-top-left">
              <img class="auth-dropdown-top-avatar" src="${currentUser.avatar}" alt="${currentUser.name}" />
            </div>
            <div class="auth-dropdown-top-right">
              <div class="auth-dropdown-main">${displayName}</div>
              <div class="auth-dropdown-sub">${subLabel}</div>
            </div>
          </div>

          <div class="auth-network-badge">
            <svg width="16" height="16" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="url(#solana-grad)"/>
              <path d="M12.5 25.5L17.5 14.5L22.5 25.5L27.5 14.5" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="solana-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#9945FF"/>
                  <stop offset="1" stop-color="#14F195"/>
                </linearGradient>
              </defs>
            </svg>
            <span>Solana</span><span class="auth-wallet-addr" style="font-size:0.72rem;margin-left:6px">${shortWallet}</span><button class="auth-copy-btn" data-wallet="${walletAddr}" title="复制地址" style="margin-left:4px"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H9z"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
          </div>

          <div class="auth-balance-list">
            <div class="auth-balance-item">
              <div class="auth-balance-left">
                <div class="auth-token-icon token-story"></div>
                <div>
                  <div class="auth-token-name">STORY</div>
                  <div class="auth-token-sub">Story</div>
                </div>
              </div>
              <div class="auth-balance-amount">${typeof currentUser.balances?.story === 'number' ? currentUser.balances.story.toFixed(4) : '-'}
              </div>
            </div>

            <div class="auth-balance-item">
              <div class="auth-balance-left">
                <div class="auth-token-icon token-usdc"></div>
                <div>
                  <div class="auth-token-name">USDC</div>
                  <div class="auth-token-sub">USD Coin</div>
                </div>
              </div>
              <div class="auth-balance-amount">${usdcDisplay}</div>
            </div>
          </div>

          <button class="btn btn-primary" style="width:100%;margin-bottom:10px">交易 STORY</button>
          <div class="auth-balance-actions">
            <button class="btn btn-primary" onclick="openDepositModal()">充值</button>
            <button class="btn btn-outline" onclick="openWithdrawModal()">提现</button>
          </div>

          <div class="auth-dropdown-divider"></div>
             <a class="auth-dropdown-item" href="narrator.html">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            创作管理
          </a>
             <a class="auth-dropdown-item" href="referral.html">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            邀请
          </a>
          <a class="auth-dropdown-item" href="rewards.html">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            收益
          </a>
          <a class="auth-dropdown-item" href="#" onclick="showToast('🕘 交易记录开发中')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            交易记录
          </a>
          <a class="auth-dropdown-item auth-dropdown-logout" href="#" onclick="handleLogout()">

            <span>🚪</span> Logout
          </a>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button class="auth-login-btn" onclick="openLoginModal()">
        <span class="auth-login-icon">🔑</span>
        登录 / 注册
      </button>
    `;
  }
}

// ============================================================
//  登录弹窗
// ============================================================
function openLoginModal() {
  // 移除已存在的弹窗
  const existing = document.getElementById('authLoginModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.className = 'auth-modal-overlay';
  modal.id = 'authLoginModal';
  modal.innerHTML = `
    <div class="auth-modal">
      <button class="auth-modal-close" onclick="closeLoginModal()">✕</button>
      <div class="auth-modal-header">
        <div class="auth-modal-logo">AI</div>
        <h2>欢迎来到 Story.fun</h2>
        <p>连接你的钱包，开启 AI 短剧之旅</p>
      </div>
      <div class="auth-modal-body">
        <button class="auth-social-btn auth-social-email" onclick="mockLogin('email')">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          使用邮箱登录
        </button>
        <div class="auth-divider"><span>或使用钱包连接</span></div>
        <button class="auth-wallet-btn" onclick="mockLogin('wallet')">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/><circle cx="18" cy="12" r="2"/></svg>
          连接钱包
        </button>
        <p class="auth-modal-tos">
          继续即表示同意 <a href="#">服务条款</a> 和 <a href="#">隐私政策</a>
        </p>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  // 触发动画
  requestAnimationFrame(() => {
    modal.classList.add('active');
  });
  document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
  const modal = document.getElementById('authLoginModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
    }, 300);
  }
}

// ============================================================
//  模拟登录
// ============================================================
function mockLogin(method) {
  const methodNames = {
    google: 'Google',
    twitter: 'X (Twitter)',
    email: '邮箱',
    wallet: '钱包'
  };

  // 显示加载状态
  const modal = document.getElementById('authLoginModal');
  if (modal) {
    const btns = modal.querySelectorAll('button');
    btns.forEach(b => b.disabled = true);
  }

  setTimeout(() => {
    // 登录成功
    currentUser.isLoggedIn = true;
    // 记录登录方式
    currentUser.authMethod = method;
    currentUser.name = '加密小白';
    currentUser.avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
    // 如果是钱包登录，显示钱包地址为主要标识（保持 name 不变）
    if (method === 'wallet') {
      currentUser.wallet = currentUser.wallet || '0x7A2b...3fD8';
    }
    // 如果是邮箱登录，把 email 占位换成示例邮箱（可按需替换）
    if (method === 'email') {
      currentUser.email = currentUser.email || 'user@example.com';
    }

    // 保存登录态到 localStorage
    saveUserToStorage(currentUser);

    // 关闭弹窗
    closeLoginModal();

    // 重新渲染所有 auth-container
    const containers = document.querySelectorAll('.auth-container');
    containers.forEach(container => {
      renderAuthUI(container);
    });

    // 显示成功提示
    showToast(`✅ 已通过 ${methodNames[method] || 'Privy'} 登录成功`, '🎉');

    // 触发 auth-ready 事件，通知其他页面更新
    document.dispatchEvent(new CustomEvent('auth-ready'));
  }, 800);
}

// ============================================================
//  退出登录
// ============================================================
function showLogoutConfirm() {
  var existing = document.getElementById('logoutConfirmOverlay');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.className = 'logout-confirm-overlay';
  overlay.id = 'logoutConfirmOverlay';
  overlay.innerHTML = '<div class="logout-confirm-card">'
    + '<div class="logout-confirm-icon">🚪</div>'
    + '<div class="logout-confirm-title">退出登录</div>'
    + '<div class="logout-confirm-desc">确定要退出登录吗？</div>'
    + '<div class="logout-confirm-actions">'
    + '<button class="btn-cancel" id="logoutCancelBtn">取消</button>'
    + '<button class="btn-confirm" id="logoutConfirmBtn">确定</button>'
    + '</div></div>';
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(function() { overlay.classList.add('active'); });

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeLogoutConfirm();
  });
  document.getElementById('logoutCancelBtn').addEventListener('click', closeLogoutConfirm);
  document.getElementById('logoutConfirmBtn').addEventListener('click', function() {
    closeLogoutConfirm();
    doLogout();
  });
}

function closeLogoutConfirm() {
  var overlay = document.getElementById('logoutConfirmOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(function() { overlay.remove(); document.body.style.overflow = ''; }, 300);
  }
}

function doLogout() {
  currentUser.isLoggedIn = false;
  currentUser.authMethod = null;
  clearUserFromStorage();
  closeDropdown();
  var containers = document.querySelectorAll(".auth-container");
  containers.forEach(function(container){ renderAuthUI(container); });
  showToast('\u{1F44B} 已退出登录', '\u{1F44B}');
  document.dispatchEvent(new CustomEvent('auth-ready'));
}

function handleLogout() {
  closeDropdown();
  showLogoutConfirm();
}

// ============================================================
//  下拉菜单
// ============================================================
function toggleDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById('authDropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
  }
}

function closeDropdown() {
  const dropdown = document.getElementById('authDropdown');
  if (dropdown) {
    dropdown.classList.remove('active');
  }
}

// 点击外部关闭下拉菜单
document.addEventListener('click', function(e){
  var copyBtn = e.target.closest('.auth-copy-btn');
  if (copyBtn && copyBtn.dataset.wallet) {
    e.stopPropagation();
    navigator.clipboard.writeText(copyBtn.dataset.wallet).then(function(){ showToast('已复制钱包地址'); });
    return;
  }
  const dropdown = document.getElementById('authDropdown');
  if (dropdown && dropdown.classList.contains('active')) {
    const userMenu = dropdown.closest('.auth-user-menu');
    if (userMenu && !userMenu.contains(event.target)) {
      closeDropdown();
    }
  }
});

// ============================================================
//  个人中心
// ============================================================
function openProfileCenter() {
  closeDropdown();
  window.location.href = 'profile-center.html';
}

// ============================================================
//  提现弹窗（Withdraw Modal）
// ============================================================
function openWithdrawModal() {
  // 关闭下拉菜单
  closeDropdown();

  // 移除已存在的弹窗
  const existing = document.getElementById('withdrawModal');
  if (existing) existing.remove();

  const balance = currentUser.balances?.usdc || 0;
  const balanceFormatted = balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const modal = document.createElement('div');
  modal.id = 'withdrawModal';
  modal.innerHTML = `
    <div class="withdraw-overlay">
      <div class="withdraw-card">
        <div class="withdraw-header">
          <span class="withdraw-title">提现</span>
          <button class="withdraw-close" onclick="closeWithdrawModal()">✕</button>
        </div>
        <div class="withdraw-body">
          <div class="withdraw-field-group">
            <div class="withdraw-field-label">提现地址</div>
            <div class="withdraw-input-field">
              <input type="text" id="withdrawAddress" placeholder="输入接收USDC的钱包地址" />
              ${currentUser.authMethod === 'wallet' ? `
              <button class="withdraw-connect-btn" onclick="fillWalletAddress()" type="button" title="使用已连接钱包地址">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="3"/>
                  <path d="M2 9h20"/>
                  <circle cx="17" cy="14" r="2.5"/>
                </svg>
                已连接
              </button>
              ` : ''}
              <button class="withdraw-scan-btn" onclick="openQrScanner()" type="button" title="扫码识别地址">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
                  <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
                  <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                  <rect x="7" y="7" width="10" height="10" rx="1.5"/>
                  <path d="M12 10v4"/>
                  <path d="M10 12h4"/>
                </svg>
              </button>
            </div>
            <span class="withdraw-input-hint">请确认地址正确，转账后无法撤回</span>
          </div>

          <div class="withdraw-field-group">
            <div class="withdraw-field-label">提现网络</div>
            <button class="withdraw-select-field">
              <div class="withdraw-select-left">
                <div class="withdraw-crypto-icon withdraw-crypto-eth">Ξ</div>
                <span class="withdraw-select-label">Ethereum</span>
              </div>
              <span class="withdraw-select-chevron">▾</span>
            </button>
          </div>

          <div class="withdraw-field-group">
            <div class="withdraw-field-label">提现金额</div>
            <div class="withdraw-input-field">
              <input type="number" id="withdrawAmount" placeholder="输入提现金额" min="0" step="0.01" />
              <span class="withdraw-input-suffix">USDC</span>
            </div>
            <span style="font-size:12px;color:#8B8D98;padding-top:4px">可提现 $${balanceFormatted}</span>
          </div>

          <div class="withdraw-field-group">
            <button class="withdraw-submit-btn" onclick="handleWithdraw()">确认提现</button>
          </div>

          <div class="withdraw-warning-text">
            <p>• 最小提现金额：10 USDC</p>
            <p>• 请仔细核对提现地址和网络，转账后无法撤回</p>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  // 点击遮罩层关闭
  modal.querySelector('.withdraw-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeWithdrawModal();
  });
}

function closeWithdrawModal() {
  const modal = document.getElementById('withdrawModal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = '';
  }
}

// ============================================================
//  H5 扫码识别钱包地址（基于相机 / 图片上传）
// ============================================================
function openQrScanner() {
  // 先尝试使用原生 navigator.mediaDevices 调起相机扫码
  // 如果可用则展示相机预览，否则回退到文件上传方式
  if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // 展示全屏扫码 UI
    let scannerEl = document.getElementById('qrScannerOverlay');
    if (scannerEl) scannerEl.remove();

    const overlay = document.createElement('div');
    overlay.id = 'qrScannerOverlay';
    overlay.className = 'qr-scanner-overlay';
    overlay.innerHTML = `
      <button class="qr-scanner-close" onclick="closeQrScanner()">✕</button>
      <div class="qr-scanner-loading">📷 正在启动相机...</div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // 尝试启动后置摄像头
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(function(stream) {
        // 创建 video 元素
        const video = document.createElement('video');
        video.className = 'qr-scanner-video';
        video.setAttribute('autoplay', '');
        video.setAttribute('playsinline', '');
        video.srcObject = stream;
        overlay.innerHTML = `
          <button class="qr-scanner-close" onclick="closeQrScanner()">✕</button>
          <video class="qr-scanner-video" autoplay playsinline></video>
          <div class="qr-scanner-hint">将二维码对准相机</div>
          <div class="qr-scanner-hint" style="margin-top:8px;font-size:12px;color:rgba(255,255,255,0.5)">或 <button onclick="openQrScannerFallback()" style="background:none;border:none;color:#00BBA7;text-decoration:underline;cursor:pointer;font-size:13px">上传二维码图片</button></div>
        `;
        const videoEl = overlay.querySelector('video');
        videoEl.srcObject = stream;
        videoEl.play();

        // 保存 stream 以便关闭时释放
        overlay._stream = stream;

        // 简易扫码：用 canvas 定时截图尝试识别（需要加载 jsQR 库）
        loadJsQrLibrary(function() {
          startQrScanning(videoEl, stream);
        });
      })
      .catch(function() {
        // 相机启动失败，回退到文件上传
        openQrScannerFallback();
      });
  } else {
    // 不支持相机，回退到文件上传
    openQrScannerFallback();
  }
}

function closeQrScanner() {
  const overlay = document.getElementById('qrScannerOverlay');
  if (overlay) {
    // 释放相机资源
    if (overlay._stream) {
      overlay._stream.getTracks().forEach(function(track) { track.stop(); });
    }
    if (window._qrScanTimer) {
      clearInterval(window._qrScanTimer);
      window._qrScanTimer = null;
    }
    overlay.remove();
    document.body.style.overflow = '';
  }
}

function openQrScannerFallback() {
  const overlay = document.getElementById('qrScannerOverlay');
  if (!overlay) return;

  // 释放已有相机
  if (overlay._stream) {
    overlay._stream.getTracks().forEach(function(track) { track.stop(); });
  }
  if (window._qrScanTimer) {
    clearInterval(window._qrScanTimer);
    window._qrScanTimer = null;
  }

  // 替换为文件上传 UI
  overlay.innerHTML = `
    <button class="qr-scanner-close" onclick="closeQrScanner()">✕</button>
    <div style="display:flex;flex-direction:column;align-items:center;gap:16px">
      <div style="width:120px;height:120px;border-radius:20px;background:rgba(255,255,255,0.1);display:grid;place-items:center;font-size:48px">📷</div>
      <div class="qr-scanner-hint">选择包含二维码的图片</div>
      <input type="file" id="qrFileInput" accept="image/*" style="display:none" onchange="decodeQrFromFile(event)" />
      <button onclick="document.getElementById('qrFileInput').click()" style="padding:12px 24px;border-radius:999px;border:none;background:#00BBA7;color:#fff;font-size:15px;font-weight:600;cursor:pointer">选择图片</button>
    </div>
  `;
}

function decodeQrFromFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      // 尝试用 jsQR 解码
      loadJsQrLibrary(function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        try {
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleQrResult(code.data);
          } else {
            showToast('⚠️ 未识别到二维码，请重试');
          }
        } catch(err) {
          showToast('⚠️ 二维码识别失败');
        }
      });
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function loadJsQrLibrary(callback) {
  if (typeof jsQR !== 'undefined') {
    callback();
    return;
  }
  // 动态加载 jsQR 库
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
  script.onload = callback;
  script.onerror = function() {
    // 加载失败，手动输入提示
    showToast('⚠️ 扫码库加载失败，请手动输入地址');
    closeQrScanner();
  };
  document.head.appendChild(script);
}

function startQrScanning(videoEl, stream) {
  if (window._qrScanTimer) {
    clearInterval(window._qrScanTimer);
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let scanCount = 0;

  window._qrScanTimer = setInterval(function() {
    if (!videoEl.videoWidth || !videoEl.videoHeight) return;

    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    try {
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code && code.data) {
        handleQrResult(code.data);
      }
    } catch(e) {
      // 识别出错时忽略
    }

    scanCount++;
    // 最多扫描 300 次（约 30 秒）后停止
    if (scanCount > 300) {
      clearInterval(window._qrScanTimer);
      window._qrScanTimer = null;
      showToast('⏱️ 扫码超时，请重试或手动输入');
    }
  }, 100);
}

function handleQrResult(data) {
  // 关闭扫码 UI
  closeQrScanner();

  // 尝试提取钱包地址（支持 eth 地址格式 0x... 或直接地址）
  let address = data.trim();

  // 如果是以 ethereum: 开头的协议 URI，提取地址部分
  if (address.startsWith('ethereum:')) {
    address = address.replace(/^ethereum:/, '').replace(/[?&].*$/, '');
  }

  // 验证是否为有效的以太坊地址格式（0x + 40 位 hex）
  if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    const input = document.getElementById('withdrawAddress');
    if (input) {
      input.value = address;
      showToast('✅ 已识别钱包地址');
    }
  } else if (/^[a-fA-F0-9]{40}$/.test(address)) {
    // 没有 0x 前缀的地址，自动补上
    address = '0x' + address;
    const input = document.getElementById('withdrawAddress');
    if (input) {
      input.value = address;
      showToast('✅ 已识别钱包地址');
    }
  } else {
    // 尝试判断是否为其他链地址或不符合格式
    showToast('⚠️ 识别的地址格式不正确，请手动确认');
    const input = document.getElementById('withdrawAddress');
    if (input) {
      input.value = data.trim();
    }
  }
}


function fillWalletAddress() {
  var input = document.getElementById('withdrawAddress');
  if (input) {
    input.value = '0x7A2b3fD81234567890abcdef1234567890abCDEF';
    showToast('✅ 已填入钱包地址');
  }
}

function setQuickAmount(value) {
  const input = document.getElementById('withdrawAmount');
  if (!input) return;
  if (value === 'max') {
    input.value = currentUser.balances?.usdc || 0;
  } else {
    input.value = value;
  }
}

function handleWithdraw() {
  const address = document.getElementById('withdrawAddress')?.value?.trim();
  const amount = parseFloat(document.getElementById('withdrawAmount')?.value);

  if (!address) {
    showToast('⚠️ 请输入提现地址');
    return;
  }
  if (!amount || amount <= 0) {
    showToast('⚠️ 请输入有效的提现金额');
    return;
  }
  if (amount < 10) {
    showToast('⚠️ 最小提现金额为 10 USDC');
    return;
  }
  if (amount > (currentUser.balances?.usdc || 0)) {
    showToast('⚠️ 余额不足');
    return;
  }

  // 模拟提现成功
  currentUser.balances.usdc -= amount;
  closeWithdrawModal();

  // 刷新余额显示
  const containers = document.querySelectorAll('.auth-container');
  containers.forEach(container => {
    renderAuthUI(container);
  });

  showToast(`✅ 提现成功！已提现 $${amount.toFixed(2)} USDC`);
}

// ============================================================
//  充值弹窗（Deposit Modal）
// ============================================================
// 桌面端钱包充值批次
var dwSelectedCoin = null;
var dwSelectedAmount = 0;

function openDepositModal() {
  closeDropdown();
  if (currentUser.authMethod === 'wallet') {
    openDepositWalletStep1();
  } else {
    openDepositTransferModal();
  }
}

// ===== 邮箱用户：转账地址弹窗（原有逻辑） =====
function openDepositTransferModal(fromWallet) {
  const existing = document.getElementById('depositModal');
  if (existing) existing.remove();

  var headerHTML = fromWallet
    ? '<div class="deposit-header"><button class="deposit-back-btn" onclick="dwBackToWalletStep1()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button><span class="deposit-title">充值</span><button class="deposit-close" onclick="closeDepositModal()">✕</button></div>'
    : '<div class="deposit-header"><span class="deposit-title">充值</span><button class="deposit-close" onclick="closeDepositModal()">✕</button></div>';

  const modal = document.createElement('div');
  modal.id = 'depositModal';
  modal.innerHTML = '<div class="deposit-overlay"><div class="deposit-card" style="max-height:none;padding:20px">'
    + headerHTML
    + '<div class="deposit-body" style="gap:18px">'
    + '<div class="deposit-field-group"><div class="deposit-field-label">币种</div>'
    + '<button class="deposit-select-field"><div class="deposit-select-left"><div class="deposit-crypto-icon deposit-crypto-usdc">$</div><span class="deposit-select-label">USDC</span></div><span class="deposit-select-chevron">▾</span></button></div>'
    + '<div class="deposit-field-group"><div class="deposit-field-label">网络</div>'
    + '<button class="deposit-select-field"><div class="deposit-select-left"><div class="deposit-crypto-icon deposit-crypto-eth">Ξ</div><span class="deposit-select-label">Ethereum</span></div><span class="deposit-select-chevron">▾</span></button>'
    + '</div>'
    + '<div style="display:flex;justify-content:center"><img class="deposit-qr-image" src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=0xcc345ff2905f5672227e848eac4e0124123fa7e4" alt="充值地址二维码" onerror="this.style.display=\'none\'" style="width:120px;height:120px;border-radius:8px;object-fit:cover;background:#f0f4f8" /></div>'
    + '<div class="deposit-field-group"><div class="deposit-field-label">充值地址</div>'
    + '<div class="deposit-address-field" style="padding:12px"><span class="deposit-address-text">0xcc345ff2905f5672227e848eac4e0124123fa7e4</span><button class="deposit-copy-btn" onclick="depositCopyAddress()">📋</button></div></div>'
    + '<div class="dw-swap-row" style="margin-top:4px">'
    + '<div class="dw-swap-side"><div class="dw-swap-icon-wrap"><div class="dw-swap-icon usdc"></div><div class="dw-swap-chain" style="background:#627EEA">E</div></div><div class="dw-swap-text"><span class="dw-swap-text-label">发送</span><span class="dw-swap-text-coin">USDC</span></div></div>'
    + '<span class="dw-swap-arrow">→</span>'
    + '<div class="dw-swap-side"><div class="dw-swap-icon-wrap"><div class="dw-swap-icon usdc"></div><div class="dw-swap-chain" style="background:linear-gradient(135deg,#9945FF,#14F195)">S</div></div><div class="dw-swap-text"><span class="dw-swap-text-label">接收</span><span class="dw-swap-text-coin">USDC</span></div></div>'
    + '</div>'
    + '<div style="font-size:12px;color:#8B8D98;text-align:center;line-height:1.6;">将代币发送到这个地址，它将自动在你的 Story.fun 账户中兑换成USDC</div>'
    + '</div></div></div>';
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  modal.querySelector('.deposit-overlay').addEventListener('click', function(e) { if (e.target === this) closeDepositModal(); });
}

function closeDepositModal() {
  var modal = document.getElementById('depositModal');
  if (modal) { modal.remove(); document.body.style.overflow = ''; }
}

function depositCopyAddress() {
  navigator.clipboard.writeText('0xcc345ff2905f5672227e848eac4e0124123fa7e4').then(function(){ showToast('✅ 地址已复制到剪贴板'); });
}

// ===== 钱包用户：4步充值向导 =====
// Step 1: 充值
function openDepositWalletStep1() {
  var existing = document.getElementById('depositWalletModal');
  if (existing) existing.remove();

  var modal = document.createElement('div');
  modal.id = 'depositWalletModal';
  modal.innerHTML = '<div class="deposit-overlay"><div class="deposit-card">'
    + '<div class="deposit-header"><span class="deposit-step-title">充值</span><button class="deposit-close" onclick="closeDepositWalletModal()">✕</button></div>'
    + '<div style="padding:0 0 4px 4px;font-size:13px;color:#8B8D98;text-align:left">Story.fun 余额：' + (typeof currentUser.balances?.usdc === 'number' ? currentUser.balances.usdc.toFixed(2) : '0.00') + ' USDC</div>'
    + '<div class="deposit-body" style="gap:24px"><div class="dw-method-list">'
    + '<div class="dw-method-item" onclick="openDepositWalletStep2()">'
    + '<div class="dw-method-icon wallet-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 9h20"/><circle cx="17" cy="14" r="2.5"/></svg></div>'
    + '<div class="dw-method-info"><div class="dw-method-name">钱包 (...' + (currentUser.wallet || '0x7A2b3fD81234567890abcdef1234567890abCDEF').slice(-4) + ')</div><div class="dw-method-desc"><strong>$' + ((typeof currentUser.balances?.usdc === 'number' ? currentUser.balances.usdc * 4 : 0) + (typeof currentUser.balances?.usdt === 'number' ? currentUser.balances.usdt * 4 : 0)).toFixed(2) + '</strong></div></div>'
    + '<svg class="dw-coin-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>'
    + '</div>'
    + '<div class="dw-method-item" onclick="dwChooseTransfer()">'
    + '<div class="dw-method-icon transfer-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16l-4-4 4-4"/><path d="M3 12h13a4 4 0 0 1 4 4"/><path d="M17 8l4 4-4 4"/><path d="M21 12H8a4 4 0 0 0-4-4"/></svg></div>'
    + '<div class="dw-method-info"><div class="dw-method-name">转账加密货币</div><div class="dw-method-desc">从交易所或其他钱包转账</div></div>'
    + '<div class="dw-chain-icons" style="align-self:center"><span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,#627EEA,#8C7AE6);font-size:8px;color:#fff;font-weight:700">S</span><span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:#E8E8ED;font-size:7px;color:#3C3C43;font-weight:700">E</span><span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:#F0B90B;font-size:8px;color:#fff;font-weight:700">B</span><span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:#28A0F0;font-size:7px;color:#fff;font-weight:700">A</span></div>'
    + '<svg class="dw-coin-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="flex-shrink:0"><polyline points="9 18 15 12 9 6"/></svg>'
    + '</div>'
    + '</div></div></div></div>';
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  modal.querySelector('.deposit-overlay').addEventListener('click', function(e) { if (e.target === this) closeDepositWalletModal(); });
}

function dwChooseTransfer() {
  closeDepositWalletModal();
  openDepositTransferModal(true);
}

function dwBackToWalletStep1() {
  closeDepositModal();
  openDepositWalletStep1();
}

// Step 2: 选择币种和链
var dwSelectedChain = 'Solana';

function openDepositWalletStep2() {
  var modal = document.getElementById('depositWalletModal');
  if (!modal) return;

  var chains = [
    { id: 'Solana',   label: 'Solana',   bg: 'linear-gradient(135deg,#9945FF,#14F195)', letter: 'S' },
    { id: 'Ethereum', label: 'Ethereum', bg: '#627EEA', letter: 'E' },
    { id: 'BSC',      label: 'BSC',      bg: '#F0B90B', letter: 'B' },
    { id: 'Arbitrum', label: 'Arbitrum', bg: '#28A0F0', letter: 'A' }
  ];
  var coins = ['USDC','USDT'];
  var usdcBal = typeof currentUser.balances?.usdc === 'number' ? currentUser.balances.usdc.toFixed(2) : '0.00';
  var usdtBal = typeof currentUser.balances?.usdt === 'number' ? currentUser.balances.usdt.toFixed(2) : '0.00';

  var html = '';
  for (var ci = 0; ci < coins.length; ci++) {
    var coin = coins[ci];
    var bal = coin === 'USDC' ? usdcBal : usdtBal;
    var iconClass = coin === 'USDC' ? 'usdc' : 'usdt';
    for (var ci2 = 0; ci2 < chains.length; ci2++) {
      var ch = chains[ci2];
      var balNum = parseFloat(bal);
      var dimClass = balNum <= 0 ? ' zero-balance' : '';
      html += '<div class="dw-coin-item dw-selectable-row' + dimClass + '" data-coin="' + coin + '" data-chain="' + ch.id + '">'
        + '<div class="dw-coin-icon-wrap"><div class="dw-coin-icon ' + iconClass + '"></div>'
        + '<div class="dw-chain-badge" style="background:' + ch.bg + '">' + ch.letter + '</div></div>'
        + '<div class="dw-coin-info"><div class="dw-coin-name">' + coin + '</div><div class="dw-coin-chain">' + ch.label + '</div></div>'
        + '<div class="dw-coin-balance"><div class="dw-coin-balance-amount">' + bal + '</div><div class="dw-coin-balance-label">余额</div></div>'
        + '</div>';
    }
  }

  modal.innerHTML = '<div class="deposit-overlay"><div class="deposit-card">'
    + '<div class="deposit-header"><button class="deposit-back-btn" onclick="openDepositWalletStep1()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button><span class="deposit-step-title">充值</span><button class="deposit-close" onclick="closeDepositWalletModal()">✕</button></div>'
    + '<div style="padding:0 0 4px 4px;font-size:13px;color:#8B8D98;text-align:left;flex-shrink:0">Story.fun 余额：' + usdcBal + ' USDC</div>'
    + '<div class="deposit-body" style="flex:1;min-height:0;overflow:hidden;gap:8px"><div class="dw-coin-list">' + html + '</div></div>'
    + '<button class="dw-sign-btn" id="dwCoinContinueBtn" onclick="dwCoinContinue()" disabled style="flex-shrink:0">继续</button>'
    + '</div></div>';

  dwSelectedCoin = null;
  dwSelectedChain = null;

  modal.querySelector('.dw-coin-list').addEventListener('click', function(e) {
    var row = e.target.closest('.dw-selectable-row');
    if (!row) return;
    var prev = modal.querySelector('.dw-selectable-row.selected');
    if (prev) prev.classList.remove('selected');
    row.classList.add('selected');
    dwSelectedCoin = row.dataset.coin;
    dwSelectedChain = row.dataset.chain;
    document.getElementById('dwCoinContinueBtn').disabled = false;
  });

  modal.querySelector('.deposit-overlay').addEventListener('click', function(e) { if (e.target === this) closeDepositWalletModal(); });
}

function dwCoinContinue() {
  if (!dwSelectedCoin || !dwSelectedChain) return;
  dwSelectedAmount = 0;
  openDepositWalletStep3();
}

// Step 3: 输入金额
function openDepositWalletStep3() {
  var modal = document.getElementById('depositWalletModal');
  if (!modal) return;
  var coin = dwSelectedCoin;
  var bal, balance, iconClass;
  if (coin === 'USDT') {
    var balNum = currentUser.balances?.usdt || 0;
    bal = balNum.toFixed(2);
    balance = balNum;
    iconClass = 'usdt';
  } else if (coin === 'USDC') {
    var balNum = currentUser.balances?.usdc || 0;
    bal = balNum.toFixed(2);
    balance = balNum;
    iconClass = 'usdc';
  } else {
    var balNum = currentUser.balances?.story || 0;
    bal = balNum.toFixed(4);
    balance = balNum;
    iconClass = 'story';
  }
  modal.innerHTML = '<div class="deposit-overlay"><div class="deposit-card">'
    + '<div class="deposit-header"><button class="deposit-back-btn" onclick="openDepositWalletStep2()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button><span class="deposit-step-title">充值</span><button class="deposit-close" onclick="closeDepositWalletModal()">✕</button></div>'
    + '<div style="padding:0 0 4px 4px;font-size:13px;color:#8B8D98;text-align:left;flex-shrink:0">Story.fun 余额：' + bal + ' USDC</div>'
    + '<div class="deposit-body" style="gap:16px;flex:1;align-items:center">'
    + '<div class="dw-amount-input-wrap"><input type="number" id="dwAmountInput" placeholder="0" min="0" max="' + balance + '" step="any" oninput="dwOnAmountInput()" /><span class="dw-amount-suffix">' + coin + '</span></div>'
    + '<div class="dw-quick-btns"><button class="dw-quick-btn" onclick="dwSetQuickAmount(\'25\',' + balance + ')">25%</button><button class="dw-quick-btn" onclick="dwSetQuickAmount(\'50\',' + balance + ')">50%</button><button class="dw-quick-btn" onclick="dwSetQuickAmount(\'75\',' + balance + ')">75%</button><button class="dw-quick-btn" onclick="dwSetQuickAmount(\'max\',' + balance + ')">最大</button></div>'
    + '<div class="dw-swap-row">'
    + '<div class="dw-swap-side">'
    + '<div class="dw-swap-icon-wrap"><div class="dw-swap-icon ' + iconClass + '"></div><div class="dw-swap-chain" style="background:' + (function(){var c=dwSelectedChain,bg;if(c==="Solana")bg="linear-gradient(135deg,#9945FF,#14F195)";else if(c==="Ethereum")bg="#627EEA";else if(c==="BSC")bg="#F0B90B";else bg="#28A0F0";return bg;})() + '">' + dwSelectedChain.charAt(0) + '</div></div>'
    + '<div class="dw-swap-text"><span class="dw-swap-text-label">发送</span><span class="dw-swap-text-coin">' + coin + '</span></div>'
    + '</div>'
    + '<span class="dw-swap-arrow">→</span>'
    + '<div class="dw-swap-side">'
    + '<div class="dw-swap-icon-wrap"><div class="dw-swap-icon usdc"></div><div class="dw-swap-chain" style="background:linear-gradient(135deg,#9945FF,#14F195)">S</div></div>'
    + '<div class="dw-swap-text"><span class="dw-swap-text-label">接收</span><span class="dw-swap-text-coin" id="dwReceiveAmount">' + Math.ceil(balance / 2) + ' USDC</span></div>'
    + '</div></div>'
    + '<button class="dw-sign-btn" id="dwContinueBtn" onclick="dwSignAndDeposit()" disabled>确认充值</button>'
    + '</div></div></div>';
  modal.querySelector('.deposit-overlay').addEventListener('click', function(e) { if (e.target === this) closeDepositWalletModal(); });
  setTimeout(function() {
    var inp = document.getElementById('dwAmountInput');
    if (inp) {
      var defaultVal = Math.ceil(balance / 2);
      inp.value = defaultVal;
      dwSelectedAmount = defaultVal;
      var btn = document.getElementById('dwContinueBtn');
      if (btn) btn.disabled = false;
      inp.focus();
    }
  }, 100);
}

function dwOnAmountInput() {
  var val = parseFloat(document.getElementById('dwAmountInput').value) || 0;
  dwSelectedAmount = val;
  var btn = document.getElementById('dwContinueBtn');
  if (btn) btn.disabled = val <= 0;
  var receiveEl = document.getElementById('dwReceiveAmount');
  if (receiveEl) receiveEl.textContent = val + ' USDC';
}

function dwSetQuickAmount(type, maxBalance) {
  var inp = document.getElementById('dwAmountInput');
  if (!inp) return;
  if (type === 'max') {
    inp.value = maxBalance;
  } else {
    var pct = parseInt(type) / 100;
    inp.value = (maxBalance * pct).toFixed(2);
  }
  dwSelectedAmount = parseFloat(inp.value) || 0;
  var btn = document.getElementById('dwContinueBtn');
  if (btn) btn.disabled = false;
  var receiveEl = document.getElementById('dwReceiveAmount');
  if (receiveEl) receiveEl.textContent = dwSelectedAmount + ' USDC';
}

function dwContinue() {
  if (dwSelectedAmount <= 0) return;
  openDepositWalletStep4();
}

// Step 4: 签名确认
function openDepositWalletStep4() {
  var modal = document.getElementById('depositWalletModal');
  if (!modal) return;
  var coin = dwSelectedCoin;
  var amount = dwSelectedAmount;
  modal.innerHTML = '<div class="deposit-overlay"><div class="deposit-card">'
    + '<div class="deposit-header"><button class="deposit-back-btn" onclick="openDepositWalletStep3()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button><span class="deposit-step-title">确认充值</span><button class="deposit-close" onclick="closeDepositWalletModal()">✕</button></div>'
    + '<div class="deposit-body" style="gap:16px"><div class="dw-summary">'
    + '<div class="dw-summary-row"><span class="dw-summary-label">币种</span><span class="dw-summary-value">' + coin + '</span></div>'
    + '<div class="dw-summary-row"><span class="dw-summary-label">充值金额</span><span class="dw-summary-value">' + amount + ' ' + coin + '</span></div>'
    + '<div class="dw-divider"></div>'
    + '<div class="dw-summary-row"><span class="dw-summary-label">网络</span><span class="dw-summary-value">Solana</span></div>'
    + '</div>'
    + '<div style="text-align:center;color:#8B8D98;font-size:13px;padding:8px 0">将在钱包中确认此交易</div>'
    + '<button class="dw-sign-btn" id="dwSignBtn" onclick="dwSignAndDeposit()">确认签名</button>'
    + '</div></div></div>';
  modal.querySelector('.deposit-overlay').addEventListener('click', function(e) { if (e.target === this) closeDepositWalletModal(); });
}

function dwSignAndDeposit() {
  var btn = document.getElementById('dwContinueBtn') || document.getElementById('dwSignBtn');
  if (btn) { btn.disabled = true; btn.textContent = '签名中...'; }
  setTimeout(function() {
    closeDepositWalletModal();
    showToast('✅ 签名完成，正在充值 ' + dwSelectedAmount + ' ' + dwSelectedCoin + '...');
  }, 1500);
}

function closeDepositWalletModal() {
  var modal = document.getElementById('depositWalletModal');
  if (modal) { modal.remove(); document.body.style.overflow = ''; }
}

// ============================================================
//  Toast 提示（兼容各页面已有的 toast 系统）
// ============================================================
function showToast(msg, icon) {

  // 尝试使用页面已有的 toast 系统
  const existingToast = document.getElementById('toastNotification');
  if (existingToast) {
    const msgEl = document.getElementById('toastMessage');
    const iconEl = existingToast.querySelector('.toast-icon');
    if (msgEl) msgEl.textContent = msg;
    if (iconEl && icon) iconEl.textContent = icon;
    existingToast.classList.add('show');
    clearTimeout(window._authToastTimer);
    window._authToastTimer = setTimeout(() => {
      existingToast.classList.remove('show');
    }, 3000);
    return;
  }

  // 如果没有 toast 系统，创建一个临时的
  let toast = document.getElementById('authTempToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'authTempToast';
    toast.style.cssText = `
      position: fixed; top: 24px; left: 50%; transform: translateX(-50%) translateY(-100px);
      z-index: 99999; background: rgba(26, 35, 47, 0.95); backdrop-filter: blur(8px);
      color: #fff; padding: 16px 24px; border-radius: 16px; font-size: 0.92rem;
      line-height: 1.6; box-shadow: 0 12px 40px rgba(27, 45, 71, 0.25);
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
      opacity: 0; pointer-events: none; max-width: 420px; text-align: center; font-weight: 500;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = (icon || '💡') + ' ' + msg;
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity = '1';
  });
  clearTimeout(window._authToastTimer);
  window._authToastTimer = setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(-100px)';
    toast.style.opacity = '0';
  }, 3000);
}
