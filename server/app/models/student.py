from mongoengine import Document, StringField, IntField, ListField,ReferenceField
import bcrypt

class Student(Document):
    student_id = StringField(required=True, unique=True)
    name = StringField(required=True)
    email = StringField(required=True)
    major = StringField(required=True)
    year = IntField(required=True)
    enrolled_courses = ListField(ReferenceField('Course'))
    password=StringField(required=True)
    
    def __str__(self):
        return f"{self.name} ({self.student_id})"
    
    def hash_password(self, raw_password):
            # Hash the password with bcrypt
        self.password = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def verify_password(self, input_password):
        return bcrypt.checkpw(input_password.encode('utf-8'), self.password.encode('utf-8'))