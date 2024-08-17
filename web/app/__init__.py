from flask import Flask
from flask_pymongo import PyMongo
from ckiptagger import WS

# Initialize Flask app and extensions directly
app = Flask(__name__)
ws = WS('../utils/ckiptagger/data')

# Set the configuration
app.config['MONGO_URI'] = 'mongodb://localhost:27017/podcast_analysis'

# Initialize MongoDB with the app
mongo = PyMongo(app)

# Import and register routes
from app import routes

