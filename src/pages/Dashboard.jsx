import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import {
  Plus, Search, Edit3, Trash2,
  ExternalLink, Loader2, SearchX, Download
} from 'lucide-react';
import { toast } from '../utils/alerts';
import { useAuth } from '../hooks/useAuth';

// Template Thumbnail Component
const TemplateThumbnail = ({ template }) => {
  const getTemplateStyles = () => {
    switch (template) {
      case 'elegant':
        return 'from-slate-100 to-slate-200';
      case 'modern':
        return 'from-blue-50 to-blue-100';
      case 'creative':
        return 'from-purple-50 to-purple-100';
      default:
        return 'from-slate-100 to-slate-200';
    }
  };

  const getAccentColor = () => {
    switch (template) {
      case 'elegant':
        return 'bg-slate-800';
      case 'modern':
        return 'bg-blue-600';
      case 'creative':
        return 'bg-purple-600';
      default:
        return 'bg-slate-800';
    }
  };

  return (
    <div className={`w-full h-full flex items-center justify-center bg-linear-to-br ${getTemplateStyles()}`}>
      <div className="w-16 h-20 bg-white rounded-sm shadow-sm flex flex-col overflow-hidden">
        <div className={`h-2 ${getAccentColor()}`}></div>
        <div className="flex-1 p-1 space-y-1">
          <div className="h-1 w-full bg-slate-200 rounded"></div>
          <div className="h-1 w-3/4 bg-slate-200 rounded"></div>
          <div className="h-1 w-1/2 bg-slate-200 rounded"></div>
          <div className="mt-2 h-4 w-full bg-slate-100 rounded"></div>
          <div className="h-2 w-full bg-slate-100 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTemplate, setFilterTemplate] = useState('all');

  // Fetch resumes only after auth is confirmed
  useEffect(() => {
    let isMounted = true;

    const fetchResumes = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const q = query(
          collection(db, "resumes"),
          where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);

        if (isMounted) {
          const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setResumes(data);
        }
      } catch (err) {
        console.error("Firestore Fetch Error:", err);
        if (isMounted) toast("Could not load resumes", "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (!authLoading) {
      fetchResumes();
    }

    return () => { isMounted = false; };
  }, [user, authLoading]);

  // Performance Optimized & Crash-Proof Filtering
  const filteredResumes = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    return resumes.filter(resume => {
      const info = resume.personalInfo || {};
      const fullName = (info.fullName || "").toLowerCase();
      const jobTitle = (info.jobTitle || "").toLowerCase();
      
      // Normalize skills: Handles Array, String, or Null/Undefined
      let skillsText = "";
      if (Array.isArray(resume.skills)) {
        skillsText = resume.skills.join(" ").toLowerCase();
      } else if (typeof resume.skills === 'string') {
        skillsText = resume.skills.toLowerCase();
      }

      const matchesSearch = 
        fullName.includes(normalizedSearch) ||
        jobTitle.includes(normalizedSearch) ||
        skillsText.includes(normalizedSearch);
      
      const matchesTemplate = filterTemplate === 'all' || resume.template === filterTemplate;
      
      return matchesSearch && matchesTemplate;
    });
  }, [resumes, searchTerm, filterTemplate]);

  // Secure Deletion Logic
  const handleDelete = async (id, e) => {
    e.stopPropagation();

    if (!user) {
      toast("You must be logged in to delete", "error");
      return;
    }

    // Double check ownership locally before attempting
    const resumeToDelete = resumes.find(r => r.id === id);
    if (resumeToDelete?.userId !== user.uid) {
      toast("Permission denied", "error");
      return;
    }

    if (!window.confirm("Are you sure? This action is permanent.")) return;

    try {
      await deleteDoc(doc(db, "resumes", id));
      setResumes(prev => prev.filter(r => r.id !== id));
      toast("Resume deleted", "success");
    } catch (err) {
      console.error("Delete Error:", err);
      toast("Delete failed", "error");
    }
  };

  // PDF Download function for dashboard cards - redirect to preview for styled PDF
  const downloadResumePDF = (resume, e) => {
    e.stopPropagation();
    if (!resume) return;
    
    // Redirect to preview page where users can download styled PDF
    navigate(`/preview/${resume.id}`);
  };

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">My Resumes</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage, edit, and download your professional CVs</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/create')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              <Plus size={20} /> Create New Resume
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search by name, title, or skills..."
                className="w-full pl-12 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5 rounded-xl">
            {['all', 'elegant', 'modern', 'creative'].map(t => (
              <button
                key={t}
                onClick={() => setFilterTemplate(t)}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  filterTemplate === t 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Layout */}
        {filteredResumes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResumes.map((resume) => (
              <div 
                key={resume.id}
                className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:shadow-slate-200 dark:hover:shadow-slate-700 transition-all cursor-pointer relative"
                onClick={() => navigate(`/preview/${resume.id}`)}
              >
                <div className="aspect-3/4 bg-slate-100 dark:bg-slate-700 flex items-center justify-center relative overflow-hidden">
                  <TemplateThumbnail template={resume.template || 'elegant'} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border border-slate-100 dark:border-slate-600">
                    {resume.template || 'elegant'}
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-slate-800 dark:text-white truncate mb-1">
                    {resume.personalInfo?.fullName || 'Untitled Resume'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-4">
                    {resume.personalInfo?.jobTitle || 'No title set'}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-700 pt-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/edit/${resume.id}`); }}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(resume.id, e)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button 
                        onClick={(e) => downloadResumePDF(resume, e)}
                        className="p-2 hover:bg-green-50 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg transition-colors"
                        title="Download PDF"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                    <button className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase group-hover:text-blue-600 transition-colors">
                      View <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <SearchX className="mx-auto text-slate-300 dark:text-slate-500 mb-4" size={48} />
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">No resumes found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Try adjusting your search or create a new one from scratch.</p>
            <button
              onClick={() => navigate('/create')}
              className="bg-slate-900 dark:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-black dark:hover:bg-blue-700 transition-all"
            >
              Start Building
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
