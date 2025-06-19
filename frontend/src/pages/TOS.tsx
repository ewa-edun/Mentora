import React from 'react';
//import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, Brain, Users, Shield, Zap, AlertTriangle, CheckCircle, FileText, Calendar, Mail } from 'lucide-react';

const TermsOfService: React.FC = () => {
  const sections = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Account & Eligibility",
      content: [
        "You must be at least 13 years old to use Mentora",
        "Provide accurate and complete registration information",
        "Maintain the security of your account credentials",
        "You're responsible for all activities under your account",
        "One account per person; no sharing accounts"
      ]
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Platform Usage",
      content: [
        "Use Mentora for legitimate educational purposes only",
        "Don't upload copyrighted content without permission",
        "Respect other users and maintain appropriate conduct",
        "Don't attempt to hack, reverse engineer, or disrupt the service",
        "Follow all applicable laws and regulations"
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "AI & Voice Features",
      content: [
        "AI responses are for educational guidance, not professional advice",
        "Voice recordings are processed for emotion detection only",
        "We're not liable for AI-generated content accuracy",
        "You retain ownership of your uploaded learning materials",
        "We may use anonymized data to improve AI models"
      ]
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Limitations & Liability",
      content: [
        "Mentora is provided 'as is' without warranties",
        "We're not liable for indirect or consequential damages",
        "Service availability may vary; we aim for 99.9% uptime",
        "Maximum liability limited to subscription fees paid",
        "You indemnify us against claims arising from your use"
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
        <nav className="px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button onClick={() => window.history.back()} className="flex items-center gap-3 group">
              <ArrowLeft className="w-5 h-5 text-primary-600 group-hover:-translate-x-1 transition-transform" />
              <span className="text-primary-600 font-medium">Back to Mentora</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-serif font-bold bg-clip-text">
                Mentora
              </span>
            </div>
          </div>
        </nav>

        {/* Header */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto glow-primary animate-float">
                <Scale className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Welcome to Mentora! These terms govern your use of our AI-powered learning platform. By using Mentora, you agree to these terms.
            </p>
            
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-neutral-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Effective: July 1, 2025</span>
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
                <CheckCircle className="w-8 h-8 text-green-500" />
                <h2 className="text-2xl font-serif font-bold text-neutral-800">Agreement Overview</h2>
              </div>
              <p className="text-neutral-700 leading-relaxed mb-4">
                These Terms of Service ("Terms") constitute a legally binding agreement between you and Mentora regarding your use of our AI-powered learning platform, including all features, tools, and services.
              </p>
              <p className="text-neutral-700 leading-relaxed">
                By creating an account or using Mentora, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
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
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-blue-500">
                      {section.icon}
                    </div>
                    <h3 className="text-xl font-serif font-bold text-neutral-800">{section.title}</h3>
                  </div>
                  
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-rose-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Subscription & Payment Terms */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl mt-8">
              <h3 className="text-xl font-serif font-bold text-neutral-800 mb-6">Subscription & Payment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">Free Tier</h4>
                  <ul className="space-y-2 text-neutral-700 text-sm">
                    <li>• Basic AI tutoring features</li>
                    <li>• Limited voice interactions</li>
                    <li>• Standard break recommendations</li>
                    <li>• Basic progress tracking</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">Mentora+ Premium</h4>
                  <ul className="space-y-2 text-neutral-700 text-sm">
                    <li>• Unlimited AI conversations</li>
                    <li>• Advanced emotion detection</li>
                    <li>• Custom voice personalities</li>
                    <li>• Priority support</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 bg-amber-100/60 backdrop-blur-sm rounded-xl border border-amber-200/50">
                <p className="text-sm text-amber-700">
                  <strong>Billing:</strong> Subscriptions auto-renew monthly. Cancel anytime in your account settings. Refunds available within 7 days of purchase.
                </p>
              </div>
            </div>

            {/* Additional Important Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {/* Intellectual Property */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                <h3 className="text-xl font-serif font-bold text-neutral-800 mb-4">Intellectual Property</h3>
                <ul className="space-y-2 text-neutral-700 text-sm">
                  <li>• You own your uploaded content</li>
                  <li>• Mentora owns the platform and AI models</li>
                  <li>• Respect third-party copyrights</li>
                  <li>• We may use anonymized data for improvements</li>
                </ul>
              </div>

              {/* Termination */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                <h3 className="text-xl font-serif font-bold text-neutral-800 mb-4">Account Termination</h3>
                <ul className="space-y-2 text-neutral-700 text-sm">
                  <li>• You may delete your account anytime</li>
                  <li>• We may suspend accounts for violations</li>
                  <li>• Data deletion follows our retention policy</li>
                  <li>• Paid subscriptions handled per billing terms</li>
                </ul>
              </div>
            </div>

            {/* Contact & Disputes */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl mt-8">
              <h3 className="text-xl font-serif font-bold text-neutral-800 mb-6">Contact & Dispute Resolution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">Get Help</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">support@mentora.ai</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">legal@mentora.ai</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">Governing Law</h4>
                  <p className="text-neutral-700 text-sm">
                    These terms are governed by the laws of London, UK. Disputes will be resolved through binding arbitration.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-12 p-6 bg-blue-100/60 backdrop-blur-sm rounded-xl border border-blue-200/50">
              <p className="text-sm text-blue-700 leading-relaxed text-center">
                <strong>Changes to Terms:</strong> We may update these terms occasionally. Significant changes will be communicated via email or platform notification. Continued use after changes indicates acceptance of the updated terms.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;