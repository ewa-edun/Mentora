import React from 'react';
import PDFSummarizer from './study/PDFSummarizer';
import YouTubeSummarizer from './study/YouTubeSummarizer';
import HandwrittenNotes from './study/HandwrittenNotes';
import TextSummarizer from './study/TextSummarizer';
import QuizGenerator from './study/QuizGenerator';

const StudyMode: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-6xl font-serif font-bold text-gradient mt-4 mb-6">
          Study Mode
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Transform your learning materials with AI-powered insights, summaries, and personalized quizzes
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
        <PDFSummarizer />
        <YouTubeSummarizer />
        <TextSummarizer />
        <HandwrittenNotes />
        <QuizGenerator />
      </div>
    </div>
  );
};

export default StudyMode;