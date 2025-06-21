import requests
import os
import tempfile
from dotenv import load_dotenv

load_dotenv()
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')

def text_to_speech(text, voice_id="21m00Tcm4TlvDq8ikWAM", emotion="neutral", speed=1.0, pitch=1.0):
    """
    Convert text to speech using ElevenLabs API with emotion and character support
    """
    if not ELEVENLABS_API_KEY:
        return None, "ElevenLabs API key not configured"
    
    # Character voice mapping
    character_voices = {
        'wise-mentor': '21m00Tcm4TlvDq8ikWAM',  # Rachel - wise, mature
        'playful-friend': 'AZnzlk1XvdvUeBnXmlld',  # Domi - young, energetic  
        'calm-guide': 'EXAVITQu4vr4xnSDxMaL',  # Bella - calm, soothing
        'energetic-coach': 'ErXwobaYiN019PkySvjV',  # Antoni - energetic, motivating
        'default': '21m00Tcm4TlvDq8ikWAM'
    }
    
    # Use character voice if provided
    actual_voice_id = character_voices.get(voice_id, voice_id)
    
    # Emotion-based voice settings
    emotion_settings = {
        "calm": {"stability": 0.8, "similarity_boost": 0.7, "style": 0.2, "use_speaker_boost": True},
        "excited": {"stability": 0.6, "similarity_boost": 0.8, "style": 0.8, "use_speaker_boost": True},
        "sad": {"stability": 0.9, "similarity_boost": 0.6, "style": 0.1, "use_speaker_boost": False},
        "energetic": {"stability": 0.5, "similarity_boost": 0.9, "style": 0.9, "use_speaker_boost": True},
        "happy": {"stability": 0.7, "similarity_boost": 0.8, "style": 0.7, "use_speaker_boost": True},
        "stressed": {"stability": 0.6, "similarity_boost": 0.7, "style": 0.4, "use_speaker_boost": False},
        "tired": {"stability": 0.9, "similarity_boost": 0.6, "style": 0.2, "use_speaker_boost": False},
        "focused": {"stability": 0.8, "similarity_boost": 0.8, "style": 0.5, "use_speaker_boost": True},
        "neutral": {"stability": 0.75, "similarity_boost": 0.75, "style": 0.5, "use_speaker_boost": True}
    }
    
    settings = emotion_settings.get(emotion, emotion_settings["neutral"])
    
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{actual_voice_id}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }
    
    data = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            **settings,
            "speed": speed,
            "pitch": pitch
        }
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 200:
            return response.content, None
        else:
            return None, f"ElevenLabs API error: {response.status_code} - {response.text}"
            
    except Exception as e:
        return None, f"ElevenLabs request failed: {str(e)}"

def get_available_voices():
    """Get list of available voices with character mapping"""
    if not ELEVENLABS_API_KEY:
        return []
    
    url = "https://api.elevenlabs.io/v1/voices"
    headers = {"xi-api-key": ELEVENLABS_API_KEY}
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            voices = response.json().get("voices", [])
            
            # Add character information to voices
            character_info = {
                '21m00Tcm4TlvDq8ikWAM': {'character': 'Mento the Wise Owl', 'personality': 'wise, patient'},
                'AZnzlk1XvdvUeBnXmlld': {'character': 'Luna the Curious Cat', 'personality': 'playful, energetic'},
                'EXAVITQu4vr4xnSDxMaL': {'character': 'Sage the Calm Dragon', 'personality': 'calm, protective'},
                'ErXwobaYiN019PkySvjV': {'character': 'Spark the Energetic Fox', 'personality': 'energetic, fun'}
            }
            
            for voice in voices:
                voice_id = voice.get('voice_id')
                if voice_id in character_info:
                    voice.update(character_info[voice_id])
            
            return voices
        return []
    except:
        return []

def clone_voice(name, description, files):
    """Clone a voice using ElevenLabs voice cloning"""
    if not ELEVENLABS_API_KEY:
        return None, "ElevenLabs API key not configured"
    
    url = "https://api.elevenlabs.io/v1/voices/add"
    headers = {"xi-api-key": ELEVENLABS_API_KEY}
    
    data = {
        'name': name,
        'description': description
    }
    
    try:
        response = requests.post(url, headers=headers, data=data, files=files)
        
        if response.status_code == 200:
            return response.json(), None
        else:
            return None, f"Voice cloning failed: {response.status_code}"
            
    except Exception as e:
        return None, f"Voice cloning request failed: {str(e)}"