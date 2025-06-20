import requests
import os
import tempfile
from dotenv import load_dotenv

load_dotenv()
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')

def text_to_speech(text, voice_id="21m00Tcm4TlvDq8ikWAM", emotion="neutral"):
    """
    Convert text to speech using ElevenLabs API
    """
    if not ELEVENLABS_API_KEY:
        return None, "ElevenLabs API key not configured"
    
    # Emotion-based voice settings
    voice_settings = {
        "calm": {"stability": 0.8, "similarity_boost": 0.7, "style": 0.2},
        "excited": {"stability": 0.6, "similarity_boost": 0.8, "style": 0.8},
        "sad": {"stability": 0.9, "similarity_boost": 0.6, "style": 0.1},
        "energetic": {"stability": 0.5, "similarity_boost": 0.9, "style": 0.9},
        "neutral": {"stability": 0.75, "similarity_boost": 0.75, "style": 0.5}
    }
    
    settings = voice_settings.get(emotion, voice_settings["neutral"])
    
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }
    
    data = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": settings
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 200:
            return response.content, None
        else:
            return None, f"ElevenLabs API error: {response.status_code}"
            
    except Exception as e:
        return None, f"ElevenLabs request failed: {str(e)}"

def get_available_voices():
    """Get list of available voices"""
    if not ELEVENLABS_API_KEY:
        return []
    
    url = "https://api.elevenlabs.io/v1/voices"
    headers = {"xi-api-key": ELEVENLABS_API_KEY}
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json().get("voices", [])
        return []
    except:
        return []