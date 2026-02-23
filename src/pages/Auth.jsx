import React, { useState, useEffect, useRef } from 'react';
import { auth, googleProvider } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '../utils/alerts';
import gsap from 'gsap';
import { 
  Mail, Lock, Chrome, ArrowRight, UserPlus, LogIn, AlertCircle,
  FileText, Palette, Download, Zap, Shield, Clock, Users,
  ChevronLeft, ChevronRight, Check, X, Menu, XCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// ============ LANDING PAGE COMPONENTS ============

// Advanced Carousel Component with Next-Level UI
const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  
  const slides = [
    {
      title: "Elegant Template",
      description: "Classic & Professional design for traditional industries",
      gradient: "from-slate-600 via-slate-700 to-slate-800",
      accentColor: "slate",
      features: ["Clean Lines", "Professional", "Timeless"],
      preview: (
        <div className="w-20 h-28 bg-white rounded-sm shadow-lg overflow-hidden">
          <div className="h-2 bg-slate-800"></div>
          <div className="p-2 space-y-1.5">
            <div className="h-1.5 w-16 bg-slate-300 rounded"></div>
            <div className="h-1 w-12 bg-slate-200 rounded"></div>
            <div className="mt-2 h-6 w-full bg-slate-100 rounded"></div>
            <div className="h-1.5 w-full bg-slate-100 rounded"></div>
            <div className="h-1.5 w-3/4 bg-slate-100 rounded"></div>
          </div>
        </div>
      )
    },
    {
      title: "Modern Template",
      description: "Clean & Contemporary design for tech professionals",
      gradient: "from-blue-500 via-blue-600 to-blue-700",
      accentColor: "blue",
      features: ["Sleek Design", "Modern Typography", "Tech-Ready"],
      preview: (
        <div className="w-20 h-28 bg-white rounded-sm shadow-lg overflow-hidden">
          <div className="h-8 bg-linear-to-r from-blue-500 to-blue-600"></div>
          <div className="p-2 space-y-1.5">
            <div className="h-1.5 w-14 bg-blue-300 rounded"></div>
            <div className="h-1 w-10 bg-blue-200 rounded"></div>
            <div className="mt-2 grid grid-cols-2 gap-1">
              <div className="h-3 bg-blue-100 rounded"></div>
              <div className="h-3 bg-blue-50 rounded"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Creative Template",
      description: "Bold & Unique design to stand out from the crowd",
      gradient: "from-purple-500 via-fuchsia-500 to-purple-600",
      accentColor: "purple",
      features: ["Eye-Catching", "Unique Layout", "Bold"],
      preview: (
        <div className="w-20 h-28 bg-white rounded-sm shadow-lg overflow-hidden">
          <div className="h-2 bg-linear-to-r from-purple-500 to-fuchsia-500"></div>
          <div className="p-2 space-y-1.5">
            <div className="h-2 w-12 bg-purple-300 rounded-full"></div>
            <div className="h-1 w-16 bg-purple-200 rounded"></div>
            <div className="mt-2 flex gap-1">
              <div className="h-4 w-4 bg-purple-400 rounded-full"></div>
              <div className="h-4 w-4 bg-fuchsia-400 rounded-full"></div>
              <div className="h-4 w-4 bg-purple-300 rounded-full"></div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // GSAP Animation on slide change
  useEffect(() => {
    if (carouselRef.current) {
      gsap.fromTo(carouselRef.current.children, 
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out", stagger: 0.1 }
      );
    }
  }, [currentSlide]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl group">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} transition-all duration-1000`}></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-8 left-8 w-16 h-16 border-2 border-white/20 rounded-lg rotate-12 animate-float"></div>
          <div className="absolute bottom-12 right-16 w-12 h-12 border-2 border-white/10 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/3 right-8 w-8 h-8 bg-white/10 rounded-lg rotate-45 animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative h-80 md:h-96 p-6 md:p-10 flex items-center justify-center">
        {slides.map((slide, index) => (
          <div
            key={index}
            ref={index === currentSlide ? carouselRef : null}
            className={`absolute inset-0 transition-all duration-700 transform ${
              index === currentSlide 
                ? 'opacity-100 translate-x-0 scale-100' 
                : 'opacity-0 translate-x-full scale-95'
            }`}
          >
            <div className="h-full flex items-center justify-center">
              {/* Glassmorphism Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl max-w-md w-full">
                <div className="flex items-center justify-center gap-6">
                  {/* Template Preview */}
                  <div className="transform transition-all duration-500 hover:scale-110 hover:rotate-1 cursor-pointer">
                    {slide.preview}
                  </div>
                  
                  {/* Content */}
                  <div className="text-white space-y-3">
                    <h3 className="text-2xl md:text-3xl font-black mb-2">{slide.title}</h3>
                    <p className="text-white/80 text-sm md:text-base">{slide.description}</p>
                    
                    {/* Feature Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {slide.features.map((feature, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation Arrows with Hover Effects */}
        <button 
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all border border-white/20 hover:scale-110 group/arrow"
        >
          <ChevronLeft className="text-white group-hover/arrow:-translate-x-0.5 transition-transform" size={24} />
        </button>
        <button 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all border border-white/20 hover:scale-110 group/arrow"
        >
          <ChevronRight className="text-white group-hover/arrow:translate-x-0.5 transition-transform" size={24} />
        </button>
      </div>
      
      {/* Enhanced Bottom Controls */}
      <div className="relative bg-white/5 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        {/* Progress Bar */}
        <div className="flex-1 mr-6">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Dots with Labels */}
        <div className="flex items-center gap-3">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`relative group/dot transition-all duration-300 ${
                index === currentSlide ? 'w-24' : 'w-8'
              }`}
            >
              <div className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white w-full' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}>
              </div>
              <span className={`absolute left-1/2 -translate-x-1/2 top-3 text-xs font-medium text-white whitespace-nowrap transition-opacity duration-300 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 group-hover/dot:opacity-100'
              }`}>
                {slide.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Glowing Border Effect */}
      <div className="absolute inset-0 rounded-3xl border-2 border-white/10 pointer-events-none"></div>
      <div className="absolute inset-0 rounded-3xl border border-white/5 pointer-events-none animate-pulse"></div>
    </div>
  );
};

// Add custom CSS for floating animation
const FloatingStyles = () => (
  <style>{`
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
  `}</style>
);

// Features Section
const Features = () => {
  const features = [
    { icon: <Palette size={24} />, title: "3 Professional Templates", desc: "Choose from Elegant, Modern, or Creative designs" },
    { icon: <Zap size={24} />, title: "Live Preview", desc: "See your resume update in real-time as you edit" },
    { icon: <Download size={24} />, title: "PDF Export", desc: "Download your resume in professional PDF format" },
    { icon: <Shield size={24} />, title: "Secure Storage", desc: "Your data is safely stored in the cloud" },
    { icon: <Clock size={24} />, title: "Save Time", desc: "Build professional resumes in minutes, not hours" },
    { icon: <Users size={24} />, title: "Easy to Use", desc: "Simple form-based interface, no design skills needed" }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-800 mb-4">Powerful Features</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Everything you need to create a professional resume that stands out
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-all group border border-slate-100 hover:border-blue-200"
            >
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Benefits Section
const Benefits = () => {
  const benefits = [
    "Create unlimited resumes",
    "Multiple template options",
    "Real-time live preview",
    "Cloud storage - access anywhere",
    "Easy editing and updates",
    "Professional PDF output",
    "Mobile-friendly design",
    "Fast and secure"
  ];

  return (
    <div className="py-20 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl font-black text-white mb-4">Why Choose CV Master?</h2>
        <p className="text-blue-100 text-lg mb-12">
          Join thousands of job seekers who trust CV Master for their career success
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 bg-white/15 backdrop-blur-sm px-6 py-4 rounded-xl text-white hover:bg-white/20 transition-all border border-white/10"
            >
              <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center shrink-0">
                <Check className="text-white" size={14} />
              </div>
              <span className="font-medium">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Navbar Component
const Navbar = ({ onAuthClick, user, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="text-white" size={22} />
            </div>
            <span className={`text-2xl font-black ${isScrolled ? 'text-slate-800' : 'text-white'}`}>
              CV Master
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className={`font-medium transition-colors ${isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-white/80 hover:text-white'}`}>
              Features
            </a>
            <a href="#benefits" className={`font-medium transition-colors ${isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-white/80 hover:text-white'}`}>
              Benefits
            </a>
            {user ? (
              <button 
                onClick={onLogout}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
              >
                Logout
              </button>
            ) : (
              <>
                <button 
                  onClick={() => onAuthClick('login')}
                  className={`font-bold transition-colors ${isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white hover:text-blue-200'}`}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onAuthClick('signup')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30"
                >
                  Create Account
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? (
              <X className={isScrolled ? 'text-slate-800' : 'text-white'} size={24} />
            ) : (
              <Menu className={isScrolled ? 'text-slate-800' : 'text-white'} size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white rounded-2xl shadow-xl p-4 mb-4 space-y-4">
            <a href="#features" className="block py-2 text-slate-700 font-medium">Features</a>
            <a href="#benefits" className="block py-2 text-slate-700 font-medium">Benefits</a>
            {user ? (
              <button 
                onClick={onLogout}
                className="w-full py-3 bg-red-500 text-white font-bold rounded-xl"
              >
                Logout
              </button>
            ) : (
              <>
                <button 
                  onClick={() => { onAuthClick('login'); setMobileMenuOpen(false); }}
                  className="w-full py-3 text-slate-700 font-bold border border-slate-200 rounded-xl"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => { onAuthClick('signup'); setMobileMenuOpen(false); }}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

// Auth Modal Component
const AuthModal = ({ isOpen, onClose, initialMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode]);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(formRef.current, 
        { opacity: 0, scale: 0.9, y: 20 }, 
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }
      );
    }
  }, [isOpen, isLogin]);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast("Welcome back!", "success");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast("Account created successfully!", "success");
      }
      onClose();
      navigate('/dashboard');
    } catch (err) {
      let errorMessage = 'An error occurred';
      switch (err.code) {
        case 'auth/user-not-found': errorMessage = 'No account found with this email'; break;
        case 'auth/wrong-password': errorMessage = 'Incorrect password'; break;
        case 'auth/email-already-in-use': errorMessage = 'An account with this email already exists'; break;
        case 'auth/weak-password': errorMessage = 'Password is too weak'; break;
        default: errorMessage = err.message;
      }
      setError(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      toast("Google Login Successful!", "success");
      onClose();
      navigate('/dashboard');
    } catch {
      setError('Google sign-in failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div 
        ref={formRef}
        className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl p-8"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
        
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 mb-4">
            {isLogin ? <LogIn size={28} /> : <UserPlus size={28} />}
          </div>
          <h2 className="text-3xl font-black text-slate-800">
            {isLogin ? 'Welcome Back' : 'Get Started'}
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            {isLogin ? 'Enter your details to access your resumes' : 'Create an account to build your professional CV'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-500 shrink-0" size={20} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="email"
              className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="password"
              className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <span className="relative px-4 bg-white text-slate-400 text-xs font-bold uppercase">Or continue with</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-4 border border-slate-200 rounded-2xl flex items-center justify-center gap-3 font-semibold text-slate-700 hover:bg-slate-50 transition-all"
        >
          <Chrome size={20} className="text-blue-500" />
          Google Account
        </button>

        <p className="text-center text-sm text-slate-600 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-bold hover:underline">
            {isLogin ? 'Sign Up for free' : 'Log in here'}
          </button>
        </p>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => (
    <footer className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 relative overflow-hidden">
    {/* Background Decorations */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
    </div>
    
    <div className="max-w-6xl mx-auto px-4 relative z-10">
      <div className="grid md:grid-cols-4 gap-8 mb-12">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="text-white" size={22} />
            </div>
            <span className="text-2xl font-black">CV Master</span>
          </div>
          <p className="text-slate-400 max-w-md">
            Create professional resumes in minutes with our easy-to-use builder. 
            Land your dream job with a standout CV.
          </p>
        </div>
        
        {/* Quick Links */}
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
            <li><a href="#benefits" className="text-slate-400 hover:text-white transition-colors">Benefits</a></li>
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors"> Templates</a></li>
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
          </ul>
        </div>
        
        {/* Support */}
        <div>
          <h4 className="font-bold mb-4">Support</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      {/* Bottom */}
      <div className="pt-8 border-t border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-400 text-sm">© 2024 CV Master. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
            <span className="text-sm font-bold">X</span>
          </a>
          <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
            <span className="text-sm font-bold">in</span>
          </a>
          <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
            <span className="text-sm font-bold">f</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
);

// ============ MAIN AUTH COMPONENT ============

const Auth = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast("Logged out successfully", "success");
    } catch {
      toast("Logout failed", "error");
    }
  };

return (
    <div className="min-h-screen bg-slate-50">
      <FloatingStyles />
      {/* Navbar */}
      <Navbar 
        onAuthClick={handleAuthClick} 
        user={user} 
        onLogout={handleLogout} 
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-linear-to-br from-slate-900 via-slate-800 to-blue-900 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap size={16} /> Build Professional Resumes in Minutes
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                Create Your{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
                  Perfect Resume
                </span>{' '}
                in Minutes
              </h1>
              <p className="text-xl text-slate-300 mb-8 max-w-xl">
                Stand out from the crowd with professionally designed resumes. 
                Choose from 3 stunning templates and land your dream job.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => handleAuthClick('signup')}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center justify-center gap-2"
                >
                  Get Started Free <ArrowRight size={20} />
                </button>
                <button 
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all border border-white/20"
                >
                  Learn More
                </button>
              </div>
              
              {/* Stats */}
              <div className="mt-12 flex gap-8 justify-center lg:justify-start">
                <div>
                  <div className="text-3xl font-black text-white">10K+</div>
                  <div className="text-slate-400 text-sm">Resumes Created</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white">3</div>
                  <div className="text-slate-400 text-sm">Templates</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white">100%</div>
                  <div className="text-slate-400 text-sm">Free to Start</div>
                </div>
              </div>
            </div>

            {/* Carousel */}
            <div className="mt-12 lg:mt-0">
              <Carousel />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features">
        <Features />
      </section>

      {/* Benefits Section */}
      <section id="benefits">
        <Benefits />
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-slate-800 mb-6">
            Ready to Build Your Resume?
          </h2>
          <p className="text-slate-500 text-lg mb-8">
            Join thousands of job seekers who have successfully created their professional resumes with CV Master.
          </p>
          <button 
            onClick={() => handleAuthClick('signup')}
            className="px-12 py-5 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/25 text-lg"
          >
            Start Building Now - It's Free!
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialMode={authMode}
      />
    </div>
  );
};

export default Auth;
