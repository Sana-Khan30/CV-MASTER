import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronRight, ChevronLeft, Save, User, Briefcase, 
  GraduationCap, Code, Plus, Trash2, Loader2, 
  Layers, Award, Languages, Image as ImageIcon, Palette, Check
} from 'lucide-react';
import { toast } from '../utils/alerts';
import { ElegantTemplate, ModernTemplate, CreativeDarkTemplate } from './ResumePreview';
import gsap from 'gsap';
import { ResumeProvider } from '../contexts/ResumeContext';

// ADDED CODE: Preview renderer - receives data directly from parent for live preview
const PreviewRenderer = React.memo(({ data }) => {
  const ref = React.useRef(null);
  const prevTemplateRef = React.useRef(data?.template);

  useEffect(() => {
    if (prevTemplateRef.current !== data?.template && ref.current) {
      gsap.fromTo(ref.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' });
      prevTemplateRef.current = data?.template;
    }
  }, [data?.template]);

  if (!data) return null;

  return (
    <div ref={ref} className="w-full bg-white dark:bg-slate-900 rounded-lg shadow-sm">
      {data.template === 'elegant' && <ElegantTemplate data={data} />}
      {data.template === 'modern' && <ModernTemplate data={data} />}
      {data.template === 'creative' && <CreativeDarkTemplate data={data} />}
    </div>
  );
});

const TEMPLATES = [
  { id: 'elegant', name: 'Elegant', description: 'Classic & Professional', color: 'slate' },
  { id: 'modern', name: 'Modern', description: 'Clean & Contemporary', color: 'blue' },
  { id: 'creative', name: 'Creative', description: 'Bold & Unique', color: 'purple' }
];

const CreateResume = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(id ? true : false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const formRef = React.useRef(null);
  const previewWrapperRef = React.useRef(null);
  const previewInnerRef = React.useRef(null);

  const [resumeData, setResumeData] = useState({
    personalInfo: { fullName: '', email: '', phone: '', address: '', summary: '', jobTitle: '', profileImage: '' },
    education: [{ school: '', degree: '', year: '' }],
    experience: [{ company: '', role: '', duration: '', description: '' }],
    projects: [{ title: '', link: '', description: '' }],
    certifications: [{ name: '', issuer: '', year: '' }],
    skills: '',
    languages: '',
    template: 'elegant', // Default template
  });

  // Data Fetching for Edit Mode
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const docSnap = await getDoc(doc(db, "resumes", id));
          if (docSnap.exists()) {
            setResumeData(docSnap.data());
          } else {
            toast("Resume not found", "error");
            navigate('/dashboard');
          }
        } catch (err) {
          console.error("Firestore Fetch Error:", err); // Fixed ESLint 'err' unused
          toast("Error loading data", "error");
        } finally {
          setInitialLoading(false);
        }
      };
      fetchData();
    }
  }, [id, navigate]);

  // GSAP Step Animation
  useEffect(() => {
    gsap.fromTo(".step-content", 
      { opacity: 0, x: 20 }, 
      { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
    );
  }, [currentStep]);

  // ADDED CODE: detect focus within the form to consider user editing
  useEffect(() => {
    const node = formRef.current;
    if (!node) return;
    const onFocusIn = () => setIsEditing(true);
    const onFocusOut = (e) => {
      // if focus moves outside the form entirely
      if (!node.contains(e.relatedTarget)) setIsEditing(false);
    };
    node.addEventListener('focusin', onFocusIn);
    node.addEventListener('focusout', onFocusOut);
    return () => {
      node.removeEventListener('focusin', onFocusIn);
      node.removeEventListener('focusout', onFocusOut);
    };
  }, [formRef]);

  // Responsive preview scale: fit inner preview width into available wrapper
  useEffect(() => {
    const computeScale = () => {
      const wrapper = previewWrapperRef.current;
      const inner = previewInnerRef.current;
      if (!wrapper || !inner) return;
      const wrapperWidth = Math.max(100, wrapper.clientWidth - 24); // account for padding
      const wrapperHeight = Math.max(200, wrapper.clientHeight - 24);
      const innerWidth = inner.offsetWidth || 820;
      const innerHeight = inner.offsetHeight || 1120;

      // compute scale that fits both width and height
      const scaleByWidth = wrapperWidth / innerWidth;
      const scaleByHeight = wrapperHeight / innerHeight;
      let scale = Math.min(1, scaleByWidth, scaleByHeight);

      // clamp to sensible bounds to avoid over-zoom or too-small preview
      scale = Math.max(0.5, Math.min(scale, 0.85));

      // slightly reduce scale while editing to give breathing room
      if (isEditing) scale = Math.min(scale, 0.8);
      // ensure a numeric value and set
      setPreviewScale(Number(scale.toFixed(3)));
    };

    // compute immediately and observe size changes
    computeScale();
    const ro = new ResizeObserver(computeScale);
    if (previewWrapperRef.current) ro.observe(previewWrapperRef.current);
    window.addEventListener('resize', computeScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', computeScale);
    };
  }, [isEditing, resumeData.template, resumeData.personalInfo.profileImage, resumeData.skills, resumeData.languages, resumeData.experience.length, resumeData.education.length, resumeData.projects.length, resumeData.certifications.length]);
  // Image Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) return toast("Max size 1MB", "error");
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeData({
          ...resumeData,
          personalInfo: { ...resumeData.personalInfo, profileImage: reader.result }
        });
        toast("Photo uploaded!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (section, field, value, index = null) => {
    if (index !== null) {
      const newList = [...resumeData[section]];
      newList[index][field] = value;
      setResumeData({ ...resumeData, [section]: newList });
    } else {
      setResumeData({ ...resumeData, [section]: { ...resumeData[section], [field]: value } });
    }
  };

  const addItem = (section) => {
    const schemas = {
      education: { school: '', degree: '', year: '' },
      experience: { company: '', role: '', duration: '', description: '' },
      projects: { title: '', link: '', description: '' },
      certifications: { name: '', issuer: '', year: '' }
    };
    setResumeData({ ...resumeData, [section]: [...resumeData[section], schemas[section]] });
  };

  const removeItem = (section, index) => {
    if (resumeData[section].length > 1) {
      const newList = resumeData[section].filter((_, i) => i !== index);
      setResumeData({ ...resumeData, [section]: newList });
    } else {
      toast("At least one entry required", "error");
    }
  };

  // Validate form data before submission
  const validateForm = () => {
    const { personalInfo } = resumeData;
    const errors = [];

    // Validate required fields
    if (!personalInfo.fullName || personalInfo.fullName.trim().length < 2) {
      errors.push("Full name is required (at least 2 characters)");
    }

    if (!personalInfo.email || personalInfo.email.trim().length === 0) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
      errors.push("Please enter a valid email address");
    }

    // Check if at least one section has content
    const hasEducation = resumeData.education.some(e => e.school || e.degree);
    const hasExperience = resumeData.experience.some(e => e.company || e.role);
    const hasSkills = resumeData.skills && resumeData.skills.trim().length > 0;

    if (!hasEducation && !hasExperience && !hasSkills) {
      errors.push("Please add at least one of: Education, Experience, or Skills");
    }

    return errors;
  };

  const submitResume = async () => {
    // Check authentication first
    if (!auth.currentUser) {
      toast("Please login first!", "error");
      navigate('/');
      return;
    }

    // Validate form data
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast(validationErrors[0], "error");
      return;
    }

    setLoading(true);
    try {
      // Sanitize data before saving
      const sanitizedData = {
        ...resumeData,
        userId: auth.currentUser.uid,
        lastModified: new Date(),
        // Ensure template has a valid default
        template: resumeData.template || 'elegant'
      };

      if (id) {
        await updateDoc(doc(db, "resumes", id), sanitizedData);
        toast("Resume updated successfully!", "success");
        navigate(`/preview/${id}`);
      } else {
        const docRef = await addDoc(collection(db, "resumes"), sanitizedData);
        toast("Resume created successfully!", "success");
        navigate(`/preview/${docRef.id}`);
      }
    } catch (error) {
      console.error("Firestore Save Error:", error);
      
      // Provide specific error messages based on error type
      let errorMessage = "Error saving resume. Please try again.";
      
      if (error.code === 'permission-denied') {
        errorMessage = "You don't have permission to save this resume.";
      } else if (error.code === 'network-request-failed') {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message) {
        // Show the actual error message for debugging
        errorMessage = `Error: ${error.message}`;
      }
      
      toast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  const steps = [
    { n: 1, t: 'Personal', i: <User size={18}/> },
    { n: 2, t: 'Experience', i: <Briefcase size={18}/> },
    { n: 3, t: 'Education', i: <GraduationCap size={18}/> },
    { n: 4, t: 'Projects', i: <Layers size={18}/> },
    { n: 5, t: 'Certificates', i: <Award size={18}/> },
    { n: 6, t: 'Skills & Lang', i: <Code size={18}/> }
  ];

  return (
    <ResumeProvider initialData={resumeData}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-72 bg-white dark:bg-slate-800 border-r dark:border-slate-700 h-auto md:h-screen sticky top-0 p-8 z-20">
        <h1 className="text-2xl font-black text-blue-600 mb-10 hidden md:block uppercase">CV Master</h1>
        <div className="flex md:flex-col gap-2 overflow-x-auto">
          {steps.map((s) => (
            <button key={s.n} onClick={() => setCurrentStep(s.n)}
              className={`flex items-center gap-3 font-bold transition-all px-4 py-2 rounded-xl ${currentStep === s.n ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-400 dark:text-gray-500'}`}
            >
              <span className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${currentStep === s.n ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-700'}`}>{s.i}</span>
              <span className="text-xs uppercase tracking-wider hidden md:block">{s.t}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ADDED CODE: Template selection modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowTemplateModal(false)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 w-[min(95%,900px)] z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black">Choose Template</h3>
              <button onClick={() => setShowTemplateModal(false)} className="text-slate-500 hover:text-slate-700">Close</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => {
                    setResumeData(prev => ({ ...prev, template: template.id }));
                    setShowTemplateModal(false);
                  }}
                  className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                    resumeData.template === template.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg mb-3 flex items-center justify-center ${
                    template.id === 'elegant' ? 'bg-slate-600' : 
                    template.id === 'modern' ? 'bg-blue-600' : 'bg-purple-600'
                  }`}>
                    {resumeData.template === template.id && <Check size={16} className="text-white" />}
                  </div>
                  <p className="font-bold text-slate-800 dark:text-white text-sm">{template.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{template.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* Main Content */}
      <div className="flex-1 p-6 md:p-12">
        <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl p-6 md:p-8 border border-white dark:border-slate-700">
          {/* Two-column: left -> form steps, right -> live preview */}
          <div className="flex flex-col md:flex-row gap-6">
            <div ref={formRef} className="w-full md:w-1/2">
              <div className="step-content min-h-125">
                {/* Step 1: Personal + Photo + Template */}
            {currentStep === 1 && (
              <div className="space-y-8">
                {/* Template Selection moved to popup modal (trigger button below) */}

                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-3xl bg-slate-100 dark:bg-slate-700 overflow-hidden border-4 border-white shadow-lg">
                      {resumeData.personalInfo.profileImage ? <img src={resumeData.personalInfo.profileImage} className="w-full h-full object-cover" alt="Profile" /> : <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={40}/></div>}
                    </div>
                    <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl cursor-pointer shadow-lg hover:scale-110 transition-all">
                      <Plus size={16}/><input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">Personal Info</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Update your basic details and profile summary.</p>
                    <div className="mt-3">
                      <button onClick={() => setShowTemplateModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Choose Template</button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <input className="input-field" placeholder="Full Name" value={resumeData.personalInfo.fullName} onChange={(e)=>handleInputChange('personalInfo', 'fullName', e.target.value)} />
                   <input className="input-field" placeholder="Job Title" value={resumeData.personalInfo.jobTitle} onChange={(e)=>handleInputChange('personalInfo', 'jobTitle', e.target.value)} />
                   <input className="input-field" placeholder="Email" value={resumeData.personalInfo.email} onChange={(e)=>handleInputChange('personalInfo', 'email', e.target.value)} />
                   <input className="input-field" placeholder="Phone" value={resumeData.personalInfo.phone} onChange={(e)=>handleInputChange('personalInfo', 'phone', e.target.value)} />
                   <input className="input-field" placeholder="Address" value={resumeData.personalInfo.address} onChange={(e)=>handleInputChange('personalInfo', 'address', e.target.value)} />
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase ml-1">Profile Summary</label>
                   <textarea className="input-field h-24 mt-1" placeholder="Describe yourself professionally..." value={resumeData.personalInfo.summary} onChange={(e)=>handleInputChange('personalInfo', 'summary', e.target.value)} />
                </div>
              </div>
            )}

            {/* Step 2: Experience */}
            {currentStep === 2 && (
               <div className="space-y-6">
                 <div className="flex justify-between items-center">
                   <h2 className="text-2xl font-black text-slate-800 dark:text-white">Experience</h2>
                   <button onClick={()=>addItem('experience')} className="bg-blue-600 text-white p-2 rounded-lg"><Plus size={18}/></button>
                 </div>
                 {resumeData.experience.map((exp, idx) => (
                   <div key={idx} className="p-4 bg-slate-50 rounded-2xl relative border border-slate-100">
                     <button onClick={()=>removeItem('experience', idx)} className="absolute top-4 right-4 text-red-400"><Trash2 size={16}/></button>
                     <div className="grid grid-cols-2 gap-3">
                       <input placeholder="Company" className="input-field bg-white" value={exp.company} onChange={(e)=>handleInputChange('experience', 'company', e.target.value, idx)} />
                       <input placeholder="Role" className="input-field bg-white" value={exp.role} onChange={(e)=>handleInputChange('experience', 'role', e.target.value, idx)} />
                       <input placeholder="Duration (e.g. 2021 - Present)" className="input-field bg-white col-span-2" value={exp.duration} onChange={(e)=>handleInputChange('experience', 'duration', e.target.value, idx)} />
                       <textarea placeholder="Description" className="input-field bg-white col-span-2 h-20" value={exp.description} onChange={(e)=>handleInputChange('experience', 'description', e.target.value, idx)} />
                     </div>
                   </div>
                 ))}
               </div>
            )}

            {/* Step 3: Education */}
            {currentStep === 3 && (
               <div className="space-y-6">
                 <div className="flex justify-between items-center">
                   <h2 className="text-2xl font-black text-slate-800 dark:text-white">Education</h2>
                   <button onClick={()=>addItem('education')} className="bg-blue-600 text-white p-2 rounded-lg"><Plus size={18}/></button>
                 </div>
                 {resumeData.education.map((edu, idx) => (
                   <div key={idx} className="p-4 bg-slate-50 rounded-2xl relative border border-slate-100">
                     <button onClick={()=>removeItem('education', idx)} className="absolute top-4 right-4 text-red-400"><Trash2 size={16}/></button>
                     <div className="grid grid-cols-2 gap-3">
                       <input placeholder="School / University" className="input-field bg-white col-span-2" value={edu.school} onChange={(e)=>handleInputChange('education', 'school', e.target.value, idx)} />
                       <input placeholder="Degree" className="input-field bg-white" value={edu.degree} onChange={(e)=>handleInputChange('education', 'degree', e.target.value, idx)} />
                       <input placeholder="Graduation Year" className="input-field bg-white" value={edu.year} onChange={(e)=>handleInputChange('education', 'year', e.target.value, idx)} />
                     </div>
                   </div>
                 ))}
               </div>
            )}

            {/* Step 4: Projects */}
            {currentStep === 4 && (
               <div className="space-y-6">
                 <div className="flex justify-between items-center">
                   <h2 className="text-2xl font-black text-slate-800 dark:text-white">Projects</h2>
                   <button onClick={()=>addItem('projects')} className="bg-blue-600 text-white p-2 rounded-lg"><Plus size={18}/></button>
                 </div>
                 {resumeData.projects.map((proj, idx) => (
                   <div key={idx} className="p-4 bg-slate-50 rounded-2xl relative border border-slate-100">
                     <button onClick={()=>removeItem('projects', idx)} className="absolute top-4 right-4 text-red-400"><Trash2 size={16}/></button>
                     <div className="space-y-3">
                       <input placeholder="Project Title" className="input-field bg-white" value={proj.title} onChange={(e)=>handleInputChange('projects', 'title', e.target.value, idx)} />
                       <input placeholder="Link (Optional)" className="input-field bg-white" value={proj.link} onChange={(e)=>handleInputChange('projects', 'link', e.target.value, idx)} />
                       <textarea placeholder="Brief summary of project..." className="input-field bg-white h-20" value={proj.description} onChange={(e)=>handleInputChange('projects', 'description', e.target.value, idx)} />
                     </div>
                   </div>
                 ))}
               </div>
            )}

            {/* Step 5: Certifications */}
            {currentStep === 5 && (
               <div className="space-y-6">
                 <div className="flex justify-between items-center">
                   <h2 className="text-2xl font-black text-slate-800 dark:text-white">Certifications</h2>
                   <button onClick={()=>addItem('certifications')} className="bg-blue-600 text-white p-2 rounded-lg"><Plus size={18}/></button>
                 </div>
                 {resumeData.certifications.map((cert, idx) => (
                   <div key={idx} className="p-4 bg-slate-50 rounded-2xl relative border border-slate-100">
                     <button onClick={()=>removeItem('certifications', idx)} className="absolute top-4 right-4 text-red-400"><Trash2 size={16}/></button>
                     <div className="grid grid-cols-2 gap-3">
                       <input placeholder="Name" className="input-field bg-white" value={cert.name} onChange={(e)=>handleInputChange('certifications', 'name', e.target.value, idx)} />
                       <input placeholder="Issuer" className="input-field bg-white" value={cert.issuer} onChange={(e)=>handleInputChange('certifications', 'issuer', e.target.value, idx)} />
                       <input placeholder="Year" className="input-field bg-white col-span-2" value={cert.year} onChange={(e)=>handleInputChange('certifications', 'year', e.target.value, idx)} />
                     </div>
                   </div>
                 ))}
               </div>
            )}

            {/* Step 6: Skills & Languages */}
            {currentStep === 6 && (
               <div className="space-y-8">
                 <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-4">Skills & Languages</h2>
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase">Professional Skills (Comma separated)</label>
                    <textarea className="input-field h-32 mt-2" placeholder="React, Python, Node.js..." value={resumeData.skills} onChange={(e)=>setResumeData({...resumeData, skills: e.target.value})} />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase">Languages</label>
                    <input className="input-field mt-2" placeholder="English, Urdu, German..." value={resumeData.languages} onChange={(e)=>setResumeData({...resumeData, languages: e.target.value})} />
                 </div>
               </div>
            )}
              </div>
            </div>

            {/* Live Preview Column */}
            <div className="hidden md:block md:w-1/2">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl h-full border border-slate-100 dark:border-slate-700 overflow-hidden">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Live Preview</p>
                {/* ADDED CODE: scale preview to fit the column and remove internal scrollbar */}
                <div ref={previewWrapperRef} className="w-full bg-white dark:bg-slate-900 rounded-lg shadow-sm relative" style={{height: 'calc(100vh - 220px)', overflow: 'hidden'}}>
                  <div style={{position: 'absolute', top: '12px', left: '50%', transform: `translateX(-50%) scale(${previewScale})`, transformOrigin: 'top center', transition: 'transform 220ms ease', willChange: 'transform'}}>
                    <div ref={previewInnerRef} style={{width: 816, height: 1120, boxSizing: 'border-box'}}>
                      <PreviewRenderer data={resumeData} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-10 border-t border-slate-100 mt-10">
            <button disabled={currentStep === 1} onClick={() => setCurrentStep(currentStep - 1)} className="font-bold text-slate-400 dark:text-slate-500 disabled:opacity-0 flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300 transition-all"><ChevronLeft size={18}/> Back</button>
            {currentStep < 6 ? (
              <button onClick={() => setCurrentStep(currentStep + 1)} className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all">Continue <ChevronRight size={18}/></button>
            ) : (
              <button onClick={submitResume} disabled={loading} className="bg-green-600 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all">
                {loading ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} {id ? 'Update' : 'Finish'} Resume
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .input-field {
          width: 100%;
          padding: 12px 16px;
          background-color: #f1f5f9;
          color: #1e293b;
          border-radius: 12px;
          border: 2px solid transparent;
          transition: all 0.2s;
          outline: none;
          font-size: 14px;
        }
        .input-field::placeholder {
          color: #94a3b8;
        }
        .dark .input-field {
          background-color: #1e293b;
          color: #f1f5f9;
          border-color: #334155;
        }
        .dark .input-field::placeholder {
          color: #64748b;
        }
        .input-field:focus {
          border-color: #2563eb;
          background-color: white;
          color: #1e293b;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
        }
        .dark .input-field:focus {
          background-color: #0f172a;
          color: #f1f5f9;
          border-color: #3b82f6;
        }
      `}</style>
    </div>
    </ResumeProvider>
  );
};

export default CreateResume;