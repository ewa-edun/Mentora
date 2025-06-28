import React, { useEffect, useState } from "react";

interface SmartRemindersProps {
  /** Session start time (Date object) */
  sessionStartTime: Date | null;
  /** Number of user actions/messages (optional, for revise/slow down logic) */
  userActions?: number;
  /** Current emotion (optional, for emotion-aware reminders) */
  emotion?: string;
  /** Custom thresholds (in minutes) */
  breakThreshold?: number;
  reviseThreshold?: number;
  slowDownThreshold?: number;
}

const DEFAULT_BREAK = 25; // minutes
const DEFAULT_REVISE = 45; // minutes
const DEFAULT_SLOW = 10; // actions/messages in 5 min

const SmartReminders: React.FC<SmartRemindersProps> = ({
  sessionStartTime,
  userActions = 0,
  emotion,
  breakThreshold = DEFAULT_BREAK,
  reviseThreshold = DEFAULT_REVISE,
  slowDownThreshold = DEFAULT_SLOW,
}) => {
  const [reminder, setReminder] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Timer to track session duration
  useEffect(() => {
    if (!sessionStartTime) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - sessionStartTime.getTime()) / 60000));
    }, 60000);
    setElapsed(Math.floor((Date.now() - sessionStartTime.getTime()) / 60000));
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  // Reminder logic
  useEffect(() => {
    // Suggest break
    if (elapsed > 0 && elapsed % breakThreshold === 0) {
      setReminder("⏰ Time for a break! Stand up, stretch, and relax for a few minutes.");
    }
    // Suggest revision
    else if (elapsed > 0 && elapsed % reviseThreshold === 0) {
      setReminder("🔄 Time to review what you've learned! Quick revision helps retention.");
    }
    // Suggest slow down if too many actions/messages
    else if (userActions >= slowDownThreshold) {
      setReminder("🐢 You're moving fast! Take a moment to reflect or slow down for better understanding.");
    }
    // Emotion-aware suggestion
    else if (emotion === "stressed" || emotion === "tired") {
      setReminder("💡 You seem a bit stressed and tired. Consider a short break or some deep breaths.");
    }
    // Clear reminder after 10 seconds
    if (reminder) {
      const timeout = setTimeout(() => setReminder(null), 10000);
      return () => clearTimeout(timeout);
    }
  }, [elapsed, userActions, emotion, breakThreshold, reviseThreshold, slowDownThreshold, reminder]);

  if (!reminder) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-3 rounded-xl shadow-lg text-center font-medium text-lg animate-fade-in">
        {reminder}
      </div>
    </div>
  );
};

export default SmartReminders;