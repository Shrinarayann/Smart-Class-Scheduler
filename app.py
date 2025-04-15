from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from werkzeug.security import generate_password_hash

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    logger.info("Home endpoint accessed")
    return "Flask server is running!"

@app.route('/api/test', methods=['GET'])
def test():
    logger.info("Test endpoint accessed")
    return jsonify({"message": "API is working"})

@app.route('/api/v1/student/add', methods=['POST'])
def add_student():
    logger.info("Add student endpoint accessed")
    logger.debug(f"Request data: {request.get_data()}")

    try:
        data = request.json
        logger.info(f"Processed JSON data: {data}")

        student_id = data['student_id']
        name = data['name']
        email = data['email']
        password = data['password']
        confirm_password = data['confirm_password']
        year = data['year']
        department = data['department']

        if password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), 400

        # Hash the password
        hashed_password = generate_password_hash(password)

        # Create the student object
        student = {
            "student_id": student_id,
            "name": name,
            "email": email,
            "hashed_password": hashed_password,
            "department": department,
            "year": year
        }

        return jsonify(student), 201

    except Exception as e:
        logger.error(f"Error processing request: {e}")
        return jsonify({"error": str(e)}), 400


@app.route('/api/v1/course/add', methods=['POST'])
def add_course():
    logger.info("Add course endpoint accessed")
    logger.debug(f"Request data: {request.get_data()}")
    
    try:
        data = request.json
        logger.info(f"Processed JSON data: {data}")
        
        # Check for missing fields
        if not data.get('course_id') or not data.get('course_name') or not data.get('credits'):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Returning data as JSON
        return jsonify({
            "course_id": data["course_id"],
            "course_name": data["course_name"],
            "credits": data["credits"]
        }), 201
    
    except Exception as e:
        logger.error(f"Error processing course data: {e}")
        return jsonify({"error": str(e)}), 400


@app.route('api/v1/teacher/add', methods=['POST'])
def register_faculty():
    logger.info("Register faculty endpoint accessed")
    logger.debug(f"Request data (raw): {request.get_data()}")
    
    try:
        if request.is_json:
            data = request.get_json()
            logger.info(f"Processed JSON data: {data}")
            print("FACULTY DATA RECEIVED:", data)
            
            # Extract the data fields
            teacher_id = data.get('teacher_id')
            name = data.get('name')
            email = data.get('email')
            department = data.get('department')
            teachable_courses = data.get('teachable_courses', [])
            
            # Validate required fields
            if not all([teacher_id, name, email, department]):
                return jsonify({"error": "Missing required fields"}), 400
                
            # Format the response in the desired structure
            faculty_data = {
                "teacher_id": teacher_id,
                "name": name,
                "email": email,
                "department": department,
                "teachable_courses": teachable_courses
            }
            
            # Return the structured data
            return jsonify(faculty_data), 201
        else:
            logger.error("Request content is not JSON")
            return jsonify({"error": "Content-type must be application/json"}), 400
    except Exception as e:
        logger.error(f"Error processing faculty data: {e}")
        return jsonify({"error": f"Error: {str(e)}"}), 400


@app.route('api/v1/room/add', methods=['POST'])
def add_classroom():
    logger.info("Add classroom endpoint accessed")
    logger.debug(f"Request data: {request.get_data()}")
    
    try:
        if request.is_json:
            data = request.get_json()
            logger.info(f"Processed JSON data: {data}")
            
            # Extract the data fields
            room_id = data.get('room_id')
            capacity = data.get('capacity')
            
            # Validate required fields
            if not room_id or not capacity:
                return jsonify({"error": "Missing required fields"}), 400
                
            try:
                # Ensure capacity is an integer
                capacity = int(capacity)
            except (ValueError, TypeError):
                return jsonify({"error": "Capacity must be a valid number"}), 400
                
            # Format the response in the desired structure
            room_data = {
                "room_id": room_id,
                "capacity": capacity
            }
            
            # Here you would normally save to a database
            print(f"(room_id=\"{room_id}\", capacity={capacity})")
            
            # Return the structured data
            return jsonify(room_data), 201
        else:
            logger.error("Request content is not JSON")
            return jsonify({"error": "Content-type must be application/json"}), 400
    except Exception as e:
        logger.error(f"Error processing classroom data: {e}")
        return jsonify({"error": f"Error: {str(e)}"}), 400

@app.route('api/v1/scholar/add', methods=['POST'])
def add_scholar():
    logger.info("Add research scholar endpoint accessed")
    logger.debug(f"Request data: {request.get_data()}")
    
    try:
        data = request.json
        logger.info(f"Processed JSON data: {data}")
        
        # Check for missing required fields
        if not data.get('scholar_id') or not data.get('name'):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Format as specified
        scholar_data = {
            "scholar_id": data.get('scholar_id'),
            "name": data.get('name'),
            "TA_courses": data.get('TA_courses', ''),
            "supervisor_id": data.get('supervisor_id', '')
        }
        
        # Log the formatted tuple representation
        logger.info(f"(scholar_id=\"{scholar_data['scholar_id']}\", name=\"{scholar_data['name']}\", TA_courses=\"{scholar_data['TA_courses']}\", supervisor_id=\"{scholar_data['supervisor_id']}\")")
        
        # Return data as JSON
        return jsonify(scholar_data), 201
    
    except Exception as e:
        logger.error(f"Error processing scholar data: {e}")
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    logger.info("Starting Flask server on port 8000")
    app.run(host='0.0.0.0', port=8000, debug=True)