from flask import Blueprint, request, jsonify, send_file
from services.elevenlabs_service import text_to_speech, get_available_voices
import tempfile
import os

voice_bp = Blueprint('voice', __name__)

@voice_bp.route('/api/text-to-speech', methods=['POST'])
def convert_text_to_speech():
    try:
        data = request.get_json()
        text = data.get('text', '')
        voice_id = data.get('voice_id', '21m00Tcm4TlvDq8ikWAM')  # Default voice
        emotion = data.get('emotion', 'neutral')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Convert text to speech
        audio_content, error = text_to_speech(text, voice_id, emotion)
        
        if error:
            return jsonify({'error': error}), 500
        
        if not audio_content:
            return jsonify({'error': 'Failed to generate speech'}), 500
        
        # Save to temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
        temp_file.write(audio_content)
        temp_file.close()
        
        return send_file(
            temp_file.name,
            mimetype='audio/mpeg',
            as_attachment=True,
            download_name='speech.mp3'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@voice_bp.route('/api/voices', methods=['GET'])
def get_voices():
    try:
        voices = get_available_voices()
        return jsonify({'voices': voices})
    except Exception as e:
        return jsonify({'error': str(e)}), 500