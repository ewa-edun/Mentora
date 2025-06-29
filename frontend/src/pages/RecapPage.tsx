import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Brain, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  Target, 
  Mic, 
  MicOff, 
  Send, 
  Loader2, 
  CheckCircle, 
  Star, 
  BarChart3, 
  Lightbulb, 
  Trophy, 
  Zap,
  Download,
  Share2,
  RefreshCw
} from 'lucide-react';
import { getCurrentUser } from '../services/firebase';
import { getMemoryRecap, generateStudyPlan } from '../services/api';

interface WeeklyRecap {
  totalStudyTime: number;
  sessionsCompleted: number;
  topicsStudied: string[];
  averageScore: number;
  emotionalTrends: string[];
  achievements: string[];
  insights: string[];
  recommendations: string[];
}

interface StudyPlan {
  topic: string;
  totalDuration: string;
  difficulty: string;
  days: Array<{
    day: number;
    title: string;
    description: string;
    tasks: string[];
    estimatedTime: string;
    resources: string[];
  }>;
  tips: string[];
}

const RecapPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [weeklyRecap, setWeeklyRecap] = useState<WeeklyRecap | null>(null);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [isLoadingRecap, setIsLoadingRecap] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [planTopic, setPlanTopic] = useState('');
  const [recapQuery, setRecapQuery] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'recap' | 'plan'>('recap');
  
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    loadWeeklyRecap();

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (activeTab === 'recap') {
          setRecapQuery(transcript);
          handleRecapQuery(transcript);
        } else {
          setPlanTopic(transcript);
        }
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
    };
  }, [navigate, activeTab]);

  const loadWeeklyRecap = async () => {
    if (!user) return;
    
    setIsLoadingRecap(true);
    setError('');

    try {
      const result = await getMemoryRecap(user.uid, 'week');
      if (result.success && result.data) {
        setWeeklyRecap(result.data);
      } else {
        setError(result.error || 'Failed to load weekly recap');
      }
    } catch (error) {
      console.error('Error loading recap:', error);
      setError('Failed to load your learning recap');
    } finally {
      setIsLoadingRecap(false);
    }
  };

  const handleRecapQuery = async (query?: string) => {
    if (!user) return;
    
    const queryText = query || recapQuery.trim();
    if (!queryText) return;

    setIsLoadingRecap(true);
    setError('');

    try {
      const result = await getMemoryRecap(user.uid, 'custom', queryText);
      if (result.success && result.data) {
        setWeeklyRecap(result.data);
      } else {
        setError(result.error || 'Failed to process your question');
      }
    } catch (error) {
      console.error('Error processing recap query:', error);
      setError('Failed to process your question');
    } finally {
      setIsLoadingRecap(false);
    }
  };

  const handleGenerateStudyPlan = async () => {
    if (!planTopic.trim()) {
      setError('Please enter a topic to create a study plan');
      return;
    }

    setIsGeneratingPlan(true);
    setError('');

    try {
      const result = await generateStudyPlan(planTopic, user?.uid);
      if (result.success && result.data) {
        setStudyPlan(result.data);
      } else {
        setError(result.error || 'Failed to generate study plan');
      }
    } catch (error) {
      console.error('Error generating study plan:', error);
      setError('Failed to generate study plan');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

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

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Friend';
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const downloadStudyPlan = () => {
    if (!studyPlan) return;
    
    const content = `${studyPlan.topic} - 5-Day Study Plan\n\n${studyPlan.days.map(day => 
      `Day ${day.day}: ${day.title}\n${day.description}\n\nTasks:\n${day.tasks.map(task => `• ${task}`).join('\n')}\n\nEstimated Time: ${day.estimatedTime}\n\n`
    ).join('')}Tips:\n${studyPlan.tips.map(tip => `• ${tip}`).join('\n')}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${studyPlan.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_study_plan.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareStudyPlan = async () => {
    if (!studyPlan) return;
    
    const shareText = `Check out my 5-day study plan for ${studyPlan.topic} created by Mentora AI! 🧠✨`;
    
    if (navigator.share) {
      await navigator.share({
        title: `${studyPlan.topic} Study Plan`,
        text: shareText,
        url: window.location.href
      });
    } else {
      await navigator.clipboard.writeText(shareText);
    }
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
              <ArrowLeft className="w-5 h-5 text-black-600 group-hover:-translate-x-1 transition-transform" />
              <span className="text-black-600 font-medium">Back to Home</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-6 py-3">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center glow-primary animate-float">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-serif font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Memory Agent
                  </h1>
                  <p className="text-sm text-neutral-600">Your learning journey recap</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadWeeklyRecap}
                className="p-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-neutral-700 hover:text-neutral-800 hover:bg-white/20 transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto glow-primary animate-float">
                  <BarChart3 className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse-slow">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Welcome back, {getUserDisplayName()}! 🧠
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                Let's explore your learning journey and create personalized study plans. 
                Ask me anything about your progress or let me help you master new topics!
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center justify-center mb-8">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-2 rounded-2xl flex">
                <button
                  onClick={() => setActiveTab('recap')}
                  className={`px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'recap'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white/30 text-neutral-600 hover:text-neutral-800 hover:bg-white/50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Memory Recap
                </button>
                <button
                  onClick={() => setActiveTab('plan')}
                  className={`px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'plan'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white/30 text-neutral-600 hover:text-neutral-800 hover:bg-white/50'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  Study Planner
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-xl">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {activeTab === 'recap' ? (
              /* Memory Recap Tab */
              <div className="space-y-8">
                {/* Voice Query Interface */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-serif font-bold text-neutral-800 mb-6 flex items-center gap-3">
                    <Mic className="w-6 h-6 text-indigo-600" />
                    Ask About Your Learning Journey
                  </h3>
                  
                  <div className="flex items-end gap-4 mb-6">
                    <button
                      onClick={isListening ? stopListening : startListening}
                      disabled={isLoadingRecap}
                      className={`flex-shrink-0 w-16 h-16 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg ${
                        isListening
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse scale-110'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-2xl transform hover:scale-110'
                      }`}
                    >
                      {isListening ? (
                        <MicOff className="w-8 h-8 text-white" />
                      ) : (
                        <Mic className="w-8 h-8 text-white" />
                      )}
                    </button>

                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={recapQuery}
                        onChange={(e) => setRecapQuery(e.target.value)}
                        placeholder={isListening ? "🎤 Listening..." : "Ask me: 'What did I learn this week?' or 'How am I progressing?'"}
                        disabled={isListening || isLoadingRecap}
                        className="w-full px-6 py-4 rounded-2xl border-0 bg-white/30 backdrop-blur-sm placeholder-neutral-600 text-neutral-800 focus:bg-white/40 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-300 text-lg"
                        onKeyPress={(e) => e.key === 'Enter' && handleRecapQuery()}
                      />
                    </div>

                    <button
                      onClick={() => handleRecapQuery()}
                      disabled={!recapQuery.trim() || isLoadingRecap || isListening}
                      className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg"
                    >
                      <Send className="w-8 h-8" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => {
                        setRecapQuery("What did I learn this week?");
                        handleRecapQuery("What did I learn this week?");
                      }}
                      className="p-4 bg-white/20 rounded-xl text-left hover:bg-white/30 transition-colors"
                    >
                      <div className="text-sm font-medium text-neutral-800">📚 Weekly Summary</div>
                      <div className="text-xs text-neutral-600">What did I learn this week?</div>
                    </button>
                    
                    <button
                      onClick={() => {
                        setRecapQuery("How am I progressing?");
                        handleRecapQuery("How am I progressing?");
                      }}
                      className="p-4 bg-white/20 rounded-xl text-left hover:bg-white/30 transition-colors"
                    >
                      <div className="text-sm font-medium text-neutral-800">📈 Progress Check</div>
                      <div className="text-xs text-neutral-600">How am I progressing?</div>
                    </button>
                    
                    <button
                      onClick={() => {
                        setRecapQuery("What should I focus on next?");
                        handleRecapQuery("What should I focus on next?");
                      }}
                      className="p-4 bg-white/20 rounded-xl text-left hover:bg-white/30 transition-colors"
                    >
                      <div className="text-sm font-medium text-neutral-800">🎯 Next Steps</div>
                      <div className="text-xs text-neutral-600">What should I focus on next?</div>
                    </button>
                  </div>
                </div>

                {/* Loading State */}
                {isLoadingRecap && (
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                    <div className="flex items-center justify-center gap-4">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                      <span className="text-lg text-neutral-700">Analyzing your learning journey...</span>
                    </div>
                  </div>
                )}

                {/* Weekly Recap Results */}
                {weeklyRecap && !isLoadingRecap && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Study Stats */}
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                      <h4 className="text-xl font-serif font-bold text-neutral-800 mb-6 flex items-center gap-3">
                        <Trophy className="w-6 h-6 text-amber-500" />
                        Your Achievements
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-indigo-600 mb-2">
                            {formatTime(weeklyRecap.totalStudyTime)}
                          </div>
                          <div className="text-sm text-neutral-600">Total Study Time</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            {weeklyRecap.sessionsCompleted}
                          </div>
                          <div className="text-sm text-neutral-600">Sessions Completed</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600 mb-2">
                            {weeklyRecap.topicsStudied.length}
                          </div>
                          <div className="text-sm text-neutral-600">Topics Explored</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {Math.round(weeklyRecap.averageScore)}%
                          </div>
                          <div className="text-sm text-neutral-600">Average Score</div>
                        </div>
                      </div>

                      {weeklyRecap.achievements.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-neutral-800 mb-3">🏆 Recent Achievements</h5>
                          <div className="space-y-2">
                            {weeklyRecap.achievements.map((achievement, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 bg-amber-100/60 rounded-xl">
                                <Star className="w-4 h-4 text-amber-600" />
                                <span className="text-sm text-amber-800">{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Insights & Recommendations */}
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                      <h4 className="text-xl font-serif font-bold text-neutral-800 mb-6 flex items-center gap-3">
                        <Lightbulb className="w-6 h-6 text-yellow-500" />
                        AI Insights
                      </h4>
                      
                      {weeklyRecap.insights.length > 0 && (
                        <div className="mb-6">
                          <h5 className="font-semibold text-neutral-800 mb-3">💡 Learning Insights</h5>
                          <div className="space-y-3">
                            {weeklyRecap.insights.map((insight, index) => (
                              <div key={index} className="p-4 bg-blue-100/60 rounded-xl">
                                <p className="text-sm text-blue-800">{insight}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {weeklyRecap.recommendations.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-neutral-800 mb-3">🎯 Recommendations</h5>
                          <div className="space-y-3">
                            {weeklyRecap.recommendations.map((recommendation, index) => (
                              <div key={index} className="p-4 bg-green-100/60 rounded-xl">
                                <p className="text-sm text-green-800">{recommendation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {weeklyRecap.emotionalTrends.length > 0 && (
                        <div className="mt-6">
                          <h5 className="font-semibold text-neutral-800 mb-3">💝 Emotional Journey</h5>
                          <div className="flex flex-wrap gap-2">
                            {weeklyRecap.emotionalTrends.map((emotion, index) => (
                              <span key={index} className="px-3 py-1 bg-pink-100/60 text-pink-800 rounded-full text-sm">
                                {emotion}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Study Plan Generator Tab */
              <div className="space-y-8">
                {/* Topic Input */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-serif font-bold text-neutral-800 mb-6 flex items-center gap-3">
                    <Target className="w-6 h-6 text-green-600" />
                    Create Your 5-Day Study Plan
                  </h3>
                  
                  <div className="flex items-end gap-4 mb-6">
                    <button
                      onClick={isListening ? stopListening : startListening}
                      disabled={isGeneratingPlan}
                      className={`flex-shrink-0 w-16 h-16 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg ${
                        isListening
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse scale-110'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-2xl transform hover:scale-110'
                      }`}
                    >
                      {isListening ? (
                        <MicOff className="w-8 h-8 text-white" />
                      ) : (
                        <Mic className="w-8 h-8 text-white" />
                      )}
                    </button>

                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={planTopic}
                        onChange={(e) => setPlanTopic(e.target.value)}
                        placeholder={isListening ? "🎤 Listening..." : "Enter a topic: 'Python programming', 'React development', 'Machine Learning'..."}
                        disabled={isListening || isGeneratingPlan}
                        className="w-full px-6 py-4 rounded-2xl border-0 bg-white/20 backdrop-blur-sm placeholder-neutral-600 text-neutral-800 focus:bg-white/30 focus:ring-2 focus:ring-green-400 focus:outline-none transition-all duration-300 text-lg"
                        onKeyPress={(e) => e.key === 'Enter' && handleGenerateStudyPlan()}
                      />
                    </div>

                    <button
                      onClick={handleGenerateStudyPlan}
                      disabled={!planTopic.trim() || isGeneratingPlan || isListening}
                      className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg"
                    >
                      {isGeneratingPlan ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                      ) : (
                        <Zap className="w-8 h-8" />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setPlanTopic("Python programming")}
                      className="p-4 bg-white/20 rounded-xl text-left hover:bg-white/30 transition-colors"
                    >
                      <div className="text-sm font-medium text-neutral-800">🐍 Python Programming</div>
                      <div className="text-xs text-neutral-600">Learn Python from basics to advanced</div>
                    </button>
                    
                    <button
                      onClick={() => setPlanTopic("React development")}
                      className="p-4 bg-white/20 rounded-xl text-left hover:bg-white/30 transition-colors"
                    >
                      <div className="text-sm font-medium text-neutral-800">⚛️ React Development</div>
                      <div className="text-xs text-neutral-600">Master modern React development</div>
                    </button>
                    
                    <button
                      onClick={() => setPlanTopic("Machine Learning")}
                      className="p-4 bg-white/20 rounded-xl text-left hover:bg-white/30 transition-colors"
                    >
                      <div className="text-sm font-medium text-neutral-800">🤖 Machine Learning</div>
                      <div className="text-xs text-neutral-600">Dive into AI and ML concepts</div>
                    </button>
                  </div>
                </div>

                {/* Loading State */}
                {isGeneratingPlan && (
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                    <div className="flex items-center justify-center gap-4">
                      <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                      <span className="text-lg text-neutral-700">Creating your personalized study plan...</span>
                    </div>
                  </div>
                )}

                {/* Study Plan Results */}
                {studyPlan && !isGeneratingPlan && (
                  <div className="space-y-6">
                    {/* Plan Header */}
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="text-2xl font-serif font-bold text-neutral-800 mb-2">
                            {studyPlan.topic} - 5-Day Study Plan
                          </h4>
                          <div className="flex items-center gap-6 text-sm text-neutral-600">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{studyPlan.totalDuration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" />
                              <span className="capitalize">{studyPlan.difficulty}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={downloadStudyPlan}
                            className="p-3 bg-blue-500/20 rounded-xl text-blue-600 hover:bg-blue-500/30 transition-colors"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          <button
                            onClick={shareStudyPlan}
                            className="p-3 bg-green-500/20 rounded-xl text-green-600 hover:bg-green-500/30 transition-colors"
                          >
                            <Share2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Daily Plans */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {studyPlan.days.map((day, index) => (
                        <div key={index} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:bg-white/15 transition-all duration-300">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                              {day.day}
                            </div>
                            <div>
                              <h5 className="text-lg font-serif font-bold text-neutral-800">{day.title}</h5>
                              <p className="text-sm text-neutral-600">{day.estimatedTime}</p>
                            </div>
                          </div>
                          
                          <p className="text-neutral-700 mb-4 leading-relaxed">{day.description}</p>
                          
                          <div className="space-y-3">
                            <h6 className="font-semibold text-neutral-800 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              Tasks
                            </h6>
                            <ul className="space-y-2">
                              {day.tasks.map((task, taskIndex) => (
                                <li key={taskIndex} className="flex items-start gap-3">
                                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm text-neutral-700">{task}</span>
                                </li>
                              ))}
                            </ul>
                            
                            {day.resources.length > 0 && (
                              <div className="mt-4">
                                <h6 className="font-semibold text-neutral-800 flex items-center gap-2 mb-2">
                                  <BookOpen className="w-4 h-4 text-blue-600" />
                                  Resources
                                </h6>
                                <div className="flex flex-wrap gap-2">
                                  {day.resources.map((resource, resourceIndex) => (
                                    <span key={resourceIndex} className="px-2 py-1 bg-blue-100/60 text-blue-800 rounded-lg text-xs">
                                      {resource}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Study Tips */}
                    {studyPlan.tips.length > 0 && (
                      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                        <h4 className="text-xl font-serif font-bold text-neutral-800 mb-6 flex items-center gap-3">
                          <Lightbulb className="w-6 h-6 text-yellow-500" />
                          Pro Tips for Success
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {studyPlan.tips.map((tip, index) => (
                            <div key={index} className="p-4 bg-yellow-100/60 rounded-xl">
                              <p className="text-sm text-yellow-800">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecapPage;