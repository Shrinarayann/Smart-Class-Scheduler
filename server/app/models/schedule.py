from mongoengine import Document, IntField,  ReferenceField


class Schedule(Document):
    section = ReferenceField('Section', required=True)
    session_number = IntField(required=True, min_value=1)
    room = ReferenceField('Room', required=True)
    time_slot = ReferenceField('TimeSlot', required=True)
    
    meta = {
        'indexes': [
            {'fields': ['section', 'session_number'], 'unique': True},
            {'fields': ['room', 'time_slot'], 'unique': True},
        ]
    }
    
    def __str__(self):
        return f"{self.section.course.course_code} Session {self.session_number} in {self.room.room_id} at {self.time_slot}"