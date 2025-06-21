import React, { useState } from 'react';
import { Youtube, Link, Loader2, Play, Copy, CheckCircle, Download, AlertTriangle, Lightbulb, ExternalLink } from 'lucide-react';
import { summarizeYouTube } from '../../services/api';

const YouTubeSummarizer: React.FC = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState('');
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!youtubeUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!isValidYouTubeUrl(youtubeUrl)) {
      setError('Please enter a valid YouTube URL');
      setErrorDetails({
        message: 'The URL format is not recognized as a valid YouTube link',
        suggestions: [
          'Make sure the URL starts with https://youtube.com or https://youtu.be',
          'Copy the URL directly from your browser address bar',
          'Check that the URL is complete and not truncated'
        ]
      });
      return;
    }
    
    setIsProcessing(true);
    setError('');
    setErrorDetails(null);
    setSummary('');
    setVideoInfo(null);
    
    const result = await summarizeYouTube(youtubeUrl);
    
    if (result.success && result.data) {
      setSummary(result.data.summary);
      setVideoInfo(result.data.video_info);
    } else {
      setError(result.error || 'Failed to process YouTube video');
      if (result.data) {
        setErrorDetails(result.data);
      }
    }
    
    setIsProcessing(false);
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
    if (summary && videoInfo) {
      const content = `YouTube Video Summary\n\nTitle: ${videoInfo.title}\nURL: ${youtubeUrl}\n\nSummary:\n${summary}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `youtube-summary-${videoInfo.video_id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleTryExample = () => {
    // Set an example educational video URL
    setYoutubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'); // Replace with our demo video
    setError('');
    setErrorDetails(null);
  };

  const getErrorIcon = () => {
    if (errorDetails?.video_info?.content_type === 'music') {
      return '🎵';
    }
    return '⚠️';
  };

  const getErrorColor = () => {
    if (errorDetails?.video_info?.content_type === 'music') {
      return 'from-lavender-300 to-cyan-500';
    }
    return 'from-red-300 to-rose-500';
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
          <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-600" />
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => {
              setYoutubeUrl(e.target.value);
              setError('');
              setErrorDetails(null);
            }}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 bg-white/20 backdrop-blur-sm placeholder-neutral-600 text-neutral-800 focus:bg-white/30 focus:ring-2 focus:ring-red-400 focus:outline-none transition-all duration-300 font-medium"
          />
        </div>

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

        {/* Enhanced Error Display */}
        {error && (
          <div className={`p-6 bg-gradient-to-r ${getErrorColor()}/10 backdrop-blur-sm border border-red-200/50 rounded-2xl`}>
            <div className="flex items-start gap-4">
              <div className="text-3xl">{getErrorIcon()}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {error}
                </h4>
                
                {errorDetails?.message && (
                  <p className="text-red-600 mb-4">{errorDetails.message}</p>
                )}

                {errorDetails?.video_info && (
                  <div className="mb-4 p-3 bg-white/20 rounded-xl">
                    <p className="text-sm text-red-700">
                      <strong>Video:</strong> {errorDetails.video_info.title}
                    </p>
                    {errorDetails.video_info.content_type && (
                      <p className="text-sm text-red-600">
                        <strong>Type:</strong> {errorDetails.video_info.content_type}
                      </p>
                    )}
                  </div>
                )}

                {errorDetails?.suggestions && (
                  <div className="mb-4">
                    <h5 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Suggestions:
                    </h5>
                    <ul className="text-sm text-red-600 space-y-1">
                      {errorDetails.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-400 mt-1">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {errorDetails?.help && (
                  <div className="p-3 bg-blue-100/60 rounded-xl border border-blue-200/50">
                    <h5 className="font-medium text-blue-700 mb-2">{errorDetails.help.title}</h5>
                    <ul className="text-sm text-blue-600 space-y-1">
                      {errorDetails.help.tips.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleTryExample}
                    className="flex items-center gap-2 text-sm bg-blue-500/20 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Try Example Video
                  </button>
                  <button
                    onClick={() => {
                      setError('');
                      setErrorDetails(null);
                      setYoutubeUrl('');
                    }}
                    className="flex items-center gap-2 text-sm bg-neutral-200/80 text-neutral-700 px-3 py-2 rounded-lg hover:bg-neutral-300/80 transition-colors"
                  >
                    Clear & Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Result */}
        {summary && videoInfo && (
          <div className="space-y-4">
            {/* Video Info */}
            <div className="p-4 bg-green-100/60 backdrop-blur-sm rounded-xl border border-green-200/50">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-700">Successfully processed!</span>
              </div>
              <p className="text-sm text-green-600">
                <strong>{videoInfo.title}</strong>
              </p>
              {videoInfo.transcript_length && (
                <p className="text-xs text-green-600 mt-1">
                  Processed {videoInfo.transcript_length} characters of transcript
                </p>
              )}
            </div>

            {/* Summary */}
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
          </div>
        )}

        {/* Tips */}
        <div className="p-4 bg-red-100/60 backdrop-blur-sm rounded-xl border border-red-200/50">
          <h5 className="text-sm font-medium text-red-700 mb-2">📺 YouTube tips:</h5>
          <ul className="text-xs text-red-600 space-y-1">
            <li>• Works best with educational and tutorial videos</li>
            <li>• Supports both youtube.com and youtu.be links</li>
            <li>• Videos need captions or subtitles to work</li>
            <li>• Music videos and entertainment content may not have transcripts</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default YouTubeSummarizer;