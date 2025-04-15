from .models import ResearchScholar, Course, Section
from collections import defaultdict
import logging
from mongoengine import connect
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

connect(db='university_scheduler',host=os.getenv('MONGO_URI'))
print('database connected')

class TAAssignmentController:
    """Controller for assigning Research Scholars as TAs using bipartite matching algorithm"""
    
    def __init__(self):
        self.scholars = []  # List of research scholars
        self.courses = []   # List of courses needing TAs
        self.graph = defaultdict(list)  # Adjacency list for the bipartite graph
        self.matches = {}   # Final matching result
        
    def initialize_data(self):
        """Load scholars and courses from the database"""
        # Load all research scholars
        self.scholars = list(ResearchScholar.objects.all())
        logger.info(f"Loaded {len(self.scholars)} research scholars")
        
        # Load all courses that need TAs
        # We're assuming all courses need TAs for this implementation
        self.courses = list(Course.objects.all())
        logger.info(f"Loaded {len(self.courses)} courses")
        
        # Build the bipartite graph
        self._build_graph()
        
    def _build_graph(self):
        """Construct the bipartite graph where edges represent possible TA assignments"""
        self.graph = defaultdict(list)
        
        # Add edges from scholars to courses they can TA for
        for scholar in self.scholars:
            # Check which courses this scholar can TA for
            for course in scholar.TA_courses:
                self.graph[scholar.id].append(course.id)
                
        logger.info(f"Built bipartite graph with {len(self.graph)} scholar nodes")
    
    def _bpm(self, scholar_id, visited, matches):
        """
        A DFS-based recursive function that implements the augmenting path algorithm
        for bipartite matching.
        
        Args:
            scholar_id: The ID of the scholar we're trying to match
            visited: Set of courses already visited during this search
            matches: Dictionary of current matches (course_id -> scholar_id)
            
        Returns:
            True if an augmenting path is found, False otherwise
        """
        # Try all courses this scholar can TA for
        for course_id in self.graph[scholar_id]:
            # If this course hasn't been visited in this DFS
            if course_id not in visited:
                visited.add(course_id)
                
                # If this course is unmatched OR
                # If the scholar assigned to this course can be assigned to another course
                if course_id not in matches or self._bpm(matches[course_id], visited, matches):
                    matches[course_id] = scholar_id
                    return True
                    
        return False
    
    def assign_tas(self):
        """
        Use the Ford-Fulkerson algorithm to find maximum bipartite matching
        Returns a dictionary mapping course IDs to scholar IDs
        """
        self.initialize_data()
        
        # Clear any existing TA assignments in sections
        Section.objects.update(ta=None)
        
        # This will store the final matching (course_id -> scholar_id)
        matches = {}
        
        # Try to match each scholar
        for scholar in self.scholars:
            # Reset visited courses for this scholar's DFS
            visited = set()
            
            # Try to find an augmenting path for this scholar
            self._bpm(scholar.id, visited, matches)
        
        # Store the result for later reference
        self.matches = matches
        
        logger.info(f"Found {len(matches)} TA assignments")
        
        # Update the database with the new assignments
        self._update_assignments()
        
        return self.get_assignment_details()
    
    def _update_assignments(self):
        """Update the database with the TA assignments"""
        # Invert the matches dict to get scholar_id -> course_id
        scholar_assignments = {scholar_id: course_id for course_id, scholar_id in self.matches.items()}
        
        # Track how many scholars were actually assigned
        assigned_count = 0
        
        # For each scholar, update their assigned section if they have one
        for scholar in self.scholars:
            if scholar.id in scholar_assignments:
                course_id = scholar_assignments[scholar.id]
                
                # Find the sections for this course
                sections = Section.objects(course=course_id)
                
                # If there are sections, assign the scholar as TA to all of them
                # You may want to modify this to assign to specific sections instead
                if sections:
                    for section in sections:
                        section.ta = scholar
                        section.save()
                    assigned_count += 1
                    logger.info(f"Assigned {scholar.name} as TA for course {Course.objects.get(id=course_id).course_code}")
        
        logger.info(f"Updated database with {assigned_count} TA assignments")
    
    def get_assignment_details(self):
        """Return human-readable details of the TA assignments"""
        assignments = []
        
        for course_id, scholar_id in self.matches.items():
            course = Course.objects.get(id=course_id)
            scholar = ResearchScholar.objects.get(id=scholar_id)
            
            assignments.append({
                'course_code': course.course_code,
                'course_name': course.name,
                'scholar_id': scholar.scholar_id,
                'scholar_name': scholar.name
            })
        
        return assignments
    
    def get_unmatched_scholars(self):
        """Return a list of scholars who were not assigned as TAs"""
        assigned_scholar_ids = set(self.matches.values())
        
        unmatched = []
        for scholar in self.scholars:
            if scholar.id not in assigned_scholar_ids:
                unmatched.append({
                    'scholar_id': scholar.scholar_id,
                    'name': scholar.name
                })
                
        return unmatched
    
    def get_unmatched_courses(self):
        """Return a list of courses that did not get TAs assigned"""
        assigned_course_ids = set(self.matches.keys())
        
        unmatched = []
        for course in self.courses:
            if course.id not in assigned_course_ids:
                unmatched.append({
                    'course_code': course.course_code,
                    'name': course.name
                })
                
        return unmatched
    

print('Into the flowwww')

controller = TAAssignmentController()

# Run the assignment algorithm
print("\nRunning TA assignment algorithm...")
assignments = controller.assign_tas()

# Print the results
print(f"\nFound {len(assignments)} TA assignments:")

for i, assignment in enumerate(assignments):
    print(f"{i+1}. {assignment['scholar_name']} → {assignment['course_code']} ({assignment['course_name']})")

# Print unmatched entities
unmatched_scholars = controller.get_unmatched_scholars()
if unmatched_scholars:
    print(f"\nUnmatched scholars ({len(unmatched_scholars)}):")
    for scholar in unmatched_scholars:
        print(f"- {scholar['name']} ({scholar['scholar_id']})")
else:
    print("\nAll scholars were assigned as TAs.")

unmatched_courses = controller.get_unmatched_courses()
if unmatched_courses:
    print(f"\nCourses without TAs ({len(unmatched_courses)}):")
    for course in unmatched_courses:
        print(f"- {course['course_code']}: {course['name']}")
else:
    print("\nAll courses have TAs assigned.")

# Verify database updates
print("\nVerifying database updates...")
sections_with_tas = Section.objects(ta__ne=None)
print(f"Found {sections_with_tas.count()} sections with TAs assigned.")

for section in sections_with_tas:
    print(f"- Section {section.section_id}: TA = {section.ta.name}")