from flask import Flask, Blueprint, request, jsonify
from services.gemini_service import genrate_sumary
import PyPDF2
import io
import pytesseract
from PIL import Image
import tempfile
import os

summary_bp = Blueprint('summary', __name__)

@summary_bp.route("/api/summarize", methods=['POST'])
def summary():
    try:
        data = request.get_json()
        text = data.get("text", '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        result = genrate_sumary(text)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@summary_bp.route('/api/summarize-pdf', methods=['POST'])
def summarize_pdf():
    try:
        if 'pdf' not in request.files:
            return jsonify({'error': 'No PDF file provided'}), 400
        
        pdf_file = request.files['pdf']
        
        # Read PDF content
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_file.read()))
        text = ""
        
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        if not text.strip():
            return jsonify({'error': 'Could not extract text from PDF'}), 400
        
        # Summarize the extracted text
        result = genrate_sumary(text)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@summary_bp.route('/api/ocr', methods=['POST'])
def extract_text_ocr():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        image_file = request.files['image']
        
        # Save image temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp_file:
            image_file.save(temp_file.name)
            
            # Extract text using OCR
            extracted_text = pytesseract.image_to_string(Image.open(temp_file.name))
            
            # Clean up temp file
            os.unlink(temp_file.name)
        
        if not extracted_text.strip():
            return jsonify({'error': 'No text found in image'}), 400
        
        return jsonify({'extracted_text': extracted_text.strip()})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500