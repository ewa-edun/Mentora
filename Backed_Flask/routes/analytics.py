from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import json

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/api/analytics/charts', methods=['POST', 'OPTIONS'])
def generate_charts():
    if request.method == 'OPTIONS':
        return '', 204  # Handle CORS preflight request
    """
    Generate chart data for user analytics dashboard
    """
    try:
        data = request.get_json()
        user_id = data.get('userId')
        chart_type = data.get('chartType', 'study_time')
        time_range = data.get('timeRange', '7d')  # 7d, 30d, 90d
        
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400
        
        print(f"📊 Chart Generation Request:")
        print(f"   User ID: {user_id}")
        print(f"   Chart Type: {chart_type}")
        print(f"   Time Range: {time_range}")
        
        # Generate mock chart data based on type
        chart_data = generate_chart_data(chart_type, time_range)
        
        return jsonify({
            'success': True,
            'chartType': chart_type,
            'timeRange': time_range,
            'data': chart_data
        })
    
    except Exception as e:
        print(f"❌ Chart generation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def generate_chart_data(chart_type, time_range):
    """
    Generate chart data based on type and time range
    """
    # Calculate date range
    days = {'7d': 7, '30d': 30, '90d': 90}.get(time_range, 7)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    if chart_type == 'study_time':
        return generate_study_time_chart(start_date, end_date, days)
    elif chart_type == 'emotion_trends':
        return generate_emotion_trends_chart(start_date, end_date, days)
    elif chart_type == 'quiz_performance':
        return generate_quiz_performance_chart(start_date, end_date, days)
    elif chart_type == 'activity_heatmap':
        return generate_activity_heatmap(start_date, end_date, days)
    else:
        return {'labels': [], 'datasets': []}

def generate_study_time_chart(start_date, end_date, days):
    """Generate study time chart data"""
    import random
    
    labels = []
    study_data = []
    break_data = []
    
    for i in range(days):
        date = start_date + timedelta(days=i)
        labels.append(date.strftime('%m/%d'))
        
        # Generate realistic study time data (in minutes)
        base_study = random.randint(30, 180)  # 30min to 3hrs
        base_break = random.randint(10, 60)   # 10min to 1hr
        
        # Add some weekly patterns
        if date.weekday() < 5:  # Weekdays
            study_data.append(base_study + random.randint(0, 60))
            break_data.append(base_break + random.randint(0, 30))
        else:  # Weekends
            study_data.append(max(0, base_study - random.randint(0, 90)))
            break_data.append(base_break + random.randint(0, 45))
    
    return {
        'labels': labels,
        'datasets': [
            {
                'label': 'Study Time (minutes)',
                'data': study_data,
                'borderColor': '#8b5cf6',
                'backgroundColor': 'rgba(139, 92, 246, 0.1)',
                'fill': True,
                'tension': 0.4
            },
            {
                'label': 'Break Time (minutes)',
                'data': break_data,
                'borderColor': '#f43f5e',
                'backgroundColor': 'rgba(244, 63, 94, 0.1)',
                'fill': True,
                'tension': 0.4
            }
        ]
    }

def generate_emotion_trends_chart(start_date, end_date, days):
    """Generate emotion trends chart data"""
    import random
    
    emotions = ['happy', 'calm', 'focused', 'stressed', 'tired', 'sad']
    emotion_colors = {
        'happy': '#f59e0b',
        'calm': '#06b6d4',
        'focused': '#10b981',
        'stressed': '#f97316',
        'tired': '#8b5cf6',
        'sad': '#3b82f6'
    }
    
    labels = []
    emotion_data = {emotion: [] for emotion in emotions}
    
    for i in range(days):
        date = start_date + timedelta(days=i)
        labels.append(date.strftime('%m/%d'))
        
        # Generate emotion distribution (percentages that sum to 100)
        total = 100
        for j, emotion in enumerate(emotions):
            if j == len(emotions) - 1:  # Last emotion gets remaining percentage
                emotion_data[emotion].append(total)
            else:
                value = random.randint(5, min(30, total - (len(emotions) - j - 1) * 5))
                emotion_data[emotion].append(value)
                total -= value
    
    datasets = []
    for emotion in emotions:
        datasets.append({
            'label': emotion.capitalize(),
            'data': emotion_data[emotion],
            'borderColor': emotion_colors[emotion],
            'backgroundColor': emotion_colors[emotion] + '20',
            'fill': True,
            'tension': 0.3
        })
    
    return {
        'labels': labels,
        'datasets': datasets
    }

def generate_quiz_performance_chart(start_date, end_date, days):
    """Generate quiz performance chart data"""
    import random
    
    labels = []
    scores = []
    attempts = []
    
    for i in range(days):
        date = start_date + timedelta(days=i)
        labels.append(date.strftime('%m/%d'))
        
        # Generate quiz performance data
        if random.random() > 0.3:  # 70% chance of having quiz activity
            score = random.randint(60, 100)  # Quiz scores between 60-100%
            attempt_count = random.randint(1, 5)  # 1-5 quiz attempts
        else:
            score = 0
            attempt_count = 0
        
        scores.append(score)
        attempts.append(attempt_count)
    
    return {
        'labels': labels,
        'datasets': [
            {
                'label': 'Average Score (%)',
                'data': scores,
                'borderColor': '#10b981',
                'backgroundColor': 'rgba(16, 185, 129, 0.1)',
                'fill': True,
                'tension': 0.4,
                'yAxisID': 'y'
            },
            {
                'label': 'Quiz Attempts',
                'data': attempts,
                'borderColor': '#f59e0b',
                'backgroundColor': 'rgba(245, 158, 11, 0.1)',
                'fill': False,
                'tension': 0.4,
                'yAxisID': 'y1'
            }
        ]
    }

def generate_activity_heatmap(start_date, end_date, days):
    """Generate activity heatmap data"""
    import random
    
    # Generate hourly activity data for each day
    heatmap_data = []
    
    for i in range(days):
        date = start_date + timedelta(days=i)
        day_data = {
            'date': date.strftime('%Y-%m-%d'),
            'day': date.strftime('%a'),
            'hours': []
        }
        
        for hour in range(24):
            # Generate activity intensity (0-100)
            if 6 <= hour <= 23:  # Active hours
                if 9 <= hour <= 17:  # Peak study hours
                    intensity = random.randint(40, 100)
                elif 18 <= hour <= 22:  # Evening study
                    intensity = random.randint(20, 80)
                else:  # Early morning/late evening
                    intensity = random.randint(0, 40)
            else:  # Sleep hours
                intensity = random.randint(0, 10)
            
            day_data['hours'].append({
                'hour': hour,
                'intensity': intensity,
                'label': f"{hour:02d}:00"
            })
        
        heatmap_data.append(day_data)
    
    return {
        'type': 'heatmap',
        'data': heatmap_data,
        'maxIntensity': 100
    }

@analytics_bp.route('/api/analytics/insights', methods=['POST'])
def generate_insights():
    """
    Generate AI-powered insights from user data
    """
    try:
        data = request.get_json()
        user_id = data.get('userId')
        analytics_data = data.get('analyticsData', {})
        
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400
        
        print(f"🧠 Generating insights for user: {user_id}")
        
        # Generate insights based on analytics data
        insights = generate_user_insights(analytics_data)
        
        return jsonify({
            'success': True,
            'insights': insights
        })
    
    except Exception as e:
        print(f"❌ Insights generation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def generate_user_insights(analytics_data):
    """
    Generate personalized insights based on user analytics
    """
    insights = []
    
    # Study time insights
    total_study_time = analytics_data.get('stats', {}).get('totalStudyTime', 0)
    if total_study_time > 0:
        hours = total_study_time / 3600
        if hours > 20:
            insights.append({
                'type': 'achievement',
                'title': 'Study Champion! 🏆',
                'message': f'You\'ve studied for {hours:.1f} hours total. That\'s dedication!',
                'action': 'Keep up the excellent work and consider setting new learning goals.',
                'priority': 'high'
            })
        elif hours > 5:
            insights.append({
                'type': 'progress',
                'title': 'Great Progress! 📈',
                'message': f'You\'ve accumulated {hours:.1f} hours of study time.',
                'action': 'Try to maintain a consistent daily study routine.',
                'priority': 'medium'
            })
    
    # Emotion insights
    most_common_emotion = analytics_data.get('stats', {}).get('mostCommonEmotion', 'neutral')
    if most_common_emotion == 'stressed':
        insights.append({
            'type': 'wellness',
            'title': 'Stress Management 🧘',
            'message': 'You\'ve been feeling stressed frequently during study sessions.',
            'action': 'Consider taking more breaks and trying our guided meditation exercises.',
            'priority': 'high'
        })
    elif most_common_emotion == 'focused':
        insights.append({
            'type': 'strength',
            'title': 'Focus Master! 🎯',
            'message': 'You maintain excellent focus during your study sessions.',
            'action': 'Use this strength to tackle more challenging topics.',
            'priority': 'medium'
        })
    
    # Session insights
    session_count = len(analytics_data.get('studySessions', []))
    if session_count > 10:
        insights.append({
            'type': 'habit',
            'title': 'Consistent Learner! ⭐',
            'message': f'You\'ve completed {session_count} study sessions.',
            'action': 'Your consistency is paying off. Consider tracking your progress with specific goals.',
            'priority': 'medium'
        })
    
    # Break insights
    break_count = len(analytics_data.get('breakSessions', []))
    if break_count < session_count * 0.3:
        insights.append({
            'type': 'recommendation',
            'title': 'Take More Breaks! ☕',
            'message': 'You might benefit from taking more wellness breaks.',
            'action': 'Try the Pomodoro technique: 25 minutes study, 5 minutes break.',
            'priority': 'medium'
        })
    
    # Learning progress insights
    learning_progress = analytics_data.get('learningProgress', [])
    if learning_progress:
        avg_progress = sum(p.get('progress', 0) for p in learning_progress) / len(learning_progress)
        if avg_progress > 80:
            insights.append({
                'type': 'achievement',
                'title': 'Learning Expert! 🎓',
                'message': f'Your average topic mastery is {avg_progress:.0f}%.',
                'action': 'Consider exploring more advanced topics or helping others learn.',
                'priority': 'high'
            })
    
    # Default insight if no specific patterns found
    if not insights:
        insights.append({
            'type': 'encouragement',
            'title': 'Keep Learning! 🌟',
            'message': 'Every study session brings you closer to your goals.',
            'action': 'Set a specific learning goal for this week and track your progress.',
            'priority': 'low'
        })
    
    return insights