from flask import Flask, Blueprint, request, jsonify
from services.gemini_service import genrate_Quiz

quiz_bp = Blueprint("quiz", __name__)

@quiz_bp.route('/api/generate-quiz', methods=['POST'])
def genrate_quiz():
    try:
        data = request.get_json()
        text = data.get("text", '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        result = genrate_Quiz(text)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500