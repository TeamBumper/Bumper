import requests
import json

api_key = "xKB022T5CaVfFrklXzRC8lHGBpYMkSU9"

class SearchSystem():    
    
    def __init__(self):
        self.filters = dict()                
    
    def setFilter(self, param, value):
        self.filters[param] = value 

    def search(self):
        #build the url
        query = "http://api.marketcheck.com/v2/search/car/active?api_key={0}".format(api_key)
        for param in self.filters:                        
            filter = "&{0}={1}".format(param, self.filters[param])
            query += filter         
            
        payload = {}
        headers = {
            'Host': 'marketcheck-prod.apigee.net',
            'content-Type': 'application/json'
        }
    
        response = requests.request("GET", query, headers=headers, data = payload)
        # print(response.text.encode('utf8'))
        # response['listings']
        # for each listing print listing[vin]

        json_object = json.loads(response.text.encode('utf8'))        
        #print(json_object["num_found"])
        # print(json.dumps(json_object, indent=1))
        
        return json_object        
        # return json response

    def debug_print(self, response):
        for vehicle in response["listings"]:
            print(vehicle["vin"])
        
            
if __name__ == '__main__':
    test = SearchSystem()
    test.setFilter('make', 'Chevrolet')
    test.setFilter('start', '0')
    test.setFilter('rows', '100')

    test.search()

# car type (new used certified)
# body type
# body subtype
# vehicle type
# seller type
# year
# make
# model
# trim
# drivetrain
# transmission
# engine, engine size
# fuel type
# doors
# cylinders
# exterior color
# interior color
# radius
# latitude
# longitude
# vin
# price (range)
# miles (range)
# days on market (range)
