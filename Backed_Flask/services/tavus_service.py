import os
import requests
import tempfile
from dotenv import load_dotenv

load_dotenv()
TAVUS_API_KEY = os.getenv('TAVUS_API_KEY')
TAVUS_BASE_URL = "https://tavusapi.com/v2"

def generate_avatar_video(script, character, emotion):
    """
    Generate avatar video using Tavus API
    """
    if not TAVUS_API_KEY:
        return {"error": "Tavus API key not configured"}
    
    try:
        # Map character to Tavus avatar ID
        character_avatar_mapping = {
            'mento': 'owl-mentor-avatar-id',
            'luna': 'cat-friend-avatar-id', 
            'sage': 'dragon-guide-avatar-id',
            'spark': 'fox-coach-avatar-id'
        }
        
        avatar_id = character_avatar_mapping.get(character.get('id'), 'default-avatar-id')
        
        # Emotion-based video settings
        emotion_settings = {
            'happy': {'energy': 'high', 'tone': 'cheerful'},
            'calm': {'energy': 'low', 'tone': 'peaceful'},
            'stressed': {'energy': 'medium', 'tone': 'supportive'},
            'tired': {'energy': 'low', 'tone': 'gentle'},
            'focused': {'energy': 'medium', 'tone': 'determined'},
            'sad': {'energy': 'low', 'tone': 'comforting'}
        }
        
        settings = emotion_settings.get(emotion, emotion_settings['happy'])
        
        headers = {
            "x-api-key": TAVUS_API_KEY,
            "Content-Type": "application/json"
        }
        
        payload = {
            "avatar_id": avatar_id,
            "script": script,
            "voice_settings": {
                "energy": settings['energy'],
                "tone": settings['tone']
            },
            "video_settings": {
                "quality": "high",
                "background": "classroom"  # Could be dynamic based on story
            }
        }
        
        response = requests.post(
            f"{TAVUS_BASE_URL}/videos",
            headers=headers,
            json=payload
        )
        
        if response.status_code == 200:
            result = response.json()
            return {
                "video_url": result.get("video_url"),
                "video_id": result.get("video_id"),
                "duration": result.get("duration", 0),
                "status": result.get("status", "processing")
            }
        else:
            return {"error": f"Tavus API error: {response.status_code} - {response.text}"}
            
    except Exception as e:
        return {"error": f"Tavus request failed: {str(e)}"}

def get_video_status(video_id):
    """
    Check the status of a Tavus video generation
    """
    if not TAVUS_API_KEY:
        return {"error": "Tavus API key not configured"}
    
    try:
        headers = {
            "x-api-key": TAVUS_API_KEY
        }
        
        response = requests.get(
            f"{TAVUS_BASE_URL}/videos/{video_id}",
            headers=headers
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"Failed to get video status: {response.status_code}"}
            
    except Exception as e:
        return {"error": f"Status check failed: {str(e)}"}

def list_available_avatars():
    """
    Get list of available Tavus avatars
    """
    if not TAVUS_API_KEY:
        return {"error": "Tavus API key not configured"}
    
    try:
        headers = {
            "x-api-key": TAVUS_API_KEY
        }
        
        response = requests.get(
            f"{TAVUS_BASE_URL}/avatars",
            headers=headers
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"Failed to get avatars: {response.status_code}"}
            
    except Exception as e:
        return {"error": f"Avatar list request failed: {str(e)}"}