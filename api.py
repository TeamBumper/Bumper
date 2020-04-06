from flask_restful import reqparse, abort, Api, Resource
from marketcheck import SearchSystem

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

class API_addUser(Resource):
    def post(self):
        args = parser.parse_args()
        email = args['email']
        access_token = args['access_token']

        record = {
            'email':email,
            'access_token':access_token,
        }

        from main import users
        users.insert_one(record)
        print("Here 2")
        return 200

class API_checkUser(Resource):
    def get(self):
        print("In check user")
        args = parser.parse_args()
        email = args['email']
        access_token = args['access_token']

        record = {
            'email':email,
            'access_token':access_token,
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
        for param in args:
            if args[param] is not None:
                system.setFilter(param, args[param])            
        found_cars = system.search()
        return 200, found_cars
