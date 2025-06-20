import os
import re
import random
from dotenv import load_dotenv

load_dotenv()

def analyze_text_emotion(text):
    """
    Analyze emotion from text using simple keyword matching
    In production, you'd use a more sophisticated NLP model
    """
    text_lower = text.lower()
    
    # Emotion keywords mapping
    emotion_keywords = {
        'stressed': ['stressed', 'anxious', 'worried', 'overwhelmed', 'pressure', 'panic', 'nervous', 'tense'],
        'tired': ['tired', 'exhausted', 'sleepy', 'fatigue', 'drained', 'weary', 'worn out'],
        'sad': ['sad', 'depressed', 'down', 'upset', 'disappointed', 'gloomy', 'melancholy'],
        'angry': ['angry', 'mad', 'frustrated', 'irritated', 'annoyed', 'furious', 'rage'],
        'happy': ['happy', 'joy', 'excited', 'cheerful', 'glad', 'delighted', 'thrilled'],
        'calm': ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'content'],
        'focused': ['focused', 'concentrated', 'determined', 'motivated', 'productive'],
        'confused': ['confused', 'lost', 'uncertain', 'puzzled', 'unclear', 'bewildered']
    }
    
    # Count emotion indicators
    emotion_scores = {}
    for emotion, keywords in emotion_keywords.items():
        score = sum(1 for keyword in keywords if keyword in text_lower)
        if score > 0:
            emotion_scores[emotion] = score
    
    # Determine primary emotion
    if emotion_scores:
        primary_emotion = max(emotion_scores, key=emotion_scores.get)
        confidence = min(emotion_scores[primary_emotion] * 0.3, 1.0)
    else:
        # Default to neutral if no keywords found
        primary_emotion = 'calm'
        confidence = 0.5
    
    return primary_emotion, confidence

