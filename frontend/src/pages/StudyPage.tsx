import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Sparkles } from 'lucide-react';
import PDFSummarizer from '../components/study/PDFSummarizer';
import HandwrittenNotes from '../components/study/HandwrittenNotes';
import TextSummarizer from '../components/study/TextSummarizer';
import YouTubeSummarizer from '../components/study/YouTubeSummarizer';
import QuizGenerator from '../components/study/QuizGenerator';
import VoicePanel from '../components/VoicePanel';
import Navbar from '../components/Navbar';
import { BookOpen } from 'lucide-react';

const StudyPage: React.FC = () => {
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
          <header className="backdrop-blur-xl bg-white/10 border-b border-white/20">    
            <Navbar currentMode="study" onToggleMode={() => {}}/>         
        </header>
        </div>

        {/* Main Content */}
        <main className="px-6 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto glow-primary animate-float">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse-slow">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <h2 className="text-6xl font-serif font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Study Mode
              </h2>
              <p className="text-neutral-600 text-lg max-w-3xl mx-auto leading-relaxed">
                Transform your learning materials with AI-powered insights, summaries, and personalized quizzes. 
                Choose your preferred study tool below.
              </p>
            </div>
            
            {/* Study Tools Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <TextSummarizer />
              <PDFSummarizer />
              <HandwrittenNotes />
              <YouTubeSummarizer />
            </div>
            
            {/* Quiz Generator as full-width */}
            <div className="w-full">
              <QuizGenerator />
            </div>

            {/* Storytelling Mode Card */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg glow-primary">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-neutral-800 mb-2">📖 Story Mode</h3>
                <p className="text-neutral-600 mb-6">Transform any topic into an engaging story with AI characters</p>
                
                <Link 
                  to="/storytelling"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Enter Story Mode</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
        
        <VoicePanel />
      </div>
    </div>
  );
};

export default StudyPage;