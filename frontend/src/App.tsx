import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StudyMode from './components/StudyMode';
import BreakMode from './components/BreakMode';
import VoicePanel from './components/VoicePanel';

function App() {
  const [currentMode, setCurrentMode] = useState<'study' | 'break'>('study');

  const toggleMode = () => {
    setCurrentMode(currentMode === 'study' ? 'break' : 'study');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-indigo-50">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239d75ff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      <div className="relative z-10">
        <Navbar currentMode={currentMode} onToggleMode={toggleMode} />
        
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="animate-float">
            {currentMode === 'study' ? <StudyMode /> : <BreakMode />}
          </div>
        </main>
        
        <VoicePanel />
      </div>
    </div>
  );
}

export default App;