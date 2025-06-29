import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {  Brain, Heart, BookOpen, Mic, User, LogOut, Sparkles, TrendingUp, Clock, Target, Award, Calendar, BarChart3, Activity, Zap, ChevronDown, ChevronUp, Lightbulb, Loader2, RefreshCw, ArrowRight, Crown, CheckCircle, Type, FileText, Camera, Youtube, Star, MessageCircle, Volume2, Timer} from 'lucide-react';
import { getCurrentUser, getUserProfile, getUserAnalytics, logoutUser, UserProfile, StudySession, EmotionEntry, LearningProgress} from '../services/firebase';
import { getChartData, getUserInsights } from '../services/api';
import AnalyticsCharts from '../components/analytics/AnalyticsCharts';
import AnalyticsHeatmap from '../components/analytics/AnalyticsHeatmap';
import VoicePanel from '../components/VoicePanel';
import PomodoroTimer from '../components/PomodoroTimer';

const StudentDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'study' | 'emotions' | 'progress' | 'stories'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [studyTimeChart, setStudyTimeChart] = useState<any>(null);
  const [emotionTrendsChart, setEmotionTrendsChart] = useState<any>(null);
  const [quizPerformanceChart, setQuizPerformanceChart] = useState<any>(null);
  const [activityHeatmap, setActivityHeatmap] = useState<any>(null);
  const [isLoadingCharts, setIsLoadingCharts] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>({});
  const [isChartsLoading, setIsChartsLoading] = useState(false);
  const [showPomodoroWidget, setShowPomodoroWidget] = useState(false);

  const navigate = useNavigate();

 useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    loadDashboardData(currentUser.uid);
  }, [navigate]);


  const loadDashboardData = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Load analytics data
      const analyticsData = await getUserAnalytics(userId);
      setAnalytics(analyticsData);

      // Load insights
      const insightsResult = await getUserInsights(userId, analyticsData);
      if (insightsResult.success && insightsResult.data) {
        setInsights(insightsResult.data.insights);
      }

      // Load initial charts
      await loadCharts(userId, timeRange);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCharts = async (userId: string, range: string) => {
    try {
      setIsChartsLoading(true);
      
      const chartTypes = ['study_time', 'emotion_trends', 'quiz_performance', 'activity_heatmap'];
      const chartPromises = chartTypes.map(type => 
        getChartData(userId, type, range)
      );
      
      const chartResults = await Promise.all(chartPromises);
      const newChartData: any = {};
      
      chartResults.forEach((result, index) => {
        if (result.success && result.data) {
          newChartData[chartTypes[index]] = result.data;
        }
      });
      
      setChartData(newChartData);
    } catch (error) {
      console.error('Error loading charts:', error);
    } finally {
      setIsChartsLoading(false);
    }
  };

const loadUserData = useCallback(async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    // Load user profile and analytics
    const [profile, analyticsData] = await Promise.all([
      getUserProfile(currentUser.uid),
      getUserAnalytics(currentUser.uid)
    ]);

    setUserProfile(profile);
    setAnalytics(analyticsData);
  } catch (error) {
    console.error('Error loading user data:', error);
    setError('Failed to load dashboard data');
  } finally {
    setIsLoading(false);
  }
}, [navigate]);

