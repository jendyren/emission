$( document ).ready(function() {
	new Chart(document.getElementById("line-chart"), {
		type: 'line',
		labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
		data: {
		datasets: [{
			data: [0,3,10,6,10,3],
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
});

var currentDate = new Date();
var hour = currentDate.getHours();

if (hour < 12){
  document.getElementById("time_of_day").innerHTML = "Good Morning!"
}
else if ((hour >= 12) && (hour < 18)){
  document.getElementById("time_of_day").innerHTML = "Good Afternoon!"
}
else {
  document.getElementById("time_of_day").innerHTML = "Good Evening!"
}