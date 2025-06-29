import os
import google.generativeai as genai
from dotenv import load_dotenv
import json

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
    
def genrate_Quiz(Paragraph, difficulty="Beginner"):
    try:
        # Set question count and prompt style based on difficulty
        if difficulty.lower() == "beginner":
            style = "Ask basic, direct questions that test fundamental understanding. Use simple language."
        elif difficulty.lower() == "intermediate":
            style = "Ask moderately challenging questions that require some reasoning, application, or synthesis. Mix in a few scenario-based questions."
        else:  # Advanced/Difficult
            style = "Ask challenging, tactical questions that require deep reasoning, analysis, and problem-solving. Use case studies, multi-step reasoning, or questions that require connecting concepts."

        prompt = f"""
Generate a multiple choice quiz from the following text. Follow this EXACT format:

**Question 1:** [Question text here]
A) [Option A]
B) [Option B] 
C) [Option C]
D) [Option D]
**Answer:** [Letter only - A, B, C, or D]

**Question 2:** [Question text here]
A) [Option A]
B) [Option B]
C) [Option C] 
D) [Option D]
**Answer:** [Letter only - A, B, C, or D]

Continue this pattern for 8-16 questions. Make sure each question tests understanding of the key concepts. 
{style}

Text to create quiz from:
{Paragraph}
"""
        
        print(f"🤖 Sending prompt to Gemini (difficulty: {difficulty}):")
        print(f"   Prompt length: {len(prompt)} characters")
        
        response = model.generate_content(prompt)
        quiz_text = response.text
        
        print(f"🤖 Gemini Response:")
        print(f"   Response length: {len(quiz_text)} characters")
        print(f"   Response preview: {quiz_text[:300]}...")
        
        return {'Your Quiz': quiz_text}
    except Exception as e:
        print(f"❌ Gemini API Error: {str(e)}")
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


