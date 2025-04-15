from flask import Blueprint, request, jsonify
from ..models import ResearchScholar,Course,Teacher

research_bp = Blueprint('research_scholar', __name__)

@research_bp.route('/api/v1/scholar/add', methods=['POST'])
def add_research_scholars():
    try:
        data = request.get_json()

        if not data or 'ResearchScholar' not in data:
            return jsonify({'error': 'Missing ResearchScholar data'}), 400

        scholars = data['ResearchScholar']
        inserted = []

        for scholar in scholars:
            scholar_id, name, ta_course_codes, supervisor_id = scholar

            # Fetch referenced Course documents
            courses = Course.objects(course_code__in=ta_course_codes)
            if len(courses) != len(ta_course_codes):
                return jsonify({'error': f'One or more TA course codes not found: {ta_course_codes}'}), 400

            # Fetch the Teacher document for supervisor
            supervisor = Teacher.objects(teacher_id=supervisor_id).first()
            if not supervisor:
                return jsonify({'error': f'Supervisor with ID {supervisor_id} not found'}), 400

            # Create and save the ResearchScholar document
            rs = ResearchScholar(
                scholar_id=scholar_id,
                name=name,
                TA_courses=courses,
                supervisor_id=supervisor
            )
            rs.save()
            inserted.append(str(rs.id))

        return jsonify({'message': 'Research scholars added successfully', 'ids': inserted}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
