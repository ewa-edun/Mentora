import React, { useState } from 'react';
import { Mic, Heart, Loader2 } from 'lucide-react';

interface EmotionDetectionProps {
  onEmotionDetected: (emotion: string) => void;
}

const EmotionDetection: React.FC<EmotionDetectionProps> = ({ onEmotionDetected }) => {
  const [isListening, setIsListening] = useState(false);

  const handleEmotionDetection = () => {
    setIsListening(true);
    // TODO: Connect to Flask API for emotion detection
    
    // Simulate emotion detection for demo
    setTimeout(() => {
      setIsListening(false);
      const emotions = ['calm', 'stressed', 'tired', 'focused', 'overwhelmed', 'energetic'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      onEmotionDetected(randomEmotion);
    }, 3000);
  };

  return (
    <div className="glass-card rounded-3xl p-12 text-center hover:shadow-2xl transition-all duration-300">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-float">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-3xl font-serif font-bold text-gradient mb-4">
          🎤 Check In: How Are You Feeling?
        </h3>
        <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
          Let's take a moment to understand your current emotional state and find the perfect way to support you
        </p>
      </div>

      <button
        onClick={handleEmotionDetection}
        disabled={isListening}
        className={`inline-flex items-center space-x-4 px-12 py-6 rounded-full font-semibold text-white text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl ${
          isListening
            ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse-soft'
            : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:shadow-3xl glow-lavender'
        }`}
      >
        {isListening ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Analyzing your voice...</span>
          </>
        ) : (
          <>
            <Mic className="w-6 h-6" />
            <span>Start Emotion Scan</span>
          </>
        )}
      </button>
      
      {isListening && (
        <p className="text-gray-500 mt-6 animate-pulse-soft">
          Speak naturally about how you're feeling right now...
        </p>
      )}

      {/* TODO: Connect to Flask API for emotion detection */}
    </div>
  );
};

export default EmotionDetection;