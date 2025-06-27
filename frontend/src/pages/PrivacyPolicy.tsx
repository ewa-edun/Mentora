import React from 'react';
//import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Users, Brain, Heart, FileText, Mail, Calendar } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const sections = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Information We Collect",
      content: [
        "Account information (name, email, profile picture)",
        "Learning content you upload (PDFs, notes, voice recordings)",
        "Study session data and progress tracking",
        "Voice recordings for emotion detection (processed locally, not stored)",
        "Usage analytics to improve your learning experience"
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "How We Use Your Information",
      content: [
        "Personalize your AI tutoring experience",
        "Generate custom study materials and quizzes",
        "Provide emotion-aware break recommendations",
        "Track your learning progress and achievements",
        "Improve our AI models and platform features"
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Data Protection & Security",
      content: [
        "End-to-end encryption for all sensitive data",
        "Voice recordings processed locally on your device",
        "Regular security audits and compliance checks",
        "GDPR and CCPA compliant data handling",
        "Secure cloud storage with industry-standard protocols"
      ]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Data Sharing & Third Parties",
      content: [
        "We never sell your personal data to third parties",
        "AI processing partners (Google Gemini, ElevenLabs) with strict data agreements",
        "Anonymous usage analytics to improve platform performance",
        "Legal compliance when required by law",
        "Your explicit consent for any data sharing"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-secondary-200/30 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-primary-100/40 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239d75ff%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="glass-card px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">

            <button onClick={() => window.history.back()} className="flex items-center gap-3 group">
              <ArrowLeft className="w-5 h-5 text-primary-600 group-hover:-translate-x-1 transition-transform" />
              <span className="text-primary-600 font-medium">Back to Mentora</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-300 to-green-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-serif font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text">
                Mentora
              </span>
            </div>
          </div>
        </nav>

        {/* Header */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto glow-success animate-float">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Your privacy is fundamental to how we build Mentora. We're committed to being transparent about how we collect, use, and protect your data.
            </p>
            
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-neutral-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Last updated: July 1, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Version 1.0</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <Heart className="w-8 h-8 text-rose-500" />
                <h2 className="text-2xl font-serif font-bold text-neutral-800">Our Commitment to You</h2>
              </div>
              <p className="text-neutral-700 leading-relaxed mb-4">
                At Mentora, we believe that learning should be personal, safe, and empowering. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered learning platform.
              </p>
              <p className="text-neutral-700 leading-relaxed">
                We've designed Mentora with privacy by design principles, ensuring your personal data and learning journey remain secure and under your control.
              </p>
            </div>

            {/* Main Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div 
                  key={index}
                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-purple-700">
                      {section.icon}
                    </div>
                    <h3 className="text-xl font-serif font-bold text-neutral-800">{section.title}</h3>
                  </div>
                  
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Additional Important Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {/* Your Rights */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                <h3 className="text-xl font-serif font-bold text-neutral-800 mb-4">Your Rights</h3>
                <ul className="space-y-2 text-neutral-700">
                  <li>• Access your personal data</li>
                  <li>• Correct inaccurate information</li>
                  <li>• Delete your account and data</li>
                  <li>• Export your learning data</li>
                  <li>• Opt-out of data processing</li>
                </ul>
              </div>

              {/* Contact Us */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                <h3 className="text-xl font-serif font-bold text-neutral-800 mb-4">Questions?</h3>
                <p className="text-neutral-700 mb-4">
                  We're here to help with any privacy concerns or questions.
                </p>
                <div className="flex items-center gap-2 text-primary-600">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">privacy@mentora.ai</span>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-12 p-6 bg-green-100/60 backdrop-blur-sm rounded-xl border border-primary-200/50">
              <p className="text-sm text-green-700 leading-relaxed text-center">
                <strong>Note:</strong> This privacy policy may be updated periodically. We'll notify you of any significant changes via email or through the platform. Your continued use of Mentora after changes indicates your acceptance of the updated policy.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;