def get_break_suggestions(emotion, duration_preference='medium'):
    """
    Get personalized break suggestions based on detected emotion
    """
    suggestions_db = {
        'stressed': {
            'activities': [
                {
                    'type': 'breathing',
                    'title': 'Box Breathing Exercise',
                    'duration': '5 min',
                    'description': 'Inhale for 4, hold for 4, exhale for 4, hold for 4',
                    'instructions': [
                        'Sit comfortably with your back straight',
                        'Inhale slowly through your nose for 4 counts',
                        'Hold your breath for 4 counts',
                        'Exhale slowly through your mouth for 4 counts',
                        'Hold empty for 4 counts',
                        'Repeat for 5 minutes'
                    ]
                },
                {
                    'type': 'meditation',
                    'title': 'Stress Relief Meditation',
                    'duration': '10 min',
                    'description': 'Guided meditation to release tension and anxiety',
                    'instructions': [
                        'Find a quiet, comfortable space',
                        'Close your eyes and focus on your breath',
                        'Notice areas of tension in your body',
                        'Breathe into those areas and let them relax',
                        'Repeat the mantra: "I am calm and in control"'
                    ]
                },
                {
                    'type': 'movement',
                    'title': 'Gentle Stretching',
                    'duration': '8 min',
                    'description': 'Simple stretches to release physical tension',
                    'instructions': [
                        'Neck rolls: 5 in each direction',
                        'Shoulder shrugs: 10 repetitions',
                        'Arm circles: 10 forward, 10 backward',
                        'Gentle spinal twist: Hold 30 seconds each side',
                        'Deep forward fold: Hold for 1 minute'
                    ]
                }
            ],
            'affirmations': [
                'I am capable of handling whatever comes my way',
                'This feeling is temporary and will pass',
                'I choose peace over worry',
                'I am stronger than my stress'
            ]
        },
        'tired': {
            'activities': [
                {
                    'type': 'breathing',
                    'title': 'Energizing Breath',
                    'duration': '3 min',
                    'description': 'Quick breathing technique to boost energy',
                    'instructions': [
                        'Sit up straight with good posture',
                        'Take 3 deep, slow breaths to center yourself',
                        'Breathe in quickly through nose (2 counts)',
                        'Breathe out quickly through mouth (2 counts)',
                        'Repeat rapidly for 30 seconds, then rest',
                        'Do 3 rounds total'
                    ]
                },
                {
                    'type': 'movement',
                    'title': 'Energy Boost Exercises',
                    'duration': '7 min',
                    'description': 'Light exercises to wake up your body',
                    'instructions': [
                        'Jumping jacks: 30 seconds',
                        'Arm swings: 20 repetitions',
                        'Marching in place: 1 minute',
                        'Gentle backbends: 5 repetitions',
                        'Calf raises: 15 repetitions'
                    ]
                },
                {
                    'type': 'meditation',
                    'title': 'Power Nap Meditation',
                    'duration': '15 min',
                    'description': 'Restorative meditation for mental energy',
                    'instructions': [
                        'Lie down comfortably or sit with support',
                        'Set a gentle timer for 15 minutes',
                        'Focus on your breath becoming slower',
                        'Let your mind rest without forcing sleep',
                        'Wake up gently and stretch'
                    ]
                }
            ],
            'affirmations': [
                'I am recharging my energy naturally',
                'Rest is productive and necessary',
                'I honor my body\'s need for restoration',
                'I will feel refreshed and renewed'
            ]
        },
        'sad': {
            'activities': [
                {
                    'type': 'meditation',
                    'title': 'Self-Compassion Practice',
                    'duration': '12 min',
                    'description': 'Loving-kindness meditation for emotional healing',
                    'instructions': [
                        'Place your hand on your heart',
                        'Acknowledge that you\'re experiencing difficulty',
                        'Remember that sadness is part of human experience',
                        'Send yourself kind thoughts and wishes',
                        'Extend compassion to others who feel sad'
                    ]
                },
                {
                    'type': 'creative',
                    'title': 'Gratitude Journaling',
                    'duration': '10 min',
                    'description': 'Write down things you\'re grateful for',
                    'instructions': [
                        'Get a piece of paper or open a notes app',
                        'Write down 3 things you\'re grateful for today',
                        'Include why each thing matters to you',
                        'Think of 2 people who care about you',
                        'Write a kind message to yourself'
                    ]
                },
                {
                    'type': 'breathing',
                    'title': 'Heart-Centered Breathing',
                    'duration': '8 min',
                    'description': 'Breathing practice to open the heart',
                    'instructions': [
                        'Place both hands on your heart',
                        'Breathe slowly and deeply into your heart space',
                        'Imagine breathing in warmth and love',
                        'Breathe out any sadness or pain',
                        'Continue with gentle, loving breaths'
                    ]
                }
            ],
            'affirmations': [
                'It\'s okay to feel sad sometimes',
                'I am worthy of love and compassion',
                'This feeling will pass, and I will feel joy again',
                'I am not alone in my struggles'
            ]
        },
        'happy': {
            'activities': [
                {
                    'type': 'celebration',
                    'title': 'Gratitude Dance',
                    'duration': '5 min',
                    'description': 'Express your joy through movement',
                    'instructions': [
                        'Put on your favorite upbeat song',
                        'Dance freely and expressively',
                        'Think about what made you happy today',
                        'Let your body move with gratitude',
                        'Smile and enjoy the moment'
                    ]
                },
                {
                    'type': 'sharing',
                    'title': 'Spread the Joy',
                    'duration': '10 min',
                    'description': 'Share your positive energy with others',
                    'instructions': [
                        'Send a kind message to a friend',
                        'Write a positive review for a business you love',
                        'Compliment someone genuinely',
                        'Share something that made you smile',
                        'Plan something fun for later'
                    ]
                },
                {
                    'type': 'meditation',
                    'title': 'Joy Amplification',
                    'duration': '8 min',
                    'description': 'Meditation to expand and savor happiness',
                    'instructions': [
                        'Sit comfortably and close your eyes',
                        'Recall the moment that brought you joy',
                        'Feel the happiness in your body',
                        'Breathe the joy into every cell',
                        'Send this happiness out to the world'
                    ]
                }
            ],
            'affirmations': [
                'I deserve to feel happy and joyful',
                'My happiness contributes to the world\'s joy',
                'I am grateful for this moment of happiness',
                'Joy is my natural state of being'
            ]
        },
        'calm': {
            'activities': [
                {
                    'type': 'meditation',
                    'title': 'Mindful Awareness',
                    'duration': '10 min',
                    'description': 'Deepen your sense of peace and presence',
                    'instructions': [
                        'Sit quietly and notice your surroundings',
                        'Observe sounds, sensations, and thoughts',
                        'Don\'t judge, just notice with curiosity',
                        'Return to your breath when mind wanders',
                        'Rest in this peaceful awareness'
                    ]
                },
                {
                    'type': 'creative',
                    'title': 'Mindful Sketching',
                    'duration': '15 min',
                    'description': 'Draw something beautiful around you',
                    'instructions': [
                        'Find a simple object to draw',
                        'Look at it carefully, noticing details',
                        'Draw slowly and mindfully',
                        'Focus on the process, not the result',
                        'Enjoy the meditative quality of creating'
                    ]
                },
                {
                    'type': 'nature',
                    'title': 'Window Gazing',
                    'duration': '5 min',
                    'description': 'Connect with nature from indoors',
                    'instructions': [
                        'Look out a window at the sky or trees',
                        'Notice the colors, shapes, and movement',
                        'Breathe deeply and feel connected to nature',
                        'Let your mind rest in this peaceful view',
                        'Appreciate the beauty around you'
                    ]
                }
            ],
            'affirmations': [
                'I am at peace with myself and the world',
                'Calmness is my superpower',
                'I choose serenity in every moment',
                'Peace flows through me naturally'
            ]
        },
        'focused': {
            'activities': [
                {
                    'type': 'meditation',
                    'title': 'Concentration Enhancement',
                    'duration': '8 min',
                    'description': 'Sharpen your mental focus',
                    'instructions': [
                        'Choose a single point of focus (breath, sound, or object)',
                        'When mind wanders, gently return to your focus',
                        'Notice how concentration feels in your body',
                        'Appreciate your mind\'s ability to focus',
                        'End with intention for continued focus'
                    ]
                },
                {
                    'type': 'brain',
                    'title': 'Mental Clarity Break',
                    'duration': '6 min',
                    'description': 'Quick exercises to boost mental sharpness',
                    'instructions': [
                        'Do 20 jumping jacks to increase blood flow',
                        'Practice deep breathing for 2 minutes',
                        'Do simple math problems in your head',
                        'Visualize your next task clearly',
                        'Set a clear intention for your work'
                    ]
                },
                {
                    'type': 'planning',
                    'title': 'Priority Setting',
                    'duration': '10 min',
                    'description': 'Organize your thoughts and tasks',
                    'instructions': [
                        'Write down your top 3 priorities',
                        'Break each priority into smaller steps',
                        'Estimate time needed for each step',
                        'Choose which to tackle first',
                        'Visualize completing each task successfully'
                    ]
                }
            ],
            'affirmations': [
                'My mind is clear and focused',
                'I accomplish tasks with ease and efficiency',
                'I am fully present in everything I do',
                'Focus comes naturally to me'
            ]
        }
    }
    
    # Default to calm if emotion not found
    emotion_data = suggestions_db.get(emotion, suggestions_db['calm'])
    
    # Select random affirmation
    random_affirmation = random.choice(emotion_data['affirmations'])
    
    return {
        'emotion': emotion,
        'activities': emotion_data['activities'],
        'affirmation': random_affirmation,
        'color_scheme': get_emotion_colors(emotion)
    }

