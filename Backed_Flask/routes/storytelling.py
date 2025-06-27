from flask import Blueprint, request, jsonify
from services.gemini_service import generate_story_content
from services.tavus_service import generate_avatar_video
from services.elevenlabs_service import text_to_speech
import tempfile
import os
import base64

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
        
        print(f"📖 Story Generation Request:")
        print(f"   Topic: {topic}")
        print(f"   Character: {character.get('name', 'Unknown')}")
        print(f"   Emotion: {emotion}")
        print(f"   Duration: {duration}s")
        
        if not topic or not character:
            return jsonify({'error': 'Topic and character are required'}), 400
        
        # Generate story content using Gemini
        story_result = generate_story_content(topic, character, emotion, duration)
        
        if 'error' in story_result:
            print(f"❌ Story generation failed: {story_result['error']}")
            return jsonify({'error': story_result['error']}), 500
        
        print(f"✅ Story generated successfully: {story_result['title']}")
        return jsonify({
            'success': True,
            'title': story_result['title'],
            'content': story_result['content'],
            'duration': story_result['duration']
        })
    
    except Exception as e:
        print(f"❌ Story generation error: {str(e)}")
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
        
        print(f"🎬 Avatar Video Generation Request:")
        print(f"   Character: {character.get('name', 'Unknown')}")
        print(f"   Emotion: {emotion}")
        print(f"   Script length: {len(script)} characters")
        
        if not script:
            return jsonify({'error': 'Script is required'}), 400
        
        # Generate avatar video using Tavus
        video_result = generate_avatar_video(script, character, emotion)
        
        # Always return success with video result (demo or real)
        print(f"✅ Avatar video response prepared")
        return jsonify({
            'success': True,
            'videoUrl': video_result.get('video_url', '/demo/avatar-video.mp4'),
            'duration': video_result.get('duration', 240),
            'note': video_result.get('note', 'Video generated successfully')
        })
    
    except Exception as e:
        print(f"❌ Avatar video generation error: {str(e)}")
        # Always return success with demo video
        return jsonify({
            'success': True,
            'videoUrl': '/demo/avatar-video.mp4',
            'duration': 240,
            'note': f'Demo video - Error: {str(e)}'
        })

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
        
        print(f"🎙️ Voice Generation Request:")
        print(f"   Voice ID: {voice_id}")
        print(f"   Emotion: {emotion}")
        print(f"   Text length: {len(text)} characters")
        
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
            print(f"❌ Voice generation failed: {error}")
            # Return success with demo audio URL
            return jsonify({
                'success': True,
                'audioUrl': '/demo/voice-narration.mp3',
                'note': f'Demo audio - {error}'
            })
        
        if not audio_content:
            print(f"❌ No audio content generated")
            return jsonify({
                'success': True,
                'audioUrl': '/demo/voice-narration.mp3',
                'note': 'Demo audio - No content generated'
            })
        
        # Convert audio content to base64 data URL
        try:
            audio_base64 = base64.b64encode(audio_content).decode('utf-8')
            audio_url = f"data:audio/mpeg;base64,{audio_base64}"
            
            print(f"✅ Voice generated successfully: {len(audio_content)} bytes")
            return jsonify({
                'success': True,
                'audioUrl': audio_url
            })
        except Exception as save_error:
            print(f"❌ Error encoding audio: {str(save_error)}")
            return jsonify({
                'success': True,
                'audioUrl': '/demo/voice-narration.mp3',
                'note': 'Demo audio - Encoding error'
            })
        
    except Exception as e:
        print(f"❌ Voice generation error: {str(e)}")
        # Always return success with demo audio
        return jsonify({
            'success': True,
            'audioUrl': '/demo/voice-narration.mp3',
            'note': f'Demo audio - Error: {str(e)}'
        })

@storytelling_bp.route('/api/characters', methods=['GET'])
def get_story_characters():
    """
    Get available story characters
    """
    try:
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
        
        print(f"✅ Returning {len(characters)} story characters")
        return jsonify({
            'success': True,
            'characters': characters
        })
    
    except Exception as e:
        print(f"❌ Error getting characters: {str(e)}")
        return jsonify({'error': str(e)}), 500