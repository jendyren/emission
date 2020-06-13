import os
from bson.objectid import ObjectId
from pymongo import MongoClient
mongoPassword = os.getenv('mongoPassword')
mongoUri = "mongodb+srv://HexHax:" + mongoPassword + "@hackathons-nfrzv.mongodb.net/Emission?retryWrites=true&w=majority"

client = MongoClient(mongoUri)
db=client.Emission
users = db.users
print("things?", db.list_collection_names())

def get_part(userId, part):
	query = {}
	query[part] = 1
	p = users.find_one({"_id": ObjectId(userId)}, query)
	print(p)
	return p

def newUser():
	user = {
		"username": "",
		"password": "",
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
	# hash the password?
	query = {}
	query["_id"] = 1
	p = users.find_one({checkBy: "username"}, query)
	if p:
		print(p)
		return True
	return False

def addUser(username, password):
	user = newUser()
	user['username'] = username 
	user['password'] = password 
	users.insert_one(user)

def updateActivity(id, activity, value):
	pass