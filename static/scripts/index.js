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
// Since recycling is not a slider
names.push("activities.recycling.plastic_yes_no");
names.push("activities.recycling.cans_yes_no");
names.push("activities.recycling.clothing_yes_no");
names.push("activities.recycling.paper_yes_no");
names.push("activities.recycling.water_yes_no");


fetch('/get-info', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({parts: names})
}).then(response => response.json()).then(data => {
	data = data.activities;
	for (let key of Object.keys(data)){
		inner = Object.keys(data[key]);
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
  console.log(data);
  
  var current_date = new Date();
  var date_formatted = "d" + current_date.getFullYear() + "_" + (current_date.getMonth()+1) + "_" + current_date.getDate();
  
	var sustainability_score = calculate_transit_co2(data.transit, data.dayTransit, date_formatted) + calculate_energy_co2(data.energy, date_formatted) + calculate_diet_co2(data.diet, date_formatted) + calculate_water_co2(data.water, date_formatted) + calculate_wardrobe_co2(data.wardrobe, date_formatted) - calculate_recycling_co2(data.recycling, date_formatted);

});

var transit_co2;
function calculate_transit_co2(transit, dayTransit, date){
  //This is like the worst thing I can do
  try {
	if (transit.mpg[date] != 0){
    	var driving_co2 = dayTransit.mileDrive[date] / transit.mpg[date] * 1940 / 95;
	}
	var flying_co2 = transit.flight_time[date] * transit.num_flown[date] * 292353 * .0022;  

	transit_co2 = driving_co2 + flying_co2;
	document.getElementById("transit_score").innerHTML = get_score(transit_co2 , 0.10);

	return (transit_co2)
  }
  catch(e) {
	  console.log(e);
	  console.log("Incomplete transit data");
  }
}

var energy_co2;
function calculate_energy_co2(energy, date){
	try {
		var daily_energy_to_co2 = ((energy.call_dur[date] * 23.5) + (energy.txt_dur[date] * .057) + (energy.vid_dur[date] * .06 * .2) + (energy.searches[date] * .0036) + (energy.email_sent[date] * .004)) * .001;
		var gen_energy_to_co2 = energy.kw[date] * 16.44;

		energy_co2 = daily_energy_to_co2 * 365 + gen_energy_to_co2;

		document.getElementById("energy_score").innerHTML = get_score(energy_co2 , 0.27);
		return (energy_co2)
	} catch(e) {
		console.log(e);
	 	console.log("Incomplete energy data");
	}
}

var diet_co2;
function calculate_diet_co2(diet, date){
  try {
  
		var meat = diet.m[date] * 3 / 475;
		var grain = diet.g[date] * 2 / 586;
		var dairy = diet.d[date] / 251;
		var fruit = diet.f[date] / 237;
		var out = diet.out[date] * 4416 / .0022;
		
		//475 calories daily of meat/fish/eggs is equal to 3 tons of CO2 annually 
		//586 calories daily of grains/baked goods is equal to  1 ton of CO2 annually
		//251 calories daily of dairy is equal to 1 ton of CO2 annually
		//237 calories daily of fruit/vegetables is equal to 1 ton of CO2 annually
		
		diet_co2 = meat + grain + dairy + fruit + out;
		
		document.getElementById("diet_score").innerHTML = get_score(diet_co2, 0.27);
		return (diet_co2)
	} catch(e) {
		console.log(e);
	 	console.log("Incomplete diet data");
	}
}

var water_co2;
function calculate_water_co2(water, date){
	try {
  //console.log(water);
		let gallons_used = (water.num_baths[date] * 36) + (water.shower_len[date] * 2.1) + (water.dishwasher_loads[date] * 10) + (water.hand_wash_dish[date] * 27) + (water.laundry[date] * 40) + (water.toilet[date] * 3);

		water_co2 = gallons_used / 244956;
		document.getElementById("water_score").innerHTML = get_score(water_co2 , 0.035);
		return (water_co2)
	} catch(e) {
		console.log(e);
	 	console.log("Incomplete water data");
	}
}

var wardrobe_co2;
function calculate_wardrobe_co2(wardrobe, date){
	try {
		//Need to multiply by number of times they buy, if only shops second-hand, multiply by .35
		let total_in_kg = (wardrobe.jacket[date] * 18) + (wardrobe.pants[date] * 34) + (wardrobe.shirts[date] * 15) + (wardrobe.underwear[date] * 2) + (wardrobe.shoes[date] * 14) + (wardrobe.mach_dryer[date] * 0.55 * 52) + (wardrobe.iron[date] * 0.38 * 52);
		
    wardrobe_co2 = total_in_kg * .001

		document.getElementById("wardrobe_score").innerHTML = get_score(wardrobe_co2, 0.02);
		return (wardrobe_co2)
	} catch(e) {
		console.log(e);
	 	console.log("Incomplete wardrobe data");
	}
}
var recycling_co2;
function calculate_recycling_co2(recycling, date){
	/*just do like recycling.recycling-plastic_yes_no

  recycling right now is undefined
  oh wait what wait it has a value for me
  maybe refresh?
  
	recycling-plastic_yes_no
	recycling-cans_yes_no
	recycling-clothing_yes_no
	recycling-paper_yes_no
	recycling-water_yes_no
	*/
  console.log(recycling);
	try {
		let recycling_co2;
		
    // yes is 1, no is 0
		document.getElementById("recycling_score").innerHTML = get_recycling_score(recycling_co2, 0.03);
		
    return (recycling_co2)
	} catch(e) {
		console.log(e);
	 	console.log("Incomplete recycling data");
	}
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
  
  else if (total/percentage > 1 * .735){
    return "A";
  }
  else if ((total/percentage <= 1 * .735) &&  (total/percentage > .6 * .735)){
    return "B";
  }
  else if ((total/percentage <= .6 * .735) &&  (total/percentage > .2 * .735)){
    return "C";
  }
  else if ((total/percentage <= .2 * .735) &&  (total/percentage > 0)){
    return "D";
  }
  else{
    return "F";
  }
}