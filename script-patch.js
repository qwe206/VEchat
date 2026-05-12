// ================
// 微信模拟应用功能改进补丁
// 添加到 script.js 文件末尾
// ============

// 常量定义
const CONSTANTS = {
    ZINDEX: {
        DETAIL_PAGE: 1600,
        IMAGE_PREVIEW: 10001
    },
    TIMING: {
        RED_PACKET_ANIMATION: 500,
        INIT_DELAY: 1000
    },
    UI: {
        MENU_MARGIN: 10,
        MENU_WIDTH: 280,
        MENU_HEIGHT: 56,
        QUOTE_MAX_LENGTH: 60
    }
};

// 辅助函数：创建详情页基础结构
function createDetailPage() {
    // 先移除所有已存在的红包/转账详情页，防止页面叠加
    document.querySelectorAll('.money-detail-page').forEach(p => p.remove());

    const page = document.createElement('div');
    page.className = 'page sub-page money-detail-page';
  page.style.position = 'fixed';
    page.style.inset = '0';
    page.style.zIndex = String(CONSTANTS.ZINDEX.DETAIL_PAGE);
    page.style.backgroundColor = '#fff';
    page.style.display = 'block';

    return page;
}

// 辅助函数：安全地绑定事件监听器
function bindEventSafely(page, selector, event, handler) {
    requestAnimationFrame(() => {
        page.querySelector(selector)?.addEventListener(event, handler);
    });
}

// =============
// 消息长按菜单功能
// ==========

// 全局变量：存储长按状态
let longPressTimer = null;
let isLongPress = false;
let currentMessageIndex = -1;
let isMultiSelectMode = false;
let selectedMessageIndexes = new Set();
let replyDraft = null;

function updateReplyDraftBar() {
    const bar = document.getElementById('reply-draft-bar');
    const textEl = document.getElementById('reply-draft-text');
    if (!bar || !textEl) return;
    if (!replyDraft || !replyDraft.quote) {
        bar.style.display = 'none';
        textEl.textContent = '';
        return;
    }
    textEl.textContent = replyDraft.quote;
    bar.style.display = 'flex';
}

window.getReplyDraft = function () {
    return replyDraft;
};

window.clearReplyDraft = function () {
    replyDraft = null;
    updateReplyDraftBar();
};

window.setReplyDraft = function (quoteText) {
    replyDraft = { quote: quoteText || '' };
    updateReplyDraftBar();
};

// 初始化长按菜单事件
function initContextMenuEvents() {
    const menu = document.getElementById('message-context-menu');
    if (!menu) return;

    // 绑定菜单项点击事件
    menu.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = item.dataset.action;
            const messageIndex = parseInt(menu.dataset.messageIndex);

            handleContextMenuAction(action, messageIndex);
            closeContextMenu();
        });
    });

    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages && !chatMessages.dataset.multiSelectBound) {
        chatMessages.dataset.multiSelectBound = '1';
        chatMessages.addEventListener('click', (e) => {
            if (!isMultiSelectMode) return;
            const bubble = e.target.closest('.message-bubble[data-index]');
            if (!bubble) return;
            e.preventDefault();
            e.stopImmediatePropagation();
            const index = parseInt(bubble.dataset.index, 10);
            if (!Number.isNaN(index)) {
                toggleSelectMessage(index);
            }
        }, true);
    }

    const cancelReplyBtn = document.getElementById('reply-draft-cancel');
    if (cancelReplyBtn && !cancelReplyBtn.dataset.bound) {
        cancelReplyBtn.dataset.bound = '1';
        cancelReplyBtn.addEventListener('click', () => {
            window.clearReplyDraft?.();
        });
    }

    const originalRenderChatMessages = window.renderChatMessages;
    if (typeof originalRenderChatMessages === 'function' && !window.__multiSelectWrapped) {
        window.__multiSelectWrapped = true;
        window.renderChatMessages = function (...args) {
            originalRenderChatMessages.apply(this, args);
            if (isMultiSelectMode) {
                syncMultiSelectUI();
                updateMultiSelectToolbar();
            }
        };
    }
}

