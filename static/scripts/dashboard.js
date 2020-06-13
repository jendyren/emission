$( document ).ready(function() {
	new Chart(document.getElementById("line-chart"), {
		type: 'line',
		data: {
		datasets: [{
			data: [0,3,2,5,2,2,45,23,5,3,6,23,512,35,35,4,,346,3],
			label: "Some label",
			borderColor: "#3e95cd",
			fill: false
			}
		]
		},
		options: {
		title: {
			display: true,
			text: 'Some title'
		}
		}
	}); //End chart
};