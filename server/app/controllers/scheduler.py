
from ..models import Room, Teacher, Student, Course, Section, TimeSlot, Schedule, ResearchScholar
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SchedulerController:
    def __init__(self):
        self.sessions_to_schedule = []  # List of (section, session_number) tuples
        self.time_slots = {}  # Dictionary of available time slots
        self.rooms = {}  # Dictionary of available rooms
        self.schedule = {}  # Final schedule as a dictionary
        self.MAX_SESSIONS_PER_TEACHER_PER_DAY = 5  # Maximum number of sessions a teacher can teach per day

    def initialize_data(self):
        """Load data from the database and prepare for scheduling"""
        # Load rooms
        for room in Room.objects:
            self.rooms[room.id] = room
            
        # Load time slots
        for slot in TimeSlot.objects.filter(is_break=False):
            self.time_slots[slot.id] = slot
            
        # Create nodes for each section's sessions
        for section in Section.objects:
            lecture_hours = section.course.lecture_hours
            for session_num in range(1, lecture_hours + 1):
                self.sessions_to_schedule.append((section, session_num))
                
        logger.info(f"Loaded {len(self.rooms)} rooms, {len(self.time_slots)} time slots, "
                  f"and {len(self.sessions_to_schedule)} sessions to schedule.")

    def generate_schedule(self):
        """Main method to generate the class schedule using graph coloring with backtracking"""
        self.initialize_data()
        
        # Clear any existing schedule
        Schedule.objects.delete()
        
        # Sort sessions by complexity (number of constraints)
        # Sessions with more constraints should be scheduled first
        self.sessions_to_schedule.sort(key=self._calculate_session_complexity, reverse=True)
        
        # Start the backtracking algorithm
        success = self._backtrack_schedule(0)
        
        if success:
            logger.info("Successfully created a schedule!")
            # Save the schedule to the database
            self._save_schedule_to_db()
            
            # Display the schedule organized by rooms
            logger.info("Displaying schedule by room:")
            self.display_schedule_by_room()
            
            # Display a compact timetable view
            logger.info("Displaying room timetable view:")
            self.display_room_timetable()
            
            # Print room utilization summary
            self.print_room_schedule_summary()
            
            return True
        else:
            logger.error("Failed to create a schedule with the given constraints.")
            return False

    def _backtrack_schedule(self, index):
        """Recursive backtracking algorithm for scheduling"""
        # Base case: if all sessions are scheduled, we're done
        if index >= len(self.sessions_to_schedule):
            return True
            
        section, session_num = self.sessions_to_schedule[index]
        
        # Try each time slot and room combination
        for time_slot_id, time_slot in self.time_slots.items():
            for room_id, room in self.rooms.items():
                
                # Check if this assignment is valid
                if self._is_valid_assignment(section, session_num, time_slot, room):
                    
                    # Make a tentative assignment
                    self.schedule[(section.id, session_num)] = (time_slot_id, room_id)
                    
                    # Recursively try to schedule the rest
                    if self._backtrack_schedule(index + 1):
                        return True
                        
                    # If we get here, we need to backtrack
                    del self.schedule[(section.id, session_num)]
                    
        # If no valid assignment was found, return failure
        return False

    def _is_valid_assignment(self, section, session_num, time_slot, room):
        """Check if a section session can be assigned to a time slot and room"""
        # Check if room capacity is sufficient
        if room.capacity < len(section.enrolled_students):
            return False
            
        # Check for conflicts with already scheduled sessions
        for (s_id, s_num), (ts_id, r_id) in self.schedule.items():
            # Skip if we're checking the same session
            if s_id == section.id and s_num == session_num:
                continue
                
            scheduled_section = Section.objects.get(id=s_id)
            scheduled_time_slot = TimeSlot.objects.get(id=ts_id)
            
            # If different time slot, no conflict
            if ts_id != time_slot.id:
                continue
                
            # Same time slot - check for conflicts:
            
            # 1. Same room conflict
            if r_id == room.id:
                return False
                
            # 2. Teacher conflict: same teacher can't teach two sections at once
            if scheduled_section.teacher.id == section.teacher.id:
                return False
                
            # 3. Student conflict: check if any student is enrolled in both sections
            for student in section.enrolled_students:
                if student in scheduled_section.enrolled_students:
                    return False
        
        # 4. Check teacher daily session limit
        if not self._check_teacher_daily_limit(section.teacher, time_slot):
            return False
            
        # All checks passed, this is a valid assignment
        return True

    def _check_teacher_daily_limit(self, teacher, new_time_slot):
        """Check if adding a new session would exceed the teacher's daily limit"""
        # Count how many sessions the teacher is already teaching on this day
        session_count = 0
        for (s_id, _), (ts_id, _) in self.schedule.items():
            section = Section.objects.get(id=s_id)
            if section.teacher.id == teacher.id:
                time_slot = TimeSlot.objects.get(id=ts_id)
                if time_slot.day == new_time_slot.day:
                    session_count += 1
                    
        # Check if adding one more would exceed the limit
        return session_count < self.MAX_SESSIONS_PER_TEACHER_PER_DAY

    def _calculate_session_complexity(self, session_tuple):
        """Calculate how constrained a session is (higher = more constrained)"""
        section, _ = session_tuple
        
        # More enrolled students = more potential conflicts
        complexity = len(section.enrolled_students)
        
        # More teachable courses by this teacher = more flexibility (less constrained)
        complexity += 10 / len(section.teacher.teachable_courses)
        
        return complexity

    def _save_schedule_to_db(self):
        """Save the generated schedule to the database"""
        for (section_id, session_num), (time_slot_id, room_id) in self.schedule.items():
            schedule = Schedule(
                section=Section.objects.get(id=section_id),
                session_number=session_num,
                room=Room.objects.get(id=room_id),
                time_slot=TimeSlot.objects.get(id=time_slot_id)
            )
            schedule.save()
            
        logger.info(f"Saved {len(self.schedule)} scheduled sessions to the database.")

    def get_schedule_by_teacher(self, teacher_id):
        """Get all scheduled sessions for a specific teacher"""
        teacher = Teacher.objects.get(teacher_id=teacher_id)
        sections = Section.objects(teacher=teacher)
        
        schedules = []
        for section in sections:
            section_schedules = Schedule.objects(section=section)
            schedules.extend(section_schedules)
            
        return schedules

    def get_schedule_by_student(self, student_id):
        """Get all scheduled sessions for a specific student"""
        student = Student.objects.get(student_id=student_id)
        sections = Section.objects(enrolled_students=student)
        
        schedules = []
        for section in sections:
            section_schedules = Schedule.objects(section=section)
            schedules.extend(section_schedules)
            
        return schedules

    def get_schedule_by_room(self, room_id):
        """Get all scheduled sessions for a specific room"""
        room = Room.objects.get(room_id=room_id)
        return Schedule.objects(room=room)
    

    def display_schedule_by_room(self):
        """Display the schedule organized by rooms"""
        print("\n=== SCHEDULE BY ROOM ===\n")
        
        # Get all rooms
        rooms = Room.objects.all()
        
        for room in rooms:
            print(f"\n--- ROOM {room.room_id} (Capacity: {room.capacity}) ---\n")
            
            # Get all schedules for this room
            schedules = Schedule.objects(room=room).order_by('time_slot.day', 'time_slot.start_time')
            
            if not schedules:
                print("  No classes scheduled in this room.")
                continue
            
            # Organize by day
            current_day = None
            
            for schedule in schedules:
                # Print day header if day changes
                if schedule.time_slot.day != current_day:
                    current_day = schedule.time_slot.day
                    print(f"  {current_day}:")
                
                # Display time slot, course, and professor info
                start_time = schedule.time_slot.start_time.strftime("%H:%M")
                end_time = schedule.time_slot.end_time.strftime("%H:%M")
                course_code = schedule.section.course.course_code
                course_name = schedule.section.course.name
                section_id = schedule.section.section_id
                professor = schedule.section.teacher.name
                session_num = schedule.session_number
                total_sessions = schedule.section.course.lecture_hours
                
                print(f"    {start_time} - {end_time}: {course_code} (Session {session_num}/{total_sessions})")
                print(f"      Course: {course_name}")
                print(f"      Section: {section_id}")
                print(f"      Professor: {professor}")
                print(f"      Students: {len(schedule.section.enrolled_students)}")
                print()

    def display_room_timetable(self):
        """Display a compact timetable view of all rooms' schedules"""
        print("\n=== ROOM TIMETABLE VIEW ===\n")
        
        # Get all days and time slots
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        time_slots = TimeSlot.objects(is_break=False).order_by('start_time').distinct('start_time')
        
        # Get all rooms
        rooms = Room.objects.all()
        
        for room in rooms:
            print(f"\nROOM {room.room_id} (Capacity: {room.capacity})")
            print("-" * 100)
            
            # Print header row with days
            header = "Time        "
            for day in days:
                header += f"| {day[:3]}                 "
            print(header)
            print("-" * 100)
            
            # For each time slot, print what's scheduled in this room
            for time_slot_start in time_slots:
                row = f"{time_slot_start.strftime('%H:%M')}       "
                
                for day in days:
                    # Find if there's a class at this time/day in this room
                    matching_slots = TimeSlot.objects(day=day, start_time=time_slot_start, is_break=False)
                    
                    if not matching_slots:
                        row += "|                      "
                        continue
                    
                    found_class = False
                    for slot in matching_slots:
                        schedule = Schedule.objects(room=room, time_slot=slot).first()
                        if schedule:
                            row += f"| {schedule.section.course.course_code} ({schedule.session_number}) "
                            found_class = True
                            break
                    
                    if not found_class:
                        row += "|                      "
                
                print(row)
            
            print("-" * 100)

    def get_schedule_by_all_rooms(self):
        """Get schedules for all rooms and return as a dictionary"""
        room_schedules = {}
        
        # Get all rooms
        rooms = Room.objects.all()
        
        for room in rooms:
            room_info = {
                "room_id": room.room_id,
                "capacity": room.capacity,
                "schedules": []
            }
            
            # Get all schedules for this room
            schedules = Schedule.objects(room=room).order_by('time_slot.day', 'time_slot.start_time')
            
            # Convert schedule objects to dictionaries
            for schedule in schedules:
                schedule_info = {
                    "day": schedule.time_slot.day,
                    "start_time": schedule.time_slot.start_time.strftime("%H:%M"),
                    "end_time": schedule.time_slot.end_time.strftime("%H:%M"),
                    "course_code": schedule.section.course.course_code,
                    "course_name": schedule.section.course.name,
                    "section_id": schedule.section.section_id,
                    "professor": schedule.section.teacher.name,
                    "session_number": schedule.session_number,
                    "total_sessions": schedule.section.course.lecture_hours,
                    "enrolled_students": len(schedule.section.enrolled_students)
                }
                room_info["schedules"].append(schedule_info)
            
            room_schedules[room.room_id] = room_info
        
        return room_schedules

    def print_room_schedule_summary(self):
        """Print a summary of all room utilization"""
        print("\n=== ROOM UTILIZATION SUMMARY ===\n")
        
        rooms = Room.objects.all()
        total_time_slots = TimeSlot.objects(is_break=False).count()
        
        print(f"{'Room ID':<10} {'Capacity':<10} {'Sessions':<10} {'Utilization':<15}")
        print("-" * 45)
        
        for room in rooms:
            # Count sessions scheduled in this room
            scheduled_sessions = Schedule.objects(room=room).count()
            
            # Calculate utilization percentage
            utilization = (scheduled_sessions / total_time_slots) * 100 if total_time_slots > 0 else 0
            
            print(f"{room.room_id:<10} {room.capacity:<10} {scheduled_sessions:<10} {utilization:.2f}%")
        
        print()
        

# if __name__=='__main__':
#     scheduler = SchedulerController()
#     success = scheduler.generate_schedule()

#     if success:
#         print("Schedule created successfully!")
#     else:
#         print("Failed to create a schedule.")