import React, { useState } from 'react';
import { Brain, ChevronDown, Loader2, CheckCircle } from 'lucide-react';

const QuizGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [isGenerating, setIsGenerating] = useState(false);
  type QuizQuestion = {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);

  const handleSubmit = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    // TODO: Connect to Flask API for quiz generation
    
    // Simulate API call for demo
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
    }, 3000);
  };

  return (
    <div className="glass-card rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 lg:col-span-2">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">🧠 Quiz Generator</h3>
        <p className="text-gray-600">Create personalized quizzes from your study materials</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic or Notes
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your study topic or paste your notes here..."
            rows={4}
            className="w-full p-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Level
          </label>
          <div className="relative">
            <select
              value={difficulty}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDifficulty(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
              className="w-full p-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!topic.trim() || isGenerating}
          className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating Quiz...</span>
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              <span>Generate Quiz</span>
            </>
          )}
        </button>

        {quiz.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-purple-700 text-lg flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Generated Quiz ({difficulty} Level)
            </h4>
            {quiz.map((q, index) => (
              <div key={index} className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
                <h5 className="font-semibold text-gray-800 mb-4">
                  {index + 1}. {q.question}
                </h5>
                <div className="space-y-2 mb-4">
                  {q.options.map((option: string, optIndex: number) => (
                    <div
                      key={optIndex}
                      className={`p-3 rounded-xl border transition-colors ${
                        optIndex === q.correct
                          ? 'bg-green-100 border-green-300 text-green-800'
                          : 'bg-white border-gray-200 text-gray-700'
                      }`}
                    >
                      {String.fromCharCode(65 + optIndex)}. {option}
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TODO: Connect to Flask API for quiz generation */}
    </div>
  );
};

export default QuizGenerator;