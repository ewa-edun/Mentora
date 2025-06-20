import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Mail, 
  Shield, 
  FileText,
  Heart,
  Mic,
  Zap,
  Users
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "/#features", icon: <Zap className="w-4 h-4" /> },
        { name: "About Us", href: "/#about", icon: <Users className="w-4 h-4" /> },
        { name: "Voice AI", href: "/voice", icon: <Mic className="w-4 h-4" /> }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy", icon: <Shield className="w-4 h-4" /> },
        { name: "Terms of Service", href: "/terms", icon: <FileText className="w-4 h-4" /> },
        { name: "Contact", href: "mailto:support@mentora.ai", icon: <Mail className="w-4 h-4" /> }
      ]
    }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-500/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-secondary-500/10 rounded-full blur-lg animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary-400/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="px-6 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Top Section - Brand and Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
              {/* Brand Section */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center glow-primary">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-3xl font-serif font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-white text-transparent">
                    Mentora
                  </span>
                </div>
                <p className="text-neutral-300 leading-relaxed max-w-md">
                  Your emotion-aware AI study companion. Voice-first learning that adapts to your mood, 
                  learning style, and goals for a truly personalized educational experience.
                </p>
              </div>

              {/* Navigation Links */}
              <div className="md:col-span-2 grid grid-cols-2 gap-8">
                {footerSections.map((section, index) => (
                  <div key={index}>
                    <h4 className="text-lg font-semibold text-white mb-6 font-serif">
                      {section.title}
                    </h4>
                    <ul className="space-y-4">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          {link.href.startsWith('mailto:') ? (
                            <a
                              href={link.href}
                              className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors duration-300 group"
                            >
                              <span className="text-primary-400 group-hover:text-primary-300 transition-colors">
                                {link.icon}
                              </span>
                              <span className="group-hover:translate-x-1 transition-transform duration-300">
                                {link.name}
                              </span>
                            </a>
                          ) : (
                            <Link
                              to={link.href}
                              className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors duration-300 group"
                            >
                              <span className="text-primary-400 group-hover:text-primary-300 transition-colors">
                                {link.icon}
                              </span>
                              <span className="group-hover:translate-x-1 transition-transform duration-300">
                                {link.name}
                              </span>
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 mb-8"></div>

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Copyright */}
              <div className="flex flex-col md:flex-row items-center gap-4 text-neutral-400">
                <span className="text-sm">
                  © {currentYear} Mentora. All rights reserved.
                </span>
                <div className="hidden md:block w-1 h-1 bg-neutral-600 rounded-full"></div>
                <span className="text-sm flex items-center gap-2">
                  Built with <Heart className="w-4 h-4 text-rose-400" /> for learners everywhere
                </span>
              </div>

              {/* Quick Legal Links */}
              <div className="flex items-center gap-6 text-sm">
                <Link 
                  to="/privacy" 
                  className="text-neutral-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Privacy</span>
                </Link>
                <Link 
                  to="/terms" 
                  className="text-neutral-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Terms</span>
                </Link>
                <a 
                  href="mailto:support@mentora.ai" 
                  className="text-neutral-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;