def generate_memory_recap(study_data, time_range, custom_query=""):
    """
    Generate memory recap using Gemini AI based on user's study history
    """
    try:
        # Prepare study data summary
        study_sessions = study_data.get('study_sessions', [])
        break_sessions = study_data.get('break_sessions', [])
        learning_progress = study_data.get('learning_progress', [])
        
        # Calculate basic stats
        total_study_time = sum(session.get('duration', 0) for session in study_sessions)
        sessions_completed = len(study_sessions)
        topics_studied = list(set(session.get('metadata', {}).get('topic', 'Unknown') 
                                for session in study_sessions 
                                if session.get('metadata', {}).get('topic')))
        
        # Calculate average quiz scores
        quiz_scores = []
        for session in study_sessions:
            if session.get('content', {}).get('score'):
                quiz_scores.append(session['content']['score'])
        average_score = sum(quiz_scores) / len(quiz_scores) if quiz_scores else 0
        
        # Get emotional trends
        emotions = [session.get('emotion') for session in break_sessions if session.get('emotion')]
        emotional_trends = list(set(emotions)) if emotions else ['neutral']
        
        # Create context for AI
        context = f"""
        User Study Data Summary ({time_range}):
        - Total Study Time: {total_study_time // 3600}h {(total_study_time % 3600) // 60}m
        - Sessions Completed: {sessions_completed}
        - Topics Studied: {', '.join(topics_studied[:10])}  # Limit to first 10
        - Average Quiz Score: {average_score:.1f}%
        - Emotional Trends: {', '.join(emotional_trends)}
        - Learning Progress: {len(learning_progress)} topics tracked
        
        Recent Study Sessions:
        {json.dumps(study_sessions[-5:], indent=2) if study_sessions else 'No recent sessions'}
        
        Recent Break Sessions:
        {json.dumps(break_sessions[-3:], indent=2) if break_sessions else 'No recent breaks'}
        """
        
        if custom_query:
            prompt = f"""
            Based on the following user study data, answer this specific question: "{custom_query}"
            
            {context}
            
            Provide a personalized, encouraging response that:
            1. Directly answers their question
            2. Highlights their achievements and progress
            3. Identifies patterns in their learning
            4. Gives specific, actionable recommendations
            5. Maintains an encouraging, supportive tone
            
            Format your response as a JSON object with these fields:
            - totalStudyTime: {total_study_time}
            - sessionsCompleted: {sessions_completed}
            - topicsStudied: {json.dumps(topics_studied)}
            - averageScore: {average_score}
            - emotionalTrends: {json.dumps(emotional_trends)}
            - achievements: [list of recent achievements]
            - insights: [list of learning insights]
            - recommendations: [list of personalized recommendations]
            """
        else:
            prompt = f"""
            Create a comprehensive learning recap based on this user's study data:
            
            {context}
            
            Generate an encouraging, personalized summary that:
            1. Celebrates their learning achievements
            2. Identifies learning patterns and trends
            3. Provides insights about their study habits
            4. Suggests improvements and next steps
            5. Maintains a positive, motivating tone
            
            Format your response as a JSON object with these fields:
            - totalStudyTime: {total_study_time}
            - sessionsCompleted: {sessions_completed}
            - topicsStudied: {json.dumps(topics_studied)}
            - averageScore: {average_score}
            - emotionalTrends: {json.dumps(emotional_trends)}
            - achievements: [list of recent achievements based on their data]
            - insights: [list of learning insights and patterns]
            - recommendations: [list of personalized recommendations]
            """
        
        response = model.generate_content(prompt)
        
        try:
            # Try to parse as JSON first
            recap_data = json.loads(response.text)
            return recap_data
        except json.JSONDecodeError:
            # If JSON parsing fails, create structured response
            return {
                'totalStudyTime': total_study_time,
                'sessionsCompleted': sessions_completed,
                'topicsStudied': topics_studied,
                'averageScore': average_score,
                'emotionalTrends': emotional_trends,
                'achievements': [
                    f"Completed {sessions_completed} study sessions",
                    f"Studied {len(topics_studied)} different topics",
                    f"Maintained {average_score:.0f}% average quiz score" if average_score > 0 else "Started your learning journey"
                ],
                'insights': [
                    f"You've been most commonly feeling {emotional_trends[0] if emotional_trends else 'neutral'} during breaks",
                    f"Your study sessions show consistent engagement with {len(topics_studied)} topics",
                    "You're building a strong learning habit through regular practice"
                ],
                'recommendations': [
                    "Continue your consistent study routine",
                    "Try exploring connections between different topics you've studied",
                    "Consider setting specific learning goals for next week"
                ]
            }
        
    except Exception as e:
        print(f"❌ Memory recap generation error: {str(e)}")
        return {"error": str(e)}

def generate_study_plan_content(topic, difficulty, user_context=None):
    """
    Generate 5-day study plan using Gemini AI
    """
    try:
        # Difficulty-based parameters
        difficulty_params = {
            'beginner': {
                'daily_time': '1-2 hours',
                'complexity': 'basic concepts and fundamentals',
                'pace': 'gentle and thorough'
            },
            'intermediate': {
                'daily_time': '2-3 hours',
                'complexity': 'intermediate concepts with practical applications',
                'pace': 'steady with hands-on practice'
            },
            'advanced': {
                'daily_time': '3-4 hours',
                'complexity': 'advanced concepts and real-world projects',
                'pace': 'intensive with challenging exercises'
            }
        }
        
        params = difficulty_params.get(difficulty, difficulty_params['intermediate'])
        
        # Add user context if available
        context_info = ""
        if user_context and user_context.get('study_sessions'):
            recent_topics = [session.get('metadata', {}).get('topic') 
                           for session in user_context['study_sessions'][-5:] 
                           if session.get('metadata', {}).get('topic')]
            if recent_topics:
                context_info = f"\nUser's recent study topics: {', '.join(set(recent_topics))}"
        
        prompt = f"""
        Create a comprehensive 5-day study plan for learning "{topic}" at {difficulty} level.
        
        Requirements:
        - Target: {params['daily_time']} per day
        - Focus: {params['complexity']}
        - Pace: {params['pace']}
        {context_info}
        
        For each day, provide:
        1. A clear, engaging title
        2. Detailed description of what will be learned
        3. Specific tasks and activities (3-5 per day)
        4. Estimated time commitment
        5. Recommended resources or tools
        
        Also include:
        - Overall study tips for success
        - How to track progress
        - What to do if falling behind
        
        Format as JSON with this structure:
        {{
            "topic": "{topic}",
            "difficulty": "{difficulty}",
            "totalDuration": "5 days ({params['daily_time']} daily)",
            "days": [
                {{
                    "day": 1,
                    "title": "Day title",
                    "description": "What you'll learn today",
                    "tasks": ["Task 1", "Task 2", "Task 3"],
                    "estimatedTime": "Time estimate",
                    "resources": ["Resource 1", "Resource 2"]
                }}
            ],
            "tips": ["Tip 1", "Tip 2", "Tip 3"]
        }}
        
        Make it engaging, practical, and achievable. Focus on building knowledge progressively.
        """
        
        response = model.generate_content(prompt)
        
        try:
            # Try to parse as JSON
            plan_data = json.loads(response.text)
            return plan_data
        except json.JSONDecodeError:
            # If JSON parsing fails, create a structured fallback
            return create_fallback_study_plan(topic, difficulty, params)
        
    except Exception as e:
        print(f"❌ Study plan generation error: {str(e)}")
        return {"error": str(e)}

