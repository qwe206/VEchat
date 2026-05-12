// ========================================
// 微信模拟应用 - 改进版
// 使用 localForage + 错误处理 + API代理支持
// ==========================

// ==============================
// 工具函数
// ==============================

// Toast 提示
function showToast(message, duration = 2000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
  toast.classList.add('show');
    toast.style.display = 'block';

    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => {
            toast.style.display = 'none';
            toast.classList.remove('hide');
        }, 300);
    }, duration);
}

// Loading 加载
function showLoading(text = '加载中...') {
    const overlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    if (!overlay || !loadingText) return;
    loadingText.textContent = text;
    overlay.style.display = 'flex';
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (!overlay) return;
    overlay.style.display = 'none';
}

// 简单的加密/解密（基于 base64，仅用于混淆）
function simpleEncrypt(text) {
    try {
        return btoa(encodeURIComponent(text));
    } catch (e) {
        console.error('加密失败:', e);
        return text;
    }
}

function simpleDecrypt(encrypted) {
    if (!encrypted) return '';
    try {
        return decodeURIComponent(atob(encrypted));
    } catch (e) {
        console.error('解密失败:', e);
        return encrypted;
    }
}
