
from mongoengine import Document, StringField, ListField, ReferenceField


class Section(Document):
    section_id = StringField(required=True, unique=True)
    course = ReferenceField('Course', required=True)
    teacher = ReferenceField('Teacher', required=True)
    enrolled_students = ListField(ReferenceField('Student'))
    ta = ReferenceField('ResearchScholar')
    
    def __str__(self):
        return f"Section {self.section_id} of {self.course.course_code}"
    
    @property
    def enrollment_count(self):
        return len(self.enrolled_students)