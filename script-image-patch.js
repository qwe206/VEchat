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
          if (file && State.currentContactId) {
                // 读取本地图片并直接显示（不渲染成卡片）
            const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target.result;
                // 直接发送 base64 图片，并标记为本地真实图片
                    const imageContent = { type: "image", content: base64, description: "", isLocal: true };
          const imageJson = JSON.stringify(imageContent);
              
                // 添加用户消息
                  addMessageToUI(imageJson, 'right', State.user.avatar);
                    
                    // 保存到历史
                    if (!State.chatHistories[State.currentContactId]) {
                    State.chatHistories[State.currentContactId] = [];
                    }
                    State.chatHistories[State.currentContactId].push({
                        role: 'user',
                        content: imageJson,
                     time: Date.now()
                  });
                Storage.saveChatHistories(State.chatHistories);
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
