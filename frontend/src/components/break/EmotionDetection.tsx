import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Heart, Loader2, RefreshCw, MessageCircle } from 'lucide-react';
import { detectEmotion } from '../../services/api';

interface EmotionDetectionProps {
  onEmotionDetected: (emotionData: any) => void;
}

const EmotionDetection: React.FC<EmotionDetectionProps> = ({ onEmotionDetected }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  const [hasSpoken, setHasSpoken] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscription(transcript);
        setHasSpoken(true);
        handleEmotionAnalysis(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError('Voice recognition failed. Please try again or type your feelings.');
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      setError('Voice recognition not supported in this browser. Please type how you\'re feeling.');
      return;
    }

    setIsListening(true);
    setError('');
    setTranscription('');
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleEmotionAnalysis = async (text: string) => {
    setIsProcessing(true);
    setError('');

    try {
      const result = await detectEmotion(text);
      
      if (result.success && result.data) {
        onEmotionDetected(result.data);
      } else {
        setError(result.error || 'Failed to analyze emotion');
      }
    } catch {
      setError('Failed to analyze your emotional state');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = () => {
    if (transcription.trim()) {
      handleEmotionAnalysis(transcription);
    }
  };

  const handleReset = () => {
    setTranscription('');
    setError('');
    setHasSpoken(false);
    setIsProcessing(false);
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-300">
      <div className="text-center mb-8">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg glow-error animate-float">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse-slow">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <h3 className="text-3xl font-serif font-bold text-black/80 mb-4">
          🎤 How Are You Feeling?
        </h3>
        <p className="text-neutral-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Share your current emotional state with me. I'll listen to your voice or you can type how you're feeling, 
          and I'll suggest personalized activities to help you feel your best.
        </p>
      </div>

      {/* Voice Input Section */}
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className={`w-20 h-20 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg ${
              isListening
                ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse scale-110'
                : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:shadow-2xl transform hover:scale-110 glow-error'
            }`}
          >
            {isListening ? (
              <MicOff className="w-10 h-10 text-white" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
          </button>
          
          <p className="text-sm text-gray-600 text-center">
            {isListening 
              ? "🎙️ Listening... Tell me how you're feeling right now"
              : "Click to start voice emotion detection"
            }
          </p>
        </div>

        {/* Text Input Alternative */}
        <div className="relative">
          <textarea
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            placeholder="Or type how you're feeling... (e.g., 'I'm feeling stressed about my exams' or 'I'm really tired today')"
            className="w-full px-6 py-4 rounded-2xl border-0 bg-white/50 backdrop-blur-sm placeholder-neutral-600 text-neutral-800 focus:bg-white/30 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all duration-300 resize-none"
            rows={3}
            disabled={isListening || isProcessing}
          />
          {transcription && (
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                onClick={handleReset}
                className="p-2 bg-neutral-200/80 rounded-lg hover:bg-neutral-300/80 transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-neutral-600" />
              </button>
              <button
                onClick={handleTextSubmit}
                disabled={isProcessing}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all font-medium"
              >
                Analyze
              </button>
            </div>
          )}
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="text-center p-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/50">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-blue-700 font-medium">Analyzing your emotional state...</span>
            </div>
            <p className="text-sm text-blue-600">
              I'm understanding your feelings and preparing personalized suggestions
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-xl">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Transcription Display */}
        {transcription && hasSpoken && !isProcessing && (
          <div className="p-4 bg-green-100/80 backdrop-blur-sm border border-green-200/50 rounded-xl">
            <p className="text-sm text-green-700 mb-2">
              <strong>I heard:</strong>
            </p>
            <p className="text-green-800 italic">"{transcription}"</p>
          </div>
        )}

        {/* Tips */}
        <div className="p-4 bg-pink-100/60 backdrop-blur-sm rounded-xl border border-pink-200/50">
          <h5 className="text-sm font-medium text-pink-700 mb-2">💡 Tips for better emotion detection:</h5>
          <ul className="text-xs text-pink-600 space-y-1">
            <li>• Speak naturally about how you're feeling right now</li>
            <li>• Mention specific emotions like "stressed", "tired", "happy", etc.</li>
            <li>• Describe what's affecting your mood today</li>
            <li>• The more you share, the better I can help you</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmotionDetection;