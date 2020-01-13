import os
from flask import Flask, request, session, url_for, redirect, render_template, abort, g, flash, _app_ctx_stack
from models import db, User
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app.root_path, 'catering.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  #here to silence deprecation warning
app.config['SECRET_KEY'] = 'leak'

db.init_app(app)


@app.cli.command('initdb')
def initdb_command():
    """Creates the database tables."""
    db.create_all()
    print('Initialized the database.')


@app.route('/')
def init():
    return redirect(url_for('login'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    error = None
    return render_template('register.html', error=error)


@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    return render_template('login.html', error=error)
