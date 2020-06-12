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