/* MOVE TO DASHBOARD */

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

function search(){
	let name = document.getElementById('user-search').value;
	let nameBox = document.getElementById('name-preview');
	if (name == ""){
		nameBox.innerHTML = "";
		return;
	};

	fetch('/search', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({name: name})
	}).then(response => response.json()).then(data => {
		console.log(data)
		people = data.names;
		nameBox.innerHTML = "";
		for (let i of people){
			nameBox.innerHTML += `
				<p>${i}</p>
			`
		}
	
	});


}

// fetch('/get-info', {
// 	method: 'POST',
// 	headers: {
// 		'Content-Type': 'application/json'
// 	},
// 	body: JSON.stringify({parts: names})
// }).then(response => response.json()).then(data => {
// 	data = data.activities;
// 	console.log(data)
// 	for (let key of Object.keys(data)){
// 		inner = Object.keys(data[key]);
// 		console.log('inner', inner);
// 		for (let p of inner){
// 			let id = p;
// 			let val = data[key][p];
// 			if (document.getElementById(p + '_slider')){
// 				document.getElementById(p + '_slider').value = val;
// 			}
// 			if (document.getElementById(p + 'val')){
// 				document.getElementById(p + 'val').innerHTML = val;
// 			}
// 		}
// 	}
// });