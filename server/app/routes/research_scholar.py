from flask import Blueprint, request, jsonify
from ..models import ResearchScholar,Course

research_bp = Blueprint("research", __name__)

@research_bp.route('/add-research-scholar', methods=['POST'])
def add_research_scholars():
    data = request.get_json()

    if "ResearchScholar" not in data:
        return jsonify({"error": "Missing 'ResearchScholar' key"}), 400

    scholars = data["ResearchScholar"]
    added = []
    failed = []

    for s in scholars:
        try:
            # Lookup the courses by their course codes
            course_codes = s[2]
            courses = []

            for code in course_codes:
                course = Course.objects(course_code=code).first()  # Look up Course by course_code
                if not course:
                    raise ValueError(f"Course '{code}' not found")
                courses.append(course)

            scholar = ResearchScholar(
                scholar_id=s[0],
                name=s[1],
                TA_courses=courses
            )
            scholar.save()
            added.append(s[0])
        
        except Exception as e:
            failed.append({"id": s[0], "error": str(e)})

    return jsonify({
        "added": added,
        "failed": failed
    }), 201
