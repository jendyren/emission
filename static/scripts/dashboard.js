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
  document.getElementById("time_of_day").innerHTML = "Good morning"
}
else if ((hour >= 12) && (hour < 18)){
  document.getElementById("time_of_day").innerHTML = "Good afternoon"
}
else {
  document.getElementById("time_of_day").innerHTML = "Good evening"
}

$("form").submit( function(eventObj) {
	var d = new Date();
	var day = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear(); // it works!
	var dateStr = year + "/" + month + "/" + day;
	$("<input />").attr("type", "hidden")
			.attr("name", "date")
			.attr("value", dateStr)
			.appendTo("form");
	console.log(this);
	document.getElementsByClassName('modal')[0].click();
	return true;
});