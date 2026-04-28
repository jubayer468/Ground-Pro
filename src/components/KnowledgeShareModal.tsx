/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, BookOpen, PenTool, Hash, Info } from 'lucide-react';

interface KnowledgeShareModalProps {
  onClose: () => void;
  onShared: (article: any) => void;
}

export default function KnowledgeShareModal({ onClose, onShared }: KnowledgeShareModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'General' | 'Technique' | 'Secret' | 'Regional'>('General');
  const [content, setContent] = useState('');
  const [tips, setTips] = useState<string[]>(['']);

  const handleAddTip = () => setTips([...tips, '']);
  const handleTipChange = (idx: number, val: string) => {
    const newTips = [...tips];
    newTips[idx] = val;
    setTips(newTips);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newArticle = {
      id: `comm-${Date.now()}`,
      category,
      title,
      content,
      isCommunity: true,
      author: "Jubayer Ahmed", // Simulated current user
      date: new Date().toLocaleDateString(),
      sections: [
        {
          title: "Key Insights",
          items: tips.filter(t => t.trim() !== '')
        }
      ]
    };

    onShared(newArticle);
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-natural-secondary/70 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl border border-natural-border flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-natural-border flex justify-between items-center bg-natural-primary text-white">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/20 rounded-xl">
              <PenTool size={20} />
            </div>
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">Collaborative Knowledge</h2>
              <h3 className="text-xl font-extrabold uppercase leading-none">Share Your Expertise</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8">
          {/* Title */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-natural-muted ml-1 flex items-center gap-2">
              <BookOpen size={12} />
              Knowledge Title
            </label>
            <input 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Managing Moisture in Tropical Climates" 
              className="w-full bg-natural-bg/50 border border-natural-border rounded-2xl p-5 text-sm font-bold focus:outline-none focus:border-natural-primary focus:ring-4 focus:ring-natural-primary/5 transition-all"
            />
          </div>

          {/* Category */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-natural-muted ml-1 flex items-center gap-2">
              <Hash size={12} />
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['General', 'Technique', 'Secret', 'Regional'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                    category === cat 
                      ? 'bg-natural-primary border-natural-primary text-white shadow-lg shadow-natural-primary/20' 
                      : 'bg-white border-natural-border text-natural-muted hover:border-natural-muted/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-natural-muted ml-1 flex items-center gap-2">
              <Info size={12} />
              Technical Write-up
            </label>
            <textarea 
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share the technical details, steps, or secrets you've discovered..." 
              rows={5}
              className="w-full bg-natural-bg/50 border border-natural-border rounded-3xl p-5 text-sm font-medium leading-relaxed focus:outline-none focus:border-natural-primary focus:ring-4 focus:ring-natural-primary/5 transition-all resize-none"
            />
          </div>

          {/* Tips/Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase tracking-widest text-natural-muted ml-1">Key Action Points</label>
              <button 
                type="button"
                onClick={handleAddTip}
                className="text-[10px] font-black text-natural-primary uppercase tracking-widest hover:underline"
              >
                + Add Point
              </button>
            </div>
            <div className="space-y-3">
              {tips.map((tip, idx) => (
                <input 
                  key={idx}
                  value={tip}
                  onChange={(e) => handleTipChange(idx, e.target.value)}
                  placeholder={`Action Point #${idx + 1}`}
                  className="w-full bg-natural-bg/30 border border-natural-border rounded-xl p-4 text-xs font-semibold focus:outline-none focus:border-natural-primary transition-all"
                />
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-6 bg-natural-primary text-white rounded-[24px] font-black text-sm shadow-xl shadow-natural-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Send size={20} />
            <span>Share Knowledge with Community</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
