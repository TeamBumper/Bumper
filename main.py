import os
from flask import Flask, request, session, url_for, redirect, render_template, abort, g, flash, _app_ctx_stack
from flask_pymongo import PyMongo

app = Flask(__name__)

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
    # system = SearchSystem()
    # system.setFilter('make', 'Chevrolet')
    # cars_json_list = system.search()
    # system.debug_print(cars_json_list)

    return render_template('home/home.html')



