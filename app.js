document.addEventListener('DOMContentLoaded', function () {
  const welcomeMessage = document.getElementById('welcomeMessage');

  // Check if the browser is Pi Browser by examining User-Agent
  const isPiBrowser = /PiBrowser|Pi Network/i.test(navigator.userAgent);

  if (!isPiBrowser) {
    welcomeMessage.textContent = '抱歉，請使用Pi Browser瀏覽器進入網站';
    return;
  }

  // Initialize Pi Network SDK
  Pi.init({ version: '2.0' });

  // Authenticate user and retrieve username
  Pi.authenticate(['username'])
    .then(function (auth) {
      const username = auth.user.username;
      welcomeMessage.textContent = `歡迎 ${username} 進入網站`;
    })
    .catch(function (error) {
      console.error('Authentication failed:', error);
      welcomeMessage.textContent = '無法驗證用戶，請稍後再試';
    });
});