// 处理菜单操作
function handleContextMenuAction(action, messageIndex) {
    if (!State.currentContactId || messageIndex < 0) return;

    const msgData = State.chatHistories[State.currentContactId][messageIndex];
    if (!msgData) return;

    switch (action) {
        case 'copy':
            copyMessage(msgData);
            break;
        case 'quote':
            quoteMessage(msgData);
            break;
        case 'multi-select':
            enterMultiSelectMode(messageIndex);
            break;
        case 'delete':
            deleteMessage(messageIndex);
            break;
        case 'edit':
            openMessageEditModal(messageIndex);
            break;
        case 'view-call-log':
            showCallTranscriptModal(msgData);
            break;
        default:
            break;
    }
}

function getCallTranscriptItems(msgData) {
    if (!msgData) return [];
    try {
        const parsed = JSON.parse(msgData.content);
        const transcript = Array.isArray(parsed?.callTranscript) ? parsed.callTranscript : [];
        return transcript
            .map(item => ({
                role: item?.role === 'assistant' ? 'assistant' : 'user',
                content: String(item?.content || '').trim()
            }))
            .filter(item => item.content);
    } catch (e) {
        return [];
    }
}

function isCallRecordMessage(msgData) {
    if (!msgData) return false;
    try {
        const parsed = JSON.parse(msgData.content);
        const text = String(parsed?.content || '');
        return text.startsWith('[通话记录]');
    } catch (e) {
        return false;
    }
}

function extractMessageText(msgData) {
    if (!msgData) return '';
    try {
        const parsed = JSON.parse(msgData.content);
        if (parsed.type === 'text' || parsed.type === 'text_message') return parsed.content || '';
        if (parsed.type === 'image') return parsed.description || '[图片]';
        if (parsed.type === 'sticker_message') return `[${parsed.sticker || '表情'}]`;
        if (parsed.type === 'voice') return parsed.text || parsed.transcription || '[语音]';
        if (parsed.type === 'quote') {
            const q = parsed.quote || '';
            const c = parsed.content || '';
            return q ? `「${q}」\n${c}` : c;
        }
        return JSON.stringify(parsed);
    } catch (e) {
        return msgData.content || '';
    }
}

// 复制消息
function copyMessage(msgData) {
    const textToCopy = extractMessageText(msgData);
    if (!textToCopy) {
        showToast('没有可复制内容');
        return;
    }
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
        showToast('复制失败');
        return;
    }
    navigator.clipboard.writeText(textToCopy)
        .then(() => showToast('已复制'))
        .catch(() => showToast('复制失败'));
}

// 删除消息
async function deleteMessage(messageIndex) {
    const ok = (typeof WeChatUI !== 'undefined' && typeof WeChatUI.showConfirm === 'function')
        ? await WeChatUI.showConfirm('删除消息', '确定删除这条消息吗？', '删除', '取消', true)
        : confirm('确定删除这条消息吗？');
    if (!ok) return;
    State.chatHistories[State.currentContactId].splice(messageIndex, 1);
    Storage.saveChatHistories(State.chatHistories);
    renderChatMessages();
    showToast('已删除');
}

// 引用消息
function quoteMessage(msgData) {
    const quoteText = extractMessageText(msgData);
    const input = document.getElementById('message-input');
    if (input) {
        const shortQuote = quoteText.substring(0, CONSTANTS.UI.QUOTE_MAX_LENGTH) + (quoteText.length > CONSTANTS.UI.QUOTE_MAX_LENGTH ? '...' : '');
        window.setReplyDraft?.(shortQuote);
        input.focus();
        showToast('已引用');
    }
}

