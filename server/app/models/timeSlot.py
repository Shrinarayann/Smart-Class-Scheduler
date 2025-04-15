from mongoengine import Document, StringField, BooleanField, DateTimeField



class TimeSlot(Document):
    DAYS = ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')
    
    slot_id = StringField(required=True, unique=True)
    day = StringField(required=True, choices=DAYS)
    start_time = DateTimeField(required=True)
    end_time = DateTimeField(required=True)
    is_break = BooleanField(default=False)
    
    def __str__(self):
        return f"{self.day} {self.start_time.strftime('%H:%M')} - {self.end_time.strftime('%H:%M')}"