$( document ).ready(function() {
   window.onscroll = function() {
	   	// show shadow when scrolled
		var doc = document.documentElement;
		var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
		if(top >= 10) {
			$(".navbar").css("box-shadow", "2px 4px 10px 2px rgba(0, 0, 0, 0.1)");
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
names.push("activities.recycling.paper_yes_no");
names.push("activities.recycling.water_yes_no");
// Get score history as well for chart
names.push("scores.sustainability_score");

var transit_co2 = 0;
var energy_co2 = 0;
var diet_co2 = 0;
var water_co2 = 0;
var wardrobe_co2 = 0;
var recycling_co2 = 0;
var score_names = {};
var data = {};
var data_backup = {};

fetch('/get-info', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({parts: names})
}).then(response => response.json()).then(data => {
	data_backup = data;
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
	
	var current_date = new Date();
	var date_formatted = "d" + current_date.getFullYear() + "_" + (current_date.getMonth()+1) + "_" + current_date.getDate();
  
	var sustainability_score = calculate_transit_co2(data.transit, data.dayTransit, date_formatted) + calculate_energy_co2(data.energy, date_formatted) + calculate_diet_co2(data.diet, date_formatted) + calculate_water_co2(data.water, date_formatted) + calculate_wardrobe_co2(data.wardrobe, date_formatted) - calculate_recycling_co2(data.recycling, date_formatted);

  console.log(calculate_transit_co2(data.transit, data.dayTransit, date_formatted));

  console.log(sustainability_score);

	/*save score here*/
	score_names = {
		"sustainability_score": isNaN(sustainability_score) ? 0 : Math.round(sustainability_score),
		"transit_co2": transit_co2,
		"energy_co2": energy_co2,
		"diet_co2": diet_co2,
		"water_co2": water_co2,
		"wardrobe_co2": wardrobe_co2,
		"recycling_co2": recycling_co2
	}
	scores = {}
	for (let key of Object.keys(score_names)) {
		scores["scores." + key + "." + date_formatted] = score_names[key]
	}
	scores["score"] = score_names.sustainability_score;

	fetch('/save-scores', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(scores)
	});
	if ($("#line-chart")) {
		let score_list = data_backup.scores.sustainability_score;
		new Chart(document.getElementById("line-chart"), {
			type: 'line',
			labels: Object.keys(score_list),
			data: {
			datasets: [{
				data: Object.values(score_list),
				label: "Dates",
				borderColor: "#3e95cd",
				fill: false
				}
			]
			},
			options: {
				title: {
					display: true,
					text: 'Your Sustainability Score Over Time'
				}
			}
		}); //End chart
	}

	$("#sustainability-score").text(score_names.sustainability_score);
});

function calculate_transit_co2(transit, dayTransit, date){
  try {
	if (transit.mpg[date] != 0){
    	var driving_co2 = dayTransit.mileDrive[date] / transit.mpg[date] * 1940 / 95 * .00001;
	}
	var flying_co2 = transit.flight_time[date] * transit.num_flown[date] * 292353 *.00001;

	transit_co2 = driving_co2 + flying_co2;
	document.getElementById("transit_score").innerHTML = get_score(transit_co2 , 0.10);
  //console.log(transit_co2);

	return (transit_co2)
  }
  catch(e) {
	  console.log(e);
	  console.log("Incomplete transit data");
  }
}

function calculate_energy_co2(energy, date){
	try {
		var daily_energy_to_co2 = (energy.call_dur[date] * .0235) + (energy.txt_dur[date] * .00057) + (energy.vid_dur[date] * .0006 * .2) + (energy.searches[date] * .000036) + (energy.email_sent[date] * .00004)
		var gen_energy_to_co2 = energy.kw[date] * 12 * 0.2505 * .00001;
    

		energy_co2 = daily_energy_to_co2 * 365 + gen_energy_to_co2;

		document.getElementById("energy_score").innerHTML = get_score(energy_co2 , 0.27);
    console.log("ENERGY");
    console.log(daily_energy_to_co2*.365);
    
		return (energy_co2)
	} catch(e) {
		console.log(e);
	 	console.log("Incomplete energy data");
	}
}

function calculate_diet_co2(diet, date){
  try {
  
		var meat = diet.m[date] * 3 / 475;
		var grain = diet.g[date] * 2 / 586;
		var dairy = diet.d[date] / 251;
		var fruit = diet.f[date] / 237;
		
		//475 calories daily of meat/fish/eggs is equal to 3 tons of CO2 annually 
		//586 calories daily of grains/baked goods is equal to  1 ton of CO2 annually
		//251 calories daily of dairy is equal to 1 ton of CO2 annually
		//237 calories daily of fruit/vegetables is equal to 1 ton of CO2 annually
		
		diet_co2 = meat + grain + dairy + fruit;
		document.getElementById("diet_score").innerHTML = get_score(diet_co2, 0.27);

    //console.log(diet_co2);

		return (diet_co2)
	} catch(e) {
		console.log(e);
	 	console.log("Incomplete diet data");
	}
}

function calculate_water_co2(water, date){
	try {
  //console.log(water);
		let gallons_used = (water.num_baths[date] * 36) + (water.shower_len[date] * 2.1) + (water.dishwasher_loads[date] * 10) + (water.hand_wash_dish[date] * 27) + (water.laundry[date] * 40) + (water.toilet[date] * 3);

		water_co2 = gallons_used / 244956;
		document.getElementById("water_score").innerHTML = get_score(water_co2 , 0.035);
		//console.log(water_co2);

    return (water_co2)
	} catch(e) {
		console.log(e);
	 	console.log("Incomplete water data");
	}
}

function calculate_wardrobe_co2(wardrobe, date){
	try {
		//Need to multiply by number of times they buy, if only shops second-hand, multiply by .35
		let total_in_kg = (wardrobe.jacket[date] * 18) + (wardrobe.pants[date] * 34) + (wardrobe.shirts[date] * 15) + (wardrobe.underwear[date] * 2) + (wardrobe.shoes[date] * 14) + (wardrobe.mach_dryer[date] * 0.55 * 52) + (wardrobe.iron[date] * 0.38 * 52);
		
    wardrobe_co2 = total_in_kg * .001

		document.getElementById("wardrobe_score").innerHTML = get_score(wardrobe_co2, 0.02);
    //console.log(wardrobe_co2);
		return (wardrobe_co2)
	} catch(e) {
		console.log(e);
	 	console.log("Incomplete wardrobe data");
	}
}

function calculate_recycling_co2(recycling, date){
	try {
    //In tons
		recycling_co2 = (recycling.paper_yes_no[date] * .924) + (recycling.plastic_yes_no[date] * .14) + (recycling.water_yes_no[date] * .12) + (recycling.cans_yes_no[date] * 3.336)
		
    //Yes is 1, no is 0
		document.getElementById("recycling_score").innerHTML = get_recycling_score(recycling_co2, 0.03);
    //console.log(recycling_co2);
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
  else if (total/percentage <= (2 * .735)){
    return "A";
  }
  else if ((total/percentage > (2 * .735)) && (total/percentage <= (6 * .735))){
    return "B";
  }
  else if ((total/percentage > (6 * .735)) && (total/percentage <= (10 * .735))){
    return "C";
  }
  else if ((total/percentage > (10 * .735)) && (total/percentage <= (14 * .735))){
    return "D";
  }
  else if (total/percentage > (14 * .735)){
    return "F";
  }
}

function get_recycling_score(total, percentage){
  if ((total == undefined) || (Number.isNaN(total))){
    return "Finish filling out the survey to see!"
  }
  
  else if (total/percentage > 4 * .735){
    return "A";
  }
  else if ((total/percentage <= 4 * .735) &&  (total/percentage > 2 * .735)){
    return "B";
  }
  else if ((total/percentage <= 2 * .735) &&  (total/percentage > .2 * .735)){
    return "C";
  }
  else if ((total/percentage <= .2 * .735) &&  (total/percentage > 0)){
    return "D";
  }
  else{
    return "F";
  }
}


async function getCalories(food){
	let response = await fetch('/foodCalorie', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({food: food})
	});
	let json = await response.json();
	console.log('json', json);
	document.getElementById('calories').innerHTML = json.answer
}