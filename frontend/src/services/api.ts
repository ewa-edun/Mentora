// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SummaryResponse {
  Summary: string;
}

export interface QuizResponse {
  'Your Quiz': string;
}

export interface AnswerResponse {
  'Your answers': string;
}

export interface OCRResponse {
  extracted_text: string;
}

export interface YouTubeResponse {
  summary: string;
  video_info?: {
    title: string;
    video_id: string;
    duration?: string;
    transcript_length?: number;
  };
  metadata?: {
    processing_time: string;
    content_type: string;
    quality: string;
  };
}

export interface YouTubeErrorResponse {
  error: string;
  message: string;
  suggestions: string[];
  video_info?: {
    title: string;
    video_id: string;
    content_type: string;
  };
  help?: {
    title: string;
    tips: string[];
  };
}

export interface EmotionResponse {
  sessionId: string;
  emotion: string;
  confidence: number;
  message: string;
  suggestions: {
    emotion: string;
    activities: Array<{
      type: string;
      title: string;
      duration: string;
      description: string;
      instructions: string[];
    }>;
    affirmation: string;
    color_scheme: {
      primary: string;
      secondary: string;
      bg: string;
    };
  };
}

export interface StoryResponse {
  title: string;
  content: string;
  duration: number;
}

export interface VoiceResponse {
  audioUrl: string;
}

export interface AvatarVideoResponse {
  videoUrl: string;
  duration: number;
}

export interface StoryCharacter {
  id: string;
  name: string;
  personality: string;
  avatar: string;
  voiceId: string;
  description: string;
  tavusAvatarId: string;
}

export interface ChartDataResponse {
  chartType: string;
  timeRange: string;
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill?: boolean;
      tension?: number;
      yAxisID?: string;
    }>;
  };
}

export interface InsightResponse {
  insights: Array<{
    type: 'achievement' | 'progress' | 'wellness' | 'strength' | 'habit' | 'recommendation' | 'encouragement';
    title: string;
    message: string;
    action: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}


export interface MemoryRecapResponse {
  totalStudyTime: number;
  sessionsCompleted: number;
  topicsStudied: string[];
  averageScore: number;
  emotionalTrends: string[];
  achievements: string[];
  insights: string[];
  recommendations: string[];
}

export interface StudyPlanResponse {
  topic: string;
  totalDuration: string;
  difficulty: string;
  days: Array<{
    day: number;
    title: string;
    description: string;
    tasks: string[];
    estimatedTime: string;
    resources: string[];
  }>;
  tips: string[];
}

// Text summarization
export const summarizeText = async (text: string): Promise<ApiResponse<SummaryResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error summarizing text:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to summarize text' 
    };
  }
};

// PDF summarization
export const summarizePDF = async (file: File): Promise<ApiResponse<SummaryResponse>> => {
  try {
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await fetch(`${API_BASE_URL}/api/summarize-pdf`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error summarizing PDF:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to summarize PDF' 
    };
  }
};

// Handwritten notes OCR
export const extractTextFromImage = async (file: File): Promise<ApiResponse<OCRResponse>> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/api/ocr`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error extracting text from image:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to extract text from image' 
    };
  }
};

// YouTube video summarization with enhanced error handling
export const summarizeYouTube = async (url: string): Promise<ApiResponse<YouTubeResponse | YouTubeErrorResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/summarize-youtube`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true, data };
    } else {
      // Return the detailed error information from the backend
      return { 
        success: false, 
        error: data.error || 'Failed to summarize YouTube video',
        data: data // Include all error details
      };
    }
  } catch (error) {
    console.error('Error summarizing YouTube video:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error - please check your connection' 
    };
  }
};

// Quiz generation
export const generateQuiz = async (text: string, difficulty: string): Promise<ApiResponse<QuizResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, difficulty : 'beginner' }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error generating quiz:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate quiz' 
    };
  }
};

// Ask questions
export const askQuestion = async (question: string): Promise<ApiResponse<AnswerResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ask-question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error asking question:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get answer' 
    };
  }
};

// Emotion detection
export const detectEmotion = async (text: string): Promise<ApiResponse<EmotionResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/detect-emotion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        text,
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error detecting emotion:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to detect emotion' 
    };
  }
};

// Get break suggestions for specific emotion
export const getBreakSuggestions = async (emotion: string): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/break-suggestions/${emotion}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error getting break suggestions:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get break suggestions' 
    };
  }
};

// Story generation
export const generateStory = async (
  topic: string, 
  character: StoryCharacter, 
  emotion: string, 
  duration: number = 240
): Promise<ApiResponse<StoryResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-story`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        topic, 
        character, 
        emotion, 
        duration 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error generating story:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate story' 
    };
  }
};

// Generate voice narration
export const generateVoiceNarration = async (
  text: string,
  voiceId: string,
  emotion: string = 'neutral',
  speed: number = 1.0,
  pitch: number = 1.0
): Promise<ApiResponse<VoiceResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-voice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        text, 
        voiceId, 
        emotion, 
        speed, 
        pitch 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error generating voice:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate voice narration' 
    };
  }
};

// Generate avatar video
export const generateAvatarVideo = async (
  script: string,
  character: StoryCharacter,
  emotion: string = 'neutral'
): Promise<ApiResponse<AvatarVideoResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-avatar-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        script, 
        character, 
        emotion 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error generating avatar video:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate avatar video' 
    };
  }
};

// Get story characters
export const getStoryCharacters = async (): Promise<ApiResponse<{ characters: StoryCharacter[] }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/characters`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error getting characters:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get story characters' 
    };
  }
};

//transcribe audio
export const transcribeAudio = async (file: File): Promise<ApiResponse<{ transcription: string }>> => {
  try {
    const formData = new FormData();
    formData.append('audio', file);

    // Add a timeout to the fetch
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15 seconds

    console.log('Sending audio to:', `${API_BASE_URL}/api/transcribe`);
    console.log('Audio file:', file);
    const response = await fetch(`${API_BASE_URL}/api/transcribe`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    console.log('Received response:', response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      return { success: false, error: data.error };
    }
    return { success: true, data };
  } catch (error: any) {
    console.error('Error transcribing audio:', error);
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Transcription timed out. Please try again, record a shorter audio, or type your message.',
      };
    }
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to transcribe audio' 
    };
  }
};

// Get chart data for analytics
export const getChartData = async (
  userId: string,
  chartType: string,
  timeRange: string
): Promise<ApiResponse<ChartDataResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics/charts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userId,
        chartType,
        timeRange
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error getting chart data:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get chart data' 
    };
  }
};

// Get AI insights for user
export const getUserInsights = async (
  userId: string,
  analyticsData: any
): Promise<ApiResponse<InsightResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userId,
        analyticsData
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error getting user insights:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get insights' 
    };
  }
};

// Memory & Habit Agent - Get memory recap
export const getMemoryRecap = async (
  userId: string,
  timeRange: string = 'week',
  customQuery?: string
): Promise<ApiResponse<MemoryRecapResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/memory/recap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userId,
        timeRange,
        customQuery
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error getting memory recap:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get memory recap' 
    };
  }
};

// Study Plan Generator - Generate 5-day study plan
export const generateStudyPlan = async (
  topic: string,
  userId?: string,
  difficulty: string = 'intermediate'
): Promise<ApiResponse<StudyPlanResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/memory/study-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        topic,
        userId,
        difficulty
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error generating study plan:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate study plan' 
    };
  }
};