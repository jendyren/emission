from flask import Flask, render_template, url_for

import db
app = Flask('app')
import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

db.get_part('5ee3b4fc69f44a560f1cf72d', 'settings')

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

@app.route('/dashboard')
def something():
  return render_template('index.html')

@app.route('/leaderboard/<user>')
def leaderboard(user):
  return render_template('leaderboard.html', user=user)

@app.route('/settings')
def settings():
  return render_template('settings.html')

@app.route('/profile')
def profile():
  return render_template('profile.html')
	
print("server running 1")

app.run(host='0.0.0.0', port=8080, debug=True)