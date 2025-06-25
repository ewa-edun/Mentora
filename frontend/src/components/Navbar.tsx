import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Coffee, UserCircle, LogOut, LayoutDashboard, ChevronDown, Sparkles, Menu, X, Crown } from 'lucide-react';
import { getCurrentUser, logoutUser } from '../services/firebase';

interface NavbarProps {
  currentMode: 'study' | 'break';
  onToggleMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentMode, onToggleMode }) => {
  interface User {
    displayName?: string;
    email?: string;
    // Add other properties as needed
  }
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      setMobileMenuOpen(false);
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
    <nav className="sticky backdrop-blur-xl top-0 z-10 glass-card border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4 container">
        <div className="flex items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Mode Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="glass-card rounded-full p-1">
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
            </div>
            <button
              onClick={() => navigate('/premium')}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade</span>
            </button>
          </div>

          {/* Desktop User Menu */}
          <div className={`hidden md:block relative transition-colors duration-200 ${showUserMenu ? 'bg-white/90 shadow-lg rounded-xl' : 'bg-white/70 rounded-xl'}`}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center gap-3 px-4 py-2 border border-white/30 transition-all duration-300 group rounded-xl ${
                showUserMenu
                  ? 'bg-white/90'
                  : 'bg-white/70 hover:bg-white/80'
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-lavender-500 to-indigo-400 rounded-2xl flex items-center justify-center">
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
              <div className="absolute right-0 mt-2 w-64 bg-white/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn z-50">
                <div className="p-4 border-b border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-lavender-500 to-indigo-400 rounded-xl flex items-center justify-center">
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
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-neutral-700 transition-all duration-300 group hover:bg-indigo-100/80"
                  >
                    <UserCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>View Profile</span>
                  </Link>

                  <Link
                    to="/student-dashboard"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-neutral-700 transition-all duration-300 group hover:bg-indigo-100/80"
                  >
                    <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Dashboard</span>
                  </Link>

                  <div className="border-t border-white/20 my-2"></div>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-red-600 hover:bg-red-100/40 hover:text-red-700 transition-all duration-300 group"
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

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-lg bg-white/20 border border-white/30 hover:bg-white/30 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
        {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-xl">
          {/* Top bar with only X button */}
          <div className="absolute top-0 left-0 w-full flex justify-end p-4 bg-white/95 z-[110]">
            <button
              className="p-2 rounded-lg hover:bg-indigo-100 transition"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
          {/* Centered menu */}
          <div className="flex flex-col gap-4 items-center w-full max-w-md h-full bg-white/95 rounded-2xl shadow-2xl p-8 mt-16 z-[101]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-lavender-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-serif font-bold text-gradient">
                Mentora
              </span>
            </div>
            <button
              onClick={() => {
                handleModeButton();
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 w-full justify-center ${
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
            </button>
             <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/premium');
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 w-full justify-center"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade</span>
            </button>
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium w-full justify-center bg-indigo-100/80 hover:bg-indigo-200/90 text-neutral-800 transition-all duration-300"
            >
              <UserCircle className="w-5 h-5 text-primary-600" />
              <span>Profile</span>
            </Link>
               <Link
              to="/student-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium w-full justify-center bg-indigo-100/80 hover:bg-indigo-200/90 text-neutral-800 transition-all duration-300"
            >
              <LayoutDashboard className="w-5 h-5 text-primary-600" />
              <span>Dashboard</span>
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-3 px-4 py-2 rounded-lg w-full justify-center text-red-600 hover:bg-red-100/40 hover:text-red-700 transition-all duration-300"
            >
              {isLoggingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
                  <span>Signing out...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

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