from mongoengine import Document, StringField, IntField



class Student(Document):
    student_id = StringField(required=True, unique=True)
    name = StringField(required=True)
    email = StringField(required=True)
    major = StringField(required=True)
    year = IntField(required=True)
    
    def __str__(self):
        return f"{self.name} ({self.student_id})"