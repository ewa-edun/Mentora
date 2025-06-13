import React, { useState } from 'react';
import EmotionDetection from './break/EmotionDetection';
import BreakSuggestions from './break/BreakSuggestions';

const BreakMode: React.FC = () => {
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-gradient mb-4">
          Break Mode
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Take a mindful pause. Let's check in with how you're feeling and find the perfect way to recharge
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <EmotionDetection onEmotionDetected={setDetectedEmotion} />
        {detectedEmotion && <BreakSuggestions emotion={detectedEmotion} />}
      </div>
    </div>
  );
};

export default BreakMode;