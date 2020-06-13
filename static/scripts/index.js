
$( document ).ready(function() {
   window.onscroll = function() {
	   	// show shadow when scrolled
		var doc = document.documentElement;
		var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
		if(top >= 50) {
			$(".navbar").css("box-shadow", "2px 4px 10px 2px rgb(211, 211, 211)");
		}
		else {
			$(".navbar").css("box-shadow", "none");
		}
	}
	$(".anchor-link").click(function (event){
		var that = $(this);
		console.log("Click");
		$('html, body').animate({
			scrollTop: $(that.attr("scroll-to")).offset().top-window.innerHeight*0.17//0.65 for smaller screen
		}, 200);
	});
});

// Alerts are destroyed after 3 seconds
setTimeout(function() {
    $('.alert').fadeOut("slow", function() {this.remove();});
  }, 3000);

function openModal(){
  document.getElementById("quiz_modal").style.display = "block";
}

function closeModal(){
  document.getElementById("quiz_modal").style.display = "none";
}

function flipDescription(){ 
	let select = document.getElementById('select_type');
	document.getElementById('general-transit-survey').classList.add('hide');
	document.getElementById('daily-transit-survey').classList.add('hide');
	document.getElementById('diet-survey').classList.add('hide');
  document.getElementById('energy-survey').classList.add('hide');
  document.getElementById('wardrobe-survey').classList.add('hide');
  document.getElementById('recycling-survey').classList.add('hide');
  document.getElementById('water-survey').classList.add('hide');
	document.getElementById(select.value + '-survey').classList.remove('hide');
}

var names = [];
var sliders = document.getElementsByClassName('slider');
for (let el of sliders){
	let id = el.id;
	let label = id.replace('_slider', "_val");
	names.push('activities.' + el.name.replace('-', '.'));
	el.oninput = function(){
		//console.log(label);
		document.getElementById(label).innerHTML = this.value;	
	}
}

fetch('/get-info', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({parts: names})
}).then(response => response.json()).then(data => {
	data = data.activities;
	//console.log(data)
	for (let key of Object.keys(data)){
		inner = Object.keys(data[key]);
		//console.log('inner', inner);
		for (let p of inner){
			let id = p;
			let val = data[key][p];
			if (document.getElementById(p + '_slider')){
				document.getElementById(p + '_slider').value = val;
			}
			if (document.getElementById(p + 'val')){
				document.getElementById(p + 'val').innerHTML = val;
			}
		}
	}
  
  calculate_transit_co2(data.transit, data.dayTransit);
  calculate_energy_co2(data.energy);
});

function calculate_transit_co2(overall_transit, day_transit){
  if (overall_transit.mpg != 0){
    let driving_co2 = day_transit.mileDrive / overall_transit.mpg * 1940 / 95;
  }
  

}


function calculate_energy_co2(energy){
  let daily_energy_to_co2 = ((energy.call_dur * 23.5) + (energy.txt_dur * .057) + (energy.vid_dur * .06 * .2) + (energy.searches * .0036) + (energy.email_sent * .004)) * .001;
  let gen_energy_to_co2;
}