useEffect(() => {
  loadUserData();
}, [loadUserData]);


  const loadChartData = useCallback(async () => {
    if (!user) return;
    
    setIsLoadingCharts(true);
    try {
      const [studyTimeResult, emotionTrendsResult, quizPerformanceResult, activityHeatmapResult] = await Promise.all([
        getChartData(user.uid, 'study_time', timeRange),
        getChartData(user.uid, 'emotion_trends', timeRange),
        getChartData(user.uid, 'quiz_performance', timeRange),
        getChartData(user.uid, 'activity_heatmap', timeRange)
      ]);
      
      if (studyTimeResult.success && studyTimeResult.data) {
        setStudyTimeChart(studyTimeResult.data.data);
      }
      
      if (emotionTrendsResult.success && emotionTrendsResult.data) {
        setEmotionTrendsChart(emotionTrendsResult.data.data);
      }
      
      if (quizPerformanceResult.success && quizPerformanceResult.data) {
        setQuizPerformanceChart(quizPerformanceResult.data.data);
      }
      
      if (activityHeatmapResult.success && activityHeatmapResult.data) {
        setActivityHeatmap(activityHeatmapResult.data.data);
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setIsLoadingCharts(false);
    }
  }, [user, timeRange]);

  const loadInsights = useCallback(async () => {
    if (!user || !analytics) return;
    
    setIsLoadingInsights(true);
    try {
      const result = await getUserInsights(user.uid, analytics);
      
      if (result.success && result.data) {
        setInsights(result.data.insights);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  }, [user, analytics]);

  useEffect(() => {
  if (analytics) {
    loadChartData();
    loadInsights();
  }
}, [analytics, timeRange, loadChartData, loadInsights]);


  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getUserDisplayName = () => {
    if (userProfile?.displayName) return userProfile.displayName;
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Student';
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      return 'N/A';
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getEmotionColor = (emotion: string) => {
    const colors: {[key: string]: string} = {
      'happy': 'bg-yellow-500',
      'calm': 'bg-blue-500',
      'focused': 'bg-green-500',
      'stressed': 'bg-orange-500',
      'tired': 'bg-purple-500',
      'sad': 'bg-blue-600',
      'neutral': 'bg-gray-500'
    };
    return colors[emotion] || 'bg-gray-500';
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis: {[key: string]: string} = {
      'happy': '😊',
      'calm': '😌',
      'focused': '🎯',
      'stressed': '😣',
      'tired': '😴',
      'sad': '😢',
      'neutral': '😐'
    };
    return emojis[emotion] || '😐';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Award className="w-6 h-6 text-amber-500" />;
      case 'progress': return <TrendingUp className="w-6 h-6 text-green-500" />;
      case 'wellness': return <Heart className="w-6 h-6 text-rose-500" />;
      case 'strength': return <Zap className="w-6 h-6 text-blue-500" />;
      case 'habit': return <Calendar className="w-6 h-6 text-purple-500" />;
      case 'recommendation': return <Lightbulb className="w-6 h-6 text-amber-500" />;
      case 'encouragement': return <Sparkles className="w-6 h-6 text-pink-500" />;
      default: return <Lightbulb className="w-6 h-6 text-rose-500" />;
    }
  };

  const getInsightBackground = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-amber-50/80 border-amber-200/50';
      case 'progress': return 'bg-green-50/80 border-green-200/50';
      case 'wellness': return 'bg-rose-50/80 border-rose-200/50';
      case 'strength': return 'bg-blue-50/80 border-blue-200/50';
      case 'habit': return 'bg-purple-50/80 border-purple-200/50';
      case 'recommendation': return 'bg-amber-50/80 border-amber-200/50';
      case 'encouragement': return 'bg-pink-50/80 border-pink-200/50';
      default: return 'bg-white/30 border-white/40';
    }
  };

  const toggleInsight = (id: string) => {
    if (expandedInsight === id) {
      setExpandedInsight(null);
    } else {
      setExpandedInsight(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-secondary-200/30 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-primary-100/40 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239d75ff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-xl glass-card bg-white/10 border-b border-white/20 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center glow-primary animate-float">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Mentora
                </h1>
                <p className="text-sm text-neutral-600">Your AI Study Companion</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
                <Link 
                to="/home"
                className="bg-gradient-to-r from-purple-400 to-blue-400 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                ⬅️ Home
              </Link>
              <Link 
                to="/premium"
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade</span>
              </Link>
              
              <Link 
                to="/profile"
                className="p-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-neutral-700 hover:text-neutral-800 hover:bg-white/20 transition-all duration-300"
              >
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setShowPomodoroWidget(!showPomodoroWidget)}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  showPomodoroWidget 
                    ? 'bg-red-100/60 text-red-600 hover:bg-red-100/80' 
                    : 'bg-white/10 border border-white/20 text-neutral-700 hover:bg-white/20'
                }`}
              >
                <Timer className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleLogout}
                className="p-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-neutral-700 hover:text-red-600 hover:bg-red-50/20 transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto glow-primary animate-float">
                  <BarChart3 className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse-slow">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
                {getGreeting()}, {getUserDisplayName()}! 👋
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                Here's your personalized learning dashboard with insights and analytics to help you study smarter.
              </p>
            </div>

            {/* Pomodoro Widget */}
            {showPomodoroWidget && (
              <div className="mb-8">
                <PomodoroTimer />
              </div>
            )}

            {/* Dashboard Tabs */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 mb-8">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                      : 'bg-white/40 text-neutral-700 hover:bg-white/50'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('study')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === 'study'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                      : 'bg-white/40 text-neutral-700 hover:bg-white/50'
                  }`}
                >
                  Study Analytics
                </button>
                <button
                  onClick={() => setActiveTab('emotions')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === 'emotions'
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
                      : 'bg-white/40 text-neutral-700 hover:bg-white/50'
                  }`}
                >
                  Emotional Wellness
                </button>
                <button
                  onClick={() => setActiveTab('progress')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === 'progress'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                      : 'bg-white/40 text-neutral-700 hover:bg-white/50'
                  }`}
                >
                  Learning Progress
                </button>
                <button
                  onClick={() => setActiveTab('stories')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'stories'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg'
                      : 'bg-white/40 text-neutral-700 hover:bg-white/50'
                  }`}
                >
                  Stories & Voice
                </button>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex justify-end mb-6">
              <div className="backdrop-blur-xl bg-white/30 border border-white/40 p-1 rounded-xl flex">
                <button
                  onClick={() => setTimeRange('7d')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    timeRange === '7d'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-800 hover:bg-white/40'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setTimeRange('30d')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    timeRange === '30d'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-800 hover:bg-white/40'
                  }`}
                >
                  30 Days
                </button>
                <button
                  onClick={() => setTimeRange('90d')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    timeRange === '90d'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-800 hover:bg-white/40'
                  }`}
                >
                  90 Days
                </button>
              </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Quick Stats */}
                {analytics && (
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
                    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 text-center hover:bg-white/30 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-neutral-800 mb-1">
                        {formatTime(analytics.stats.totalStudyTime)}
                      </div>
                      <div className="text-sm text-neutral-600">Total Study Time</div>
                    </div>

                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-neutral-800 mb-1">
                        {analytics.studySessions.length}
                      </div>
                      <div className="text-sm text-neutral-600">Study Sessions</div>
                    </div>

                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-neutral-800 mb-1">
                        {analytics.breakSessions.length}
                      </div>
                      <div className="text-sm text-neutral-600">Wellness Breaks</div>
                    </div>

                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-neutral-800 mb-1">
                        {analytics.stats.topicsStudied}
                      </div>
                      <div className="text-sm text-neutral-600">Topics Studied</div>
                    </div>

                   <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-neutral-800 mb-1">
                      {analytics.stats.voiceChats}
                    </div>
                      <div className="text-sm text-neutral-600">Voice Chats</div>
                </div>

                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-neutral-800 mb-1">
                      {analytics.stats.storiesGenerated}
                    </div>
                      <div className="text-sm text-neutral-600">Stories Created</div>
                  </div>
                </div>
                )}

                {/* AI Insights */}
                <div className="space-y-4">
                  <h3 className="text-xl font-serif font-bold text-neutral-800 mb-4 flex items-center gap-3">
                    <Lightbulb className="w-6 h-6 text-amber-500" />
                    AI Insights & Recommendations
                  </h3>

                  {isLoadingInsights ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                    </div>
                  ) : insights.length > 0 ? (
                    <div className="space-y-4">
                      {insights.map((insight, index) => (
                        <div 
                          key={index}
                          className={`backdrop-blur-xl border rounded-2xl p-6 shadow-lg transition-all duration-300 ${getInsightBackground(insight.type)}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                              {getInsightIcon(insight.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="text-lg font-serif font-bold text-neutral-800">{insight.title}</h4>
                                <button
                                  onClick={() => toggleInsight(`insight-${index}`)}
                                  className="p-1 rounded-lg hover:bg-white/30 transition-colors"
                                >
                                  {expandedInsight === `insight-${index}` ? (
                                    <ChevronUp className="w-5 h-5 text-neutral-600" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5 text-neutral-600" />
                                  )}
                                </button>
                              </div>
                              <p className="text-neutral-700 mt-1">{insight.message}</p>
                              
                              {expandedInsight === `insight-${index}` && (
                                <div className="mt-4 p-4 bg-white/20 rounded-xl">
                                  {getInsightIcon(insight.type)}
                                  <p className="text-neutral-700 font-medium mb-2">Recommended Action:</p>
                                  <p className="text-neutral-600">{insight.action}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl p-8 text-center">
                      <p className="text-neutral-600">
                        Continue using Mentora to receive personalized insights about your learning patterns.
                      </p>
                    </div>
                  )}
                </div>

                {/* Charts Section */}
                <div className="space-y-8">
                  <h3 className="text-xl font-serif font-bold text-neutral-800 mb-4 flex items-center gap-3">
                    <Activity className="w-6 h-6 text-purple-500" />
                    Study Analytics Heatmap
                  </h3>

                  {isChartsLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                    </div>
                  ) : (
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                   <AnalyticsHeatmap
                    data={chartData.activity_heatmap?.data}
                    isLoading={isChartsLoading}
                  />
                   </div>
                  )}
                </div>

                {/* Recent Activity */}
                {analytics && (analytics.studySessions.length > 0 || analytics.breakSessions.length > 0) && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-serif font-bold text-neutral-800 mb-4 flex items-center gap-3">
                      <Activity className="w-6 h-6 text-primary-600" />
                      Recent Activity
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Recent Study Sessions */}
                      {analytics.studySessions.slice(0, 3).map((session: any, index: number) => (
                        <div key={`study-${index}`} className="flex items-center gap-4 p-4 bg-white/20 rounded-xl">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-neutral-800">
                              {session.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} Session
                            </div>
                            <div className="text-sm text-neutral-600">
                              {session.duration ? formatTime(session.duration) : 'In progress'} • {session.metadata?.topic || 'General Study'}
                            </div>
                          </div>
                          <div className="text-sm text-neutral-500">
                            {formatDate(session.createdAt)}
                          </div>
                        </div>
                      ))}

                      {/* Recent Break Sessions */}
                      {analytics.breakSessions.slice(0, 2).map((session: any, index: number) => (
                        <div key={`break-${index}`} className="flex items-center gap-4 p-4 bg-white/20 rounded-xl">
                          <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Heart className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-neutral-800">
                              Wellness Break • Feeling {session.emotion}
                            </div>
                            <div className="text-sm text-neutral-600">
                              {session.duration ? formatTime(session.duration) : 'In progress'} • {session.activities?.filter((a: any) => a.completed).length || 0} activities completed
                            </div>
                          </div>
                          <div className="text-sm text-neutral-500">
                            {formatDate(session.createdAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mode Selection */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                  {/* Study Mode */}
                  <Link 
                    to="/study"
                    className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg glow-primary">
                        <Brain className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-neutral-800 mb-3">📚 Study Mode</h3>
                      <p className="text-neutral-600 mb-6 leading-relaxed">
                        AI-powered summaries, quizzes, and voice tutoring. Transform any content into personalized learning materials.
                      </p>
                      <div className="flex items-center justify-center gap-4 text-sm text-neutral-500">
                        <span>• PDF Summaries</span>
                        <span>• Quiz Generation</span>
                        <span>• Voice Chat</span>
                      </div>
                    </div>
                  </Link>

                  {/* Break Mode */}
                  <Link 
                    to="/break"
                    className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg glow-error">
                        <Heart className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-neutral-800 mb-3">🧘 Break Mode</h3>
                      <p className="text-neutral-600 mb-6 leading-relaxed">
                        Emotion-aware wellness activities. Let AI detect your mood and suggest personalized break activities.
                      </p>
                      <div className="flex items-center justify-center gap-4 text-sm text-neutral-500">
                        <span>• Emotion Detection</span>
                        <span>• Wellness Activities</span>
                        <span>• Mindfulness</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* Study Analytics Tab */}
            {activeTab === 'study' && (
              <div className="space-y-8">
                {/* Study Time Chart */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Clock className="w-6 h-6 text-blue-500" />
                      <h3 className="text-xl font-serif font-bold text-neutral-800">Study Time Analysis</h3>
                    </div>
                    <button
                      onClick={loadChartData}
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 text-neutral-600" />
                    </button>
                  </div>
                  
                  {isLoadingCharts ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                  ) : studyTimeChart ? (
                      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                      <AnalyticsCharts
                          chartData={chartData.study_time?.data}
                          chartType="line"
                          height={300}
                          isLoading={isChartsLoading}
                       />
                      <div className="text-center mt-4 text-sm text-neutral-600">
                        Study time vs. break time over the past {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}
                      </div>
                    </div>
                    
                  ) : (
                    <div className="text-center p-8">
                      <p className="text-neutral-600">No study time data available for this period.</p>
                    </div>
                  )}
                </div>

                {/* Quiz Performance */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Target className="w-6 h-6 text-green-500" />
                      <h3 className="text-xl font-serif font-bold text-neutral-800">Quiz Performance</h3>
                    </div>
                  </div>
                  
                  {isLoadingCharts ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                    </div>
                  ) : quizPerformanceChart ? (
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                       <AnalyticsCharts
                          chartData={chartData.quiz_performance?.data}
                          chartType="line"
                          height={300}
                          isLoading={isChartsLoading}
                       />
                      <div className="text-center mt-4 text-sm text-neutral-600">
                        Quiz scores and attempts over time
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <p className="text-neutral-600">No quiz data available for this period.</p>
                      <Link 
                        to="/study"
                        className="inline-flex items-center gap-2 mt-4 text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        <span>Take a quiz to track your progress</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Recent Study Sessions */}
                {analytics && analytics.studySessions.length > 0 && (
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <BookOpen className="w-6 h-6 text-cyan-600" />
                      <h3 className="text-xl font-serif font-bold text-neutral-800">Recent Study Sessions</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {analytics.studySessions.slice(0, 5).map((session: StudySession, index: number) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-white/20 rounded-xl">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            {session.type === 'quiz' && <Target className="w-5 h-5 text-white" />}
                            {session.type === 'text_summary' && <Type className="w-5 h-5 text-white" />}
                            {session.type === 'pdf_summary' && <FileText className="w-5 h-5 text-white" />}
                            {session.type === 'ocr' && <Camera className="w-5 h-5 text-white" />}
                            {session.type === 'youtube' && <Youtube className="w-5 h-5 text-white" />}
                            {session.type === 'voice_chat' && <Mic className="w-5 h-5 text-white" />}
                            {session.type === 'storytelling' && <BookOpen className="w-5 h-5 text-white" />}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-neutral-800">
                              {session.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </div>
                            <div className="text-sm text-neutral-600">
                              {session.duration ? formatTime(session.duration) : 'In progress'} • {session.metadata?.topic || 'General Study'}
                              {session.content?.score && ` • Score: ${session.content.score}%`}
                            </div>
                          </div>
                          <div className="text-sm text-neutral-500">
                            {formatDate(session.createdAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {analytics.studySessions.length > 5 && (
                      <div className="text-center mt-6">
                        <button className="text-blue-500 hover:text-blue-700 transition-colors text-sm font-medium">
                          View All Sessions
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Emotional Wellness Tab */}
            {activeTab === 'emotions' && (
              <div className="space-y-8">
                {/* Emotion Trends Chart */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Heart className="w-6 h-6 text-rose-500" />
                      <h3 className="text-xl font-serif font-bold text-neutral-800">Emotion Trends</h3>
                    </div>
                    <button
                      onClick={loadChartData}
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 text-neutral-600" />
                    </button>
                  </div>
                  
                  {isLoadingCharts ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                    </div>
                  ) : emotionTrendsChart ? (
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 shadow-xl">
                       <AnalyticsCharts
                          chartData={chartData.emotion_trends?.data}
                          chartType="line"
                          height={500}
                          isLoading={isChartsLoading}
                       />
                      <div className="text-center mt-4 text-sm text-neutral-600">
                        Your emotional patterns during study sessions
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <p className="text-neutral-600">No emotion data available for this period.</p>
                      <Link 
                        to="/break"
                        className="inline-flex items-center gap-2 mt-4 text-rose-600 hover:text-rose-700 transition-colors"
                      >
                        <span>Try emotion detection in Break Mode</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Emotion History */}
                {analytics && analytics.emotionHistory.length > 0 && (
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <Activity className="w-6 h-6 text-rose-500" />
                      <h3 className="text-xl font-serif font-bold text-neutral-800">Emotion History</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {analytics.emotionHistory.slice(0, 5).map((entry: EmotionEntry, index: number) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-white/20 rounded-xl">
                          <div className={`w-10 h-10 ${getEmotionColor(entry.emotion)} rounded-lg flex items-center justify-center`}>
                            <span className="text-lg">{getEmotionEmoji(entry.emotion)}</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-neutral-800 capitalize">
                              Feeling {entry.emotion}
                            </div>
                            <div className="text-sm text-neutral-600">
                              {entry.context === 'study' ? 'During study' : entry.context === 'break' ? 'During break' : 'General check-in'} • 
                              Confidence: {Math.round(entry.confidence * 100)}%
                            </div>
                          </div>
                          <div className="text-sm text-neutral-500">
                            {formatDate(entry.timestamp)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {analytics.emotionHistory.length > 5 && (
                      <div className="text-center mt-6">
                        <button className="text-rose-600 hover:text-rose-700 transition-colors text-sm font-medium">
                          View All Emotions
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Emotion Insights */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Lightbulb className="w-6 h-6 text-amber-500" />
                    <h3 className="text-xl font-serif font-bold text-neutral-800">Emotional Wellness Insights</h3>
                  </div>
                  
                  {analytics && analytics.emotionHistory.length > 0 ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-white/20 rounded-xl">
                        <h4 className="font-medium text-neutral-800 mb-2">Most Common Emotion</h4>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${getEmotionColor(analytics.stats.mostCommonEmotion)} rounded-lg flex items-center justify-center`}>
                            <span>{getEmotionEmoji(analytics.stats.mostCommonEmotion)}</span>
                          </div>
                          <span className="text-neutral-700 capitalize">{analytics.stats.mostCommonEmotion}</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-white/20 rounded-xl">
                        <h4 className="font-medium text-neutral-800 mb-2">Emotional Check-ins</h4>
                        <div className="flex items-center gap-2">
                          <Heart className="w-5 h-5 text-rose-500" />
                          <span className="text-neutral-700">{analytics.stats.emotionalCheckIns || 0} check-ins completed</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-white/20 rounded-xl">
                        <h4 className="font-medium text-neutral-800 mb-2">Wellness Recommendation</h4>
                        <p className="text-neutral-700">
                          {analytics.stats.mostCommonEmotion === 'stressed' && 
                            'Consider taking more frequent breaks and trying our guided breathing exercises.'}
                          {analytics.stats.mostCommonEmotion === 'tired' && 
                            'Try shorter, more focused study sessions with energizing breaks in between.'}
                          {analytics.stats.mostCommonEmotion === 'focused' && 
                            'You\'re doing great! Keep up the focused sessions and remember to take breaks.'}
                          {analytics.stats.mostCommonEmotion === 'happy' && 
                            'Your positive mood is perfect for learning. Consider tackling challenging topics now.'}
                          {analytics.stats.mostCommonEmotion === 'calm' && 
                            'Your calm state is ideal for deep learning. Consider meditation to maintain this state.'}
                          {analytics.stats.mostCommonEmotion === 'sad' && 
                            'Try our mood-lifting activities in Break Mode to help improve your emotional state.'}
                          {!['stressed', 'tired', 'focused', 'happy', 'calm', 'sad'].includes(analytics.stats.mostCommonEmotion) && 
                            'Check in with your emotions regularly to get personalized wellness recommendations.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <p className="text-neutral-600 mb-4">No emotional data available yet.</p>
                      <Link 
                        to="/break"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        <Heart className="w-5 h-5" />
                        <span>Try Emotion Detection</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Learning Progress Tab */}
            {activeTab === 'progress' && (
              <div className="space-y-8">
                {/* Learning Progress Overview */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    <h3 className="text-xl font-serif font-bold text-neutral-800">Learning Progress</h3>
                  </div>
                  
                  {analytics && analytics.learningProgress.length > 0 ? (
                    <div className="space-y-6">
                      {analytics.learningProgress.map((progress: LearningProgress, index: number) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-neutral-800 font-medium">{progress.topic}</span>
                              {progress.mastered && (
                                <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                  Mastered
                                </div>
                              )}
                            </div>
                            <span className="text-sm text-neutral-600">{progress.progress}%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2.5">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full"
                              style={{ width: `${progress.progress}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs text-neutral-500">
                            <span>Difficulty: {progress.difficulty}</span>
                            <span>Time spent: {formatTime(progress.timeSpent)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <p className="text-neutral-600 mb-4">No learning progress data available yet.</p>
                      <Link 
                        to="/study"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        <BookOpen className="w-5 h-5" />
                        <span>Start Learning</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Quiz Performance */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Award className="w-6 h-6 text-amber-500" />
                    <h3 className="text-xl font-serif font-bold text-neutral-800">Quiz Performance</h3>
                  </div>
                  
                  {analytics && analytics.studySessions.filter((s: StudySession) => s.type === 'quiz' && s.content?.score).length > 0 ? (
                    <div className="space-y-4">
                      {analytics.studySessions
                        .filter((s: StudySession) => s.type === 'quiz' && s.content?.score)
                        .slice(0, 5)
                        .map((session: StudySession, index: number) => (
                          <div key={index} className="p-4 bg-white/20 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-neutral-800">
                                {session.metadata?.topic || 'Quiz'}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className={`text-sm ${Number(session.content?.score) >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                                  {session.content?.score}%
                                </span>
                                {Number(session.content?.score) >= 80 && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                              </div>
                            </div>
                            <div className="w-full bg-white/30 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  Number(session.content?.score) >= 80 ? 'bg-green-500' : 
                                  Number(session.content?.score) >= 60 ? 'bg-amber-500' : 
                                  'bg-orange-500'
                                }`}
                                style={{ width: `${session.content?.score}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between mt-2 text-xs text-neutral-600">
                              <span>
                                {session.content?.correctAnswers || 0}/{session.content?.totalQuestions || 0} correct
                              </span>
                              <span>{formatDate(session.createdAt)}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <p className="text-neutral-600 mb-4">No quiz data available yet.</p>
                      <Link 
                        to="/study"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        <Target className="w-5 h-5" />
                        <span>Take a Quiz</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Learning Streak */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="w-6 h-6 text-amber-500" />
                    <h3 className="text-xl font-serif font-bold text-neutral-800">Learning Streak</h3>
                  </div>
                  
              
                  <div className="text-center p-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl font-bold text-white">{analytics?.stats?.streakDays || 0}</span>
                    </div>
                    <p className="text-xl font-medium text-neutral-800 mb-2">Day Streak</p>
                    <p className="text-neutral-600 mb-6">Keep learning daily to build your streak!</p>
                    
                    <Link 
                      to="/study"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <Zap className="w-5 h-5" />
                      <span>Continue Streak</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stories' && (
             <div className="space-y-8">
                   {/* Story Analytics */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-white" />
                   </div>
                   <h5 className="font-serif font-bold text-neutral-800 mb-2">Stories Created</h5>
                    <p className="text-2xl font-bold text-neutral-800">
                        {analytics?.stats.storiesGenerated || 0}
                    </p>
                     </div>
            
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                       <MessageCircle className="w-6 h-6 text-white" />
                     </div>
                     <h5 className="font-serif font-bold text-neutral-800 mb-2">Voice Conversations</h5>
                     <p className="text-2xl font-bold text-neutral-800">
                     {analytics?.stats.voiceChats || 0}
                      </p>
                     </div>
            
                   <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
                   <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Volume2 className="w-6 h-6 text-white" />
                   </div>
                   <h5 className="font-serif font-bold text-neutral-800 mb-2">Total Messages</h5>
                     <p className="text-2xl font-bold text-neutral-800">
                    {(analytics?.stats.voiceChats || 0) + (analytics?.stats.storiesGenerated || 0)}
                      </p>
                     </div>
                    </div>
            
                     {/* Recent Stories */}
                  {(analytics?.storySessions ?? []).length > 0 && (
                   <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                     <h4 className="text-xl font-serif font-bold text-neutral-800 mb-6 flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-pink-500" />
                        Recent Stories
                   </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {(analytics?.storySessions ?? []).slice(0, 6).map((story: any, index: number) => (
                    <div key={index} className="p-4 bg-white/20 rounded-xl border border-white/30">
                    <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{story.character.avatar}</span>
                  <div className="flex-1">
                <p className="font-medium text-neutral-800">{story.title}</p>
               <p className="text-sm text-neutral-600">by {story.character.name}</p>
              </div>
             </div>
             <div className="flex items-center gap-4 text-sm text-neutral-600 mb-2">
            <span className="flex items-center gap-1">
               <BookOpen className="w-3 h-3" />
                 {story.topic}
                  </span>
             <span className="flex items-center gap-1">
               <Clock className="w-3 h-3" />
               {Math.floor((story.actualDuration || 0) / 60)}m
                  </span>
              </div>
               <div className="flex gap-2">
                {story.hasAudio && (
                  <span className="bg-green-100/60 text-green-700 px-2 py-1 rounded-lg text-xs">Audio</span>
                  )}
               {story.hasVideo && (
                 <span className="bg-blue-100/60 text-blue-700 px-2 py-1 rounded-lg text-xs">Video</span>
                 )}
                   {story.completed && (
                     <span className="bg-purple-100/60 text-purple-700 px-2 py-1 rounded-lg text-xs">Completed</span>
                    )}
                     {story.rating && (
                       <div className="flex items-center gap-1">
                        {[...Array(story.rating)].map((_: any, i: number) => (
                         <Star key={i} className="w-3 h-3 text-amber-400 fill-current" />
                                 ))}
                               </div>
                             )}
                           </div>
                        </div>
                       ))}
                     </div>
                   </div>
                 )}
              
                {/* Voice Chat Summary */}
                     {(analytics?.voiceChats ?? []).length > 0 && (
                       <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                      <h4 className="text-xl font-serif font-bold text-neutral-800 mb-6 flex items-center gap-3">
                        <MessageCircle className="w-5 h-5 text-indigo-500" />
                           Voice Chat Summary
                       </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(analytics?.voiceChats ?? []).slice(0, 4).map((chat: any, index: number) => (
                  <div key={index} className="p-4 bg-white/20 rounded-xl border border-white/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                           <Mic className="w-4 h-4 text-indigo-600" />
                             <span className="font-medium text-neutral-800">
                               {chat.summary || `Chat ${index + 1}`}
                                </span>
                               </div>
                             <span className="text-sm text-neutral-600">
                               {chat.totalMessages} msgs
                              </span>
                            </div>
                    <div className="flex items-center gap-4 text-sm text-neutral-600 mb-2">
                        <span className="flex items-center gap-1">
                           <Clock className="w-3 h-3" />
                         {Math.floor((chat.duration || 0) / 60)}m
                       </span>
                          <span>{formatTime(chat.createdAt)}</span>
                    </div>
                            {chat.topics && chat.topics.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                           {chat.topics.slice(0, 3).map((topic: string, i: number) => (
                            <span key={i} className="bg-indigo-100/60 text-indigo-700 px-2 py-1 rounded-lg text-xs">
                            {topic}
                          </span>
                            ))}
                          </div>
                        )}
                    </div>
                   ))}
                  </div>
                </div>
               )}
                {/* Additional Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Voice Assistant */}
                     <Link to="/voice" className="group">
                        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105">
                          <div className="flex items-center gap-4 mb-4">
                           <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Mic className="w-8 h-8 text-white" />
                            </div>
                             <div>
                               <h3 className="text-xl font-serif font-bold text-neutral-800">🎙️ Voice Assistant</h3>
                              <p className="text-neutral-600">Chat with AI using your voice</p>
                           </div>
                             </div>
                              <div className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 transition-colors">
                              <span className="font-medium">Start Voice Chat</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                             </div>
                            </div>
                          </Link>
                       
                        {/* Storytelling */}
                          <Link to="/storytelling" className="group">
                           <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105">
                             <div className="flex items-center gap-4 mb-4">
                               <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <BookOpen className="w-8 h-8 text-white" />
                                   </div>
                                   <div>
                              <h3 className="text-xl font-serif font-bold text-neutral-800">📖 Story Mode</h3>
                                  <p className="text-neutral-600">Learn through magical stories</p>
                                  </div>
                              </div>
                                 <div className="flex items-center gap-2 text-purple-600 group-hover:text-purple-700 transition-colors">
                                   <span className="font-medium">Create Stories</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                 </div>
                                </div>
                              </Link>
                            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-xl">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
         </div>
            )}
          </div>
        </main>

        <VoicePanel />
      </div>
    </div>
  );
};

export default StudentDashboard;