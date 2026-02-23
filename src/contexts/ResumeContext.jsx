import React, { createContext, useContext, useState, useMemo } from 'react';

const ResumeContext = createContext(null);

const defaultState = {
  personalInfo: { fullName: '', email: '', phone: '', address: '', summary: '', jobTitle: '', profileImage: '' },
  education: [{ school: '', degree: '', year: '' }],
  experience: [{ company: '', role: '', duration: '', description: '' }],
  projects: [{ title: '', link: '', description: '' }],
  certifications: [{ name: '', issuer: '', year: '' }],
  skills: '',
  languages: '',
  template: 'elegant'
};

export const ResumeProvider = ({ children, initialData }) => {
  const [resumeData, setResumeData] = useState(initialData || defaultState);

  const api = useMemo(() => ({ resumeData, setResumeData }), [resumeData]);

  return (
    <ResumeContext.Provider value={api}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
};

export default ResumeContext;
