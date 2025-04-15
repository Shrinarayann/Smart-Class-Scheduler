from flask import Blueprint, request, jsonify
from ..models import Student, Course

student_bp = Blueprint("student", __name__)

@student_bp.route('/student/add', methods=['POST'])
def add_students():
    data = request.get_json()
    if "Student" not in data:
        return jsonify({"error": "Missing 'Student' key"}), 400
        
    students = data["Student"]
    added = []
    failed = []
    
    for s in students:
        try:
            # Create the student object without saving yet
            student = Student(
                student_id=s[0],
                name=s[1],
                email=s[2],
                major=s[3],
                year=int(s[4])
            )
            
            # Check if course IDs are provided in the request
            if len(s) > 5 and s[5]:
                # s[5] should be a list of course codes
                course_codes = s[5]
                enrolled_courses = []
                
                # Find each course by course_code
                for code in course_codes:
                    course = Course.objects.filter(course_code=code).first()
                    if course:
                        enrolled_courses.append(course)
                    else:
                        # Optionally handle nonexistent course codes
                        pass
                
                # Set enrolled courses
                student.enrolled_courses = enrolled_courses
            
            # Save the student to the database
            student.save()
            added.append(s[0])
            
        except Exception as e:
            failed.append({"id": s[0], "error": str(e)})
    
    return jsonify({
        "added": added,
        "failed": failed
    }), 201


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
        return jsonify({"error": str(e)}), 500
