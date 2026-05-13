(() => {
    const PATCH_VER = '20260613_1';

    const ensureStyle = () => {
        if (document.getElementById('wx-hotfix-style')) return;
        const style = document.createElement('style');
        style.id = 'wx-hotfix-style';
        style.textContent = `
.message-bubble,.message-bubble *{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;}
`;
        document.head.appendChild(style);
    };

    const stopNativeMenu = () => {
        const handler = (e) => {
            const bubble = e?.target?.closest?.('.message-bubble');
            if (!bubble) return;
            try { e.preventDefault(); } catch (err) {}
            try { e.stopPropagation(); } catch (err) {}
        };
        document.addEventListener('contextmenu', handler, true);
        document.addEventListener('selectstart', handler, true);
    };

    const safeJsonParse = (text) => {
        try { return JSON.parse(String(text || '')); } catch (e) { return null; }
    };

    const extractAiPayload = (text) => {
        const cleaned = String(text || '').trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        if (!cleaned) return null;
        try {
            const parsed = JSON.parse(cleaned);
            if (Array.isArray(parsed)) return parsed;
            if (parsed && typeof parsed === 'object') return [parsed];
        } catch (e) {
        }
        const arrMatch = cleaned.match(/\[[\s\S]*\]/);
        if (arrMatch) {
            try {
                const parsed = JSON.parse(arrMatch[0]);
                if (Array.isArray(parsed)) return parsed;
            } catch (e) {
            }
        }
        if (!cleaned.startsWith('{')) return null;

        const items = [];
        let depth = 0;
        let start = -1;
        let inString = false;
        let escaping = false;

        for (let i = 0; i < cleaned.length; i++) {
            const ch = cleaned[i];
            if (inString) {
                if (escaping) {
                    escaping = false;
                    continue;
                }
                if (ch === '\\') {
                    escaping = true;
                    continue;
                }
                if (ch === '"') inString = false;
                continue;
            }
            if (ch === '"') {
                inString = true;
                continue;
            }
            if (ch === '{') {
                if (depth === 0) start = i;
                depth += 1;
                continue;
            }
            if (ch === '}') {
                depth -= 1;
                if (depth === 0 && start !== -1) {
                    const slice = cleaned.slice(start, i + 1);
                    try {
                        const obj = JSON.parse(slice);
                        if (obj && typeof obj === 'object') items.push(obj);
                    } catch (e) {
                    }
                    start = -1;
                }
            }
        }

        return items.length > 0 ? items : null;
    };

    const normalizeWxMoneyCardTextContent = (content) => {
        let text = String(content || '');
        text = text.replace(/^\s*(\[微信转账\])\s*(?=金额:)/, '$1\n');
        text = text.replace(/^\s*(\[微信红包\])\s*(?=金额:)/, '$1\n');
        text = text.replace(/^\s*(\[微信转账\])\s*金额:/, '$1\n金额:');
        text = text.replace(/^\s*(\[微信红包\])\s*金额:/, '$1\n金额:');
        text = text.replace(/(金额:\s*¥?\s*[0-9]+(?:\.[0-9]+)?)\s*(?=说明:)/, '$1\n');
        text = text.replace(/(金额:\s*¥?\s*[0-9]+(?:\.[0-9]+)?)\s*(?=备注:)/, '$1\n');
        return text;
    };

    const repairHistoryForContact = (contactId) => {
        const cid = String(contactId || '').trim();
        if (!cid || !window.State || !window.Storage) return;
        const history = window.State.chatHistories?.[cid];
        if (!Array.isArray(history) || history.length === 0) return;

        let changed = false;
        const startIndex = Math.max(0, history.length - 80);

        for (let i = startIndex; i < history.length; i++) {
            const msg = history[i];
            if (!msg || msg.role !== 'assistant') continue;
            const raw = String(msg.content || '').trim();
            if (!raw) continue;
            if (raw.startsWith('{') && raw.includes('}{') && !raw.startsWith('[')) {
                const parsed = extractAiPayload(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    msg.content = JSON.stringify(parsed);
                    changed = true;
                }
            }
        }

        for (let i = startIndex; i < history.length - 1; i++) {
            const a = history[i];
            const b = history[i + 1];
            if (!a || !b || a.role !== 'assistant' || b.role !== 'assistant') continue;
            const ao = safeJsonParse(a.content);
            const bo = safeJsonParse(b.content);
            if (!ao || !bo) continue;
            if (Array.isArray(ao) || Array.isArray(bo)) continue;
            if (typeof ao !== 'object' || typeof bo !== 'object') continue;
            if ((ao.type !== 'text' && ao.type !== 'text_message') || (bo.type !== 'text' && bo.type !== 'text_message')) continue;

            const aTextRaw = String(ao.content || '');
            const aText = aTextRaw.trim();
            const bText = String(bo.content || '').trim();
            const isTransfer = aText.startsWith('[微信转账]');
            const isRedpacket = aText.startsWith('[微信红包]');
            if (!isTransfer && !isRedpacket) continue;

            const needKey = isTransfer ? '说明:' : '备注:';
            if (aText.includes(`\n${needKey}`) || aText.includes(needKey)) continue;
            if (!bText.startsWith(needKey)) continue;

            const merged = `${normalizeWxMoneyCardTextContent(aTextRaw).trim()}\n${bText}`;
            ao.content = merged;
            const remark = bText.replace(/^说明:\s*/i, '').replace(/^备注:\s*/i, '').trim();
            if (ao.wxMoney && typeof ao.wxMoney === 'object') {
                const oldRemark = String(ao.wxMoney.remark || '').trim();
                if (!oldRemark && remark) ao.wxMoney.remark = remark;
            }

            history[i].content = JSON.stringify(ao);
            history.splice(i + 1, 1);
            changed = true;
            i -= 1;
        }

        if (changed) {
            try { window.Storage.saveChatHistories(window.State.chatHistories); } catch (e) {}
        }
    };

    const wrapRenderChatMessages = () => {
        if (window.__wxHotfixWrapped) return;
        const original = window.renderChatMessages;
        if (typeof original !== 'function') return;
        window.__wxHotfixWrapped = true;
        window.renderChatMessages = function (...args) {
            try { repairHistoryForContact(window.State?.currentContactId); } catch (e) {}
            return original.apply(this, args);
        };
    };

    const bindQuickLongPress = (el) => {
        if (!el || el.dataset.wxHotfixBound === PATCH_VER) return;
        el.dataset.wxHotfixBound = PATCH_VER;

        let timer = null;
        let startX = 0;
        let startY = 0;
        const clear = () => {
            if (timer) clearTimeout(timer);
            timer = null;
        };
        const fire = (x, y) => {
            try { el._longPressFired = true; } catch (e) {}
            const rect = el.getBoundingClientRect?.();
            const clientX = Number.isFinite(x) ? x : (rect ? rect.left + rect.width / 2 : 12);
            const clientY = Number.isFinite(y) ? y : (rect ? rect.top + rect.height / 2 : 12);
            try {
                el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX, clientY }));
            } catch (e) {
            }
        };

        el.addEventListener('touchstart', (e) => {
            try { e.preventDefault(); } catch (err) {}
            clear();
            const p = e?.touches?.[0];
            startX = Number(p?.clientX || 0);
            startY = Number(p?.clientY || 0);
            timer = setTimeout(() => fire(startX, startY), 180);
        }, { passive: false });

        el.addEventListener('touchmove', (e) => {
            if (!timer) return;
            const p = e?.touches?.[0];
            const x = Number(p?.clientX || 0);
            const y = Number(p?.clientY || 0);
            if (Math.hypot(x - startX, y - startY) > 12) clear();
        }, { passive: true });

        el.addEventListener('touchend', clear, { passive: true });
        el.addEventListener('touchcancel', clear, { passive: true });
    };

    const bindUiPatches = () => {
        bindQuickLongPress(document.getElementById('batch-reply-btn'));
        bindQuickLongPress(document.getElementById('call-ai-reply-btn'));
    };

    const start = () => {
        ensureStyle();
        stopNativeMenu();
        wrapRenderChatMessages();
        bindUiPatches();
        setInterval(bindUiPatches, 1200);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
