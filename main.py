import os
from flask import Flask, request, session, url_for, redirect, render_template, abort, g, flash, _app_ctx_stack
from flask_pymongo import PyMongo
from flask_restful import reqparse, abort, Api, Resource

app = Flask(__name__)
api = Api(app)

# Setup Mongo
# app.config["MONGO_URI"] = os.environ['MONGODB_URI'] + "?retryWrites=false"
app.config["MONGO_URI"] = "mongodb://localhost:27017/bumper"
mongo = PyMongo(app)
users = mongo.db.users

# Routing
@app.route('/')
def init():
    return render_template('welcome/welcome.html')


@app.route('/home')
def home_screen():
    # if there's no id token or access token just show cardstarck and only only dislike of cars
    # Anything requring a specific user, states 

    # return redirect_url('/')
    print("HERE")
    return render_template('home/home.html')

# API
parser = reqparse.RequestParser() 
parser.add_argument('email')
parser.add_argument('access_token')

class API_addUser(Resource):
    def post(self):
        args = parser.parse_args()
        email = args['email']
        access_token = args['access_token']

        record = {
            'email':email,
            'access_token':access_token,
        }

        users.insert_one(record)
        print("Here 2")
        return 200

class API_checkUser(Resource):
    def get(self):
        args = parser.parse_args()
        email = args['email']
        access_token = args['access_token']

        record = {
            'email':email,
            'access_token':access_token,
        }
        print(users.find_one(record))
        if users.find_one(record) is not None:
            print("Marcus wtf")
            return 200
        
        else:        
            print("Alan wtf")
            return 404

api.add_resource(API_addUser, '/adduser')
api.add_resource(API_checkUser, '/checkuser')



