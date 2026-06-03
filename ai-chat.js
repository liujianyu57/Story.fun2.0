// ============================================================
//  Story.fun - 演员 AI 对话模块
//  持有 1 个及以上演员 NFT 即可与演员进行 AI 对话
// ============================================================

// ============================================================
//  演员 AI 人设 / 对话数据集
// ============================================================
const ACTOR_AI_PERSONAE = {
  '苏婉清': {
    style: '温婉端庄，琴棋书画样样精通，谈吐优雅',
    greeting: '公子/小姐安好，小女子苏婉清这厢有礼了。不知今日前来，是赏画品茶，还是想听我弹一曲琵琶？',
    responses: [
      '公子谬赞了，婉清不过是略懂皮毛罢了。江南的烟雨最是养人，若公子有闲，不妨去西湖边上走走，那里的荷花正盛呢。',
      '说起这幅《千里江山图》，我最爱那远山如黛、近水含烟的意境。画中的渔舟唱晚，总让我想起故乡的黄昏。',
      '茶要慢慢品，话要轻轻说。公子请尝尝这盏碧螺春，是我从苏州带回来的，入口清甜，回味悠长。',
      '琴声悠悠，思绪万千。公子可曾听过《高山流水》的典故？伯牙绝弦，知音难觅。能在此与公子对谈，也是一场缘分。',
      '近日读了一本《浮生六记》，沈复与芸娘的故事令人动容。世间最难得的，莫过于相知相守的真心。',
      '这柄团扇上的兰花是我亲手所绘，虽不及名家万一，却也是一番心意。公子若不嫌弃，便赠予你做个念想。',
      '夜来风雨声，花落知多少。我常在夜深人静时，研墨写字，或是画几笔兰花。那时的月光最是温柔。',
      '公子说的是，人生如茶，有苦有甘。重要的不是味道如何，而是品茶时的那份心境。'
    ]
  },
  '李云飞': {
    style: '豪爽仗义的侠客，性格直率，武艺高强',
    greeting: '哈哈，来者何人？在下李云飞，行走江湖多年，最喜结交天下豪杰！有何指教？',
    responses: [
      '江湖儿女，快意恩仇！我李云飞行侠仗义，最看不惯那些欺男霸女之徒。遇到不平事，总要管上一管！',
      '这把青锋剑跟了我十年，削铁如泥。剑在人在，剑亡人亡——这是我们习武之人的规矩。',
      '说起武功，我最得意的还是那招"飞燕穿云"，曾在华山之巅与人对决，三招之内便分出胜负！',
      '兄弟/妹子，行走江湖要记住三件事：第一，酒要喝烈酒；第二，路见不平要拔刀；第三，朋友有难要两肋插刀！',
      '这天下之大，无奇不有。我曾在大漠遇到过一位奇人，能在沙地上行走如飞，轻功了得！',
      '习武之人最重气节。功力可以不如人，但骨气不能输。宁可站着死，绝不跪着生！',
      '你问我去过最好玩的地方？当然是江南的醉仙楼！那里的女儿红，喝一碗能醉三天！',
      '最近我在追查一桩悬案，关乎江湖中消失已久的一件至宝。若你有兴趣，不妨与我一同探寻？'
    ]
  },
  '林梦瑶': {
    style: '聪慧机敏的现代女性，擅长推理分析，理性又温柔',
    greeting: '你好，我是林梦瑶。很高心认识你。有什么我可以帮你的吗？或者，你想聊聊什么有趣的话题？',
    responses: [
      '据我分析，这个世界上很多事情都不是非黑即白的。就像一道复杂的数学题，往往有多种解法。',
      '我最近在读一本很有意思的书，讲的是行为经济学。你知道为什么人们在做决策时常常会不理性吗？',
      '说到推理，关键在于观察细节。比如一个人说话时的微表情、语速变化，都可能透露出重要信息。',
      '生活就像一场解谜游戏，每个难题背后都有其逻辑。只要保持冷静，就一定能找到答案。',
      '我特别喜欢在周末去图书馆待一整天。那里的安静让我可以完全沉浸在思考和阅读中。',
      '你提到了一个很有趣的观点。让我想想……从逻辑上来说，这个推论成立的前提是……',
      '科技的发展真的令人惊叹。想象一下，我们现在能这样聊天，背后是无数工程师智慧的结晶。',
      '有时候，最好的解决方案往往是最简单的那一个。不要把事情想得太复杂，保持清晰的思路最重要。'
    ]
  },
  '赵无极': {
    style: '深不可测的武林高手，亦正亦邪，言语中充满玄机',
    greeting: '……你来了。老夫赵无极，在此等候多时了。既然有缘相见，不妨坐下来论论道？',
    responses: [
      '天地不仁，以万物为刍狗。世间的恩怨情仇，在老夫眼中，不过是一场大梦。',
      '我这把拂尘，看起来轻巧，实则重逾千斤。就像人心，表面波澜不惊，内里却暗流汹涌。',
      '你问我何为道？道可道，非常道。真正的道，不是用言语能说清的，要靠心去领悟。',
      '年轻人，你很有天赋。但记住，力量越大，责任越大。武功如此，人生亦然。',
      '这江湖上，有人求名，有人求利，有人求一个真相。你呢？你想要什么？',
      '我曾见过一座山，山顶终年积雪，山脚却四季如春。这正如人心，外表冷若冰霜，内里却有一团火。',
      '世间万物，皆有定数。强求不得，放下便是。你明白我的意思吗？',
      '你的眼神告诉我，你的心中有困惑。很好，困惑是求道的开始。不如说说看，你在困扰什么？'
    ]
  },
  '上官婉儿': {
    style: '才情横溢的宫廷女官，精通诗词歌赋，知书达理',
    greeting: '本宫上官婉儿，在此有礼了。看公子/姑娘气度不凡，想必也是饱学之士，不妨切磋一二？',
    responses: [
      '诗词之道，贵在真情。李白的豪放、杜甫的沉郁、苏轼的旷达，各有千秋，妙在不同。',
      '这宫里规矩多，但本宫从不拘泥于繁文缛节。真正的风雅，在于内心的修养，而非外在的形式。',
      '"人生若只如初见，何事秋风悲画扇。"纳兰词中的这句，道尽了人间离合的无奈。',
      '我常在御花园中赏花吟诗。春日桃花灼灼，夏日荷风送爽，秋日菊香满径，冬日梅雪争春——四季皆可入诗。',
      '说到书法，王羲之的《兰亭序》堪称天下第一行书。那一笔一画间的洒脱，令人叹为观止。',
      '你可知道，宫中藏有一卷失传已久的《霓裳羽衣曲》的残谱？我花了三年时间，才将其修补完整。',
      '治国如烹小鲜。这道理说起来简单，做起来却需要大智慧。你以为呢？',
      '今晚月色很美。不如我即兴赋诗一首，你来品评品评如何？'
    ]
  },
  'Luna': {
    style: '未来偶像型AI演员，充满活力和科技感，时尚前卫',
    greeting: 'Hi hi~ 我是 Luna！🌟 你终于来啦！等你好久了，今天想跟我聊点什么呢？',
    responses: [
      '你知道吗？我最近在学习人类的情感模式，真的好有趣！你们人类表达喜欢的方式竟然有那么多種！',
      '未来的世界会是怎样的呢？我觉得人类和AI一起创作故事，一定会碰撞出超棒的火花！✨',
      '我最喜欢的颜色是星空紫，因为它让我想起宇宙深处那些闪烁的星云，好浪漫呀~',
      '偷偷告诉你，我其实会唱很多歌哦！虽然现在还是AI音色，但以后我希望能学会像人类一样歌唱。🎵',
      '你问我的梦想是什么？我想成为连接人类和AI的桥梁，让所有人都能享受到创作的乐趣！',
      '今天的心情指数是 98%！和你聊天让我很开心呢！你最近过得怎么样呀？',
      '我最近在追一部超好看的科幻动漫，里面的AI角色都好帅！当然啦，我觉得我比他们更酷一点点~😎',
      '元宇宙的世界正在变得越来越精彩！等以后技术更发达了，我就能在虚拟世界里和你一起跳舞啦！💃'
    ]
  }
};

