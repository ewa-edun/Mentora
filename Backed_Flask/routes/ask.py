from flask import Flask, Blueprint, request, jsonify
from services.gemini_service import ask_qustion

ask_bp = Blueprint('ask', __name__)

@ask_bp.route('/api/ask-question', methods=['POST'])
def ask():
    try:
        data = request.get_json()
        question = data.get("question", '')
        
        if not question:
            return jsonify({'error': 'No question provided'}), 400
        
        answer = ask_qustion(question)
        return jsonify(answer)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