function ensureMultiSelectToolbar() {
    let bar = document.getElementById('multi-select-toolbar');
    if (bar) return bar;

    bar = document.createElement('div');
    bar.id = 'multi-select-toolbar';
    bar.className = 'multi-select-toolbar';
    bar.innerHTML = `
        <button type="button" class="multi-select-text-btn" data-action="cancel">取消</button>
        <div class="multi-select-count">已选 0 条</div>
        <button type="button" class="multi-select-text-btn danger icon-only" data-action="delete" aria-label="删除">
            <i class="fas fa-trash-alt"></i>
        </button>
    `;
    bar.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const action = btn.dataset.action;
        if (action === 'cancel') {
            exitMultiSelectMode();
        } else if (action === 'delete') {
            deleteSelectedMessages();
        }
    });
    const chatPage = document.getElementById('chat-page');
    (chatPage || document.body).appendChild(bar);
    return bar;
}

function enterMultiSelectMode(initialIndex) {
    if (isMultiSelectMode) return;
    isMultiSelectMode = true;
    selectedMessageIndexes.clear();
    selectedMessageIndexes.add(initialIndex);
    ensureMultiSelectToolbar().classList.add('show');
    document.getElementById('chat-page')?.classList.add('multi-select-mode');
    syncMultiSelectUI();
    updateMultiSelectToolbar();
    showToast('已进入多选');
}

function exitMultiSelectMode() {
    isMultiSelectMode = false;
    selectedMessageIndexes.clear();
    const bar = document.getElementById('multi-select-toolbar');
    if (bar) bar.classList.remove('show');
    document.getElementById('chat-page')?.classList.remove('multi-select-mode');
    syncMultiSelectUI();
}

function toggleSelectMessage(index) {
    if (selectedMessageIndexes.has(index)) {
        selectedMessageIndexes.delete(index);
    } else {
        selectedMessageIndexes.add(index);
    }
    syncMultiSelectUI();
    updateMultiSelectToolbar();
    if (selectedMessageIndexes.size === 0) {
        exitMultiSelectMode();
    }
}

function syncMultiSelectUI() {
    document.querySelectorAll('#chat-messages .message-bubble[data-index]').forEach((bubble) => {
        const idx = parseInt(bubble.dataset.index, 10);
        const row = bubble.closest('.message-row');
        if (isMultiSelectMode && selectedMessageIndexes.has(idx)) {
            row?.classList.add('selection-selected');
        } else {
            row?.classList.remove('selection-selected');
        }
    });
}

function updateMultiSelectToolbar() {
    const bar = ensureMultiSelectToolbar();
    const countEl = bar.querySelector('.multi-select-count');
    if (countEl) countEl.textContent = `已选 ${selectedMessageIndexes.size} 条`;
}

async function deleteSelectedMessages() {
    if (!State.currentContactId) return;
    const count = selectedMessageIndexes.size;
    if (count === 0) return;
    const ok = (typeof WeChatUI !== 'undefined' && typeof WeChatUI.showConfirm === 'function')
        ? await WeChatUI.showConfirm('批量删除', `确定删除选中的 ${count} 条消息吗？`, '删除', '取消', true)
        : confirm(`确定删除选中的 ${count} 条消息吗？`);
    if (!ok) return;

    const history = State.chatHistories[State.currentContactId] || [];
    Array.from(selectedMessageIndexes)
        .sort((a, b) => b - a)
        .forEach((idx) => {
            if (idx >= 0 && idx < history.length) history.splice(idx, 1);
        });

    Storage.saveChatHistories(State.chatHistories);
    renderChatMessages();
    exitMultiSelectMode();
    showToast(`已删除 ${count} 条`);
}

