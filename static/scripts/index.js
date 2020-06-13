
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
  calculate_diet_co2(data.diet);
  calculate_water_co2();
});

function calculate_transit_co2(transit, dayTransit){
  if (transit.mpg != 0){
    let driving_co2 = dayTransit.mileDrive / transit.mpg * 1940 / 95;
  }
  let flying_co2 = transit.flight_time * transit.num_flown * 292353 * .0022;  
}

function calculate_energy_co2(energy){
  let daily_energy_to_co2 = ((energy.call_dur * 23.5) + (energy.txt_dur * .057) + (energy.vid_dur * .06 * .2) + (energy.searches * .0036) + (energy.email_sent * .004)) * .001;
  let gen_energy_to_co2 = energy.kw * 16.44;
}

function calculate_diet_co2(diet){
  var meat = 0;
  var grain = 0;
  var dairy = 0;
  var fruit = 0;

  for (element in diet){
    if (element.includes("m_")){
      meat += (diet[element] * 3 / 475);
    }
    else if (element.includes("g_")){
      grain += (diet[element] / 586);
    }
    else if (element.includes("d_")){
      dairy += (diet[element] / 251);
    }
    else if (element.includes("f_")){
      fruit += (diet[element] / 237);
    }
  }
  
  var total = (meat + grain + dairy + fruit);
  console.log(total)
  //475 calories daily of meat/fish/eggs is equal to 3 tons of CO2 annually 
  //586 calories daily of grains/baked goods is equal to  1 ton of CO2 annually
  //251 calories daily of dairy is equal to 1 ton of CO2 annually
  //237 calories daily of fruit/vegetables is equal to 1 ton of CO2 annually
  
  
  document.getElementById("diet_score").innerHTML = get_score(total, 0.28);
}

function calculate_water_co2(water){

}

function get_score(total, percentage){
  if (total/percentage <= 2){
    return "A";
  }
  else if ((total/percentage > 2) &&  (total/percentage <= 6)){
    return "B";
  }
  else if ((total/percentage > 6) &&  (total/percentage <= 10)){
    return "C";
  }
  else if ((total/percentage > 10) &&  (total/percentage <= 14)){
    return "D";
  }
  else if (total/percentage > 14){
    return "F";
  }
}