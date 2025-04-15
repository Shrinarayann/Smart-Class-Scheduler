from mongoengine import connect
from .models import Room, Teacher, Student, Course, TimeSlot, Schedule
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to MongoDB
connect(db='university_scheduler', host=os.getenv('MONGO_URI'))

def clear_database():
    """Clear all collections in the database"""
    Room.objects.delete()
    Teacher.objects.delete()
    Student.objects.delete()
    Course.objects.delete()
    TimeSlot.objects.delete()
    Schedule.objects.delete()
    print("Database cleared.")

def create_simplified_time_slots():
    """Create a small number of time slots for faster scheduling"""
    days = ['Monday', 'Tuesday', 'Wednesday']  # Reduced to 3 days
    
    # Base date for creating time slots (we just care about time part)
    base_date = datetime(2025, 1, 1)
    
    slot_count = 0
    
    for day in days:
        # Just 4 slots per day (2 morning, 2 afternoon)
        slots = [
            (9, 0),   # 9:00 AM
            (11, 0),  # 11:00 AM
            (13, 0),  # 1:00 PM
            (15, 0)   # 3:00 PM
        ]
        
        for i, (hour, minute) in enumerate(slots):
            slot_id = f"{day.lower()}_slot_{i+1}"
            start_time = datetime(base_date.year, base_date.month, base_date.day, hour, minute)
            end_time = start_time + timedelta(hours=1)
            
            TimeSlot(
                slot_id=slot_id,
                day=day,
                start_time=start_time,
                end_time=end_time,
                is_break=False
            ).save()
            slot_count += 1
    
    print(f"Created {slot_count} time slots.")

def populate_simplified_data():
    """Populate with minimal data for quick convergence"""
    # Create rooms - more rooms than needed for flexibility
    rooms = [
        Room(room_id="A101", capacity=30),
        Room(room_id="A102", capacity=30),
        Room(room_id="B201", capacity=40)
    ]
    for room in rooms:
        room.save()
    print(f"Created {len(rooms)} rooms.")
    
    # Create courses with minimal lecture hours
    courses = [
        Course(course_code="CS101", name="Introduction to Programming", lecture_hours=2),
        Course(course_code="MATH101", name="Calculus I", lecture_hours=2),
        Course(course_code="ENG101", name="English Composition", lecture_hours=1)
    ]
    for course in courses:
        course.save()
    print(f"Created {len(courses)} courses.")

    # Create teachers with non-overlapping teachable courses
    teachers = [
        Teacher(
            teacher_id="T001", 
            name="Dr. Smith", 
            email="smith@university.edu", 
            department="Computer Science", 
            teachable_courses=[courses[0]]  # CS101 only
        ),
        Teacher(
            teacher_id="T002", 
            name="Dr. Johnson", 
            email="johnson@university.edu", 
            department="Mathematics", 
            teachable_courses=[courses[1]]  # MATH101 only
        ),
        Teacher(
            teacher_id="T003", 
            name="Prof. Davis", 
            email="davis@university.edu", 
            department="English", 
            teachable_courses=[courses[2]]  # ENG101 only
        )
    ]
    for teacher in teachers:
        teacher.save()
    print(f"Created {len(teachers)} teachers.")
    
    # Create students with minimal course overlaps
    # Group 1: CS101 + MATH101
    # Group 2: CS101 + ENG101
    # Group 3: MATH101 + ENG101
    students = [
        # Group 1
        Student(
            student_id="S001", 
            name="John Doe", 
            email="john@university.edu", 
            major="Computer Science", 
            year=2,
            enrolled_courses=[courses[0], courses[1]]  # CS101, MATH101
        ),
        Student(
            student_id="S002", 
            name="Jane Smith", 
            email="jane@university.edu", 
            major="Computer Science", 
            year=2,
            enrolled_courses=[courses[0], courses[1]]  # CS101, MATH101
        ),
        # Group 2
        Student(
            student_id="S003", 
            name="Bob Johnson", 
            email="bob@university.edu", 
            major="Computer Science", 
            year=3,
            enrolled_courses=[courses[0], courses[2]]  # CS101, ENG101
        ),
        Student(
            student_id="S004", 
            name="Alice Brown", 
            email="alice@university.edu", 
            major="English", 
            year=2,
            enrolled_courses=[courses[0], courses[2]]  # CS101, ENG101
        ),
        # Group 3
        Student(
            student_id="S005", 
            name="Charlie Davis", 
            email="charlie@university.edu", 
            major="Mathematics", 
            year=1,
            enrolled_courses=[courses[1], courses[2]]  # MATH101, ENG101
        ),
        Student(
            student_id="S006", 
            name="Diana Miller", 
            email="diana@university.edu", 
            major="Mathematics", 
            year=3,
            enrolled_courses=[courses[1], courses[2]]  # MATH101, ENG101
        )
    ]
    for student in students:
        student.save()
    print(f"Created {len(students)} students.")
    
    # Print summary of student enrollments
    print("\nStudent Enrollment Summary:")
    for course in courses:
        enrolled_students = Student.objects(enrolled_courses=course)
        print(f"{course.course_code}: {enrolled_students.count()} students enrolled")

if __name__ == "__main__":
    clear_database()
    create_simplified_time_slots()
    populate_simplified_data()
    print("Database populated successfully with simplified data for quick scheduling!")