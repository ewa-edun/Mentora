import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Edit3, Save, X, Trash2, Sparkles, Settings, Shield, Bell, Mic, Heart, BookOpen, Trophy, Clock, ArrowLeft, AlertTriangle, TrendingUp, BarChart3} from 'lucide-react';
import { getCurrentUser, getUserProfile, updateUserProfile, logoutUser, getUserAnalytics, UserProfile } from '../services/firebase';
import VoicePanel from '../components/VoicePanel';


const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [editData, setEditData] = useState({
    displayName: '',
    preferences: {
      voiceEnabled: true,
      emotionDetection: true,
      studyReminders: true,
      breakReminders: true
    }
  });

  const loadUserData = React.useCallback(async () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }

      setUser(currentUser);
      
      // Load profile and analytics data
      const [userProfile, analyticsData] = await Promise.all([
        getUserProfile(currentUser.uid),
        getUserAnalytics(currentUser.uid)
      ]);
      
      if (userProfile) {
        setProfile(userProfile);
        setAnalytics(analyticsData);
        setEditData({
          displayName: userProfile.displayName || '',
          preferences: userProfile.preferences || {
            voiceEnabled: true,
            emotionDetection: true,
            studyReminders: true,
            breakReminders: true
          }
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    // Reset edit data to original values
    if (profile) {
      setEditData({
        displayName: profile.displayName || '',
        preferences: profile.preferences || {
          voiceEnabled: true,
          emotionDetection: true,
          studyReminders: true,
          breakReminders: true
        }
      });
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setIsSaving(true);
    setError('');

    try {
      await updateUserProfile(user.uid, {
        displayName: editData.displayName,
        preferences: editData.preferences
      });

      // Update local state
      setProfile({
        ...profile,
        displayName: editData.displayName,
        preferences: editData.preferences
      });

      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      // Note: In a real app, you'd want to delete the user's Firestore data first
      // and then delete the auth account. For now, we'll just sign them out.
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account');
      setIsDeleting(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      return 'N/A';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-secondary-200/30 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-primary-100/40 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239d75ff%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/home" className="flex items-center gap-3 group">
              <ArrowLeft className="w-5 h-5 text-primary-600 group-hover:-translate-x-1 transition-transform" />
              <span className="text-primary-600 font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-lavender-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-serif font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text">
                Mentora
              </span>
            </div>
          </div>
        </nav>

         <div className="px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto glow-primary animate-float">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-15 h-15 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse-slow">
                    <a
                      href="https://bolt.new/"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Powered by Bolt.new"
                      className="block w-16 h-16"
                    >
                  <img
                    src='../../white_bolt.png'
                    alt="Bolt.new logo"
                    className="w-16 h-16 object-contain"
                    draggable={false}
                  />
                 </a>
               </div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse-slow">
                 <Sparkles className="w-4 h-4 text-white" />
               </div>
              </div>
              <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-black mb-4">
                Your Profile
              </h1>
              <p className="text-xl text-neutral-600">
                Manage your account settings and learning preferences
              </p>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 p-4 bg-green-100/80 backdrop-blur-sm border border-green-200/50 rounded-xl">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-xl">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Information */}
              <div className="lg:col-span-2 space-y-8">
                {/* Basic Information */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <User className="w-6 h-6 text-primary-600" />
                      <h2 className="text-xl font-serif font-bold text-neutral-800">Basic Information</h2>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Display Name */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Display Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.displayName}
                          onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-0 bg-white/20 backdrop-blur-sm placeholder-neutral-600 text-neutral-800 focus:bg-white/30 focus:ring-2 focus:ring-primary-400 focus:outline-none transition-all duration-300"
                          placeholder="Enter your display name"
                        />
                      ) : (
                        <p className="text-neutral-800 font-medium">{profile?.displayName || 'Not set'}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Email Address
                      </label>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-neutral-600" />
                        <p className="text-neutral-800">{user?.email}</p>
                      </div>
                    </div>

                    {/* Member Since */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Member Since
                      </label>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-neutral-600" />
                        <p className="text-neutral-800">{formatDate(profile?.createdAt)}</p>
                      </div>
                    </div>

                    {/* Last Login */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Last Login
                      </label>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-neutral-600" />
                        <p className="text-neutral-800">{formatDate(profile?.lastLoginAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Edit Actions */}
                  {isEditing && (
                    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/20">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium py-2 px-4 rounded-xl hover:from-primary-700 hover:to-secondary-700 transform hover:scale-105 focus:ring-4 focus:ring-primary-200 focus:outline-none transition-all duration-300 shadow-lg"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span className="text-white">Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 text-white" />
                            <span className="text-white">Save Changes</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-neutral-700 font-medium py-2 px-4 rounded-xl hover:bg-white/30 hover:border-white/50 transition-all duration-300"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Learning Preferences */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Settings className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-serif font-bold text-neutral-800">Learning Preferences</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Voice Features */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mic className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium text-neutral-800">Voice Features</p>
                          <p className="text-sm text-neutral-600">Enable voice interactions and commands</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditData({
                          ...editData,
                          preferences: {
                            ...editData.preferences,
                            voiceEnabled: !editData.preferences.voiceEnabled
                          }
                        })}
                        disabled={!isEditing}
                        className={`w-12 h-6 rounded-full transition-all duration-300 ${
                          editData.preferences.voiceEnabled
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                            : 'bg-neutral-300'
                        } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                            editData.preferences.voiceEnabled ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Emotion Detection */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-rose-500" />
                        <div>
                          <p className="font-medium text-neutral-800">Emotion Detection</p>
                          <p className="text-sm text-neutral-600">AI-powered mood analysis for personalized breaks</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditData({
                          ...editData,
                          preferences: {
                            ...editData.preferences,
                            emotionDetection: !editData.preferences.emotionDetection
                          }
                        })}
                        disabled={!isEditing}
                        className={`w-12 h-6 rounded-full transition-all duration-300 ${
                          editData.preferences.emotionDetection
                            ? 'bg-gradient-to-r from-rose-500 to-pink-500'
                            : 'bg-neutral-300'
                        } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                            editData.preferences.emotionDetection ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Study Reminders */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-neutral-800">Study Reminders</p>
                          <p className="text-sm text-neutral-600">Get notified about study sessions</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditData({
                          ...editData,
                          preferences: {
                            ...editData.preferences,
                            studyReminders: !editData.preferences.studyReminders
                          }
                        })}
                        disabled={!isEditing}
                        className={`w-12 h-6 rounded-full transition-all duration-300 ${
                          editData.preferences.studyReminders
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                            : 'bg-neutral-300'
                        } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                            editData.preferences.studyReminders ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Break Reminders */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium text-neutral-800">Break Reminders</p>
                          <p className="text-sm text-neutral-600">Gentle nudges to take wellness breaks</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditData({
                          ...editData,
                          preferences: {
                            ...editData.preferences,
                            breakReminders: !editData.preferences.breakReminders
                          }
                        })}
                        disabled={!isEditing}
                        className={`w-12 h-6 rounded-full transition-all duration-300 ${
                          editData.preferences.breakReminders
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-neutral-300'
                        } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                            editData.preferences.breakReminders ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Study Stats */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Trophy className="w-6 h-6 text-amber-500" />
                    <h3 className="text-lg font-serif font-bold text-neutral-800">Study Stats</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Total Study Time</span>
                      <span className="font-medium text-neutral-800">
                        {analytics ? formatTime(analytics.stats.totalStudyTime) : '0m'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Sessions Completed</span>
                      <span className="font-medium text-neutral-800">
                        {analytics ? analytics.studySessions.length : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Wellness Breaks</span>
                      <span className="font-medium text-neutral-800">
                        {analytics ? analytics.breakSessions.length : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Topics Studied</span>
                      <span className="font-medium text-neutral-800">
                        {analytics ? analytics.stats.topicsStudied : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Most Common Emotion</span>
                      <span className="font-medium text-neutral-800 capitalize">
                        {analytics ? analytics.stats.mostCommonEmotion : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Learning Progress */}
                {analytics && analytics.learningProgress.length > 0 && (
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingUp className="w-6 h-6 text-green-500" />
                      <h3 className="text-lg font-serif font-bold text-neutral-800">Learning Progress</h3>
                    </div>

                    <div className="space-y-4">
                      {analytics.learningProgress.slice(0, 5).map((progress: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-neutral-700">{progress.topic}</span>
                            <span className="text-sm text-neutral-600">{progress.progress}%</span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${progress.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-serif font-bold text-neutral-800 mb-6">Quick Actions</h3>
                  
                  <div className="space-y-3">
                    <Link
                      to="/privacy"
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 group"
                    >
                      <Shield className="w-5 h-5 text-primary-600" />
                      <span className="text-neutral-700 group-hover:text-neutral-800">Privacy Policy</span>
                    </Link>
                    
                    <Link
                      to="/terms"
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 group"
                    >
                      <Settings className="w-5 h-5 text-primary-600" />
                      <span className="text-neutral-700 group-hover:text-neutral-800">Terms of Service</span>
                    </Link>

                    <Link
                      to="/student-dashboard"
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 group"
                    >
                      <BarChart3 className="w-5 h-5 text-primary-600" />
                      <span className="text-neutral-700 group-hover:text-neutral-800">View Analytics</span>
                    </Link>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="backdrop-blur-xl bg-red-50/50 border border-red-200/50 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h3 className="text-lg font-serif font-bold text-red-800">Danger Zone</h3>
                  </div>
                  
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-2 bg-red-600 text-white font-medium py-2 px-4 rounded-xl hover:bg-red-700 transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Account</span>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-red-800">Are you absolutely sure?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={isDeleting}
                          className="flex items-center gap-2 bg-red-600 text-white font-medium py-2 px-3 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm"
                        >
                          {isDeleting ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Deleting...</span>
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-3 h-3" />
                              <span>Yes, Delete</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="bg-neutral-200 text-neutral-700 font-medium py-2 px-3 rounded-lg hover:bg-neutral-300 transition-all duration-300 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <VoicePanel />
      </div>
    </div>
  );
};

export default Profile;