/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { MOCK_REVIEWS } from '../constants';

interface SellerReviewModalProps {
  seller: string;
  onClose: () => void;
}

export default function SellerReviewModal({ seller, onClose }: SellerReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sellerReviews = MOCK_REVIEWS.filter(r => r.seller === seller);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-natural-secondary/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl border border-natural-border flex flex-col max-h-[85vh]"
      >
        <div className="p-8 border-b border-natural-border flex justify-between items-center bg-natural-bg/30">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-natural-muted mb-1">Seller Identity</h2>
            <h3 className="text-2xl font-black text-natural-text uppercase leading-none">{seller}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-natural-bg rounded-xl transition-colors text-natural-muted hover:text-natural-text">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Existing Reviews */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-natural-muted mb-4">Past Transactions ({sellerReviews.length})</h4>
            <div className="space-y-4">
              {sellerReviews.map((rev) => (
                <div key={rev.id} className="p-5 bg-natural-bg border border-natural-border rounded-3xl">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-natural-primary/10 flex items-center justify-center text-[10px] font-bold text-natural-primary">
                        {rev.author.substring(0,1)}
                      </span>
                      <p className="text-xs font-bold text-natural-text">{rev.author}</p>
                    </div>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-natural-muted font-medium italic leading-relaxed">"{rev.comment}"</p>
                  <p className="text-[9px] text-natural-muted/60 mt-3 font-bold uppercase tracking-wider">{rev.date}</p>
                </div>
              ))}
              {sellerReviews.length === 0 && (
                <p className="text-xs text-natural-muted italic">No verified reviews for this seller yet.</p>
              )}
            </div>
          </div>

          {/* New Review Form */}
          {!isSubmitted ? (
            <div className="pt-6 border-t border-natural-border">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-natural-muted mb-6">Rate your experience</h4>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform active:scale-90"
                    >
                      <Star 
                        size={32} 
                        className={`${(hoverRating || rating) >= star ? 'text-yellow-500' : 'text-natural-border'} transition-colors`}
                        fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'}
                      />
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-natural-muted">Your Comment</label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe the transaction, equipment quality, and communication..."
                    className="w-full bg-natural-bg border border-natural-border rounded-3xl p-5 text-sm focus:outline-none focus:border-natural-primary resize-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={rating === 0 || !comment}
                  className="w-full py-4 bg-natural-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-natural-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                >
                  <Send size={18} />
                  <span>Submit Review</span>
                </button>
              </form>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <div className="w-16 h-16 bg-natural-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-xl shadow-natural-primary/20">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-black text-natural-text mb-2">Review Submitted!</h3>
              <p className="text-sm text-natural-muted font-medium">Thank you for helping keep the market transparent.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
