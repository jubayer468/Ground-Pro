/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, UserPlus, MapPin, Award, Globe, Link2, MessageSquare, Check } from 'lucide-react';

interface Curator {
  id: string;
  name: string;
  role: string;
  location: string;
  specialty: string;
  experience: string;
  avatar: string;
  connected: boolean;
}

const DISCOVER_CURATORS: Curator[] = [
  { id: '1', name: 'Darren Gough', role: 'Head Curator', location: 'Headingley', specialty: 'Clay Content Management', experience: '25 Years', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100', connected: true },
  { id: '2', name: 'Sarah Grounds', role: 'Senior Groundsman', location: 'Edgbaston', specialty: 'Scarification & Overseeding', experience: '12 Years', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100', connected: true },
  { id: '4', name: 'Alistair Brown', role: 'Turf Consultant', location: 'The Oval', specialty: 'Disease Management', experience: '18 Years', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', connected: false },
  { id: '5', name: 'Emma Wilson', role: 'Academy Curator', location: 'Old Trafford', specialty: 'Pitch Preparation', experience: '8 Years', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100', connected: false },
];

export default function Discover() {
  const [curators, setCurators] = useState(DISCOVER_CURATORS);
  const [search, setSearch] = useState('');

  const toggleConnect = (id: string) => {
    setCurators(curators.map(c => c.id === id ? { ...c, connected: !c.connected } : c));
  };

  const filtered = curators.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-natural-primary">Discover Curators</h2>
          <p className="text-natural-muted font-medium">Connect with industry leaders across the globe.</p>
        </div>
        
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-natural-muted group-focus-within:text-natural-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or specialty..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-natural-border rounded-2xl py-3.5 pl-12 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-natural-primary/5 focus:border-natural-primary transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((curator) => (
          <motion.div 
            layout
            key={curator.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-natural-border rounded-[40px] p-8 shadow-sm hover:shadow-xl hover:shadow-natural-primary/5 transition-all relative overflow-hidden group"
          >
            <div className="flex items-start gap-6 mb-8">
              <div className="relative">
                <img src={curator.avatar} alt={curator.name} className="w-20 h-20 rounded-3xl object-cover shadow-lg" />
                <div className="absolute -bottom-2 -right-2 bg-natural-primary text-white p-2 rounded-xl shadow-lg">
                  <Award size={14} />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-black text-xl text-natural-primary tracking-tight leading-tight mb-1">{curator.name}</h3>
                <p className="text-natural-muted font-bold text-sm mb-4">{curator.role}</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-natural-muted">
                  <MapPin size={12} className="text-natural-primary" />
                  {curator.location}
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-natural-bg/50 p-4 rounded-2xl border border-natural-border/50">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-natural-muted mb-2">Specialty</p>
                <p className="text-xs font-bold text-natural-primary">{curator.specialty}</p>
              </div>
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2">
                  <Award size={14} className="text-natural-muted" />
                  <span className="text-xs font-bold text-natural-muted">{curator.experience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-natural-muted" />
                  <span className="text-xs font-bold text-natural-muted">Global Expert</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 relative z-10">
              <button 
                onClick={() => toggleConnect(curator.id)}
                className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  curator.connected 
                    ? 'bg-natural-bg text-natural-primary border border-natural-primary/20' 
                    : 'bg-natural-primary text-white shadow-lg shadow-natural-primary/20 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {curator.connected ? (
                  <>
                    <Check size={16} />
                    <span>Connected</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Connect</span>
                  </>
                )}
              </button>
              <button className="p-4 bg-natural-bg text-natural-muted hover:text-natural-primary border border-natural-border rounded-2xl transition-all">
                <MessageSquare size={18} />
              </button>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-natural-primary/5 rounded-full blur-2xl group-hover:bg-natural-primary/10 transition-colors" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
