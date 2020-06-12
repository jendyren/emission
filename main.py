from flask import Flask, render_template, url_for

import db
app = Flask('app')
import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

db.get_part('5ee3b4fc69f44a560f1cf72d', 'settings')

@app.route('/')
def index():
  return render_template('landing.html')

@app.route('/main')
def something():
  return render_template('index.html')

@app.route('/leaderboard/<user>')
def leaderboard(user):
  return render_template('leaderboard.html', user=user)

@app.route('/settings')
def settings():
  return render_template('settings.html')

@app.route('/test')
def test():
  return render_template('test.html')

print("server running 1")

app.run(host='0.0.0.0', port=8080, debug=True)