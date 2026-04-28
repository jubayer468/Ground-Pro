/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, Sparkles, CheckCircle2, Wand2, BookOpen, BrainCircuit, Clock, BarChart3 } from 'lucide-react';
import Markdown from 'react-markdown';
import { getLessonContent, LessonContent } from '../services/geminiTrainingService';

interface LessonModalProps {
  moduleTitle: string;
  lessonTitle: string;
  onClose: (completed: boolean) => void;
}

type RefinementLevel = 'standard' | 'professional' | 'simplified';

export default function LessonModal({ moduleTitle, lessonTitle, onClose }: LessonModalProps) {
  const [content, setContent] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState<RefinementLevel>('standard');
  const [isRefining, setIsRefining] = useState(false);

  useEffect(() => {
    loadContent();
  }, [moduleTitle, lessonTitle, level]);

  const loadContent = async () => {
    setIsRefining(true);
    try {
      const data = await getLessonContent(moduleTitle, lessonTitle, level);
      setContent(data);
    } catch (error) {
      console.error("Failed to load lesson content:", error);
    } finally {
      setLoading(false);
      setIsRefining(false);
    }
  };

  const readingTime = content ? Math.ceil(content.content.split(' ').length / 180) : 0;

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center p-4 bg-natural-secondary/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[40px] w-full max-w-5xl overflow-hidden shadow-2xl border border-natural-border flex flex-col max-h-[95vh]"
      >
        <div className="p-8 border-b border-natural-border flex justify-between items-center bg-natural-primary text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl relative overflow-hidden backdrop-blur-sm">
              <BookOpen size={24} className={isRefining ? 'animate-pulse' : ''} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">Technical Manuscript</h2>
                <span className="w-1 h-1 bg-white/40 rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">{moduleTitle}</span>
              </div>
              <h3 className="text-2xl font-black uppercase truncate max-w-md">{lessonTitle}</h3>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8 mr-10">
               <div className="text-center">
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">Duration</p>
                 <div className="flex items-center gap-2 text-xs font-black">
                   <Clock size={14} className="text-white/70" />
                   {readingTime} MIN READ
                 </div>
               </div>
               <div className="text-center">
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">Technical Level</p>
                 <div className="flex items-center gap-2 text-xs font-black capitalize">
                   <BarChart3 size={14} className="text-white/70" />
                   {level}
                 </div>
               </div>
            </div>
            <button onClick={() => onClose(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-colors border border-white/20">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex bg-natural-bg/50 border-b border-natural-border px-8 py-3 gap-3 overflow-x-auto items-center">
          <div className="flex items-center gap-2 mr-4 shrink-0 px-3 py-1.5 bg-white rounded-xl border border-natural-border shadow-sm">
            <Wand2 size={12} className="text-natural-primary" />
            <span className="text-[9px] font-black text-natural-muted uppercase tracking-[0.1em]">AI Refinement</span>
          </div>
          {(['simplified', 'standard', 'professional'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              disabled={isRefining}
              className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                level === lvl 
                  ? 'bg-natural-primary text-white shadow-lg shadow-natural-primary/20' 
                  : 'bg-white border border-natural-border text-natural-muted hover:border-natural-primary/30'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-0 flex flex-col md:flex-row bg-white">
          <div className="flex-1 p-10 md:p-16 border-r border-natural-border/50">
            {loading ? (
              <motion.div 
                key="initial-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full w-full flex flex-col items-center justify-center py-24 space-y-8"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-natural-primary/20 border-t-natural-primary rounded-full animate-[spin_0.8s_linear_infinity]" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-natural-primary" size={32} />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-black text-natural-text uppercase tracking-[0.4em]">Compiling Technical Schema</p>
                  <p className="text-[10px] font-bold text-natural-muted uppercase tracking-widest">Integrating ICC 2026 Standards</p>
                </div>
              </motion.div>
            ) : content && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={level}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full"
                >
                  <AnimatePresence>
                    {isRefining && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-20 flex items-center justify-center"
                      >
                        <div className="bg-white/80 backdrop-blur-md p-6 rounded-[32px] shadow-2xl border border-natural-border flex items-center gap-4">
                           <div className="w-8 h-8 border-3 border-natural-primary/20 border-t-natural-primary rounded-full animate-spin" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-natural-text">Recalibrating Context...</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="markdown-body prose prose-slate max-w-none 
                    prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-natural-text
                    prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b-2 prose-h2:border-natural-primary/10 prose-h2:uppercase
                    prose-h3:text-lg prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-natural-primary prose-h3:font-black
                    prose-p:text-natural-text/80 prose-p:text-lg prose-p:leading-relaxed prose-p:font-medium
                    prose-strong:text-natural-primary prose-strong:font-black
                    prose-li:text-natural-text/80 prose-li:font-medium prose-li:text-lg prose-li:marker:text-natural-primary
                    prose-img:rounded-[32px] prose-img:shadow-2xl
                    prose-blockquote:border-l-0 prose-blockquote:bg-natural-primary/5 prose-blockquote:p-8 prose-blockquote:rounded-[32px] prose-blockquote:relative
                    prose-blockquote:before:content-['💡'] prose-blockquote:before:absolute prose-blockquote:before:-top-4 prose-blockquote:before:-left-4 prose-blockquote:before:bg-white prose-blockquote:before:p-2 prose-blockquote:before:rounded-xl prose-blockquote:before:shadow-md
                    prose-table:border-collapse prose-table:my-10
                    prose-th:bg-natural-bg prose-th:p-5 prose-th:text-xs prose-th:font-black prose-th:uppercase prose-th:border prose-th:border-natural-border
                    prose-td:p-5 prose-td:text-sm prose-td:border prose-td:border-natural-border prose-td:font-medium">
                    <Markdown>{content.content}</Markdown>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <aside className="w-full md:w-80 bg-natural-bg/50 p-8 flex flex-col shrink-0">
             <div className="sticky top-0 space-y-10">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-natural-primary mb-6 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Core Outcomes
                  </h4>
                  <div className="space-y-4">
                    {content?.keyTakeaways.map((task, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="p-5 bg-white rounded-3xl border border-natural-border shadow-sm group hover:border-natural-primary transition-all"
                      >
                        <p className="text-xs font-bold text-natural-text leading-snug group-hover:text-natural-primary transition-colors">{task}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-natural-secondary text-white p-8 rounded-[40px] shadow-2xl shadow-natural-secondary/20">
                  <BrainCircuit size={40} className="mb-6 text-natural-primary" />
                  <h4 className="text-xs font-black uppercase tracking-widest mb-4">AI Verification</h4>
                  <p className="text-[11px] font-medium opacity-60 leading-relaxed mb-8">
                    Content dynamically generated and visually calibrated for <span className="text-white font-black">{level}</span> technical comprehension.
                  </p>
                  
                  <button 
                    onClick={() => onClose(true)}
                    className="w-full py-5 bg-natural-primary text-white rounded-2xl font-black text-xs shadow-xl shadow-natural-primary/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <CheckCircle2 size={18} />
                    <span>Complete Session</span>
                  </button>
                </div>
             </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
