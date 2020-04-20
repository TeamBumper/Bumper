import os
from api import API_addUser, API_checkUser, API_searchMarketCheck, API_carPreferences, API_carLikes, API_devDelete, API_getZip
from flask import Flask, request, session, url_for, redirect, render_template, abort, g, flash, _app_ctx_stack, send_from_directory
from flask_pymongo import PyMongo
from flask_restful import Api
from flask_talisman import Talisman

app = Flask(__name__)

# Setup Mongo
if 'DYNO' in os.environ:
    app.config["MONGO_URI"] = os.environ['MONGODB_URI'] + "?retryWrites=false"
    app.debug = False
    csp = {
        'default-src': [
            "'self'",
            # "https://cdn.firebase.com",
            # "https://stackpath.bootstrapcdn.com",
            # "https://fonts.googleapis.com",
            # "https://kit.fontawesome.com",
            # "https://www.gstatic.com",
            # "https://fonts.gstatic.com",
            "*"
        ]
    }
    Talisman(app, content_security_policy=csp)
else:
    app.config["MONGO_URI"] = "mongodb://localhost:27017/bumper"

mongo = PyMongo(app)
users = mongo.db.users
car_preferences = mongo.db.car_preferences


api = Api(app)
api.add_resource(API_addUser, '/adduser')
api.add_resource(API_checkUser, '/checkuser')
api.add_resource(API_searchMarketCheck, '/search')
api.add_resource(API_carPreferences, '/car_preferences')
api.add_resource(API_carLikes, '/car_likes')
api.add_resource(API_devDelete, '/devdelete')
api.add_resource(API_getZip, '/getzip')


# Routing

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 
                              'bumper.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/')
def init():
    return render_template('welcome/welcome.html')

@app.route('/welcome') 
def welcome():
    return render_template('welcome/welcome.html')

@app.route('/logout') 
def logout():
    return render_template('logout/logout.html')

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
    zip_code = ""
    radius = ""
    year = ""
    price_range = ""
    print("Before request stuff")
    if request.method == 'POST':      
        if request.form['make'] != None:
            make = request.form['make']
            model = request.form['model']
            print("After model")
            zip_code = request.form['zip']
            print("After zip_code")
            radius = request.form['radius']
            print("After radius")
            try:
                year = request.form['year']
                print("After year")
                price_range = request.form['price_range']
            except Exception as e: print(e)

            if model == 'AllModels':
                model = ''            
    print("Got to here")
    return render_template('home/home.html', make=make, model=model, zip_code=zip_code, radius=radius, year=year, price_range=price_range)
