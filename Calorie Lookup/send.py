import requests 
import json

def sendVals(s):
	data = json.loads(s)
	# data = {'food': arr[0], 'calories': arr[1]}
	obj = requests.post(url=r'https://emission.hexhax.tech/ui-data', data=json.dumps(data), headers={'content-type': 'application/json'}) 
	return obj.text

