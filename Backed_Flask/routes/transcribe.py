from unittest import result
from flask import request,Blueprint,jsonify
import os
from services.assemblyAI import transcribe_audio
transcribe_bp = Blueprint("transcribe",__name__)

upload_floder = 'upload'

@transcribe_bp.route("/api/transcribe", methods=["POST"])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file uploaded"}),400

    audio = request.files['audio']
    os.makedirs(upload_floder,exist_ok=True)
    file_path = os.path.join(upload_floder,audio.filename)
    audio.save(file_path)
    
    result = transcribe_audio(file_path)
    os.remove(file_path)
    if "error" in result:
        return jsonify({"error": result["error"]}), 500
    return jsonify({"transcription": result})