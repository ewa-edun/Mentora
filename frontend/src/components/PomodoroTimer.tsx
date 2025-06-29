import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Settings, Clock, Coffee, BookOpen, CheckCircle,Volume2,VolumeX,Target,TrendingUp} from 'lucide-react';
import { getCurrentUser, createStudySession, endStudySession } from '../services/firebase';

interface PomodoroSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number; // after how many work sessions
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
}

interface PomodoroSession {
  type: 'work' | 'shortBreak' | 'longBreak';
  duration: number;
  completed: boolean;
  startTime: Date;
  endTime?: Date;
}

const PomodoroTimer: React.FC = () => {
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartWork: false,
    soundEnabled: true
  });

  const [currentSession, setCurrentSession] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completedSessions, setCompletedSessions] = useState<PomodoroSession[]>([]);
  const [workSessionsCompleted, setWorkSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [currentStudySessionId, setCurrentStudySessionId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    // Initialize audio for notifications
    audioRef.current = new Audio();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  const playNotificationSound = () => {
    if (settings.soundEnabled && audioRef.current) {
      // Create a simple beep sound using Web Audio API
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = currentSession === 'work' ? 800 : 400;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch {
        console.log('Audio notification not available');
      }
    }
  };

  const handleSessionComplete = async () => {
    setIsRunning(false);
    setIsPaused(false);
    playNotificationSound();

    const session: PomodoroSession = {
      type: currentSession,
      duration: getCurrentSessionDuration(),
      completed: true,
      startTime: new Date(Date.now() - getCurrentSessionDuration() * 60 * 1000),
      endTime: new Date()
    };

    setCompletedSessions(prev => [...prev, session]);

    // Handle Firebase session tracking for work sessions
    if (currentSession === 'work' && user && currentStudySessionId) {
      try {
        await endStudySession(currentStudySessionId, user.uid);
        setCurrentStudySessionId(null);
      } catch (error) {
        console.error('Error ending study session:', error);
      }
    }

    if (currentSession === 'work') {
      const newWorkSessionsCompleted = workSessionsCompleted + 1;
      setWorkSessionsCompleted(newWorkSessionsCompleted);

      // Determine next session type
      const nextSession = newWorkSessionsCompleted % settings.longBreakInterval === 0 
        ? 'longBreak' 
        : 'shortBreak';
      
      setCurrentSession(nextSession);
      setTimeLeft(getSessionDuration(nextSession) * 60);

      if (settings.autoStartBreaks) {
        setIsRunning(true);
      }
    } else {
      // Break completed, switch to work
      setCurrentSession('work');
      setTimeLeft(settings.workDuration * 60);

      if (settings.autoStartWork) {
        setIsRunning(true);
        // Start new Firebase study session
        if (user) {
          startNewStudySession();
        }
      }
    }

    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const sessionName = currentSession === 'work' ? 'Work session' : 'Break';
      const nextSessionName = currentSession === 'work' 
        ? (workSessionsCompleted + 1) % settings.longBreakInterval === 0 ? 'Long break' : 'Short break'
        : 'Work session';
      
      new Notification(`${sessionName} completed!`, {
        body: `Time for a ${nextSessionName.toLowerCase()}`,
        icon: '/favicon.ico'
      });
    }
  };

  const startNewStudySession = async () => {
    if (!user) return;

    try {
      const sessionId = await createStudySession({
        userId: user.uid,
        mode: 'study',
        type: 'pomodoro',
        startTime: new Date(),
        content: {
          input: 'Pomodoro work session'
        },
        metadata: {
          topic: 'Pomodoro Study Session',
        }
      });
      setCurrentStudySessionId(sessionId);
    } catch (error) {
      console.error('Error starting study session:', error);
    }
  };

  const getCurrentSessionDuration = () => {
    switch (currentSession) {
      case 'work': return settings.workDuration;
      case 'shortBreak': return settings.shortBreakDuration;
      case 'longBreak': return settings.longBreakDuration;
      default: return settings.workDuration;
    }
  };

  const getSessionDuration = (sessionType: 'work' | 'shortBreak' | 'longBreak') => {
    switch (sessionType) {
      case 'work': return settings.workDuration;
      case 'shortBreak': return settings.shortBreakDuration;
      case 'longBreak': return settings.longBreakDuration;
      default: return settings.workDuration;
    }
  };

  const startTimer = async () => {
    setIsRunning(true);
    setIsPaused(false);

    // Start Firebase session for work sessions
    if (currentSession === 'work' && user && !currentStudySessionId) {
      await startNewStudySession();
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const stopTimer = async () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(getCurrentSessionDuration() * 60);

    // End current Firebase session if active
    if (currentStudySessionId && user) {
      try {
        await endStudySession(currentStudySessionId, user.uid);
        setCurrentStudySessionId(null);
      } catch (error) {
        console.error('Error ending study session:', error);
      }
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentSession('work');
    setTimeLeft(settings.workDuration * 60);
    setWorkSessionsCompleted(0);
    setCompletedSessions([]);
    setCurrentStudySessionId(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionColor = () => {
    switch (currentSession) {
      case 'work': return 'from-red-500 to-orange-500';
      case 'shortBreak': return 'from-green-500 to-emerald-500';
      case 'longBreak': return 'from-blue-500 to-cyan-500';
      default: return 'from-red-500 to-orange-500';
    }
  };

  const getSessionIcon = () => {
    switch (currentSession) {
      case 'work': return <BookOpen className="w-8 h-8 text-white" />;
      case 'shortBreak': return <Coffee className="w-8 h-8 text-white" />;
      case 'longBreak': return <Coffee className="w-8 h-8 text-white" />;
      default: return <BookOpen className="w-8 h-8 text-white" />;
    }
  };

  const getSessionTitle = () => {
    switch (currentSession) {
      case 'work': return 'Focus Time';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return 'Focus Time';
    }
  };

  const progress = ((getCurrentSessionDuration() * 60 - timeLeft) / (getCurrentSessionDuration() * 60)) * 100;

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 bg-gradient-to-r ${getSessionColor()} rounded-2xl flex items-center justify-center shadow-lg`}>
            {getSessionIcon()}
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-neutral-800">{getSessionTitle()}</h3>
            <p className="text-neutral-600">Pomodoro Technique</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
            className={`p-3 rounded-xl transition-all duration-300 ${
              settings.soundEnabled 
                ? 'bg-green-100/60 text-green-600 hover:bg-green-100/80' 
                : 'bg-red-100/60 text-red-600 hover:bg-red-100/80'
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-neutral-700 hover:text-neutral-800 hover:bg-white/20 transition-all duration-300"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-8 p-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl">
          <h4 className="text-lg font-serif font-bold text-neutral-800 mb-4">Timer Settings</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Work Duration: {settings.workDuration} minutes
              </label>
              <input
                type="range"
                min="15"
                max="60"
                step="5"
                value={settings.workDuration}
                onChange={(e) => setSettings(prev => ({ ...prev, workDuration: parseInt(e.target.value) }))}
                className="w-full h-2 bg-purple-500/20 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Short Break: {settings.shortBreakDuration} minutes
              </label>
              <input
                type="range"
                min="3"
                max="15"
                step="1"
                value={settings.shortBreakDuration}
                onChange={(e) => setSettings(prev => ({ ...prev, shortBreakDuration: parseInt(e.target.value) }))}
                className="w-full h-2 bg-purple-500/20 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Long Break: {settings.longBreakDuration} minutes
              </label>
              <input
                type="range"
                min="15"
                max="30"
                step="5"
                value={settings.longBreakDuration}
                onChange={(e) => setSettings(prev => ({ ...prev, longBreakDuration: parseInt(e.target.value) }))}
                className="w-full h-2 bg-purple-500/20 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Long Break After: {settings.longBreakInterval} sessions
              </label>
              <input
                type="range"
                min="2"
                max="8"
                step="1"
                value={settings.longBreakInterval}
                onChange={(e) => setSettings(prev => ({ ...prev, longBreakInterval: parseInt(e.target.value) }))}
                className="w-full h-2 bg-purple-500/20 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6 mt-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.autoStartBreaks}
                onChange={(e) => setSettings(prev => ({ ...prev, autoStartBreaks: e.target.checked }))}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm text-neutral-700">Auto-start breaks</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.autoStartWork}
                onChange={(e) => setSettings(prev => ({ ...prev, autoStartWork: e.target.checked }))}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm text-neutral-700">Auto-start work sessions</span>
            </label>
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="text-center mb-8">
        <div className="relative mb-6">
          <div className="w-48 h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-grey-200"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className={`text-gradient transition-all duration-1000 ${
                  currentSession === 'work' ? 'text-red-500' : 
                  currentSession === 'shortBreak' ? 'text-green-500' : 'text-blue-500'
                }`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-neutral-800 mb-2">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-neutral-600">
                  {Math.round(progress)}% complete
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {!isRunning && !isPaused ? (
            <button
              onClick={startTimer}
              className={`bg-gradient-to-r ${getSessionColor()} text-white p-4 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-lg`}
            >
              <Play className="w-8 h-8" />
            </button>
          ) : isPaused ? (
            <button
              onClick={resumeTimer}
              className={`bg-gradient-to-r ${getSessionColor()} text-white p-4 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-lg`}
            >
              <Play className="w-8 h-8" />
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Pause className="w-8 h-8" />
            </button>
          )}
          
          <button
            onClick={stopTimer}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <Square className="w-8 h-8" />
          </button>
          
          <button
            onClick={resetTimer}
            className="bg-white/20 backdrop-blur-sm border border-white/30 text-neutral-700 p-4 rounded-2xl hover:bg-white/30 hover:border-white/50 transition-all duration-300"
          >
            <RotateCcw className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-white/40 rounded-xl">
          <div className="text-2xl font-bold text-neutral-800 mb-1">{workSessionsCompleted}</div>
          <div className="text-sm text-neutral-600">Completed</div>
        </div>
        
        <div className="text-center p-4 bg-white/20 rounded-xl">
          <div className="text-2xl font-bold text-neutral-800 mb-1">
            {workSessionsCompleted > 0 ? settings.longBreakInterval - (workSessionsCompleted % settings.longBreakInterval) : settings.longBreakInterval}
          </div>
          <div className="text-sm text-neutral-600">Until Long Break</div>
        </div>
        
        <div className="text-center p-4 bg-white/20 rounded-xl">
          <div className="text-2xl font-bold text-neutral-800 mb-1">
            {Math.floor(completedSessions.filter(s => s.type === 'work').reduce((total, s) => total + s.duration, 0) / 60)}m
          </div>
          <div className="text-sm text-neutral-600">Total Focus</div>
        </div>
      </div>

      {/* Recent Sessions */}
      {completedSessions.length > 0 && (
        <div className="p-4 bg-white/20 rounded-xl">
          <h5 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Recent Sessions
          </h5>
          <div className="flex gap-2 overflow-x-auto">
            {completedSessions.slice(-8).map((session, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  session.type === 'work' 
                    ? 'bg-red-500/20 text-red-600' 
                    : session.type === 'shortBreak'
                      ? 'bg-green-500/20 text-green-600'
                      : 'bg-blue-500/20 text-blue-600'
                }`}
                title={`${session.type} - ${session.duration}min`}
              >
                {session.completed ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-primary-100/60 backdrop-blur-sm rounded-xl border border-primary-200/50">
        <h5 className="text-sm font-medium text-primary-700 mb-2 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Pomodoro Tips
        </h5>
        <ul className="text-xs text-primary-600 space-y-1">
          <li>• Focus completely during work sessions - avoid distractions</li>
          <li>• Take breaks seriously - step away from your workspace</li>
          <li>• Use breaks for light movement, hydration, or breathing exercises</li>
          <li>• Track your progress and celebrate completed sessions</li>
          {user && <li>• Your work sessions are automatically tracked in your study analytics</li>}
        </ul>
      </div>
    </div>
  );
};

export default PomodoroTimer;