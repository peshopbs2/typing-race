from flask import Blueprint, request, jsonify
from .. import db
from ..models.contest import Contest
from ..models.result import Result
from uuid import uuid4

contest_bp = Blueprint('contest_bp', __name__)

@contest_bp.route('/test', methods=['GET'])
def test():
        return jsonify({'test': 1}), 201
 
@contest_bp.route('/contests', methods=['POST'])
def create_contest():
    data = request.get_json()
    contest_id = str(uuid4())
    new_contest = Contest(id=contest_id, text=data['text'])
    db.session.add(new_contest)
    db.session.commit()
    return jsonify({'contest_id': contest_id}), 201

@contest_bp.route('/contest/<contest_id>/participate', methods=['POST'])
def participate_in_contest(contest_id):
    contest = Contest.query.get(contest_id)
    if not contest:
        return jsonify({'error': 'Contest not found'}), 404

    data = request.get_json()
    participant = data['username']
    submitted_text = data['text']
    score = data['score']
    correct_text = contest.text
    #accuracy = sum(1 for x, y in zip(submitted_text, correct_text) if x == y) / len(correct_text)
    #speed = len(submitted_text) / len(correct_text)
    #score = accuracy * speed
    result = Result(username=participant, score=score, contest=contest, usertext = submitted_text)
    db.session.add(result)
    db.session.commit()
    return jsonify({'username': participant, 'score': score}), 200

@contest_bp.route('/contest/<contest_id>/leaderboard', methods=['GET'])
def leaderboard(contest_id):
    contest = Contest.query.get(contest_id)
    if not contest:
        return jsonify({'error': 'Contest not found'}), 404

    leaderboard_results = Result.query.filter_by(contest_id=contest_id).order_by(Result.score.asc()).all()
    leaderboard = [{'username': r.username, 'score': r.score} for r in leaderboard_results]
    return jsonify(leaderboard), 200