from flask import Flask, jsonify
from routes.summarize import summary_bp
from routes.quiz import quiz_bp
from routes.emotion import emotion_bp
from routes.ask import ask_bp
from routes.youtube import youtube_bp
from routes.voice import voice_bp
from routes.transcribe import transcribe_bp
from routes.storytelling import storytelling_bp
from routes.analytics import analytics_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["*"], supports_credentials=True) 
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10 MB
# Set maximum content length for file uploads

# Register blueprints
app.register_blueprint(summary_bp)
app.register_blueprint(quiz_bp)
app.register_blueprint(emotion_bp)
app.register_blueprint(ask_bp)
app.register_blueprint(youtube_bp)
app.register_blueprint(voice_bp)
app.register_blueprint(transcribe_bp)
app.register_blueprint(storytelling_bp)
app.register_blueprint(analytics_bp)

@app.route('/')
def welcome():
    return jsonify({
        'message': 'Welcome to Mentora API! 🧠',
        'status': 'running',
        'endpoints': [
            '/api/summarize',
            '/api/summarize-pdf', 
            '/api/ocr',
            '/api/generate-quiz',
            '/api/ask-question',
            '/api/summarize-youtube',
            '/api/detect-emotion',
            '/api/text-to-speech',
            '/api/voices',
            '/api/generate-story',
            '/api/generate-avatar-video',
            '/api/generate-voice',
            '/api/characters',
            '/api/analytics/charts',
            '/api/analytics/insights',
            '/api/transcribe',
        ]
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy', 
        'message': 'Mentora API is running! 🚀',
        'version': '1.0.0'
    })

@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify({'error': 'PDF file is too large. Maximum allowed size is 10MB.'}), 413

if __name__ == '__main__':
    print("🚀 Starting Mentora Flask Backend...")
    print("📡 API will be available at: http://127.0.0.1:5000")
    print("🔗 Health check: http://127.0.0.1:5000/api/health")
    app.run(debug=True, host='127.0.0.1', port=5000)