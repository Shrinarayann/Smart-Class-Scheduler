import os
from flask import Flask
from mongoengine import connect
from dotenv import load_dotenv
from .routes import blueprints

load_dotenv()  # Load .env variables

def create_app():
    app = Flask(__name__)
    for bp in blueprints:
        app.register_blueprint(bp,url_prefix='/api/v1')

    connect(
        db='university_scheduler',
        host=os.getenv('MONGO_URI')
    )


    return app
