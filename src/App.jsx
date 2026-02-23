import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CreateResume from './pages/CreateResume';
import ResumePreview from './pages/ResumePreview';

// Wrapper component for protected routes with Navbar
const ProtectedLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased dark:bg-slate-900 dark:text-slate-100">
      {/* Tailwind debug component removed */}
      <Routes>
        {/* Landing / Login / Signup */}
        <Route path="/" element={<Auth />} />

        {/* Protected Routes with Navbar */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        <Route path="/create" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <CreateResume />
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        <Route path="/edit/:id" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <CreateResume />
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        <Route path="/preview/:id" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ResumePreview />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        {/* 404 Redirect - Redirects any undefined routes back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
