/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingBag, Tag, MapPin, MessageSquare, Plus, ExternalLink, Star, CreditCard } from 'lucide-react';
import { MOCK_EQUIPMENT } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import SellerReviewModal from './SellerReviewModal';
import CheckoutModal from './CheckoutModal';

export default function Marketplace() {
  const [chattingWith, setChattingWith] = useState<string | null>(null);
  const [reviewingSeller, setReviewingSeller] = useState<string | null>(null);
  const [checkoutItem, setCheckoutItem] = useState<any>(null);

  return (
    <div className="max-w-6xl mx-auto">
      <AnimatePresence>
        {reviewingSeller && (
          <SellerReviewModal 
            seller={reviewingSeller} 
            onClose={() => setReviewingSeller(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checkoutItem && (
          <CheckoutModal 
            item={checkoutItem} 
            onClose={() => setCheckoutItem(null)} 
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-natural-text tracking-tight">Equipment Marketplace</h1>
          <p className="text-natural-muted text-sm font-semibold mt-1">Buy and sell professional groundskeeping machinery</p>
        </div>
        <button className="flex items-center space-x-2 bg-natural-primary text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-natural-primary/20 hover:scale-[1.02] active:scale-95">
          <Plus size={18} />
          <span>List Equipment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_EQUIPMENT.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[32px] border border-natural-border overflow-hidden shadow-sm hover:shadow-xl hover:shadow-natural-primary/5 transition-all group"
          >
            <div className="relative h-64 overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-md text-natural-primary px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-sm">
                  {item.condition}
                </span>
              </div>
              <div className="absolute bottom-4 right-4">
                <div className="bg-natural-primary text-white px-5 py-2.5 rounded-2xl font-black text-lg shadow-xl shadow-black/20 transform group-hover:translate-y-[-4px] transition-transform">
                  {item.price}
                </div>
              </div>
            </div>

            <div className="p-7">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-natural-text line-clamp-1">{item.name}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1.5 text-natural-muted">
                      <MapPin size={14} />
                      <span className="text-xs font-bold uppercase tracking-wider">{item.location}</span>
                    </div>
                    <button 
                      onClick={() => setReviewingSeller(item.seller)}
                      className="flex items-center space-x-1 bg-yellow-400/10 text-yellow-600 px-2 py-0.5 rounded-lg hover:bg-yellow-400/20 transition-colors"
                    >
                      <Star size={12} fill="currentColor" />
                      <span className="text-[10px] font-black">{item.rating}</span>
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-sm text-natural-muted leading-relaxed line-clamp-2 mb-6 font-medium">
                {item.description}
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setCheckoutItem(item)}
                  className="bg-natural-primary text-white py-3.5 rounded-2xl font-black text-sm hover:bg-natural-secondary transition-all shadow-lg shadow-natural-primary/10 active:scale-95 flex items-center justify-center gap-2"
                >
                  <CreditCard size={18} />
                  <span>Buy Now</span>
                </button>
                
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center flex-1 space-x-3">
                    <div className="w-8 h-8 rounded-full bg-natural-bg border border-natural-border flex items-center justify-center text-[10px] font-bold text-natural-primary uppercase">
                      {item.seller.substring(0, 2)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-black text-natural-muted uppercase tracking-widest leading-none">Seller</p>
                      <p className="text-xs font-bold text-natural-text truncate uppercase mt-0.5">{item.seller}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setReviewingSeller(item.seller)}
                      className="p-3 bg-natural-bg text-natural-muted rounded-xl hover:bg-natural-primary hover:text-white transition-all shadow-sm active:scale-90"
                      title="Leave Review"
                    >
                      <Star size={18} />
                    </button>
                    <button 
                      onClick={() => setChattingWith(item.seller)}
                      className="p-3 bg-natural-bg text-natural-primary rounded-xl hover:bg-natural-primary hover:text-white transition-all shadow-sm active:scale-90"
                      title="Message Seller"
                    >
                      <MessageSquare size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {chattingWith && (
        <div className="fixed bottom-8 right-8 z-[100] w-96 bg-white rounded-3xl shadow-2xl border border-natural-border overflow-hidden ring-1 ring-natural-primary/10">
          <div className="p-5 bg-natural-primary text-white flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                {chattingWith.substring(0, 2)}
              </div>
              <div>
                <p className="text-xs font-bold leading-none">{chattingWith}</p>
                <p className="text-[8px] uppercase tracking-widest text-white/60 mt-1">Online now</p>
              </div>
            </div>
            <button onClick={() => setChattingWith(null)} className="text-white/60 hover:text-white transition-colors">
              <Plus size={20} className="rotate-45" />
            </button>
          </div>
          <div className="h-64 bg-natural-bg/30 p-4 overflow-y-auto">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-xs font-medium text-natural-muted border border-natural-border mb-4">
              Hi! Is this equipment still available?
            </div>
          </div>
          <div className="p-4 border-t border-natural-border flex gap-2">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 bg-natural-bg rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-natural-primary/10 border border-transparent focus:border-natural-primary"
            />
            <button className="bg-natural-primary text-white p-2 rounded-xl">
              <MessageSquare size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