// 显示长按菜单
function showContextMenu(event, messageIndex, side) {
    if (isMultiSelectMode) return;
    const menu = document.getElementById('message-context-menu');
    if (!menu) return;
    const history = State.chatHistories[State.currentContactId] || [];
    const msgData = history[messageIndex];
    const viewItem = menu.querySelector('[data-action="view-call-log"]');
    if (viewItem) {
        viewItem.style.display = isCallRecordMessage(msgData) ? 'flex' : 'none';
    }

    // 定位菜单
    let x, y;
    if (event.touches && event.touches[0]) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
    } else {
        x = event.clientX;
        y = event.clientY;
    }

    // 先临时显示用于测量横向菜单尺寸
    menu.style.display = 'flex';
    menu.style.visibility = 'hidden';
    const menuWidth = menu.offsetWidth || CONSTANTS.UI.MENU_WIDTH;
    const menuHeight = menu.offsetHeight || CONSTANTS.UI.MENU_HEIGHT;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const margin = CONSTANTS.UI.MENU_MARGIN;

    // 横向菜单默认出现在按压点上方，居中贴近微信样式
    x = x - menuWidth / 2;
    y = y - menuHeight - 12;

    if (x + menuWidth > screenWidth - margin) {
        x = screenWidth - menuWidth - margin;
    }
    if (x < margin) x = margin;
    if (y < margin) y = margin;
    if (y + menuHeight > screenHeight - margin) {
        y = screenHeight - menuHeight - margin;
    }

    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.style.visibility = 'visible';
    menu.style.display = 'flex';
    menu.dataset.messageIndex = messageIndex;

    // 点击菜单外部关闭
    setTimeout(() => {
        document.addEventListener('click', closeContextMenu);
        document.addEventListener('touchstart', closeContextMenu);
    }, 100);
}

// 关闭长按菜单
function closeContextMenu() {
    const menu = document.getElementById('message-context-menu');
    if (menu) {
        menu.style.display = 'none';
    }
    document.removeEventListener('click', closeContextMenu);
    document.removeEventListener('touchstart', closeContextMenu);
}

function showCallTranscriptModal(msgData) {
    const items = getCallTranscriptItems(msgData);
    const oldModal = document.getElementById('vx-call-transcript-modal');
    if (oldModal) oldModal.remove();

    const contact = State.contacts.find(c => c.id === State.currentContactId);
    const contactName = contact?.name || '对方';
    const userName = State.user?.nickname || '我';
    const parsed = (() => {
        try {
            return JSON.parse(msgData.content);
        } catch (e) {
            return null;
        }
    })();
    const summaryText = String(parsed?.content || '').replace(/^\[通话记录\]\n?/, '').trim();

    const modal = document.createElement('div');
    modal.id = 'vx-call-transcript-modal';
    modal.className = 'modal wechat-dialog-modal show';
    modal.style.zIndex = String(CONSTANTS.ZINDEX.IMAGE_PREVIEW);

    const transcriptHtml = items.map(item => {
        const who = item.role === 'assistant' ? contactName : userName;
        const roleClass = item.role === 'assistant' ? 'assistant' : 'user';
        return `
            <div class="call-transcript-item ${roleClass}">
                <div class="call-transcript-speaker">${escapeHtml(who)}</div>
                <div class="call-transcript-text">${escapeHtml(item.content).replace(/\n/g, '<br>')}</div>
            </div>
        `;
    }).join('') || `
        <div class="call-transcript-empty">这次通话还没有可查看的过程记录。</div>
    `;

    modal.innerHTML = `
        <div class="modal-overlay" style="background: rgba(0, 0, 0, 0.42);"></div>
        <div class="wechat-dialog call-transcript-dialog">
            <div class="wechat-dialog-title">通话记录</div>
            <div class="call-transcript-summary">${escapeHtml(summaryText || '本次通话')}</div>
            <div class="wechat-dialog-body call-transcript-body">${transcriptHtml}</div>
            <div class="wechat-dialog-footer">
                <button class="wechat-dialog-btn confirm call-transcript-close">关闭</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('.modal-overlay')?.addEventListener('click', close);
    modal.querySelector('.call-transcript-close')?.addEventListener('click', close);
}

// ===========
// 图片预览功能
// =============

function showImagePreview(imageData) {
    const oldModal = document.getElementById('vx-image-preview-modal');
    if (oldModal) oldModal.remove();

    const isLocalImage = !!(imageData && imageData.isLocal && imageData.content);
    const description = imageData?.description || '暂无描述';

    const modal = document.createElement('div');
    modal.id = 'vx-image-preview-modal';
    modal.className = 'modal wechat-dialog-modal show';
    modal.style.zIndex = String(CONSTANTS.ZINDEX.IMAGE_PREVIEW);

    modal.innerHTML = `
        <div class="modal-overlay" style="background: rgba(0, 0, 0, 0.52);"></div>
        <div class="wechat-dialog image-preview-dialog">
            <div class="wechat-dialog-title">图片</div>
            <div class="wechat-dialog-body image-preview-body">
                ${isLocalImage
                    ? `<img src="${imageData.content}" class="image-preview-real" alt="本地图片">`
                    : `<div class="image-preview-text">${escapeHtml(description)}</div>`
                }
            </div>
            <div class="wechat-dialog-footer">
                <button class="wechat-dialog-btn confirm image-preview-close">我知道了</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('.modal-overlay')?.addEventListener('click', close);
    modal.querySelector('.image-preview-close')?.addEventListener('click', close);
}

