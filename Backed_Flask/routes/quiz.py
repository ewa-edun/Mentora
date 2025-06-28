from flask import Flask, Blueprint, request, jsonify
from services.gemini_service import genrate_Quiz

quiz_bp = Blueprint("quiz", __name__)

@quiz_bp.route('/api/generate-quiz', methods=['POST'])
def genrate_quiz():
    try:
        data = request.get_json()
        text = data.get("text", '')
        difficulty = data.get("difficulty", "Beginner")

        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        print(f"📝 Quiz Generation Request:")
        print(f"   Text length: {len(text)} characters")
        print(f"   Difficulty level: {difficulty}")
        print(f"   Text preview: {text[:100]}...")
        print(f"   Difficulty level: {difficulty}")

        result = genrate_Quiz(text, difficulty)

        if 'error' in result:
            print(f"❌ Quiz generation failed: {result['error']}")
            return jsonify(result), 500
        
        print(f"✅ Quiz generated successfully")
        print(f"   Quiz preview: {result.get('Your Quiz', '')[:200]}...")
        
        return jsonify(result)
    
    except Exception as e:
        print(f"❌ Quiz generation error: {str(e)}")
        return jsonify({'error': str(e)}), 500