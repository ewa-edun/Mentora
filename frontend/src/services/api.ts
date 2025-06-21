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
  title?: string;
  duration?: string;
}


export interface StoryRequest {
  topic: string;
  character: {
    id: string;
    name: string;
    personality: string;
    voiceId: string;
  };
  emotion: string;
  duration?: number;
}

export interface StoryResponse {
  title: string;
  content: string;
  duration: number;
  audioUrl?: string;
  videoUrl?: string;
}

export interface AvatarVideoRequest {
  script: string;
  character: {
    id: string;
    name: string;
    personality: string;
  };
  emotion: string;
}

export interface VoiceRequest {
  text: string;
  voiceId: string;
  emotion: string;
  speed?: number;
  pitch?: number;
}

export interface EmotionResponse {
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

// YouTube video summarization
export const summarizeYouTube = async (url: string): Promise<ApiResponse<YouTubeResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/summarize-youtube`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error summarizing YouTube video:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to summarize YouTube video' 
    };
  }
};

// Quiz generation
export const generateQuiz = async (text: string): Promise<ApiResponse<QuizResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-quiz`, {
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

// Storytelling API service

// Generate story content using Gemini
export const generateStory = async (request: StoryRequest): Promise<{ success: boolean; data?: StoryResponse; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-story`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
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

// Generate avatar video using Tavus
export const generateAvatarVideo = async (request: AvatarVideoRequest): Promise<{ success: boolean; data?: { videoUrl: string }; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-avatar-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
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

// Generate voice narration using ElevenLabs
export const generateVoiceNarration = async (request: VoiceRequest): Promise<{ success: boolean; data?: { audioUrl: string }; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-voice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error generating voice narration:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate voice narration' 
    };
  }
};