from flask import Blueprint, request, jsonify
from services.gemini_service import generate_memory_recap, generate_study_plan_content
from datetime import datetime, timedelta
import json

memory_bp = Blueprint('memory', __name__)

@memory_bp.route('/api/memory/recap', methods=['POST'])
def get_memory_recap():
    """
    Generate memory recap based on user's study history
    In production, replace get_simulated_study_data() with actual Firebase queries
    """
    try:
        data = request.get_json()
        user_id = data.get('userId')
        time_range = data.get('timeRange', 'week')  # week, month, custom
        custom_query = data.get('customQuery', '')
        
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400
        
        print(f"📊 Memory Recap Request:")
        print(f"   User ID: {user_id}")
        print(f"   Time Range: {time_range}")
        print(f"   Custom Query: {custom_query}")
        
        # TODO: Replace with actual Firebase queries using your existing functions:
        # from firebase_admin import firestore
        # db = firestore.client()
        # 
        # # Get user's actual study data
        # study_sessions = get_user_study_sessions(user_id, time_range)
        # break_sessions = get_user_break_sessions(user_id, time_range)
        # learning_progress = get_user_learning_progress(user_id)
        # emotion_history = get_user_emotion_history(user_id, time_range)
        #
        # study_data = {
        #     'study_sessions': study_sessions,
        #     'break_sessions': break_sessions,
        #     'learning_progress': learning_progress,
        #     'emotion_history': emotion_history
        # }
        
        # For now, using simulated data - replace this in production
        study_data = get_production_study_data(user_id, time_range)
        
        # Generate AI recap using Gemini
        recap_result = generate_memory_recap(study_data, time_range, custom_query)
        
        if 'error' in recap_result:
            print(f"❌ Memory recap generation failed: {recap_result['error']}")
            return jsonify({'error': recap_result['error']}), 500
        
        print(f"✅ Memory recap generated successfully")
        return jsonify({
            'success': True,
            'data': recap_result
        })
    
    except Exception as e:
        print(f"❌ Memory recap error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@memory_bp.route('/api/memory/study-plan', methods=['POST'])
def generate_study_plan():
    """
    Generate 5-day study plan for a given topic
    """
    try:
        data = request.get_json()
        topic = data.get('topic', '')
        user_id = data.get('userId', '')
        difficulty = data.get('difficulty', 'intermediate')
        
        if not topic:
            return jsonify({'error': 'Topic is required'}), 400
        
        print(f"📚 Study Plan Generation Request:")
        print(f"   Topic: {topic}")
        print(f"   User ID: {user_id}")
        print(f"   Difficulty: {difficulty}")
        
        # Get user's learning history for personalization
        user_context = {}
        if user_id:
            try:
                user_context = get_production_study_data(user_id, 'month')
            except Exception as e:
                print(f"⚠️ Could not get user context: {e}")
                user_context = {}
        
        # Generate study plan using Gemini
        plan_result = generate_study_plan_content(topic, difficulty, user_context)
        
        if 'error' in plan_result:
            print(f"❌ Study plan generation failed: {plan_result['error']}")
            return jsonify({'error': plan_result['error']}), 500
        
        print(f"✅ Study plan generated successfully for: {topic}")
        return jsonify({
            'success': True,
            'data': plan_result
        })
    
    except Exception as e:
        print(f"❌ Study plan generation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def get_production_study_data(user_id, time_range='week'):
    """
    Get actual user study data from Firebase
    TODO: Replace this function with actual Firebase queries using your existing functions
    
    This should query your existing Firestore collections:
    - studySessions
    - breakSessions  
    - learningProgress
    - emotions
    
    Example implementation:
    
    from firebase_admin import firestore
    from datetime import datetime, timedelta
    
    db = firestore.client()
    
    # Calculate date range
    current_time = datetime.now()
    if time_range == 'week':
        start_date = current_time - timedelta(days=7)
    elif time_range == 'month':
        start_date = current_time - timedelta(days=30)
    else:
        start_date = current_time - timedelta(days=90)
    
    # Query study sessions
    study_sessions_ref = db.collection('studySessions')
    study_sessions_query = study_sessions_ref.where('userId', '==', user_id).where('createdAt', '>=', start_date)
    study_sessions = [doc.to_dict() for doc in study_sessions_query.stream()]
    
    # Query break sessions
    break_sessions_ref = db.collection('breakSessions')
    break_sessions_query = break_sessions_ref.where('userId', '==', user_id).where('createdAt', '>=', start_date)
    break_sessions = [doc.to_dict() for doc in break_sessions_query.stream()]
    
    # Query learning progress
    learning_progress_ref = db.collection('learningProgress')
    learning_progress_query = learning_progress_ref.where('userId', '==', user_id)
    learning_progress = [doc.to_dict() for doc in learning_progress_query.stream()]
    
    return {
        'study_sessions': study_sessions,
        'break_sessions': break_sessions,
        'learning_progress': learning_progress,
        'user_id': user_id,
        'time_range': time_range
    }
    """
    
    # Temporary realistic data for production demo
    # Replace this entire function with actual Firebase queries
    try:
        print(f"📊 Getting production study data for user: {user_id} (range: {time_range})")
        
        current_time = datetime.now()
        
        if time_range == 'week':
            start_date = current_time - timedelta(days=7)
        elif time_range == 'month':
            start_date = current_time - timedelta(days=30)
        else:
            start_date = current_time - timedelta(days=90)
        
        # Production-level realistic study sessions
        study_sessions = [
            {
                'id': 'session_1',
                'userId': user_id,
                'mode': 'study',
                'type': 'text_summary',
                'startTime': (current_time - timedelta(days=2)).isoformat(),
                'endTime': (current_time - timedelta(days=2, hours=-1)).isoformat(),
                'duration': 3600,
                'content': {
                    'input': 'Machine Learning fundamentals',
                    'output': 'Comprehensive summary of supervised and unsupervised learning',
                    'score': 87
                },
                'metadata': {
                    'topic': 'Machine Learning',
                    'difficulty': 'intermediate',
                    'wordCount': 1200
                }
            },
            {
                'id': 'session_2',
                'userId': user_id,
                'mode': 'study',
                'type': 'quiz',
                'startTime': (current_time - timedelta(days=1)).isoformat(),
                'endTime': (current_time - timedelta(days=1, hours=-0.5)).isoformat(),
                'duration': 1800,
                'content': {
                    'input': 'Python data structures and algorithms',
                    'totalQuestions': 15,
                    'correctAnswers': 13,
                    'score': 87
                },
                'metadata': {
                    'topic': 'Python Programming',
                    'difficulty': 'intermediate'
                }
            },
            {
                'id': 'session_3',
                'userId': user_id,
                'mode': 'study',
                'type': 'youtube',
                'startTime': (current_time - timedelta(days=3)).isoformat(),
                'endTime': (current_time - timedelta(days=3, hours=-2)).isoformat(),
                'duration': 7200,
                'content': {
                    'input': 'Advanced React patterns and hooks',
                    'output': 'Detailed notes on custom hooks and context patterns'
                },
                'metadata': {
                    'topic': 'React Development',
                    'difficulty': 'advanced'
                }
            },
            {
                'id': 'session_4',
                'userId': user_id,
                'mode': 'study',
                'type': 'pdf_summary',
                'startTime': (current_time - timedelta(days=4)).isoformat(),
                'endTime': (current_time - timedelta(days=4, hours=-1.5)).isoformat(),
                'duration': 5400,
                'content': {
                    'input': 'Database design principles textbook',
                    'output': 'Summary of normalization and indexing strategies'
                },
                'metadata': {
                    'topic': 'Database Design',
                    'difficulty': 'advanced'
                }
            },
            {
                'id': 'session_5',
                'userId': user_id,
                'mode': 'study',
                'type': 'voice_chat',
                'startTime': (current_time - timedelta(days=5)).isoformat(),
                'endTime': (current_time - timedelta(days=5, hours=-1)).isoformat(),
                'duration': 3600,
                'content': {
                    'input': 'JavaScript async programming concepts',
                    'output': 'Interactive Q&A about promises, async/await, and event loops'
                },
                'metadata': {
                    'topic': 'JavaScript',
                    'difficulty': 'intermediate'
                }
            }
        ]
        
        # Production-level break sessions
        break_sessions = [
            {
                'id': 'break_1',
                'userId': user_id,
                'startTime': (current_time - timedelta(days=2)).isoformat(),
                'endTime': (current_time - timedelta(days=2, minutes=-20)).isoformat(),
                'duration': 1200,
                'emotion': 'focused',
                'emotionConfidence': 0.9,
                'activities': [
                    {
                        'type': 'meditation',
                        'title': 'Mindful Focus Session',
                        'completed': True
                    }
                ]
            },
            {
                'id': 'break_2',
                'userId': user_id,
                'startTime': (current_time - timedelta(days=1)).isoformat(),
                'endTime': (current_time - timedelta(days=1, minutes=-15)).isoformat(),
                'duration': 900,
                'emotion': 'stressed',
                'emotionConfidence': 0.8,
                'activities': [
                    {
                        'type': 'breathing',
                        'title': 'Stress Relief Breathing',
                        'completed': True
                    }
                ]
            },
            {
                'id': 'break_3',
                'userId': user_id,
                'startTime': (current_time - timedelta(days=4)).isoformat(),
                'endTime': (current_time - timedelta(days=4, minutes=-25)).isoformat(),
                'duration': 1500,
                'emotion': 'tired',
                'emotionConfidence': 0.7,
                'activities': [
                    {
                        'type': 'movement',
                        'title': 'Energy Boost Exercises',
                        'completed': True
                    }
                ]
            }
        ]
        
        # Production-level learning progress
        learning_progress = [
            {
                'id': 'progress_1',
                'userId': user_id,
                'topic': 'Machine Learning',
                'difficulty': 'intermediate',
                'progress': 78,
                'timeSpent': 10800,
                'quizScores': [87, 82, 90, 85],
                'mastered': False
            },
            {
                'id': 'progress_2',
                'userId': user_id,
                'topic': 'Python Programming',
                'difficulty': 'intermediate',
                'progress': 85,
                'timeSpent': 14400,
                'quizScores': [87, 89, 92],
                'mastered': True
            },
            {
                'id': 'progress_3',
                'userId': user_id,
                'topic': 'React Development',
                'difficulty': 'advanced',
                'progress': 65,
                'timeSpent': 7200,
                'quizScores': [78, 85],
                'mastered': False
            },
            {
                'id': 'progress_4',
                'userId': user_id,
                'topic': 'Database Design',
                'difficulty': 'advanced',
                'progress': 72,
                'timeSpent': 9000,
                'quizScores': [88, 84, 91],
                'mastered': False
            },
            {
                'id': 'progress_5',
                'userId': user_id,
                'topic': 'JavaScript',
                'difficulty': 'intermediate',
                'progress': 90,
                'timeSpent': 12600,
                'quizScores': [92, 88, 95, 89],
                'mastered': True
            }
        ]
        
        return {
            'study_sessions': study_sessions,
            'break_sessions': break_sessions,
            'learning_progress': learning_progress,
            'user_id': user_id,
            'time_range': time_range,
            'fetched_at': current_time.isoformat()
        }
        
    except Exception as e:
        print(f"❌ Error getting production study data: {str(e)}")
        return None