from flask import Flask, render_template, url_for, request, redirect

import db
app = Flask('app')
import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

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
		print("test", request.form)
		if db.checkUser("username", request.form["username"]):
			print("Username exists!")
			return redirect('/dashboard')
		else:
			print("Username doesn't exist.")
			return render_template('login.html', register=True)
	else:
		return render_template('login.html', register=False)



@app.route('/dashboard')
def something():
	cookie = request.cookies.get('userID')
	if not db.checkUser('_id', cookie):
		return redirect('/login')
	return render_template('index.html')

@app.route('/leaderboard/<user>')
def leaderboard(user):
	return render_template('leaderboard.html', user=user)

@app.route('/leaderboard')
def leaderboard2():
	return render_template('leaderboard.html')

@app.route('/settings')
def settings():
	return render_template('settings.html')

@app.route('/profile')
def profile():
	return render_template('profile.html')


@app.route('/information')
def info():
	return render_template('information.html')

app.run(host='0.0.0.0', port=8080, debug=True)