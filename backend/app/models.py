from . import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column('idUser', db.Integer, primary_key=True)
    username = db.Column('userName', db.String(45), nullable=False)
    password = db.Column(db.String(45), nullable=False)
    email = db.Column(db.String(45), nullable=False)
    nickname = db.Column(db.String(45), nullable=True)
    faceimages = db.relationship('FaceImage', backref='user', lazy=True)

class FaceImage(db.Model):
    __tablename__ = 'faceimage'
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.LargeBinary, nullable=True)
    filename = db.Column(db.String(255), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.idUser'), nullable=False)
