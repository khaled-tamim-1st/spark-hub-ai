(function () {
  'use strict';

  // Find the current script tag to extract configuration data-attributes
  const currentScript = document.getElementById('ecomate-widget-script') 
    || document.querySelector('script[src*="widget.js"]')
    || document.currentScript 
    || (function () {
      const scripts = document.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    })();

  function resolveServerOrigin() {
    // If an explicit data-server attribute is set, always use it
    const explicit = currentScript?.getAttribute('data-server');
    if (explicit && explicit.trim()) {
      return explicit.trim().replace(/\/+$/, '');
    }
    if (typeof window !== 'undefined') {
      const p = window.location.protocol;
      const h = window.location.hostname;
      const port = window.location.port;

      // If running on the dashboard (port 5005 dev), use same origin API
      if (port === '5005') {
        return `${p}//${h}:5000`;
      }

      // On port 4000 (website / Next.js), use SAME origin so Next.js proxy handles /api/* 
      if (port === '4000') {
        return `${p}//${h}:4000`;
      }

      // If loaded from ecomate.ai domain, use same origin (Nginx handles routing)
      if (h.includes('ecomate.ai')) {
        return window.location.origin;
      }

      // Try to detect origin from the script src (e.g. when loaded from API server directly)
      if (currentScript?.src && !currentScript.src.startsWith('blob:')) {
        try {
          return new URL(currentScript.src).origin;
        } catch {}
      }

      // Default: same origin
      return window.location.origin;
    }
    return '';
  }

  const serverOrigin = resolveServerOrigin();
  const channelId = currentScript?.getAttribute('data-channel') || currentScript?.getAttribute('data-channel-id') || '1';
  const customColor = currentScript?.getAttribute('data-color') || '#3B4FE8';
  const customTitle = currentScript?.getAttribute('data-title') || 'مساعد المتجر الذكي';
  const customWelcome = currentScript?.getAttribute('data-welcome') || 'أهلاً بك 👋 كيف يمكننا مساعدتك اليوم؟';
  const position = currentScript?.getAttribute('data-position') || 'right'; // 'right' | 'left'

  // LocalStorage keys
  const STORAGE_VISITOR = 'ecomate_widget_visitor_' + channelId;
  const STORAGE_CONV = 'ecomate_widget_conv_' + channelId;

  let visitorId = localStorage.getItem(STORAGE_VISITOR);
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2, 12);
    localStorage.setItem(STORAGE_VISITOR, visitorId);
  }

  let conversationId = localStorage.getItem(STORAGE_CONV);
  let isOpen = false;
  let isSending = false;
  let pollingInterval = null;
  let lastMessageId = 0;

  // Insert styles
  const style = document.createElement('style');
  style.id = 'ecomate-widget-styles';
  style.innerHTML = `
    .ecomate-btn-launcher {
      position: fixed;
      bottom: 24px;
      ${position === 'left' ? 'left: 24px;' : 'right: 24px;'}
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${customColor};
      box-shadow: 0 8px 24px rgba(59, 79, 232, 0.35);
      border: none;
      cursor: pointer;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .ecomate-btn-launcher:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 12px 30px rgba(59, 79, 232, 0.45);
    }
    .ecomate-btn-launcher svg {
      width: 28px;
      height: 28px;
      transition: transform 0.3s ease;
    }
    .ecomate-chat-box {
      position: fixed;
      bottom: 96px;
      ${position === 'left' ? 'left: 24px;' : 'right: 24px;'}
      width: 380px;
      max-width: calc(100vw - 32px);
      height: 580px;
      max-height: calc(100vh - 120px);
      background: #ffffff;
      border-radius: 24px;
      box-shadow: 0 16px 48px rgba(15, 23, 42, 0.18), 0 0 1px rgba(15, 23, 42, 0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 999999;
      opacity: 0;
      pointer-events: none;
      transform: translateY(20px) scale(0.96);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: 'Cairo', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      direction: rtl;
      text-align: right;
    }
    .ecomate-chat-box.ecomate-open {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0) scale(1);
    }
    .ecomate-header {
      background: linear-gradient(135deg, ${customColor} 0%, #1A1B3C 100%);
      color: #ffffff;
      padding: 18px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .ecomate-header-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .ecomate-avatar {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      backdrop-filter: blur(8px);
    }
    .ecomate-title {
      font-size: 15px;
      font-weight: 800;
      margin: 0;
      line-height: 1.2;
    }
    .ecomate-status {
      font-size: 11px;
      opacity: 0.85;
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 3px;
    }
    .ecomate-dot {
      width: 7px;
      height: 7px;
      background: #10B981;
      border-radius: 50%;
      display: inline-block;
    }
    .ecomate-close-btn {
      background: rgba(255, 255, 255, 0.15);
      border: none;
      color: #ffffff;
      width: 32px;
      height: 32px;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .ecomate-close-btn:hover {
      background: rgba(255, 255, 255, 0.25);
    }
    .ecomate-messages {
      flex: 1;
      padding: 18px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #F8FAFC;
    }
    .ecomate-msg {
      max-width: 82%;
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 13.5px;
      line-height: 1.6;
      word-break: break-word;
      animation: ecomateFadeIn 0.25s ease-out;
    }
    @keyframes ecomateFadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .ecomate-msg-incoming {
      align-self: flex-start;
      background: #ffffff;
      color: #0F172A;
      border: 1px solid #E2E8F0;
      border-bottom-right-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    .ecomate-msg-outgoing {
      align-self: flex-end;
      background: ${customColor};
      color: #ffffff;
      border-bottom-left-radius: 4px;
      box-shadow: 0 4px 12px rgba(59, 79, 232, 0.2);
    }
    .ecomate-typing {
      align-self: flex-start;
      background: #ffffff;
      border: 1px solid #E2E8F0;
      padding: 10px 16px;
      border-radius: 16px;
      display: none;
      align-items: center;
      gap: 4px;
    }
    .ecomate-typing-dot {
      width: 6px;
      height: 6px;
      background: #94A3B8;
      border-radius: 50%;
      animation: ecomateBounce 1.4s infinite ease-in-out both;
    }
    .ecomate-typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .ecomate-typing-dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes ecomateBounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
    .ecomate-input-bar {
      padding: 12px 16px;
      background: #ffffff;
      border-top: 1px solid #E2E8F0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .ecomate-input {
      flex: 1;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 10px 14px;
      font-size: 13.5px;
      outline: none;
      font-family: inherit;
      direction: rtl;
      transition: border-color 0.2s;
    }
    .ecomate-input:focus {
      border-color: ${customColor};
    }
    .ecomate-send-btn {
      background: ${customColor};
      color: #ffffff;
      border: none;
      border-radius: 12px;
      width: 38px;
      height: 38px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .ecomate-send-btn:hover {
      opacity: 0.9;
      transform: scale(1.05);
    }
    .ecomate-send-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .ecomate-footer-brand {
      padding: 6px;
      text-align: center;
      background: #F8FAFC;
      font-size: 10.5px;
      color: #94A3B8;
      border-top: 1px solid #F1F5F9;
    }
    .ecomate-footer-brand a {
      color: ${customColor};
      text-decoration: none;
      font-weight: 700;
    }
  `;
  document.head.appendChild(style);

  // Build Launcher Button
  const launcher = document.createElement('button');
  launcher.className = 'ecomate-btn-launcher';
  launcher.setAttribute('aria-label', 'فتح محادثة المتجر');
  launcher.innerHTML = `
    <svg id="ecomate-icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
    <svg id="ecomate-icon-close" style="display:none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="6"></line>
    </svg>
  `;

  // Build Chat Box Container
  const chatBox = document.createElement('div');
  chatBox.className = 'ecomate-chat-box';
  chatBox.innerHTML = `
    <div class="ecomate-header">
      <div class="ecomate-header-info">
        <div class="ecomate-avatar">💬</div>
        <div>
          <h4 class="ecomate-title" id="ecomate-widget-title">${customTitle}</h4>
          <span class="ecomate-status"><span class="ecomate-dot"></span> متصل الآن • بالذكاء الاصطناعي</span>
        </div>
      </div>
      <button class="ecomate-close-btn" id="ecomate-btn-close" aria-label="إغلاق">✕</button>
    </div>

    <div class="ecomate-messages" id="ecomate-msgs-container">
      <div class="ecomate-msg ecomate-msg-incoming">
        ${customWelcome}
      </div>
      <div class="ecomate-typing" id="ecomate-typing-indicator">
        <div class="ecomate-typing-dot"></div>
        <div class="ecomate-typing-dot"></div>
        <div class="ecomate-typing-dot"></div>
      </div>
    </div>

    <form class="ecomate-input-bar" id="ecomate-chat-form">
      <input type="text" class="ecomate-input" id="ecomate-text-input" placeholder="اكتب استفسارك هنا..." autocomplete="off" />
      <button type="submit" class="ecomate-send-btn" id="ecomate-btn-send" aria-label="إرسال">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(180deg);">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </form>

    <div class="ecomate-footer-brand">
      مشغّل بواسطة <a href="https://ecomate.ai" target="_blank" rel="noopener">ECOMATE AI</a>
    </div>
  `;

  document.body.appendChild(launcher);
  document.body.appendChild(chatBox);

  const msgsContainer = document.getElementById('ecomate-msgs-container');
  const typingIndicator = document.getElementById('ecomate-typing-indicator');
  const chatForm = document.getElementById('ecomate-chat-form');
  const textInput = document.getElementById('ecomate-text-input');
  const iconChat = document.getElementById('ecomate-icon-chat');
  const iconClose = document.getElementById('ecomate-icon-close');

  function toggleWidget() {
    isOpen = !isOpen;
    if (isOpen) {
      chatBox.classList.add('ecomate-open');
      iconChat.style.display = 'none';
      iconClose.style.display = 'block';
      initSession();
      textInput.focus();
    } else {
      chatBox.classList.remove('ecomate-open');
      iconChat.style.display = 'block';
      iconClose.style.display = 'none';
    }
  }

  launcher.addEventListener('click', toggleWidget);
  document.getElementById('ecomate-btn-close').addEventListener('click', toggleWidget);

  function appendMessage(content, type) {
    const msgEl = document.createElement('div');
    msgEl.className = 'ecomate-msg ' + (type === 'contact' ? 'ecomate-msg-outgoing' : 'ecomate-msg-incoming');
    msgEl.textContent = content;
    msgsContainer.insertBefore(msgEl, typingIndicator);
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
  }

  // Initialize Session
  async function initSession() {
    try {
      const res = await fetch(serverOrigin + '/api/widget/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: Number(channelId),
          visitorId: visitorId,
        }),
      });
      const data = await res.json();
      if (data.success && data.conversationId) {
        conversationId = data.conversationId;
        localStorage.setItem(STORAGE_CONV, conversationId);

        // Render previous messages
        if (data.messages && data.messages.length > 0) {
          msgsContainer.innerHTML = '';
          msgsContainer.appendChild(typingIndicator);
          data.messages.forEach(m => {
            appendMessage(m.content, m.senderType);
            lastMessageId = Math.max(lastMessageId, m.id);
          });
        }
        startPolling();
      }
    } catch (e) {
      console.warn('[Ecomate Widget] Session init failed:', e);
    }
  }

  // Poll for new messages (e.g. Agent live reply from dashboard)
  function startPolling() {
    if (pollingInterval) clearInterval(pollingInterval);
    pollingInterval = setInterval(async () => {
      if (!conversationId || !isOpen) return;
      try {
        const res = await fetch(`${serverOrigin}/api/widget/messages/${conversationId}?afterId=${lastMessageId}`);
        const data = await res.json();
        if (data.success && data.messages && data.messages.length > 0) {
          data.messages.forEach(m => {
            if (m.id > lastMessageId) {
              lastMessageId = m.id;
              if (m.senderType !== 'contact') {
                appendMessage(m.content, m.senderType);
              }
            }
          });
        }
      } catch (e) {
        // Silent poll error
      }
    }, 3500);
  }

  // Send Message
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = textInput.value.trim();
    if (!text || isSending) return;

    appendMessage(text, 'contact');
    textInput.value = '';
    isSending = true;
    typingIndicator.style.display = 'flex';
    msgsContainer.scrollTop = msgsContainer.scrollHeight;

    try {
      if (!conversationId) {
        await initSession();
      }

      const res = await fetch(serverOrigin + '/api/widget/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: Number(conversationId) || undefined,
          channelId: Number(channelId) || 1,
          visitorId: visitorId,
          content: text,
        }),
      });

      const data = await res.json();
      if (data.success && data.conversationId) {
        conversationId = data.conversationId;
        localStorage.setItem(STORAGE_CONV, conversationId);
      }
      typingIndicator.style.display = 'none';

      if (data.success && data.aiMessage) {
        appendMessage(data.aiMessage.content, 'ai');
        lastMessageId = Math.max(lastMessageId, data.aiMessage.id);
      }
    } catch (err) {
      typingIndicator.style.display = 'none';
      appendMessage('عذراً، حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة لاحقاً.', 'ai');
    } finally {
      isSending = false;
    }
  });

})();