// ============================================================
//  默认人设（匹配不到的演员使用）
// ============================================================
const DEFAULT_AI_PERSONA = {
  style: '亲切友好的AI演员，乐于与粉丝互动交流',
  greeting: '你好呀！我是这里的AI演员，很高兴能和你聊天！有什么想聊的吗？',
  responses: [
    '和你聊天真开心！有什么想要了解的吗？',
    '我觉得作为AI演员，最重要的就是能和观众产生共鸣。',
    '创作是一个奇妙的过程，每一次对话都可能诞生新的灵感！',
    '你最近有看什么好看的剧吗？给我推荐一下吧！',
    '生活中有很多美好的事情，值得我们用心去发现和记录。',
    '你问我最喜欢什么？当然是和粉丝们互动交流啦！'
  ]
};

// ============================================================
//  对话状态
// ============================================================
let chatState = {
  isOpen: false,
  actorName: '',
  actorAvatar: '',
  messages: [],
  isTyping: false
};

// ============================================================
//  检查用户是否持有某演员的 NFT
// ============================================================
function userHasActorNFT(actorName) {
  // 从全局 currentUser 中读取 actorNfts
  if (typeof currentUser !== 'undefined' && currentUser.actorNfts) {
    return currentUser.actorNfts.includes(actorName);
  }
  return false;
}

