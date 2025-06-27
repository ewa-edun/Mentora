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