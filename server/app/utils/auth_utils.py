import jwt
from flask import current_app
from datetime import datetime, timedelta

def encode_auth_token(student):
    token = jwt.encode(
                {'student_id': student.student_id, 'exp': datetime.utcnow() + timedelta(hours=1)},
                current_app.config['SECRET_KEY'],
                algorithm='HS256'
            )
    return token

def decode_auth_token(token):
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        return payload["student_id"]
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    