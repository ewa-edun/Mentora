import React from 'react';
import { Link } from 'react-router-dom';
import PDFSummarizer from './study/PDFSummarizer';
import HandwrittenNotes from './study/HandwrittenNotes';
import TextSummarizer from './study/TextSummarizer';
import YouTubeSummarizer from './study/YouTubeSummarizer';
import QuizGenerator from './study/QuizGenerator';
import { BookOpen, Sparkles } from 'lucide-react';

const StudyMode: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-gradient mb-4">
          Study Mode
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Transform your learning materials with AI-powered insights, summaries, and personalized quizzes
        </p>
      </div>
      
      {/* Top 4 squares in 2x2 grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 p-4">
        <TextSummarizer />
        <PDFSummarizer />
        <HandwrittenNotes />
        <YouTubeSummarizer />
      </div>
      
      {/* Quiz Generator as full-width rectangle at bottom */}
      <div className="w-full p-4">
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
  );
};

export default StudyMode;