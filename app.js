document.addEventListener('DOMContentLoaded', async function () {
  const welcomeMessage = document.getElementById('welcomeMessage');

  // 檢查是否為 Pi Browser
  function isPiBrowser() {
    // 檢查 User-Agent 是否包含 Pi 相關關鍵詞
    return /PiBrowser|Pi Network|Pi/i.test(navigator.userAgent);
  }

  // 檢查 Pi Browser
  if (!isPiBrowser()) {
    welcomeMessage.textContent = '抱歉，請使用 Pi Browser 瀏覽器進入網站';
    console.log('非 Pi Browser 環境，User-Agent:', navigator.userAgent);
    return;
  }

  // 等待 Pi SDK 載入（最多 3 秒）
  async function waitForPiSDK(timeout = 3000) {
    const start = Date.now();
    while (!window.Pi && Date.now() - start < timeout) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return !!window.Pi;
  }

  // 確認 Pi SDK 是否載入
  const piSDKLoaded = await waitForPiSDK();
  if (!piSDKLoaded) {
    welcomeMessage.textContent = '無法載入 Pi SDK，請檢查網路或稍後再試';
    console.log('Pi SDK 載入失敗，User-Agent:', navigator.userAgent);
    return;
  }

  try {
    // 初始化 Pi Network SDK
    // 若在沙盒環境測試，取消以下註解並使用 sandbox: true
    // Pi.init({ version: '2.0', sandbox: true });
    Pi.init({ version: '2.0' });

    // 認證用戶並獲取用戶名
    const scopes = ['username'];
    function onIncompletePaymentFound(payment) {
      console.log('發現未完成支付:', payment);
      // 可選：處理未完成支付
    }

    const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
    const username = auth.user.username;
    welcomeMessage.textContent = `歡迎 ${username} 進入網站`;
  } catch (error) {
    console.error('Pi SDK 初始化或認證失敗:', error);
    welcomeMessage.textContent = '無法驗證用戶，請檢查是否已登錄 Pi Browser 或稍後再試';
  }
});
