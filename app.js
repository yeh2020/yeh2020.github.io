// Pi Network 支援網站主應用程序
class PiSupportApp {
    constructor() {
        this.isInitialized = false;
        this.isAuthenticated = false;
        this.currentUser = null;
        this.paymentInProgress = false;
        
        // DOM 元素
        this.elements = {
            statusDisplay: document.getElementById('status-display'),
            unregisteredSection: document.getElementById('unregistered-section'),
            registeredSection: document.getElementById('registered-section'),
            userWelcome: document.getElementById('user-welcome'),
            username: document.getElementById('username'),
            authSection: document.getElementById('auth-section'),
            authBtn: document.getElementById('auth-btn'),
            authText: document.getElementById('auth-text'),
            authSpinner: document.getElementById('auth-spinner'),
            paymentSection: document.getElementById('payment-section'),
            paymentBtn: document.getElementById('payment-btn'),
            paymentText: document.getElementById('payment-text'),
            paymentSpinner: document.getElementById('payment-spinner'),
            successNotification: document.getElementById('success-notification')
        };
        
        // 綁定事件
        this.bindEvents();
        
        // 開始初始化
        this.initialize();
    }
    
    // 綁定事件處理器
    bindEvents() {
        this.elements.authBtn.addEventListener('click', () => this.handleAuthentication());
        this.elements.paymentBtn.addEventListener('click', () => this.handlePayment());
    }
    
    // 更新狀態顯示
    updateStatus(message, type = 'loading') {
        const statusClasses = {
            loading: 'status-loading',
            success: 'status-success',
            error: 'status-error'
        };
        
        this.elements.statusDisplay.className = `status-message ${statusClasses[type]}`;
        
        if (type === 'loading') {
            this.elements.statusDisplay.innerHTML = `
                <div class="d-flex align-items-center justify-content-center">
                    <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                    ${message}
                </div>
            `;
        } else {
            this.elements.statusDisplay.innerHTML = message;
        }
    }
    
    // 顯示/隱藏加載狀態
    toggleLoading(element, textElement, spinnerElement, isLoading) {
        if (isLoading) {
            element.disabled = true;
            spinnerElement.classList.remove('d-none');
        } else {
            element.disabled = false;
            spinnerElement.classList.add('d-none');
        }
    }
    
    // 初始化應用程序
    async initialize() {
        try {
            this.updateStatus('正在檢查 Pi Network 環境...');
            
            // 檢查是否在 Pi Browser 中
            if (!this.isPiBrowser()) {
                this.showUnregisteredUser();
                return;
            }
            
            // 檢查 Pi SDK 是否載入
            if (typeof Pi === 'undefined') {
                throw new Error('Pi SDK 未載入');
            }
            
            this.updateStatus('正在初始化 Pi SDK...');
            
            // 初始化 Pi SDK
            await Pi.init({
                version: "2.0",
                sandbox: false, // 生產環境設為 false，開發環境設為 true
                timeout: 30000,
                locale: "zh-TW"
            });
            
            this.isInitialized = true;
            this.updateStatus('✅ Pi Network 環境檢查完成', 'success');
            
            // 顯示已註冊用戶界面
            this.showRegisteredUser();
            
        } catch (error) {
            console.error('初始化失敗:', error);
            this.updateStatus(`❌ 初始化失敗: ${error.message}`, 'error');
            
            // 如果是網絡錯誤，顯示未註冊界面
            if (error.message.includes('網絡') || error.message.includes('連接')) {
                setTimeout(() => {
                    this.showUnregisteredUser();
                }, 3000);
            }
        }
    }
    
    // 檢查是否在 Pi Browser 中
    isPiBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        const referrer = document.referrer.toLowerCase();
        
