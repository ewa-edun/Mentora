import React, { useState } from 'react';
import { Youtube, Link, Loader2, Play } from 'lucide-react';

const YouTubeSummarizer: React.FC = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState('');

  const handleSubmit = async () => {
    if (!youtubeUrl.trim()) return;
    
    setIsProcessing(true);
    // TODO: Connect to Flask API for YouTube video processing
    
    // Simulate API call for demo
    setTimeout(() => {
      setIsProcessing(false);
      setSummary("This educational video explains the fundamentals of quantum computing, covering qubits, superposition, and quantum algorithms. Key takeaways include understanding quantum gates and their applications in cryptography...");
    }, 3000);
  };

  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  return (
    <div className="glass-card rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Youtube className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">📺 Paste YouTube Link</h3>
        <p className="text-gray-600">Extract key insights from educational videos</p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all font-medium"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!youtubeUrl.trim() || !isValidYouTubeUrl(youtubeUrl) || isProcessing}
          className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Generate Summary</span>
            </>
          )}
        </button>

        {youtubeUrl && !isValidYouTubeUrl(youtubeUrl) && (
          <p className="text-sm text-red-500 text-center">Please enter a valid YouTube URL</p>
        )}

        {summary && (
          <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200">
            <h4 className="font-semibold text-red-700 mb-3 flex items-center">
              <Play className="w-4 h-4 mr-2" />
              Video Summary
            </h4>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </div>
        )}
      </div>

      {/* TODO: Connect to Flask API for YouTube video summarization */}
    </div>
  );
};

export default YouTubeSummarizer;