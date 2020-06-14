console.log(transit_co2);
console.log(energy_co2);
console.log(diet_co2);
console.log(water_co2);
console.log(wardrobe_co2);
console.log(recycling_co2);

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