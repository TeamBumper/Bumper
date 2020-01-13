from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'user'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(24), nullable=False)
    pw_hash = db.Column(db.String(64), nullable=False)

    def __init__(self, username, password):
        self.username = username
        self.pw_hash = password
