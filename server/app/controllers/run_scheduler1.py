from .scheduler1 import SchedulerController
from ..models import Schedule, TimeSlot, Room, Course, Teacher, Student
from mongoengine import connect
import time
import os
from dotenv import load_dotenv

# Connect to MongoDB
load_dotenv()
#connect(db='university_scheduler', host=os.getenv('MONGO_URI'))
#print('Database connected')

def verify_constraints():
    """Verify that all scheduling constraints are satisfied"""
    print("\n=== CONSTRAINT VERIFICATION ===\n")
    
    all_schedules = Schedule.objects.all()
    violations = []
    
    # Check that each course has the correct number of sessions
    print("Checking course session counts...")
    for course in Course.objects.all():
        session_count = Schedule.objects(course=course).count()
        if session_count != course.lecture_hours:
            violations.append(f"- Course {course.course_code} has {session_count} sessions but should have {course.lecture_hours}")
    
    # Check for teacher conflicts
    print("Checking for teacher conflicts...")
    for schedule1 in all_schedules:
        for schedule2 in all_schedules:
            if (schedule1.id != schedule2.id and 
                schedule1.time_slot.id == schedule2.time_slot.id and
                schedule1.teacher.id == schedule2.teacher.id):
                violations.append(f"- Teacher conflict: {schedule1.teacher.name} is scheduled for two courses at {schedule1.time_slot}")
    
    # Check for student conflicts
    print("Checking for student conflicts...")
    for schedule1 in all_schedules:
        for schedule2 in all_schedules:
            if schedule1.id != schedule2.id and schedule1.time_slot.id == schedule2.time_slot.id:
                # Get students enrolled in both courses
                course1 = schedule1.course
                course2 = schedule2.course
                
                # Find students enrolled in both courses
                students_in_both_courses = Student.objects(enrolled_courses__all=[course1, course2])
                
                if students_in_both_courses:
                    student_names = [s.name for s in students_in_both_courses]
                    violations.append(f"- Student conflict: {', '.join(student_names)} enrolled in both {course1.course_code} and {course2.course_code} at the same time")
    
    # Check for room conflicts
    print("Checking for room conflicts...")
    for schedule1 in all_schedules:
        for schedule2 in all_schedules:
            if (schedule1.id != schedule2.id and 
                schedule1.time_slot.id == schedule2.time_slot.id and
                schedule1.room.id == schedule2.room.id):
                violations.append(f"- Room conflict: {schedule1.room.room_id} double-booked at {schedule1.time_slot}")
    
    # Check for teacher daily teaching limits
    print("Checking teacher daily teaching limits...")
    for teacher in Teacher.objects.all():
        for day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']:
            # Get all time slots for this day
            day_slots = TimeSlot.objects(day=day, is_break=False)
            
            # Count how many sessions this teacher has on this day
            session_count = 0
            for slot in day_slots:
                sessions = Schedule.objects(teacher=teacher, time_slot=slot)
                session_count += sessions.count()
            
            if session_count > 5:
                violations.append(f"- Teacher overload: {teacher.name} has {session_count} sessions on {day} (max is 5)")
    
    # Report results
    if violations:
        print("\nConstraint violations found:")
        for violation in violations:
            print(violation)
    else:
        print("\nNo constraint violations found! The schedule is valid.")

