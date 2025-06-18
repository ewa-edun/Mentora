import React from 'react';
import { Brain } from 'lucide-react';
 
const Footer: React.FC = () => {
  return (
      <footer className="px-6 py-12 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-serif font-bold">Mentora</span>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-neutral-400">
              <span>© 2025 Mentora. All rights reserved.</span>
              <span>Built with ❤️ for learners everywhere</span>
            </div>
          </div>
        </div>
      </footer>
    );
};

export default Footer;