        // 檢查 User Agent 或 referrer 是否包含 Pi Browser 相關標識
        return userAgent.includes('pibrowser') || 
               referrer.includes('pinet.com') || 
               referrer.includes('minepi.com') ||
               window.location.hostname.includes('pinet.com');
    }
    
    // 顯示未註冊用戶界面
    showUnregisteredUser() {
        this.updateStatus('請先註冊 Pi Network', 'error');
        this.elements.statusDisplay.classList.add('d-none');
        this.elements.unregisteredSection.classList.remove('d-none');
        this.elements.registeredSection.classList.add('d-none');
    }
    
    // 顯示已註冊用戶界面
    showRegisteredUser() {
        this.elements.statusDisplay.classList.add('d-none');
        this.elements.unregisteredSection.classList.add('d-none');
        this.elements.registeredSection.classList.remove('d-none');
    }
    
    // 處理用戶認證
    async handleAuthentication() {
        if (!this.isInitialized) {
            alert('Pi SDK 尚未初始化完成，請稍後再試');
            return;
        }
        
        if (this.isAuthenticated) {
            // 如果已經認證，直接顯示支付界面
            this.showPaymentSection();
            return;
        }
        
        try {
            this.toggleLoading(
                this.elements.authBtn, 
                this.elements.authText, 
                this.elements.authSpinner, 
                true
            );
            
            this.elements.authText.textContent = '正在認證中...';
            
            // 調用 Pi Network 認證
            const scopes = ['payments'];
            const authResult = await Pi.authenticate(scopes, this.onIncompletePaymentFound.bind(this));
            
            console.log('認證成功:', authResult);
            
            this.isAuthenticated = true;
            this.currentUser = authResult.user;
            
            // 顯示用戶歡迎信息
            this.showUserWelcome(authResult.user);
            
            // 顯示支付區域
            this.showPaymentSection();
            
        } catch (error) {
            console.error('認證失敗:', error);
            this.handleAuthError(error);
        } finally {
            this.toggleLoading(
                this.elements.authBtn, 
                this.elements.authText, 
                this.elements.authSpinner, 
                false
            );
            this.elements.authText.textContent = '同意使用第三方應用';
        }
    }
    
    // 處理認證錯誤
    handleAuthError(error) {
        let errorMessage = '認證失敗，請重試';
        
        if (error.message.includes('cancelled') || error.message.includes('denied')) {
            errorMessage = '用戶取消了認證，請重新嘗試';
        } else if (error.message.includes('network')) {
            errorMessage = '網絡連接問題，請檢查網絡後重試';
        }
        
        alert(errorMessage);
    }
    
    // 顯示用戶歡迎信息
    showUserWelcome(user) {
        this.elements.username.textContent = user.username || user.uid;
        this.elements.userWelcome.classList.remove('d-none');
        this.elements.authSection.classList.add('d-none');
    }
    
    // 顯示支付區域
    showPaymentSection() {
        this.elements.paymentSection.classList.remove('d-none');
    }
    
    // 處理支付
    async handlePayment() {
        if (this.paymentInProgress) {
            return;
        }
        
        if (!this.isAuthenticated) {
            alert('請先完成認證');
            return;
        }
        
        try {
            this.paymentInProgress = true;
            this.toggleLoading(
                this.elements.paymentBtn,
                this.elements.paymentText,
                this.elements.paymentSpinner,
                true
            );
            
            this.elements.paymentText.textContent = '正在創建支付...';
            
            // 創建支付請求
            const paymentData = {
                amount: 1,
                memo: "救助支援 - 感謝您的慷慨贊助",
                metadata: {
                    type: "donation",
                    purpose: "support",
                    timestamp: new Date().toISOString(),
                    userId: this.currentUser.uid
                }
            };
            
            const callbacks = {
                onReadyForServerApproval: (paymentId) => {
                    console.log('支付等待服務器批准:', paymentId);
                    this.elements.paymentText.textContent = '等待批准中...';
                    // 這裡應該調用您的服務器 API 來批准支付
                    this.approvePaymentOnServer(paymentId);
                },
                
                onReadyForServerCompletion: (paymentId, txid) => {
                    console.log('支付等待服務器完成:', paymentId, txid);
                    this.elements.paymentText.textContent = '正在完成支付...';
                    // 這裡應該調用您的服務器 API 來完成支付
                    this.completePaymentOnServer(paymentId, txid);
                },
                
                onCancel: (paymentId) => {
                    console.log('支付被取消:', paymentId);
                    this.handlePaymentCancel();
                },
                
                onError: (error, payment) => {
                    console.error('支付錯誤:', error);
                    this.handlePaymentError(error);
                }
            };
            
            // 創建 Pi 支付
            Pi.createPayment(paymentData, callbacks);
            
        } catch (error) {
            console.error('創建支付失敗:', error);
            this.handlePaymentError(error);
        }
    }
    
    // 模擬服務器批准支付（實際應用中應該調用真實的服務器 API）
    async approvePaymentOnServer(paymentId) {
        try {
            // 模擬服務器處理時間
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log('服務器批准支付成功:', paymentId);
            this.elements.paymentText.textContent = '支付已批准，等待區塊鏈確認...';
            
        } catch (error) {
            console.error('服務器批准失敗:', error);
            this.handlePaymentError(error);
        }
    }
    
    // 模擬服務器完成支付（實際應用中應該調用真實的服務器 API）
    async completePaymentOnServer(paymentId, txid) {
        try {
            // 模擬服務器處理時間
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            console.log('服務器完成支付成功:', paymentId, txid);
            
            // 支付成功
            this.handlePaymentSuccess();
            
        } catch (error) {
            console.error('服務器完成失敗:', error);
            this.handlePaymentError(error);
        }
    }
    
    // 處理支付成功
    handlePaymentSuccess() {
        this.paymentInProgress = false;
        this.toggleLoading(
            this.elements.paymentBtn,
            this.elements.paymentText,
            this.elements.paymentSpinner,
            false
        );
        
        this.elements.paymentText.textContent = '支付完成';
        this.elements.paymentBtn.classList.remove('btn-pi');
        this.elements.paymentBtn.classList.add('btn-success');
        this.elements.paymentBtn.disabled = true;
        
        // 顯示成功通知
        this.showSuccessNotification();
    }
    
    // 處理支付取消
    handlePaymentCancel() {
        this.paymentInProgress = false;
        this.toggleLoading(
            this.elements.paymentBtn,
            this.elements.paymentText,
            this.elements.paymentSpinner,
            false
        );
        
        this.elements.paymentText.textContent = '支付 1 Pi';
        alert('支付已取消');
    }
    
    // 處理支付錯誤
    handlePaymentError(error) {
        this.paymentInProgress = false;
        this.toggleLoading(
            this.elements.paymentBtn,
            this.elements.paymentText,
            this.elements.paymentSpinner,
            false
        );
        
        this.elements.paymentText.textContent = '支付 1 Pi';
        
        let errorMessage = '支付失敗，請重試';
        
        if (error.message.includes('insufficient')) {
            errorMessage = 'Pi 餘額不足，請充值後重試';
        } else if (error.message.includes('network')) {
            errorMessage = '網絡連接問題，請檢查網絡後重試';
        }
        
        alert(errorMessage);
    }
    
    // 顯示成功通知
    showSuccessNotification() {
        this.elements.successNotification.classList.add('show');
        
        // 5秒後自動隱藏
        setTimeout(() => {
            this.elements.successNotification.classList.remove('show');
        }, 5000);
    }
    
    // 處理未完成的支付
    onIncompletePaymentFound(payment) {
        console.log('發現未完成的支付:', payment);
        
        if (payment.status.transaction_verified && !payment.status.developer_completed) {
            // 支付已在區塊鏈上確認，需要完成
            console.log('自動完成已驗證的支付');
            this.completePaymentOnServer(payment.identifier, payment.transaction.txid);
        } else if (payment.status.developer_approved && !payment.status.transaction_verified) {
            // 支付已批准但未提交到區塊鏈，詢問用戶是否繼續
            const shouldContinue = confirm('您有一筆未完成的支付，是否繼續完成？');
            if (shouldContinue) {
                // 這裡可以重新創建支付或繼續現有支付流程
                console.log('用戶選擇繼續支付');
            }
        }
    }
}

// 全局錯誤處理
window.addEventListener('error', (event) => {
    console.error('全局錯誤:', event.error);
});

// 未處理的 Promise 拒絕
window.addEventListener('unhandledrejection', (event) => {
    console.error('未處理的 Promise 拒絕:', event.reason);
});

// 頁面載入完成後啟動應用程序
document.addEventListener('DOMContentLoaded', () => {
    console.log('頁面載入完成，啟動 Pi 支援應用程序');
    new PiSupportApp();
});

// 導出到全局作用域（用於調試）
window.PiSupportApp = PiSupportApp;