from mongoengine import Document, StringField



class ResearchScholar(Document):
    scholar_id = StringField(required=True, unique=True)
    name = StringField(required=True)
    
    def __str__(self):
        return f"Scholar: {self.name}"