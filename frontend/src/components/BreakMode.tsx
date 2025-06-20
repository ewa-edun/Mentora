import React, { useState } from 'react';
import EmotionDetection from './break/EmotionDetection';
import BreakSuggestions from './break/BreakSuggestions';

const BreakMode: React.FC = () => {
    const [emotionData, setEmotionData] = useState<string | null>(null);

     const handleEmotionDetected = (data: any) => {
    setEmotionData(data);
  };

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
      
      <div className="max-w-6xl mx-auto space-y-8">
        {!emotionData ? (
          <EmotionDetection onEmotionDetected={handleEmotionDetected} />
        ) : (
          <BreakSuggestions emotionData={emotionData} />
        )}
      </div>
    </div>
  );
};

export default BreakMode;