from flask import Blueprint, request, jsonify
from ..models import Course

course_bp = Blueprint("course", __name__)

# @course_bp.route('/course/add', methods=['POST'])
# def add_courses():
#     data = request.get_json()
#     print(data)

#     # if "Course" not in data:
#     #     return jsonify({"error": "Missing 'Course' key"}), 400

#     #courses = data["Course"]
#     added = []
#     failed = []

#     #for c in courses:
#     try:
#         course = Course(
#             course_code=data[0],
#             name=data[1],
#             lecture_hours=int(data[2])  # cast string to int
#         )
#         course.save()
#         added.append(data[0])
#     except Exception as e:
#         failed.append({"id": data[0], "error": str(e)})

#     return jsonify({
#         "added": added,
#         "failed": failed
#     }), 201

@course_bp.route('/course/add', methods=['POST'])
def add_course():
    try:
        data = request.get_json()
        print("Received data:", data)

        course = Course(
            course_code=data['course_id'],
            name=data['course_name'],
            lecture_hours=data['credits']
        )
        course.save()

        return jsonify({"message": "Course added successfully!"}), 201

    except Exception as e:
        print("Error adding course:", str(e))
        return jsonify({"error": str(e)}), 500



@course_bp.route('/course/all', methods=['GET'])
def get_all_courses():
    # Retrieve all courses from the database
    courses = Course.objects.all()
    
    # Transform course data into the required JSON format for the frontend
    courses_data = [
        {
            "course_id": course.course_code,
            "course_name": course.name,
            "credits": course.lecture_hours  # assuming 'credits' is a field in the course model
        }
        for course in courses
    ]
    
    return jsonify(courses_data), 200