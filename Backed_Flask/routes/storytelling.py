from flask import Blueprint, request, jsonify
from services.gemini_service import generate_story_content
from services.tavus_service import generate_avatar_video
from services.elevenlabs_service import text_to_speech
import tempfile
import os

storytelling_bp = Blueprint('storytelling', __name__)

@storytelling_bp.route('/api/generate-story', methods=['POST'])
def generate_story():
    """
    Generate an educational story using Gemini AI
    """
    try:
        data = request.get_json()
        topic = data.get('topic', '')
        character = data.get('character', {})
        emotion = data.get('emotion', 'happy')
        duration = data.get('duration', 240)  # 4 minutes default
        
        if not topic or not character:
            return jsonify({'error': 'Topic and character are required'}), 400
        
        # Generate story content using Gemini
        story_result = generate_story_content(topic, character, emotion, duration)
        
        if 'error' in story_result:
            return jsonify({'error': story_result['error']}), 500
        
        return jsonify({
            'success': True,
            'title': story_result['title'],
            'content': story_result['content'],
            'duration': story_result['duration']
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@storytelling_bp.route('/api/generate-avatar-video', methods=['POST'])
def create_avatar_video():
    """
    Generate avatar video using Tavus API
    """
    try:
        data = request.get_json()
        script = data.get('script', '')
        character = data.get('character', {})
        emotion = data.get('emotion', 'neutral')
        
        if not script:
            return jsonify({'error': 'Script is required'}), 400
        
        # Generate avatar video using Tavus
        video_result = generate_avatar_video(script, character, emotion)
        
        if 'error' in video_result:
            return jsonify({'error': video_result['error']}), 500
        
        return jsonify({
            'success': True,
            'videoUrl': video_result['video_url'],
            'duration': video_result.get('duration', 0)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@storytelling_bp.route('/api/generate-voice', methods=['POST'])
def create_voice_narration():
    """
    Generate voice narration using ElevenLabs
    """
    try:
        data = request.get_json()
        text = data.get('text', '')
        voice_id = data.get('voiceId', 'default')
        emotion = data.get('emotion', 'neutral')
        speed = data.get('speed', 1.0)
        pitch = data.get('pitch', 1.0)
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        # Generate voice using ElevenLabs
        audio_content, error = text_to_speech(
            text=text, 
            voice_id=voice_id, 
            emotion=emotion,
            speed=speed,
            pitch=pitch
        )
        
        if error:
            return jsonify({'error': error}), 500
        
        if not audio_content:
            return jsonify({'error': 'Failed to generate voice'}), 500
        
        # Save audio to temporary file and return URL
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
        temp_file.write(audio_content)
        temp_file.close()
        
        # In production, you'd upload this to cloud storage and return the URL
        audio_url = f"/api/audio/{os.path.basename(temp_file.name)}"
        
        return jsonify({
            'success': True,
            'audioUrl': audio_url
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@storytelling_bp.route('/api/characters', methods=['GET'])
def get_story_characters():
    """
    Get available story characters
    """
    characters = [
        {
            'id': 'mento',
            'name': 'Mento the Wise Owl',
            'personality': 'Wise, encouraging, patient',
            'avatar': '🦉',
            'voiceId': 'wise-mentor',
            'description': 'A gentle owl who loves helping students discover the magic in learning',
            'tavusAvatarId': 'owl-mentor-avatar'
        },
        {
            'id': 'luna',
            'name': 'Luna the Curious Cat',
            'personality': 'Playful, curious, energetic',
            'avatar': '🐱',
            'voiceId': 'playful-friend',
            'description': 'An adventurous cat who turns every lesson into an exciting quest',
            'tavusAvatarId': 'cat-friend-avatar'
        },
        {
            'id': 'sage',
            'name': 'Sage the Calm Dragon',
            'personality': 'Calm, wise, protective',
            'avatar': '🐉',
            'voiceId': 'calm-guide',
            'description': 'A peaceful dragon who helps students find inner strength and confidence',
            'tavusAvatarId': 'dragon-guide-avatar'
        },
        {
            'id': 'spark',
            'name': 'Spark the Energetic Fox',
            'personality': 'Energetic, motivating, fun',
            'avatar': '🦊',
            'voiceId': 'energetic-coach',
            'description': 'A lively fox who makes learning feel like the greatest adventure ever',
            'tavusAvatarId': 'fox-coach-avatar'
        }
    ]
    
    return jsonify({
        'success': True,
        'characters': characters
    })