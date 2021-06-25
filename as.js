$(document).ready(function() {
  
    if(document.documentElement.scrollHeight <= document.documentElement.clientHeight) {
      bodyTag = document.getElementsByTagName('body')[0];
      bodyTag.style.height = document.documentElement.clientWidth / screen.width * screen.height + 'px';
    }
    setTimeout(function() {
      window.scrollTo(0, 1)
      }, 0);
    
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
