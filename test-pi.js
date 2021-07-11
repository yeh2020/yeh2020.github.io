// Pi Network API

const scopes = ['username', 'payments'];
const Base = 'https://api.minepi.com/v2'
var user,amount;
async function init(){
	try {
		function onOpenPaymentFound(payment) {};
		Pi.authenticate(scopes, onOpenPaymentFound).then(function(auth){
			console.log(`Hello ${auth.user.username}`);
			user = auth.user.username;
			const SU = document.getElementById('showuser');
			SU.innerHTML = auth.user.username;
		})
	} catch (err) {
		alert(err);
	}
}

function payment() {
	try {
			const payment = Pi.createPayment({
				amount: 0.01,
				memo: "0.01 test-pi for Donate",
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
	if (status.developer_approved) {
		ServerApproval();
		$.ajax({
			type: 'POST',
			url: 'paymentId.txt',
			dataType: 'json',
			data: {t1:user,t2:paymentId}
			github_token: ${{ secrets.PI_SERVER_API_KEY }},
		});
	}else {init()}
}

function onTransactionSubmitted(pid,txid){
	if (transaction !== null) {
		ServerComplet();
		$.ajax({
			type: 'POST',
			url: 'txid.txt',
			dataType: 'json',
			data: {user:user,pid:pid,txid:txid}
			github_token: ${{ secrets.PI_SERVER_API_KEY }},
		}); 
	}else {init()}
}

function onPaymentCancelled(){}
function onPaymentError(){}


// server

function ServerApproval(){
	$.ajax({
		type: 'post',		
        url: base+'/payments/' + {paymentID} + '/approv',
		Authorization: ${{ secrets.PI_API_KEY }},
		dataType: 'json',
		user_uid:,
		amount: 0.01,
		memo: 'you will pay pi coin', 
		to_address:'GCG3PKMJ6GZAYNB33ZLSCD2OROSMFROE4TFRZGA2R7GBYN7DJQ4H3GT3',//federal boat
		created_at:,
		status: {developer_approved: true},
	});
}

function ServerComplet(){
	$.ajax({
		type: 'post',		
        url: base+'/payments/'+{paymentID}+'/complete',
		Authorization: ${{ secrets.PI_API_KEY }},
		dataType: 'json',
		user_uid:,
		memo: 'Payment successful', 
		created_at:,
		status: {developer_complete: true},
	});
}
