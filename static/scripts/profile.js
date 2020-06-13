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
		console.log(label);
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
	console.log(data)
	for (let key of Object.keys(data)){
		inner = Object.keys(data[key]);
		console.log('inner', inner);
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
});