def create_fallback_study_plan(topic, difficulty, params):
    """
    Create a fallback study plan if AI generation fails
    """
    return {
        "topic": topic,
        "difficulty": difficulty,
        "totalDuration": f"5 days ({params['daily_time']} daily)",
        "days": [
            {
                "day": 1,
                "title": f"Introduction to {topic}",
                "description": f"Get familiar with the basics and core concepts of {topic}",
                "tasks": [
                    f"Research what {topic} is and its applications",
                    "Watch introductory videos or tutorials",
                    "Set up your learning environment",
                    "Create a study schedule"
                ],
                "estimatedTime": params['daily_time'],
                "resources": ["Online tutorials", "Documentation", "Video courses"]
            },
            {
                "day": 2,
                "title": f"Fundamentals of {topic}",
                "description": "Dive deeper into the fundamental concepts and principles",
                "tasks": [
                    "Study core concepts and terminology",
                    "Complete basic exercises or examples",
                    "Take notes on key principles",
                    "Practice with simple problems"
                ],
                "estimatedTime": params['daily_time'],
                "resources": ["Textbooks", "Practice exercises", "Online courses"]
            },
            {
                "day": 3,
                "title": f"Hands-on Practice with {topic}",
                "description": "Apply what you've learned through practical exercises",
                "tasks": [
                    "Work on practical examples",
                    "Build a small project or exercise",
                    "Experiment with different approaches",
                    "Debug and troubleshoot issues"
                ],
                "estimatedTime": params['daily_time'],
                "resources": ["Development tools", "Practice platforms", "Code examples"]
            },
            {
                "day": 4,
                "title": f"Advanced Concepts in {topic}",
                "description": "Explore more complex topics and real-world applications",
                "tasks": [
                    "Study advanced concepts",
                    "Analyze real-world examples",
                    "Work on a more complex project",
                    "Connect concepts to practical applications"
                ],
                "estimatedTime": params['daily_time'],
                "resources": ["Advanced tutorials", "Case studies", "Professional examples"]
            },
            {
                "day": 5,
                "title": f"Mastery and Review of {topic}",
                "description": "Consolidate your learning and plan next steps",
                "tasks": [
                    "Review all concepts learned",
                    "Complete a comprehensive project",
                    "Test your knowledge with quizzes",
                    "Plan your continued learning path"
                ],
                "estimatedTime": params['daily_time'],
                "resources": ["Review materials", "Assessment tools", "Next steps guides"]
            }
        ],
        "tips": [
            "Set aside dedicated time each day for focused learning",
            "Take regular breaks to maintain concentration",
            "Practice actively rather than just reading",
            "Don't hesitate to revisit earlier concepts if needed",
            "Connect new learning to things you already know",
            "Track your progress and celebrate small wins"
        ]
    }