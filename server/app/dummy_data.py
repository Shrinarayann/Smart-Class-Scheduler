# from models import Room, Teacher, Student, Course, Section, TimeSlot, Schedule, ResearchScholar
# from mongoengine import connect
# from datetime import datetime, timedelta
# import os
# from dotenv import load_dotenv

# load_dotenv()
# # Connect to MongoDB
# connect(db='university_scheduler',host=os.getenv('MONGO_URI'))
# print('COnnected to database')

# def clear_database():
#     """Clear all collections in the database"""
#     Room.objects.delete()
#     Teacher.objects.delete()
#     Student.objects.delete()
#     Course.objects.delete()
#     Section.objects.delete()
#     TimeSlot.objects.delete()
#     Schedule.objects.delete()
#     ResearchScholar.objects.delete()
#     print("Database cleared.")

# def create_time_slots():
#     """Create time slots for Monday-Friday, 9am-4pm with appropriate breaks"""
#     days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    
#     # Base date for creating time slots (we just care about time part)
#     base_date = datetime(2025, 1, 1)
    
#     slot_count = 0
    
#     for day in days:
#         # Morning sessions
#         current_time = datetime(base_date.year, base_date.month, base_date.day, 9, 0)
        
#         # 4 morning sessions with break after 2nd session
#         for i in range(4):
#             is_break = False
#             slot_id = f"{day.lower()}_slot_{i+1}"
#             start_time = current_time
            
#             # Regular 1-hour session
#             end_time = start_time + timedelta(hours=1)
            
#             # Create the time slot
#             TimeSlot(
#                 slot_id=slot_id,
#                 day=day,
#                 start_time=start_time,
#                 end_time=end_time,
#                 is_break=is_break
#             ).save()
#             slot_count += 1
            
#             # Move to next slot
#             current_time = end_time
            
#             # Add 15-minute break after 2nd session
#             if i == 1:
#                 break_slot_id = f"{day.lower()}_break_1"
#                 break_start = current_time
#                 break_end = break_start + timedelta(minutes=15)
                
#                 TimeSlot(
#                     slot_id=break_slot_id,
#                     day=day,
#                     start_time=break_start,
#                     end_time=break_end,
#                     is_break=True
#                 ).save()
                
#                 current_time = break_end
        
#         # Lunch break (1 hour)
#         lunch_slot_id = f"{day.lower()}_lunch"
#         lunch_start = current_time
#         lunch_end = lunch_start + timedelta(hours=1)
        
#         TimeSlot(
#             slot_id=lunch_slot_id,
#             day=day,
#             start_time=lunch_start,
#             end_time=lunch_end,
#             is_break=True
#         ).save()
        
#         current_time = lunch_end
        
#         # Afternoon sessions
#         for i in range(2):
#             slot_id = f"{day.lower()}_slot_{i+5}"
#             start_time = current_time
#             end_time = start_time + timedelta(hours=1)
            
#             TimeSlot(
#                 slot_id=slot_id,
#                 day=day,
#                 start_time=start_time,
#                 end_time=end_time,
#                 is_break=False
#             ).save()
#             slot_count += 1
            
#             current_time = end_time
            
#             # Add 15-minute break after first afternoon session
#             if i == 0:
#                 break_slot_id = f"{day.lower()}_break_2"
#                 break_start = current_time
#                 break_end = break_start + timedelta(minutes=15)
                
#                 TimeSlot(
#                     slot_id=break_slot_id,
#                     day=day,
#                     start_time=break_start,
#                     end_time=break_end,
#                     is_break=True
#                 ).save()
                
#                 current_time = break_end
    
#     print(f"Created {slot_count} regular time slots and appropriate breaks.")

# def populate_dummy_data():
#     """Populate database with dummy data"""
#     # Create rooms
#     rooms = [
#         Room(room_id="A101", capacity=30),
#         Room(room_id="A102", capacity=25),
#         Room(room_id="B201", capacity=40),
#         Room(room_id="B202", capacity=35),
#         Room(room_id="C301", capacity=60)
#     ]
#     for room in rooms:
#         room.save()
#     print(f"Created {len(rooms)} rooms.")
    
