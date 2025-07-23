// Wallet address
const walletAddress = "GBFSZO7SFB6LBAN62DSWG56I7L2QYUUHT64R43IADIHEY2NRG3QVKT4W";

// Initialize Pi SDK when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading indicator initially
    document.getElementById('loading').style.display = 'block';
    
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
            document.getElementById('loading').style.display = 'none';
            
            // Get username from auth object
            const username = auth.user ? auth.user.username : auth.username;
            document.getElementById('welcome-message').textContent = `嗨！歡迎 ${username} 來到我的網站`;
            document.getElementById('pi-user').style.display = 'block';
            document.getElementById('non-pi-user').style.display = 'none';
        })
        .catch(function(error) {
            console.error('Authentication error:', error);
            document.getElementById('loading').style.display = 'none';
            document.getElementById('pi-user').style.display = 'none';
            document.getElementById('non-pi-user').style.display = 'block';
        });

    // Get modal instance
    const qrModal = new bootstrap.Modal(document.getElementById('qrModal'));

    // Show QR code on button click
    document.getElementById('show-qr').addEventListener('click', function() {
        const canvas = document.getElementById('qr-canvas');
        const walletDisplay = document.getElementById('wallet-address-display');
        
        // Display wallet address
        walletDisplay.textContent = walletAddress;
        
        // Generate QR code
        QRCode.toCanvas(canvas, walletAddress, {
            width: 250,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        }, function(error) {
            if (error) {
                console.error(error);
                alert('QR碼生成失敗，請稍後再試');
            } else {
                qrModal.show();
            }
        });
    });

    // Copy wallet address to clipboard
    document.getElementById('copy-address').addEventListener('click', function() {
        navigator.clipboard.writeText(walletAddress).then(function() {
            alert('錢包地址已複製到剪貼板');
        }).catch(function(err) {
            console.error('複製失敗:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = walletAddress;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('錢包地址已複製到剪貼板');
        });
    });
});