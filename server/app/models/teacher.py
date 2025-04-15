from mongoengine import Document, StringField, ListField, ReferenceField



class Teacher(Document):
    teacher_id = StringField(required=True, unique=True)
    name = StringField(required=True)
    email = StringField(required=True)
    department = StringField(required=True)
    teachable_courses = ListField(ReferenceField('Course'))
    
    def __str__(self):
        return f"{self.name} ({self.department})"