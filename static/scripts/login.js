var switchText = document.getElementById('switch');
var password2 = document.getElementById('inputPassword2');
var type = 'login'

function swap(){
	if (type == 'login'){
		switchText.innerHTML = "Login";
		password2.classList.remove('hide');
		type = 'signup';
		$("#submit").attr("value", "Sign Up");
		$("#login-text").html("Create a new account");
	}
	else {
		$("#login-text").html("Sign In");
		switchText.innerHTML = "Sign Up";
		password2.classList.add('hide');
		password2.value = "";
		type = 'login';
		$("#submit").attr("value", "Login");
	}
	
}