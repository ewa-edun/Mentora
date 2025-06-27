import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Home, AlertTriangle, Zap, Clock, Shield } from 'lucide-react';

const ServerError: React.FC = () => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleRefresh = () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    // Simulate retry attempt
    setTimeout(() => {
      setIsRetrying(false);
      window.history.back();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-16 w-28 h-28 bg-rose-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-20 right-20 w-36 h-36 bg-orange-200/30 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-32 h-32 bg-amber-200/40 rounded-full blur-lg animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23f97316%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M0 0h80v80H0z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl mt-8 mx-auto text-center">
          {/* Main error content */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 mb-8 shadow-2xl animate-fadeIn">
            {/* Animated error icon */}
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto glow-error animate-float">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center animate-pulse-slow">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Error code */}
            <div className="mb-6">
              <h1 className="text-8xl font-serif font-bold bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent mb-2">502</h1>
              <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-orange-500 mx-auto rounded-full"></div>
            </div>

            {/* Error message */}
            <h2 className="text-3xl font-serif font-semibold text-neutral-800 mb-4">
              Our AI tutors are taking a quick break
            </h2>
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed max-w-lg mx-auto">
              Don't worry! Even the smartest AI needs a moment to recharge. We're working hard to get your learning companion back online.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={handleRefresh}
                disabled={isRetrying}
                className="bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium py-3 px-6 rounded-xl hover:from-rose-600 hover:to-orange-600 transform hover:scale-105 focus:ring-4 focus:ring-rose-200 focus:outline-none transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <RefreshCw className={`w-5 h-5 transition-transform text-white ${isRetrying ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                <span className="text-white">{isRetrying ? 'Reconnecting...' : 'Try Again'}</span>
                {isRetrying && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                )}
              </button>
              
              <Link 
                to="/home" 
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-neutral-700 font-medium py-3 px-6 rounded-xl hover:bg-white/30 hover:border-white/50 transform hover:scale-105 focus:ring-4 focus:ring-primary-200 focus:outline-none transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Back to Home</span>
              </Link>
            </div>

            {/* Retry counter */}
            {retryCount > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm text-orange-600 bg-orange-100/60 backdrop-blur-sm rounded-full px-4 py-2 mx-auto w-fit border border-orange-200/50">
                <Clock className="w-4 h-4" />
                <span>Retry attempt #{retryCount}</span>
              </div>
            )}
          </div>

          {/* Status information */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 mb-5 shadow-xl animate-slideInRight" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-serif font-semibold text-neutral-800">What's happening?</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-neutral-700">Server Maintenance</div>
                    <div className="text-sm text-neutral-600">Our servers are temporarily unavailable</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-neutral-700">High Traffic</div>
                    <div className="text-sm text-neutral-600">More students than usual are learning</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-neutral-700">Data Safe</div>
                    <div className="text-sm text-neutral-600">Your progress is securely stored</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-neutral-700">Quick Recovery</div>
                    <div className="text-sm text-neutral-600">We're working to restore service</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-orange-50/80 to-amber-50/80 backdrop-blur-sm rounded-xl border border-orange-200/50">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-orange-800">Need immediate help?</span>
              </div>
              <p className="text-sm text-orange-700 leading-relaxed">
                Try refreshing the page in a few minutes, or contact our support team if the issue persists. 
                Your learning journey is important to us!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerError;