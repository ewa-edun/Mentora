import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Heart, BookOpen, Mic, User, LogOut, Sparkles, Clock, Target, Award, BarChart3, Activity} from 'lucide-react';
import {  getCurrentUser,  getUserProfile,  getUserAnalytics, logoutUser, UserProfile } from '../services/firebase';
import VoicePanel from '../components/VoicePanel';

const StudentDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
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
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
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
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center glow-primary animate-float">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Mentora
                </h1>
                <p className="text-sm text-neutral-600">Your AI Study Companion</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                to="/premium"
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                ✨ Upgrade to Mentora+
              </Link>
              
              <Link 
                to="/profile"
                className="p-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-neutral-700 hover:text-neutral-800 hover:bg-white/20 transition-all duration-300"
              >
                <User className="w-5 h-5" />
              </Link>
              
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
                {getGreeting()}, {getUserDisplayName()}! 👋
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                Ready to continue your learning journey? Choose your mode and let's make today productive and mindful.
              </p>
            </div>

            {/* Quick Stats */}
            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300">
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
              </div>
            )}

            {/* Mode Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Study Mode */}
              <Link 
                to="/study"
                className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg glow-primary">
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

            {/* Additional Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Voice Assistant */}
              <Link 
                to="/voice"
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-serif font-bold text-neutral-800 mb-2">🎙️ Voice Assistant</h4>
                  <p className="text-sm text-neutral-600">Chat with AI using natural voice conversations</p>
                </div>
              </Link>

              {/* Storytelling */}
              <Link 
                to="/storytelling"
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-serif font-bold text-neutral-800 mb-2">📖 Story Mode</h4>
                  <p className="text-sm text-neutral-600">Learn through engaging AI-generated stories</p>
                </div>
              </Link>

              {/* Analytics */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-white/30 transition-all duration-300 group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-serif font-bold text-neutral-800 mb-2">📊 Analytics</h4>
                  <p className="text-sm text-neutral-600">Track your learning progress and patterns</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            {analytics && (analytics.studySessions.length > 0 || analytics.breakSessions.length > 0) && (
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
                <h3 className="text-xl font-serif font-bold text-neutral-800 mb-6 flex items-center gap-3">
                  <Activity className="w-6 h-6 text-primary-600" />
                  Recent Activity
                </h3>
                
                <div className="space-y-4">
                  {/* Recent Study Sessions */}
                  {analytics.studySessions.slice(0, 3).map((session: any, index: number) => (
                    <div key={`study-${index}`} className="flex items-center gap-4 p-4 bg-white/20 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
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
                        {session.createdAt?.toDate?.()?.toLocaleDateString() || 'Recent'}
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
                        {session.createdAt?.toDate?.()?.toLocaleDateString() || 'Recent'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-xl">
                <p className="text-sm text-red-700">{error}</p>
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