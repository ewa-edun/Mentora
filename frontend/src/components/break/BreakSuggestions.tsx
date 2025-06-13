import React, { useState } from 'react';
import { Play, Pause, Timer, Headphones, BookOpen, Smile } from 'lucide-react';

interface BreakSuggestionsProps {
  emotion: string;
}

const BreakSuggestions: React.FC<BreakSuggestionsProps> = ({ emotion }) => {
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  const getEmotionColor = (emotion: string) => {
    const colors = {
      calm: 'from-blue-400 to-cyan-500',
      stressed: 'from-orange-400 to-red-500',
      tired: 'from-purple-400 to-indigo-500',
      focused: 'from-green-400 to-emerald-500',
      overwhelmed: 'from-pink-400 to-rose-500',
      energetic: 'from-yellow-400 to-orange-500',
    };
    return colors[emotion as keyof typeof colors] || 'from-gray-400 to-gray-500';
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis = {
      calm: '😌',
      stressed: '😣',
      tired: '😴',
      focused: '🎯',
      overwhelmed: '😰',
      energetic: '⚡',
    };
    return emojis[emotion as keyof typeof emojis] || '😊';
  };

  const getSuggestions = (emotion: string) => {
    const suggestions = {
      calm: [
        { type: 'meditation', title: 'Mindful Meditation', duration: '10 min', icon: '🧘' },
        { type: 'breathing', title: 'Deep Breathing', duration: '5 min', icon: '🌬️' },
        { type: 'story', title: 'Calming Story', duration: '15 min', icon: '📖' },
      ],
      stressed: [
        { type: 'breathing', title: 'Stress Relief Breathing', duration: '8 min', icon: '🌬️' },
        { type: 'meditation', title: 'Anxiety Relief', duration: '12 min', icon: '🧘' },
        { type: 'story', title: 'Peaceful Narrative', duration: '10 min', icon: '📖' },
      ],
      tired: [
        { type: 'meditation', title: 'Energy Restoration', duration: '15 min', icon: '🧘' },
        { type: 'breathing', title: 'Energizing Breath', duration: '6 min', icon: '🌬️' },
        { type: 'story', title: 'Motivational Story', duration: '12 min', icon: '📖' },
      ],
      focused: [
        { type: 'meditation', title: 'Focus Enhancement', duration: '8 min', icon: '🧘' },
        { type: 'breathing', title: 'Concentration Boost', duration: '5 min', icon: '🌬️' },
        { type: 'story', title: 'Inspiring Tale', duration: '10 min', icon: '📖' },
      ],
      overwhelmed: [
        { type: 'breathing', title: 'Grounding Exercise', duration: '10 min', icon: '🌬️' },
        { type: 'meditation', title: 'Mental Clarity', duration: '15 min', icon: '🧘' },
        { type: 'story', title: 'Comforting Story', duration: '12 min', icon: '📖' },
      ],
      energetic: [
        { type: 'meditation', title: 'Channel Energy', duration: '10 min', icon: '🧘' },
        { type: 'breathing', title: 'Power Breathing', duration: '7 min', icon: '🌬️' },
        { type: 'story', title: 'Adventure Story', duration: '15 min', icon: '📖' },
      ],
    };
    return suggestions[emotion as keyof typeof suggestions] || suggestions.calm;
  };

  const handleActivityStart = (activityType: string) => {
    setActiveActivity(activityType);
    setTimerActive(true);
    // TODO: Connect to respective APIs for meditation, breathing, storytelling
  };

  const handleActivityStop = () => {
    setActiveActivity(null);
    setTimerActive(false);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className={`inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r ${getEmotionColor(emotion)} text-white rounded-full shadow-lg mb-6`}>
          <Smile className="w-6 h-6" />
          <span className="text-lg font-semibold">
            Detected: {getEmotionEmoji(emotion)} {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
          </span>
        </div>
        <h3 className="text-2xl font-serif font-bold text-gradient mb-2">
          🌀 Personalized Break Suggestions
        </h3>
        <p className="text-gray-600">
          Based on your current mood, here are some activities to help you recharge
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {getSuggestions(emotion).map((suggestion, index) => (
          <div
            key={index}
            className="glass-card rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">{suggestion.icon}</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                {suggestion.title}
              </h4>
              <p className="text-gray-600 flex items-center justify-center">
                <Timer className="w-4 h-4 mr-1" />
                {suggestion.duration}
              </p>
            </div>

            <div className="space-y-4">
              {activeActivity === suggestion.type ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
                    <div className="w-8 h-8 bg-white rounded-full animate-breathe"></div>
                  </div>
                  <button
                    onClick={handleActivityStop}
                    className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-red-400 to-red-500 text-white py-3 px-6 rounded-2xl font-medium hover:shadow-lg transition-all"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Stop</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleActivityStart(suggestion.type)}
                  className={`flex items-center justify-center space-x-2 w-full bg-gradient-to-r ${getEmotionColor(emotion)} text-white py-3 px-6 rounded-2xl font-medium hover:shadow-lg transform hover:scale-105 transition-all`}
                >
                  {suggestion.type === 'story' ? (
                    <BookOpen className="w-4 h-4" />
                  ) : suggestion.type === 'breathing' ? (
                    <div className="w-4 h-4 rounded-full bg-white animate-pulse-soft"></div>
                  ) : (
                    <Headphones className="w-4 h-4" />
                  )}
                  <span>Start</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* TODO: Connect to meditation API */}
      {/* TODO: Connect to breathing exercise animations */}
      {/* TODO: Connect to storytelling/audio API */}
    </div>
  );
};

export default BreakSuggestions;