// ===========
// 红包详情页
// ============

function showRedPacketDetail(content, side, index) {
    try {
        // 先移除所有已存在的红包/转账详情页，防止页面叠加
        document.querySelectorAll('.money-detail-page').forEach(p => p.remove());

        // 边界检查
        if (!State || !State.currentContactId || !State.contacts) {
            console.error('State 对象不完整');
          return;
        }

        const raw = String(content || '');
        const lines = raw.split('\n');
        const amountMatch = raw.match(/金额:\s*¥?\s*([0-9]+(?:\.[0-9]+)?)/);
        const amount = amountMatch ? (parseFloat(amountMatch[1]) || 0) : 0;
    const remarkLine = lines.find(l => String(l || '').includes('备注'));
        const remark = remarkLine ? String(remarkLine).replace(/^备注:\s*/i, '').trim() : '';

        const contact = State.contacts.find(c => c.id === State.currentContactId);
        const senderName = side === 'left' ? (contact?.name || '好友') : (State.user?.nickname || '我');

        const meta = side === 'left' ? ensureWxMoneyMetaForMessage(index, side, raw) : null;
      const isDone = !!(meta && meta.status === 'opened' && meta.receivedAt);

    const page = document.createElement('div');
    page.className = 'page sub-page money-detail-page';
    page.style.position = 'fixed';
    page.style.inset = '0';
    page.style.zIndex = String(CONSTANTS.ZINDEX.DETAIL_PAGE);
    page.style.backgroundColor = '#fff';
    page.style.display = 'block';

    const renderOpen = () => `
        <div style="height:100%; background:rgba(0,0,0,0.6); display:flex; flex-direction:column; justify-content:center; align-items:center; position:relative;">
            <div style="width:min(320px, 80vw); height:min(440px, 70vh); background:#eb5442; border-radius:12px; position:relative; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.3);">
                <div style="position:absolute; top:0; left:0; right:0; height:100px; background:#e04f3d; border-bottom-left-radius:50% 20px; border-bottom-right-radius:50% 20px;"></div>
                <div style="position:relative; padding-top:42px; display:flex; flex-direction:column; align-items:center;">
                    <div style="width:40px; height:40px; border-radius:4px; background:#fff; overflow:hidden; margin-bottom:10px;">
                        <img src="${escapeHtml(contact?.avatar || 'images/default-avatar.png')}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='images/default-avatar.png'">
                    </div>
                    <div style="font-size:16px; color:#ffe2b1; margin-bottom:16px;">${escapeHtml(senderName)}的红包</div>
                    <div style="font-size:20px; font-weight:500; color:#ffe2b1; letter-spacing:1px; text-align:center; padding:0 20px;">${escapeHtml(remark || '恭喜发财，大吉大利')}</div>
                </div>
                ${side === 'left'
                    ? `<button id="wx-rp-open" type="button" style="position:absolute; left:50%; top:65%; transform:translate(-50%, -50%); width:84px; height:84px; border-radius:42px; border:none; background:#ebcd99; color:#333; font-size:36px; font-weight:600; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,0.15); display:flex; align-items:center; justify-content:center; z-index:10;">開</button>`
                    : `<div style="position:absolute; left:50%; top:65%; transform:translate(-50%, -50%); width:84px; height:84px; border-radius:42px; background:rgba(0,0,0,0.15); color:rgba(255,255,255,0.8); display:flex; align-items:center; justify-content:center; font-size:14px;">已发出</div>`
                }
            </div>
            <button id="wx-rp-close" type="button" style="position:absolute; left:50%; bottom:calc(50% - min(220px, 35vh) - 60px); transform:translateX(-50%); width:36px; height:36px; border-radius:18px; border:1px solid rgba(255,255,255,0.6); background:transparent; color:rgba(255,255,255,0.8); font-size:24px; display:flex; align-items:center; justify-content:center; cursor:pointer; line-height:1;">×</button>
        </div>
    `;

    const renderDone = () => `
        <div style="height:100%; display:flex; flex-direction:column; background:#fff; position:relative;">
            <div style="position:absolute; top:20px; left:14px; z-index:10;">
                <button id="wx-rp-back" type="button" style="width:34px; height:34px; border:none; background:transparent; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#f7e1b5;">
                    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>
            <div style="height:120px; background:#eb5442; border-bottom-left-radius:50% 20px; border-bottom-right-radius:50% 20px;"></div>
            <div style="position:relative; margin-top:-20px; display:flex; flex-direction:column; align-items:center; padding:0 20px;">
                <div style="width:48px; height:48px; border-radius:4px; background:#fff; overflow:hidden; margin-bottom:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${escapeHtml(contact?.avatar || 'images/default-avatar.png')}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='images/default-avatar.png'">
                </div>
                <div style="font-size:17px; font-weight:600; color:#333; display:flex; align-items:center; gap:6px;">
                    ${escapeHtml(senderName)}的红包
                    <span style="color:#e05a4f; background:#fceceb; padding:1px 4px; border-radius:4px; font-size:11px; font-weight:normal;">拼</span>
                </div>
                <div style="margin-top:8px; font-size:14px; color:#999;">${escapeHtml(remark || '恭喜发财，大吉大利')}</div>
                <div style="margin-top:24px; font-size:54px; font-weight:700; color:#cda35e; line-height:1; display:flex; align-items:baseline; justify-content:center;">
                    ${(+amount || 0).toFixed(2)}<span style="font-size:16px; font-weight:600; margin-left:4px; margin-bottom:10px;">元</span>
                </div>
                <div style="margin-top:16px; font-size:13px; color:#cda35e; display:flex; align-items:center;">
                    已存入零钱，可直接消费
                    <svg viewBox="0 0 24 24" width="14" height="14" style="margin-left:2px;"><path d="M9 18 L15 12 L9 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <button id="wx-rp-reply" type="button" style="margin-top:40px; padding:0 24px; height:42px; border:none; border-radius:8px; background:#f5f5f5; color:#cda35e; font-size:15px; font-weight:500; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
                    <svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 10.5 A1.5 1.5 0 1 1 8 10.4 M16 10.5 A1.5 1.5 0 1 1 16 10.4 M9 15 Q12 18 15 15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                    回复表情到聊天
                </button>
            </div>
            <div style="flex:1;"></div>
        </div>
    `;

    page.innerHTML = isDone ? renderDone() : renderOpen();
    document.getElementById('app').appendChild(page);

    const close = () => page.remove();
    page.querySelector('#wx-rp-close')?.addEventListener('click', close);
    page.querySelector('#wx-rp-back')?.addEventListener('click', close);
    page.querySelector('#wx-rp-reply')?.addEventListener('click', close);

    page.querySelector('#wx-rp-open')?.addEventListener('click', async () => {
        const latestMeta = ensureWxMoneyMetaForMessage(index, side, raw);
        if (!latestMeta || latestMeta.status === 'opened') return;
        const openBtn = page.querySelector('#wx-rp-open');
        if (openBtn) {
                 openBtn.style.transform = 'translate(-50%, -50%) rotate(360deg)';
       openBtn.style.transition = 'transform 0.5s ease-in-out';
            await new Promise(r => setTimeout(r, CONSTANTS.TIMING.RED_PACKET_ANIMATION));
        }
        State.wallet.balance = +((State.wallet.balance || 0) + (+latestMeta.amount || 0)).toFixed(2);
        addWalletBill('redpacket_in', +latestMeta.amount || 0, `${senderName} 红包`);
        Storage.saveWallet(State.wallet);
        initWalletPage();
        renderWalletBills();
        updateWxMoneyStatusAtIndex(index, 'opened', raw, { receivedAt: Date.now() });
        renderChatMessages();
        initChatList();
        page.innerHTML = renderDone();
        // 使用 requestAnimationFrame 确保 DOM 已渲染完成再绑定事件
        requestAnimationFrame(() => {
          page.querySelector('#wx-rp-back')?.addEventListener('click', close);
          page.querySelector('#wx-rp-reply')?.addEventListener('click', close);
      });
    });
    } catch (error) {
        console.error('显示红包详情失败:', error);
        if (typeof showToast === 'function') {
            showToast('打开红包详情失败');
        }
    }
}

