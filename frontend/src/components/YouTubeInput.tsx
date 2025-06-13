import React, { useState } from 'react';
import { Youtube, Link, Loader2 } from 'lucide-react';

const YouTubeInput: React.FC = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!youtubeUrl.trim()) return;
    
    setIsProcessing(true);
    // TODO: Connect to Flask API for YouTube video processing
    
    // Simulate API call for demo
    setTimeout(() => {
      setIsProcessing(false);
      alert('YouTube video processing would happen here!');
    }, 2000);
  };

  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-shadow">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Youtube className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">📺 Summarize YouTube Video</h3>
        <p className="text-gray-600 text-sm mt-1">Extract key insights from educational videos</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Paste YouTube URL here..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!youtubeUrl.trim() || !isValidYouTubeUrl(youtubeUrl) || isProcessing}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-600 hover:to-red-700 transition-all"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <span>Generate Summary</span>
          )}
        </button>

        {youtubeUrl && !isValidYouTubeUrl(youtubeUrl) && (
          <p className="text-sm text-red-500">Please enter a valid YouTube URL</p>
        )}
      </div>

      {/* TODO: Connect to Flask API for YouTube video summarization */}
    </div>
  );
};

export default YouTubeInput;