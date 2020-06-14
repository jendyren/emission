
$( document ).ready(function() {
   window.onscroll = function() {
	   	// show shadow when scrolled
		var doc = document.documentElement;
		var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
		if(top >= 10) {
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
  calculate_diet_co2(data.diet);
  calculate_water_co2(data.water);
  calculate_wardrobe_co2(data.wardrobe);
  calculate_recycling_co2(data.recycling)
});

function calculate_transit_co2(transit, dayTransit){
  if (transit.mpg != 0){
    var driving_co2 = dayTransit.mileDrive / transit.mpg * 1940 / 95;
  }
  var flying_co2 = transit.flight_time * transit.num_flown * 292353 * .0022;  

  let total = driving_co2 + flying_co2;
  document.getElementById("transit_score").innerHTML = get_score(total, .10)
}

function calculate_energy_co2(energy){
  var daily_energy_to_co2 = ((energy.call_dur * 23.5) + (energy.txt_dur * .057) + (energy.vid_dur * .06 * .2) + (energy.searches * .0036) + (energy.email_sent * .004)) * .001;
  var gen_energy_to_co2 = energy.kw * 16.44;

  let total = daily_energy_to_co2 * 365 + gen_energy_to_co2;

  document.getElementById("energy_score").innerHTML = get_score(total , 0.27);
}

function calculate_diet_co2(diet){
  var meat = diet.m * 3 / 475;
  var grain = diet.g * 2 / 586;
  var dairy = diet.d / 251;
  var fruit = diet.f / 237;
  var out = diet.out * 4416 / .0022;
  
  //475 calories daily of meat/fish/eggs is equal to 3 tons of CO2 annually 
  //586 calories daily of grains/baked goods is equal to  1 ton of CO2 annually
  //251 calories daily of dairy is equal to 1 ton of CO2 annually
  //237 calories daily of fruit/vegetables is equal to 1 ton of CO2 annually
  
  let total = meat + grain + dairy + fruit + out;
 
  document.getElementById("diet_score").innerHTML = get_score(total, 0.27);
}

function calculate_water_co2(water){
  //console.log(water);
  let gallons_used = (water.num_baths * 36) + (water.shower_len * 2.1) + (water.dishwasher_loads * 10) + (water.hand_wash_dish * 27) + (water.laundry * 40) + (water.toilet * 3);

  let total = gallons_used / 244956;
  document.getElementById("water_score").innerHTML = get_score(total , 0.035);
}

function calculate_wardrobe_co2(wardrobe){
  //Need to multiply by number of times they buy, if only shops second-hand, multiply by .35
  let total_in_kg = (wardrobe.jacket * 18) + (wardrobe.pants * 34) + (wardrobe.shirts * 15) + (wardrobe.underwear * 2) + (wardrobe.shoes * 14) + (wardrobe.mach_dryer * 0.55 * 52) + (wardrobe.iron * 0.38 * 52);
  let total = total_in_kg * .001

  document.getElementById("wardrobe_score").innerHTML = get_score(total, 0.02);
}

function calculate_recycling_co2(recycling){
  let total;

  document.getElementById("recycling_score").innerHTML = get_recycling_score(total, 0.03);

}


function get_score(total, percentage){
  if ((total == undefined) || (Number.isNaN(total))){
    return "Finish filling out the survey to see!"
  }
  
  else if (total/percentage <= 2 * .735){
    return "A";
  }
  else if ((total/percentage > 2 * .735) &&  (total/percentage <= 6 * .735)){
    return "B";
  }
  else if ((total/percentage > 6 * .735) &&  (total/percentage <= 10 * .735)){
    return "C";
  }
  else if ((total/percentage > 10 * .735) &&  (total/percentage <= 14 * .735)){
    return "D";
  }
  else if (total/percentage > 14 * .735){
    return "F";
  }
}

function get_recycling_score(total, percentage){
  if ((total == undefined) || (Number.isNaN(total))){
    return "Finish filling out the survey to see!"
  }
  
  else if (total/percentage > 14 * .735){
    return "A";
  }
  else if ((total/percentage <= 14 * .735) &&  (total/percentage > 10 * .735)){
    return "B";
  }
  else if ((total/percentage <= 10 * .735) &&  (total/percentage > 6 * .735)){
    return "C";
  }
  else if ((total/percentage <= 6 * .735) &&  (total/percentage > 2 * .735)){
    return "D";
  }
  else if (total/percentage < 2 * .735){
    return "F";
  }
}