import os
from bson.objectid import ObjectId
import pymongo
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
	users.update_one({'_id': ObjectId(userid)}, newValues)

def get_data(userid, parts):
	query = {'_id': 0}

	for i in parts:
		query[i] = 1
	p = users.find_one({'_id': ObjectId(userid)}, query)
	return p

def get_leaderboard(id):
	parts = get_data(id, ['friends', 'username'])
	friends = [] if 'friends' not in parts.keys() else parts['friends']
	username = parts['username']
	participants = users.find({}, {'username': 1, 'score': 1, '_id': 0})
	participants.sort([("score", pymongo.DESCENDING)])

	globalRanks = []
	aroundRanks = []
	friendRanks = []
	everyone = []
	index = 0
	countdown = 0
	for x in participants:
		x['place'] = index
		if x['username'] == username:
			x['you'] = True
			begin = index-4 if len(parts)-index > 4 else 0
			countdown = 8-(index-begin)
			aroundRanks = everyone[begin:index]
			
		if len(globalRanks) < 8: globalRanks.append(x)
		if x['username'] in friends: friendRanks.append(x)
		if (countdown > 0):
			countdown -= 1
			aroundRanks.append(x)
		everyone.append(x)
		index += 1
	
	return {
		"global": globalRanks,
		"around": aroundRanks,
		"friends": friendRanks
	}

def befriend(id, friendName):
	users.update_one({'_id': ObjectId(id)}, {'$push': {"friends": friendName}})

def search_names(name):
	lowername = name[0].lower() + name[1:]
	# nope :(
	# i guess you could also store a lowercase version of the name or something in the db
	# I think there's a way to do it actually alright
	# people = users.find({'$or': [
	# 	{'username': {'$gte': lowername, '$lte': lowername+'z'}},
	# 	{'username': {'$gte': name.upper(), '$lte': name.upper()+'z'}}
	# ]
	# }, {'username': 1}).limit(20);
	people = users.find({
		"username": {"$regex": "^" + name.lower(), "$options" :'i'}
	}
	, {'username': 1}).limit(20);
	# people = users.find({'$match': {

	# }, {'username': 1}).limit(20);
	return [x['username'] for x in people]





