
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
		console.log(data);
		people = data.names;
		nameBox.innerHTML = "";
		for (let i of people){
			nameBox.innerHTML += `
				<p onclick="befriend('${i}')">${i}</p>
			`
		}
	});
}

function befriend(name){
	let nameBox = document.getElementById('name-preview');
	nameBox.innerHTML = "";
	console.log("befriending", name);
	fetch('/befriend', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({name: name})
	});
}

document.getElementById("cold_showers_badge").style.opacity = "0.3";
document.getElementById("vegan_badge").style.opacity = "0.3";
document.getElementById("walk_badge").style.opacity = "0.3";
document.getElementById("no_fly_badge").style.opacity = "0.3";
document.getElementById("eat_out_badge").style.opacity = "0.3";
document.getElementById("second_hand_badge").style.opacity = "0.3";


fetch('/get-info', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({parts: []})
}).then(response => response.json()).then(data => {
	var current_date = new Date();
	var date_formatted = "d" + current_date.getFullYear() + "_" + (current_date.getMonth()+1) + "_" + current_date.getDate();

	let activities = data.activities;
	let scores = data.scores;
	console.log(activities);
	
  if (activities.transit.num_flown[date_formatted] == 0){
    document.getElementById("no_fly_badge").style.opacity = "1";
  }
  if (activities.diet.out[date_formatted] == 0){
    document.getElementById("eat_out_badge").style.opacity = "1";
  }

});
