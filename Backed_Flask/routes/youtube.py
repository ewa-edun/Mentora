from flask import Flask, Blueprint, request, jsonify
from services.gemini_service import genrate_sumary
from services.youtube_service import process_youtube_video

youtube_bp = Blueprint('youtube', __name__)

@youtube_bp.route('/api/summarize-youtube', methods=['POST'])
def summarize_youtube():
    try:
        data = request.get_json()
        url = data.get("url", '').strip()
        
        if not url:
            return jsonify({
                'success': False,
                'error': 'No YouTube URL provided',
                'message': 'Please provide a YouTube URL to summarize',
                'suggestions': [
                    'Enter a complete YouTube URL (e.g., https://youtube.com/watch?v=VIDEO_ID)',
                    'Make sure the URL is copied correctly from your browser'
                ]
            }), 400
        
        # Process the YouTube video
        video_data, error_info = process_youtube_video(url)
        
        if error_info:
            return jsonify({
                'success': False,
                'error': error_info['error'],
                'message': error_info['message'],
                'suggestions': error_info['suggestions'],
                'video_info': error_info.get('video_info', {}),
                'help': {
                    'title': 'Tips for Better Results',
                    'tips': [
                        'Educational videos work best (tutorials, lectures, documentaries)',
                        'Videos with clear speech and narration are ideal',
                        'Make sure the video has captions or subtitles enabled',
                        'Avoid music videos, vlogs, or entertainment content'
                    ]
                }
            }), 400
        
        if not video_data or not video_data.get('transcript'):
            return jsonify({
                'success': False,
                'error': 'No transcript available',
                'message': 'Unable to extract meaningful content from this video',
                'suggestions': [
                    'Try a different educational video with clear narration',
                    'Look for videos that have closed captions enabled',
                    'Search for tutorial or lecture videos on your topic'
                ]
            }), 400
        
        # Summarize the transcript
        summary_result = genrate_sumary(video_data['transcript'])
        
        if 'error' in summary_result:
            return jsonify({
                'success': False,
                'error': 'Failed to generate summary',
                'message': 'The AI was unable to create a summary from the video content',
                'suggestions': [
                    'Try a video with clearer, more structured content',
                    'Look for educational videos with better audio quality',
                    'Consider using a different video on the same topic'
                ]
            }), 500
        
        if 'Summary' not in summary_result:
            return jsonify({
                'success': False,
                'error': 'Summary generation failed',
                'message': 'Unable to create a meaningful summary from this content'
            }), 500
        
        # Success response
        return jsonify({
            'success': True,
            'summary': summary_result['Summary'],
            'video_info': {
                'video_id': video_data['video_id'],
                'title': video_data['title'],
                'duration': video_data.get('duration'),
                'transcript_length': video_data.get('transcript_length', 0)
            },
            'metadata': {
                'processing_time': 'Generated in real-time',
                'content_type': 'educational',
                'quality': 'high' if video_data.get('transcript_length', 0) > 500 else 'medium'
            }
        })
    
    except Exception as e:
        print(f"YouTube API Error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Server error',
            'message': 'An unexpected error occurred while processing the video',
            'suggestions': [
                'Please try again in a moment',
                'If the problem persists, try a different video',
                'Contact support if you continue experiencing issues'
            ],
            'technical_details': str(e) if str(e) else 'Unknown server error'
        }), 500