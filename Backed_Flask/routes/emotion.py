from flask import Flask, Blueprint, request, jsonify
from services.emotion_service import detect_emotion_from_voice_text, get_break_suggestions

emotion_bp = Blueprint('emotion', __name__)

@emotion_bp.route('/api/detect-emotion', methods=['POST'])
def detect_emotion():
    """
    Detect emotion from voice input text and return personalized break suggestions
    """
    try:
        data = request.get_json()
        
        # Get the text from voice input
        text = data.get('text', '')
        duration_preference = data.get('duration', 'medium')  # short, medium, long
        
        if not text:
            return jsonify({'error': 'No text provided for emotion analysis'}), 400
        
        # Analyze emotion and get suggestions
        result = detect_emotion_from_voice_text(text)
        
        return jsonify({
            'success': True,
            'emotion': result['emotion'],
            'confidence': result['confidence'],
            'message': result['message'],
            'suggestions': result['suggestions'],
            'timestamp': data.get('timestamp', None)
        })
    
    except Exception as e:
        print(f"Emotion detection error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'fallback': {
                'emotion': 'calm',
                'confidence': 0.5,
                'suggestions': get_break_suggestions('calm')
            }
        }), 500

@emotion_bp.route('/api/break-suggestions/<emotion>', methods=['GET'])
def get_suggestions_for_emotion(emotion):
    """
    Get break suggestions for a specific emotion
    """
    try:
        duration = request.args.get('duration', 'medium')
        suggestions = get_break_suggestions(emotion, duration)
        
        return jsonify({
            'success': True,
            'emotion': emotion,
            'suggestions': suggestions
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@emotion_bp.route('/api/emotions/available', methods=['GET'])
def get_available_emotions():
    """
    Get list of emotions that can be detected
    """
    emotions = [
        {'name': 'stressed', 'emoji': '😣', 'description': 'Feeling overwhelmed or anxious'},
        {'name': 'tired', 'emoji': '😴', 'description': 'Feeling exhausted or low energy'},
        {'name': 'sad', 'emoji': '😢', 'description': 'Feeling down or melancholy'},
        {'name': 'happy', 'emoji': '😊', 'description': 'Feeling joyful and positive'},
        {'name': 'calm', 'emoji': '😌', 'description': 'Feeling peaceful and relaxed'},
        {'name': 'focused', 'emoji': '🎯', 'description': 'Feeling concentrated and determined'},
        {'name': 'angry', 'emoji': '😠', 'description': 'Feeling frustrated or irritated'},
        {'name': 'confused', 'emoji': '😕', 'description': 'Feeling uncertain or puzzled'}
    ]
    
    return jsonify({
        'success': True,
        'emotions': emotions
    })