from flask import Flask, render_template, url_for, request, redirect, flash, Response, make_response, jsonify

import db
app = Flask('app')
app.secret_key = 'super secret string'  # Change this!

import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)


import flask_login
login_manager = flask_login.LoginManager()
login_manager.init_app(app)

class User(flask_login.UserMixin):
  pass

@login_manager.user_loader
def user_loader(username):
    if not db.checkUser("username", username):
        return
    user = User()
    user.id = username
    return user

@login_manager.request_loader
def request_loader(request):
	if request.form:
		print("Authentication")
		username = request.form["username"]
		if not db.checkPassword(username, request.form["password"]):
			print("User not authenticated!")
			return
		user = User()
		user.id = username
		
		#user.is_authenticated = True; # this line is useless LOL
		return user

@app.after_request
def add_header(r):
		"""
		Add headers to both force latest IE rendering engine or Chrome Frame,
		and also to cache the rendered page for 10 minutes.
		"""
		r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
		r.headers["Pragma"] = "no-cache"
		r.headers["Expires"] = "0"
		r.headers['Cache-Control'] = 'public, max-age=0'
		return r

@app.route('/')
def index():
	return render_template('landing.html')

@app.route('/login', methods=['POST', 'GET'])
def login():
	# If there is a form submitted
	if request.form:
		# If inputPassword2 field is not empty, this is a registration.
		name = request.form["username"]
		pwrd = request.form["password"]
		# Registration
		if request.form["password2"]:
			# Check if the user already exists

			if (pwrd != request.form["password2"]):
				flash("Passwords do not match!")
				return render_template('login.html')
			if (len(pwrd) <= 6):
				flash("Password must be at least 6 characters.")
				return render_template('login.html')
		
			if db.checkUser("username", name):
				flash("User '{}' already exists!".format(name))
				return render_template('login.html')
			else:
				print("New user {} registered!".format(name))
				db.addUser(name, pwrd)
				flash("User created!")
				return render_template('login.html', newuser=True)
			
		# Validated user
		elif db.checkUser("username", name) and db.checkPassword(name, pwrd):
			print(name, "has been verified!")
			user = User()
			user.id = request.form["username"]
			userid = str(db.getPartWith('username', user.id, '_id'))
			resp = make_response(redirect(url_for('dashboard')))
			resp.set_cookie('userID', userid)
			flask_login.login_user(user)
			return resp

		else:
			print("Unauthorized")
			flash("Incorrect credentials!")
			return render_template('login.html')

	else:
		return render_template('login.html')

# Unauthorized access redirects to login page
@login_manager.unauthorized_handler
def unauthorized_handler():
    return redirect(url_for('login'))


"""
The following pages require authentication
Current user's username is stored in this variable: flask_login.current_user.id
"""

@app.route('/dashboard')
@flask_login.login_required
def dashboard():
	print('Logged in as: ' + flask_login.current_user.id)
	return render_template('index.html', username=flask_login.current_user.id)

@app.route('/logout')
@flask_login.login_required
def logout():
    flask_login.logout_user()
    return redirect('/')


@app.route('/leaderboard')
@flask_login.login_required
def leaderboard():
	username = flask_login.current_user.id
	return render_template('leaderboard.html', username=username)

@app.route('/settings')
@flask_login.login_required
def settings():
	username = flask_login.current_user.id
	return render_template('settings.html', username=username)

@app.route('/profile', methods=['GET', 'POST'])
@flask_login.login_required
def profile():
	if request.method == 'POST':
		print("something")
		userid = request.cookies.get('userID')
		return jsonify({"respose": userid})
	else:
		username = flask_login.current_user.id
		return render_template('profile.html', username=username)


@app.route('/information')
@flask_login.login_required
def info():
	username = flask_login.current_user.id
	return render_template('information.html', username=username)

app.run(host='0.0.0.0', port=8080, debug=True)