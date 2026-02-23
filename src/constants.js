/**
 * CV Master - Global Constants & Configuration
 * Production-grade constants and application configuration
 */

// ==================== APP CONFIG ====================

export const APP_CONFIG = {
  name: 'CV Master',
  version: '1.0.0',
  description: 'Professional Resume Builder',
  author: 'Your Name',
  supportEmail: 'support@cvmaster.com',
  
  // URLs
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  docsUrl: 'https://docs.cvmaster.com',
  
  // Feature flags
  features: {
    googleAuth: true,
    emailAuth: true,
    excelExport: true,
    pdfExport: true,
    darkMode: true,
    multipleTemplates: true,
    profileImages: true,
  },
};

// ==================== ROUTES ====================

export const ROUTES = {
  AUTH: '/',
  DASHBOARD: '/dashboard',
  CREATE_RESUME: '/create',
  EDIT_RESUME: (id) => `/edit/${id}`,
  PREVIEW_RESUME: (id) => `/preview/${id}`,
  SETTINGS: '/settings',
  HELP: '/help',
};

// ==================== TEMPLATES ====================

export const TEMPLATES = {
  ELEGANT: 'elegant',
  MODERN: 'modern',
  CREATIVE: 'creative',
};

export const TEMPLATE_DETAILS = {
  elegant: {
    id: 'elegant',
    name: 'Elegant',
    description: 'Classic & Professional',
    color: 'slate',
    bgColor: 'white',
    accentColor: '#1e293b',
    bestFor: ['Traditional industries', 'Corporate roles', 'Formal positions'],
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean & Contemporary',
    color: 'blue',
    bgColor: '#f8fafc',
    accentColor: '#2563eb',
    bestFor: ['Tech companies', 'Startups', 'Creative roles'],
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    description: 'Bold & Unique',
    color: 'purple',
    bgColor: '#0f172a',
    accentColor: '#3b82f6',
    bestFor: ['Creative industries', 'Design roles', 'Unique positions'],
  },
};

// ==================== FORM VALIDATION ====================

export const VALIDATION_RULES = {
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/,
    errorMessage: 'Name must be 2-100 characters with letters only',
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: 'Please enter a valid email address',
  },
  phone: {
    minLength: 10,
    maxLength: 15,
    pattern: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
    errorMessage: 'Please enter a valid phone number',
  },
  password: {
    required: true,
    minLength: 6,
    errorMessage: 'Password must be at least 6 characters',
  },
  jobTitle: {
    maxLength: 100,
    errorMessage: 'Job title must be under 100 characters',
  },
  summary: {
    maxLength: 1000,
    errorMessage: 'Summary must be under 1000 characters',
  },
  url: {
    pattern: /^https?:\/\/.+/,
    errorMessage: 'Please enter a valid URL (https://...)',
  },
};

// ==================== ERROR MESSAGES ====================

export const ERROR_MESSAGES = {
  // Auth errors
  AUTH_EMAIL_IN_USE: 'An account with this email already exists',
  AUTH_INVALID_EMAIL: 'Invalid email address',
  AUTH_WEAK_PASSWORD: 'Password is too weak (minimum 6 characters)',
  AUTH_USER_NOT_FOUND: 'No account found with this email',
  AUTH_WRONG_PASSWORD: 'Incorrect password',
  AUTH_TOO_MANY_REQUESTS: 'Too many failed attempts. Please try again later.',
  AUTH_NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_UNKNOWN_ERROR: 'An error occurred. Please try again.',

  // Resume errors
  RESUME_NOT_FOUND: 'Resume not found',
  RESUME_PERMISSION_DENIED: "You don't have permission to view this resume",
  RESUME_DELETE_FAILED: 'Failed to delete resume',
  RESUME_SAVE_FAILED: 'Failed to save resume',
  RESUME_LOAD_FAILED: 'Failed to load resume',

  // PDF errors
  PDF_GENERATION_FAILED: 'Failed to generate PDF. Please try again.',
  PDF_COLOR_PARSING_ERROR: 'Error processing resume colors. Please try a different template.',
  PDF_CANVAS_ERROR: 'Unable to render resume. Please refresh and try again.',

  // Excel errors
  EXCEL_EXPORT_FAILED: 'Failed to export to Excel',
  EXCEL_NO_DATA: 'No resumes available for export',

  // File errors
  FILE_TOO_LARGE: 'File size exceeds 1MB limit',
  FILE_INVALID_TYPE: 'Invalid file type',
  FILE_UPLOAD_FAILED: 'Failed to upload file',

  // Network errors
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  CONNECTION_TIMEOUT: 'Connection timeout. Please try again.',

  //Generic errors
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
  PLEASE_LOGIN: 'Please log in to continue',
  PLEASE_FILL_ALL_FIELDS: 'Please fill in all required fields',
};

// ==================== SUCCESS MESSAGES ====================

export const SUCCESS_MESSAGES = {
  AUTH_SIGNUP: 'Account created successfully! Welcome!',
  AUTH_LOGIN: 'Welcome back!',
  AUTH_LOGOUT: 'Logged out safely',
  
  RESUME_CREATED: 'Resume created successfully!',
  RESUME_UPDATED: 'Resume updated successfully!',
  RESUME_DELETED: 'Resume deleted permanently',
  
  PDF_DOWNLOADED: 'Resume downloaded successfully',
  EXCEL_EXPORTED: 'Excel export completed successfully',
  
  PHOTO_UPLOADED: 'Photo uploaded successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
};

