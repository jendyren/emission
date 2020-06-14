import requests 
import json
import time

def sendReq():
	key = 'doqlRKlePch6qiCBBgggzMgaJhsdCv0G6Lw0KNcL'
	params = {'api_key': key}
	
	while True:
		try:
			req = requests.post(
				r'https://emission.hexhax.tech/ui-go',
				params=params,
				json={}
			)
			go = req.json()['go']
			if go:
				food = req.json()['food']
				data = {'generalSearchInput': food}

			
				response = requests.post(
					r'https://api.nal.usda.gov/fdc/v1/search',
					params=params,
					json=data
				)
				try:
					crack = response.json()['foods'][0]['foodNutrients']
					there = False
					for entry in crack:
						if(entry['unitName'] == 'KCAL'):
							requests.post(url=r'https://emission.hexhax.tech/ui-data', data=json.dumps({'food': food, "calories": entry['value']}), headers={'content-type': 'application/json'}) 
							there = True
					if not there:
						requests.post(url=r'https://emission.hexhax.tech/ui-data', data=json.dumps({'food': food, "calories": "unknown"}), headers={'content-type': 'application/json'}) 		

				except:
					requests.post(url=r'https://emission.hexhax.tech/ui-data', data=json.dumps({'food': food, "calories": "unknown"}), headers={'content-type': 'application/json'})
		except: 
			requests.post(url=r'https://emission.hexhax.tech/ui-data', data=json.dumps({'food': food, "calories": "unknown"}), headers={'content-type': 'application/json'})
		time.sleep(5)
	return True