import React from 'react';
import { Loader2 } from 'lucide-react';

interface ActivityHeatmapProps {
  data: {
    type: string;
    data: Array<{
      date: string;
      day: string;
      hours: Array<{
        hour: number;
        intensity: number;
        label: string;
      }>;
    }>;
    maxIntensity: number;
  };
  isLoading?: boolean;
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral-600">No activity data available</p>
      </div>
    );
  }

  const getIntensityColor = (intensity: number, maxIntensity: number) => {
    const normalizedIntensity = intensity / maxIntensity;
    
    if (normalizedIntensity < 0.1) return 'bg-purple-50';
    if (normalizedIntensity < 0.2) return 'bg-purple-100';
    if (normalizedIntensity < 0.3) return 'bg-purple-200';
    if (normalizedIntensity < 0.4) return 'bg-purple-300';
    if (normalizedIntensity < 0.5) return 'bg-purple-400';
    if (normalizedIntensity < 0.6) return 'bg-purple-500';
    if (normalizedIntensity < 0.7) return 'bg-purple-600';
    if (normalizedIntensity < 0.8) return 'bg-purple-700';
    if (normalizedIntensity < 0.9) return 'bg-purple-800';
    return 'bg-purple-900';
  };

  // Group hours into 3-hour blocks for better visualization
  const hourGroups = [
    { label: 'Night', hours: [0, 1, 2, 3, 4, 5] },
    { label: 'Morning', hours: [6, 7, 8, 9, 10, 11] },
    { label: 'Afternoon', hours: [12, 13, 14, 15, 16, 17] },
    { label: 'Evening', hours: [18, 19, 20, 21, 22, 23] }
  ];

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="flex mb-2">
          <div className="w-20 flex-shrink-0"></div>
          {hourGroups.map((group, index) => (
            <div key={index} className="flex-1 text-center text-xs text-neutral-600 font-medium">
              {group.label}
            </div>
          ))}
        </div>
        
        {data.data.map((day, dayIndex) => (
          <div key={dayIndex} className="flex items-center mb-2">
            <div className="w-20 text-sm text-neutral-600 pr-2">
              {day.day} {day.date.split('-')[2]}
            </div>
            
            {hourGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="flex-1 flex">
                {group.hours.map((hour) => {
                  const hourData = day.hours.find(h => h.hour === hour);
                  const intensity = hourData ? hourData.intensity : 0;
                  
                  return (
                    <div 
                      key={hour} 
                      className={`flex-1 h-6 ${getIntensityColor(intensity, data.maxIntensity)} rounded-sm m-0.5 transition-colors duration-300 hover:opacity-80`}
                      title={`${day.day} ${hour}:00 - Activity: ${intensity}%`}
                    ></div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
        
        {/* Legend */}
        <div className="flex items-center justify-end mt-4">
          <div className="text-xs text-neutral-600 mr-2">Activity:</div>
          <div className="flex space-x-1">
            <div className="w-4 h-4 bg-purple-100 rounded-sm"></div>
            <div className="w-4 h-4 bg-purple-300 rounded-sm"></div>
            <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
            <div className="w-4 h-4 bg-purple-700 rounded-sm"></div>
            <div className="w-4 h-4 bg-purple-900 rounded-sm"></div>
          </div>
        </div>
         <div className="flex text-xs text-neutral-600 ml-2 justify-end mt-1">
            <span>Low</span>
            <span className="mx-2">Medium</span>
            <span>High</span>
          </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;