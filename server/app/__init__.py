import os
from flask import Flask
from mongoengine import connect
from dotenv import load_dotenv

load_dotenv()  # Load .env variables

def create_app():
    app = Flask(__name__)
    
    connect(
        db='university_scheduler',
        host=os.getenv('MONGO_URI')
    )


    return app
