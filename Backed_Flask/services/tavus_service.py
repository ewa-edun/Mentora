import os
import requests
import tempfile
from dotenv import load_dotenv

load_dotenv()
TAVUS_API_KEY = os.getenv('TAVUS_API_KEY')
TAVUS_BASE_URL = "https://tavusapi.com/v2"

def generate_avatar_video(script, character, emotion):
    """
    Generate avatar video using Tavus API with correct format
    """
    if not TAVUS_API_KEY or TAVUS_API_KEY == 'your_tavus_api_key_here':
        print("❌ Tavus API key not configured - returning demo video")
        return {
            "video_url": "/demo/mento demo.mp4",
            "duration": 240,
            "note": "Demo video - Tavus API key not configured"
        }
    
    print(f"🎬 Generating avatar video with Tavus...")
    print(f"   Character: {character.get('name', 'Unknown')}")
    print(f"   Emotion: {emotion}")
    print(f"   Script length: {len(script)} characters")
    
    try:
        # Map character to Tavus replica ID
        character_replica_mapping = {
            'mento': 'r880666f8c89', 
            'luna': 'rb91c99ba958',   
            'sage': 'ra066ab28864',
            'spark': 'r9fa0878977a'
        }
        
        replica_id = character_replica_mapping.get(character.get('id'), 'r880666f8c89')
        print(f"   Using replica ID: {replica_id}")
        
        # Limit script length for API
        if len(script) > 1000:
            script = script[:1000] + "..."
            print(f"⚠️ Script truncated to 1000 characters for API limits")
        
        headers = {
            "x-api-key": TAVUS_API_KEY,
            "Content-Type": "application/json"
        }
        
        # Correct Tavus API format
        payload = {
            "replica_id": replica_id,
            "script": script,
            "background_url": "https://tavusapi.com/backgrounds/classroom.jpg",  # Optional
            "callback_url": "https://webhook.site/c6591bf4-4438-45f1-b749-fe380e29667c" 
        }
        
        print(f"🌐 Making request to Tavus API...")
        response = requests.post(
            f"{TAVUS_BASE_URL}/videos",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        print(f"📡 Tavus Response Status: {response.status_code}")
        
        if response.status_code == 200 or response.status_code == 201:
            result = response.json()
            print(f"✅ Tavus Success: Video generation started")
            return {
                "video_url": result.get("download_url", "/demo/avatar-video.mp4"),
                "video_id": result.get("video_id"),
                "duration": result.get("duration", 240),
                "status": result.get("status", "processing")
            }
        elif response.status_code == 400:
            error_msg = f"Tavus API bad request: {response.text}"
            print(f"❌ {error_msg}")
            print("💡 This usually means replica_id is invalid or missing")
            # Return demo video instead of failing
            return {
                "video_url": "/demo/avatar-video.mp4",
                "duration": 240,
                "note": "Demo video - Tavus replica ID needs configuration"
            }
        elif response.status_code == 401:
            error_msg = "Tavus API authentication failed. Please check your API key."
            print(f"❌ {error_msg}")
            return {
                "video_url": "/demo/avatar-video.mp4",
                "duration": 240,
                "note": "Demo video - Tavus authentication failed"
            }
        else:
            error_msg = f"Tavus API error: {response.status_code} - {response.text}"
            print(f"❌ {error_msg}")
            return {
                "video_url": "/demo/avatar-video.mp4",
                "duration": 240,
                "note": "Demo video - Tavus API error"
            }
            
    except requests.exceptions.Timeout:
        error_msg = "Tavus request timed out"
        print(f"❌ {error_msg}")
        return {
            "video_url": "/demo/avatar-video.mp4",
            "duration": 240,
            "note": "Demo video - Tavus request timeout"
        }
    except Exception as e:
        error_msg = f"Tavus request failed: {str(e)}"
        print(f"❌ {error_msg}")
        return {
            "video_url": "/demo/avatar-video.mp4",
            "duration": 240,
            "note": "Demo video - Tavus request failed"
        }

def get_video_status(video_id):
    """
    Check the status of a Tavus video generation
    """
    if not TAVUS_API_KEY or TAVUS_API_KEY == 'your_tavus_api_key_here':
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

def list_available_replicas():
    """
    Get list of available Tavus replicas (avatars)
    """
    if not TAVUS_API_KEY or TAVUS_API_KEY == 'your_tavus_api_key_here':
        return {"error": "Tavus API key not configured"}
    
    try:
        headers = {
            "x-api-key": TAVUS_API_KEY
        }
        
        response = requests.get(
            f"{TAVUS_BASE_URL}/replicas",
            headers=headers
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"Failed to get replicas: {response.status_code}"}
            
    except Exception as e:
        return {"error": f"Replica list request failed: {str(e)}"}