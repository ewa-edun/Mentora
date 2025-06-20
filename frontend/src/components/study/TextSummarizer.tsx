import React, { useState } from 'react';
import { Type, Sparkles, Loader2, Copy, CheckCircle, Download, RotateCcw } from 'lucide-react';
import { summarizeText } from '../../services/api';

const TextSummarizer: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to summarize');
      return;
    }
    
    setIsProcessing(true);
    setError('');

    const result = await summarizeText(inputText);
    
    if (result.success && result.data) {
      setSummary(result.data.Summary);
    } else {
      setError(result.error || 'Failed to summarize text');
    }
    
    setIsProcessing(false);
  };

  const handleCopy = async () => {
    if (summary) {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (summary) {
      const blob = new Blob([summary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'text_summary.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleReset = () => {
    setInputText('');
    setSummary('');
    setError('');
    setCopied(false);
  };

  const wordCount = inputText.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg glow-primary">
          <Type className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-neutral-800 mb-2">✍️ Text Summarizer</h3>
        <p className="text-neutral-600">Paste any text and get an instant AI-powered summary</p>
      </div>

      <div className="space-y-6">
        {/* Text Input */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setError('');
            }}
            placeholder="Paste your text here... (articles, essays, research papers, notes, etc.)"
            className="w-full h-40 px-4 py-3 border-2 border-line border-gray-300 hover:border-blue-400 rounded-2xl bg-white/20 backdrop-blur-sm placeholder-neutral-600 text-neutral-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none"
            maxLength={10000}
          />
          <div className="absolute bottom-3 right-3 text-xs text-neutral-500">
            {wordCount} words
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
            disabled={!inputText.trim() || isProcessing}
            className="flex-1 flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 px-6 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span className="text-white">Summarizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-white" />
                <span className="text-white">Summarize Text</span>
              </>
            )}
          </button>
          
          {(inputText || summary) && (
            <button
              onClick={handleReset}
              className="flex items-center justify-center px-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-neutral-700 rounded-2xl hover:bg-white/30 hover:border-white/50 transition-all duration-300"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Summary Result */}
        {summary && (
          <div className="p-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-blue-700 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Summary
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors text-sm"
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
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="p-4 bg-blue-100/60 backdrop-blur-sm rounded-xl border border-blue-200/50">
          <h5 className="text-sm font-medium text-blue-700 mb-2">💡 Tips for better summaries:</h5>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• Paste complete articles or documents for best results</li>
            <li>• Works great with academic papers, news articles, and research</li>
            <li>• Minimum 50 words recommended for meaningful summaries</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TextSummarizer;