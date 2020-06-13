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

// Update the current slider value (each time you drag the slider handle)

var flight_val_slider = document.getElementById("num_times_flown_slider");
var flight_val = document.getElementById("num_flown_val");
flight_val_slider.oninput = function() {
  flight_val.innerHTML = this.value;
}

var flight_time_slider = document.getElementById("flight_time_slider");
var flight_time = document.getElementById("flight_time_val");
flight_time_slider.oninput = function() {
  flight_time.innerHTML = this.value;
}

var mpg_slider = document.getElementById("mpg_slider");
var mpg = document.getElementById("mpg_val");
mpg_slider.oninput = function() {
  mpg.innerHTML = this.value;
}

var miles_slider = document.getElementById("miles_slider");
var miles = document.getElementById("miles_val");
miles_slider.oninput = function() {
  miles.innerHTML = this.value;
}