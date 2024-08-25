from . import db
from sqlalchemy.sql import func
from sqlalchemy.dialects.mysql import ENUM, MEDIUMTEXT, MEDIUMBLOB

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column('idUser',db.Integer, primary_key=True)
    username = db.Column('userName', db.String(45), nullable=False)
    email = db.Column(db.String(45), nullable=False)
    nickname = db.Column(db.String(45), nullable=True)
    profile_image = db.Column(db.String(255), nullable=True)
    faceimages = db.relationship('FaceImage', back_populates='user', cascade='all, delete-orphan')

class FaceImage(db.Model):
    __tablename__ = 'faceimage'
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.idUser', ondelete='CASCADE'), nullable=False)
    uploaded_at = db.Column(db.DateTime, server_default=func.now())
    image_url = db.Column(db.String(255), nullable=True)
    user = db.relationship('User', back_populates='faceimages')
    chatbots = db.relationship('Chatbot', back_populates='faceimage', cascade='all, delete-orphan')

class Chatbot(db.Model): 
    __tablename__ = 'chatbot'
    id = db.Column(db.Integer, primary_key=True)
    dialog = db.Column(MEDIUMTEXT, nullable=False)
    summary = db.Column(MEDIUMTEXT, nullable=True)
    feedback = db.Column(ENUM('good', 'bad', name='feedback_enum'), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.idUser', ondelete='CASCADE'), nullable=False)
    date = db.Column(db.DateTime, server_default=func.now())
    faceimage_id = db.Column(db.Integer, db.ForeignKey('faceimage.id', ondelete='CASCADE'), nullable=False)
    faceimage = db.relationship('FaceImage', back_populates='chatbots')
    user = db.relationship('User', backref=db.backref('chatbots', cascade='all, delete-orphan'))

