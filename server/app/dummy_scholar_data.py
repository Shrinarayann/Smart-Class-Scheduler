from mongoengine import connect
import sys
from .models import Course, Teacher, ResearchScholar
import os
# Connect to MongoDB
connect(db='university_scheduler',host=os.getenv('MONGO_URI'))


def clear_data():
    """Clear existing data"""
    print("Clearing existing data...")
    Course.objects.delete()
    Teacher.objects.delete()
    ResearchScholar.objects.delete()

def populate_data():
    """Populate the database with test data"""
    # Create courses
    print("Creating courses...")
    courses = {
        "CS101": Course(course_code="CS101", name="Introduction to Computer Science", lecture_hours=3),
        "CS201": Course(course_code="CS201", name="Data Structures", lecture_hours=4),
        "CS301": Course(course_code="CS301", name="Algorithms", lecture_hours=3),
        "CS401": Course(course_code="CS401", name="Artificial Intelligence", lecture_hours=3),
        "MATH101": Course(course_code="MATH101", name="Calculus I", lecture_hours=3),
        "MATH201": Course(course_code="MATH201", name="Linear Algebra", lecture_hours=3)
    }
    
    # Save courses
    for course in courses.values():
        course.save()
    
    # Create teachers
    print("Creating teachers...")
    teachers = {
        "T001": Teacher(
            teacher_id="T001",
            name="Dr. Smith",
            email="smith@university.edu",
            department="Computer Science",
            teachable_courses=[courses["CS101"], courses["CS201"]]
        ),
        "T002": Teacher(
            teacher_id="T002",
            name="Dr. Johnson",
            email="johnson@university.edu",
            department="Computer Science",
            teachable_courses=[courses["CS301"], courses["CS401"]]
        ),
        "T003": Teacher(
            teacher_id="T003",
            name="Dr. Williams",
            email="williams@university.edu",
            department="Mathematics",
            teachable_courses=[courses["MATH101"], courses["MATH201"]]
        )
    }
    
    # Save teachers
    for teacher in teachers.values():
        teacher.save()
    
    # Create research scholars
    print("Creating research scholars...")
    scholars = [
        ResearchScholar(
            scholar_id="RS001",
            name="Alex Johnson",
            TA_courses=[courses["CS101"], courses["CS201"]],
            supervisor_id=teachers["T001"]
        ),
        ResearchScholar(
            scholar_id="RS002",
            name="Samantha Lee",
            TA_courses=[courses["CS101"], courses["CS301"]],
            supervisor_id=teachers["T002"]
        ),
        ResearchScholar(
            scholar_id="RS003",
            name="Michael Chen",
            TA_courses=[courses["CS201"], courses["CS401"]],
            supervisor_id=teachers["T001"]
        ),
        ResearchScholar(
            scholar_id="RS004",
            name="Emma Garcia",
            TA_courses=[courses["MATH101"]],
            supervisor_id=teachers["T003"]
        ),
        ResearchScholar(
            scholar_id="RS005",
            name="James Wilson",
            TA_courses=[courses["MATH101"], courses["MATH201"]],
            supervisor_id=teachers["T003"]
        ),
        ResearchScholar(
            scholar_id="RS006",
            name="Olivia Brown",
            TA_courses=[courses["CS401"], courses["CS301"]],
            supervisor_id=teachers["T002"]
        )
    ]
    
    # Save scholars
    for scholar in scholars:
        scholar.save()
    
    print(f"Created {len(courses)} courses, {len(teachers)} teachers, and {len(scholars)} research scholars")

def print_data():
    """Print the populated data for verification"""
    # Print courses
    print("\n=== COURSES ===")
    for course in Course.objects:
        print(f"- {course.course_code}: {course.name} ({course.lecture_hours} hours)")
    
    # Print teachers
    print("\n=== TEACHERS ===")
    for teacher in Teacher.objects:
        teachable = ", ".join([c.course_code for c in teacher.teachable_courses])
        print(f"- {teacher.name} ({teacher.teacher_id}): Department: {teacher.department}, Teaches: {teachable}")
    
    # Print scholars
    print("\n=== RESEARCH SCHOLARS ===")
    for scholar in ResearchScholar.objects:
        supervisor = Teacher.objects.get(id=scholar.supervisor_id.id)
        ta_courses = ", ".join([c.course_code for c in scholar.TA_courses])
        print(f"- {scholar.name} ({scholar.scholar_id}): Supervisor: {supervisor.name}, TA for: {ta_courses}")

def bipartite_graph_info():
    """Display information about the bipartite graph"""
    print("\n=== BIPARTITE GRAPH STRUCTURE ===")
    
    # Count how many scholars can TA each course
    course_scholars = {}
    for course in Course.objects:
        course_scholars[course.course_code] = []
    
    for scholar in ResearchScholar.objects:
        for course in scholar.TA_courses:
            course_scholars[course.course_code].append(scholar.name)
    
    print("Potential TAs for each course:")
    for course_code, scholars in course_scholars.items():
        print(f"- {course_code}: {len(scholars)} potential TAs ({', '.join(scholars)})")
    
    # Count how many courses each scholar can TA
    print("\nCourses each scholar can TA:")
    for scholar in ResearchScholar.objects:
        courses = [c.course_code for c in scholar.TA_courses]
        print(f"- {scholar.name}: {len(courses)} courses ({', '.join(courses)})")

if __name__ == "__main__":
    print("Populating test data for TA assignment algorithm...")
    
    # Check if user wants to clear existing data
    if len(sys.argv) > 1 and sys.argv[1] == "--keep":
        print("Keeping existing data...")
    else:
        clear_data()
    
    # Populate with test data
    populate_data()
    
    # Print the data for verification
    print_data()
    
    # Show bipartite graph information
    bipartite_graph_info()
    
    print("\nData population complete. Run the TA assignment algorithm with:")
    print("python test_ta_assignment.py")