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

document.getElementById("num_times_flown_slider").oninput = function() {
  document.getElementById("num_flown_val").innerHTML = this.value;
}

document.getElementById("flight_time_slider").oninput = function() {
  document.getElementById("flight_time_val").innerHTML = this.value;
}

document.getElementById("mpg_slider").oninput = function() {
  document.getElementById("mpg_val").innerHTML = this.value;
}

document.getElementById("miles_slider").oninput = function() {
  document.getElementById("miles_val").innerHTML = this.value;
}

document.getElementById("m_bfast_slider").oninput = function() {
  document.getElementById("m_bfast_val").innerHTML = this.value;
}

document.getElementById("g_bfast_slider").oninput = function() {
  document.getElementById("g_bfast_val").innerHTML = this.value;
}

document.getElementById("d_bfast_slider").oninput = function() {
  document.getElementById("d_bfast_val").innerHTML = this.value;
}

document.getElementById("f_bfast_slider").oninput = function() {
  document.getElementById("f_bfast_val").innerHTML = this.value;
}

document.getElementById("m_lunch_slider").oninput = function() {
  document.getElementById("m_lunch_val").innerHTML = this.value;
}

document.getElementById("g_lunch_slider").oninput = function() {
  document.getElementById("g_lunch_val").innerHTML = this.value;
}

document.getElementById("d_lunch_slider").oninput = function() {
  document.getElementById("d_lunch_val").innerHTML = this.value;
}

document.getElementById("f_lunch_slider").oninput = function() {
  document.getElementById("f_lunch_val").innerHTML = this.value;
}

document.getElementById("m_dinner_slider").oninput = function() {
  document.getElementById("m_dinner_val").innerHTML = this.value;
}

document.getElementById("g_dinner_slider").oninput = function() {
  document.getElementById("g_dinner_val").innerHTML = this.value;
}

document.getElementById("d_dinner_slider").oninput = function() {
  document.getElementById("d_dinner_val").innerHTML = this.value;
}

document.getElementById("f_dinner_slider").oninput = function() {
  document.getElementById("f_dinner_val").innerHTML = this.value;
}

document.getElementById("m_snack_slider").oninput = function() {
  document.getElementById("m_snack_val").innerHTML = this.value;
}

document.getElementById("g_snack_slider").oninput = function() {
  document.getElementById("g_snack_val").innerHTML = this.value;
}

document.getElementById("d_snack_slider").oninput = function() {
  document.getElementById("d_snack_val").innerHTML = this.value;
}

document.getElementById("f_snack_slider").oninput = function() {
  document.getElementById("f_snack_val").innerHTML = this.value;
}