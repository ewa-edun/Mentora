import React, { useState } from 'react';
import { Youtube, Link, Loader2, Play, Copy, CheckCircle, Download } from 'lucide-react';

const YouTubeSummarizer: React.FC = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!youtubeUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!isValidYouTubeUrl(youtubeUrl)) {
      setError('Please enter a valid YouTube URL');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    // TODO: Connect to Flask API for YouTube video processing
    // For now, simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setSummary("This educational video explains the fundamentals of quantum computing, covering qubits, superposition, and quantum algorithms. Key takeaways include understanding quantum gates and their applications in cryptography. The video demonstrates how quantum computers can solve certain problems exponentially faster than classical computers, particularly in areas like factoring large numbers and simulating quantum systems.");
    }, 3000);
  };

  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
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
      a.download = 'youtube_summary.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg glow-error">
          <Youtube className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-neutral-800 mb-2">📺 YouTube Summarizer</h3>
        <p className="text-neutral-600">Extract key insights from educational videos</p>
      </div>

      <div className="space-y-6">
        {/* URL Input */}
        <div className="relative">
          <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-600" />
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => {
              setYoutubeUrl(e.target.value);
              setError('');
            }}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-line border-red-200 bg-white/20 backdrop-blur-sm placeholder-neutral-600 text-neutral-800 focus:bg-white/30 focus:ring-2 focus:ring-red-400 focus:outline-none transition-all duration-300 font-medium"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-xl">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!youtubeUrl.trim() || isProcessing}
          className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span className="text-white">Analyzing video...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 text-white" />
              <span className="text-white">Generate Summary</span>
            </>
          )}
        </button>

        {/* Summary Result */}
        {summary && (
          <div className="p-6 bg-gradient-to-r from-red-50/80 to-orange-50/80 backdrop-blur-sm rounded-2xl border border-red-200/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-red-700 flex items-center">
                <Play className="w-4 h-4 mr-2" />
                Video Summary
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors text-sm"
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
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <p className="text-neutral-700 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Tips */}
        <div className="p-4 bg-red-100/60 backdrop-blur-sm rounded-xl border border-red-200/50">
          <h5 className="text-sm font-medium text-red-700 mb-2">📺 YouTube tips:</h5>
          <ul className="text-xs text-red-600 space-y-1">
            <li>• Works best with educational and tutorial videos</li>
            <li>• Supports both youtube.com and youtu.be links</li>
            <li>• AI extracts key concepts and learning points</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default YouTubeSummarizer;