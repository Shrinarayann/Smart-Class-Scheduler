from .scheduler import SchedulerController
from ..models import Schedule, Section, TimeSlot, Room, Course, Teacher, Student
from mongoengine import connect
import time
import os
from dotenv import load_dotenv
#Temporary connect for testing...HAS TO BE REMOVED
connect(db='university_scheduler',host=os.getenv('MONGO_URI'))
print('Database connected')

def display_schedule():
    """Display the generated schedule in a readable format"""
    print("\n=== GENERATED SCHEDULE ===\n")
    
    # Get all courses for reference
    courses = Course.objects.all()
    for course in courses:
        print(f"\n--- {course.course_code}: {course.name} ---")
        
        # Find all sections for this course
        sections = Section.objects(course=course)
        for section in sections:
            print(f"  Section: {section.section_id}")
            print(f"  Teacher: {section.teacher.name}")
            print(f"  Students: {len(section.enrolled_students)}")
            
            # Find all scheduled sessions for this section
            schedules = Schedule.objects(section=section).order_by('time_slot.day', 'time_slot.start_time')
            
            if not schedules:
                print("  No sessions scheduled.")
            else:
                print("  Sessions:")
                for schedule in schedules:
                    print(f"    - {schedule.time_slot.day} {schedule.time_slot.start_time.strftime('%H:%M')} - {schedule.time_slot.end_time.strftime('%H:%M')} in Room {schedule.room.room_id}")
            
            print("")

def display_by_day():
    """Display the schedule organized by day"""
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
                    print(f"    - {schedule.section.course.course_code} (Section {schedule.section.section_id}) in Room {schedule.room.room_id}")
                    print(f"      Teacher: {schedule.section.teacher.name}")

def verify_constraints():
    """Verify that all scheduling constraints are satisfied"""
    print("\n=== CONSTRAINT VERIFICATION ===\n")
    
    all_schedules = Schedule.objects.all()
    violations = []
    
    # Check that each course has the correct number of sessions
    print("Checking course session counts...")
    for course in Course.objects.all():
        sections = Section.objects(course=course)
        for section in sections:
            session_count = Schedule.objects(section=section).count()
            if session_count != course.lecture_hours:
                violations.append(f"- Section {section.section_id} has {session_count} sessions but should have {course.lecture_hours}")
    
    # Check for teacher conflicts
    print("Checking for teacher conflicts...")
    for schedule1 in all_schedules:
        for schedule2 in all_schedules:
            if (schedule1.id != schedule2.id and 
                schedule1.time_slot.id == schedule2.time_slot.id and
                schedule1.section.teacher.id == schedule2.section.teacher.id):
                violations.append(f"- Teacher conflict: {schedule1.section.teacher.name} is scheduled for two sections at {schedule1.time_slot}")
    
    # Check for student conflicts
    print("Checking for student conflicts...")
    for schedule1 in all_schedules:
        for schedule2 in all_schedules:
            if schedule1.id != schedule2.id and schedule1.time_slot.id == schedule2.time_slot.id:
                # Get student IDs for both sections
                students1 = set(str(student.id) for student in schedule1.section.enrolled_students)
                students2 = set(str(student.id) for student in schedule2.section.enrolled_students)
                
                # Check for overlaps
                overlaps = students1.intersection(students2)
                if overlaps:
                    student_names = [Student.objects.get(id=student_id).name for student_id in overlaps]
                    violations.append(f"- Student conflict: {', '.join(student_names)} in two sections at {schedule1.time_slot}")
    
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
                schedules = Schedule.objects(time_slot=slot)
                for schedule in schedules:
                    if schedule.section.teacher.id == teacher.id:
                        session_count += 1
            
            if session_count > 5:
                violations.append(f"- Teacher overload: {teacher.name} has {session_count} sessions on {day} (max is 5)")
    
    # Report results
    if violations:
        print("\nConstraint violations found:")
        for violation in violations:
            print(violation)
    else:
        print("\nNo constraint violations found! The schedule is valid.")

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
        
        # Display the schedule in different formats
        display_schedule()
        display_by_day()
        
        # Verify constraints are satisfied
        verify_constraints()
    else:
        print("\nFailed to generate a valid schedule. The constraints may be too tight.")

if __name__ == "__main__":
    run_scheduler()