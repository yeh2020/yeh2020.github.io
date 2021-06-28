$(document).ready(function() {
	$("#gototop").hide();
	$(window).scroll(function () {
		if ($(window).scrollTop() > 100) {
			$("#gototop").fadeIn(1500);
		}else {
			$("#gototop").fadeOut(1000);
		}
	});
	$("#gototop").click(function () {
		$('body,html').animate({ scrollTop: 0 }, 1000);
		return false;
	});
	$("#1page").hide();
	$("#1page").slideDown(2000);
	$("#2page").hide();
	$("#2page").fadeIn(5000);
	$("#more").click(function () {
		$('body,html').animate({ scrollTop: $("#phone1").offset().top }, 1000);
		return false;
	});
	$("#appload").click(function () {
		$('body,html').animate({ scrollTop: $("#downloadapp").offset().top }, 1000);
		return false;
	});
	$(".godownload").click(function () {
		$('body,html').animate({ scrollTop: $("#downloadapp").offset().top }, 1000);
		return false;
	});
	$(".gomoon").click(function () {
		$('body,html').animate({ scrollTop: $("#moon").offset().top }, 1000);
		return false;
	});
	$(".gounnamed").click(function () {
		$('body,html').animate({ scrollTop: $("#unnamed").offset().top }, 1000);
		return false;
	});
	
});

$('#more').hover(function(){
	$(this).stop().animate({opacity: '0.7',fontSize:'17px'},200);
	},function(){
		$(this).stop().animate({opacity: '1' ,fontSize: '16px'},200);
});
$('#appload').hover(function(){
	$(this).stop().animate({opacity: '0.7',fontSize:'17px'},200);
	},function(){
		$(this).stop().animate({opacity: '1' ,fontSize: '16px'},200);
});
$('#apple').hover(function(){
	$(this).stop().animate({opacity: '0.6'},200);
	},function(){
		$(this).stop().animate({opacity: '1'},200);
});
$('#google').hover(function(){
	$(this).stop().animate({opacity: '0.6'},200);
	},function(){
		$(this).stop().animate({opacity: '1'},200);
});
$('#apk').hover(function(){
	$(this).stop().animate({fontSize:'18px'},200);
	},function(){
		$(this).stop().animate({fontSize: '16px'},200);
});
$('#mooncoin').hover(function(){
	$(this).stop().animate({fontSize:'18px'},200);
	},function(){
		$(this).stop().animate({fontSize: '16px'},200);
});
$(window).scroll(function() {
	if($(window).width() < 768) {
		$(".hidecc a").click(function() {
			$(".hidecc").collapse('hide');
		});
		$(window).scroll(function() {
			$(".hidecc").collapse('hide');
		});
	}
});

// Pi Network API
const PiNetworkClient = window.PiNetwork;
const scopes = ['username', 'payments'];
async function init(){
	try {
		function onOpenPaymentFound(payment) {};
		Pi.authenticate(scopes, onOpenPaymentFound).then(function(auth){
			console.log('Hello ${auth.user.username}. Your unique ID is ${auth.user.pi_id}');
		}).catch(function(error) {
			console.error(error);
		});
	}
}
async function payment() {
	try {
		const payment = Pi.createPayment({
            amount: 3.14, // Amount of π to be paid
            reason: "Please pay for your order #1234", // User-facing explanation of the payment
            metadata: { orderId: 1234, itemIds: [11, 42, 314] }, // Developer-facing metadata
            }, 
            { // Read more about those callbacks in the details docs linked below.
            onPaymentIdReceived: onPaymentIdReceived,
            onTransactionSubmitted: onTransactionSubmitted,
            onPaymentCancelled: onPaymentCancelled,
            onPaymentError: onPaymentError,
		});
	}catch(err){
		alert(err);
	}
function onPaymentIdReceived(){}
function onTransactionSubmitted(){}
function onPaymentCancelled(){}
function onPaymentError(){}
}
