import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Sparkles, Brain, Mic } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-secondary-200/30 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-primary-100/40 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239d75ff%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl mt-8 mx-auto text-center">
          {/* Main error content */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 mb-8 shadow-2xl animate-fadeIn">
            {/* Floating icon */}
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto glow-primary animate-float">
                <Brain className="w-12 h-12 text-white group-hover:-translate-x-1 transition-transform" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse-slow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Error code with gradient */}
            <div className="mb-6">
             <h1 className="text-8xl bg-gradient-to-r from-purple-500 to-indigo-500 font-serif font-bold text-gradient mb-2">404</h1>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full"></div>
            </div>

            {/* Error message */}
            <h2 className="text-3xl font-serif font-semibold text-neutral-800 mb-4">
              Oops! This page went on a study break
            </h2>
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed max-w-lg mx-auto">
              Don't worry, even the best students sometimes lose their way. Let's get you back to learning with your AI study companion.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">

              <button 
                onClick={() => window.history.back()}
                className="bg-gradient-to-r from-purple-300 to-indigo-300 backdrop-blur-sm border border-white/30 text-neutral-700 font-medium py-3 px-6 rounded-xl hover:bg-white/30 hover:border-white/50 transform hover:scale-105 focus:ring-4 focus:ring-primary-200 focus:outline-none transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Go Back</span>
              </button>

              <Link 
                to="/home" 
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-neutral-700 font-medium py-3 px-6 rounded-xl hover:bg-white/30 hover:border-white/50 transform hover:scale-105 focus:ring-4 focus:ring-primary-200 focus:outline-none transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group"
              >
                <Home className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Home</span>
              </Link>
            </div>

            {/* Voice hint */}
            <div className="flex items-center justify-center gap-2 text-sm text-primary-600 bg-gradient-to-r from-cyan-100 to-blue-100 backdrop-blur-sm rounded-full px-4 py-2 mx-auto w-fit border border-primary-200/50">
              <Mic className="w-4 h-4" />
              <span>Try saying "Take me home" to your voice assistant</span>
            </div>
          </div>

          {/* Quick navigation */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 mb-5 shadow-xl animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Search className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-serif font-semibold text-neutral-800">Looking for something specific?</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link 
                to="/dashboard" 
                className="group p-4 rounded-xl bg-white/50 hover:bg-white/80 border border-white/60 hover:border-primary-200 transition-all duration-300 hover:scale-105"
              >
                <div className="text-2xl mb-2">📚</div>
                <div className="text-sm font-medium text-neutral-700 group-hover:text-primary-600 transition-colors">Study Mode</div>
              </Link>
              
              <Link 
                to="/dashboard" 
                className="group p-4 rounded-xl bg-white/50 hover:bg-white/80 border border-white/60 hover:border-primary-200 transition-all duration-300 hover:scale-105"
              >
                <div className="text-2xl mb-2">🧘</div>
                <div className="text-sm font-medium text-neutral-700 group-hover:text-primary-600 transition-colors">Break Mode</div>
              </Link>
              
              <Link 
                to="/dashboard" 
                className="group p-4 rounded-xl bg-white/50 hover:bg-white/80 border border-white/60 hover:border-primary-200 transition-all duration-300 hover:scale-105"
              >
                <div className="text-2xl mb-2">🎙️</div>
                <div className="text-sm font-medium text-neutral-700 group-hover:text-primary-600 transition-colors">Voice Chat</div>
              </Link>
              
              <Link 
                to="/dashboard" 
                className="group p-4 rounded-xl bg-white/50 hover:bg-white/80 border border-white/60 hover:border-primary-200 transition-all duration-300 hover:scale-105"
              >
                <div className="text-2xl mb-2">📖</div>
                <div className="text-sm font-medium text-neutral-700 group-hover:text-primary-600 transition-colors">Stories</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;