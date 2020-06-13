var currently_visible = "";

function toggle_leaderboards(){
  var overall_leaderboard = document.getElementById("overall");
  var friends_leaderboard = document.getElementById("just_friends");
  if (currently_visible == ""){
    overall_leaderboard.style.display = "block";
    currently_visible = "overall";
  }
  else if (currently_visible == "overall"){
    overall_leaderboard.style.display = "none";
    friends_leaderboard.style.display = "block";
    currently_visible = "just_friends";
  }
  else if (currently_visible == "just_friends"){
    overall_leaderboard.style.display = "block";
    friends_leaderboard.style.display = "none";
    currently_visible = "overall";
  }
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