#     # Create courses
#     courses = [
#         Course(course_code="CS101", name="Introduction to Programming", lecture_hours=3),
#         Course(course_code="CS201", name="Data Structures", lecture_hours=4),
#         Course(course_code="MATH101", name="Calculus I", lecture_hours=3),
#         Course(course_code="MATH201", name="Linear Algebra", lecture_hours=3),
#         Course(course_code="PHYS101", name="Physics I", lecture_hours=4),
#         Course(course_code="ENG101", name="English Composition", lecture_hours=2)
#     ]
#     for course in courses:
#         course.save()
#     print(f"Created {len(courses)} courses.")
    
#     # Create teachers
#     teachers = [
#         Teacher(
#             teacher_id="T001", 
#             name="Dr. Smith", 
#             email="smith@university.edu", 
#             department="Computer Science", 
#             teachable_courses=[courses[0], courses[1]]
#         ),
#         Teacher(
#             teacher_id="T002", 
#             name="Dr. Johnson", 
#             email="johnson@university.edu", 
#             department="Mathematics", 
#             teachable_courses=[courses[2], courses[3]]
#         ),
#         Teacher(
#             teacher_id="T003", 
#             name="Dr. Brown", 
#             email="brown@university.edu", 
#             department="Physics", 
#             teachable_courses=[courses[4]]
#         ),
#         Teacher(
#             teacher_id="T004", 
#             name="Prof. Davis", 
#             email="davis@university.edu", 
#             department="English", 
#             teachable_courses=[courses[5]]
#         )
#     ]
#     for teacher in teachers:
#         teacher.save()
#     print(f"Created {len(teachers)} teachers.")
    
#     # Create students
#     students = [
#         Student(student_id="S001", name="John Doe", email="john@university.edu", major="Computer Science", year=2),
#         Student(student_id="S002", name="Jane Smith", email="jane@university.edu", major="Computer Science", year=2),
#         Student(student_id="S003", name="Bob Johnson", email="bob@university.edu", major="Mathematics", year=3),
#         Student(student_id="S004", name="Alice Brown", email="alice@university.edu", major="Physics", year=2),
#         Student(student_id="S005", name="Charlie Davis", email="charlie@university.edu", major="English", year=1),
#         Student(student_id="S006", name="Diana Miller", email="diana@university.edu", major="Computer Science", year=3),
#         Student(student_id="S007", name="Edward Wilson", email="edward@university.edu", major="Mathematics", year=2),
#         Student(student_id="S008", name="Fiona Taylor", email="fiona@university.edu", major="Physics", year=4),
#         Student(student_id="S009", name="George Robinson", email="george@university.edu", major="Computer Science", year=2),
#         Student(student_id="S010", name="Hannah White", email="hannah@university.edu", major="English", year=3)
#     ]
#     for student in students:
#         student.save()
#     print(f"Created {len(students)} students.")
    
#     # Create research scholars
#     scholars = [
#         ResearchScholar(scholar_id="RS001", name="TA Smith"),
#         ResearchScholar(scholar_id="RS002", name="TA Johnson")
#     ]
#     for scholar in scholars:
#         scholar.save()
#     print(f"Created {len(scholars)} research scholars.")
    
#     # Create sections
#     sections = [
#         # CS101 has two sections due to popularity
#         Section(
#             section_id="CS101-A",
#             course=courses[0],
#             teacher=teachers[0],
#             enrolled_students=[students[0], students[1], students[5], students[8]],
#             ta=scholars[0]
#         ),
#         Section(
#             section_id="CS101-B",
#             course=courses[0],
#             teacher=teachers[0],
#             enrolled_students=[students[4], students[6], students[9]],
#             ta=scholars[0]
#         ),
#         # Other courses have one section each
#         Section(
#             section_id="CS201-A",
#             course=courses[1],
#             teacher=teachers[0],
#             enrolled_students=[students[0], students[1], students[5], students[8]],
#             ta=scholars[0]
#         ),
#         Section(
#             section_id="MATH101-A",
#             course=courses[2],
#             teacher=teachers[1],
#             enrolled_students=[students[0], students[2], students[6], students[9]],
#             ta=scholars[1]
#         ),
#         Section(
#             section_id="MATH201-A",
#             course=courses[3],
#             teacher=teachers[1],
#             enrolled_students=[students[2], students[3], students[6], students[7]],
#             ta=None
#         ),
#         Section(
#             section_id="PHYS101-A",
#             course=courses[4],
#             teacher=teachers[2],
#             enrolled_students=[students[3], students[4], students[7], students[8]],
#             ta=None
#         ),
#         Section(
#             section_id="ENG101-A",
#             course=courses[5],
#             teacher=teachers[3],
#             enrolled_students=[students[0], students[1], students[2], students[3], students[4], students[5]],
#             ta=None
#         )
#     ]
#     for section in sections:
#         section.save()
#     print(f"Created {len(sections)} sections.")