// ==================== FIREBASE COLLECTIONS ====================

export const FIRESTORE_COLLECTIONS = {
  RESUMES: 'resumes',
  USERS: 'users',
  SETTINGS: 'settings',
  LOGS: 'logs',
};

// ==================== RESUME DATA STRUCTURE ====================

export const RESUME_SCHEMA = {
  id: 'auto-generated string',
  userId: 'firebase_user_uid',
  template: 'elegant|modern|creative',
  
  personalInfo: {
    fullName: 'string',
    email: 'string',
    phone: 'string',
    address: 'string',
    jobTitle: 'string',
    summary: 'string',
    profileImage: 'base64_or_url',
  },
  
  experience: [
    {
      company: 'string',
      role: 'string',
      duration: 'string',
      description: 'string',
    },
  ],
  
  education: [
    {
      school: 'string',
      degree: 'string',
      year: 'string',
    },
  ],
  
  projects: [
    {
      title: 'string',
      link: 'string',
      description: 'string',
    },
  ],
  
  certifications: [
    {
      name: 'string',
      issuer: 'string',
      year: 'string',
    },
  ],
  
  skills: 'comma-separated string',
  languages: 'comma-separated string',
  
  createdAt: 'timestamp',
  lastModified: 'timestamp',
};

// ==================== UI CONSTANTS ====================

export const UI_CONFIG = {
  // Animations
  animationDuration: {
    fast: 200,
    normal: 400,
    slow: 600,
  },
  
  // Sizes
  sizes: {
    profileImageMax: 1024 * 1024, // 1MB
    resumeNameMax: 100,
    descriptionMax: 1000,
  },
  
  // Pagination
  pagination: {
    itemsPerPage: 12,
    maxPages: 100,
  },
  
  // Toast notification
  toast: {
    duration: 3000,
    position: 'top-end',
  },
  
  // Modal
  modal: {
    animationDuration: 300,
  },
};

// ==================== COLOR PALETTE ====================

export const COLORS = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#16a34a',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#0ea5e9',
  
  // Dark mode
  dark: {
    bg: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    border: '#334155',
  },
  
  // Light mode
  light: {
    bg: '#f8fafc',
    surface: '#ffffff',
    text: '#1e293b',
    border: '#e2e8f0',
  },
};

// ==================== LOCAL STORAGE KEYS ====================

export const STORAGE_KEYS = {
  DARK_MODE: 'darkMode',
  USER_PREFERENCES: 'userPreferences',
  DRAFT_RESUME: 'draftResume',
  RECENT_RESUMES: 'recentResumes',
  AUTH_TOKEN: 'authToken',
};

// ==================== API ENDPOINTS ====================

export const API_ENDPOINTS = {
  // Firebase endpoints are handled by SDK
  LOGS: '/api/logs',
  ANALYTICS: '/api/analytics',
  HEALTH: '/api/health',
};

// ==================== HELP & DOCUMENTATION ====================

export const HELP_CONTENT = {
  templates: 'Choose a professional template that matches your industry',
  personalInfo: 'Add your contact information and professional summary',
  experience: 'List your work experience in reverse chronological order',
  education: 'Add your educational background and qualifications',
  projects: 'Showcase your important projects and achievements',
  skills: 'List your professional skills separated by commas',
  languages: 'Add languages you speak and your proficiency level',
  pdf: 'Download your resume as a professional PDF document',
};

// ==================== KEYBOARD SHORTCUTS ====================

export const KEYBOARD_SHORTCUTS = {
  SAVE: 'Ctrl+S / Cmd+S',
  DOWNLOAD: 'Ctrl+D / Cmd+D', 
  UNDO: 'Ctrl+Z / Cmd+Z',
  HELP: 'Ctrl+? / Cmd+?',
};

// ==================== BREAKPOINTS ====================

export const BREAKPOINTS = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ==================== SECURITY ====================

export const SECURITY = {
  passwordMinLength: 6,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  tokenExpiration: 24 * 60 * 60 * 1000, // 24 hours
};

// ==================== ANALYTICS EVENTS ====================

export const ANALYTICS_EVENTS = {
  // Auth
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  
  // Resume
  RESUME_CREATED: 'resume_created',
  RESUME_UPDATED: 'resume_updated',
  RESUME_DELETED: 'resume_deleted',
  RESUME_VIEWED: 'resume_viewed',
  
  // Export
  PDF_DOWNLOADED: 'pdf_downloaded',
  EXCEL_EXPORTED: 'excel_exported',
  
  // UI
  TEMPLATE_CHANGED: 'template_changed',
  DARK_MODE_TOGGLED: 'dark_mode_toggled',
};

// ==================== EXPORT ====================

export default {
  APP_CONFIG,
  ROUTES,
  TEMPLATES,
  TEMPLATE_DETAILS,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FIRESTORE_COLLECTIONS,
  RESUME_SCHEMA,
  UI_CONFIG,
  COLORS,
  STORAGE_KEYS,
  API_ENDPOINTS,
  HELP_CONTENT,
  KEYBOARD_SHORTCUTS,
  BREAKPOINTS,
  SECURITY,
  ANALYTICS_EVENTS,
};
