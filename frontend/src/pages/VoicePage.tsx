import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, MicOff, Volume2, VolumeX, Send, Loader2, Brain, Sparkles, MessageCircle, Copy, CheckCircle, Settings, Heart, Star, Trash2, Download, Share2, Pause, Play, Square } from 'lucide-react';
import { askQuestion } from '../services/api';
import { getCurrentUser } from '../services/firebase';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
  emotion?: 'happy' | 'neutral' | 'excited' | 'thoughtful';
}

const VoicePage: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [user, setUser] = useState<any>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState(0.9);
  const [voicePitch, setVoicePitch] = useState(1);

  const chatWindowRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTextInput(transcript);
        handleSendMessage(transcript, true);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError('Voice recognition failed. Please try again.');
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
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [navigate]);

  // Scroll only the chat window to bottom when messages change
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  const startListening = () => {
    if (!recognitionRef.current) {
      setError('Voice recognition not supported in this browser');
      return;
    }
    setIsListening(true);
    setError('');
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const speakText = (text: string) => {
    if (!synthRef.current || !voiceEnabled) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceSpeed;
    utterance.pitch = voicePitch;
    utterance.volume = 0.8;
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    currentUtteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const pauseSpeech = () => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeSpeech = () => {
    if (synthRef.current && isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const handleSendMessage = async (content?: string, isVoice = false) => {
    const messageContent = content || textInput.trim();
    if (!messageContent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date(),
      isVoice,
      emotion: 'neutral'
    };

    setMessages(prev => [...prev, userMessage]);
    setTextInput('');
    setIsProcessing(true);
    setError('');

    try {
      const result = await askQuestion(messageContent);

      if (result.success && result.data) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: result.data['Your answers'],
          timestamp: new Date(),
          emotion: 'thoughtful'
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Auto-speak the response if voice was used for input
        if (isVoice && voiceEnabled) {
          setTimeout(() => speakText(result.data!['Your answers']), 500);
        }
      } else {
        setError(result.error || 'Failed to get response');
      }
    } catch {
      setError('Failed to send message');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = async (text: string, messageId: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(messageId);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleShare = async (text: string) => {
    if (navigator.share) {
      await navigator.share({
        title: 'Mentora AI Response',
        text: text
      });
    } else {
      handleCopy(text, 'shared');
    }
  };

  const handleDownload = () => {
    const conversationText = messages.map(msg =>
      `${msg.type === 'user' ? 'You' : 'Mentora'} (${msg.timestamp.toLocaleTimeString()}): ${msg.content}`
    ).join('\n\n');

    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mentora-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearConversation = () => {
    setMessages([]);
    setError('');
    stopSpeaking();
  };

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getEmotionColor = (emotion?: string) => {
    switch (emotion) {
      case 'happy': return 'from-yellow-400 to-orange-400';
      case 'excited': return 'from-pink-400 to-rose-400';
      case 'thoughtful': return 'from-blue-400 to-indigo-400';
      default: return 'from-green-300 to-green-600';
    }
  };

  // For Mentora's chat bubble color (thinking and answered)
  const mentoraBubbleColor = isProcessing
    ? 'bg-gradient-to-r from-blue-100 via-indigo-100 to-white border-blue-200'
    : 'bg-gradient-to-r from-indigo-50 via-white to-blue-50 border-indigo-100';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-secondary-200/30 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-primary-100/40 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239d75ff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="backdrop-blur-xl glass-card bg-white/20 border-b border-white/30 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/home"
                className="flex items-center gap-3 text-primary-600 hover:text-primary-700 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Home</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 backdrop-blur-xl bg-gradient-to-br from-lavender-400 to-indigo-500 rounded-2xl border-white/20 rounded-2xl px-6 py-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center glow-primary animate-float">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-serif font-bold bg-clip-text text-white">
                    Voice Assistant
                  </h1>
                  <p className="text-sm text-gray-800">Chat with Mentora AI</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 rounded-xl backdrop-blur-xl bg-white/30 border border-white/40 text-neutral-700 hover:text-neutral-800 hover:bg-white/30 transition-all duration-300"
              >
                <Settings className="w-5 h-5" />
              </button>

              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-3 rounded-xl backdrop-blur-xl border border-white/20 transition-all duration-300 ${
                  voiceEnabled
                    ? 'bg-green-100/60 text-green-600 hover:bg-green-100/80'
                    : 'bg-red-100/60 text-red-600 hover:bg-red-100/80'
                }`}
              >
                {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              {messages.length > 0 && (
                <>
                  <button
                    onClick={handleDownload}
                    className="p-3 rounded-xl backdrop-blur-xl bg-black/10 border border-black/20 text-neutral-700 hover:text-neutral-800 hover:bg-black/20 transition-all duration-300"
                  >
                    <Download className="w-5 h-5" />
                  </button>

                  <button
                    onClick={clearConversation}
                    className="p-3 rounded-xl backdrop-blur-xl bg-red-100/60 border border-red-200/50 text-red-600 hover:text-red-700 hover:bg-red-100/80 transition-all duration-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="max-w-6xl mx-auto mt-4 p-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl">
              <h3 className="text-lg font-serif font-bold text-neutral-800 mb-4">Voice Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Speech Speed: {voiceSpeed.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceSpeed}
                    onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                    className="w-full h-2 bg-rose-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Voice Pitch: {voicePitch.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voicePitch}
                    onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                    className="w-full h-2 bg-rose-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Messages Area */}
        <main className="flex-1 px-6 py-8 overflow-hidden">
          <div className="max-w-6xl mx-auto h-full flex flex-col">
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-3xl">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-lavender-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto glow-primary animate-float">
                      <MessageCircle className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse-slow">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-rose-400 to-red-300 bg-clip-text text-transparent mb-4">
                    Hello, {getUserDisplayName()}! 👋
                  </h2>
                  <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                    I'm your AI study companion, ready to help you learn, explore, and grow.
                    Ask me anything or just start a conversation!
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-6">
                    <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-2xl p-6 hover:bg-white/70 hover:border-white/30 transition-all duration-300 group">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Mic className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-serif font-bold text-neutral-800 mb-2">🎙️ Voice Magic</h3>
                      <p className="text-sm text-neutral-600">Speak naturally and I'll understand. Click the mic to start!</p>
                    </div>

                    <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-2xl p-6 hover:bg-white/70 hover:border-white/30 transition-all duration-300 group">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-serif font-bold text-neutral-800 mb-2">⚡ Smart Responses</h3>
                      <p className="text-sm text-neutral-600">Get instant, intelligent answers to any question you have.</p>
                    </div>

                    <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-2xl p-6 hover:bg-white/70 hover:border-white/30 transition-all duration-300 group">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-serif font-bold text-neutral-800 mb-2">💝 Personal Touch</h3>
                      <p className="text-sm text-neutral-600">I remember our conversations and adapt to your learning style.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Messages List */}
            <div
              ref={chatWindowRef}
              className="flex-1 overflow-y-auto space-y-6 mb-6 pr-4 custom-scrollbar"
              style={{ maxHeight: '60vh', minHeight: '200px' }}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div
                    className={`max-w-4xl p-6 rounded-3xl border transition-all duration-300 hover:scale-[1.02] ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 text-neutral-800'
                        : mentoraBubbleColor + ' text-neutral-800'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {message.type === 'assistant' && (
                        <div className={`w-12 h-12 bg-gradient-to-r ${getEmotionColor(message.emotion)} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-lg font-serif font-bold">
                            {message.type === 'user' ? 'You' : 'Mentora'}
                          </span>
                          {message.isVoice && (
                            <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-full">
                              <Mic className="w-3 h-3 text-green-600" />
                              <span className="text-xs text-green-600 font-medium">Voice</span>
                            </div>
                          )}
                          <span className="text-sm text-neutral-500">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          {message.type === 'user' && (
                            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-sm">
                                {getUserDisplayName().charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="leading-relaxed whitespace-pre-wrap text-lg">{message.content}</p>

                        {message.type === 'assistant' && (
                          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                            <button
                              onClick={() => handleCopy(message.content, message.id)}
                              className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-800 transition-colors bg-white/20 px-3 py-2 rounded-xl hover:bg-white/30"
                            >
                              {copied === message.id ? (
                                <>
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>

                            {voiceEnabled && (
                              <button
                                onClick={() => speakText(message.content)}
                                className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-800 transition-colors bg-white/20 px-3 py-2 rounded-xl hover:bg-white/30"
                              >
                                <Volume2 className="w-4 h-4" />
                                <span>Speak</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleShare(message.content)}
                              className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-800 transition-colors bg-white/20 px-3 py-2 rounded-xl hover:bg-white/30"
                            >
                              <Share2 className="w-4 h-4" />
                              <span>Share</span>
                            </button>

                            <button
                              className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 transition-colors bg-amber-100/60 px-3 py-2 rounded-xl hover:bg-amber-100/80"
                            >
                              <Star className="w-4 h-4" />
                              <span>Save</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex justify-start animate-fadeIn">
                  <div className={`max-w-4xl p-6 rounded-3xl border ${mentoraBubbleColor} transition-all duration-300 hover:scale-[1.02]`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                        <span className="text-neutral-700">Mentora is thinking...</span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-xl">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Enhanced Input Area */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
              {/* Speaking Controls */}
              {isSpeaking && (
                <div className="flex items-center justify-between mb-4 p-4 bg-green-100/60 backdrop-blur-sm rounded-2xl border border-green-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                      <Volume2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-green-700 font-medium">Mentora is speaking...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isPaused ? (
                      <button
                        onClick={resumeSpeech}
                        className="p-2 bg-green-500/30 rounded-xl text-green-700 hover:bg-green-500/50 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={pauseSpeech}
                        className="p-2 bg-green-500/30 rounded-xl text-green-700 hover:bg-green-500/50 transition-colors"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={stopSpeaking}
                      className="p-2 bg-red-500/30 rounded-xl text-red-700 hover:bg-red-500/50 transition-colors"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-end gap-4">
                {/* Enhanced Voice Button */}
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                  className={`flex-shrink-0 w-16 h-16 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg ${
                    isListening
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 animate-pulse scale-110'
                      : 'bg-gradient-to-r from-red-400 to-rose-400 hover:shadow-2xl transform hover:scale-110 glow-primary'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-8 h-8 text-white" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}
                </button>

                {/* Enhanced Text Input */}
                <div className="flex-1 relative">
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isListening ? "🎤 Listening..." : "Type your message or use voice..."}
                    disabled={isListening || isProcessing}
                    className="w-full px-6 py-4 rounded-2xl border-0 bg-white/100 backdrop-blur-sm placeholder-neutral-600 text-neutral-800 focus:bg-white/30 focus:ring-2 focus:ring-primary-400 focus:outline-none transition-all duration-300 resize-none text-lg custom-scrollbar"
                    rows={1}
                    style={{ minHeight: '64px', maxHeight: '160px', overflowY: 'auto' }}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-neutral-500">
                    {textInput.length}/1000
                  </div>
                </div>

                {/* Enhanced Send Button */}
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!textInput.trim() || isProcessing || isListening}
                  className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg"
                >
                  <Send className="w-8 h-8" />
                </button>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center justify-between mt-4 text-sm text-neutral-500">
                <div className="flex items-center gap-6">
                  {isListening && (
                    <span className="flex items-center gap-2 text-red-600">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      Listening for your voice...
                    </span>
                  )}
                  {isSpeaking && (
                    <span className="flex items-center gap-2 text-green-600">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      {isPaused ? 'Speech paused' : 'Speaking response...'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span>Press Enter to send</span>
                  <span>•</span>
                  <span>Shift+Enter for new line</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 7px;
          background: #f3f4f6;
          border-radius: 14px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #a5b4fc 0%, #818cf8 100%);
          border-radius: 14px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
        }
      `}</style>
    </div>
  );
};

export default VoicePage;