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

def create_time_slots():
    """Create time slots for Monday-Friday, 9am-4pm with appropriate breaks"""
    days = ['Monday', 'Tuesday', 'Wednesday']  # Reduced to 3 days
    
    # Base date for creating time slots (we just care about time part)
    base_date = datetime(2025, 1, 1)
    
    slot_count = 0
    
    for day in days:
        # Morning sessions only - 4 slots
        current_time = datetime(base_date.year, base_date.month, base_date.day, 9, 0)
        
        for i in range(4):
            is_break = False
            slot_id = f"{day.lower()}_slot_{i+1}"
            start_time = current_time
            
            # Regular 1-hour session
            end_time = start_time + timedelta(hours=1)
            
            # Create the time slot
            TimeSlot(
                slot_id=slot_id,
                day=day,
                start_time=start_time,
                end_time=end_time,
                is_break=is_break
            ).save()
            slot_count += 1
            
            # Move to next slot
            current_time = end_time
            
            # Add a break after 2nd session
            if i == 1:
                break_slot_id = f"{day.lower()}_break_1"
                break_start = current_time
                break_end = break_start + timedelta(minutes=15)
                
                TimeSlot(
                    slot_id=break_slot_id,
                    day=day,
                    start_time=break_start,
                    end_time=break_end,
                    is_break=True
                ).save()
                
                current_time = break_end
    
    print(f"Created {slot_count} regular time slots and appropriate breaks.")

def populate_dummy_data():
    """Populate database with courses, teachers, and students"""
    # Create rooms
    rooms = [
        Room(room_id="A101", capacity=30),
        Room(room_id="A102", capacity=30),
        Room(room_id="B201", capacity=40)
    ]
    for room in rooms:
        room.save()
    print(f"Created {len(rooms)} rooms.")
    
    # Create courses
    courses = [
        Course(course_code="CS101", name="Introduction to Programming", lecture_hours=2),
        Course(course_code="MATH101", name="Calculus I", lecture_hours=2),
        Course(course_code="ENG101", name="English Composition", lecture_hours=1),
        Course(course_code="CS202", name="Data Structures", lecture_hours=2),
        Course(course_code="PHYS101", name="Physics I", lecture_hours=2)
    ]
    for course in courses:
        course.save()
    print(f"Created {len(courses)} courses.")

    # Create teachers
    teachers = [
        Teacher(
            teacher_id="T001", 
            name="Dr. Smith", 
            email="smith@university.edu", 
            department="Computer Science", 
            teachable_courses=[courses[0], courses[3]]  # CS101, CS202
        ),
        Teacher(
            teacher_id="T002", 
            name="Dr. Johnson", 
            email="johnson@university.edu", 
            department="Mathematics", 
            teachable_courses=[courses[1]]  # MATH101
        ),
        Teacher(
            teacher_id="T003", 
            name="Prof. Davis", 
            email="davis@university.edu", 
            department="English", 
            teachable_courses=[courses[2]]  # ENG101
        ),
        Teacher(
            teacher_id="T004", 
            name="Dr. Wilson", 
            email="wilson@university.edu", 
            department="Physics", 
            teachable_courses=[courses[4]]  # PHYS101
        )
    ]
    for teacher in teachers:
        teacher.save()
    print(f"Created {len(teachers)} teachers.")
    
    # Create students with enrolled_courses field
    students = [
        # CS students
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
            enrolled_courses=[courses[0], courses[4]]  # CS101, PHYS101
        ),
        # Math students
        Student(
            student_id="S003", 
            name="Bob Johnson", 
            email="bob@university.edu", 
            major="Mathematics", 
            year=3,
            enrolled_courses=[courses[1], courses[4]]  # MATH101, PHYS101
        ),
        Student(
            student_id="S004", 
            name="Alice Brown", 
            email="alice@university.edu", 
            major="Mathematics", 
            year=2,
            enrolled_courses=[courses[1], courses[2]]  # MATH101, ENG101
        ),
        # English students
        Student(
            student_id="S005", 
            name="Charlie Davis", 
            email="charlie@university.edu", 
            major="English", 
            year=1,
            enrolled_courses=[courses[2], courses[3]]  # ENG101, CS202
        ),
        Student(
            student_id="S006", 
            name="Diana Miller", 
            email="diana@university.edu", 
            major="English", 
            year=3,
            enrolled_courses=[courses[2], courses[0]]  # ENG101, CS101
        ),
        # Advanced CS student
        Student(
            student_id="S007", 
            name="Emma Wilson", 
            email="emma@university.edu", 
            major="Computer Science", 
            year=3,
            enrolled_courses=[courses[3], courses[4]]  # CS202, PHYS101
        )
    ]
    for student in students:
        student.save()
    print(f"Created {len(students)} students.")
    
    # Print summary of student enrollments
    print("\nStudent Enrollment Summary:")
    for course in courses:
        enrolled_students = Student.objects(enrolled_courses=course)
        print(f"{course.course_code}: {len(enrolled_students)} students enrolled")
        for student in enrolled_students:
            print(f"  - {student.name}")

if __name__ == "__main__":
    clear_database()
    create_time_slots()
    populate_dummy_data()
    print("Database populated successfully without using Sections!")