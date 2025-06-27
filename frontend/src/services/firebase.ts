// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import {  getAuth,  Auth, signInWithEmailAndPassword,  createUserWithEmailAndPassword,  sendPasswordResetEmail, signOut, onAuthStateChanged, User, UserCredential, updateProfile, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {  getFirestore,  Firestore, doc,  setDoc,  getDoc,  updateDoc,  collection,  addDoc,  query,  where,  orderBy,  getDocs, deleteDoc, serverTimestamp, DocumentData, QuerySnapshot, limit, Timestamp, FieldValue } from 'firebase/firestore';
 // import {getStorage, Storage,ref, uploadBytes, getDownloadURL, deleteObject,uploadBytesResumable,UploadTask} from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
//export const storage: Storage = getStorage(app);
export const analytics: Analytics = getAnalytics(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();


// Types
export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp | Date | import('firebase/firestore').FieldValue | null;
  lastLoginAt: Timestamp | Date | import('firebase/firestore').FieldValue | null;
  preferences?: {
    voiceEnabled: boolean;
    emotionDetection: boolean;
    studyReminders: boolean;
    breakReminders: boolean;
  };
  studyStats?: {
    totalStudyTime: number;
    sessionsCompleted: number;
    quizzesCompleted: number;
    averageScore: number;
    totalBreakTime: number;
    emotionalCheckIns: number;
    streakDays: number;
    lastStudyDate?: Timestamp | Date | null;
  };
}

export interface StudySession {
  id?: string;
  userId: string;
  mode: 'study' | 'break';
  type: 'text_summary' | 'pdf_summary' | 'quiz' | 'voice_chat' | 'ocr' | 'youtube' | 'storytelling';
  startTime: Timestamp | Date | null;
  endTime?: Timestamp | Date | import('firebase/firestore').FieldValue | null;
  duration?: number; // in seconds
  content?: {
    input?: string;
    output?: string;
    summary?: string;
    quiz?: string;
    score?: number;
    totalQuestions?: number;
    correctAnswers?: number;
  };
  emotion?: string;
  emotionConfidence?: number;
  metadata?: {
    wordCount?: number;
    difficulty?: string;
    topic?: string;
    fileType?: string;
    fileName?: string;
  };
  createdAt: Timestamp | Date | null;
}

export interface BreakSession {
  id?: string;
  userId: string;
  startTime: Timestamp | Date | null;
  endTime?: Timestamp | Date | import('firebase/firestore').FieldValue | null;
  duration?: number; // in seconds
  emotion: string;
  emotionConfidence: number;
  activities: Array<{
    type: string;
    title: string;
    duration: string;
    completed: boolean;
    completedAt?: Timestamp | Date | null;
  }>;
  affirmation?: string;
  mood?: {
    before: string;
    after?: string;
  };
  notes?: string;
  createdAt: Timestamp | Date | null;
}

export interface EmotionEntry {
  id?: string;
  userId: string;
  emotion: string;
  confidence: number;
  context: 'study' | 'break' | 'general';
  trigger?: string;
  inputText?: string;
  timestamp: Timestamp | Date | null;
  sessionId?: string;
}

export interface LearningProgress {
  id?: string;
  userId: string;
  topic: string;
  subject?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number; // 0-100
  timeSpent: number; // in seconds
  quizScores: number[];
  lastAccessed: Timestamp | Date | null;
  mastered: boolean;
  createdAt: Timestamp | Date | null;
}

export interface VoiceChat {
  id?: string;
  userId: string;
  messages: Array<{
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Timestamp | Date | FieldValue | null;
    isVoice?: boolean;
    emotion?: string;
  }>;
  startTime: Timestamp | Date | FieldValue | null;
  endTime?: Timestamp | Date | FieldValue | null;
  duration?: number; // in seconds
  totalMessages?: number;
  topics?: string[];
  summary?: string;
  createdAt?: Timestamp | Date | FieldValue | null;
  updatedAt?: Timestamp | Date | FieldValue | null;
}

