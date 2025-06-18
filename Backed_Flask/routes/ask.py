from flask import Flask, Blueprint,request,jsonify
from services.gemini_service import ask_qustion
ask_bp = Blueprint('ask', __name__)

@ask_bp.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    qustions = data.get("question", '')
    answer = ask_qustion(qustions)
    return jsonify(answer)
