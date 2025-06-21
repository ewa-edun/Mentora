import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Star, BookOpen, Settings, Download, Share2 } from 'lucide-react';
import { getCurrentUser } from '../services/firebase';
//import { generateStory, generateAvatarVideo, generateVoiceNarration,  } from '../services/api';


interface StoryCharacter {
  id: string;
  name: string;
  personality: string;
  avatar: string;
  voiceId: string;
  description: string;
}

interface StorySession {
  id: string;
  title: string;
  content: string;
  characters: StoryCharacter[];
  emotion: string;
  duration: number;
  isPlaying: boolean;
}

const StorytellingPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('happy');
  const [selectedCharacter, setSelectedCharacter] = useState<StoryCharacter | null>(null);
  const [currentStory, setCurrentStory] = useState<StorySession | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [avatarEnabled, setAvatarEnabled] = useState(true);
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const storyCharacters: StoryCharacter[] = [
    {
      id: 'mento',
      name: 'Mento the Wise Owl',
      personality: 'Wise, encouraging, patient',
      avatar: '🦉',
      voiceId: 'wise-mentor',
      description: 'A gentle owl who loves helping students discover the magic in learning'
    },
    {
      id: 'luna',
      name: 'Luna the Curious Cat',
      personality: 'Playful, curious, energetic',
      avatar: '🐱',
      voiceId: 'playful-friend',
      description: 'An adventurous cat who turns every lesson into an exciting quest'
    },
    {
      id: 'sage',
      name: 'Sage the Calm Dragon',
      personality: 'Calm, wise, protective',
      avatar: '🐉',
      voiceId: 'calm-guide',
      description: 'A peaceful dragon who helps students find inner strength and confidence'
    },
    {
      id: 'spark',
      name: 'Spark the Energetic Fox',
      personality: 'Energetic, motivating, fun',
      avatar: '🦊',
      voiceId: 'energetic-coach',
      description: 'A lively fox who makes learning feel like the greatest adventure ever'
    }
  ];

  const emotionThemes = {
    happy: { color: 'from-yellow-400 to-orange-400', theme: 'celebration and joy' },
    calm: { color: 'from-blue-400 to-cyan-400', theme: 'peace and tranquility' },
    stressed: { color: 'from-orange-400 to-red-400', theme: 'overcoming challenges' },
    tired: { color: 'from-purple-400 to-indigo-400', theme: 'rest and renewal' },
    focused: { color: 'from-green-400 to-emerald-400', theme: 'determination and growth' },
    sad: { color: 'from-blue-500 to-indigo-500', theme: 'hope and healing' }
  };

  const handleGenerateStory = async () => {
    if (!selectedTopic || !selectedCharacter) return;

    setIsGenerating(true);
    
    try {
      // TODO: Connect to Gemini API for story generation
      const storyPrompt = `Create an engaging, educational story about "${selectedTopic}" featuring ${selectedCharacter.name} (${selectedCharacter.personality}). The story should have a ${emotionThemes[selectedEmotion as keyof typeof emotionThemes].theme} theme and be appropriate for students. Include learning elements and emotional support. Make it 3-5 minutes long when narrated.`;
      
      // Simulate API call for demo
      setTimeout(async () => {
        const generatedStory: StorySession = {
          id: Date.now().toString(),
          title: `${selectedCharacter.name}'s Adventure: ${selectedTopic}`,
          content: `Once upon a time, in the magical realm of learning, ${selectedCharacter.name} discovered something wonderful about ${selectedTopic}...\n\n[This would be the full generated story from Gemini API, tailored to the selected emotion and character personality. The story would include educational content, emotional support, and interactive elements.]`,
          characters: [selectedCharacter],
          emotion: selectedEmotion,
          duration: 240, // 4 minutes
          isPlaying: false
        };

        setCurrentStory(generatedStory);
        
        // Generate avatar video if enabled
        if (avatarEnabled) {
          await generateAvatarVideo(generatedStory);
        }
        
        setIsGenerating(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error generating story:', error);
      setIsGenerating(false);
    }
  };

  const generateAvatarVideo = async (story: StorySession) => {
    try {
      // TODO: Connect to Tavus API
      const tavusResponse = await fetch('/api/generate-avatar-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: story.content,
          character: story.characters[0],
          emotion: story.emotion
        })
      });
      
      // For demo, we'll simulate video generation
      console.log('Avatar video would be generated here with Tavus API');
    } catch (error) {
      console.error('Error generating avatar video:', error);
    }
  };

  const handlePlayStory = async () => {
    if (!currentStory) return;

    setIsPlaying(true);
    setIsPaused(false);

    if (voiceEnabled) {
      // TODO: Connect to ElevenLabs API for voice synthesis
      try {
        const voiceResponse = await fetch('/api/text-to-speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: currentStory.content,
            voice_id: currentStory.characters[0].voiceId,
            emotion: currentStory.emotion
          })
        });
        
        // For demo, we'll simulate voice playback
        console.log('Story would be narrated with ElevenLabs voice synthesis');
      } catch (error) {
        console.error('Error generating speech:', error);
      }
    }

    // Simulate story playback
    setTimeout(() => {
      setIsPlaying(false);
    }, currentStory.duration * 1000);
  };

  const handlePauseStory = () => {
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleResumeStory = () => {
    setIsPaused(false);
    setIsPlaying(true);
  };

  const handleStopStory = () => {
    setIsPlaying(false);
    setIsPaused(false);
  };

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Friend';
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
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 px-6 py-4">
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
                className="p-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-neutral-700 hover:text-neutral-800 hover:bg-white/20 transition-all duration-300"
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
                    <p className="text-sm text-neutral-600">Enable AI voice storytelling</p>
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
                    <p className="text-sm text-neutral-600">Show character animations</p>
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
                  
                  <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
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
                    className="w-full px-6 py-4 rounded-2xl border-0 bg-white/20 backdrop-blur-sm placeholder-neutral-600 text-neutral-800 focus:bg-white/30 focus:ring-2 focus:ring-primary-400 focus:outline-none transition-all duration-300 resize-none"
                    rows={3}
                  />
                </div>

                {/* Character Selection */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-serif font-bold text-neutral-800 mb-6">Choose your story companion</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {storyCharacters.map((character) => (
                      <div
                        key={character.id}
                        onClick={() => setSelectedCharacter(character)}
                        className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                          selectedCharacter?.id === character.id
                            ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border-2 border-primary-500/50 shadow-lg'
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
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
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

                {/* Generate Button */}
                <div className="text-center">
                  <button
                    onClick={handleGenerateStory}
                    disabled={!selectedTopic || !selectedCharacter || isGenerating}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating your magical story...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6" />
                        <span>Create My Story</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Story Playback Interface */
              <div className="space-y-8">
                {/* Story Header */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="text-6xl">{currentStory.characters[0].avatar}</div>
                      <div>
                        <h2 className="text-2xl font-serif font-bold text-neutral-800">{currentStory.title}</h2>
                        <p className="text-neutral-600">Narrated by {currentStory.characters[0].name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setCurrentStory(null)}
                        className="p-3 bg-white/20 rounded-xl text-neutral-700 hover:bg-white/30 transition-colors"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Avatar Video Player */}
                  {avatarEnabled && (
                    <div className="mb-6">
                      <div className="aspect-video bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center">
                        <video
                          ref={videoRef}
                          className="w-full h-full rounded-2xl"
                          poster="/api/placeholder/800/450"
                        >
                          {/* Tavus-generated video would be loaded here */}
                        </video>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-8xl opacity-50">{currentStory.characters[0].avatar}</div>
                        </div>
                      </div>
                    </div>
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

                  {/* Story Progress */}
                  {isPlaying && (
                    <div className="mb-6">
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
                      </div>
                      <div className="flex justify-between text-sm text-neutral-600 mt-2">
                        <span>1:48</span>
                        <span>{Math.floor(currentStory.duration / 60)}:{(currentStory.duration % 60).toString().padStart(2, '0')}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Story Content */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-serif font-bold text-neutral-800">Story Transcript</h3>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 transition-colors">
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Download</span>
                      </button>
                      <button className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                  </div>
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