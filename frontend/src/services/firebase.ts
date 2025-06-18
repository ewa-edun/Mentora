// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import {  getAuth,  Auth, signInWithEmailAndPassword,  createUserWithEmailAndPassword,  sendPasswordResetEmail, signOut, onAuthStateChanged, User, UserCredential, updateProfile, sendEmailVerification, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import {  getFirestore,  Firestore, doc,  setDoc,  getDoc,  updateDoc,  collection,  addDoc,  query,  where,  orderBy,  getDocs, deleteDoc, serverTimestamp, DocumentData, QuerySnapshot } from 'firebase/firestore';
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
export const facebookProvider = new FacebookAuthProvider();
export const twitterProvider = new TwitterAuthProvider();

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
  createdAt: import('firebase/firestore').Timestamp | Date | import('firebase/firestore').FieldValue | null;
  lastLoginAt: import('firebase/firestore').Timestamp | Date | import('firebase/firestore').FieldValue | null;
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
  };
}

export interface StudySession {
  id?: string;
  userId: string;
  mode: 'study' | 'break';
  startTime: import('firebase/firestore').Timestamp | Date | null;
  endTime?: import('firebase/firestore').Timestamp | Date | null;
  duration?: number;
  content?: string;
  emotion?: string;
  score?: number;
  createdAt: import('firebase/firestore').Timestamp | Date | null;
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
 * Sign in with Facebook
 */
export const signInWithFacebook = async (): Promise<AuthResult> => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    
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
          averageScore: 0
        }
      };

      await setDoc(userRef, userProfile);
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
 * Get user's study sessions
 */
export const getUserStudySessions = async (userId: string, limit?: number): Promise<StudySession[]> => {
  try {
    const sessionsRef = collection(db, 'studySessions');
    let q = query(
      sessionsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (limit) {
      q = query(q);
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