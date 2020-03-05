import os
from flask import Flask, request, session, url_for, redirect, render_template, abort, g, flash, _app_ctx_stack

app = Flask(__name__)


@app.route('/')
def init():
    return render_template('welcome/welcome.html')


@app.route('/home')
def home_screen():
    print("HERE")
    return render_template('home/home.html')
