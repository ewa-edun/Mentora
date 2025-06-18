from flask import Flask, jsonify
from routes.summarize import summary_bp
from routes.quiz import quiz_bp
from routes.emotion import emotion_bp
from routes.ask import ask_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.register_blueprint(summary_bp)
app.register_blueprint(quiz_bp)
app.register_blueprint(emotion_bp)
app.register_blueprint(ask_bp)

@app.route('/')
def welcome():
    return "Welcome to Mentora"

if __name__ == '__main__':
    app.run(debug=True)