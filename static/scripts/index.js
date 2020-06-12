
function runOnScroll() {
    if (document.body.scrollTop >= 200) {
		$(".navbar").css("box-shadow", "0px 0px 21px 0px rgba(0,0,0,0.45)");
	}
 }; 
window.addEventListener("scroll", runOnScroll);