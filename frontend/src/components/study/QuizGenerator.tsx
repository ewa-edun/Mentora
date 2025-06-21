import React, { useState } from 'react';
import { Brain, ChevronDown, Loader2, CheckCircle, Copy, Download, RotateCcw, Sparkles, ArrowRight, ArrowLeft, Trophy, Target, RefreshCw, X } from 'lucide-react';
import { generateQuiz } from '../../services/api';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizResult {
  questionIndex: number;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

const QuizGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Quiz state
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [rawQuizText, setRawQuizText] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [isQuizActive, setIsQuizActive] = useState(false);

  const handleSubmit = async () => {
    if (!topic.trim()) {
      setError('Please enter some content to generate a quiz from');
      return;
    }

    setIsGenerating(true);
    setError('');
    setQuiz([]);
    setRawQuizText('');

    const result = await generateQuiz(topic);

    if (result.success && result.data) {
      setRawQuizText(result.data['Your Quiz']);
      const parsedQuiz = parseQuizFromText(result.data['Your Quiz']);
      if (parsedQuiz.length > 0) {
        setQuiz(parsedQuiz);
      } else {
        setError('Could not parse quiz from AI response. Please try with more structured content.');
      }
    } else {
      setError(result.error || 'Failed to generate quiz');
    }

    setIsGenerating(false);
  };

  // Improved parser: handles more flexible AI output
  const parseQuizFromText = (text: string): QuizQuestion[] => {
    const questions: QuizQuestion[] = [];
    if (!text) return questions;

    // Split by question number (e.g., 1. 2. 3.)
    const questionBlocks = text.split(/\n?\d+\.\s+/).filter(block => block.trim());
    questionBlocks.forEach(block => {
      // Find the question (first line)
      const lines = block.trim().split('\n').filter(line => line.trim());
      if (lines.length < 2) return;

      // Find the question (first line that is not an option)
      let questionLineIndex = 0;
      while (
        questionLineIndex < lines.length &&
        /^[A-D][).]/.test(lines[questionLineIndex])
      ) {
        questionLineIndex++;
      }
      const question = lines[0].trim();

      // Extract options
      const options: string[] = [];
      let correctAnswer = 0;
      let explanation = '';
      let foundAnswer = false;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();

        // Option line
        const optionMatch = line.match(/^[A-D][).]\s*(.+?)(?:\s*(?:\*|✓|\(correct\)))?$/i);
        if (optionMatch) {
          options.push(optionMatch[1].replace(/\s*\*|\s*✓|\s*\(correct\)/g, '').trim());
          // Detect correct answer
          if (/\*|✓|\(correct\)/i.test(line)) {
            correctAnswer = options.length - 1;
            foundAnswer = true;
          }
          continue;
        }

        // "Answer:" line
        const answerMatch = line.match(/^Answer:\s*([A-D])/i);
        if (answerMatch) {
          correctAnswer = answerMatch[1].toUpperCase().charCodeAt(0) - 65;
          foundAnswer = true;
          continue;
        }

        // "Explanation:" line
        const explanationMatch = line.match(/^Explanation:\s*(.+)$/i);
        if (explanationMatch) {
          explanation = explanationMatch[1].trim();
          continue;
        }
      }

      // If no explicit correct answer, fallback to first option
      if (!foundAnswer) correctAnswer = 0;

      if (question && options.length >= 2) {
        questions.push({
          question,
          options,
          correctAnswer,
          explanation,
        });
      }
    });

    return questions;
  };

  const startQuiz = () => {
    setIsQuizActive(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizResults([]);
    setShowResults(false);
    setQuizStartTime(Date.now());
    setQuestionStartTime(Date.now());
  };

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const nextQuestion = () => {
    if (selectedAnswer === null) return;

    const timeSpent = Date.now() - questionStartTime;
    const isCorrect = selectedAnswer === quiz[currentQuestionIndex].correctAnswer;

    const result: QuizResult = {
      questionIndex: currentQuestionIndex,
      selectedAnswer,
      isCorrect,
      timeSpent
    };

    setQuizResults(prev => [...prev, result]);

    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setQuestionStartTime(Date.now());
    } else {
      // Quiz completed
      finishQuiz([...quizResults, result]);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      // Restore previous answer
      const previousResult = quizResults[currentQuestionIndex - 1];
      setSelectedAnswer(previousResult?.selectedAnswer ?? null);
    }
  };

  const finishQuiz = (finalResults: QuizResult[]) => {
    setIsQuizActive(false);
    setShowResults(true);

    const correctAnswers = finalResults.filter(result => result.isCorrect).length;
    const percentage = (correctAnswers / quiz.length) * 100;

    // Play sound based on score
    setTimeout(() => {
      if (percentage >= 50) {
        playWinnerSound();
        triggerConfetti();
      } else {
        playLoseSound();
      }
    }, 500);
  };

  const playWinnerSound = () => {
    try {
      const audio = new Audio('/sounds/winner.wav');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Could not play winner sound:', e));
    } catch {
      console.log('Winner sound not available');
    }
  };

  const playLoseSound = () => {
    try {
      const audio = new Audio('/sounds/lose.wav');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Could not play lose sound:', e));
    } catch {
      console.log('Lose sound not available');
    }
  };

  const triggerConfetti = () => {
    // Create confetti effect
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.animation = 'confetti-fall 3s linear forwards';

        document.body.appendChild(confetti);

        setTimeout(() => {
          confetti.remove();
        }, 3000);
      }, i * 50);
    }
  };

  const resetQuiz = () => {
    setIsQuizActive(false);
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizResults([]);
    setQuiz([]);
    setRawQuizText('');
    setTopic('');
    setError('');
  };

  const handleCopy = async () => {
    const textToCopy = rawQuizText || quiz.map((q, i) =>
      `${i + 1}. ${q.question}\n${q.options.map((opt, j) => `${String.fromCharCode(65 + j)}. ${opt}`).join('\n')}\nAnswer: ${String.fromCharCode(65 + q.correctAnswer)}\nExplanation: ${q.explanation}\n\n`
    ).join('');

    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const textToDownload = rawQuizText || quiz.map((q, i) =>
      `${i + 1}. ${q.question}\n${q.options.map((opt, j) => `${String.fromCharCode(65 + j)}. ${opt}`).join('\n')}\nAnswer: ${String.fromCharCode(65 + q.correctAnswer)}\nExplanation: ${q.explanation}\n\n`
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

  const wordCount = topic.trim().split(/\s+/).filter(word => word.length > 0).length;
  const currentQuestion = quiz[currentQuestionIndex];
  const correctAnswers = quizResults.filter(result => result.isCorrect).length;
  const totalQuestions = quiz.length;
  const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  return (
    <>
      {/* Confetti CSS */}
      <style>
        {`
          @keyframes confetti-fall {
            0% {
              transform: translateY(-10px) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}
      </style>

      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-neutral-800 mb-2">🧠 Quiz Generator</h3>
          <p className="text-neutral-600">Create personalized quizzes from your study materials</p>
        </div>

        {!isQuizActive && !showResults && quiz.length === 0 && (
          /* Quiz Creation Interface */
          <div className="space-y-6">
            {/* Topic Input */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
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
                  className="w-full p-4 rounded-2xl border-0 bg-white/20 backdrop-blur-sm placeholder-neutral-600 text-neutral-800 focus:bg-white/30 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300 resize-none"
                  maxLength={5000}
                />
                <div className="absolute bottom-3 right-3 text-xs text-neutral-500">
                  {wordCount} words
                </div>
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Difficulty Level
              </label>
              <div className="relative">
                <select
                  value={difficulty}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDifficulty(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                  className="w-full p-4 rounded-2xl border-0 bg-white/20 backdrop-blur-sm text-neutral-800 focus:bg-white/30 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300 appearance-none cursor-pointer"
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

            {/* Generate Button */}
            <button
              onClick={handleSubmit}
              disabled={!topic.trim() || isGenerating}
              className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
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

            {/* Tips */}
            <div className="p-4 bg-purple-100/60 backdrop-blur-sm rounded-xl border border-purple-200/50">
              <h5 className="text-sm font-medium text-purple-700 mb-2">🎯 Quiz generation tips:</h5>
              <ul className="text-xs text-purple-600 space-y-1">
                <li>• Include key concepts, definitions, and important facts</li>
                <li>• Works best with structured content like textbook chapters</li>
                <li>• AI generates multiple choice questions with explanations</li>
              </ul>
            </div>
          </div>
        )}

        {!isQuizActive && !showResults && quiz.length > 0 && (
          /* Quiz Preview */
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h4 className="text-xl font-serif font-bold text-neutral-800">Quiz Ready!</h4>
              </div>
              <p className="text-neutral-600 mb-6">
                Your {difficulty.toLowerCase()} level quiz has {quiz.length} questions. Ready to test your knowledge?
              </p>

              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={startQuiz}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-3"
                >
                  <Target className="w-6 h-6" />
                  <span>Start Quiz</span>
                </button>

                <button
                  onClick={resetQuiz}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-neutral-700 px-6 py-4 rounded-2xl font-medium hover:bg-white/30 hover:border-white/50 transition-all duration-300 flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Create New Quiz</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-sm">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Quiz</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {isQuizActive && currentQuestion && (
          /* Active Quiz Interface */
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-700">
                  Question {currentQuestionIndex + 1} of {quiz.length}
                </span>
                <span className="text-sm text-neutral-600">
                  {difficulty} Level
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="h-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestionIndex + 1) / quiz.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="text-center mb-8">
              <h4 className="text-xl font-serif font-bold text-neutral-800 mb-6 leading-relaxed">
                {currentQuestion.question}
              </h4>
            </div>

            {/* Answer Options */}
            <div className="space-y-4 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                    selectedAnswer === index
                      ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-purple-500 shadow-lg transform scale-105'
                      : 'bg-white/20 border-white/30 hover:bg-white/30 hover:border-white/50 hover:transform hover:scale-102'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                      selectedAnswer === index
                        ? 'bg-purple-500 border-purple-500 text-white'
                        : 'border-neutral-400 text-neutral-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-neutral-800 font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-neutral-700 px-6 py-3 rounded-xl font-medium hover:bg-white/30 hover:border-white/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={nextQuestion}
                disabled={selectedAnswer === null}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <span>{currentQuestionIndex === quiz.length - 1 ? 'Finish Quiz' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {showResults && (
          /* Quiz Results */
          <div className="space-y-6">
            {/* Score Header */}
            <div className="text-center mb-8">
              <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg ${
                percentage >= 50
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 glow-success animate-bounce'
                  : 'bg-gradient-to-r from-red-500 to-orange-500'
              }`}>
                {percentage >= 50 ? (
                  <Trophy className="w-12 h-12 text-white" />
                ) : (
                  <Target className="w-12 h-12 text-white" />
                )}
              </div>

              <h4 className="text-3xl font-serif font-bold text-neutral-800 mb-2">
                {percentage >= 50 ? '🎉 Congratulations!' : '📚 Keep Learning!'}
              </h4>

              <div className="text-6xl font-bold mb-4">
                <span className={percentage >= 50 ? 'text-green-600' : 'text-orange-600'}>
                  {Math.round(percentage)}%
                </span>
              </div>

              <p className="text-xl text-neutral-600 mb-4">
                You got {correctAnswers} out of {totalQuestions} questions correct
              </p>

              {percentage >= 50 ? (
                <p className="text-green-600 font-medium">
                  Excellent work! You've mastered this topic! 🌟
                </p>
              ) : (
                <p className="text-orange-600 font-medium">
                  Don't worry! Review the explanations and try again. 💪
                </p>
              )}
            </div>

            {/* Detailed Results */}
            <div className="space-y-4">
              <h5 className="text-lg font-serif font-bold text-neutral-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                Detailed Results
              </h5>

              {quiz.map((question, index) => {
                const result = quizResults[index];
                const isCorrect = result?.isCorrect;

                return (
                  <div key={index} className={`p-6 rounded-2xl border ${
                    isCorrect
                      ? 'bg-green-50/80 border-green-200/50'
                      : 'bg-red-50/80 border-red-200/50'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {index + 1}
                      </div>

                      <div className="flex-1">
                        <h6 className="font-semibold text-neutral-800 mb-3">
                          {question.question}
                        </h6>

                        <div className="space-y-2 mb-4">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-xl border transition-colors ${
                                optIndex === question.correctAnswer
                                  ? 'bg-green-100/80 border-green-300 text-green-800'
                                  : optIndex === result?.selectedAnswer && !isCorrect
                                    ? 'bg-red-100/80 border-red-300 text-red-800'
                                    : 'bg-white/80 border-neutral-200 text-neutral-700'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-bold">
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>
                                <span>{option}</span>
                                {optIndex === question.correctAnswer && (
                                  <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                                )}
                                {optIndex === result?.selectedAnswer && !isCorrect && (
                                  <X className="w-4 h-4 text-red-600 ml-auto" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {question.explanation && (
                          <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200">
                            <p className="text-sm text-blue-700">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 pt-6">
              <button
                onClick={() => {
                  setShowResults(false);
                  startQuiz();
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>

              <button
                onClick={resetQuiz}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-neutral-700 px-6 py-3 rounded-xl font-medium hover:bg-white/30 hover:border-white/50 transition-all duration-300"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Create New Quiz</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-neutral-700 px-6 py-3 rounded-xl font-medium hover:bg-white/30 hover:border-white/50 transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                <span>Download Results</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default QuizGenerator;