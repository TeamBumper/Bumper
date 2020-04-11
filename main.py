import os
from api import API_addUser, API_checkUser, API_searchMarketCheck, API_carPreferences
from flask import Flask, request, session, url_for, redirect, render_template, abort, g, flash, _app_ctx_stack
from flask_pymongo import PyMongo
from flask_restful import Api

app = Flask(__name__)

# Setup Mongo
#app.config["MONGO_URI"] = os.environ['MONGODB_URI'] + "?retryWrites=false"
app.config["MONGO_URI"] = "mongodb://localhost:27017/bumper"
mongo = PyMongo(app)
users = mongo.db.users
car_preferences = mongo.db.car_preferences


api = Api(app)
api.add_resource(API_addUser, '/adduser')
api.add_resource(API_checkUser, '/checkuser')
api.add_resource(API_searchMarketCheck, '/search')
api.add_resource(API_carPreferences, '/car_preferences')


# Routing
@app.route('/')
def init():
    return render_template('welcome/welcome.html')

@app.route('/search_page')
def search_page():
    print("Test -- sEarch")
    return render_template('search/search_page.html')


@app.route('/likes')
def liked_cars():
    return render_template('likes/likes.html')


@app.route('/home', methods=['GET', 'POST'])
def home_screen():
    # if there's no id token or access token just show cardstarck and only only dislike of cars
    # Anything requring a specific user, states

    # return redirect_url('/')
    # system = SearchSystem()
    # system.setFilter('make', 'Chevrolet')
    # cars_json_list = system.search()
    # system.debug_print(cars_json_list)
    if request.method == 'POST':
        data = request.data
        print("Printing data")
        print(data)


    return render_template('home/home.html')

