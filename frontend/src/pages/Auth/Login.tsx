import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Brain, Sparkles, Mic, ArrowRight } from 'lucide-react';
import { loginUser, signInWithGoogle } from '../../services/firebase';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await loginUser(formData.email, formData.password);
    
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error || 'Login failed');
    }
    
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');

    const result = await signInWithGoogle();
    
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error || 'Google sign-in failed');
    }
    
    setIsGoogleLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-secondary-200/30 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-primary-100/40 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239d75ff%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 animate-fadeIn">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto glow-primary animate-float">
                <Brain className="w-10 h-10 group-hover:-translate-x-1 transition-transform" />
              </div>
              <div className="absolute -top-2 -right-2 w-15 h-15 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse-slow">
              <a
                href="https://bolt.new/"
                target="_blank"
                rel="noopener noreferrer"
                title="Powered by Bolt.new"
                className="block w-16 h-16"
              >
                <img
                  src='../../white_bolt.png'
                  alt="Bolt.new logo"
                  className="w-16 h-16 object-contain"
                  draggable={false}
                />
              </a>
            </div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse-slow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
             <h1 className="text-3xl font-serif font-bold text-gradient mb-2">Welcome Back</h1>
            <p className="text-neutral-600">Continue your learning journey with Mentora</p>
          </div>

          {/* Login Form */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl animate-slideInLeft">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-neutral-900">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-10 rounded-xl border-0 bg-white/40 backdrop-blur-sm placeholder-neutral-600 text-neutral-900 focus:bg-white/30 focus:ring-2 focus:ring-primary-400 focus:outline-none transition-all duration-300"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-neutral-900">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-10 pr-10 rounded-xl border-0 bg-white/30 backdrop-blur-sm placeholder-neutral-600 text-neutral-900 focus:bg-white/30 focus:ring-2 focus:ring-primary-400 focus:outline-none transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-800 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-neutral-400 hover:text-neutral-800 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-xl">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary-400 hover:text-primary-700 transition-colors font-medium"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-400 to-pink-400 backdrop-blur-sm hover:text-primary-600 font-medium border-white/30 text-neutral-700 text-white font-medium py-3 px-6 rounded-xl hover:bg-white/30 hover:border-white/50 transform hover:scale-105 focus:ring-4 focus:ring-primary-200 focus:outline-none transition-all duration-300 shadow-lg group relative overflow-hidden"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-neutral-400/30 border-t-neutral-600 rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/20 backdrop-blur-sm text-neutral-600">Or continue with</span>
                </div>
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-neutral-700 font-medium py-3 px-6 rounded-xl hover:bg-white/30 hover:border-white/50 transform hover:scale-105 focus:ring-4 focus:ring-primary-200 focus:outline-none transition-all duration-300 shadow-lg group relative overflow-hidden"
              >
                {isGoogleLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-neutral-400/30 border-t-neutral-600 rounded-full animate-spin"></div>
                    <span>Signing in with Google...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Google</span>
                  </div>
                )}
              </button>
            </form>

            {/* Voice Login Hint */}
            <div className="mt-6 p-4 bg-gradient-to-r from-cyan-100 to-blue-100 backdrop-blur-sm rounded-xl border border-primary-200/50">
              <div className="flex items-center gap-3 mb-2">
                <Mic className="w-5 h-5 text-primary-600 " />
                <span className="text-sm font-medium text-primary-700">Voice Login Coming Soon!</span>
              </div>
              <p className="text-xs text-primary-600">
                Soon you'll be able to log in using just your voice with Mentora's AI recognition.
              </p>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-neutral-600">
                New to Mentora?{' '}
                <Link 
                  to="/signin" 
                  className="text-blue-900 hover:text-blue-700 font-medium transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;