import os
import re
from googleapiclient.discovery import build
from youtube_transcript_api import YouTubeTranscriptApi
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
    """Get video title and duration from YouTube API"""
    try:
        if not YOUTUBE_API_KEY:
            return None, None
            
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
            return title, duration
        
        return None, None
    except Exception as e:
        print(f"Error getting video info: {e}")
        return None, None

def get_video_transcript(video_id):
    """Get video transcript using youtube-transcript-api"""
    try:
        # Try to get transcript
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        
        # Combine all transcript text
        full_transcript = ' '.join([item['text'] for item in transcript_list])
        return full_transcript
        
    except Exception as e:
        print(f"Error getting transcript: {e}")
        return None

def process_youtube_video(url):
    """Main function to process YouTube video"""
    video_id = extract_video_id(url)
    if not video_id:
        return None, "Invalid YouTube URL"
    
    # Get video info
    title, duration = get_video_info(video_id)
    
    # Get transcript
    transcript = get_video_transcript(video_id)
    
    if not transcript:
        return None, "Could not get transcript for this video. The video may not have captions available."
    
    return {
        'video_id': video_id,
        'title': title or 'Unknown Title',
        'duration': duration,
        'transcript': transcript
    }, None