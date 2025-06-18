from flask import Flask,Blueprint,request,jsonify
from services.gemini_service import genrate_Quiz
quiz_bp = Blueprint("quiz", __name__)

@quiz_bp.route('/genrate-quiz',methods=['POST'])
def genrate_quiz():
    data = request.get_json()
    paragraph = data.get("paragraph", '')
    result = genrate_Quiz(paragraph)
    return jsonify(result)


