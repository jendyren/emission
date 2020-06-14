var currently_visible = "";
var globalTable = document.getElementById('global')
var aroundTable = document.getElementById('around')
var friendTable = document.getElementById('friends')

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

fetch('/get-leader', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	}
}).then(response => response.json()).then(data => {
	
	let global = data.global;
	let around = data.around;
	let friend = data.friends;
	globalTable.innerHTML = ""; aroundTable.innerHTML = ""; friendTable.innerHTML = "";
	for (let i = 0; i < global.length; i++){
		makeSpot(global[i], globalTable);
	}
	for (let i = 0; i < around.length; i++){
		makeSpot(around[i], aroundTable);
	}
	for (let i = 0; i < friend.length; i++){
		makeSpot(friend[i], friendTable);
	}
});

function makeSpot(participant, table){
	let styling = "";
	let nameStyle = 'you' in participant ? "style='font-weight: bold'" : ""
	
	switch (participant.place) {
		case 0: styling = `style='background-color: gold'`;break;
		case 1: styling = `style='background-color: silver'`;break;
		case 2: styling = `style='background-color: #cd8c32'`; break;
		default: styling = `style='background-color: transparant'`;
	}
	let html = `
	<tr>
		<td ${styling}><h2>${participant.place+1}</h2></td>
		<td><p ${nameStyle}>${participant.username}: ${participant.score}</p></td>
	</tr>
	`;
	table.innerHTML += html;

}