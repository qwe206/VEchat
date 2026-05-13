// ============
// 图片处理补丁 - 覆盖 script.js 中的图片处理逻辑
// 在 HTML 中的 script.js 之后加载此文件
// ========

(function() {
    // 重写相册上传处理
    const imageUpload = document.getElementById('chat-image-upload');
    if (imageUpload) {
        // 移除旧的事件监听器（通过克隆节点）
        const newImageUpload = imageUpload.cloneNode(true);
    imageUpload.parentNode.replaceChild(newImageUpload, imageUpload);
        
      // 添加新的事件监听器
        newImageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
          const contactId = String(State.currentContactId || '').trim();
          if (file && contactId) {
                const contact = (State.contacts || []).find(c => c && String(c.id || '') === contactId);
                if (!contact) {
                    if (newImageUpload) newImageUpload.value = '';
                    return;
                }
                // 读取本地图片并直接显示（不渲染成卡片）
            const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target.result;
                // 直接发送 base64 图片，并标记为本地真实图片
                    const imageContent = { type: "image", content: base64, description: "", isLocal: true };
          const imageJson = JSON.stringify(imageContent);
              
                if (!State.chatHistories[contactId]) {
                    State.chatHistories[contactId] = [];
                }
                const nowTs = Date.now();
                State.chatHistories[contactId].push({
                    role: 'user',
                    content: imageJson,
                    time: nowTs
                });
                const msgIndex = State.chatHistories[contactId].length - 1;
                const userProfile = getUserProfileForContact(contact);
                addMessageToUI(imageJson, 'right', userProfile.avatar, msgIndex);
                    
                    // 保存到历史
                Storage.saveChatHistories(State.chatHistories);

                contact.lastMessage = '[图片]';
                const now = new Date(nowTs);
                contact.lastTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                contact.lastActiveAt = nowTs;
                Storage.saveContacts(State.contacts);
                if (String(State.currentContactId || '') === contactId && typeof renderChatMessages === 'function') {
                    renderChatMessages();
                }
                if (typeof initChatList === 'function') initChatList();
            };
                reader.readAsDataURL(file);
            }
            // 重置 input 以便下次选择同样文件能触发 change
            if (newImageUpload) newImageUpload.value = '';
          const plusPanel = document.getElementById('chat-plus-panel');
            if (plusPanel) plusPanel.classList.remove('show');
        });
    }
    
    console.log('图片处理补丁已加载');
})();
