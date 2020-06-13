var currently_visible = "overall";

function toggle_leaderboards(id){
  var current_leaderboard = document.getElementById("overall");
  var new_leaderboard = document.getElementById(id);
  
  if (current_leaderboard){
    console.log(currently_visible)
    current_leaderboard.style.display = "none";
  }

  new_leaderboard.style.display = 'block';
  currently_visible = id;
}

/*fetch('/get-leader', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
}).then(response => response.json()).then(data => {
	console.log(data);
});
*/