import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from '../src/components/ScrollToTop';
import Landing from '../src/pages/Landing';
import Home from '../src/pages/Home';
import StudyPage from '../src/pages/StudyPage';
import BreakPage from '../src/pages/BreakPage';
import VoicePage from '../src/pages/VoicePage';
import NotFound from '../src/pages/NotFound';
import ServerError from '../src/pages/ServerError';
import PrivacyPolicy from '../src/pages/PrivacyPolicy';
import TermsOfService from '../src/pages/TOS';
import Login from '../src/pages/Auth/Login';
import SignIn from '../src/pages/Auth/SignIn';
import ForgotPassword from '../src/pages/Auth/ForgotPassword';
import Profile from '../src/pages/Profile';
import Premium from '../src/pages/Premium';
import StorytellingPage from './pages/StoryTellingPage';

// Importing Footer component for consistent layout
import Footer from '../src/components/Footer';

function App() {
  return (
     <>
     <ScrollToTop />
    <Routes>
      {/* Main Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />

      {/* Additional Routes */}
      <Route path="/study" element={<StudyPage />} />
      <Route path="/break" element={<BreakPage />} />
      <Route path="/voice" element={<VoicePage />} />
      <Route path="/premium" element={<Premium />} />
      <Route path="/storytelling" element={<StorytellingPage />} />
     
      {/* Legal Routes */}
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />

      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Feature Routes (for future implementation) */}
      <Route path="/study" element={<Home />} />
      <Route path="/break" element={<Home />} />
      <Route path="/voice" element={<Home />} />
      <Route path="/storytelling" element={<Home />} />
      
      {/* Error Routes */}
      <Route path="/error/502" element={<ServerError />} />
      <Route path="/server-error" element={<ServerError />} />
      
      {/* 404 - Must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
   </>
  );
}

export default App;