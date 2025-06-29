import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Loader2 } from 'lucide-react';

// Register Chart.js components
Chart.register(...registerables);

interface AnalyticsChartsProps {
  chartData: any;
  chartType: 'line' | 'bar' | 'pie' | 'doughnut';
  height?: number;
  isLoading?: boolean;
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ 
  chartData, 
  chartType = 'line',
  height = 300,
  isLoading = false
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // Clean up previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart if data is available
    if (chartRef.current && chartData && !isLoading) {
      const ctx = chartRef.current.getContext('2d');
      
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: chartType,
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  usePointStyle: true,
                  padding: 20,
                  font: {
                    family: "'Inter', sans-serif",
                    size: 12
                  }
                }
              },
              tooltip: {
                backgroundColor: 'rgba(146, 53, 221, 0.9)',
                titleColor: '#262626',
                bodyColor: '#525252',
                borderColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                boxPadding: 6,
                usePointStyle: true,
                titleFont: {
                  family: "'Inter', sans-serif",
                  size: 14,
                  weight: 'bold'
                },
                bodyFont: {
                  family: "'Inter', sans-serif",
                  size: 13
                }
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  font: {
                    family: "'Inter', sans-serif",
                    size: 11
                  }
                }
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                  font: {
                    family: "'Inter', sans-serif",
                    size: 11
                  }
                }
              }
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, chartType, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
        <p className="text-neutral-600">No data available</p>
      </div>
    );
  }

  return (
     <div className="overflow-x-auto w-full">
      <div className="min-w-[600px]" style={{ height: `${height}px` }}>
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default AnalyticsCharts;