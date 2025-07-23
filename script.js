// Initialize Pi SDK
Pi.init({ version: "2.0" });

// Define onIncompletePaymentFound function
function onIncompletePaymentFound(payment) {
    console.log('Incomplete payment found:', payment);
}

// Authenticate user
const scopes = ['username'];
Pi.authenticate(scopes, onIncompletePaymentFound)
    .then(function(auth) {
        console.log('Authentication successful:', auth);
        const username = auth.username; // Adjust if structure is auth.user.username
        document.getElementById('welcome-message').textContent = `嗨！歡迎 ${username} 來到我的網站`;
        document.getElementById('pi-user').style.display = 'block';
        document.getElementById('non-pi-user').style.display = 'none';
    })
    .catch(function(error) {
        console.error('Authentication error:', error);
        document.getElementById('pi-user').style.display = 'none';
        document.getElementById('non-pi-user').style.display = 'block';
    });

// Wallet address from config file
const walletAddress = CONFIG.WALLET_ADDRESS;

// Get modal instance
const qrModal = new bootstrap.Modal(document.getElementById('qrModal'));

// Show QR code on button click
document.getElementById('show-qr').addEventListener('click', function() {
    const canvas = document.getElementById('qr-canvas');
    QRCode.toCanvas(canvas, walletAddress, function(error) {
        if (error) {
            console.error(error);
            alert('QR碼生成失敗，請稍後再試');
        }
    });
    qrModal.show();
});