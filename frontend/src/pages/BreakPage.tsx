import React from 'react';
//import { Link } from 'react-router-dom';
import { Coffee, Sparkles } from 'lucide-react';
import BreakMode from '../components/BreakMode';
import VoicePanel from '../components/VoicePanel';
import Navbar from '../components/Navbar';


const BreakPage: React.FC = () => {
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
        <div>
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 z-50 relative">
          <Navbar currentMode="break" onToggleMode={() => {}} /> 
        </header>
        </div>

        {/* Main Content */}
        <main className="px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto glow-error animate-float">
                  <Coffee className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse-slow">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <h2 className="text-6xl font-serif font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Break Mode
              </h2>
              <p className="text-neutral-600 text-lg max-w-3xl mx-auto leading-relaxed">
                Take a mindful pause and let AI understand your emotional state.  Let's check in with how you're feeling and find the perfect way to recharge. Get personalized wellness activities designed just for how you're feeling right now.
              </p>
            </div>
            
            <BreakMode />
          </div>
        </main>
        
        <VoicePanel />
      </div>
    </div>
  );
};

export default BreakPage;