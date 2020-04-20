from flask_restful import reqparse, abort, Api, Resource
import requests
from marketcheck import SearchSystem
import json
import urllib.parse

parser = reqparse.RequestParser()
parser.add_argument('email')
parser.add_argument('access_token')
parser.add_argument('year')
parser.add_argument('make')
parser.add_argument('model')
parser.add_argument('radius')
parser.add_argument('latitude')
parser.add_argument('longitude')
parser.add_argument('vin')
parser.add_argument('value')
parser.add_argument('data')
parser.add_argument('zip')
parser.add_argument('lat')
parser.add_argument('long')
parser.add_argument('vdp')
parser.add_argument('pic_src')
parser.add_argument('price')
parser.add_argument('miles')
parser.add_argument('title')


class API_addUser(Resource):
    def post(self):
        args = parser.parse_args()
        email = args['email']
        access_token = args['access_token']

        record = {
            'email': email,
            'access_token': access_token,
        }

        record2 = {
            'email': email,
        }

        from main import users, car_preferences
        users.insert_one(record)
        car_preferences.insert_one(record2)
        print("Here 2")
        return 200

    def delete(self):
        args = parser.parse_args()
        email = args['email']
        access_token = args['access_token']

        record = {
            'email': email,
            'access_token': access_token,
        }

        from main import users
        users.remove(record)
        return 200


class API_checkUser(Resource):
    def get(self):
        print("In check user")
        args = parser.parse_args()
        email = args['email']
        access_token = args['access_token']

        record = {
            'email': email,
            'access_token': access_token,
        }

        from main import users
        print(users.find_one(record))
        if users.find_one(record) is not None:
            print("Marcus wtf")
            return 200

        else:
            print("Alan wtf")
            return 404


class API_searchMarketCheck(Resource):    
    def get(self):
        print("doing search")
        args = parser.parse_args()
        system = SearchSystem()
        user_email = args['email']
        try:
            seenCars = self.getSeenCars(user_email)
        except:
            seenCars = ""
        # Set relevant parameters/filters

        system.setFilter('rows', '10')
        for param in args:
            if args[param] is not None:
                system.setFilter(param, args[param])

        length = 0
        index = 0
        # Keep searching for cars, adjusting the index value if no cars left
        while length == 0:
            system.setFilter('start', str(index))
            found_cars = system.search()
            if 'code' in found_cars: # Break out of loop if error code returned
                print("no cars found")
                break
            # Remove any vins already seen or if pictures/price don't exist
            if 'listings' in found_cars:
                listings = found_cars['listings']
                for i in range(len(listings) - 1, -1, -1):
                    car_dict = listings[i]
                    if car_dict['vin'] in seenCars:
                        del listings[i]
                    elif 'media' not in car_dict or 'price' not in car_dict:
                        del listings[i]
                length = len(listings)
            index += 10

        return json.dumps(found_cars)

    def getSeenCars(self, email):
        from main import car_preferences

        # Get user information with specified email
        filter = {"email": email}
        user_info = list(car_preferences.find(filter))[0]
        # Remove irrelevant information
        del user_info['_id']
        del user_info['email']
        # Make list of seen vin numbers
        seen_cars = list()
        for key in user_info:
            seen_cars.append(key)

        return seen_cars


class API_carLikes(Resource):
    def get(self):
        args = parser.parse_args()
        system = SearchSystem()
        email = args['email']
        from main import car_preferences, cars
        filter = {"email": email}
        full_list = list(car_preferences.find(filter))[0]
        del full_list['_id']
        del full_list['email']

        vehicles = list()
        for car in full_list:
            if full_list[car] == '1':
                vehicle = cars.find_one({"vin":car})            
                del vehicle['_id']
                vehicles.append(vehicle)

        return json.dumps(vehicles)          
        


class API_carPreferences(Resource):
    def put(self):
        args = parser.parse_args()

        # Update user prefs
        key_value = {
            args['vin']: args['value']
        }
        email = args['email']
        filter = {"email": email}
        newvalues = {"$set": key_value}
        
        from main import car_preferences
        car_preferences.update_one(filter, newvalues)
        
        # Add liked car to cars collection
        
        from main import cars
        if args['value'] == "1":
            print("Liked car")
            record = {
                'vin' : args['vin']
            }
            exists = cars.find_one(record)
            if exists is None: 
                cars_entry = {
                    'vin' : args['vin'],
                    'vdp' : args['vdp'],
                    'pic_src' : args['pic_src'],
                    'price' : args['price'],
                    'miles' : args['miles'],
                    'title' : args['title']
                }    
                cars.insert_one(cars_entry)
                print("Creating car entry")

        # print(user_info)
        # print(user_info_cars)

        print("post done")
        return 200

class API_devDelete(Resource):
    def get(self):
        args = parser.parse_args()
        email = args['email']

        record = {
            'email': email,
        }

        from main import car_preferences
        car_preferences.remove(record)
        car_preferences.insert_one(record)
        return 200

class API_getZip(Resource):
    def get(self):
        args = parser.parse_args()
        lat = args['lat']
        lon = args['long']

        #build the url
        query = "http://api.geonames.org/findNearbyPostalCodesJSON?lat={0}&lng={1}&username=bumperapp".format(lat, lon)     
    
        response = requests.request("GET", query)
        json_object = json.loads(response.text.encode('utf8'))        
        
        return json_object        

