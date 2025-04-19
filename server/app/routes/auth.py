from flask import Blueprint, request, jsonify,current_app
from datetime import datetime, timedelta
import jwt

from ..models import Student 

auth_bp = Blueprint('auth_bp', __name__)



# Student Login Route (POST)
@auth_bp.route('/student/login', methods=['POST'])
def login_student():
    data = request.get_json()

    # Check if email and password are provided
    if not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing email or password"}), 400

    # Fetch student by email
    student = Student.objects(email=data['email']).first()

    if student and student.verify_password(data['password']):
        # Generate JWT token if password matches
        token = jwt.encode(
            {'student_id': student.student_id, 'exp': datetime.utcnow() + timedelta(hours=1)},
            current_app.config['SECRET_KEY'],
            algorithm='HS256'
        )
        return jsonify({"message": "Login successful", "token": token}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401
