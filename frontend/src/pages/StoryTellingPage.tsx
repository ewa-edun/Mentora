import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Star, BookOpen,  Settings, Download, Share2, Loader2, CheckCircle, AlertTriangle, Square } from 'lucide-react';
import { getCurrentUser } from '../services/firebase';
import { generateStory, generateVoiceNarration, generateAvatarVideo, getStoryCharacters, StoryCharacter } from '../services/api';

interface StorySession {
  id: string;
  title: string;
  content: string;
  character: StoryCharacter;
  emotion: string;
  duration: number;
  audioUrl?: string;
  videoUrl?: string;
}

const StorytellingPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('happy');
  const [selectedCharacter, setSelectedCharacter] = useState<StoryCharacter | null>(null);
  const [availableCharacters, setAvailableCharacters] = useState<StoryCharacter[]>([]);
  const [currentStory, setCurrentStory] = useState<StorySession | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [avatarEnabled, setAvatarEnabled] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    loadCharacters();
  }, [navigate]);

  const loadCharacters = async () => {
    try {
      const result = await getStoryCharacters();
      if (result.success && result.data) {
        setAvailableCharacters(result.data.characters);
        // Auto-select first character
        if (result.data.characters.length > 0) {
          setSelectedCharacter(result.data.characters[0]);
        }
      }
    } catch (error) {
      console.error('Error loading characters:', error);
    }
  };

  const emotionThemes = {
    happy: { color: 'from-yellow-400 to-orange-400', theme: 'celebration and joy' },
    calm: { color: 'from-blue-400 to-cyan-400', theme: 'peace and tranquility' },
    stressed: { color: 'from-orange-400 to-red-400', theme: 'overcoming challenges' },
    tired: { color: 'from-purple-400 to-indigo-400', theme: 'rest and renewal' },
    focused: { color: 'from-green-400 to-emerald-400', theme: 'determination and growth' },
    sad: { color: 'from-blue-500 to-indigo-500', theme: 'hope and healing' }
  };

  const handleGenerateStory = async () => {
    if (!selectedTopic || !selectedCharacter) {
      setError('Please select a topic and character');
      return;
    }

    setIsGenerating(true);
    setError('');
    setProgress(0);
    
    try {
      // Step 1: Generate story content
      setProgress(25);
      const storyResult = await generateStory(
        selectedTopic, 
        selectedCharacter, 
        selectedEmotion, 
        240 // 4 minutes
      );
      
      if (!storyResult.success || !storyResult.data) {
        throw new Error(storyResult.error || 'Failed to generate story');
      }

      const newStory: StorySession = {
        id: Date.now().toString(),
        title: storyResult.data.title,
        content: storyResult.data.content,
        character: selectedCharacter,
        emotion: selectedEmotion,
        duration: storyResult.data.duration
      };

      setCurrentStory(newStory);
      setProgress(50);

      // Step 2: Generate voice narration if enabled
      if (voiceEnabled) {
        setIsGeneratingVoice(true);
        try {
          const voiceResult = await generateVoiceNarration(
            newStory.content,
            selectedCharacter.voiceId,
            selectedEmotion
          );
          
          if (voiceResult.success && voiceResult.data) {
            newStory.audioUrl = voiceResult.data.audioUrl;
            setCurrentStory({ ...newStory });
          }
        } catch (voiceError) {
          console.warn('Voice generation failed:', voiceError);
        }
        setIsGeneratingVoice(false);
        setProgress(75);
      }

      // Step 3: Generate avatar video if enabled
      if (avatarEnabled) {
        setIsGeneratingVideo(true);
        try {
          const videoResult = await generateAvatarVideo(
            newStory.content,
            selectedCharacter,
            selectedEmotion
          );
          
          if (videoResult.success && videoResult.data) {
            newStory.videoUrl = videoResult.data.videoUrl;
            setCurrentStory({ ...newStory });
          }
        } catch (videoError) {
          console.warn('Video generation failed:', videoError);
        }
        setIsGeneratingVideo(false);
      }

      setProgress(100);
      
    } catch (error) {
      console.error('Error generating story:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate story');
    } finally {
      setIsGenerating(false);
      setIsGeneratingVoice(false);
      setIsGeneratingVideo(false);
    }
  };

  const handlePlayStory = () => {
    if (!currentStory) return;

    if (currentStory.audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
    } else if (currentStory.videoUrl && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      // Fallback: use browser speech synthesis
      const utterance = new SpeechSynthesisUtterance(currentStory.content);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      speechSynthesis.speak(utterance);
    }
  };

  const handlePauseStory = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }
    speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleResumeStory = () => {
    if (audioRef.current && currentStory?.audioUrl) {
      audioRef.current.play();
    } else if (videoRef.current && currentStory?.videoUrl) {
      videoRef.current.play();
    } else {
      speechSynthesis.resume();
    }
    setIsPaused(false);
    setIsPlaying(true);
  };

  const handleStopStory = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleDownload = () => {
    if (!currentStory) return;
    
    const content = `${currentStory.title}\n\nNarrated by ${currentStory.character.name}\nEmotion: ${currentStory.emotion}\n\n${currentStory.content}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentStory.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!currentStory) return;
    
    const shareText = `Check out this amazing story created by Mentora AI: "${currentStory.title}" - narrated by ${currentStory.character.name}!`;
    
    if (navigator.share) {
      await navigator.share({
        title: currentStory.title,
        text: shareText,
        url: window.location.href
      });
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  };

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Friend';
  };

  const getProgressMessage = () => {
    if (progress < 25) return 'Initializing story generation...';
    if (progress < 50) return 'Creating your magical story...';
    if (progress < 75) return 'Adding voice narration...';
    if (progress < 100) return 'Generating avatar video...';
    return 'Story ready!';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-secondary-200/30 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-primary-100/40 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239d75ff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="backdrop-blur-xl glass-card bg-white/10 border-b border-white/20 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/home" className="flex items-center gap-3 group">
              <ArrowLeft className="w-5 h-5 text-primary-600 group-hover:-translate-x-1 transition-transform" />
              <span className="text-primary-600 font-medium">Back to Home</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-6 py-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center glow-primary animate-float">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-serif font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Story Mode
                  </h1>
                  <p className="text-sm text-neutral-600">Learn through magical stories</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 rounded-xl backdrop-blur-xl bg-white/20 border border-white/30 text-neutral-700 hover:text-neutral-800 hover:bg-white/30 transition-all duration-300"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="max-w-6xl mx-auto mt-4 p-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl">
              <h3 className="text-lg font-serif font-bold text-neutral-800 mb-4">Story Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-800">Voice Narration</p>
                    <p className="text-sm text-neutral-600">Enable ElevenLabs AI voice storytelling</p>
                  </div>
                  <button
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      voiceEnabled ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-neutral-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      voiceEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-800">Avatar Videos</p>
                    <p className="text-sm text-neutral-600">Show Tavus character animations</p>
                  </div>
                  <button
                    onClick={() => setAvatarEnabled(!avatarEnabled)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      avatarEnabled ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-neutral-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      avatarEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {!currentStory ? (
              /* Story Creation Interface */
              <div className="space-y-8">
                {/* Welcome Section */}
                <div className="text-center mb-12">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto glow-primary animate-float">
                      <Sparkles className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse-slow">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <h2 className="text-6xl font-serif font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                    Welcome to Story Mode, {getUserDisplayName()}! ✨
                  </h2>
                  <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                    Transform any topic into an engaging story with your favorite AI character. 
                    Learning has never been this magical!
                  </p>
                </div>

                {/* Topic Input */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-serif font-bold text-neutral-800 mb-4">What would you like to learn about?</h3>
                  <textarea
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    placeholder="Enter any topic... (e.g., 'The water cycle', 'Ancient Egypt', 'Photosynthesis', 'Shakespeare')"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-purple-200 bg-white/30 backdrop-blur-sm placeholder-neutral-600 text-neutral-800 focus:bg-white/40 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300 resize-none"
                    rows={3}
                  />
                </div>

                {/* Character Selection */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-serif font-bold text-neutral-800 mb-6">Choose your story companion</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {availableCharacters.map((character) => (
                      <div
                        key={character.id}
                        onClick={() => setSelectedCharacter(character)}
                        className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                          selectedCharacter?.id === character.id
                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 shadow-lg'
                            : 'bg-white/20 border border-white/30 hover:bg-white/30'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-3">{character.avatar}</div>
                          <h4 className="font-serif font-bold text-neutral-800 mb-2">{character.name}</h4>
                          <p className="text-sm text-neutral-600 mb-3">{character.personality}</p>
                          <p className="text-xs text-neutral-500">{character.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emotion/Theme Selection */}
                <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-serif font-bold text-neutral-800 mb-6">What's your current mood?</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Object.entries(emotionThemes).map(([emotion, theme]) => (
                      <button
                        key={emotion}
                        onClick={() => setSelectedEmotion(emotion)}
                        className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                          selectedEmotion === emotion
                            ? `bg-gradient-to-r ${theme.color} text-white shadow-lg`
                            : 'bg-white/20 text-neutral-700 hover:bg-white/30'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">
                            {emotion === 'happy' && '😊'}
                            {emotion === 'calm' && '😌'}
                            {emotion === 'stressed' && '😣'}
                            {emotion === 'tired' && '😴'}
                            {emotion === 'focused' && '🎯'}
                            {emotion === 'sad' && '😢'}
                          </div>
                          <p className="text-sm font-medium capitalize">{emotion}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-xl flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Generate Button */}
                <div className="text-center">
                  <button
                    onClick={handleGenerateStory}
                    disabled={!selectedTopic || !selectedCharacter || isGenerating}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Creating your magical story...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6" />
                        <span>Create My Story</span>
                      </>
                    )}
                  </button>

                  {/* Progress Bar */}
                  {isGenerating && (
                    <div className="mt-6 max-w-md mx-auto">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-neutral-600">{getProgressMessage()}</span>
                        <span className="text-sm text-neutral-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Story Playback Interface */
              <div className="space-y-8">
                {/* Story Header */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="text-6xl">{currentStory.character.avatar}</div>
                      <div>
                        <h2 className="text-2xl font-serif font-bold text-neutral-800">{currentStory.title}</h2>
                        <p className="text-neutral-600">Narrated by {currentStory.character.name}</p>
                        <div className="flex items-center gap-4 mt-2">
                          {currentStory.audioUrl && (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm">Voice Ready</span>
                            </div>
                          )}
                          {currentStory.videoUrl && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm">Video Ready</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleDownload}
                        className="p-3 bg-white/50 rounded-xl text-neutral-700 hover:bg-white/100 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleShare}
                        className="p-3 bg-white/50 rounded-xl text-neutral-700 hover:bg-white/100 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCurrentStory(null)}
                        className="p-3 bg-white/50 rounded-xl text-neutral-700 hover:bg-white/100 transition-colors"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Avatar Video Player */}
                  {currentStory.videoUrl && (
                    <div className="mb-6">
                      <video
                        ref={videoRef}
                        className="w-full aspect-video rounded-2xl shadow-lg"
                        controls
                        onPlay={() => {
                          setIsPlaying(true);
                          setIsPaused(false);
                        }}
                        onPause={() => {
                          setIsPlaying(false);
                          setIsPaused(true);
                        }}
                        onEnded={() => {
                          setIsPlaying(false);
                          setIsPaused(false);
                        }}
                      >
                        <source src={currentStory.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}

                  {/* Audio Player */}
                  {currentStory.audioUrl && (
                    <audio
                      ref={audioRef}
                      onPlay={() => {
                        setIsPlaying(true);
                        setIsPaused(false);
                      }}
                      onPause={() => {
                        setIsPlaying(false);
                        setIsPaused(true);
                      }}
                      onEnded={() => {
                        setIsPlaying(false);
                        setIsPaused(false);
                      }}
                    >
                      <source src={currentStory.audioUrl} type="audio/mpeg" />
                    </audio>
                  )}

                  {/* Playback Controls */}
                  <div className="flex items-center justify-center gap-4 mb-6">
                    {!isPlaying && !isPaused ? (
                      <button
                        onClick={handlePlayStory}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        <Play className="w-8 h-8" />
                      </button>
                    ) : isPaused ? (
                      <button
                        onClick={handleResumeStory}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        <Play className="w-8 h-8" />
                      </button>
                    ) : (
                      <button
                        onClick={handlePauseStory}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        <Pause className="w-8 h-8" />
                      </button>
                    )}
                    
                    <button
                      onClick={handleStopStory}
                      className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <Square className="w-8 h-8" />
                    </button>
                    
                    <button
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      className={`p-4 rounded-2xl transition-all duration-300 ${
                        voiceEnabled 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-neutral-300 text-neutral-600'
                      }`}
                    >
                      {voiceEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                    </button>
                  </div>
                </div>

                {/* Story Content */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-serif font-bold text-neutral-800 mb-6">Story Transcript</h3>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">{currentStory.content}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StorytellingPage;