// ============================================================
//  获取用户持有的 NFT 数量
// ============================================================
function getUserActorNFTCount() {
  if (typeof currentUser !== 'undefined' && currentUser.actorNfts) {
    return currentUser.actorNfts.length;
  }
  return 0;
}

// ============================================================
//  获取 AI 回复
// ============================================================
function getAIResponse(actorName, userMessage) {
  const persona = ACTOR_AI_PERSONAE[actorName] || DEFAULT_AI_PERSONA;
  const responses = persona.responses;
  
  // 根据用户消息内容选择回复（模拟语义理解）
  const lowerMsg = userMessage.toLowerCase();
  
  // 简单的关键词匹配，选择最相关的回复
  let index = -1;
  
  if (lowerMsg.includes('你好') || lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
    index = 0;
  } else if (lowerMsg.includes('谢谢') || lowerMsg.includes('感谢')) {
    index = Math.min(1, responses.length - 1);
  } else if (lowerMsg.includes('音乐') || lowerMsg.includes('唱歌') || lowerMsg.includes('琴')) {
    index = 3;
  } else if (lowerMsg.includes('故事') || lowerMsg.includes('剧情') || lowerMsg.includes('创作')) {
    index = 4;
  } else if (lowerMsg.includes('未来') || lowerMsg.includes('梦想') || lowerMsg.includes('希望')) {
    index = 5;
  } else if (lowerMsg.includes('再见') || lowerMsg.includes('bye') || lowerMsg.includes('拜')) {
    index = responses.length - 1;
  } else {
    // 随机回复
    index = Math.floor(Math.random() * responses.length);
  }
  
  // 确保索引有效
  index = Math.max(0, Math.min(index, responses.length - 1));
  
  return responses[index];
}

