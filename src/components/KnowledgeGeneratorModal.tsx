/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Send, Loader2, Book, FlaskConical, GraduationCap, Microscope } from 'lucide-react';
import { generateKnowledgeArticle } from '../services/geminiTrainingService';

interface KnowledgeGeneratorModalProps {
  onClose: () => void;
  onGenerated: (article: any) => void;
}

const DEPTH_LEVELS = [
  { id: 'basics', label: 'Practical Basics', icon: Book, desc: 'Everyday groundsman essentials' },
  { id: 'professional', label: 'Professional standard', icon: GraduationCap, desc: 'ICC/Standard stadium protocol' },
  { id: 'advanced', label: 'Advanced analysis', icon: Microscope, desc: 'Bio-chemical and physical deep-dive' },
  { id: 'phd', label: 'Ph.D. Level Research', icon: FlaskConical, desc: 'Experimental turf-science data' }
];

export default function KnowledgeGeneratorModal({ onClose, onGenerated }: KnowledgeGeneratorModalProps) {
  const [topic, setTopic] = useState('');
  const [depth, setDepth] = useState('professional');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await generateKnowledgeArticle(topic, depth);
      if (result) {
        const newArticle = {
          id: `ai-${Date.now()}`,
          category: result.categories[0] || 'AI Generated',
          title: result.title,
          content: result.content,
          isAI: true,
          author: 'TurfDoc AI',
          date: new Date().toLocaleDateString(),
          sections: [
            {
              title: "Technical Overview",
              items: result.keywords.map(k => `Focus on ${k}`)
            }
          ],
          keywords: result.keywords,
          categories: result.categories
        };
        onGenerated(newArticle);
      } else {
        throw new Error("Could not generate article");
      }
    } catch (err) {
      setError("Analysis failed. Please recalibrate your query.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-12">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-natural-sidebar/80 backdrop-blur-xl"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[48px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-natural-border flex items-center justify-between bg-natural-bg/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-natural-border">
              <Sparkles className="text-natural-primary" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-natural-primary tracking-tight">AI Knowledge Engine</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-natural-muted">TurfDoc Professional Research</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white hover:bg-red-50 text-natural-muted hover:text-red-500 rounded-2xl border border-natural-border transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10">
          <form onSubmit={handleGenerate} className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-natural-muted ml-4">Research Topic</label>
              <div className="relative group">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="e.g., Clay mineralogy impact on ball bounce..."
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="w-full bg-natural-bg border border-natural-border rounded-3xl py-6 pl-8 pr-8 font-extrabold text-natural-text text-lg focus:outline-none focus:border-natural-primary focus:ring-4 focus:ring-natural-primary/5 transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-natural-muted ml-4">Technical Depth</label>
              <div className="grid grid-cols-2 gap-4">
                {DEPTH_LEVELS.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setDepth(level.id)}
                    className={`flex items-start gap-4 p-5 rounded-[28px] border transition-all text-left ${
                      depth === level.id 
                        ? 'bg-natural-primary/5 border-natural-primary ring-4 ring-natural-primary/5' 
                        : 'bg-white border-natural-border hover:border-natural-muted/50'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${depth === level.id ? 'bg-natural-primary text-white' : 'bg-natural-bg text-natural-muted'}`}>
                      <level.icon size={18} />
                    </div>
                    <div>
                      <p className={`font-black text-sm uppercase tracking-tight ${depth === level.id ? 'text-natural-primary' : 'text-natural-text'}`}>
                        {level.label}
                      </p>
                      <p className="text-[10px] font-medium text-natural-muted mt-1 leading-tight">{level.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold">
                <X size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="w-full bg-natural-primary text-white py-6 rounded-3xl font-black text-sm shadow-xl shadow-natural-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span className="uppercase tracking-[0.2em]">Executing Molecular Synthesis...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span className="uppercase tracking-[0.2em]">Synthesize Technical Manuscript</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="p-6 bg-natural-bg/50 border-t border-natural-border text-center">
          <p className="text-[9px] font-black text-natural-muted/60 uppercase tracking-[0.4em]">
            TurfDoc AI Engine • Powered by Gemini 1.5 Pro • 2026 ICC Standards
          </p>
        </div>
      </motion.div>
    </div>
  );
}
