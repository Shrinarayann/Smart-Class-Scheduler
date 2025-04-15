from flask import Blueprint, request, jsonify
from ..models import Student  

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
            student = Student(
                student_id=s[0],
                name=s[1],
                email=s[2],
                major=s[3],
                year=int(s[4])
            )
            student.save()
            added.append(s[0])  # or append whole student info if needed
        except Exception as e:
            failed.append({"id": s[0], "error": str(e)})

    return jsonify({
        "added": added,
        "failed": failed
    }), 201
