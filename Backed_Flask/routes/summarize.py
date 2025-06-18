from flask import Flask, Blueprint,request,jsonify
from services.gemini_service import genrate_sumary
summary_bp = Blueprint('summary', __name__)

@summary_bp.route("/summarize", methods=['POST'])
def summary():
    data = request.get_json()
    text = data.get("text", '')
    result = genrate_sumary(text)
    return jsonify(result)
