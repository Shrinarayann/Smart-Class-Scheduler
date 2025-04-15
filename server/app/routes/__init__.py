from .research_scholar import research_bp
from .student import student_bp
from .teacher import teacher_bp
from .course import course_bp
from .room import room_bp

# Optionally, you can add a list of Blueprints for cleaner registration
blueprints = [research_bp, student_bp, teacher_bp,course_bp,room_bp]
