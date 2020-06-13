import os
from bson.objectid import ObjectId
from pymongo import MongoClient
mongoPassword = os.getenv('mongoPassword')
mongoUri = "mongodb+srv://HexHax:" + mongoPassword + "@hackathons-nfrzv.mongodb.net/Emission?retryWrites=true&w=majority"

client = MongoClient(mongoUri)
db=client.Emission
users = db.users

# For hashing passwords
import bcrypt


def get_part(userId, part):
	query = {}
	query[part] = 1
	p = users.find_one({"_id": ObjectId(userId)}, query)
	print(p)
	return p

def getPartWith(by, value, part):
	query = {}
	query[part] = 1
	p = users.find_one({by: value}, query)
	return p[part]

def newUser():
	user = {
		"username": "",
		"password": "",
		"score": 0,
		"settings": {
		},
		"activities": {
		}
	}
	return user

def checkUser(checkBy, value):
	if checkBy == '_id': value = ObjectId(value)
	query = {}
	query["_id"] = 1
	p = users.find_one({checkBy: value}, query)
	if p:
		return True
	return False

def checkPassword(username, password):
	# hashed the password
	p = users.find_one({"username": username})
	if p:
		try:
			return bcrypt.checkpw(password, p["password"])
		except:
			# in case the password is not salted correctly, invalidate verification
			return False
	return False

def addUser(username, password):
	user = newUser()
	user['username'] = username 
	user['password'] = bcrypt.hashpw(password, bcrypt.gensalt())
	users.insert_one(user)

def updateActivities(userid, activities):
	newValues = { "$set": activities }
	print(users.update_one({'_id': ObjectId(userid)}, newValues))

def get_data(userid, parts):
	query = {'_id': 0}

	for i in parts:
		query[i] = 1
	p = users.find_one({'_id': ObjectId(userid)}, query)
	return p

def get_leaderboard(id):
	participants = users.find({}, {'username': 1, 'score': 1})
	print("part", participants[0])
	parts = []
	found = False
	index = 0
	for x in participants:
		if x['_id'] == id: 
			break
		if found and len(parts)-index >= 5:
				break
		parts.append(x)
		if not found: index += 1
	
	place = len(parts) - 10
	return {
		"places": [place, place+10],
		"participants": parts[-10:-1]
	}

	