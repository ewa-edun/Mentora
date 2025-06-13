import React, { useState } from 'react';
import { Mic, Volume2, MessageCircle, X } from 'lucide-react';

const VoicePanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [response, setResponse] = useState('');

  const handleVoiceInput = () => {
    setIsListening(true);
    // TODO: Connect to Whisper API for speech-to-text
    
    // Simulate voice input for demo
    setTimeout(() => {
      setIsListening(false);
      setTranscription("What are the key concepts in quantum physics?");
      setResponse("Quantum physics involves several fundamental concepts including wave-particle duality, quantum entanglement, and the uncertainty principle...");
    }, 2000);
  };

  const handleTextToSpeech = () => {
    // TODO: Connect to TTS API
    alert('Text-to-speech would play here!');
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-lavender-500 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center glow-lavender z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Voice Panel Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-8 max-w-md w-full mx-4 animate-breathe">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gradient">Voice Assistant</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              <button
                onClick={handleVoiceInput}
                disabled={isListening}
                className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl font-medium transition-all duration-300 ${
                  isListening
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white animate-pulse-soft'
                    : 'bg-gradient-to-r from-lavender-500 to-indigo-600 text-white hover:shadow-lg transform hover:scale-105'
                }`}
              >
                <Mic className={`w-5 h-5 ${isListening ? 'animate-bounce' : ''}`} />
                <span>
                  {isListening ? 'Listening...' : 'Ask a Question'}
                </span>
              </button>

              {transcription && (
                <div className="p-4 bg-white/30 rounded-2xl border border-white/20">
                  <p className="text-sm text-gray-600 mb-1">You said:</p>
                  <p className="text-gray-800 font-medium">{transcription}</p>
                </div>
              )}

              {response && (
                <div className="p-4 bg-gradient-to-r from-lavender-50 to-indigo-50 rounded-2xl border border-lavender-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-lavender-600 font-medium">Mentora's Response:</p>
                    <button
                      onClick={handleTextToSpeech}
                      className="p-1 hover:bg-lavender-200 rounded-full transition-colors"
                    >
                      <Volume2 className="w-4 h-4 text-lavender-600" />
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{response}</p>
                </div>
              )}
            </div>

            {/* TODO: Connect to Whisper API for speech-to-text */}
            {/* TODO: Connect to Gemini API for AI responses */}
            {/* TODO: Connect to TTS API for voice output */}
          </div>
        </div>
      )}
    </>
  );
};

export default VoicePanel;