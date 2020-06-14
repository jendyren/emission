
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
	var year = d.getFullYear();
	var dateStr = year + "/" + month + "/" + day;
	$("<input />").attr("type", "hidden")
			.attr("name", "date")
			.attr("value", dateStr)
			.appendTo("form");
	console.log(this);
	document.getElementsByClassName('modal')[0].click();
	return true;
});

fetch('/search', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({name: "tomato"})
}).then(response => response.json()).then(data => {
	// data = data.activities;
	console.log(data);
});