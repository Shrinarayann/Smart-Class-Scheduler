from mongoengine import Document, StringField,ListField,ReferenceField



class ResearchScholar(Document):
    scholar_id = StringField(required=True, unique=True)
    name = StringField(required=True)
    TA_courses=ListField(ReferenceField('Course'))
    supervisor_id=ReferenceField('Teacher')
    
    def __str__(self):
        return f"Scholar: {self.name}"