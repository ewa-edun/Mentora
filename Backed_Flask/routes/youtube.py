from flask import Flask, Blueprint, request, jsonify
from services.gemini_service import genrate_sumary
from services.youtube_service import process_youtube_video

youtube_bp = Blueprint('youtube', __name__)

@youtube_bp.route('/api/summarize-youtube', methods=['POST'])
def summarize_youtube():
    try:
        data = request.get_json()
        url = data.get("url", '')
        
        if not url:
            return jsonify({'error': 'No YouTube URL provided'}), 400
        
        # Process the YouTube video
        video_data, error = process_youtube_video(url)
        
        if error:
            return jsonify({'error': error}), 400
        
        if not video_data:
            return jsonify({'error': 'Failed to process YouTube video'}), 500
        
        # Summarize the transcript
        summary_result = genrate_sumary(video_data['transcript'])
        
        if 'Summary' in summary_result:
            return jsonify({
                'summary': summary_result['Summary'],
                'video_id': video_data['video_id'],
                'title': video_data['title'],
                'duration': video_data['duration'],
                'transcript_length': len(video_data['transcript'])
            })
        else:
            return jsonify({'error': 'Failed to generate summary'}), 500
    
    except Exception as e:
        print(f"YouTube API Error: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500