export interface StorySession {
  id?: string;
  userId: string;
  title: string;
  content: string;
  character: {
    id: string;
    name: string;
    personality: string;
    avatar: string;
  };
  emotion: string;
  topic: string;
  duration: number; // target duration in seconds
  actualDuration?: number; // actual time spent
  hasAudio: boolean;
  hasVideo: boolean;
  audioUrl?: string;
  videoUrl?: string;
  rating?: number; // 1-5 stars
  completed: boolean;
  startTime: Timestamp | Date | null;
  endTime?: Timestamp | Date | null;
  createdAt: Timestamp | Date | null;
}

// =============================================================================
// AUTHENTICATION FUNCTIONS
// =============================================================================

/**
 * Register a new user with email and password
 */
export const registerUser = async (email: string, password: string, displayName?: string): Promise<AuthResult> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with display name
    if (displayName) {
      await updateProfile(user, { displayName });
    }

    // Send email verification
    await sendEmailVerification(user);

    // Create user profile in Firestore
    await createUserProfile(user, { displayName });

    return { success: true, user };
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
};

/**
 * Sign in user with email and password
 */
export const loginUser = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login time
    await updateUserProfile(userCredential.user.uid, {
      lastLoginAt: serverTimestamp()
    });

    return { success: true, user: userCredential.user };
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Create or update user profile
    await createUserProfile(result.user);
    
    return { success: true, user: result.user };
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
};

/**
 * Reset user password
 */
export const resetPassword = async (email: string): Promise<AuthResult> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
};

/**
 * Sign out current user
 */
export const logoutUser = async (): Promise<AuthResult> => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
};

/**
 * Monitor authentication state changes
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// =============================================================================
// FIRESTORE DATABASE FUNCTIONS
// =============================================================================

/**
 * Create user profile in Firestore
 */