# if __name__ == "__main__":
#     clear_database()
#     create_time_slots()
#     populate_dummy_data()
#     print("Database populated successfully!")

from mongoengine import connect
from models import Room, Teacher, Student, Course, Section, TimeSlot, Schedule, ResearchScholar
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to MongoDB
connect(db='university_scheduler',host=os.getenv('MONGO_URI'))

def clear_database():
    """Clear all collections in the database"""
    Room.objects.delete()
    Teacher.objects.delete()
    Student.objects.delete()
    Course.objects.delete()
    Section.objects.delete()
    TimeSlot.objects.delete()
    Schedule.objects.delete()
    ResearchScholar.objects.delete()
    print("Database cleared.")

def create_time_slots():
    """Create time slots for Monday-Friday, 9am-4pm with appropriate breaks
    Simplified to have fewer slots for faster scheduling"""
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
    """Populate database with simplified dummy data for quick convergence"""
    # Create rooms - more rooms for flexibility

    rooms = [
        Room(room_id="A101", capacity=30),
        Room(room_id="A102", capacity=30),
        Room(room_id="B201", capacity=40)
    ]
    for room in rooms:
        room.save()
    print(f"Created {len(rooms)} rooms.")
    
    courses = [
        Course(course_code="CS101", name="Introduction to Programming", lecture_hours=2),
        Course(course_code="MATH101", name="Calculus I", lecture_hours=2),
        Course(course_code="ENG101", name="English Composition", lecture_hours=1)
    ]
    for course in courses:
        course.save()
    print(f"Created {len(courses)} courses.")

    teachers = [
        Teacher(
            teacher_id="T001", 
            name="Dr. Smith", 
            email="smith@university.edu", 
            department="Computer Science", 
            teachable_courses=[courses[0]]
        ),
        Teacher(
            teacher_id="T002", 
            name="Dr. Johnson", 
            email="johnson@university.edu", 
            department="Mathematics", 
            teachable_courses=[courses[1]]
        ),
        Teacher(
            teacher_id="T003", 
            name="Prof. Davis", 
            email="davis@university.edu", 
            department="English", 
            teachable_courses=[courses[2]]
        )
    ]
    for teacher in teachers:
        teacher.save()
    print(f"Created {len(teachers)} teachers.")
    
    # Create students - with disjoint course enrollments to minimize conflicts
    students = [
        Student(student_id="S001", name="John Doe", email="john@university.edu", major="Computer Science", year=2),
        Student(student_id="S002", name="Jane Smith", email="jane@university.edu", major="Computer Science", year=2),
        Student(student_id="S003", name="Bob Johnson", email="bob@university.edu", major="Mathematics", year=3),
        Student(student_id="S004", name="Alice Brown", email="alice@university.edu", major="Mathematics", year=2),
        Student(student_id="S005", name="Charlie Davis", email="charlie@university.edu", major="English", year=1),
        Student(student_id="S006", name="Diana Miller", email="diana@university.edu", major="English", year=3)
    ]
    for student in students:
        student.save()
    print(f"Created {len(students)} students.")
    
    # Create research scholars
    # scholars = [
    #     ResearchScholar(scholar_id="RS001", name="TA Smith")
    # ]
    # for scholar in scholars:
    #     scholar.save()
    # print(f"Created {len(scholars)} research scholars.")
    
    # Create sections - with minimal overlap in student enrollment
    sections = [
        Section(
            section_id="CS101-A",
            course=courses[0],
            teacher=teachers[0],
            enrolled_students=[students[0], students[1]],
            #ta=scholars[0]
        ),
        Section(
            section_id="MATH101-A",
            course=courses[1],
            teacher=teachers[1],
            enrolled_students=[students[2], students[3]],
            ta=None
        ),
        Section(
            section_id="ENG101-A",
            course=courses[2],
            teacher=teachers[2],
            enrolled_students=[students[4], students[5]],
            ta=None
        )
    ]
    for section in sections:
        section.save()
    print(f"Created {len(sections)} sections.")

if __name__ == "__main__":
    clear_database()
    create_time_slots()
    populate_dummy_data()
    print("Database populated successfully")