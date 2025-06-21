import React, { useState } from 'react';
import { Brain, ChevronDown, Loader2, CheckCircle, Copy, Download, RotateCcw, Sparkles } from 'lucide-react';
import { generateQuiz } from '../../services/api';

const QuizGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  type QuizQuestion = {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [rawQuizText, setRawQuizText] = useState('');

  const handleSubmit = async () => {
    if (!topic.trim()) {
      setError('Please enter some content to generate a quiz from');
      return;
    }
    
    setIsGenerating(true);
    setError('');

    // Try to connect to Flask API first
    const result = await generateQuiz(topic);
    
    if (result.success && result.data) {
      setRawQuizText(result.data['Your Quiz']);
      // Try to parse the quiz into structured format
      parseQuizFromText(result.data['Your Quiz']);
    } else {
      // Fallback to demo data if API fails
      setError('Using demo data - connect to Flask API for real quiz generation');
      setTimeout(() => {
        setIsGenerating(false);
        setQuiz([
          {
            question: "What is the fundamental unit of quantum information?",
            options: ["Bit", "Qubit", "Byte", "Quantum"],
            correct: 1,
            explanation: "A qubit is the basic unit of quantum information, capable of existing in superposition states."
          },
          {
            question: "Which principle allows quantum particles to exist in multiple states simultaneously?",
            options: ["Entanglement", "Superposition", "Interference", "Decoherence"],
            correct: 1,
            explanation: "Superposition allows quantum particles to exist in multiple states at once until measured."
          }
        ]);
      }, 2000);
      return;
    }
    
    setIsGenerating(false);
  };

  const parseQuizFromText = (text: string) => {
    // Simple parsing logic - in a real app, you'd want more sophisticated parsing
    // For now, we'll just store the raw text and show it
    setRawQuizText(text);
    
    // You could implement parsing logic here to extract structured quiz data
    // For demo purposes, we'll show the raw text
  };

  const handleCopy = async () => {
    const textToCopy = rawQuizText || quiz.map((q, i) => 
      `${i + 1}. ${q.question}\n${q.options.map((opt, j) => `${String.fromCharCode(65 + j)}. ${opt}`).join('\n')}\nAnswer: ${String.fromCharCode(65 + q.correct)}\nExplanation: ${q.explanation}\n\n`
    ).join('');
    
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const textToDownload = rawQuizText || quiz.map((q, i) => 
      `${i + 1}. ${q.question}\n${q.options.map((opt, j) => `${String.fromCharCode(65 + j)}. ${opt}`).join('\n')}\nAnswer: ${String.fromCharCode(65 + q.correct)}\nExplanation: ${q.explanation}\n\n`
    ).join('');
    
    if (textToDownload) {
      const blob = new Blob([textToDownload], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quiz_${difficulty.toLowerCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleReset = () => {
    setTopic('');
    setQuiz([]);
    setRawQuizText('');
    setError('');
    setCopied(false);
  };

  const wordCount = topic.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="backdrop-blur-xl bg-white/20 border border-purple/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1 glass-card lg:col-span-2">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-neutral-800 mb-2">🧠 Quiz Generator</h3>
        <p className="text-neutral-600">Create personalized quizzes from your study materials</p>
      </div>

      <div className="space-y-6">
        {/* Topic Input */}
        <div>
          <label className="block text-sm font-medium text-black-700 mb-2">
            Topic or Notes
          </label>
          <div className="relative">
            <textarea
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setError('');
              }}
              placeholder="Enter your study topic or paste your notes here..."
              rows={4}
              className="w-full p-4 rounded-2xl bg-white/30 backdrop-blur-sm border-2 border-purple-200 hover:bg-white/30 hover:border-purple-300 placeholder-neutral-600 text-neutral-800 focus:bg-white/40 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300 resize-none"
              maxLength={5000}
            />
            <div className="absolute bottom-3 right-3 text-xs text-neutral-500">
              {wordCount} words
            </div>
          </div>
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="block text-sm font-medium text-black-700 mb-2">
            Difficulty Level
          </label>
          <div className="relative">
            <select
              value={difficulty}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDifficulty(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
              className="w-full p-4 rounded-2xl border-2 border-purple-200 bg-white/30 border-2 border-purple-200 hover:bg-white/40 hover:border-purple-300 backdrop-blur-sm text-neutral-800 focus:bg-white/50 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300 appearance-none cursor-pointer"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-600 pointer-events-none" />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-xl">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={!topic.trim() || isGenerating}
            className="flex-1 flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span className="text-white">Generating Quiz...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-white" />
                <span className="text-white">Generate Quiz</span>
              </>
            )}
          </button>
          
          {(topic || quiz.length > 0 || rawQuizText) && (
            <button
              onClick={handleReset}
              className="flex items-center justify-center px-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-neutral-700 rounded-2xl hover:bg-white/30 hover:border-white/50 transition-all duration-300"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quiz Results */}
        {(quiz.length > 0 || rawQuizText) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-purple-700 text-lg flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Generated Quiz ({difficulty} Level)
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-purple-600 hover:text-purple-700 transition-colors text-sm"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 text-purple-600 hover:text-purple-700 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Display Raw Quiz Text (from API) */}
            {rawQuizText && (
              <div className="p-6 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl border border-purple-200/50">
                <pre className="text-neutral-700 leading-relaxed whitespace-pre-wrap font-sans text-sm">{rawQuizText}</pre>
              </div>
            )}

            {/* Display Structured Quiz (fallback demo) */}
            {quiz.length > 0 && !rawQuizText && quiz.map((q, index) => (
              <div key={index} className="p-6 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl border border-purple-200/50">
                <h5 className="font-semibold text-neutral-800 mb-4">
                  {index + 1}. {q.question}
                </h5>
                <div className="space-y-2 mb-4">
                  {q.options.map((option: string, optIndex: number) => (
                    <div
                      key={optIndex}
                      className={`p-3 rounded-xl border transition-colors ${
                        optIndex === q.correct
                          ? 'bg-green-100/80 border-green-300 text-green-800'
                          : 'bg-white/80 border-neutral-200 text-neutral-700'
                      }`}
                    >
                      {String.fromCharCode(65 + optIndex)}. {option}
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips */}
        <div className="p-4 bg-purple-100/60 backdrop-blur-sm rounded-xl border border-purple-200/50">
          <h5 className="text-sm font-medium text-purple-700 mb-2">🎯 Quiz generation tips:</h5>
          <ul className="text-xs text-purple-600 space-y-1">
            <li>• Include key concepts, definitions, and important facts</li>
            <li>• Works best with structured content like textbook chapters</li>
            <li>• AI generates multiple choice, true/false, and short answer questions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuizGenerator;