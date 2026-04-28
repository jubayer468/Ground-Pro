/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { MOCK_POSTS } from '../constants';
import { motion } from 'motion/react';

export default function Feed() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-5 border border-natural-border mb-8">
        <div className="flex space-x-4">
          <div className="w-11 h-11 rounded-full bg-natural-bg border border-natural-border flex items-center justify-center shrink-0">
            <span className="text-natural-primary font-bold">JD</span>
          </div>
          <input 
            type="text" 
            placeholder="Share a pitch update or turf tip..." 
            className="flex-1 bg-natural-bg border border-natural-border rounded-xl px-5 text-sm focus:outline-none focus:ring-4 focus:ring-natural-primary/5 focus:border-natural-primary transition-all"
          />
        </div>
      </div>

      {MOCK_POSTS.map((post, idx) => (
        <motion.div 
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-natural-border overflow-hidden group hover:border-natural-primary/40 transition-colors"
        >
          <div className="p-5 flex justify-between items-start">
            <div className="flex space-x-4">
              <img src={post.avatar} alt={post.author} className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-sm" />
              <div>
                <h3 className="font-extrabold text-sm text-natural-text group-hover:text-natural-primary transition-colors">{post.author}</h3>
                <p className="text-[10px] uppercase tracking-wider text-natural-muted font-bold mt-0.5">{post.role} • {post.timestamp}</p>
              </div>
            </div>
            <button className="p-1.5 hover:bg-natural-bg rounded-lg text-natural-muted hover:text-natural-text transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="px-5 pb-5">
            <p className="text-sm text-natural-text leading-relaxed font-medium">{post.content}</p>
          </div>

          {post.image && (
            <div className="px-5 pb-5">
              <img src={post.image} alt="Post visual" className="rounded-xl w-full h-[360px] object-cover shadow-inner bg-natural-bg" />
            </div>
          )}

          <div className="px-5 py-4 bg-natural-bg/30 border-t border-natural-border flex items-center space-x-8">
            <button className="flex items-center space-x-2.5 text-natural-muted hover:text-natural-primary transition-all active:scale-95">
              <Heart size={20} className="stroke-2" />
              <span className="text-xs font-bold leading-none">{post.likes}</span>
            </button>
            <button className="flex items-center space-x-2.5 text-natural-muted hover:text-natural-primary transition-all active:scale-95">
              <MessageCircle size={20} className="stroke-2" />
              <span className="text-xs font-bold leading-none">{post.comments}</span>
            </button>
            <button className="flex items-center space-x-2.5 text-natural-muted hover:text-natural-primary transition-all active:scale-95">
              <Share2 size={20} className="stroke-2" />
              <span className="text-xs font-bold leading-none">Share</span>
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
