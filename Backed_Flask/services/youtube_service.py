import os
import re
from googleapiclient.discovery import build
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound, VideoUnavailable
from dotenv import load_dotenv

load_dotenv()
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')

def extract_video_id(url):
    """Extract video ID from YouTube URL"""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)',
        r'youtube\.com\/watch\?.*v=([^&\n?#]+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None
def get_video_info(video_id):
    try:
        if not YOUTUBE_API_KEY:
            return None, None, "YouTube API key not configured", False
            
        youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
        request = youtube.videos().list(
            part='snippet,contentDetails',
            id=video_id
        )
        response = request.execute()
        
        if response['items']:
            video = response['items'][0]
            title = video['snippet']['title']
            duration = video['contentDetails']['duration']
            category_id = video['snippet'].get('categoryId', '')
            is_music = category_id == '10'
            return title, duration, None, is_music
        
        return None, None, "Video not found or unavailable", False
    
    except Exception as e:
        print(f"Error getting video info: {e}")
        return None, None, f"Failed to get video information: {str(e)}", False

def get_video_transcript(video_id):
    """Get video transcript using youtube-transcript-api with enhanced error handling"""
    try:
        # Try to get transcript
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        
        # Combine all transcript text
        full_transcript = ' '.join([item['text'] for item in transcript_list])
        
        # Check if transcript is too short (likely auto-generated noise)
        if len(full_transcript.strip()) < 50:
            return None, "Transcript too short - video may not contain meaningful spoken content"
        
        return full_transcript, None
        
    except TranscriptsDisabled:
        return None, "Subtitles are disabled for this video"
    except NoTranscriptFound:
        return None, "No transcript available for this video"
    except VideoUnavailable:
        return None, "Video is unavailable or private"
    except Exception as e:
        error_msg = str(e).lower()
        
        # Handle specific error cases
        if "subtitles are disabled" in error_msg:
            return None, "Subtitles are disabled for this video"
        elif "no transcript" in error_msg:
            return None, "No transcript available for this video"
        elif "video unavailable" in error_msg:
            return None, "Video is unavailable or private"
        elif "could not retrieve" in error_msg:
            return None, "Unable to retrieve transcript - video may not have captions"
        else:
            return None, f"Transcript extraction failed: {str(e)}"

def is_educational_content(title, transcript_sample=""):
    """
    Determine if content is likely educational based on title and transcript sample
    """
    if not title:
        return True  # Default to allowing if we can't determine
    
    title_lower = title.lower()
    
    # Educational keywords
    educational_keywords = [
        'tutorial', 'lesson', 'learn', 'education', 'course', 'lecture', 
        'explain', 'how to', 'guide', 'study', 'science', 'math', 'history',
        'programming', 'coding', 'university', 'school', 'academic', 'research'
    ]
    
    # Non-educational keywords (music, entertainment, etc.)
    non_educational_keywords = [
        'music video', 'official video', 'lyrics', 'song', 'album', 'artist',
        'concert', 'live performance', 'mv', 'official mv', 'music'
    ]
    
    # Check for educational content
    for keyword in educational_keywords:
        if keyword in title_lower:
            return True
    
    # Check for non-educational content
    for keyword in non_educational_keywords:
        if keyword in title_lower:
            return False
    
    # If transcript sample is available, check it too
    if transcript_sample:
        transcript_lower = transcript_sample.lower()
        educational_phrases = ['today we will', 'in this video', 'let me explain', 'first step']
        for phrase in educational_phrases:
            if phrase in transcript_lower:
                return True
    
    return True  # Default to allowing

def get_content_type_suggestion(title="", is_music=False):
    """
    Provide helpful suggestions based on content type
    """
    if is_music or any(keyword in title.lower() for keyword in ['music', 'song', 'album', 'artist']):
        return {
            'type': 'music',
            'message': 'This appears to be a music video. Music videos typically don\'t have educational transcripts.',
            'suggestions': [
                'Try educational videos like tutorials, lectures, or documentaries',
                'Look for videos with spoken explanations or narration',
                'Search for "how to", "explained", or "tutorial" videos on your topic'
            ]
        }
    
    return {
        'type': 'unknown',
        'message': 'This video doesn\'t appear to have captions or transcripts available.',
        'suggestions': [
            'Try videos that have closed captions enabled',
            'Look for educational channels that provide transcripts',
            'Search for lecture or tutorial videos which usually have better caption support'
        ]
    }

def process_youtube_video(url):
    """Main function to process YouTube video with comprehensive error handling"""
    # Validate URL
    video_id = extract_video_id(url)
    if not video_id:
        return None, {
            'error': 'Invalid YouTube URL',
            'message': 'Please provide a valid YouTube URL (e.g., https://youtube.com/watch?v=VIDEO_ID)',
            'suggestions': [
                'Make sure the URL is from YouTube',
                'Check that the URL is complete and properly formatted',
                'Try copying the URL directly from your browser'
            ]
        }
    
    # Get video information
    title, duration, api_error, is_music = get_video_info(video_id)
    
    if api_error:
        print(f"API Error: {api_error}")
        # Continue without API data, but note the limitation
    
    # Get transcript
    transcript, transcript_error = get_video_transcript(video_id)
    
    if transcript_error:
        # Provide specific error handling based on content type
        content_suggestion = get_content_type_suggestion(title or "", is_music)
        
        return None, {
            'error': transcript_error,
            'message': content_suggestion['message'],
            'suggestions': content_suggestion['suggestions'],
            'video_info': {
                'title': title or 'Unknown Title',
                'video_id': video_id,
                'content_type': content_suggestion['type']
            }
        }
    
    # Check if content seems educational
    if title and not is_educational_content(title, transcript[:200] if transcript else ""):
        return None, {
            'error': 'Content may not be educational',
            'message': 'This video appears to be entertainment content rather than educational material.',
            'suggestions': [
                'Try educational videos like tutorials, lectures, or documentaries',
                'Look for videos with detailed explanations or teaching content',
                'Search for academic or instructional content on your topic'
            ],
            'video_info': {
                'title': title,
                'video_id': video_id,
                'content_type': 'entertainment'
            }
        }
    
    # Success case
    return {
        'video_id': video_id,
        'title': title or 'Unknown Title',
        'duration': duration,
        'transcript': transcript,
        'transcript_length': len(transcript) if transcript else 0
    }, None