export const createUserProfile = async (user: User, additionalData?: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: additionalData?.displayName || user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        preferences: {
          voiceEnabled: true,
          emotionDetection: true,
          studyReminders: true,
          breakReminders: true
        },
        studyStats: {
          totalStudyTime: 0,
          sessionsCompleted: 0,
          quizzesCompleted: 0,
          averageScore: 0,
          totalBreakTime: 0,
          emotionalCheckIns: 0,
          streakDays: 0,
          lastStudyDate: null
        }
      };

      await setDoc(userRef, userProfile);
    } else {
      // Update last login time for existing users
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Update user profile in Firestore
 */
export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// =============================================================================
// STUDY SESSION FUNCTIONS
// =============================================================================

/**
 * Create a new study session
 */
export const createStudySession = async (sessionData: Omit<StudySession, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const sessionsRef = collection(db, 'studySessions');
    const docRef = await addDoc(sessionsRef, {
      ...sessionData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating study session:', error);
    throw error;
  }
};

/**
 * Update study session
 */
export const updateStudySession = async (sessionId: string, data: Partial<StudySession>): Promise<void> => {
  try {
    const sessionRef = doc(db, 'studySessions', sessionId);
    await updateDoc(sessionRef, data);
  } catch (error) {
    console.error('Error updating study session:', error);
    throw error;
  }
};

/**
 * End study session and update stats
 */
export const endStudySession = async (sessionId: string, userId: string): Promise<void> => {
  try {
    const sessionRef = doc(db, 'studySessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (!sessionSnap.exists()) {
      throw new Error('Session not found');
    }
    
    const sessionData = sessionSnap.data() as StudySession;
    const endTime = new Date();
    const startTime = sessionData.startTime instanceof Timestamp 
      ? sessionData.startTime.toDate() 
      : new Date(sessionData.startTime!);
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    // Update session
    await updateDoc(sessionRef, {
      endTime: serverTimestamp(),
      duration
    });
    
    // Update user stats
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as UserProfile;
      const currentStats = userData.studyStats || {
        totalStudyTime: 0,
        sessionsCompleted: 0,
        quizzesCompleted: 0,
        averageScore: 0,
        totalBreakTime: 0,
        emotionalCheckIns: 0,
        streakDays: 0
      };
      
      await updateDoc(userRef, {
        'studyStats.totalStudyTime': currentStats.totalStudyTime + duration,
        'studyStats.sessionsCompleted': currentStats.sessionsCompleted + 1,
        'studyStats.lastStudyDate': serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error ending study session:', error);
    throw error;
  }
};

/**
 * Get user's study sessions
 */
export const getUserStudySessions = async (userId: string, limitCount?: number): Promise<StudySession[]> => {
  try {
    const sessionsRef = collection(db, 'studySessions');
    let q = query(
      sessionsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    const sessions: StudySession[] = [];

    querySnapshot.forEach((doc) => {
      sessions.push({
        id: doc.id,
        ...doc.data()
      } as StudySession);
    });

    return sessions;
  } catch (error) {
    console.error('Error getting study sessions:', error);
    throw error;
  }
};

// =============================================================================
// BREAK SESSION FUNCTIONS
// =============================================================================

/**
 * Create a new break session
 */
export const createBreakSession = async (sessionData: Omit<BreakSession, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const sessionsRef = collection(db, 'breakSessions');
    const docRef = await addDoc(sessionsRef, {
      ...sessionData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating break session:', error);
    throw error;
  }
};

/**
 * Update break session
 */
export const updateBreakSession = async (sessionId: string, data: Partial<BreakSession>): Promise<void> => {
  try {
    const sessionRef = doc(db, 'breakSessions', sessionId);
    await updateDoc(sessionRef, data);
  } catch (error) {
    console.error('Error updating break session:', error);
    throw error;
  }
};

/**
 * End break session and update stats
 */
export const endBreakSession = async (sessionId: string, userId: string, mood?: string): Promise<void> => {
  try {
    const sessionRef = doc(db, 'breakSessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (!sessionSnap.exists()) {
      throw new Error('Break session not found');
    }
    
    const sessionData = sessionSnap.data() as BreakSession;
    const endTime = new Date();
    const startTime = sessionData.startTime instanceof Timestamp 
      ? sessionData.startTime.toDate() 
      : new Date(sessionData.startTime!);
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    // Update session
    const updateData: Partial<BreakSession> = {
      endTime: serverTimestamp(),
      duration
    };
    
    if (mood) {
      updateData.mood = {
        before: sessionData.mood?.before ?? '',
        after: mood
      };
    }
    
    await updateDoc(sessionRef, updateData);
    
    // Update user stats
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as UserProfile;
      const currentStats = userData.studyStats || {
        totalStudyTime: 0,
        sessionsCompleted: 0,
        quizzesCompleted: 0,
        averageScore: 0,
        totalBreakTime: 0,
        emotionalCheckIns: 0,
        streakDays: 0
      };
      
      await updateDoc(userRef, {
        'studyStats.totalBreakTime': currentStats.totalBreakTime + duration,
        'studyStats.emotionalCheckIns': currentStats.emotionalCheckIns + 1
      });
    }
  } catch (error) {
    console.error('Error ending break session:', error);
    throw error;
  }
};

/**
 * Get user's break sessions
 */
export const getUserBreakSessions = async (userId: string, limitCount?: number): Promise<BreakSession[]> => {
  try {
    const sessionsRef = collection(db, 'breakSessions');
    let q = query(
      sessionsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    const sessions: BreakSession[] = [];

    querySnapshot.forEach((doc) => {
      sessions.push({
        id: doc.id,
        ...doc.data()
      } as BreakSession);
    });

    return sessions;
  } catch (error) {
    console.error('Error getting break sessions:', error);
    throw error;
  }
};

// =============================================================================
// EMOTION TRACKING FUNCTIONS
// =============================================================================

/**
 * Record emotion entry
 */
export const recordEmotionEntry = async (emotionData: Omit<EmotionEntry, 'id' | 'timestamp'>): Promise<string> => {
  try {
    const emotionsRef = collection(db, 'emotions');
    const docRef = await addDoc(emotionsRef, {
      ...emotionData,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error recording emotion entry:', error);
    throw error;
  }
};

/**
 * Get user's emotion history
 */
export const getUserEmotionHistory = async (userId: string, limitCount: number = 50): Promise<EmotionEntry[]> => {
  try {
    const emotionsRef = collection(db, 'emotions');
    const q = query(
      emotionsRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const emotions: EmotionEntry[] = [];

    querySnapshot.forEach((doc) => {
      emotions.push({
        id: doc.id,
        ...doc.data()
      } as EmotionEntry);
    });

    return emotions;
  } catch (error) {
    console.error('Error getting emotion history:', error);
    throw error;
  }
};

// =============================================================================
// LEARNING PROGRESS FUNCTIONS
// =============================================================================

/**
 * Update learning progress for a topic
 */
export const updateLearningProgress = async (progressData: Omit<LearningProgress, 'id' | 'createdAt' | 'lastAccessed'>): Promise<void> => {
  try {
    const progressRef = collection(db, 'learningProgress');
    const q = query(
      progressRef,
      where('userId', '==', progressData.userId),
      where('topic', '==', progressData.topic)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Create new progress entry
      await addDoc(progressRef, {
        ...progressData,
        createdAt: serverTimestamp(),
        lastAccessed: serverTimestamp()
      });
    } else {
      // Update existing progress
      const docRef = querySnapshot.docs[0].ref;
      const existingData = querySnapshot.docs[0].data() as LearningProgress;
      
      await updateDoc(docRef, {
        progress: progressData.progress,
        timeSpent: (existingData.timeSpent || 0) + (progressData.timeSpent || 0),
        quizScores: [...(existingData.quizScores || []), ...(progressData.quizScores || [])],
        difficulty: progressData.difficulty,
        mastered: progressData.mastered,
        lastAccessed: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error updating learning progress:', error);
    throw error;
  }
};

/**
 * Get user's learning progress
 */
export const getUserLearningProgress = async (userId: string): Promise<LearningProgress[]> => {
  try {
    const progressRef = collection(db, 'learningProgress');
    const q = query(
      progressRef,
      where('userId', '==', userId),
      orderBy('lastAccessed', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const progress: LearningProgress[] = [];

    querySnapshot.forEach((doc) => {
      progress.push({
        id: doc.id,
        ...doc.data()
      } as LearningProgress);
    });

    return progress;
  } catch (error) {
    console.error('Error getting learning progress:', error);
    throw error;
  }
};

/**
 * Delete study session
 */
export const deleteStudySession = async (sessionId: string): Promise<void> => {
  try {
    const sessionRef = doc(db, 'studySessions', sessionId);
    await deleteDoc(sessionRef);
  } catch (error) {
    console.error('Error deleting study session:', error);
    throw error;
  }
};

/**
 * Delete break session
 */
export const deleteBreakSession = async (sessionId: string): Promise<void> => {
  try {
    const sessionRef = doc(db, 'breakSessions', sessionId);
    await deleteDoc(sessionRef);
  } catch (error) {
    console.error('Error deleting break session:', error);
    throw error;
  }
};


// =============================================================================
// VOICE CHATS FUNCTIONS
// =============================================================================
// Create a new voice chat
export const createVoiceChat = async (chatData: Omit<VoiceChat, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const chatsRef = collection(db, 'voiceChats');
    const docRef = await addDoc(chatsRef, {
      ...chatData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating voice chat:', error);
    throw error;
  }
};

// Update an existing voice chat
export const updateVoiceChat = async (chatId: string, data: Partial<VoiceChat>): Promise<void> => {
  try {
    const chatRef = doc(db, 'voiceChats', chatId);
    await updateDoc(chatRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating voice chat:', error);
    throw error;
  }
};

// Get recent voice chats for a user
export const getUserVoiceChats = async (userId: string, limitCount: number = 5): Promise<VoiceChat[]> => {
  try {
    const chatsRef = collection(db, 'voiceChats');
    const q = query(
      chatsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const chats: VoiceChat[] = [];
    querySnapshot.forEach((docSnap) => {
      chats.push({
        id: docSnap.id,
        ...docSnap.data()
      } as VoiceChat);
    });
    return chats;
  } catch (error) {
    console.error('Error getting user voice chats:', error);
    throw error;
  }
};

// Re-export serverTimestamp for convenience
export { serverTimestamp };

// =============================================================================
// STORYTELLING FUNCTIONS
// =============================================================================
// Create a new story session
export const createStorySession = async (sessionData: Omit<StorySession, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const sessionsRef = collection(db, 'storySessions');
    const docRef = await addDoc(sessionsRef, {
      ...sessionData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating story session:', error);
    throw error;
  }
};

// Update a story session
export const updateStorySession = async (sessionId: string, data: Partial<StorySession>): Promise<void> => {
  try {
    const sessionRef = doc(db, 'storySessions', sessionId);
    await updateDoc(sessionRef, data);
  } catch (error) {
    console.error('Error updating story session:', error);
    throw error;
  }
};

// Get user's story sessions
export const getUserStorySessions = async (userId: string, limitCount: number = 5): Promise<StorySession[]> => {
  try {
    const sessionsRef = collection(db, 'storySessions');
    const q = query(
      sessionsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const sessions: StorySession[] = [];
    querySnapshot.forEach((docSnap) => {
      sessions.push({
        id: docSnap.id,
        ...docSnap.data()
      } as StorySession);
    });
    return sessions;
  } catch (error) {
    console.error('Error getting story sessions:', error);
    throw error;
  }
};

// Rate a story session
export const rateStorySession = async (sessionId: string, rating: number): Promise<void> => {
  try {
    const sessionRef = doc(db, 'storySessions', sessionId);
    await updateDoc(sessionRef, { rating });
  } catch (error) {
    console.error('Error rating story session:', error);
    throw error;
  }
};

// =============================================================================
// ANALYTICS & INSIGHTS FUNCTIONS
// =============================================================================

/**
 * Get user analytics dashboard data
 */
export const getUserAnalytics = async (userId: string): Promise<{
  studySessions: StudySession[];
  breakSessions: BreakSession[];
  emotionHistory: EmotionEntry[];
  learningProgress: LearningProgress[];
  stats: {
    totalStudyTime: number;
    totalBreakTime: number;
    averageSessionLength: number;
    mostCommonEmotion: string;
    streakDays: number;
    topicsStudied: number;
    voiceChats: number;
    storiesGenerated: number;
  };
}> => {
  try {
    const [studySessions, breakSessions, emotionHistory, learningProgress] = await Promise.all([
      getUserStudySessions(userId, 30),
      getUserBreakSessions(userId, 30),
      getUserEmotionHistory(userId, 100),
      getUserLearningProgress(userId)
    ]);

    // Calculate stats
    const totalStudyTime = studySessions.reduce((total, session) => total + (session.duration || 0), 0);
    const totalBreakTime = breakSessions.reduce((total, session) => total + (session.duration || 0), 0);
    const averageSessionLength = studySessions.length > 0 ? totalStudyTime / studySessions.length : 0;
    
    // Find most common emotion
    const emotionCounts: { [key: string]: number } = {};
    emotionHistory.forEach(entry => {
      emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
    });
    const mostCommonEmotion = Object.keys(emotionCounts).reduce((a, b) => 
      emotionCounts[a] > emotionCounts[b] ? a : b, 'neutral'
    );

    return {
      studySessions,
      breakSessions,
      emotionHistory,
      learningProgress,
      stats: {
        totalStudyTime,
        totalBreakTime,
        averageSessionLength,
        mostCommonEmotion,
        streakDays: 0, // Calculate based on consecutive study days
        topicsStudied: learningProgress.length
      }
    };
  } catch (error) {
    console.error('Error getting user analytics:', error);
    throw error;
  }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!auth.currentUser;
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Wait for auth to initialize
 */
export const waitForAuth = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Export the Firebase app instance
export default app;