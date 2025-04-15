from mongoengine import Document, StringField, IntField, ListField,ReferenceField


class Student(Document):
    student_id = StringField(required=True, unique=True)
    name = StringField(required=True)
    email = StringField(required=True)
    major = StringField(required=True)
    year = IntField(required=True)
    enrolled_courses = ListField(ReferenceField('Course'))
    
    def __str__(self):
        return f"{self.name} ({self.student_id})"