import os
from flask import Flask
from mongoengine import connect
from dotenv import load_dotenv
from .routes import blueprints
from flask_cors import CORS

load_dotenv()  # Load .env variables

def create_app():
    app = Flask(__name__)
    CORS(app)
    #CORS(app, origins=["http://localhost:5173"])


    app.config['MONGO_URI']=os.getenv('MONGO_URI')

    for bp in blueprints:
        app.register_blueprint(bp,url_prefix='/api/v1')

    connect(
        db='university_scheduler',
        host=os.getenv('MONGO_URI')
    )


    return app
