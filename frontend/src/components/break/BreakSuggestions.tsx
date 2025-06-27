import React, { useState, useEffect } from 'react';
import { Play, Pause, Timer, Smile, CheckCircle, RotateCcw, Star, Copy, Share2 } from 'lucide-react';
import { getCurrentUser, updateBreakSession, endBreakSession } from '../../services/firebase';

interface Activity {
  type: string;
  title: string;
  duration: string;
  description: string;
  instructions: string[];
}

interface BreakSuggestionsProps {
  emotionData: {
    emotion: string;
    confidence: number;
    message: string;
    sessionId?: string;
    suggestions: {
      emotion: string;
      activities: Activity[];
      affirmation: string;
      color_scheme: {
        primary: string;
        secondary: string;
        bg: string;
      };
    };
  };
}

const BreakSuggestions: React.FC<BreakSuggestionsProps> = ({ emotionData }) => {
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [showInstructions, setShowInstructions] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { emotion, confidence, message, suggestions, sessionId } = emotionData;
  const { activities, affirmation, color_scheme } = suggestions;

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const getEmotionEmoji = (emotion: string) => {
    const emojis = {
      calm: '😌',
      stressed: '😣',
      tired: '😴',
      focused: '🎯',
      sad: '😢',
      happy: '😊',
      angry: '😠',
      confused: '😕',
    };
    return emojis[emotion as keyof typeof emojis] || '😊';
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      breathing: '🌬️',
      meditation: '🧘',
      movement: '🤸',
      creative: '🎨',
      nature: '🌿',
      celebration: '🎉',
      sharing: '💝',
      brain: '🧠',
      planning: '📋'
    };
    return icons[type as keyof typeof icons] || '✨';
  };

  const handleActivityStart = (activity: Activity) => {
    setActiveActivity(activity.type);
    setShowInstructions(activity.type);
    setIsTimerRunning(true);
    
    // Start timer (convert duration to seconds)
    const minutes = parseInt(activity.duration.split(' ')[0]);
    setTimer(minutes * 60);
  };

  const handleActivityComplete = React.useCallback(
    async (activityType: string) => {
      const newCompletedActivities = new Set([...completedActivities, activityType]);
      setCompletedActivities(newCompletedActivities);
      setActiveActivity(null);
      setIsTimerRunning(false);
      setShowInstructions(null);
      setTimer(0);

      // Update Firebase break session if user is signed in and session exists
      if (user && sessionId) {
        try {
          const updatedActivities = activities.map(activity => ({
            type: activity.type,
            title: activity.title,
            duration: activity.duration,
            completed: newCompletedActivities.has(activity.type),
            completedAt: newCompletedActivities.has(activity.type) ? new Date() : undefined
          }));

          await updateBreakSession(sessionId, {
            activities: updatedActivities
          });
        } catch (error) {
          console.error('Error updating break session:', error);
        }
      }
    },
    [activities, completedActivities, sessionId, user]
  );

  const handleActivityStop = () => {
    setActiveActivity(null);
    setIsTimerRunning(false);
    setShowInstructions(null);
    setTimer(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyAffirmation = async () => {
    await navigator.clipboard.writeText(affirmation);
  };

  const shareProgress = async () => {
    const completedCount = completedActivities.size;
    const totalCount = activities.length;
    const text = `I just completed ${completedCount}/${totalCount} wellness activities on Mentora! Feeling ${emotion} and taking care of my mental health. 🧠✨`;
    
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  const handleEndBreakSession = async (finalMood?: string) => {
    if (user && sessionId) {
      try {
        await endBreakSession(sessionId, user.uid, finalMood);
      } catch (error) {
        console.error('Error ending break session:', error);
      }
    }
  };

  // Timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (activeActivity) {
        handleActivityComplete(activeActivity);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer, activeActivity, handleActivityComplete]);

  return (
    <div className="space-y-8">
      {/* Emotion Header */}
      <div className="text-center">
        <div 
          className="inline-flex items-center space-x-4 px-8 py-4 text-white rounded-2xl shadow-lg mb-6"
          style={{ 
            background: `linear-gradient(135deg, ${color_scheme.primary}, ${color_scheme.secondary})` 
          }}
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Smile className="w-6 h-6" />
          </div>
          <div className="text-left">
            <div className="text-lg font-semibold">
              {getEmotionEmoji(emotion)} Feeling {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
            </div>
            <div className="text-sm opacity-90">
              Confidence: {Math.round(confidence * 100)}%
            </div>
          </div>
        </div>
        
        <h3 className="text-3xl font-serif font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
          🌟 Personalized Break Activities
        </h3>
        <p className="text-neutral-600 text-lg max-w-3xl mx-auto leading-relaxed">
          {message}
        </p>
        {user && sessionId && (
          <div className="mt-4 p-3 bg-green-100/60 backdrop-blur-sm rounded-xl border border-green-200/50">
            <p className="text-sm text-green-700">
              ✅ Your wellness session is being tracked to help you understand your emotional patterns.
            </p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-serif font-bold text-neutral-800">Your Wellness Progress</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600">
              {completedActivities.size}/{activities.length} completed
            </span>
            {completedActivities.size > 0 && (
              <button
                onClick={shareProgress}
                className="p-2 bg-primary-100/60 rounded-lg hover:bg-primary-200/60 transition-colors"
              >
                <Share2 className="w-4 h-4 text-primary-600" />
              </button>
            )}
          </div>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-3">
          <div 
            className="h-3 rounded-full transition-all duration-500"
            style={{ 
              width: `${(completedActivities.size / activities.length) * 100}%`,
              background: `linear-gradient(90deg, ${color_scheme.primary}, ${color_scheme.secondary})`
            }}
          />
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activities.map((activity, index) => {
          const isActive = activeActivity === activity.type;
          const isCompleted = completedActivities.has(activity.type);
          const showingInstructions = showInstructions === activity.type;

          return (
            <div
              key={index}
              className={`backdrop-blur-xl border rounded-3xl p-6 shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                isCompleted 
                  ? 'bg-green-100/60 border-green-200/50' 
                  : isActive 
                    ? 'bg-white/20 border-white/40 scale-105' 
                    : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30'
              }`}
            >
              <div className="text-center mb-6">
                <div className="relative mb-4">
                  <div className="text-4xl">{getActivityIcon(activity.type)}</div>
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <h4 className="text-xl font-serif font-bold text-neutral-800 mb-2">
                  {activity.title}
                </h4>
                <p className="text-neutral-600 text-sm mb-2">{activity.description}</p>
                <p className="text-neutral-500 flex items-center justify-center text-sm">
                  <Timer className="w-4 h-4 mr-1" />
                  {activity.duration}
                </p>
              </div>

              {/* Timer Display */}
              {isActive && isTimerRunning && (
                <div className="text-center mb-4 p-3 bg-white/20 rounded-xl">
                  <div className="text-2xl font-bold text-neutral-800">{formatTime(timer)}</div>
                  <div className="text-sm text-neutral-600">Time remaining</div>
                </div>
              )}

              {/* Instructions */}
              {showingInstructions && (
                <div className="mb-4 p-4 bg-white/20 rounded-xl">
                  <h5 className="font-semibold text-neutral-800 mb-2">Instructions:</h5>
                  <ol className="text-sm text-neutral-700 space-y-1">
                    {activity.instructions.map((instruction, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary-600 font-bold">{i + 1}.</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {isCompleted ? (
                  <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                    <CheckCircle className="w-5 h-5" />
                    <span>Completed!</span>
                  </div>
                ) : isActive ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleActivityComplete(activity.type)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-2xl font-medium hover:shadow-lg transition-all"
                    >
                      Mark Complete
                    </button>
                    <button
                      onClick={handleActivityStop}
                      className="w-full bg-gradient-to-r from-red-400 to-red-500 text-white py-2 px-4 rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      <Pause className="w-4 h-4 inline mr-2" />
                      Stop
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleActivityStart(activity)}
                    className="w-full text-white py-3 px-4 rounded-2xl font-medium hover:shadow-lg transform hover:scale-105 transition-all"
                    style={{ 
                      background: `linear-gradient(135deg, ${color_scheme.primary}, ${color_scheme.secondary})` 
                    }}
                  >
                    <Play className="w-4 h-4 inline mr-2" />
                    Start Activity
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Affirmation */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Star className="w-6 h-6 text-amber-500" />
          <h4 className="text-xl font-serif font-bold text-neutral-800">Your Personal Affirmation</h4>
          <Star className="w-6 h-6 text-amber-500" />
        </div>
        <blockquote className="text-lg text-neutral-700 italic mb-4 leading-relaxed">
          "{affirmation}"
        </blockquote>
        <button
          onClick={copyAffirmation}
          className="flex items-center gap-2 mx-auto text-pink-600 hover:text-pink-700 transition-colors"
        >
          <Copy className="w-4 h-4" />
          <span className="text-sm">Copy affirmation</span>
        </button>
      </div>

      {/* Session End Options */}
      {completedActivities.size > 0 && (
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
          <h4 className="text-lg font-serif font-bold text-neutral-800 mb-4">How are you feeling now?</h4>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {['much better', 'better', 'same', 'refreshed', 'calm', 'energized'].map((mood) => (
              <button
                key={mood}
                onClick={() => handleEndBreakSession(mood)}
                className="px-4 py-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                {mood}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reset Button */}
      <div className="text-center">
        <button
          onClick={() => {
            handleEndBreakSession();
            window.location.reload();
          }}
          className="flex items-center gap-2 mx-auto px-6 py-3 bg-neutral-200/80 hover:bg-neutral-300/80 rounded-xl transition-colors text-neutral-700"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start New Emotion Check</span>
        </button>
      </div>
    </div>
  );
};

export default BreakSuggestions;