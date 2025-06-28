import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX,Sparkles,Star,BookOpen,
Settings,Download,Share2,Loader2,CheckCircle,AlertTriangle,Square,Clock,History
} from 'lucide-react';
import { getCurrentUser, createStorySession, updateStorySession, getUserStorySessions, rateStorySession, StorySession } from '../services/firebase';
import { generateStory, generateVoiceNarration, generateAvatarVideo, getStoryCharacters,StoryCharacter } from '../services/api';
import VoicePanel from '../components/VoicePanel';
import SmartReminders from '../components/SmartReminders';


const StorytellingPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('happy');
  const [selectedCharacter, setSelectedCharacter] = useState<StoryCharacter | null>(null);
  const [availableCharacters, setAvailableCharacters] = useState<StoryCharacter[]>([]);
  const [currentStory, setCurrentStory] = useState<StorySession | null>(null);
  const [recentStories, setRecentStories] = useState<StorySession[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [avatarEnabled, setAvatarEnabled] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPausedSpeech, setIsPausedSpeech] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState(0.9);
  const [voicePitch, setVoicePitch] = useState(1);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  
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
      loadRecentStories(currentUser.uid);
      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
      }
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

  const loadRecentStories = async (userId: string) => {
    try {
      const stories = await getUserStorySessions(userId, 5);
      setRecentStories(stories);
    } catch (error) {
      console.error('Error loading recent stories:', error);
    }
  };

  const saveStorySession = async (storyData: Partial<StorySession>) => {
    if (!user) return null;

    try {
      const sessionData: any = {
        userId: user.uid,
        title: storyData.title || '',
        content: storyData.content || '',
        character: storyData.character || selectedCharacter!,
        emotion: storyData.emotion || selectedEmotion,
        topic: storyData.topic || selectedTopic,
        duration: storyData.duration || 240,
        actualDuration: sessionStartTime ? Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000) : 0,
        hasAudio: !!storyData.audioUrl,
        hasVideo: !!storyData.videoUrl,
        audioUrl: storyData.audioUrl,
        videoUrl: storyData.videoUrl,
        completed: storyData.completed || false,
        startTime: sessionStartTime || new Date(),
        endTime: storyData.completed ? new Date() : undefined,
        ...storyData
      };

       // Only include audioUrl if defined
    if (storyData.audioUrl !== undefined) {
      sessionData.audioUrl = storyData.audioUrl;
    }
    // Only include videoUrl if defined
    if (storyData.videoUrl !== undefined) {
      sessionData.videoUrl = storyData.videoUrl;
    }
    // Remove any undefined fields (especially endTime)
    Object.keys(sessionData).forEach(
      (key) => sessionData[key] === undefined && delete sessionData[key]
    );

      const storyId = await createStorySession(sessionData);
      await loadRecentStories(user.uid);
      return storyId;
    } catch (error) {
      console.error('Error saving story session:', error);
      return null;
    }
  };

  const loadStory = (story: StorySession) => {
    const storySession: StorySession = {
      ...story,
      character: {
        id: story.character.id,
        name: story.character.name,
        personality: story.character.personality,
        avatar: story.character.avatar
      }
    };

    setCurrentStory(storySession);
    setSelectedTopic(story.topic);
    setSelectedEmotion(story.emotion);
    setSelectedCharacter(story.character as StoryCharacter);
    setShowHistory(false);
  };

  const rateStory = async (rating: number) => {
    if (!currentStory?.id) return;

    try {
      await rateStorySession(currentStory.id, rating);
      setCurrentStory({ ...currentStory, rating });
      await loadRecentStories(user.uid);
    } catch (error) {
      console.error('Error rating story:', error);
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
    setSessionStartTime(new Date());
    
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
        userId: user.uid,
        title: storyResult.data.title,
        content: storyResult.data.content,
        character: selectedCharacter,
        emotion: selectedEmotion,
        topic: selectedTopic,
        duration: storyResult.data.duration,
        hasAudio: false,
        hasVideo: false,
        completed: false,
        startTime: sessionStartTime,
        createdAt: new Date() 
      };

      setCurrentStory(newStory);
      setProgress(50);

      // Save initial story session
      const storyId = await saveStorySession(newStory);
      if (storyId) {
        setCurrentStory({ ...newStory, id: storyId });
      }

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
            const updatedStory = { ...newStory, audioUrl: voiceResult.data.audioUrl, hasAudio: true };
            setCurrentStory(updatedStory);
            
            // Update story session
            if (storyId) {
              await updateStorySession(storyId, { audioUrl: voiceResult.data.audioUrl, hasAudio: true });
            }
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
            const updatedStory = { ...newStory, videoUrl: videoResult.data.videoUrl, hasVideo: true };
            setCurrentStory(updatedStory);
            
            // Update story session
            if (storyId) {
              await updateStorySession(storyId, { videoUrl: videoResult.data.videoUrl, hasVideo: true });
            }
          }
        } catch (videoError) {
          console.warn('Video generation failed:', videoError);
        }
        setIsGeneratingVideo(false);
      }

      setProgress(100);
      
      // Mark story as completed
      if (storyId) {
        await updateStorySession(storyId, { completed: true, endTime: new Date() });
      }
      
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

   const speakText = (text: string) => {
    if (!synthRef.current || !voiceEnabled) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceSpeed;
    utterance.pitch = voicePitch;
    utterance.volume = 0.8;
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPausedSpeech(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPausedSpeech(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPausedSpeech(false);
    };
    currentUtteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

   const pauseSpeech = () => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.pause();
      setIsPausedSpeech(true);
    }
  };

  const resumeSpeech = () => {
    if (synthRef.current && isPausedSpeech) {
      synthRef.current.resume();
      setIsPausedSpeech(false);
    }
  };

  const stopSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setIsPausedSpeech(false);
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

  const formatStoryTime = (timestamp: any) => {
    if (!timestamp) return '';
    
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      return '';
    }
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                onClick={() => setShowHistory(!showHistory)}
                className="p-3 rounded-xl backdrop-blur-xl bg-white/30 border border-white/40 text-neutral-700 hover:text-neutral-800 hover:bg-white/40 transition-all duration-300"
              >
                <History className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 rounded-xl backdrop-blur-xl bg-white/30 border border-white/40 text-neutral-700 hover:text-neutral-800 hover:bg-white/40 transition-all duration-300"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Story History Panel */}
          {showHistory && (
            <div className="max-w-6xl mx-auto mt-4 p-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl">
              <h3 className="text-lg font-serif font-bold text-neutral-800 mb-4">Recent Stories</h3>
              
              {recentStories.length > 0 ? (
                <div className="space-y-3">
                  {recentStories.map((story, index) => (
                    <div
                      key={story.id || index}
                      onClick={() => loadStory(story)}
                      className="p-4 bg-white/20 rounded-xl border border-white/30 hover:bg-white/30 cursor-pointer transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{story.character.avatar}</span>
                            <div>
                              <p className="font-medium text-neutral-800">{story.title}</p>
                              <p className="text-sm text-neutral-600">by {story.character.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-neutral-600">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {story.topic}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {Math.floor((story.actualDuration || 0) / 60)}m
                            </span>
                            <span>{formatStoryTime(story.createdAt)}</span>
                            {story.rating && (
                              <div className="flex items-center gap-1">
                                {[...Array(story.rating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 text-amber-400 fill-current" />
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 mt-2">
                            {story.hasAudio && (
                              <span className="bg-green-100/60 text-green-700 px-2 py-1 rounded-lg text-xs">Audio</span>
                            )}
                            {story.hasVideo && (
                              <span className="bg-blue-100/60 text-blue-700 px-2 py-1 rounded-lg text-xs">Video</span>
                            )}
                            {story.completed && (
                              <span className="bg-purple-100/60 text-purple-700 px-2 py-1 rounded-lg text-xs">Completed</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-600 text-center py-8">No stories created yet. Generate your first magical story!</p>
              )}
            </div>
          )}

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
           <SmartReminders
            sessionStartTime={sessionStartTime}
            userActions={messages.length} 
            emotion={currentEmotion}
          />
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
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm">Video Ready</span>
                            </div>
                          )}
                          {sessionStartTime && (
                            <div className="flex items-center gap-1 text-purple-600">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">
                                {Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 60000)}m session
                              </span>
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

                  {/* Story Rating */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-sm text-neutral-600 mr-2">Rate this story:</span>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => rateStory(rating)}
                        className={`p-1 transition-colors ${
                          currentStory.rating && rating <= currentStory.rating
                            ? 'text-amber-400'
                            : 'text-neutral-300 hover:text-amber-400'
                        }`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Story Content */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-serif font-bold text-neutral-800 mb-6">Story Transcript</h3>
                <div className="flex items-center gap-2">
                      {!isSpeaking && !isPausedSpeech && (
                        <button
                          onClick={() => speakText(currentStory.content)}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-xl hover:shadow-lg transition-all duration-300"
                          title="Play narration"
                        >
                          <Play className="w-6 h-6" />
                        </button>
                       )}
                      {isSpeaking && !isPausedSpeech && (
                        <button
                          onClick={pauseSpeech}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-3 rounded-xl hover:shadow-lg transition-all duration-300"
                          title="Pause narration"
                        >
                          <Pause className="w-6 h-6" />
                        </button>
                      )}
                      {isPausedSpeech && (
                        <button
                          onClick={resumeSpeech}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-xl hover:shadow-lg transition-all duration-300"
                          title="Resume narration"
                        >
                          <Play className="w-6 h-6" />
                        </button>
                      )}
                      {(isSpeaking || isPausedSpeech) && (
                        <button
                          onClick={stopSpeech}
                          className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-xl hover:shadow-lg transition-all duration-300"
                          title="Stop narration"
                        >
                          <Square className="w-6 h-6" />
                        </button>
                      )}
                    </div>

                  <div className="prose prose-lg max-w-none">
                    <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">{currentStory.content}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <VoicePanel />
      </div>
    </div>
  );
};

export default StorytellingPage;