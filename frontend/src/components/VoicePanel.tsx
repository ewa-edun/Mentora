import React from 'react';
import { useNavigate } from 'react-router-dom';
import {  MessageCircle } from 'lucide-react';

const VoicePanel: React.FC = () => {
 
  const navigate = useNavigate();

  const handleVoiceClick = () => {
    // Navigate to the dedicated voice page
    navigate('/voice');
  };

  return (
    <>
      <button
        onClick={handleVoiceClick}
        className= "fixed bottom-6 right-6 w-14 h-14  bg-gradient-to-r from-lavender-500 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
      >
          <MessageCircle className="w-6 h-6 text-white" />
      </button>
    </>
  );
};

export default VoicePanel;