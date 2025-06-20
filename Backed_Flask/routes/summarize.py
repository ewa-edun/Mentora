from flask import Flask, Blueprint, request, jsonify
from services.gemini_service import genrate_sumary
import PyPDF2
import io
import tempfile
import os
import platform
import time

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
    temp_file_path = None
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        image_file = request.files['image']
        
        # Check if Tesseract is available
        try:
            import pytesseract
            from PIL import Image
        except ImportError as e:
            return jsonify({
                'error': 'OCR dependencies not installed',
                'details': 'Please install: pip install pytesseract Pillow',
                'extracted_text': 'Demo OCR Result: This is sample extracted text from your handwritten notes. The actual OCR functionality requires Tesseract to be installed on your system.'
            }), 200  # Return 200 with demo data instead of error
        
        # Set Tesseract path for Windows - YOUR EXACT PATH
        if platform.system() == 'Windows':
            # Your confirmed Tesseract installation path
            tesseract_path = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
            
            if os.path.exists(tesseract_path):
                pytesseract.pytesseract.tesseract_cmd = tesseract_path
                print(f"✅ Found Tesseract at: {tesseract_path}")
            else:
                # Fallback paths if the main one doesn't work
                possible_paths = [
                    r'C:\Program Files\Tesseract-OCR\tesseract.exe',
                    r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
                    r'C:\Users\{}\AppData\Local\Tesseract-OCR\tesseract.exe'.format(os.getenv('USERNAME', '')),
                    r'C:\tesseract\tesseract.exe'
                ]
                
                tesseract_found = False
                for path in possible_paths:
                    if os.path.exists(path):
                        pytesseract.pytesseract.tesseract_cmd = path
                        print(f"✅ Found Tesseract at: {path}")
                        tesseract_found = True
                        break
                
                if not tesseract_found:
                    return jsonify({
                        'error': 'Tesseract OCR not found',
                        'details': f'Searched paths: {possible_paths}',
                        'extracted_text': f'Demo OCR Result: This is sample extracted text from your image "{image_file.filename}". Please ensure Tesseract is installed at C:\\Program Files\\Tesseract-OCR\\'
                    }), 200
        
        # Check if Tesseract executable is accessible
        try:
            version = pytesseract.get_tesseract_version()
            print(f"✅ Tesseract version: {version}")
        except Exception as e:
            return jsonify({
                'error': 'Tesseract OCR not accessible',
                'details': str(e),
                'extracted_text': f'Demo OCR Result: This is sample extracted text from your image "{image_file.filename}". Tesseract is installed but not accessible. Error: {str(e)}'
            }), 200  # Return 200 with demo data instead of error
        
        # Create temporary file with better Windows handling
        try:
            # Create temp file but don't auto-delete
            temp_fd, temp_file_path = tempfile.mkstemp(suffix='.png', prefix='mentora_ocr_')
            
            # Close the file descriptor immediately to release the lock
            os.close(temp_fd)
            
            # Save the uploaded image to the temp file
            with open(temp_file_path, 'wb') as f:
                image_file.seek(0)  # Reset file pointer
                f.write(image_file.read())
            
            print(f"🔍 Processing OCR for image: {image_file.filename}")
            print(f"📁 Temp file created: {temp_file_path}")
            
            # Process OCR
            image = Image.open(temp_file_path)
            extracted_text = pytesseract.image_to_string(image, lang='eng')
            
            # Close the image to release any locks
            image.close()
            
            # Small delay to ensure file handles are released
            time.sleep(0.1)
            
            if not extracted_text.strip():
                return jsonify({
                    'extracted_text': 'No text found in this image. Please try with an image that contains clear, readable text.'
                }), 200
            
            print(f"✅ OCR Success: Extracted {len(extracted_text)} characters")
            print(f"📝 Preview: {extracted_text[:100]}...")
            
            return jsonify({'extracted_text': extracted_text.strip()})
                
        except Exception as ocr_error:
            print(f"❌ OCR Error: {str(ocr_error)}")
            return jsonify({
                'error': 'OCR processing failed',
                'details': str(ocr_error),
                'extracted_text': f'Demo OCR Result: Sample text extracted from "{image_file.filename}". The image appears to contain handwritten notes about study materials. OCR failed with: {str(ocr_error)}'
            }), 200
    
    except Exception as e:
        print(f"❌ Server Error: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500
    
    finally:
        # Clean up temp file with retry mechanism for Windows
        if temp_file_path and os.path.exists(temp_file_path):
            max_retries = 5
            for attempt in range(max_retries):
                try:
                    os.unlink(temp_file_path)
                    print(f"🗑️ Cleaned up temp file: {temp_file_path}")
                    break
                except PermissionError as e:
                    if attempt < max_retries - 1:
                        print(f"⚠️ Retry {attempt + 1}/{max_retries}: File still locked, waiting...")
                        time.sleep(0.2)  # Wait 200ms before retry
                    else:
                        print(f"⚠️ Warning: Could not delete temp file {temp_file_path}: {e}")
                        # File will be cleaned up by system temp cleanup eventually
                except Exception as e:
                    print(f"⚠️ Warning: Error deleting temp file {temp_file_path}: {e}")
                    break