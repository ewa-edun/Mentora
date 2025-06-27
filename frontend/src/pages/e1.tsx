import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Brain, 
  Sparkles, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  Heart, 
  BookOpen,
  Trophy,
  Calendar,
  Activity,
  Zap,
  Star,
  Users,
  Award,
  Lightbulb,
  ChevronRight,
  RefreshCw,
  Download,
  Share2,
  MessageCircle,
  Mic,
  Volume2
} from 'lucide-react';
import { 
  getCurrentUser, 
  getUserAnalytics 
} from '../services/firebase';
import { 
  getChartData, 
  getUserInsights 
} from '../services/api';
import AnalyticsCharts from '../components/analytics/AnalyticsCharts';
import ActivityHeatmap from '../components/analytics/ActivityHeatmap';

const StudentDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'study' | 'wellness' | 'stories'>('overview');
  const [chartData, setChartData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isChartsLoading, setIsChartsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
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

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    if (user) {
      loadCharts(user.uid, range);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Student';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'progress': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'wellness': return <Heart className="w-5 h-5 text-rose-500" />;
      case 'strength': return <Star className="w-5 h-5 text-purple-500" />;
      case 'habit': return <Target className="w-5 h-5 text-blue-500" />;
      case 'recommendation': return <Lightbulb className="w-5 h-5 text-orange-500" />;
      default: return <Sparkles className="w-5 h-5 text-primary-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'from-amber-50 to-yellow-50 border-amber-200';
      case 'progress': return 'from-green-50 to-emerald-50 border-green-200';
      case 'wellness': return 'from-rose-50 to-pink-50 border-rose-200';
      case 'strength': return 'from-purple-50 to-violet-50 border-purple-200';
      case 'habit': return 'from-blue-50 to-cyan-50 border-blue-200';
      case 'recommendation': return 'from-orange-50 to-amber-50 border-orange-200';
      default: return 'from-primary-50 to-secondary-50 border-primary-200';
    }
  };

  const formatChatTime = (timestamp: any) => {
    if (!timestamp) return '';
    
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    }  else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      return '';
    }
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your analytics...</p>
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
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <ArrowLeft className="w-5 h-5 text-primary-600 group-hover:-translate-x-1 transition-transform" />
              <span className="text-primary-600 font-medium">Back to Dashboard</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-6 py-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center glow-primary animate-float">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-serif font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    Analytics Dashboard
                  </h1>
                  <p className="text-sm text-neutral-600">Your learning insights</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => user && loadDashboardData(user.uid)}
                className="p-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-neutral-700 hover:text-neutral-800 hover:bg-white/20 transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto glow-primary animate-float">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse-slow">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
                Welcome back, {getUserDisplayName()}! 📊
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                Here's your personalized learning analytics dashboard with insights into your study patterns, emotional wellness, and progress.
              </p>
            </div>

            {/* Quick Stats */}
            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-12">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Total Study Time</p>
                      <p className="text-2xl font-bold text-neutral-800">
                        {formatTime(analytics.stats.totalStudyTime)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Study Sessions</p>
                      <p className="text-2xl font-bold text-neutral-800">
                        {analytics.studySessions.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Wellness Breaks</p>
                      <p className="text-2xl font-bold text-neutral-800">
                        {analytics.breakSessions.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Topics Studied</p>
                      <p className="text-2xl font-bold text-neutral-800">
                        {analytics.stats.topicsStudied}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Voice Chats</p>
                      <p className="text-2xl font-bold text-neutral-800">
                        {analytics.stats.voiceChats}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Stories Created</p>
                      <p className="text-2xl font-bold text-neutral-800">
                        {analytics.stats.storiesGenerated}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Insights */}
            {insights.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-serif font-bold text-neutral-800 mb-6 flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-amber-500" />
                  AI Insights & Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {insights.slice(0, 6).map((insight, index) => (
                    <div
                      key={index}
                      className={`backdrop-blur-xl bg-gradient-to-r ${getInsightColor(insight.type)} border rounded-2xl p-6 hover:scale-105 transition-all duration-300`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {getInsightIcon(insight.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-serif font-bold text-neutral-800 mb-2">
                            {insight.title}
                          </h4>
                          <p className="text-sm text-neutral-700 mb-3 leading-relaxed">
                            {insight.message}
                          </p>
                          <p className="text-xs text-neutral-600 italic">
                            {insight.action}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                      : 'text-neutral-600 hover:text-neutral-800 hover:bg-white/20'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('study')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'study'
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                      : 'text-neutral-600 hover:text-neutral-800 hover:bg-white/20'
                  }`}
                >
                  Study Analytics
                </button>
                <button
                  onClick={() => setActiveTab('wellness')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'wellness'
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                      : 'text-neutral-600 hover:text-neutral-800 hover:bg-white/20'
                  }`}
                >
                  Emotional Wellness
                </button>
                <button
                  onClick={() => setActiveTab('stories')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'stories'
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                      : 'text-neutral-600 hover:text-neutral-800 hover:bg-white/20'
                  }`}
                >
                  Stories & Voice
                </button>
              </div>

              {/* Time Range Selector */}
              <div className="flex backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-2">
                {['7d', '30d', '90d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => handleTimeRangeChange(range)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                      timeRange === range
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                        : 'text-neutral-600 hover:text-neutral-800 hover:bg-white/20'
                    }`}
                  >
                    {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Study Time Chart */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                  <h4 className="text-xl font-serif font-bold text-neutral-800 mb-6 flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Study Time Trends
                  </h4>
                  <AnalyticsCharts
                    chartData={chartData.study_time?.data}
                    chartType="line"
                    height={300}
                    isLoading={isChartsLoading}
                  />
                </div>

                {/* Emotion Trends Chart */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                  <h4 className="text-xl font-serif font-bold text-neutral-800 mb-6 flex items-center gap-3">
                    <Heart className="w-5 h-5 text-rose-500" />
                    Emotion Patterns
                  </h4>
                  <AnalyticsCharts
                    chartData={chartData.emotion_trends?.data}
                    chartType="line"
                    height={300}
                    isLoading={isChartsLoading}
                  />
                </div>
              </div>
            )}

            {activeTab === 'study' && (
              <div className="space-y-8">
                {/* Quiz Performance Chart */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                  <h4 className="text-xl font-serif font-bold text-neutral-800 mb-6 flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Quiz Performance & Attempts
                  </h4>
                  <AnalyticsCharts
                    chartData={chartData.quiz_performance?.data}
                    chartType="line"
                    height={400}
                    isLoading={isChartsLoading}
                  />
                </div>

                {/* Activity Heatmap */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                  <h4 className="text-xl font-serif font-bold text-neutral-800 mb-6 flex items-center gap-3">
                    <Activity className="w-5 h-5 text-purple-500" />
                    Study Activity Heatmap
                  </h4>
                  <ActivityHeatmap
                    data={chartData.activity_heatmap?.data}
                    isLoading={isChartsLoading}
                  />
                </div>

                {/* Voice Chat Analytics */}
                {analytics && analytics.voiceChats.length > 0 && (
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                    <h4 className="text-xl font-serif font-bold text-neutral-800 mb-6 flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-indigo-500" />
                      Recent Voice Conversations
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analytics.voiceChats.slice(0, 6).map((chat: any, index: number) => (
                        <div key={index} className="p-4 bg-white/20 rounded-xl border border-white/30">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Mic className="w-4 h-4 text-indigo-600" />
                              <span className="font-medium text-neutral-800">
                                {chat.summary || 'Voice Chat'}
                              </span>
                            </div>
                            <span className="text-sm text-neutral-600">
                              {chat.totalMessages} messages
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-neutral-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {Math.floor((chat.duration || 0) / 60)}m
                            </span>
                            <span>{formatChatTime(chat.createdAt)}</span>
                          </div>
                          {chat.topics && chat.topics.length > 0 && (
                            <div className="flex gap-2 mt-2">
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

                {/* Learning Progress */}
                {analytics && analytics.learningProgress.length > 0 && (
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                    <h4 className="text-xl font-serif font-bold text-neutral-800 mb-6 flex items-center gap-3">
                      <Target className="w-5 h-5 text-green-500" />
                      Topic Mastery Progress
                    </h4>
                    <div className="space-y-4">
                      {analytics.learningProgress.slice(0, 8).map((progress: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-neutral-700">{progress.topic}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-neutral-600">{progress.progress}%</span>
                              {progress.mastered && <Star className="w-4 h-4 text-amber-500" />}
                            </div>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${progress.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wellness' && (
              <div className="space-y-8">
                {/* Emotion Distribution */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                  <h4 className="text-xl font-serif font-bold text-neutral-800 mb-6 flex items-center gap-3">
                    <Heart className="w-5 h-5 text-rose-500" />
                    Emotional Wellness Trends
                  </h4>
                  <AnalyticsCharts
                    chartData={chartData.emotion_trends?.data}
                    chartType="line"
                    height={400}
                    isLoading={isChartsLoading}
                  />
                </div>

                {/* Recent Emotions */}
                {analytics && analytics.emotionHistory.length > 0 && (
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                    <h4 className="text-xl font-serif font-bold text-neutral-800 mb-6 flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      Recent Emotional Check-ins
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {analytics.emotionHistory.slice(0, 6).map((emotion: any, index: number) => (
                        <div key={index} className="p-4 bg-white/20 rounded-xl border border-white/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-lg capitalize font-medium text-neutral-800">
                              {emotion.emotion}
                            </span>
                            <span className="text-sm text-neutral-600">
                              {Math.round(emotion.confidence * 100)}%
                            </span>
                          </div>
                          <p className="text-sm text-neutral-600">
                            {emotion.context} • {new Date(emotion.timestamp?.toDate?.() || emotion.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wellness Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <h5 className="font-serif font-bold text-neutral-800 mb-2">Break Time</h5>
                    <p className="text-2xl font-bold text-neutral-800">
                      {formatTime(analytics?.stats.totalBreakTime || 0)}
                    </p>
                  </div>

                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <h5 className="font-serif font-bold text-neutral-800 mb-2">Most Common Emotion</h5>
                    <p className="text-lg font-bold text-neutral-800 capitalize">
                      {analytics?.stats.mostCommonEmotion || 'N/A'}
                    </p>
                  </div>

                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h5 className="font-serif font-bold text-neutral-800 mb-2">Check-ins</h5>
                    <p className="text-2xl font-bold text-neutral-800">
                      {analytics?.emotionHistory.length || 0}
                    </p>
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
                      {analytics?.voiceChats.reduce((total: number, chat: any) => total + (chat.totalMessages || 0), 0) || 0}
                    </p>
                  </div>
                </div>

                {/* Recent Stories */}
                {analytics && analytics.storySessions.length > 0 && (
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                    <h4 className="text-xl font-serif font-bold text-neutral-800 mb-6 flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-pink-500" />
                      Recent Stories
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analytics.storySessions.slice(0, 6).map((story: any, index: number) => (
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
                {analytics && analytics.voiceChats.length > 0 && (
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                    <h4 className="text-xl font-serif font-bold text-neutral-800 mb-6 flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-indigo-500" />
                      Voice Chat Summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analytics.voiceChats.slice(0, 4).map((chat: any, index: number) => (
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
                            <span>{formatChatTime(chat.createdAt)}</span>
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
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;