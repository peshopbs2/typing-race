from .. import db

class Contest(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    text = db.Column(db.Text, nullable=False)
    participants = db.relationship('Result', back_populates='contest')
    