from flask import Flask, jsonify
from routes.summarize import summary_bp
from routes.quiz import quiz_bp
from routes.emotion import emotion_bp
from routes.ask import ask_bp
from routes.youtube import youtube_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Register blueprints
app.register_blueprint(summary_bp)
app.register_blueprint(quiz_bp)
app.register_blueprint(emotion_bp)
app.register_blueprint(ask_bp)
app.register_blueprint(youtube_bp)

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
            '/api/detect-emotion'
        ]
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy', 
        'message': 'Mentora API is running! 🚀',
        'version': '1.0.0'
    })

if __name__ == '__main__':
    print("🚀 Starting Mentora Flask Backend...")
    print("📡 API will be available at: http://127.0.0.1:5000")
    print("🔗 Health check: http://127.0.0.1:5000/api/health")
    app.run(debug=True, host='127.0.0.1', port=5000)