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
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    
    # Base date for creating time slots (we just care about time part)
    base_date = datetime(2025, 1, 1)
    
    slot_count = 0
    
    for day in days:
        # Morning sessions
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
        
        # Lunch break
        lunch_slot_id = f"{day.lower()}_lunch"
        lunch_start = current_time
        lunch_end = lunch_start + timedelta(hours=1)
        
        TimeSlot(
            slot_id=lunch_slot_id,
            day=day,
            start_time=lunch_start,
            end_time=lunch_end,
            is_break=True
        ).save()
        
        current_time = lunch_end
        
        # Afternoon sessions
        for i in range(3):
            is_break = False
            slot_id = f"{day.lower()}_slot_{i+5}"
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
            
            # Add a break after 2nd afternoon session
            if i == 1:
                break_slot_id = f"{day.lower()}_break_2"
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
        Room(room_id="A102", capacity=25),
        Room(room_id="B201", capacity=40),
        Room(room_id="B202", capacity=35),
        Room(room_id="C301", capacity=60)
    ]
    for room in rooms:
        room.save()
    print(f"Created {len(rooms)} rooms.")
    
    # Create courses
    courses = [
        Course(course_code="CS101", name="Introduction to Programming", lecture_hours=3),
        Course(course_code="CS201", name="Data Structures", lecture_hours=4),
        Course(course_code="MATH101", name="Calculus I", lecture_hours=3),
        Course(course_code="MATH201", name="Linear Algebra", lecture_hours=3),
        Course(course_code="PHYS101", name="Physics I", lecture_hours=4),
        Course(course_code="ENG101", name="English Composition", lecture_hours=2)
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
            teachable_courses=[courses[0], courses[1]]  # CS101, CS201
        ),
        Teacher(
            teacher_id="T002", 
            name="Dr. Johnson", 
            email="johnson@university.edu", 
            department="Mathematics", 
            teachable_courses=[courses[2], courses[3]]  # MATH101, MATH201
        ),
        Teacher(
            teacher_id="T003", 
            name="Dr. Brown", 
            email="brown@university.edu", 
            department="Physics", 
            teachable_courses=[courses[4]]  # PHYS101
        ),
        Teacher(
            teacher_id="T004", 
            name="Prof. Davis", 
            email="davis@university.edu", 
            department="English", 
            teachable_courses=[courses[5]]  # ENG101
        )
    ]
    for teacher in teachers:
        teacher.save()
    print(f"Created {len(teachers)} teachers.")
    
    # Create students with enrolled_courses field
    students = [
        # Computer Science Students
        Student(
            student_id="S001", 
            name="John Doe", 
            email="john@university.edu", 
            major="Computer Science", 
            year=2,
            enrolled_courses=[courses[0], courses[2], courses[4]]  # CS101, MATH101, PHYS101
        ),
        Student(
            student_id="S002", 
            name="Jane Smith", 
            email="jane@university.edu", 
            major="Computer Science", 
            year=2,
            enrolled_courses=[courses[0], courses[2], courses[5]]  # CS101, MATH101, ENG101
        ),
        Student(
            student_id="S003", 
            name="Bob Johnson", 
            email="bob@university.edu", 
            major="Computer Science", 
            year=3,
            enrolled_courses=[courses[1], courses[3], courses[5]]  # CS201, MATH201, ENG101
        ),
        
        # Mathematics Students
        Student(
            student_id="S004", 
            name="Alice Brown", 
            email="alice@university.edu", 
            major="Mathematics", 
            year=2,
            enrolled_courses=[courses[0], courses[2], courses[4]]  # CS101, MATH101, PHYS101
        ),
        Student(
            student_id="S005", 
            name="Charlie Davis", 
            email="charlie@university.edu", 
            major="Mathematics", 
            year=1,
            enrolled_courses=[courses[2], courses[4], courses[5]]  # MATH101, PHYS101, ENG101
        ),
        
        # Physics Students
        Student(
            student_id="S006", 
            name="Diana Miller", 
            email="diana@university.edu", 
            major="Physics", 
            year=3,
            enrolled_courses=[courses[3], courses[4], courses[1]]  # MATH201, PHYS101, CS201
        ),
        Student(
            student_id="S007", 
            name="Edward Wilson", 
            email="edward@university.edu", 
            major="Physics", 
            year=2,
            enrolled_courses=[courses[2], courses[4], courses[5]]  # MATH101, PHYS101, ENG101
        ),
        
        # English Students
        Student(
            student_id="S008", 
            name="Fiona Taylor", 
            email="fiona@university.edu", 
            major="English", 
            year=4,
            enrolled_courses=[courses[5], courses[0], courses[2]]  # ENG101, CS101, MATH101
        ),
        Student(
            student_id="S009", 
            name="George Robinson", 
            email="george@university.edu", 
            major="English", 
            year=2,
            enrolled_courses=[courses[5], courses[3]]  # ENG101, MATH201
        ),
        Student(
            student_id="S010", 
            name="Hannah White", 
            email="hannah@university.edu", 
            major="English", 
            year=3,
            enrolled_courses=[courses[5], courses[4]]  # ENG101, PHYS101
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
    create_time_slots()
    populate_dummy_data()
    print("Database populated successfully!")