def display_student_schedule(student_id):
    """Return the schedule for a specific student in JSON format"""
    try:
        student = Student.objects.get(student_id=student_id)
        
        # Create a dictionary to store student info
        schedule_data = {
            "student_id": student.student_id,
            "student_name": student.name,
            "courses": []  # This will store the enrolled courses
        }

        # Get all courses the student is enrolled in
        courses = student.enrolled_courses
        schedule_data["courses"] = [course.course_code for course in courses]
        
        # Get schedules for these courses
        schedules = []
        for course in courses:
            course_schedules = Schedule.objects(course=course)
            schedules.extend(course_schedules)
        
        # Sort by day and time
        days_order = {'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5}
        schedules.sort(key=lambda s: (days_order[s.time_slot.day], s.time_slot.start_time))
        
        # Organize by day
        current_day = None
        day_schedule = {}
        for schedule in schedules:
            if schedule.time_slot.day != current_day:
                current_day = schedule.time_slot.day
                day_schedule[current_day] = []
            
            day_schedule[current_day].append({
                "start_time": schedule.time_slot.start_time.strftime('%H:%M'),
                "end_time": schedule.time_slot.end_time.strftime('%H:%M'),
                "course_code": schedule.course.course_code,
                "session_number": schedule.session_number,
                "room": schedule.room.room_id,
                "teacher": schedule.teacher.name
            })

        # Adding the day-wise schedule to the response
        schedule_data['schedule'] = day_schedule

        return schedule_data
        
    except Student.DoesNotExist:
        return None



def display_teacher_schedule(teacher_id):
    """Display the schedule for a specific teacher"""
    try:
        teacher = Teacher.objects.get(teacher_id=teacher_id)
        print(f"\n=== SCHEDULE FOR {teacher.name} ===\n")
        
        # Get all schedules for this teacher
        # Use order_by instead of sort
        schedules = Schedule.objects(teacher=teacher).order_by('time_slot.day', 'time_slot.start_time')
        
        # Organize by day
        current_day = None
        for schedule in schedules:
            if schedule.time_slot.day != current_day:
                current_day = schedule.time_slot.day
                print(f"\n{current_day}:")
            
            print(f"  {schedule.time_slot.start_time.strftime('%H:%M')} - {schedule.time_slot.end_time.strftime('%H:%M')}: {schedule.course.course_code} (Session {schedule.session_number})")
            print(f"  Room: {schedule.room.room_id}")
            print(f"  Course: {schedule.course.name}")
            print()
        
    except Teacher.DoesNotExist:
        print(f"No teacher found with ID {teacher_id}")

def display_by_day():
    """Display the complete schedule organized by day"""
    print("\n=== SCHEDULE BY DAY ===\n")
    
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    
    for day in days:
        # Find all time slots for this day that are not breaks
        time_slots = TimeSlot.objects(day=day, is_break=False).order_by('start_time')
        
        if not time_slots:
            continue
            
        print(f"\n--- {day} ---")
        
        for time_slot in time_slots:
            print(f"\n  {time_slot.start_time.strftime('%H:%M')} - {time_slot.end_time.strftime('%H:%M')}")
            
            # Find all schedules for this time slot
            schedules = Schedule.objects(time_slot=time_slot)
            
            if not schedules:
                print("    No classes scheduled.")
            else:
                for schedule in schedules:
                    print(f"    - {schedule.course.course_code} (Session {schedule.session_number}) in Room {schedule.room.room_id}")
                    print(f"      Teacher: {schedule.teacher.name}")
                    print(f"      Course: {schedule.course.name}")
                    enrolled_count = Student.objects(enrolled_courses=schedule.course).count()
                    print(f"      Students: {enrolled_count}")

def run_scheduler():
    """Run the scheduler and display the results"""
    print("Initializing scheduler...")
    scheduler = SchedulerController()
    
    print("Starting scheduling algorithm...")
    start_time = time.time()
    success = scheduler.generate_schedule()
    end_time = time.time()
    
    if success:
        print(f"\nSchedule generated successfully in {end_time - start_time:.2f} seconds!")
        
        # Verify constraints are satisfied
        verify_constraints()
        
        # Display schedule by day
        display_by_day()
        
        # Display schedule for a sample student
        sample_student = Student.objects.first()
        if sample_student:
            display_student_schedule(sample_student.student_id)
            
        # Display schedule for a sample teacher
        sample_teacher = Teacher.objects.first()
        if sample_teacher:
            display_teacher_schedule(sample_teacher.teacher_id)
    else:
        print("\nFailed to generate a valid schedule. The constraints may be too tight.")

if __name__ == "__main__":
    run_scheduler()