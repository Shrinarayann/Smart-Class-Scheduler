from mongoengine import Document, StringField, IntField


class Room(Document):
    room_id = StringField(required=True, unique=True)
    capacity = IntField(required=True)
    
    def __str__(self):
        return f"Room {self.room_id} (Capacity: {self.capacity})"