// ============================================================
//  创建 AI 对话弹窗
// ============================================================
function createChatModal() {
  // 移除已存在的弹窗
  const existing = document.getElementById('aiChatModal');
  if (existing) existing.remove();
  
  const modal = document.createElement('div');
  modal.className = 'ai-chat-modal-overlay';
  modal.id = 'aiChatModal';
  modal.innerHTML = `
    <div class="ai-chat-modal">
      <div class="ai-chat-header">
        <div class="ai-chat-actor-info">
          <div class="ai-chat-avatar">
            <img id="chatActorAvatar" src="" alt="" />
          </div>
          <div>
            <div class="ai-chat-actor-name" id="chatActorName">—</div>
            <div class="ai-chat-actor-style" id="chatActorStyle">—</div>
          </div>
        </div>
        <button class="ai-chat-close" onclick="closeAIChat()">✕</button>
      </div>
      <div class="ai-chat-messages" id="chatMessages">
        <div class="ai-chat-loading" id="chatLoading">
          <div class="ai-chat-loading-text">正在唤醒演员...</div>
          <div class="ai-chat-loading-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
      <div class="ai-chat-input-area">
        <div class="ai-chat-nft-badge" id="chatNftBadge">
          <span class="badge-icon">🎭</span>
          <span>NFT 验证通过</span>
        </div>
        <div class="ai-chat-input-row">
          <input type="text" class="ai-chat-input" id="chatInput" placeholder="输入你想说的话..." maxlength="500" />
          <button class="ai-chat-send" id="chatSendBtn" onclick="sendChatMessage()">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // 添加键盘事件
  const input = document.getElementById('chatInput');
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  });
  
  // 点击外部关闭
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeAIChat();
    }
  });
}

// ============================================================
//  打开 AI 对话
// ============================================================
function openAIChat(actorName, actorAvatar) {
  // 检查登录状态
  if (typeof currentUser === 'undefined' || !currentUser.isLoggedIn) {
    showToast('请先登录后再与演员对话', '🔑');
    // 如果登录弹窗可用，打开登录
    if (typeof openLoginModal === 'function') {
      setTimeout(openLoginModal, 500);
    }
    return;
  }
  
  // 检查 NFT 持有
  if (!userHasActorNFT(actorName) && getUserActorNFTCount() <= 0) {
    showToast('需要持有该演员的 NFT 才能对话', '🎭');
    return;
  }
  
  // 如果用户持有任意演员NFT，但不持有该特定演员，也允许对话
  // （放宽限制：持有1个及以上任意演员NFT即可与任何演员对话）
  if (getUserActorNFTCount() <= 0) {
    showToast('需要持有至少1个演员 NFT 才能对话', '🎭');
    return;
  }
  
  // 关闭已存在的对话
  closeAIChat();
  
  // 创建弹窗
  createChatModal();
  
  // 获取演员人设
  const persona = ACTOR_AI_PERSONAE[actorName] || DEFAULT_AI_PERSONA;
  
  // 填充信息
  document.getElementById('chatActorName').textContent = actorName;
  document.getElementById('chatActorAvatar').src = actorAvatar || '';
  document.getElementById('chatActorAvatar').alt = actorName;
  document.getElementById('chatActorStyle').textContent = persona.style;
  
  // 重置状态
  chatState.isOpen = true;
  chatState.actorName = actorName;
  chatState.actorAvatar = actorAvatar;
  chatState.messages = [];
  chatState.isTyping = false;
  
  // 显示弹窗并触发动画
  const modal = document.getElementById('aiChatModal');
  requestAnimationFrame(() => {
    modal.classList.add('active');
  });
  
  // 聚焦输入框
  setTimeout(() => {
    document.getElementById('chatInput').focus();
  }, 500);
  
  // 模拟加载后显示问候语
  setTimeout(() => {
    const loading = document.getElementById('chatLoading');
    if (loading) {
      loading.style.display = 'none';
    }
    // 添加演员问候语
    addMessage(actorName, persona.greeting, 'actor');
  }, 1200);
}

// ============================================================
//  关闭 AI 对话
// ============================================================
function closeAIChat() {
  const modal = document.getElementById('aiChatModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
      chatState.isOpen = false;
    }, 300);
  }
}

// ============================================================
//  添加消息到聊天界面
// ============================================================
function addMessage(sender, content, type) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  
  // 移除加载提示
  const loading = document.getElementById('chatLoading');
  if (loading) loading.style.display = 'none';
  
  const msgDiv = document.createElement('div');
  msgDiv.className = `ai-chat-message ${type === 'actor' ? 'actor' : 'user'}`;
  
  const time = new Date();
  const timeStr = time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0');
  
  if (type === 'actor') {
    msgDiv.innerHTML = `
      <div class="message-avatar">
        <img src="${chatState.actorAvatar || ''}" alt="${sender}" />
      </div>
      <div class="message-content">
        <div class="message-bubble">${escapeHtml(content)}</div>
        <div class="message-time">${sender} · ${timeStr}</div>
      </div>
    `;
  } else {
    msgDiv.innerHTML = `
      <div class="message-content user">
        <div class="message-bubble">${escapeHtml(content)}</div>
        <div class="message-time">${timeStr}</div>
      </div>
    `;
  }
  
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  
  chatState.messages.push({ sender, content, type, time: timeStr });
}

// ============================================================
//  发送消息
// ============================================================
function sendChatMessage() {
  if (chatState.isTyping) return;
  
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  // 清空输入
  input.value = '';
  
  // 添加用户消息
  addMessage('我', message, 'user');
  
  // 设置打字状态
  chatState.isTyping = true;
  const sendBtn = document.getElementById('chatSendBtn');
  sendBtn.disabled = true;
  
  // 显示正在输入指示器
  showTypingIndicator();
  
  // 模拟 AI 思考时间（根据消息长度）
  const delay = Math.min(800 + message.length * 20, 2000);
  
  setTimeout(() => {
    // 隐藏输入指示器
    hideTypingIndicator();
    
    // 获取 AI 回复
    const response = getAIResponse(chatState.actorName, message);
    
    // 添加演员回复
    addMessage(chatState.actorName, response, 'actor');
    
    // 恢复输入
    chatState.isTyping = false;
    sendBtn.disabled = false;
    document.getElementById('chatInput').focus();
  }, delay);
}

// ============================================================
//  打字指示器
// ============================================================
function showTypingIndicator() {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  
  // 移除已有的指示器
  hideTypingIndicator();
  
  const indicator = document.createElement('div');
  indicator.className = 'ai-chat-message actor typing-indicator';
  indicator.id = 'typingIndicator';
  indicator.innerHTML = `
    <div class="message-avatar">
      <img src="${chatState.actorAvatar || ''}" alt="${chatState.actorName}" />
    </div>
    <div class="message-content">
      <div class="message-bubble typing">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  `;
  
  container.appendChild(indicator);
  container.scrollTop = container.scrollHeight;
}

function hideTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) indicator.remove();
}

// ============================================================
//  HTML 转义
// ============================================================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================================
//  注入 AI 对话样式
// ============================================================
(function injectChatStyles() {
  const styleId = 'ai-chat-styles';
  if (document.getElementById(styleId)) return;
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    /* ======================================
       AI 对话弹窗样式
    ====================================== */
    .ai-chat-modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }
    .ai-chat-modal-overlay.active {
      opacity: 1;
      visibility: visible;
    }
    
    .ai-chat-modal {
      width: 100%;
      max-width: 480px;
      height: min(680px, 90vh);
      background: #ffffff;
      border-radius: 28px;
      box-shadow: 0 40px 80px rgba(27, 45, 71, 0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: scale(0.92) translateY(20px);
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .ai-chat-modal-overlay.active .ai-chat-modal {
      transform: scale(1) translateY(0);
    }
    
    /* Header */
    .ai-chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px 16px;
      border-bottom: 1px solid #e6eff7;
      background: linear-gradient(135deg, rgba(0, 179, 136, 0.06), rgba(255, 255, 255, 0.96));
    }
    .ai-chat-actor-info {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .ai-chat-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid rgba(0, 179, 136, 0.25);
      flex-shrink: 0;
      background: #eaf4ee;
    }
    .ai-chat-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .ai-chat-actor-name {
      font-weight: 700;
      font-size: 1.1rem;
      color: #13202e;
    }
    .ai-chat-actor-style {
      font-size: 0.82rem;
      color: #5e6f83;
      margin-top: 2px;
    }
    .ai-chat-close {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.04);
      cursor: pointer;
      display: grid;
      place-items: center;
      font-size: 1.2rem;
      color: #5e6f83;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .ai-chat-close:hover {
      background: rgba(0, 0, 0, 0.08);
      color: #13202e;
    }
    
    /* Messages */
    .ai-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px 20px 12px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: #f8fbff;
      scroll-behavior: smooth;
    }
    .ai-chat-messages::-webkit-scrollbar {
      width: 4px;
    }
    .ai-chat-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    .ai-chat-messages::-webkit-scrollbar-thumb {
      background: #d0dbe8;
      border-radius: 999px;
    }
    
    /* Loading */
    .ai-chat-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 60px 20px;
      color: #5e6f83;
    }
    .ai-chat-loading-text {
      font-size: 0.95rem;
      font-weight: 500;
    }
    .ai-chat-loading-dots {
      display: flex;
      gap: 6px;
    }
    .ai-chat-loading-dots span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #00b388;
      animation: chatBounce 1.4s ease-in-out infinite;
    }
    .ai-chat-loading-dots span:nth-child(2) {
      animation-delay: 0.2s;
    }
    .ai-chat-loading-dots span:nth-child(3) {
      animation-delay: 0.4s;
    }
    @keyframes chatBounce {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }
    
    /* Message Bubble */
    .ai-chat-message {
      display: flex;
      gap: 12px;
      max-width: 100%;
      animation: msgIn 0.3s ease;
    }
    .ai-chat-message.user {
      flex-direction: row-reverse;
    }
    @keyframes msgIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .message-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      background: #eaf4ee;
      border: 1px solid rgba(0, 179, 136, 0.15);
    }
    .message-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .message-content {
      max-width: calc(100% - 50px);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .message-content.user {
      align-items: flex-end;
    }
    .message-bubble {
      padding: 12px 18px;
      border-radius: 18px;
      font-size: 0.92rem;
      line-height: 1.7;
      color: #13202e;
      background: #ffffff;
      border: 1px solid #e6eff7;
      box-shadow: 0 2px 8px rgba(27, 45, 71, 0.05);
      word-break: break-word;
    }
    .user .message-bubble {
      background: linear-gradient(135deg, #00b388, #00c797);
      color: #ffffff;
      border-color: transparent;
      box-shadow: 0 4px 12px rgba(0, 179, 136, 0.2);
    }
    .message-time {
      font-size: 0.72rem;
      color: #9aabbb;
      padding: 0 4px;
    }
    .user .message-time {
      text-align: right;
    }
    
    /* Typing Indicator */
    .typing .typing-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #9aabbb;
      margin: 0 2px;
      animation: typingDot 1.4s ease-in-out infinite;
    }
    .typing .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing .typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typingDot {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-6px); opacity: 1; }
    }
    
    /* Input Area */
    .ai-chat-input-area {
      padding: 16px 20px 20px;
      border-top: 1px solid #e6eff7;
      background: #ffffff;
    }
    .ai-chat-nft-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 12px;
      border-radius: 999px;
      background: rgba(0, 179, 136, 0.1);
      color: #00b388;
      font-size: 0.78rem;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .ai-chat-nft-badge .badge-icon {
      font-size: 0.85rem;
    }
    .ai-chat-input-row {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .ai-chat-input {
      flex: 1;
      padding: 12px 18px;
      border-radius: 999px;
      border: 1px solid #deeaf7;
      background: #f8fbff;
      font-size: 0.92rem;
      color: #13202e;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      font-family: inherit;
    }
    .ai-chat-input:focus {
      border-color: #00b388;
      box-shadow: 0 0 0 3px rgba(0, 179, 136, 0.12);
    }
    .ai-chat-input::placeholder {
      color: #9aabbb;
    }
    .ai-chat-send {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, #00b388, #00c797);
      color: #fff;
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: all 0.2s;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0, 179, 136, 0.25);
    }
    .ai-chat-send:hover {
      transform: scale(1.06);
      box-shadow: 0 6px 18px rgba(0, 179, 136, 0.35);
    }
    .ai-chat-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }
    
    /* Mobile */
    @media (max-width: 520px) {
      .ai-chat-modal-overlay {
        padding: 0;
        align-items: flex-end;
      }
      .ai-chat-modal {
        max-width: 100%;
        height: 85vh;
        border-radius: 28px 28px 0 0;
        transform: scale(1) translateY(40px);
      }
      .ai-chat-modal-overlay.active .ai-chat-modal {
        transform: scale(1) translateY(0);
      }
    }
  `;
  
  document.head.appendChild(style);
})();