def get_emotion_colors(emotion):
    """Get color scheme for emotion"""
    colors = {
        'stressed': {'primary': '#f97316', 'secondary': '#ea580c', 'bg': '#fed7aa'},
        'tired': {'primary': '#8b5cf6', 'secondary': '#7c3aed', 'bg': '#ddd6fe'},
        'sad': {'primary': '#3b82f6', 'secondary': '#2563eb', 'bg': '#bfdbfe'},
        'happy': {'primary': '#eab308', 'secondary': '#ca8a04', 'bg': '#fef3c7'},
        'calm': {'primary': '#06b6d4', 'secondary': '#0891b2', 'bg': '#a5f3fc'},
        'focused': {'primary': '#10b981', 'secondary': '#059669', 'bg': '#a7f3d0'},
        'angry': {'primary': '#ef4444', 'secondary': '#dc2626', 'bg': '#fecaca'},
        'confused': {'primary': '#6b7280', 'secondary': '#4b5563', 'bg': '#d1d5db'}
    }
    return colors.get(emotion, colors['calm'])

def detect_emotion_from_voice_text(text):
    """
    Main function to detect emotion from voice input text
    """
    if not text or len(text.strip()) < 3:
        return {
            'emotion': 'calm',
            'confidence': 0.5,
            'suggestions': get_break_suggestions('calm'),
            'message': 'Please speak a bit more so I can better understand your emotional state.'
        }
    
    emotion, confidence = analyze_text_emotion(text)
    suggestions = get_break_suggestions(emotion)
    
    return {
        'emotion': emotion,
        'confidence': confidence,
        'suggestions': suggestions,
        'message': f"I detected that you're feeling {emotion}. Here are some personalized suggestions to help you."
    }