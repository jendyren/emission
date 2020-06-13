var switchText = document.getElementById('switch');
var password2 = document.getElementById('inputPassword2');
var type = 'login'

function swap(){
	if (type == 'login'){
		switchText.innerHTML = "Sign Up";
		password2.classList.remove('hide');
		type = 'signup';
	}
	else {
		switchText.innerHTML = "Log In";
		password2.classList.add('hide');
		type = 'login';
	}
	
}