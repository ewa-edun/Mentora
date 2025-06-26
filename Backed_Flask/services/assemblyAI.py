import os
import requests
import time
from dotenv import load_dotenv

load_dotenv()
ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")

def transcribe_audio(file_path):
    try:
        # Upload audio to AssemblyAI
        headers = {'authorization': ASSEMBLYAI_API_KEY}
        with open(file_path, 'rb') as f:
            upload_response = requests.post(
                "https://api.assemblyai.com/v2/upload",
                headers=headers,
                files={'file': f}
            )

        if upload_response.status_code != 200:
            return {"error": "Audio upload failed", "details": upload_response.text}

        audio_url = upload_response.json()['upload_url']

        # Start transcription
        transcript_request = {
            "audio_url": audio_url
        }

        transcript_response = requests.post(
            "https://api.assemblyai.com/v2/transcript",
            json=transcript_request,
            headers=headers
        )

        if transcript_response.status_code != 200:
            return {"error": "Transcription request failed", "details": transcript_response.text}

        transcript_id = transcript_response.json()["id"]

        # Poll until transcription is done
        while True:
            status_response = requests.get(
                f"https://api.assemblyai.com/v2/transcript/{transcript_id}",
                headers=headers
            )
            status_data = status_response.json()

            if status_data["status"] == "completed":
                return {"text": status_data["text"]}
            elif status_data["status"] == "failed":
                return {"error": "Transcription failed"}

            time.sleep(2)

    except Exception as e:
        return {"error": str(e)}
