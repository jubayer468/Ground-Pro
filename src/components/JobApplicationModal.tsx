/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Check, Upload, Briefcase, User, Mail, Phone, Award, FileText } from 'lucide-react';

interface JobApplicationModalProps {
  job: any;
  onClose: () => void;
}

export default function JobApplicationModal({ job, onClose }: JobApplicationModalProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experienceYears: '',
    currentClub: '',
    previousClub: '',
    skills: [] as string[],
    coverLetter: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const steps = [
    { title: 'Contact', icon: User },
    { title: 'Experience', icon: Briefcase },
    { title: 'Skills', icon: Award },
    { title: 'Letter', icon: FileText },
    { title: 'Confirm', icon: Check },
  ];

  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  const availableSkills = [
    "Pitch Preparation", "Turf Disease ID", "Irrigation Systems", 
    "Soil Analysis", "Machinery Ops", "Renovation Planning",
    "Staff Management", "Budgeting"
  ];

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h3 className="text-xl font-extrabold text-natural-text">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-natural-muted">First Name</label>
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full bg-natural-bg border border-natural-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-natural-primary"
                  placeholder="John"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-natural-muted">Last Name</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full bg-natural-bg border border-natural-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-natural-primary"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-natural-muted">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-natural-muted" />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-natural-bg border border-natural-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-natural-primary"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-natural-muted">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-natural-muted" />
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-natural-bg border border-natural-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-natural-primary"
                  placeholder="+44 7700 900000"
                />
              </div>
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h3 className="text-xl font-extrabold text-natural-text">Experience</h3>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-natural-muted">Years of Experience</label>
              <select 
                value={formData.experienceYears}
                onChange={(e) => setFormData({...formData, experienceYears: e.target.value})}
                className="w-full bg-natural-bg border border-natural-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-natural-primary"
              >
                <option value="">Select years</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-natural-muted">Current Club / Stadium</label>
              <input 
                type="text" 
                value={formData.currentClub}
                onChange={(e) => setFormData({...formData, currentClub: e.target.value})}
                className="w-full bg-natural-bg border border-natural-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-natural-primary"
                placeholder="Lord's Cricket Ground"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-natural-muted">Previous Club</label>
              <input 
                type="text" 
                value={formData.previousClub}
                onChange={(e) => setFormData({...formData, previousClub: e.target.value})}
                className="w-full bg-natural-bg border border-natural-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-natural-primary"
                placeholder="The Oval"
              />
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h3 className="text-xl font-extrabold text-natural-text">Specialized Skills</h3>
            <p className="text-xs text-natural-muted font-medium mb-4">Select all that apply to your professional profile.</p>
            <div className="grid grid-cols-2 gap-2">
              {availableSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                    formData.skills.includes(skill)
                      ? 'bg-natural-primary text-white border-natural-primary shadow-md'
                      : 'bg-white text-natural-muted border-natural-border hover:border-natural-muted/50'
                  }`}
                >
                  {formData.skills.includes(skill) && <Check size={14} />}
                  <span>{skill}</span>
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h3 className="text-xl font-extrabold text-natural-text">Cover Letter</h3>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-natural-muted">Why are you the best fit?</label>
              <textarea 
                rows={6}
                value={formData.coverLetter}
                onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                className="w-full bg-natural-bg border border-natural-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-natural-primary resize-none"
                placeholder="Briefly describe your approach to pitch management and your career goals..."
              />
            </div>
            <div className="p-4 border-2 border-dashed border-natural-border rounded-2xl flex flex-col items-center justify-center space-y-2 group hover:border-natural-primary/50 transition-colors cursor-pointer">
              <Upload size={20} className="text-natural-muted group-hover:text-natural-primary" />
              <span className="text-xs font-bold text-natural-muted group-hover:text-natural-primary">Upload Resume (PDF/DOC)</span>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="text-xl font-extrabold text-natural-text">Confirm Application</h3>
            <div className="bg-natural-bg p-5 rounded-[24px] border border-natural-border space-y-4">
              <div className="flex justify-between items-start border-b border-natural-border/50 pb-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-natural-muted">Applicant</p>
                  <p className="text-sm font-bold text-natural-text">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-natural-muted">Experience</p>
                  <p className="text-sm font-bold text-natural-text">{formData.experienceYears} Years</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-natural-muted">Skills Selected</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.skills.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-white border border-natural-border rounded text-[10px] font-bold text-natural-primary">{s}</span>
                  ))}
                  {formData.skills.length === 0 && <span className="text-[10px] italic text-natural-muted">No skills selected</span>}
                </div>
              </div>
              <div className="pt-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-natural-muted">Position Applying For</p>
                <div className="flex items-center space-x-2 mt-1">
                   <p className="text-sm font-black text-natural-primary">{job.title}</p>
                   <span className="text-xs text-natural-muted font-bold">@ {job.club}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-natural-muted text-center font-medium">By submitting, you agree to share your professional profile with the recruiter.</p>
          </motion.div>
        );
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-natural-secondary/60 backdrop-blur-md">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[40px] p-12 text-center max-w-md w-full shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-natural-primary group" />
          <div className="w-20 h-20 bg-natural-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-natural-primary/20">
            <Check size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-natural-text mb-4">Application Sent!</h2>
          <p className="text-natural-muted font-medium mb-8">
            Your credentials have been securely transmitted to the grounds team at {job.club}. Good luck!
          </p>
          <div className="w-full bg-natural-bg h-1 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="bg-natural-primary h-full"
            />
          </div>
          <p className="text-[10px] font-black text-natural-muted mt-4 uppercase tracking-[0.2em]">Redirecting to Market...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-natural-secondary/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl border border-natural-border flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-natural-border flex justify-between items-center bg-natural-bg/30">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-natural-muted mb-1">Applying for</h2>
            <div className="flex items-center space-x-3">
              <h3 className="text-2xl font-black text-natural-text leading-tight">{job.title}</h3>
              <span className="text-xs font-bold text-natural-primary px-3 py-1 bg-white border border-natural-border rounded-full shadow-sm">{job.club}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-natural-bg rounded-xl transition-colors text-natural-muted hover:text-natural-text">
            <X size={24} />
          </button>
        </div>

        {/* Form Steps */}
        <div className="flex-1 overflow-y-auto p-10">
          {/* Progress bar */}
          <div className="flex justify-between mb-12 relative px-2">
            <div className="absolute top-[18px] left-0 w-full h-[2px] bg-natural-border -z-10" />
            <motion.div 
              className="absolute top-[18px] left-0 h-[2px] bg-natural-primary -z-10" 
              initial={{ width: "0%" }}
              animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
            {steps.map((s, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${
                    idx <= step 
                      ? 'bg-natural-primary text-white border-natural-primary shadow-lg shadow-natural-primary/20' 
                      : 'bg-white text-natural-muted border-natural-border'
                  }`}
                >
                  <s.icon size={18} />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${idx <= step ? 'text-natural-primary' : 'text-natural-muted'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-8 bg-natural-bg/50 border-t border-natural-border flex justify-between items-center">
          <button 
            onClick={handleBack}
            disabled={step === 0}
            className="flex items-center space-x-2 text-natural-muted font-extrabold text-sm hover:text-natural-text disabled:opacity-0 transition-all uppercase tracking-widest"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>

          {step === steps.length - 1 ? (
             <button 
              onClick={handleSubmit}
              className="bg-natural-primary text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-natural-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center space-x-3"
            >
              <span>Submit Securely</span>
              <Check size={20} />
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="bg-white border-2 border-natural-primary text-natural-primary px-10 py-4 rounded-2xl font-black text-sm hover:bg-natural-primary hover:text-white transition-all shadow-lg active:scale-95 flex items-center space-x-3"
            >
              <span>Continue</span>
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
