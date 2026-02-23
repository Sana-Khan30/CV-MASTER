import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { LogOut, LayoutDashboard, User, Moon, Sun } from 'lucide-react';
import { toast } from '../utils/alerts';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast("Logged out safely", "info");
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast("Error logging out", "error");
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200 dark:bg-slate-800/70 dark:border-slate-700 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <LayoutDashboard size={20} />
          </div>
          <span className="font-black text-xl tracking-tighter text-slate-800 dark:text-white uppercase">CV Master</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/60 dark:bg-slate-700/60 hover:scale-105 transition-transform shadow-sm"
            aria-label="Toggle dark mode"
            aria-pressed={darkMode}
            title="Toggle theme"
          >
            <span className={`absolute inset-0 flex items-center justify-center transition-all ${darkMode ? 'rotate-0' : 'rotate-0'}`}>
              <Sun size={18} className={`transition-transform ${darkMode ? 'text-yellow-400 scale-100' : 'text-yellow-400/40 scale-75'}`} />
            </span>
            <span className={`absolute inset-0 flex items-center justify-center transition-all ${darkMode ? '' : ''}`}>
              <Moon size={18} className={`transition-transform ${darkMode ? 'text-slate-400/40 scale-75' : 'text-slate-600 scale-100'}`} />
            </span>
          </button>
          
          <div className="hidden md:flex items-center gap-2 text-slate-600 dark:text-slate-300 mr-4">
            <User size={18} />
            <span className="text-sm font-medium">{user?.email?.split('@')[0] || 'User'}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/50 transition-all active:scale-95"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
