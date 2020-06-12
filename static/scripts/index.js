
$( document ).ready(function() {
   window.onscroll = function() {
	   	// show shadow when scrolled
		var doc = document.documentElement;
		var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
		if(top >= 90) {
			$(".navbar").css("box-shadow", "2px 4px 10px 2px rgb(211, 211, 211)");
		}
		else {
			$(".navbar").css("box-shadow", "none");
		}
	}
	$(".anchor-link").click(function (event){
		var that = $(this);
		$('html, body').animate({
			scrollTop: $(that.attr("scroll-to")).offset().top-window.innerHeight*0.17//0.65 for smaller screen
		}, 200);
	});
});
