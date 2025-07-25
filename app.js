document.addEventListener('DOMContentLoaded', async function () {
  const welcomeMessage = document.getElementById('welcomeMessage');

  // Function to check if running in Pi Browser
  function isPiBrowser() {
    // Check for window.Pi object (loaded by Pi SDK)
    if (window.Pi) {
      return true;
    }
    // Fallback: Check User-Agent for Pi Browser identifiers
    return /PiBrowser|Pi Network/i.test(navigator.userAgent);
  }

  // Wait for Pi SDK to load (with timeout)
  async function waitForPiSDK(timeout = 5000) {
    const start = Date.now();
    while (!window.Pi && Date.now() - start < timeout) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return !!window.Pi;
  }

  // Check if Pi SDK loaded successfully
  const piSDKLoaded = await waitForPiSDK();
  if (!piSDKLoaded || !isPiBrowser()) {
    welcomeMessage.textContent = '抱歉，請使用Pi Browser瀏覽器進入網站';
    return;
  }

  try {
    // Initialize Pi Network SDK
    Pi.init({ version: '2.0' });

    // Authenticate user and retrieve username
    const scopes = ['username'];
    function onIncompletePaymentFound(payment) {
      console.log('Incomplete payment found:', payment);
      // Handle incomplete payments if needed (e.g., notify server)
    }

    const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
    const username = auth.user.username;
    welcomeMessage.textContent = `歡迎 ${username} 進入網站`;
  } catch (error) {
    console.error('Authentication or SDK error:', error);
    welcomeMessage.textContent = '無法驗證用戶，請稍後再試';
  }
});
