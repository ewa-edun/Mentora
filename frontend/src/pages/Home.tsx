import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Heart, BookOpen, Mic, Sparkles, ArrowRight, User, LogOut, Settings, ChevronDown, Crown, FileText, Camera, Youtube} from 'lucide-react';
import { getCurrentUser, logoutUser } from '../services/firebase';
import VoicePanel from '../components/VoicePanel';

const StudentDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setShowUserMenu(false);
    }
  };

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  const quickActions = [
    {
      title: "Text Summarizer",
      description: "Paste any text for instant AI summary",
      icon: <FileText className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-500",
      path: "/study"
    },
    {
      title: "PDF Upload",
      description: "Upload documents for smart summaries",
      icon: <FileText className="w-6 h-6" />,
      color: "from-red-500 to-pink-500",
      path: "/study"
    },
    {
      title: "Handwritten Notes",
      description: "Scan and digitize your notes",
      icon: <Camera className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      path: "/study"
    },
    {
      title: "YouTube Summarizer",
      description: "Extract insights from educational videos",
      icon: <Youtube className="w-6 h-6" />,
      color: "from-red-500 to-orange-500",
      path: "/study"
    }
  ];

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
        {/* Navigation */}
        <nav className="backdrop-blur-xl bg-white/10 border-b border-white/20 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
             <div className="flex items-center space-x-3">
               <div className="relative">
                 <div className="w-10 h-10 bg-gradient-to-br from-lavender-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                 <Sparkles className="w-5 h-5 text-white" />
                 </div>
                 <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-pulse-soft"></div>
                </div>
               <h1 className="text-3xl font-serif font-bold text-gradient">
                    Mentora
               </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Premium Button */}
              <Link
                to="/premium"
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade</span>
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 hover:bg-white/30 hover:border-white/50 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-lavender-500 to-indigo-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-medium text-sm">{getUserInitials()}</span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-neutral-800">{getUserDisplayName()}</p>
                    <p className="text-xs text-neutral-600">{user?.email}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-neutral-600 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
                    <div className="p-4 border-b border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-indigo-400 rounded-xl flex items-center justify-center">
                          <span className="text-white font-medium">{getUserInitials()}</span>
                        </div>
                        <div>
                          <p className="font-medium text-neutral-800">{getUserDisplayName()}</p>
                          <p className="text-sm text-neutral-600">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">

                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-neutral-700 hover:bg-white/20 hover:text-neutral-800 transition-all duration-300 group"
                      >
                        <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>View Profile</span>
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-neutral-700 hover:bg-white/20 hover:text-neutral-800 transition-all duration-300 group"
                      >
                        <Settings className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Settings</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-red-600 hover:bg-red-100/20 hover:text-red-700 transition-all duration-300 group"
                      >
                        {isLoggingOut ? (
                          <>
                            <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
                            <span>Signing out...</span>
                          </>
                        ) : (
                          <>
                            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>Sign Out</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Click outside to close menu */}
          {showUserMenu && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowUserMenu(false)}
            />
          )}
        </nav>

        {/* Main Content */}
        <main className="px-6 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-16">
              
              <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-6">
                Hello, {getUserDisplayName()}! 👋
              </h1>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                Ready to continue your learning journey? Choose your mode below and let's make today amazing.
              </p>
            </div>

            {/* Main Mode Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Study Mode Card */}
              <Link to="/study" className="group">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2 group-hover:shadow-3xl">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg glow-primary">
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-neutral-800 mb-4">📚 Study Mode</h2>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Transform your learning materials with AI-powered insights, summaries, and personalized quizzes
                    </p>
                    <div className="flex items-center justify-center gap-2 text-purple-600 group-hover:text-purple-700 transition-colors">
                      <span className="font-medium">Enter Study Mode</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Break Mode Card */}
              <Link to="/break" className="group">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2 group-hover:shadow-3xl">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg glow-error">
                      <Heart className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-neutral-800 mb-4">🧘 Break Mode</h2>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      Take a mindful pause with emotion-aware wellness activities designed for your current mood
                    </p>
                    <div className="flex items-center justify-center gap-2 text-rose-600 group-hover:text-rose-700 transition-colors">
                      <span className="font-medium">Enter Break Mode</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="mb-16">
              <h3 className="text-2xl font-serif font-bold text-neutral-800 mb-8 text-center">Quick Study Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.path} className="group">
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 group">
                      <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-white`}>
                        {action.icon}
                      </div>
                      <h4 className="font-serif font-bold text-neutral-800 mb-2">{action.title}</h4>
                      <p className="text-sm text-neutral-600">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

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
          </div>
        </main>
        
        <VoicePanel />
      </div>
    </div>
  );
};

export default StudentDashboard;