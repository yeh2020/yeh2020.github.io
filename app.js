document.addEventListener('DOMContentLoaded', async function () {
  const welcomeMessage = document.getElementById('welcomeMessage');

  // 等待 Pi SDK 載入（最多 3 秒）
  async function waitForPiSDK(timeout = 3000) {
    const start = Date.now();
    while (!window.Pi && Date.now() - start < timeout) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return !!window.Pi;
  }

  // 檢查是否為 Pi Browser
  const isPiBrowser = await waitForPiSDK();
  console.log(`window.Pi 狀態: ${isPiBrowser ? '存在，確認為 Pi Browser' : '不存在，判定為非 Pi Browser'}`);
  console.log(`User-Agent: ${navigator.userAgent}`);

  if (!isPiBrowser) {
    welcomeMessage.textContent = '抱歉，請使用 Pi Browser 瀏覽器進入網站';
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
    console.log(`認證成功，用戶名: ${username}`);
  } catch (error) {
    console.error('Pi SDK 初始化或認證失敗:', error);
    welcomeMessage.textContent = '無法驗證用戶，請檢查是否已登錄 Pi Browser 或稍後再試';
  }
});
