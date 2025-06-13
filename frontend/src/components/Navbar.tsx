import React from 'react';
import { BookOpen, Coffee, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentMode: 'study' | 'break';
  onToggleMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentMode, onToggleMode }) => {
  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-white/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
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
          
          <div className="flex items-center space-x-4">
            <div className="glass-card rounded-full p-1">
              <button
                onClick={onToggleMode}
                className={`relative flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  currentMode === 'study'
                    ? 'bg-gradient-to-r from-lavender-500 to-indigo-600 text-white shadow-lg glow-lavender'
                    : 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg'
                }`}
              >
                {currentMode === 'study' ? (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <span>Study</span>
                  </>
                ) : (
                  <>
                    <Coffee className="w-4 h-4" />
                    <span>Break</span>
                  </>
                )}
                
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;