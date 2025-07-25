document.addEventListener('DOMContentLoaded', async function () {
  const welcomeMessage = document.getElementById('welcomeMessage');

  try {
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
    console.error('認證失敗或非 Pi Browser 環境:', error);
    welcomeMessage.textContent = '抱歉，請使用 Pi Browser 瀏覽器進入網站';
  }
});
