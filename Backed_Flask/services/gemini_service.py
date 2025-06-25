import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

if not os.getenv("GEMINI_API_KEY"):
    raise EnvironmentError("GEMINI_API_KEY is missing.")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash-latest")


def genrate_sumary(text):
    try:
        prompt = f"Summarize the following text:\n\n{text}"
        responce = model.generate_content(prompt)
        return {'Summary':responce.text}
    except Exception as e:
        return {"error": str(e)}
    
def genrate_Quiz(Paragraph):
    try:
        prompt = f"Genrate the Quiz from the following paragraph:\n\n{Paragraph}"
        responce = model.generate_content(prompt)
        return{'Your Quiz':responce.text}
    except Exception as e:
        return {"error": str(e)}

def ask_qustion(Qustions):
    try:
        prompt = f"Answer this question clearly:\n\n{Qustions}"
        responce = model.generate_content(prompt)
        return{'Your answers':responce.text}
    except Exception as e:
        return {"error": str(e)}

def generate_story_content(topic, character, emotion, duration):
    """
    Generate educational story content using Gemini AI
    """
    try:
        # Calculate approximate word count for target duration (150 words per minute speaking rate)
        target_words = int((duration / 60) * 150)
        
        # Emotion-based story themes
        emotion_themes = {
            'happy': 'celebration, joy, and discovery',
            'calm': 'peace, tranquility, and gentle learning',
            'stressed': 'overcoming challenges and finding inner strength',
            'tired': 'rest, renewal, and gentle encouragement',
            'focused': 'determination, growth, and achievement',
            'sad': 'hope, healing, and emotional support'
        }
        
        theme = emotion_themes.get(emotion, 'adventure and learning')
        
        prompt = f"""
        Create an engaging, educational story about "{topic}" featuring {character['name']} who is {character['personality']}.
        
        Story Requirements:
        - Target length: approximately {target_words} words (for {duration//60} minute narration)
        - Theme: {theme}
        - Educational content about {topic} woven naturally into the narrative
        - Age-appropriate for students (ages 8-18)
        - Include emotional support and encouragement
        - Character should embody their personality: {character['personality']}
        - Story should have a clear beginning, middle, and end
        - Include interactive elements or questions for engagement
        - Positive, uplifting tone throughout
        
        Format the response as a complete story with natural dialogue and descriptive scenes.
        Make it feel magical and inspiring while teaching about {topic}.
        """
        
        response = model.generate_content(prompt)
        story_content = response.text
        
        # Generate a title
        title_prompt = f"Create a short, engaging title for this story about {topic} featuring {character['name']}. Make it sound magical and educational. Choose one title only that relates to the {character['personality']} and the {emotion} chosen."
        title_response = model.generate_content(title_prompt)
        title = title_response.text.strip().replace('"', '')
        
        return {
            'title': title,
            'content': story_content,
            'duration': duration,
            'character': character,
            'emotion': emotion,
            'topic': topic
        }
        
    except Exception as e:
        return {"error": str(e)}