import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Mail, Phone, MapPin, Loader2, ArrowLeft, Sparkles, AlertCircle
} from 'lucide-react';
import { toast } from '../utils/alerts';
import { useAuth } from '../hooks/useAuth';
import gsap from 'gsap';

// --- UTILITY: SAFE DATA PARSING ---
const getSafeSkills = (skills) => {
  if (Array.isArray(skills)) return skills;
  if (typeof skills === 'string') return skills.split(',').filter(s => s.trim() !== '');
  return [];
};

const getSafeLanguages = (languages) => {
  if (Array.isArray(languages)) return languages;
  if (typeof languages === 'string') return languages.split(',').filter(l => l.trim() !== '');
  return [];
};

// --- EXPERT TEMPLATES ---

const ElegantTemplate = ({ data }) => {
  const skills = useMemo(() => getSafeSkills(data?.skills), [data?.skills]);
  const languages = useMemo(() => getSafeLanguages(data?.languages), [data?.languages]);

  return (
    <div className="p-16 text-slate-900 bg-white min-h-[297mm] font-serif">
      <div className="border-b-8 border-double border-slate-800 pb-8 mb-10">
        <h1 className="text-5xl font-light tracking-tight text-slate-800 mb-2">{data.personalInfo?.fullName || 'Your Name'}</h1>
        <p className="text-blue-700 font-bold uppercase tracking-[4px] text-xs mb-6">{data.personalInfo?.jobTitle}</p>
        <div className="flex flex-wrap gap-y-2 gap-x-6 text-[11px] text-slate-500 font-sans uppercase tracking-widest">
          {data.personalInfo?.email && <span className="flex items-center gap-1"><Mail size={12} /> {data.personalInfo.email}</span>}
          {data.personalInfo?.phone && <span className="flex items-center gap-1"><Phone size={12} /> {data.personalInfo.phone}</span>}
          {data.personalInfo?.address && <span className="flex items-center gap-1"><MapPin size={12} /> {data.personalInfo.address}</span>}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12 font-sans">
        <div className="col-span-8 space-y-10">
          <section>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[3px] mb-4 border-b border-slate-100 pb-2">Profile</h2>
            <p className="text-sm leading-relaxed text-slate-600 italic">"{data.personalInfo?.summary || 'No summary provided.'}"</p>
          </section>

          <section>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[3px] mb-6 border-b border-slate-100 pb-2">Experience</h2>
            {(data.experience || []).map((exp, i) => (
              <div key={i} className="mb-8">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-slate-800">{exp.role}</h3>
                  <span className="text-[10px] font-bold text-slate-400">{exp.duration}</span>
                </div>
                <p className="text-blue-700 text-xs font-bold mb-3">{exp.company}</p>
                <p className="text-sm text-slate-600 leading-relaxed text-justify">{exp.description}</p>
              </div>
            ))}
          </section>

          {(data.projects?.length > 0) && (
            <section>
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[3px] mb-6 border-b border-slate-100 pb-2">Key Projects</h2>
              {data.projects.map((proj, i) => (
                <div key={i} className="mb-6">
                  <h3 className="font-bold text-slate-800 text-sm">{proj.title}</h3>
                  <p className="text-xs text-blue-600 mb-1">{proj.link}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </section>
          )}
        </div>

        <div className="col-span-4 space-y-10 border-l border-slate-50 pl-8">
          {skills.length > 0 && (
            <section>
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[3px] mb-4">Skills</h2>
              <div className="flex flex-col gap-2">
                {skills.map((s, i) => (
                  <span key={i} className="text-xs text-slate-600 border-l-2 border-blue-500 pl-3 py-1 bg-slate-50">{s.trim()}</span>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[3px] mb-4">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang, i) => (
                  <span key={i} className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">{lang}</span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[3px] mb-4">Education</h2>
            {(data.education || []).map((edu, i) => (
              <div key={i} className="mb-4">
                <p className="font-bold text-xs text-slate-800">{edu.degree}</p>
                <p className="text-[11px] text-slate-500">{edu.school}</p>
                <p className="text-[10px] text-blue-600 font-bold">{edu.year}</p>
              </div>
            ))}
          </section>

          {(data.certifications?.length > 0) && (
            <section>
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[3px] mb-4">Certifications</h2>
              {data.certifications.map((cert, i) => (
                <div key={i} className="mb-3">
                  <p className="font-bold text-[11px] text-slate-800">{cert.name}</p>
                  <p className="text-[10px] text-slate-500">{cert.issuer}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

const ModernTemplate = ({ data }) => {
  const skills = useMemo(() => getSafeSkills(data?.skills), [data?.skills]);
  const languages = useMemo(() => getSafeLanguages(data?.languages), [data?.languages]);

  return (
    <div className="flex min-h-[297mm] bg-white text-slate-800 font-sans">
      <div className="w-[38%] bg-slate-50 dark:bg-slate-900 p-10 border-r border-slate-100">
        <div className="mb-10">
          {data.personalInfo?.profileImage ? (
            <img
              src={data.personalInfo.profileImage}
              className="w-40 h-40 rounded-3xl object-cover mb-6 shadow-2xl shadow-blue-100 border-4 border-white"
              alt="Profile"
            />
          ) : (
            <div className="w-20 h-20 bg-blue-600 rounded-2xl mb-6 flex items-center justify-center text-white text-3xl font-black">
              {data.personalInfo?.fullName?.charAt(0) || '?'}
            </div>
          )}
          <h1 className="text-3xl font-black text-slate-900 leading-none mb-2">{data.personalInfo?.fullName}</h1>
          <p className="text-blue-600 font-bold text-xs uppercase tracking-wider">{data.personalInfo?.jobTitle}</p>
        </div>

        <div className="space-y-10">
          <section>
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Contact</h3>
            <div className="space-y-4 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-3"><Mail size={14} /> {data.personalInfo?.email}</div>
              <div className="flex items-center gap-3"><Phone size={14} /> {data.personalInfo?.phone}</div>
              <div className="flex items-center gap-3"><MapPin size={14} /> {data.personalInfo?.address}</div>
            </div>
          </section>

          {languages.length > 0 && (
            <section>
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Languages</h3>
              <div className="space-y-1">
                {languages.map((l, i) => <p key={i} className="text-xs font-bold text-slate-700">{l}</p>)}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold shadow-sm">{s.trim()}</span>
                ))}
              </div>
            </section>
          )}

          {data.certifications?.length > 0 && (
            <section>
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Certifications</h3>
              <div className="space-y-3">
                {data.certifications.map((cert, i) => (
                  <div key={i}>
                    <p className="text-[11px] font-bold text-slate-800">{cert.name}</p>
                    <p className="text-[9px] text-blue-600 uppercase font-bold">{cert.issuer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="w-[62%] p-12">
        <section className="mb-12">
          <h2 className="text-xs font-black uppercase text-blue-600 tracking-[4px] mb-6">About Me</h2>
          <p className="text-sm leading-relaxed text-slate-500">{data.personalInfo?.summary}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-xs font-black uppercase text-blue-600 tracking-[4px] mb-8">Experience</h2>
          <div className="space-y-10">
            {(data.experience || []).map((exp, i) => (
              <div key={i} className="group relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-slate-50 group-hover:bg-blue-100 transition-colors"></div>
                <h3 className="text-md font-black text-slate-800 mb-1">{exp.role}</h3>
                <div className="flex justify-between text-[11px] font-bold text-blue-500 uppercase mb-3">
                  <span>{exp.company}</span>
                  <span className="text-slate-400">{exp.duration}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {data.projects?.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase text-blue-600 tracking-[4px] mb-8">Projects</h2>
            <div className="space-y-6">
              {data.projects.map((proj, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h3 className="text-sm font-black text-slate-800 mb-1">{proj.title}</h3>
                  <p className="text-[10px] text-blue-500 font-bold mb-2 uppercase">{proj.link}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const CreativeDarkTemplate = ({ data }) => {
  const skills = useMemo(() => getSafeSkills(data?.skills), [data?.skills]);
  const languages = useMemo(() => getSafeLanguages(data?.languages), [data?.languages]);

  return (
    <div className="min-h-[297mm] bg-[#0f172a] text-slate-300 p-16 font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full"></div>

      <header className="relative z-10 flex justify-between items-end border-b border-slate-800 pb-12 mb-12">
        <div>
          <h1 className="text-6xl font-black text-white tracking-tighter mb-2 italic">
            {data.personalInfo?.fullName?.split(' ')[0] || 'User'}
            <span className="text-blue-500">.</span>
          </h1>
          <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">{data.personalInfo?.jobTitle}</p>
        </div>
        <div className="text-right text-[10px] font-bold uppercase tracking-[3px] text-slate-500 space-y-1">
          <p>{data.personalInfo?.email}</p>
          <p>{data.personalInfo?.phone}</p>
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-12 gap-12">
        <div className="col-span-4 space-y-12">
          {skills.length > 0 && (
            <section>
              <h2 className="text-blue-500 font-black text-[10px] uppercase tracking-[5px] mb-6">Skills</h2>
              <div className="grid grid-cols-1 gap-3">
                {skills.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-xs font-bold text-white">{s.trim()}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-purple-500 font-black text-[10px] uppercase tracking-[5px] mb-6">Details</h2>
            {languages.length > 0 && (
              <div className="mb-8">
                <p className="text-[10px] text-slate-500 mb-2 font-black uppercase tracking-widest">Languages</p>
                <div className="text-xs font-bold text-white space-y-1">
                  {languages.map((l, i) => <p key={i}>{l}</p>)}
                </div>
              </div>
            )}
            {data.certifications?.length > 0 && (
              <div>
                <p className="text-[10px] text-slate-500 mb-2 font-black uppercase tracking-widest">Certifications</p>
                <div className="space-y-4">
                  {data.certifications.map((c, i) => (
                    <div key={i}>
                      <p className="text-xs font-bold text-white leading-tight">{c.name}</p>
                      <p className="text-[10px] text-purple-400 font-bold">{c.issuer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-blue-500 font-black text-[10px] uppercase tracking-[5px] mb-6">Education</h2>
            {(data.education || []).map((edu, i) => (
              <div key={i} className="mb-6">
                <p className="text-white font-bold text-xs">{edu.degree}</p>
                <p className="text-[11px] text-slate-500">{edu.school} — {edu.year}</p>
              </div>
            ))}
          </section>
        </div>

        <div className="col-span-8 space-y-12">
          <section>
            <p className="text-lg leading-relaxed text-slate-400 font-light italic">
              <span className="text-white font-bold text-4xl mr-2">“</span>
              {data.personalInfo?.summary}
            </p>
          </section>

          {data.projects?.length > 0 && (
            <section>
              <h2 className="text-white font-black text-sm uppercase tracking-[5px] mb-10 flex items-center gap-4">
                Projects <div className="h-px flex-1 bg-slate-800"></div>
              </h2>
              <div className="space-y-8">
                {data.projects.map((proj, i) => (
                  <div key={i}>
                    <h3 className="text-xl font-bold text-white">{proj.title}</h3>
                    <p className="text-blue-400 text-xs mb-2 font-bold tracking-widest uppercase">{proj.link}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-white font-black text-sm uppercase tracking-[5px] mb-10 flex items-center gap-4">
              Experience <div className="h-px flex-1 bg-slate-800"></div>
            </h2>
            <div className="space-y-12">
              {(data.experience || []).map((exp, i) => (
                <div key={i} className="relative">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                    <span className="text-[10px] font-black text-slate-500 tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-slate-800">{exp.duration}</span>
                  </div>
                  <p className="text-blue-400 font-bold text-xs mb-4 uppercase tracking-widest">{exp.company}</p>
                  <p className="text-sm leading-relaxed text-slate-500">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PREVIEW COMPONENT ---

const ResumePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTemplate, setActiveTemplate] = useState('elegant');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const resumeRef = useRef(null);
  const isMountedRef = useRef(true);
  const templateRef = useRef(activeTemplate);

  // Sync template with resume data when it loads or changes
  useEffect(() => {
    if (resumeData && resumeData.template) {
      setActiveTemplate(resumeData.template);
    }
  }, [resumeData?.template]);

  useEffect(() => {
    isMountedRef.current = true;
    const fetchResume = async () => {
      if (!id) {
        if (isMountedRef.current) {
          setError("Invalid Resume ID");
          setLoading(false);
        }
        return;
      }
      try {
        const docSnap = await getDoc(doc(db, "resumes", id));
        if (isMountedRef.current) {
          if (docSnap.exists()) {
            const data = docSnap.data();
            // Fix: Check if user exists before comparing userIds
            if (!user) {
              setError("Please log in to view this resume");
              setLoading(false);
              return;
            }
            if (data.userId !== user.uid) {
              setError("You don't have permission to view this resume");
              setLoading(false);
              return;
            }
            setResumeData(data);
            // Template will be synced by the separate useEffect above
            if (data.template && data.template !== 'elegant') {
              setActiveTemplate(data.template);
            }
          } else {
            setError("Resume not found");
          }
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        if (isMountedRef.current) setError("Failed to connect to database");
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchResume();
    } else if (!authLoading && !user) {
      setLoading(false);
    }

    return () => { isMountedRef.current = false; };
  }, [id, user, authLoading]);

  useEffect(() => {
    templateRef.current = activeTemplate;
  }, [activeTemplate]);

  useEffect(() => {
    if (resumeData && !loading && isMountedRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(".animate-content",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
      });
      return () => ctx.revert();
    }
  }, [activeTemplate, resumeData, loading]);

  const handleTemplateChange = (newTemplate) => {
    if (isGenerating) return;
    setActiveTemplate(newTemplate);
  };

  const downloadPDF = async () => {
    if (isGenerating || !resumeRef.current) return;
    if (!isMountedRef.current) return;

    setIsGenerating(true);
    setIsDownloading(true);

    const templateAtCapture = templateRef.current;
    const bgColor = templateAtCapture === 'creative' ? '#0f172a' : '#ffffff';

    try {
      toast('Preparing high-quality PDF...', 'info');

      const original = resumeRef.current;
      if (!original) {
        toast('Nothing to export.', 'error');
        setIsDownloading(false);
        setIsGenerating(false);
        return;
      }

      // Create offscreen wrapper to host cloned content
      const wrapper = document.createElement('div');
      const uid = `pdf-clone-wrapper-${Date.now()}`;
      wrapper.id = uid;
      wrapper.style.position = 'fixed';
      wrapper.style.top = '-9999px';
      wrapper.style.left = '0';
      wrapper.style.width = '210mm';
      wrapper.style.overflow = 'hidden';
      wrapper.style.zIndex = '-9999';
      wrapper.style.backgroundColor = bgColor;

      // Deep clone the node
      const cloned = original.cloneNode(true);
      
      // Robust color function normalization - converts modern CSS colors to RGB
      const normalizeColorFunctions = (value) => {
        if (!value || typeof value !== 'string') return value;
        
        // Handle oklch() - Convert to RGB using approximation
        value = value.replace(/(oklch|oklab)\s*\(\s*([^)]+)\)/gi, (match, func, params) => {
          try {
            const parts = params.split(/\s+|,/).map(p => parseFloat(p.trim())).filter(p => !isNaN(p));
            
            if (func.toLowerCase() === 'oklch' && parts.length >= 3) {
              // oklch(lightness chroma hue)
              const [l, c, h] = parts;
              // Simple heuristic conversion - use lightness and chroma to approximate RGB
              // This preserves luminance but may not perfectly match the actual color
              const base = Math.round(l * 255);
              const chromaFactor = Math.min(1, c * 100); // Normalize chroma
              const hueAngle = (h % 360) * Math.PI / 180;
              
              const r = Math.max(0, Math.min(255, base + chromaFactor * 50 * Math.cos(hueAngle)));
              const g = Math.max(0, Math.min(255, base + chromaFactor * 50 * Math.sin(hueAngle)));
              const b = Math.max(0, Math.min(255, base - chromaFactor * 25));
              
              return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
            } else if (func.toLowerCase() === 'oklab' && parts.length >= 3) {
              // oklab(lightness a b) - simplified conversion
              const [l] = parts;
              const gray = Math.round(l * 255);
              return `rgb(${gray}, ${gray}, ${gray})`;
            }
          } catch {
            // Fallback silently
          }
          // Fallback to medium gray on any error
          return 'rgb(128, 128, 128)';
        });
        
        return value;
      };

      const inlineComputedStyles = (origNode, cloneNode) => {
        if (!origNode || !cloneNode || !window.getComputedStyle) return;
        try {
          const computed = window.getComputedStyle(origNode);
          for (let i = 0; i < computed.length; i++) {
            const prop = computed[i];
            const rawValue = computed.getPropertyValue(prop);
            const value = normalizeColorFunctions(rawValue);
            if (!value) continue;
            const priority = computed.getPropertyPriority(prop);
            cloneNode.style.setProperty(prop, value, priority);
          }
        } catch {
          // ignore
        }

        const origChildren = origNode.children || [];
        const cloneChildren = cloneNode.children || [];
        for (let i = 0; i < cloneChildren.length; i++) {
          inlineComputedStyles(origChildren[i], cloneChildren[i]);
        }
      };

      inlineComputedStyles(original, cloned);

      // Ensure cloned root has no transforms/animations and a forced white background where needed
      const sanitizePair = (origNode, cloneNode) => {
        if (!origNode || !cloneNode) return;

        // Copy resolved colors and other important computed styles
        try {
          const computed = window.getComputedStyle(origNode);
          if (computed) {
            // Only copy properties that may contain color functions
            const props = [
              'color', 'backgroundColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
              'boxShadow', 'textShadow', 'backgroundImage'
            ];
            props.forEach((p) => {
              try {
                const raw = computed.getPropertyValue(p);
                const v = normalizeColorFunctions(raw);
                if (v && v !== 'transparent' && v !== 'none') {
                  cloneNode.style.setProperty(p, v, 'important');
                }
              } catch {
                // ignore
              }
            });
          }
        } catch {
          // ignore compute errors
        }

        // Remove animations/transitions/transforms
        cloneNode.style.animation = 'none !important';
        cloneNode.style.transition = 'none !important';
        cloneNode.style.transform = 'none !important';
        cloneNode.style.opacity = '1 !important';
        cloneNode.style.filter = 'none !important';
        cloneNode.style.willChange = 'auto !important';
        cloneNode.style.boxShadow = 'none !important';

        // Force background for the capture
        if (!cloneNode.style.backgroundColor || cloneNode.style.backgroundColor === 'transparent') {
          cloneNode.style.backgroundColor = bgColor;
        }

        // Copy images' crossOrigin to enable CORS drawing where possible
        if (origNode.tagName === 'IMG') {
          try {
            const img = cloneNode;
            if (img && !img.getAttribute('crossorigin')) img.setAttribute('crossorigin', 'anonymous');
          } catch {
            // ignore
          }
        }

        // Recurse
        const origChildren = origNode.children || [];
        const cloneChildren = cloneNode.children || [];
        for (let i = 0; i < cloneChildren.length; i++) {
          sanitizePair(origChildren[i] || {}, cloneChildren[i]);
        }
      };

      sanitizePair(original, cloned);

      // Remove all classes to prevent class-based tailwind styles from causing oklch issues
      const removeAllClasses = (el) => {
        if (!el) return;
        el.removeAttribute('class');
        for (let i = 0; i < el.children.length; i++) removeAllClasses(el.children[i]);
      };
      removeAllClasses(cloned);

      // Remove classes that trigger animation
      const removeAnimated = (el) => {
        if (!el) return;
        el.classList.remove('animate-content', 'animate-pulse');
        for (let i = 0; i < el.children.length; i++) removeAnimated(el.children[i]);
      };
      removeAnimated(cloned);

      // Make sure the cloned element has explicit sizing for the A4 width
      cloned.style.width = '210mm';
      cloned.style.minHeight = '297mm';
      cloned.style.boxSizing = 'border-box';
      cloned.style.backgroundColor = bgColor;

      wrapper.appendChild(cloned);
      document.body.appendChild(wrapper);

      // Wait for images to load inside wrapper
      const waitForImages = (root) => new Promise((resolve) => {
        const imgs = Array.from(root.querySelectorAll('img'));
        if (imgs.length === 0) return resolve();
        let count = imgs.length;
        imgs.forEach((img) => {
          if (img.complete && img.naturalWidth !== 0) {
            count -= 1;
            if (count === 0) resolve();
          } else {
            img.addEventListener('load', () => {
              count -= 1;
              if (count === 0) resolve();
            });
            img.addEventListener('error', () => {
              count -= 1;
              if (count === 0) resolve();
            });
          }
        });
      });

      // Small pause to allow fonts/CSS to settle
      await new Promise((r) => setTimeout(r, 250));
      await waitForImages(wrapper);

      // Render to canvas with aggressive color handling
      let canvas;
      try {
        canvas = await html2canvas(cloned, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          ignoreElements: (el) => {
            // Skip script and noscript tags
            return el.tagName === 'SCRIPT' || el.tagName === 'NOSCRIPT';
          },
          onclone: (clonedDoc) => {
            try {
              // Remove ALL stylesheets and style tags to prevent oklch parsing
              const stylesToRemove = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
              stylesToRemove.forEach((style) => {
                try {
                  style.parentNode?.removeChild(style);
                } catch {
                  // ignore removal errors
                }
              });

              // Strip all classes from elements to prevent cascading styles
              const allElements = clonedDoc.querySelectorAll('*');
              allElements.forEach((el) => {
                try {
                  el.removeAttribute('class');
                  el.removeAttribute('data-*');
                } catch {
                  // ignore
                }
              });

              // Convert any computed oklch colors in remaining inline styles
              allElements.forEach((el) => {
                if (el.style && el.style.cssText) {
                  el.style.cssText = el.style.cssText.replace(/(oklch|oklab)\s*\([^)]*\)/gi, 'rgb(128, 128, 128)');
                }
              });
            } catch {
              // Silently continue if onclone processing fails
            }
          },
        });
      } catch (canvasErr) {
        console.warn('html2canvas warning:', canvasErr);
        // If html2canvas fails, try once more with minimal options
        try {
          canvas = await html2canvas(cloned, {
            scale: 1,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
          });
        } catch (fallbackErr) {
          console.error('html2canvas fallback failed:', fallbackErr);
          throw new Error('Unable to generate PDF. Please check your resume content and try again.');
        }
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidthPx = canvas.width;
      const imgHeightPx = canvas.height;
      const pxPerMm = imgWidthPx / pdfWidth;
      const pageHeightPx = Math.floor(pdfHeight * pxPerMm);

      let remainingHeight = imgHeightPx;
      let offsetY = 0;
      let pageCount = 0;

      while (remainingHeight > 0) {
        const sliceHeight = Math.min(pageHeightPx, remainingHeight);

        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = imgWidthPx;
        tmpCanvas.height = sliceHeight;
        const ctx = tmpCanvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
        ctx.drawImage(canvas, 0, offsetY, imgWidthPx, sliceHeight, 0, 0, imgWidthPx, sliceHeight);

        const imgData = tmpCanvas.toDataURL('image/jpeg', 1.0);
        const imgHeightMm = sliceHeight / pxPerMm;

        if (pageCount > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeightMm);

        remainingHeight -= sliceHeight;
        offsetY += sliceHeight;
        pageCount += 1;
      }

      const fileName = `${resumeData.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume'}_CV.pdf`;
      pdf.save(fileName);

      // Cleanup cloned DOM
      try {
        if (wrapper && wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
      } catch {
        // ignore
      }

      toast('Download complete!', 'success');
    } catch (err) {
      console.error('PDF Download Error:', err);
      toast('Export failed. Please try again.', 'error');
    } finally {
      if (isMountedRef.current) {
        setIsDownloading(false);
        setIsGenerating(false);
      }
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-slate-500 font-medium animate-pulse">Loading your masterpiece...</p>
    </div>
  );

  if (error) return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 bg-slate-50">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center max-w-md">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={50} />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h2>
        <p className="text-slate-600 mb-6">{error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 mx-auto bg-slate-900 text-white px-6 py-2 rounded-xl hover:bg-black transition-colors"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 print:p-0 print:bg-white">
      <div className="max-w-[210mm] mx-auto mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 no-print bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/50">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {['elegant', 'modern', 'creative'].map((temp) => (
              <button
                key={temp}
                onClick={() => handleTemplateChange(temp)}
                disabled={isGenerating}
                className={`px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  activeTemplate === temp
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50 disabled:opacity-50'
                }`}
              >
                {temp}
              </button>
            ))}
          </div>

          <button
            onClick={downloadPDF}
            disabled={isDownloading || isGenerating}
            className="flex items-center gap-2.5 bg-slate-900 text-white px-6 py-2.5 rounded-xl shadow-lg font-semibold text-sm tracking-wide hover:scale-105 disabled:opacity-60 transition-all"
          >
            {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {isDownloading ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <div
          ref={resumeRef}
          className="animate-content shadow-[0_50px_100px_rgba(0,0,0,0.1)] overflow-hidden bg-white"
          style={{ width: '210mm', minHeight: '297mm' }}
        >
          {activeTemplate === 'elegant' && <ElegantTemplate data={resumeData} />}
          {activeTemplate === 'modern' && <ModernTemplate data={resumeData} />}
          {activeTemplate === 'creative' && <CreativeDarkTemplate data={resumeData} />}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;

// Export templates so other pages (CreateResume) can render live previews
export { ElegantTemplate, ModernTemplate, CreativeDarkTemplate };
