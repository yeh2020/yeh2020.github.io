// Pi Network API

const scopes = ['username', 'payments'];
var user,amount;
async function init(){
	try {
		function onOpenPaymentFound(payment) {};
		Pi.authenticate(scopes, onOpenPaymentFound).then(function(auth){
			console.log(`Hello ${auth.user.username}`);
			user = auth.user.username;
			const showuser = document.querySelector('.showuser');
			showuser.innerHTML = auth.user.username;
		})
	} catch (err) {
		alert(err);
	}
}

function payment() {
	try {
			const payment = Pi.createPayment({
				amount: 3.14,
				memo: "3.14 test-pi for Donate",
				metadata: { orderId: 1234, itemIds: [11, 42, 314] },
            }, 
            {
				onReadyForServerApproval: onPaymentIdReceived,
				onReadyForServerCompletion: onTransactionSubmitted,
				onCancel: onPaymentCancelled,
				onError: onPaymentError,
            });
	}catch(err){
		alert(err);
	}
}

function onPaymentIdReceived(paymentId){
	$.ajax({
		type: 'POST',
        url: 'paymentId.txt',
        dataType: 'json',
        data: {t1:user,t2:paymentId}
	});
}

function onTransactionSubmitted(pid,txid){   
	$.ajax({
        type: 'POST',
        url: 'txid.txt',
        dataType: 'json',
        data: {user:user,pid:pid,txid:txid}
	});   
}

function onPaymentCancelled(){}
function onPaymentError(){}
