from flask_restful import reqparse, abort, Api, Resource
from marketcheck import SearchSystem
import json
import urllib.parse

parser = reqparse.RequestParser()
parser.add_argument('email')
parser.add_argument('access_token')
parser.add_argument('car_type')
parser.add_argument('body_type')
parser.add_argument('body_subtype')
parser.add_argument('vehicle_type')
parser.add_argument('seller_type')
parser.add_argument('year')
parser.add_argument('make')
parser.add_argument('model')
parser.add_argument('trim')
parser.add_argument('drivetrain')
parser.add_argument('transmission')
parser.add_argument('engine')
parser.add_argument('engine_size')
parser.add_argument('fuel_type')
parser.add_argument('doors')
parser.add_argument('cylinders')
parser.add_argument('ext_color')
parser.add_argument('int_color')
parser.add_argument('radius')
parser.add_argument('latitude')
parser.add_argument('longitude')
parser.add_argument('vin')
parser.add_argument('price_min')
parser.add_argument('price_max')
parser.add_argument('miles_min')
parser.add_argument('miles_max')
parser.add_argument('days_on_market_min')
parser.add_argument('days_on_market_max')
parser.add_argument('value')
parser.add_argument('data')
parser.add_argument('zip')


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

        record2 = {
            'email': email,
        }

        from main import users, car_preferences
        users.remove(record)
        car_preferences.remove(record2)
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
        seenCars = self.getSeenCars(user_email)
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
        from main import car_preferences
        filter = {"email": email}
        full_list = list(car_preferences.find(filter))[0]
        print(full_list)
        del full_list['_id']
        del full_list['email']
        liked_list = list()
        for car in full_list:
            if full_list[car] == '-1':
                del car
            else:
                liked_list.append(full_list[car][2:])
                print(full_list[car][2:])
        return json.dumps(liked_list)


class API_carPreferences(Resource):
    def put(self):
        args = parser.parse_args()
        if args['value'] == '-1':
            key_value = {
                args['vin']: args['value']
            }
        else:
            key_value = {
                args['vin']: args['value']+" "+
                urllib.parse.unquote(args['data'])
            }
        email = args['email']
        filter = {"email": email}
        newvalues = {"$set": key_value}
        from main import car_preferences

        # Get user information based on email
        # user_info = car_preferences.find(filter)
        # user_info_cars = user_info['car_table']
        # user_info_cars.update(key_value)
        car_preferences.update_one(filter, newvalues)

        # print(user_info)
        # print(user_info_cars)

        print("post done")
        return 200
