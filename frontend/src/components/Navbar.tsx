import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Coffee, UserCircle, LogOut, LayoutDashboard, ChevronDown, Sparkles, Crown } from 'lucide-react';
import { getCurrentUser, logoutUser } from '../services/firebase';

interface NavbarProps {
  currentMode: 'study' | 'break';
  onToggleMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentMode, onToggleMode }) => {
  interface User {
    displayName?: string;
    email?: string;
  }
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const firebaseUser = getCurrentUser();
    if (firebaseUser) {
      setUser({
        displayName: firebaseUser.displayName ?? undefined,
        email: firebaseUser.email ?? undefined,
      });
    } else {
      setUser(null);
    }
  }, []);

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

  // Logic for mode toggle button
  const handleModeButton = () => {
    if (currentMode === 'study') {
      navigate('/break');
    } else {
      navigate('/study');
    }
    onToggleMode();
  };

  return (
    <nav className="backdrop-blur-xl top-0 z-10 glass-card border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Name */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-lavender-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-pulse-soft"></div>
            </div>
            <Link to="/home" className="text-neutral-800 hover:text-neutral-900 transition-colors">
              <h1 className="text-3xl font-serif font-bold text-gradient">
                Mentora
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
              <button
                onClick={handleModeButton}
                className={`relative flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  currentMode === 'study'
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg'
                    : 'bg-gradient-to-r from-lavender-500 to-indigo-600 text-white shadow-lg glow-lavender'
                }`}
              >
                {currentMode === 'study' ? (
                  <>
                    <Coffee className="w-4 h-4" />
                    <span>Break</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <span>Study</span>
                  </>
                )}
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 bg-white/50 backdrop-blur-sm border border-white/70 rounded-xl px-4 py-2 hover:bg-white/30 hover:border-white/50 transition-all duration-300 group"
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
                <div className="absolute right-0 mt-2 w-64 backdrop-blur-xl bg-white/100 border border-white/90 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
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
                      <UserCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>View Profile</span>
                    </Link>
                    <Link
                      to="/student-dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-neutral-700 hover:bg-white/20 hover:text-neutral-800 transition-all duration-300 group"
                    >
                      <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/premium');
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-amber-700 bg-gradient-to-r from-amber-50 to-orange-50 hover:bg-amber-100 transition-all duration-300 group font-medium"
                    >
                      <Crown className="w-4 h-4" />
                      <span>Upgrade</span>
                    </button>
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
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;