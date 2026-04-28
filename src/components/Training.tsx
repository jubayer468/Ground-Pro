/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GraduationCap, Award, PlayCircle, Clock, BookOpen, ChevronRight, CheckCircle2, ShieldCheck, Download, Loader2, Sparkles, BrainCircuit, Wand2 } from 'lucide-react';
import { TRAINING_MODULES } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import LessonModal from './LessonModal';
import AssignmentModal from './AssignmentModal';
import Markdown from 'react-markdown';
import { getModuleOverview } from '../services/geminiTrainingService';

export default function Training() {
  const [activeModule, setActiveModule] = useState(TRAINING_MODULES[0]);
  const [moduleOverviewCache, setModuleOverviewCache] = useState<Record<string, string>>({});
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    loadModuleOverview();
  }, [activeModule]);

  const loadModuleOverview = async () => {
    if (moduleOverviewCache[activeModule.id]) return;
    
    setIsLoadingOverview(true);
    try {
      const overview = await getModuleOverview(activeModule.title, activeModule.description);
      setModuleOverviewCache(prev => ({
        ...prev,
        [activeModule.id]: overview || activeModule.description
      }));
    } catch (error) {
      console.error("Failed to load overview:", error);
      setModuleOverviewCache(prev => ({
        ...prev,
        [activeModule.id]: activeModule.description
      }));
    } finally {
      setIsLoadingOverview(false);
    }
  };

  const currentOverview = moduleOverviewCache[activeModule.id] || activeModule.description;
  
  const [completedLessons, setCompletedLessons] = useState<Record<string, string[]>>(() => {
    // Initial state based on TRAINING_MODULES.completed
    const initial: Record<string, string[]> = {};
    TRAINING_MODULES.forEach(m => {
      if (m.completed) {
        initial[m.id] = [...(m.curriculum || [])];
      }
    });
    return initial;
  });
  const [activeLesson, setActiveLesson] = useState<{moduleTitle: string, lessonTitle: string} | null>(null);
  const [showAssignment, setShowAssignment] = useState(false);
  const [assignmentPassed, setAssignmentPassed] = useState(false);

  // Total lessons count
  const totalLessons = TRAINING_MODULES.reduce((acc, m) => acc + (m.curriculum?.length || 0), 0);
  const completedCount = Object.values(completedLessons).reduce((acc, lessons) => acc + lessons.length, 0);
  const progressPercent = Math.round((completedCount / totalLessons) * 100);
  const allModulesCompleted = TRAINING_MODULES.every(m => {
    const done = completedLessons[m.id]?.length || 0;
    return done === (m.curriculum?.length || 0);
  });

  const handleLessonComplete = (lessonTitle: string) => {
    setActiveLesson(null);
    setCompletedLessons(prev => {
      const moduleLessons = prev[activeModule.id] || [];
      if (!moduleLessons.includes(lessonTitle)) {
        return {
          ...prev,
          [activeModule.id]: [...moduleLessons, lessonTitle]
        };
      }
      return prev;
    });
  };

  const downloadPDF = async () => {
    if (!certificateRef.current) return;
    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('groundpro-certification.pdf');
    } catch (err) {
      console.error('PDF Export Error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <AnimatePresence>
        {activeLesson && (
          <LessonModal
            moduleTitle={activeLesson.moduleTitle}
            lessonTitle={activeLesson.lessonTitle}
            onClose={(completed) => {
              if (completed) handleLessonComplete(activeLesson.lessonTitle);
              else setActiveLesson(null);
            }}
          />
        )}
        {showAssignment && (
          <AssignmentModal 
            onClose={() => setShowAssignment(false)}
            onPassed={() => {
              setAssignmentPassed(true);
              setShowAssignment(false);
              setShowCertificate(true);
            }}
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end mb-12">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-natural-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-natural-primary/20">
            <GraduationCap size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-natural-text tracking-tight uppercase">Professional Curator Academy</h1>
            <p className="text-natural-muted text-sm font-semibold mt-1">GroundPro Verified Certification • Lead by Jubayer Ahmed</p>
          </div>
        </div>
        <div className="bg-white px-5 py-2.5 border border-natural-border rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="text-right">
            <p className="text-[10px] font-black text-natural-muted uppercase tracking-widest leading-none">Your Progress</p>
            <p className="text-sm font-black text-natural-text mt-1">{progressPercent}% COMPLETE</p>
          </div>
          <div className="w-12 h-12 rounded-full relative flex items-center justify-center">
             <svg className="w-full h-full -rotate-90">
               <circle
                 cx="24"
                 cy="24"
                 r="20"
                 fill="none"
                 stroke="currentColor"
                 strokeWidth="4"
                 className="text-natural-bg"
               />
               <circle
                 cx="24"
                 cy="24"
                 r="20"
                 fill="none"
                 stroke="currentColor"
                 strokeWidth="4"
                 strokeDasharray="125.6"
                 strokeDashoffset={125.6 * (1 - progressPercent / 100)}
                 strokeLinecap="round"
                 className="text-natural-primary transition-all duration-1000 ease-out"
               />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-natural-primary">
               {completedCount}/{totalLessons}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Module Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xs font-black text-natural-muted uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
            <BookOpen size={16} />
            Learning Modules
          </h2>
          {TRAINING_MODULES.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module)}
              className={`w-full text-left p-6 rounded-[24px] border transition-all duration-300 relative group ${
                activeModule.id === module.id
                  ? 'bg-white border-natural-primary shadow-xl shadow-natural-primary/5 translate-x-2'
                  : 'bg-white/40 border-natural-border hover:bg-white/80'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                  (completedLessons[module.id]?.length || 0) === (module.curriculum?.length || 0)
                    ? 'bg-natural-bg border-natural-primary/20 text-natural-primary' 
                    : 'bg-natural-bg/50 border-natural-border text-natural-muted'
                }`}>
                  {module.difficulty}
                </span>
                {(completedLessons[module.id]?.length || 0) === (module.curriculum?.length || 0) && <CheckCircle2 size={16} className="text-natural-primary" />}
              </div>
              <h3 className="text-lg font-black text-natural-text mt-4 group-hover:text-natural-primary transition-colors">{module.title}</h3>
              <div className="flex items-center gap-4 mt-3 text-natural-muted font-bold text-[10px] uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{module.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen size={12} />
                  <span>{module.lessons} Modules</span>
                </div>
              </div>
            </button>
          ))}

          <button 
            disabled={!allModulesCompleted}
            onClick={() => {
              if (assignmentPassed) setShowCertificate(true);
              else setShowAssignment(true);
            }}
            className={`w-full mt-10 p-6 rounded-[24px] border-2 border-dashed flex flex-col items-center text-center transition-all ${
              allModulesCompleted 
                ? 'bg-natural-primary/5 border-natural-primary text-natural-primary hover:bg-natural-primary/10 cursor-pointer' 
                : 'bg-natural-bg border-natural-border text-natural-muted opacity-60'
            }`}
          >
            {assignmentPassed ? <Award size={48} className="mb-4" /> : <BrainCircuit size={48} className="mb-4" />}
            <h3 className="font-black uppercase tracking-widest text-xs">
              {assignmentPassed ? 'Certification Claim' : 'Final Assignment'}
            </h3>
            <p className="text-[10px] font-medium mt-1 leading-relaxed px-4">
              {assignmentPassed 
                ? 'Your professional curator certificate is ready for download.' 
                : 'Complete all basic modules to unlock your GroundPro Certification Exam.'}
            </p>
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="bg-white rounded-[40px] border border-natural-border shadow-sm p-12 h-full"
            >
            <div className="aspect-video bg-natural-bg rounded-[40px] border-2 border-dashed border-natural-primary/20 flex flex-col items-center justify-center p-12 text-center group cursor-default relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
                  <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
               </div>
               
               <div className="relative z-10 space-y-6 max-w-lg">
                  <div className="w-24 h-24 bg-white rounded-[32px] border border-natural-border shadow-2xl flex items-center justify-center mx-auto text-natural-primary group-hover:scale-110 transition-transform duration-500">
                    <BookOpen size={40} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-natural-text uppercase tracking-tight mb-2">Technical Curriculum</h3>
                    <p className="text-sm font-medium text-natural-muted leading-relaxed">
                      Deep-dive into the technical specifications of professional sports turf management.
                      Access rigorous AI-corrected manuscripts and precision guidance.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-6 pt-4">
                    <div className="text-center">
                      <p className="text-[9px] font-black uppercase tracking-widest text-natural-muted mb-1">Standard</p>
                      <p className="text-xs font-black text-natural-text">2026 ICC COMPLIANT</p>
                    </div>
                    <div className="w-px h-8 bg-natural-border" />
                    <div className="text-center">
                      <p className="text-[9px] font-black uppercase tracking-widest text-natural-muted mb-1">Methodology</p>
                      <p className="text-xs font-black text-natural-text">AI-ASSISTED LEARNING</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="mt-10">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-3xl font-black text-natural-text tracking-tight uppercase">{activeModule.title}</h2>
                 <div className="flex items-center gap-2 bg-natural-primary/10 text-natural-primary px-3 py-1 rounded-full border border-natural-primary/20">
                   <Sparkles size={12} />
                   <span className="text-[10px] font-black uppercase tracking-widest">AI Content Correction Active</span>
                 </div>
               </div>

               <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
                 <div className="xl:col-span-3 space-y-8">
                   <div className="bg-natural-bg/50 p-8 rounded-[32px] border border-natural-border/50 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Wand2 size={80} />
                     </div>
                     <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-natural-primary mb-4 flex items-center gap-2">
                       <Sparkles size={14} />
                       Session Strategic Overview
                     </h4>
                     {isLoadingOverview ? (
                        <div className="py-12 space-y-4">
                          <div className="flex items-center gap-3 mb-6">
                            <motion.div 
                              animate={{ scale: [1, 1.2, 1] }} 
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="w-12 h-12 bg-natural-primary/10 rounded-2xl flex items-center justify-center text-natural-primary"
                            >
                              <Loader2 className="animate-spin" size={20} />
                            </motion.div>
                            <div className="space-y-2 flex-1">
                               <div className="h-2 w-24 bg-natural-primary/20 rounded-full animate-pulse" />
                               <div className="h-2 w-full bg-natural-bg rounded-full animate-pulse" />
                            </div>
                          </div>
                          <div className="space-y-3">
                             <div className="h-4 w-full bg-natural-bg rounded-xl animate-pulse" />
                             <div className="h-4 w-[90%] bg-natural-bg rounded-xl animate-pulse" />
                             <div className="h-4 w-[95%] bg-natural-bg rounded-xl animate-pulse" />
                             <div className="h-4 w-[70%] bg-natural-bg rounded-xl animate-pulse" />
                          </div>
                        </div>
                      ) : (
                        <motion.div 
                          key={`content-${activeModule.id}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="markdown-body prose prose-sm max-w-none text-natural-muted leading-relaxed font-medium prose-p:mb-4"
                        >
                          <Markdown>{currentOverview}</Markdown>
                        </motion.div>
                      )}
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-natural-muted underline decoration-natural-primary/30 underline-offset-4">Interactive Curriculum</h4>
                        <span className="text-[10px] font-black text-natural-primary uppercase tracking-widest">
                           {completedLessons[activeModule.id]?.length || 0} / {activeModule.curriculum?.length} Completed
                        </span>
                      </div>
                      <div className="grid gap-3">
                        {activeModule.curriculum?.map((lesson, index) => {
                          const isDone = completedLessons[activeModule.id]?.includes(lesson);
                          return (
                            <button 
                              key={index} 
                              onClick={() => setActiveLesson({ moduleTitle: activeModule.title, lessonTitle: lesson })}
                              className="w-full flex items-center justify-between p-5 bg-white border border-natural-border rounded-2xl hover:border-natural-primary shadow-sm hover:shadow-md transition-all group text-left"
                            >
                               <div className="flex items-center gap-4">
                                  <span className={`w-8 h-8 rounded-lg border flex items-center justify-center text-[10px] font-black transition-colors ${
                                    isDone ? 'bg-natural-primary border-natural-primary text-white' : 'bg-natural-bg border-natural-border text-natural-muted group-hover:text-natural-primary'
                                  }`}>
                                    {index + 1}
                                  </span>
                                  <span className={`text-sm font-bold ${isDone ? 'text-natural-text opacity-60' : 'text-natural-text'}`}>{lesson}</span>
                               </div>
                               <div className="flex items-center gap-4">
                                  <div className="hidden sm:flex items-center gap-1.5 text-[9px] font-black text-natural-muted uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                     <Sparkles size={10} className="text-natural-primary" />
                                     <span>Refine with AI</span>
                                  </div>
                                  {isDone ? <CheckCircle2 size={18} className="text-natural-primary" /> : <BookOpen size={18} className="text-natural-muted group-hover:text-natural-primary" />}
                               </div>
                            </button>
                          );
                        })}
                      </div>
                   </div>
                 </div>

                 <div className="xl:col-span-2 space-y-6">
                    <div className="bg-natural-secondary text-white p-8 rounded-[40px] shadow-2xl shadow-natural-secondary/20 h-full flex flex-col">
                       <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                         <div className="p-2 bg-natural-primary rounded-xl">
                            <GraduationCap size={20} />
                         </div>
                         Professional Certification
                       </h3>
                       
                       <p className="text-sm font-medium opacity-60 leading-relaxed mb-10 italic">
                         To qualify for the GroundPro Professional Curator certificate, active completion of ALL module curriculum is required, followed by a rigorous 80% pass on the board-supervised AI assignment.
                       </p>

                       <div className="space-y-4 mt-auto">
                         <div className="p-5 bg-white/5 rounded-3xl border border-white/10">
                            <p className="text-[10px] font-black uppercase tracking-widest mb-2">Module Mastery</p>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${((completedLessons[activeModule.id]?.length || 0) / (activeModule.curriculum?.length || 1)) * 100}%` }}
                                className="bg-natural-primary h-full"
                              />
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/10 group cursor-help">
                            <ShieldCheck className="text-natural-primary" size={24} />
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-widest leading-none">Security Status</p>
                               <p className="text-[9px] font-medium opacity-60 mt-1 uppercase tracking-tight">Verified by CEO Jubayer Ahmed</p>
                            </div>
                         </div>
                       </div>
                    </div>
                 </div>
               </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>

      {showCertificate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-natural-secondary/60 backdrop-blur-md">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="max-w-4xl w-full"
           >
              {/* Exportable Area */}
              <div 
                ref={certificateRef}
                className="bg-white p-20 shadow-2xl relative border-[24px] border-natural-bg overflow-hidden"
                style={{ aspectRatio: '1.414/1' }}
              >
                <div className="absolute top-12 left-12">
                   <h1 className="text-3xl font-black text-natural-primary">GroundPro</h1>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-natural-muted mt-1">Professional Turf Platform</p>
                </div>
                <div className="absolute top-12 right-12 text-right opacity-10">
                   <ShieldCheck size={120} className="text-natural-primary" />
                </div>

                <div className="text-center space-y-10 mt-16">
                   <div className="space-y-4">
                      <p className="text-xs font-black uppercase tracking-[0.5em] text-natural-muted">Certificate of Professional Excellence</p>
                      <h2 className="text-5xl font-extrabold text-natural-text leading-tight tracking-tight">Technical Groundskeeping Mastery</h2>
                   </div>
                   
                   <div className="py-6">
                    <p className="text-xl font-medium text-natural-muted italic">This professional certification is awarded to</p>
                    <div className="mt-6 inline-block px-16 border-b-4 border-natural-primary/30 pb-3">
                      <h3 className="text-4xl font-black text-natural-primary">John Doe</h3>
                    </div>
                   </div>

                   <p className="text-sm font-semibold text-natural-muted leading-relaxed max-w-2xl mx-auto">
                      Having successfully completed the comprehensive GroundPro Professional Turf Excellence curriculum 
                      and demonstrated elite technical proficiency in advanced soil mineralogy, 
                      precision pitch marking, and high-performance moisture profile management.
                   </p>
                   
                   <div className="flex justify-between items-end pt-16">
                      <div className="text-left">
                         <p className="text-[10px] font-black uppercase text-natural-muted tracking-widest">Date of Issue</p>
                         <p className="text-md font-extrabold text-natural-text mt-1">APRIL 28, 2026</p>
                      </div>
                      <div className="text-center px-10">
                         <div className="w-16 h-16 bg-natural-primary/5 rounded-full flex items-center justify-center mb-2 mx-auto border border-natural-primary/10">
                          <Award size={32} className="text-natural-primary" />
                         </div>
                         <p className="text-[10px] font-black uppercase text-natural-muted tracking-[0.2em]">VERIFIED ID: GP-CERT-2026-004</p>
                      </div>
                      <div className="text-right">
                         <div className="mb-[-8px] font-signature text-4xl text-natural-primary px-4 select-none">Jubayer Ahmed</div>
                         <div className="w-32 h-px bg-natural-border mx-auto mb-2" />
                         <p className="text-[10px] font-black uppercase text-natural-muted tracking-widest">Jubayer Ahmed</p>
                         <p className="text-[8px] font-black uppercase text-natural-primary tracking-widest mt-0.5">CEO, GroundPro</p>
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button 
                  onClick={downloadPDF}
                  disabled={isExporting}
                  className="flex-1 py-5 bg-natural-primary text-white rounded-[24px] font-black text-sm shadow-2xl shadow-natural-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isExporting ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                  <span>{isExporting ? 'Generating PDF...' : 'Download Certificate (PDF)'}</span>
                </button>
                <button 
                  onClick={() => setShowCertificate(false)}
                  className="px-10 py-5 bg-white text-natural-text border border-natural-border rounded-[24px] font-black text-sm hover:bg-natural-bg transition-all shadow-sm"
                >
                  Close
                </button>
              </div>
           </motion.div>
        </div>
      )}
    </div>
  );
}