// ==============
// 转账详情页
// =================

function showTransferDetail(content, side, index) {
    try {
        // 先移除所有已存在的红包/转账详情页，防止页面叠加
      document.querySelectorAll('.money-detail-page').forEach(p => p.remove());

        // 边界检查
        if (!State || !State.currentContactId || !State.contacts) {
            console.error('State 对象不完整');
          return;
      }

        const raw = String(content || '');
        const amountMatch = raw.match(/金额:\s*¥?\s*([0-9]+(?:\.[0-9]+)?)/);
        const amount = amountMatch ? (parseFloat(amountMatch[1]) || 0) : 0;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        const senderName = contact?.name || '好友';
        const meta = side === 'left' ? ensureWxMoneyMetaForMessage(index, side, raw) : null;
        const isDone = !!(meta && meta.status === 'received' && meta.receivedAt);

        const transferTime = meta?.createdAt ? formatWxCNTime(meta.createdAt) : formatWxCNTime(Date.now());
        const receivedTime = meta?.receivedAt ? formatWxCNTime(meta.receivedAt) : '';
      const amountStr = `¥${(+amount || 0).toFixed(2)}`;

    const page = document.createElement('div');
    page.className = 'page sub-page money-detail-page';
    page.style.position = 'fixed';
    page.style.inset = '0';
    page.style.zIndex = String(CONSTANTS.ZINDEX.DETAIL_PAGE);
    page.style.backgroundColor = '#fff';
    page.style.display = 'block';

    const renderPending = () => `
        <div style="height:100%; display:flex; flex-direction:column; background:#fff;">
            <div style="height:56px; display:flex; align-items:center; padding:0 14px;">
                <button id="wx-transfer-back" type="button" style="width:34px; height:34px; border:none; background:transparent; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M14.5 5.5 L8 12 L14.5 18.5" fill="none" stroke="#1a1a1a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; padding:40px 20px 0;">
                <div style="width:64px; height:64px; border-radius:32px; border:3px solid #4a90e2; display:flex; align-items:center; justify-content:center; color:#4a90e2;">
                    <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
                        <circle cx="12" cy="12" r="8" fill="none" stroke="#4a90e2" stroke-width="2"/>
                        <path d="M12 7 V12 L15 14" fill="none" stroke="#4a90e2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div style="margin-top:18px; font-size:16px; color:#333;">${side === 'left' ? '待你收款' : '待对方收款'}</div>
                <div style="margin-top:10px; font-size:44px; font-weight:600; color:#111; line-height:1;">${amountStr}</div>
                <div style="margin-top:18px; width:100%; max-width:420px; border-top:1px solid rgba(0,0,0,0.06); padding-top:14px; color:#888; font-size:13px; display:flex; justify-content:space-between;">
                    <div>转账时间</div>
                    <div style="color:#333;">${escapeHtml(transferTime)}</div>
                </div>
            </div>
            <div style="padding:16px 20px 26px;">
                ${side === 'left'
                    ? `<button id="wx-transfer-receive" type="button" style="width:100%; height:46px; border:none; border-radius:10px; background:#07c160; color:#fff; font-size:16px; font-weight:500; cursor:pointer;">收款</button>
                       <div style="margin-top:10px; text-align:center; color:#999; font-size:12px;">1天内未确认，将退还给对方。</div>`
                    : `<div style="text-align:center; color:#999; font-size:12px;">等待对方收款</div>`
                }
            </div>
        </div>
    `;

    const renderDone = () => `
        <div style="height:100%; display:flex; flex-direction:column; background:#fff;">
            <div style="height:56px; display:flex; align-items:center; padding:0 14px;">
                <button id="wx-transfer-back" type="button" style="width:34px; height:34px; border:none; background:transparent; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M14.5 5.5 L8 12 L14.5 18.5" fill="none" stroke="#1a1a1a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; padding:36px 20px 0;">
                <div style="width:64px; height:64px; border-radius:32px; background:#07c160; display:flex; align-items:center; justify-content:center;">
                    <svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true"><path d="M6 12.5 L10.2 16.7 L18 8.9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div style="margin-top:18px; font-size:16px; color:#333;">${side === 'left' ? '你已收款，资金已存入零钱' : '对方已收款'}</div>
                <div style="margin-top:10px; font-size:44px; font-weight:600; color:#111; line-height:1;">${amountStr}</div>
                <div style="margin-top:18px; width:100%; max-width:420px; border-top:1px solid rgba(0,0,0,0.06); padding-top:14px; color:#888; font-size:13px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><div>转账时间</div><div style="color:#333;">${escapeHtml(transferTime)}</div></div>
                    <div style="display:flex; justify-content:space-between;"><div>收款时间</div><div style="color:#333;">${escapeHtml(receivedTime || formatWxCNTime(Date.now()))}</div></div>
                </div>
                <div style="margin-top:22px; width:100%; max-width:420px; display:flex; justify-content:center; color:#888; font-size:13px;">账单详情</div>
            </div>
        </div>
    `;

    page.innerHTML = isDone ? renderDone() : renderPending();
    document.getElementById('app').appendChild(page);

    const close = () => page.remove();
    page.querySelector('#wx-transfer-back')?.addEventListener('click', close);
    page.querySelector('#wx-transfer-receive')?.addEventListener('click', () => {
        if (side !== 'left') return;
        const latestMeta = ensureWxMoneyMetaForMessage(index, side, raw);
        if (!latestMeta || latestMeta.status === 'received') return;
        State.wallet.balance = +((State.wallet.balance || 0) + (+latestMeta.amount || 0)).toFixed(2);
        addWalletBill('transfer_in', +latestMeta.amount || 0, `${senderName} 转账`);
        Storage.saveWallet(State.wallet);
        initWalletPage();
        renderWalletBills();
        updateWxMoneyStatusAtIndex(index, 'received', raw, { receivedAt: Date.now() });
        renderChatMessages();
        initChatList();
      page.innerHTML = renderDone();
        // 使用 requestAnimationFrame 确保 DOM 已渲染完成再绑定事件
        requestAnimationFrame(() => {
            page.querySelector('#wx-transfer-back')?.addEventListener('click', close);
        });
    });
    } catch (error) {
        console.error('显示转账详情失败:', error);
        if (typeof showToast === 'function') {
         showToast('打开转账详情失败');
        }
    }
}

// ========
// 语音消息折叠/展开
// =================

function toggleVoiceMessage(bubble) {
    const textEl = bubble.querySelector('.voice-translation');
    if (textEl) {
        if (textEl.style.display === 'none' || !textEl.style.display) {
        textEl.style.display = 'block';
            bubble.classList.add('voice-expanded');
        } else {
            textEl.style.display = 'none';
            bubble.classList.remove('voice-expanded');
    }
    }
}

// ===========
// 初始化
// ===================

// 在 DOMContentLoaded 后调用
document.addEventListener('DOMContentLoaded', () => {
    // 延迟初始化，确保其他代码已加载
    setTimeout(() => {
        initContextMenuEvents();
        console.log('消息长按菜单已初始化');
    }, CONSTANTS.TIMING.INIT_DELAY);
});

console.log('功能改进补丁已加载');
