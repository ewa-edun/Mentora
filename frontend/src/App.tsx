import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../src/pages/Home';
import NotFound from '../src/pages/NotFound';
import ServerError from '../src/pages/ServerError';
import Login from '../src/pages/Auth/Login';
import SignIn from '../src/pages/Auth/SignIn';
import ForgotPassword from '../src/pages/Auth/ForgotPassword';

function App() {
  return (
    <Routes>
      {/* Main Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />

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
  );
}

export default App;