from ..models import Room, Teacher, Student, Course, TimeSlot, Schedule
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SchedulerController:
    def __init__(self):
        self.sessions_to_schedule = []  # List of (course, teacher, session_number) tuples
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
            
        # Create nodes for each course's sessions
        for course in Course.objects:
            # Find teachers qualified to teach this course
            qualified_teachers = Teacher.objects(teachable_courses=course)
            if not qualified_teachers:
                logger.warning(f"No qualified teacher found for {course.course_code}. Skipping.")
                continue
                
            # For simplicity, assign the first qualified teacher to all sessions
            # In a more advanced implementation, we could distribute among multiple teachers
            teacher = qualified_teachers.first()
            
            # Create a session for each lecture hour
            for session_num in range(1, course.lecture_hours + 1):
                self.sessions_to_schedule.append((course, teacher, session_num))
                
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
            
        course, teacher, session_num = self.sessions_to_schedule[index]
        
        # Try each time slot and room combination
        for time_slot_id, time_slot in self.time_slots.items():
            for room_id, room in self.rooms.items():
                
                # Check if this assignment is valid
                if self._is_valid_assignment(course, teacher, session_num, time_slot, room):
                    
                    # Make a tentative assignment
                    self.schedule[(course.id, session_num)] = (time_slot_id, room_id, teacher.id)
                    
                    # Recursively try to schedule the rest
                    if self._backtrack_schedule(index + 1):
                        return True
                        
                    # If we get here, we need to backtrack
                    del self.schedule[(course.id, session_num)]
                    
        # If no valid assignment was found, return failure
        return False

    def _is_valid_assignment(self, course, teacher, session_num, time_slot, room):
        """Check if a course session can be assigned to a time slot and room"""
        # Get students enrolled in this course
        enrolled_students = Student.objects(enrolled_courses=course)
        
        # Check if room capacity is sufficient
        if room.capacity < enrolled_students.count():
            return False
            
        # Check for conflicts with already scheduled sessions
        for (c_id, s_num), (ts_id, r_id, t_id) in self.schedule.items():
            # Skip if we're checking the same session
            if c_id == course.id and s_num == session_num:
                continue
                
            scheduled_course = Course.objects.get(id=c_id)
            scheduled_time_slot = TimeSlot.objects.get(id=ts_id)
            
            # If different time slot, no conflict
            if ts_id != time_slot.id:
                continue
                
            # Same time slot - check for conflicts:
            
            # 1. Same room conflict
            if r_id == room.id:
                return False
                
            # 2. Teacher conflict: same teacher can't teach two courses at once
            if t_id == teacher.id:
                return False
                
            # 3. Student conflict: check if any student is enrolled in both courses
            # First approach: query students enrolled in both courses
            student_conflicts = Student.objects(enrolled_courses__all=[course, scheduled_course])
            if student_conflicts.count() > 0:
                return False
        
        # 4. Check teacher daily session limit
        if not self._check_teacher_daily_limit(teacher, time_slot):
            return False
            
        # All checks passed, this is a valid assignment
        return True

    def _check_teacher_daily_limit(self, teacher, new_time_slot):
        """Check if adding a new session would exceed the teacher's daily limit"""
        # Count how many sessions the teacher is already teaching on this day
        session_count = 0
        for (_, _), (ts_id, _, t_id) in self.schedule.items():
            if t_id == teacher.id:
                time_slot = TimeSlot.objects.get(id=ts_id)
                if time_slot.day == new_time_slot.day:
                    session_count += 1
                    
        # Check if adding one more would exceed the limit
        return session_count < self.MAX_SESSIONS_PER_TEACHER_PER_DAY

    def _calculate_session_complexity(self, session_tuple):
        """Calculate how constrained a session is (higher = more constrained)"""
        course, teacher, _ = session_tuple
        
        # More enrolled students = more potential conflicts
        complexity = Student.objects(enrolled_courses=course).count()
        
        # More teachable courses by this teacher = more flexibility (less constrained)
        if len(teacher.teachable_courses) > 0:
            complexity += 10 / len(teacher.teachable_courses)
        else:
            complexity += 10  # High complexity if teacher can only teach this course
        
        return complexity

    def _save_schedule_to_db(self):
        """Save the generated schedule to the database"""
        for (course_id, session_num), (time_slot_id, room_id, teacher_id) in self.schedule.items():
            schedule = Schedule(
                course=Course.objects.get(id=course_id),
                teacher=Teacher.objects.get(id=teacher_id),
                session_number=session_num,
                room=Room.objects.get(id=room_id),
                time_slot=TimeSlot.objects.get(id=time_slot_id)
            )
            schedule.save()
            
        logger.info(f"Saved {len(self.schedule)} scheduled sessions to the database.")

    def get_schedule_by_teacher(self, teacher_id):
        """Get all scheduled sessions for a specific teacher"""
        teacher = Teacher.objects.get(teacher_id=teacher_id)
        return Schedule.objects(teacher=teacher).order_by('time_slot.day', 'time_slot.start_time')

    def get_schedule_by_student(self, student_id):
        """Get all scheduled sessions for a specific student"""
        student = Student.objects.get(student_id=student_id)
        courses = student.enrolled_courses
        
        schedules = []
        for course in courses:
            course_schedules = Schedule.objects(course=course)
            schedules.extend(course_schedules)
            
        # Sort by day and time
        schedules.sort(key=lambda s: (s.time_slot.day, s.time_slot.start_time.hour, s.time_slot.start_time.minute))
        return schedules

    def get_schedule_by_room(self, room_id):
        """Get all scheduled sessions for a specific room"""
        room = Room.objects.get(room_id=room_id)
        return Schedule.objects(room=room).order_by('time_slot.day', 'time_slot.start_time')

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
                course_code = schedule.course.course_code
                course_name = schedule.course.name
                professor = schedule.teacher.name
                session_num = schedule.session_number
                total_sessions = schedule.course.lecture_hours
                
                # Count enrolled students
                enrolled_count = Student.objects(enrolled_courses=schedule.course).count()
                
                print(f"    {start_time} - {end_time}: {course_code} (Session {session_num}/{total_sessions})")
                print(f"      Course: {course_name}")
                print(f"      Professor: {professor}")
                print(f"      Students: {enrolled_count}")
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
                            row += f"| {schedule.course.course_code} ({schedule.session_number}) "
                            found_class = True
                            break
                    
                    if not found_class:
                        row += "|                      "
                
                print(row)
            
            print("-" * 100)

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