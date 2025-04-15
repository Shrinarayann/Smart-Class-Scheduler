from flask import Blueprint, request, jsonify
from ..models import Course

course_bp = Blueprint("course", __name__)

@course_bp.route('/add-course', methods=['POST'])
def add_courses():
    data = request.get_json()

    if "Course" not in data:
        return jsonify({"error": "Missing 'Course' key"}), 400

    courses = data["Course"]
    added = []
    failed = []

    for c in courses:
        try:
            course = Course(
                course_code=c[0],
                name=c[1],
                lecture_hours=int(c[2])  # cast string to int
            )
            course.save()
            added.append(c[0])
        except Exception as e:
            failed.append({"id": c[0], "error": str(e)})

    return jsonify({
        "added": added,
        "failed": failed
    }), 201
