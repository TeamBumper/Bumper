import os
from api import API_addUser, API_checkUser, API_searchMarketCheck, API_carPreferences, API_carLikes
from flask import Flask, request, session, url_for, redirect, render_template, abort, g, flash, _app_ctx_stack
from flask_pymongo import PyMongo
from flask_restful import Api

app = Flask(__name__)

# Setup Mongo
app.config["MONGO_URI"] = os.environ['MONGODB_URI'] + "?retryWrites=false"
# app.config["MONGO_URI"] = "mongodb://localhost:27017/bumper"
mongo = PyMongo(app)
users = mongo.db.users
car_preferences = mongo.db.car_preferences


api = Api(app)
api.add_resource(API_addUser, '/adduser')
api.add_resource(API_checkUser, '/checkuser')
api.add_resource(API_searchMarketCheck, '/search')
api.add_resource(API_carPreferences, '/car_preferences')
api.add_resource(API_carLikes, '/car_likes')


# Routing
@app.route('/')
def init():
    return render_template('welcome/welcome.html')


@app.route('/search_page')
def search_page():
    return render_template('search/search_page.html')


@app.route('/likes')
def liked_cars():
    return render_template('likes/likes.html')


@app.route('/home', methods=['GET', 'POST'])
def home_screen():
    # if there's no id token or access token just show cardstarck and only only dislike of cars
    # Anything requring a specific user, states
    make = ""
    model = ""
    latitude = ""
    longitude = ""
    if request.method == 'POST':
        if request.form['make'] != None:
            make = request.form['make']
            model = request.form['model']
            latitude = request.form['latitude']
            longitude = request.form['longitude']
            if model == 'All Models':
                model = ''

    return render_template('home/home.html', make=make, model=model, latitude=latitude, longitude=longitude)
