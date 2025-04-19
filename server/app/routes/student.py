from flask import Blueprint, request, jsonify
from ..models import Student, Course

student_bp = Blueprint("student", __name__)

@student_bp.route('/student/add', methods=['POST'])
def add_students():
    data = request.get_json()
    print(data)
    if "Student" not in data:
        return jsonify({"error": "Missing 'Student' key"}), 400
    
    student_data=data['Student']
    try:
        # Create the student object without saving yet
        student = Student(
            student_id=student_data['student_id'],
            name=student_data["name"],
            email=student_data["email"],
            major=student_data["major"],
            year=int(student_data['year']),
        )
            
        #Hash password
        student.hash_password(student_data['password'])
        # Save the student to the database
        student.save()

        return jsonify({
        "Status": "Success"
    }), 201
        
    except Exception as e:
        print("Error:", e)
        return jsonify({
            "status": "fail",
            "message": f"Could not add student: {str(e)}"
        }), 400

    

@student_bp.route('/student/all', methods=['GET'])
def get_all_students():
    try:
        students = Student.objects.all()
        result = []

        for student in students:
            student_data = {
                "id": student.student_id,
                "name": student.name,
                "email": student.email,
                "department": student.major,
                "year": str(student.year),  # sending as string to match mock data
                "courses": [course.course_code for course in student.enrolled_courses] if student.enrolled_courses else []
            }
            result.append(student_data)
        
        print(result)
        return jsonify(result), 200

    except Exception as e:
        # Log the exception to get more details
        print(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500
