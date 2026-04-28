/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, TreePine, ChevronRight, CheckCircle2 } from 'lucide-react';

interface AuthProps {
  onAuthComplete: (user: any) => void;
}

export default function Auth({ onAuthComplete }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        uid: '123',
        email: formData.email,
        displayName: formData.fullName || 'Turf Master',
        photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
      };
      localStorage.setItem('groundpro_user', JSON.stringify(mockUser));
      onAuthComplete(mockUser);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-natural-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-natural-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-natural-primary/5 rounded-full blur-[100px] -ml-48 -mb-48" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-white border border-natural-border rounded-3xl shadow-xl mb-6">
            <TreePine className="text-natural-primary" size={40} />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-natural-primary">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-natural-muted font-medium mt-2">
            Professional Grounds Management Hub
          </p>
        </div>

        <div className="bg-white border border-natural-border rounded-[40px] p-10 shadow-2xl shadow-natural-primary/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-natural-muted ml-4">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-natural-muted" size={18} />
                    <input 
                      required={mode === 'signup'}
                      type="text" 
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-natural-bg border border-natural-border rounded-2xl py-4 pl-14 pr-6 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-natural-primary/5 focus:border-natural-primary transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-natural-muted ml-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-natural-muted" size={18} />
                <input 
                  required
                  type="email" 
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-natural-bg border border-natural-border rounded-2xl py-4 pl-14 pr-6 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-natural-primary/5 focus:border-natural-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-natural-muted ml-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-natural-muted" size={18} />
                <input 
                  required
                  type="password" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-natural-bg border border-natural-border rounded-2xl py-4 pl-14 pr-6 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-natural-primary/5 focus:border-natural-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-natural-primary text-white py-5 rounded-3xl font-black text-sm shadow-xl shadow-natural-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Login to Dashboard' : 'Create My Account'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-natural-border flex flex-col items-center gap-4">
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-[11px] font-black uppercase tracking-widest text-natural-muted hover:text-natural-primary transition-colors"
            >
              {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>
            <div className="flex items-center gap-2 text-[10px] font-bold text-natural-muted/50">
              <CheckCircle2 size={12} />
              <span>Verified ICC Groundskeepers Only</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
