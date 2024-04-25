from .. import db
from .contest import Contest

class Result(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    score = db.Column(db.Float, nullable=False)
    contest_id = db.Column(db.String(36), db.ForeignKey('contest.id'), nullable=False)
    contest = db.relationship('Contest', back_populates='participants')
    usertext = db.Column(db.Text, nullable=False)
    