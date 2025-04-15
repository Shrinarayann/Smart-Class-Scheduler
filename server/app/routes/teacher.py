from flask import Blueprint, request, jsonify
from ..models import Teacher,Course

teacher_bp = Blueprint("teacher", __name__)

@teacher_bp.route('/teacher/add', methods=['POST'])
def add_teachers():
    data = request.get_json()

    if "Teacher" not in data:
        return jsonify({"error": "Missing 'Teacher' key"}), 400

    teachers = data["Teacher"]
    added = []
    failed = []

    for t in teachers:
        try:
            course_codes = t[4]
            courses = []

            for code in course_codes:
                course = Course.objects(course_code=code).first()
                if not course:
                    raise ValueError(f"Course '{code}' not found")
                courses.append(course)

            teacher = Teacher(
                teacher_id=t[0],
                name=t[1],
                email=t[2],
                department=t[3],
                teachable_courses=courses
            )
            teacher.save()
            added.append(t[0])
        
        except Exception as e:
            failed.append({"id": t[0], "error": str(e)})

    return jsonify({
        "added": added,
        "failed": failed
    }), 201
