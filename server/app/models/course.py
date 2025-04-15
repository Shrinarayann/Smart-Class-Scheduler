from mongoengine import Document, StringField, IntField


class Course(Document):
    course_code = StringField(required=True, unique=True)
    name = StringField(required=True)
    lecture_hours = IntField(required=True)  # Number of sessions per week
    
    def __str__(self):
        return f"{self.course_code}: {self.name}"