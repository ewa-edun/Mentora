import React from 'react';
import { Link } from 'react-router-dom';
import { Brain,  Sparkles,  Mic,  BookOpen,  Heart,  Zap, Star, ArrowRight, Play, CheckCircle, MessageCircle, Camera } from 'lucide-react';

const Landing: React.FC = () => {
  const features = [
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Voice-First Learning",
      description: "Ask questions naturally and get spoken answers from your AI tutor",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Emotion-Aware Breaks",
      description: "AI detects your mood and suggests personalized wellness activities",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Smart Summaries",
      description: "Transform PDFs, notes, and videos into digestible study materials",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Adaptive Quizzes",
      description: "AI-generated quizzes that adapt to your learning progress",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "OCR Note Scanner",
      description: "Scan handwritten notes and convert them to digital study guides",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Interactive Storytelling",
      description: "Learn through engaging AI-generated stories and conversations",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Medical Student",
      content: "Mentora's voice feature helps me study while commuting. It's like having a personal tutor 24/7!",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "High School Student",
      content: "The emotion detection is amazing. When I'm stressed, it suggests perfect break activities.",
      rating: 5
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Educator",
      content: "My students with ADHD love the voice-first approach. It's truly inclusive learning.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="relative glass-card z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              
              <div className="w-10 h-10 bg-gradient-to-br from-lavender-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
               </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-pulse-soft"></div>
            </div>
            <span className="text-2xl font-serif font-bold text-gradient">
              Mentora
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="bg-white/20 text-neutral-600 hover:text-primary-600 font-medium transition-colors px-6 py-2 rounded-xl transform hover:bg-white/30 hover:border-white/50 hover:scale-105 transition-all duration-300 shadow-lg backdrop-blur-sm border border-white/30 flex items-center justify-center gap-3 group"
            >
              Login
            </Link>
            <Link 
              to="/signin" 
              className=" text-neutral-600 hover:text-primary-600 font-medium  bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center animate-pulse-slow transition-colors px-6 py-2 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary-200/30 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-secondary-200/30 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-primary-100/40 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto glow-primary animate-float mb-5">
              <Brain className="w-12 h-12 group-hover:-translate-x-1 transition-transform" />
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

          <h1 className="text-6xl md:text-7xl font-serif font-bold bg-clip-text text-transparent mb-6 leading-tight text-gradient">
            Learn Smarter,
            <br />
            Not Harder
          </h1>
          
          <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Meet Mentora, your emotion-aware AI study companion. Voice-first learning that adapts to your mood, 
            learning style, and goals. Built for students who crave an intuitive and motivating experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              to="/signin" 
              className=" bg-gradient-to-r from-red-500 to-pink-500 text-white backdrop-blur-sm border border-white/30 text-neutral-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 hover:border-white/50 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-3 group"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <a
               href="https://www.youtube.com/watch?v=9sRM_VtARug"
               target="_blank"
               rel="noopener noreferrer"
               className="bg-white/20 backdrop-blur-sm border border-white/30 text-neutral-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 hover:border-white/50 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-3 group"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Watch Demo</span>
          </a>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Voice-first experience</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl bg-gradient-to-r from-purple-500 to-orange-500 font-serif font-bold bg-clip-text text-transparent mb-4">
              Why Students Love Mentora
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Experience the future of personalized learning with AI that understands not just what you're studying, but how you're feeling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-3">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold bg-clip-text mb-4">
              How Mentora Works
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Three simple steps to transform your learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">Upload Your Content</h3>
              <p className="text-neutral-600">Share PDFs, notes, or speak your questions directly to Mentora</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">AI Analyzes & Adapts</h3>
              <p className="text-neutral-600">Our AI understands your content and emotional state to personalize learning</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">Learn & Grow</h3>
              <p className="text-neutral-600">Get summaries, quizzes, and voice conversations tailored just for you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl bg-gradient-to-r from-purple-500 to-orange-500 font-serif font-bold bg-clip-text text-transparent mb-4">
              Loved by Students Worldwide
            </h2>
            <p className="text-xl text-neutral-600">
              Join thousands of learners who've transformed their study experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:border-white/30 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-neutral-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-neutral-800">{testimonial.name}</div>
                  <div className="text-sm text-neutral-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12">
            <h2 className="text-4xl font-serif font-semibold bg-clip-text mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
              Join the future of education with AI that understands you. Start your personalized learning journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signin" 
                className=" bg-gradient-to-r from-red-500 to-pink-500 text-white backdrop-blur-sm border border-white/30 text-neutral-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 hover:border-white/50 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-3 group"
              >
                <span>Start Free Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/login" 
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-neutral-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 hover:border-white/50 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Already have an account?
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;