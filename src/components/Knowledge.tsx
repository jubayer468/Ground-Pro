/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CheckCircle2, ChevronRight, Book, Share2, Users, Crown, Plus, Search, Sparkles } from 'lucide-react';
import { KNOWLEDGE_HUB } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import KnowledgeShareModal from './KnowledgeShareModal';
import KnowledgeGeneratorModal from './KnowledgeGeneratorModal';
import Markdown from 'react-markdown';

interface ArticleSection {
  title: string;
  items: string[];
}

interface Article {
  id: string;
  category: string;
  title: string;
  content: string;
  sections: ArticleSection[];
  isCommunity?: boolean;
  isAI?: boolean;
  author?: string;
  date?: string;
  keywords?: string[];
}

export default function KnowledgeHub() {
  const [communityArticles, setCommunityArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('groundpro_community_knowledge');
    const parsed = saved ? JSON.parse(saved) : [];
    return parsed;
  });
  
  const [viewMode, setViewMode] = useState<'official' | 'community' | 'ai'>('official');
  const [selectedArticle, setSelectedArticle] = useState<Article>((KNOWLEDGE_HUB as Article[])[0]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('groundpro_community_knowledge', JSON.stringify(communityArticles));
  }, [communityArticles]);

  const allArticles = viewMode === 'official' 
    ? (KNOWLEDGE_HUB as Article[]) 
    : communityArticles.filter(a => viewMode === 'community' ? !a.isAI : a.isAI);

  const filteredArticles = allArticles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShare = (article: any) => {
    setCommunityArticles([article, ...communityArticles]);
    setIsShareModalOpen(false);
    setViewMode('community');
    setSelectedArticle(article);
  };

  const handleGenerated = (article: any) => {
    setCommunityArticles([article, ...communityArticles]);
    setIsGeneratorOpen(false);
    setViewMode('ai');
    setSelectedArticle(article);
  };

  return (
    <div className="flex flex-col h-full">
      <AnimatePresence>
        {isShareModalOpen && (
          <KnowledgeShareModal 
            onClose={() => setIsShareModalOpen(false)} 
            onShared={handleShare}
          />
        )}
        {isGeneratorOpen && (
          <KnowledgeGeneratorModal 
            onClose={() => setIsGeneratorOpen(false)}
            onGenerated={handleGenerated}
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-natural-text tracking-tight uppercase">Technical Knowledge</h1>
          <p className="text-natural-muted font-semibold mt-1">GroundPro Verified Guides & AI Synthesized Wisdom</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-[20px] border border-natural-border shadow-sm">
          <button 
            onClick={() => {
              setViewMode('official');
              setSelectedArticle(KNOWLEDGE_HUB[0]);
            }}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              viewMode === 'official' ? 'bg-natural-primary text-white shadow-lg shadow-natural-primary/20' : 'text-natural-muted hover:bg-natural-bg'
            }`}
          >
            <Crown size={14} />
            Official
          </button>
          <button 
            onClick={() => {
              setViewMode('community');
              const firstComm = communityArticles.find(a => !a.isAI);
              if (firstComm) setSelectedArticle(firstComm);
            }}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              viewMode === 'community' ? 'bg-natural-primary text-white shadow-lg shadow-natural-primary/20' : 'text-natural-muted hover:bg-natural-bg'
            }`}
          >
            <Users size={14} />
            Community
          </button>
          <button 
            onClick={() => {
              setViewMode('ai');
              const firstAI = communityArticles.find(a => a.isAI);
              if (firstAI) setSelectedArticle(firstAI);
            }}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              viewMode === 'ai' ? 'bg-natural-primary text-white shadow-lg shadow-natural-primary/20' : 'text-natural-muted hover:bg-natural-bg'
            }`}
          >
            <Sparkles size={14} />
            AI Labs
          </button>
        </div>
      </div>

      <div className="flex h-full space-x-8">
        {/* Sidebar List */}
        <div className="w-80 flex flex-col space-y-4">
          <div className="relative mb-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-natural-muted" size={16} />
            <input 
              type="text"
              placeholder="Search knowledge..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-natural-border rounded-xl py-3 pl-10 pr-4 text-xs font-bold focus:outline-none focus:border-natural-primary"
            />
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-2 pb-6">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group ${
                    selectedArticle.id === article.id
                      ? 'bg-white border-natural-primary shadow-lg shadow-natural-primary/5 translate-x-1'
                      : 'bg-white/40 border-natural-border hover:border-natural-muted/40 hover:bg-white/60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] uppercase tracking-widest text-natural-primary font-black px-2 py-0.5 bg-natural-bg rounded-md border border-natural-border/50">{article.category}</span>
                    {article.isCommunity && <Users size={10} className="text-natural-muted" />}
                    {article.isAI && <Sparkles size={10} className="text-natural-primary" />}
                  </div>
                  <h3 className="font-extrabold text-natural-text mt-2.5 line-clamp-2 leading-snug group-hover:text-natural-primary transition-colors text-sm uppercase tracking-tight">{article.title}</h3>
                </button>
              ))
            ) : (
              <div className="py-10 text-center bg-natural-bg/50 rounded-3xl border border-dashed border-natural-border">
                <p className="text-[10px] font-black text-natural-muted uppercase tracking-widest">No articles found</p>
              </div>
            )}

            <div className="pt-4 space-y-3">
              <button 
                onClick={() => setIsGeneratorOpen(true)}
                className="w-full p-5 rounded-2xl border-2 border-dashed border-natural-primary bg-natural-primary/5 text-natural-primary flex flex-col items-center gap-2 hover:bg-natural-primary/10 transition-all group"
              >
                <Sparkles size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Article Generator</span>
              </button>
              
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="w-full p-4 rounded-2xl border border-natural-border bg-white text-natural-muted flex flex-col items-center gap-1.5 hover:bg-natural-bg transition-all group"
              >
                <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-widest">Contribute Resource</span>
              </button>
            </div>
          </div>
        </div>

        {/* Article Content */}
        {selectedArticle ? (
          <motion.div 
            key={selectedArticle.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 bg-white rounded-[40px] shadow-sm border border-natural-border p-12 overflow-y-auto relative"
          >
            {selectedArticle.author && (
              <div className="absolute top-10 right-10 flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] font-black text-natural-muted uppercase tracking-widest leading-none">{selectedArticle.isAI ? 'Engine' : 'Shared By'}</p>
                  <p className="text-xs font-bold text-natural-text mt-1 uppercase">{selectedArticle.author}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs uppercase ${
                  selectedArticle.isAI ? 'bg-natural-primary text-white' : 'bg-natural-bg border border-natural-border text-natural-primary'
                }`}>
                  {selectedArticle.isAI ? <Sparkles size={16} /> : selectedArticle.author.substring(0, 1)}
                </div>
              </div>
            )}

            <div className="max-w-4xl">
              <span className="text-[10px] uppercase tracking-[0.2em] text-natural-primary font-black bg-natural-bg px-5 py-2 rounded-full border border-natural-border">
                {selectedArticle.category}
              </span>
              <h1 className="text-4xl font-extrabold text-natural-text mt-8 tracking-tighter leading-none uppercase">{selectedArticle.title}</h1>
              
              {selectedArticle.isAI ? (
                <div className="mt-12 markdown-body prose prose-neutral max-w-none prose-headings:uppercase prose-headings:tracking-tighter prose-p:text-natural-text/80 prose-p:leading-relaxed prose-p:font-medium prose-strong:text-natural-primary prose-blockquote:bg-natural-bg/50 prose-blockquote:border-l-4 prose-blockquote:border-natural-primary prose-blockquote:rounded-r-2xl prose-blockquote:p-8">
                  <Markdown>{selectedArticle.content}</Markdown>
                  
                  {selectedArticle.keywords && (
                    <div className="mt-16 pt-10 border-t border-natural-border">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-natural-muted mb-4">Technical Taxonomy</p>
                       <div className="flex flex-wrap gap-2">
                         {selectedArticle.keywords.map((kw, i) => (
                           <span key={i} className="px-4 py-2 bg-natural-bg text-natural-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-natural-border/50">
                             {kw}
                           </span>
                         ))}
                       </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="mt-8 p-8 bg-natural-bg/30 rounded-[32px] border border-natural-border/50">
                    <p className="text-natural-muted text-lg leading-relaxed font-medium italic">
                      "{selectedArticle.content}"
                    </p>
                  </div>

                  <div className="mt-12 space-y-12">
                    {selectedArticle.sections.map((section: any, sIdx: number) => (
                      <div key={sIdx} className="bg-white p-2 rounded-[32px]">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-natural-muted mb-8 flex items-center gap-4">
                          <span className="w-12 h-px bg-natural-border"></span>
                          {section.title}
                          <span className="flex-1 h-px bg-natural-border"></span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {section.items.map((item: string, iIdx: number) => (
                            <div 
                              key={iIdx} 
                              className="flex items-start gap-4 p-6 rounded-3xl bg-natural-bg border border-natural-border group hover:border-natural-primary/30 hover:bg-white transition-all duration-300 shadow-sm"
                            >
                              <div className="w-6 h-6 rounded-lg bg-natural-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                <CheckCircle2 size={16} className="text-natural-primary" />
                              </div>
                              <span className="text-sm text-natural-text font-bold leading-snug">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {(selectedArticle.isCommunity || selectedArticle.isAI) && (
                <div className="mt-20 pt-10 border-t border-natural-border flex justify-between items-center">
                  <div className="flex items-center gap-4 text-natural-muted text-[10px] font-black uppercase tracking-widest">
                    {selectedArticle.date && <span>Synthesized on {selectedArticle.date}</span>}
                    {selectedArticle.date && <span>•</span>}
                    <button className="hover:text-natural-primary transition-colors flex items-center gap-1.5">
                      <Share2 size={12} />
                      Extract Link
                    </button>
                  </div>
                  <button className="px-8 py-3 bg-natural-bg text-natural-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-natural-primary hover:text-white transition-all">
                    {selectedArticle.isAI ? 'Archive to Vault' : 'Endorse Knowledge'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[40px] border border-natural-border p-12 text-center">
            <Book size={48} className="text-natural-bg mb-6" />
            <h2 className="text-xl font-black text-natural-muted uppercase tracking-widest">Select an article to begin</h2>
            <p className="text-sm font-medium text-natural-muted mt-2">Explore official guides, community wisdom, or AI archives.</p>
          </div>
        )}
      </div>
    </div>
  );
}
