/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapPin, Clock, DollarSign, Building2, Filter } from 'lucide-react';
import { MOCK_JOBS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import JobApplicationModal from './JobApplicationModal';

export default function JobBoard() {
  const [selectedJob, setSelectedJob] = useState<any>(null);

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence>
        {selectedJob && (
          <JobApplicationModal 
            job={selectedJob} 
            onClose={() => setSelectedJob(null)} 
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-natural-text tracking-tight">Curator Market</h1>
          <p className="text-natural-muted text-sm font-semibold mt-1">Find your next stadium or club opportunity</p>
        </div>
        <button className="flex items-center space-x-2 bg-white px-5 py-2.5 border border-natural-border rounded-xl text-sm font-bold text-natural-muted hover:text-natural-text hover:bg-natural-bg transition-all shadow-sm">
          <Filter size={18} />
          <span>Refine Search</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {MOCK_JOBS.map((job, idx) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-7 rounded-[24px] border border-natural-border shadow-sm hover:border-natural-primary/40 transition-all group flex justify-between items-center"
          >
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-extrabold text-natural-text group-hover:text-natural-primary transition-colors">{job.title}</h3>
                <div className="flex items-center space-x-3 mt-1.5">
                  <Building2 size={16} className="text-natural-muted" />
                  <span className="text-sm font-bold text-natural-muted uppercase tracking-wider">{job.club}</span>
                </div>
              </div>

              <div className="flex items-center space-x-8 text-natural-muted text-xs font-bold uppercase tracking-[0.1em]">
                <div className="flex items-center space-x-2 bg-natural-bg/50 px-3 py-1.5 rounded-lg border border-natural-border/50">
                  <MapPin size={14} className="text-natural-primary" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center space-x-2 bg-natural-bg/50 px-3 py-1.5 rounded-lg border border-natural-border/50">
                  <DollarSign size={14} className="text-natural-primary" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center space-x-2 bg-natural-bg/50 px-3 py-1.5 rounded-lg border border-natural-border/50">
                  <Clock size={14} className="text-natural-primary" />
                  <span>{job.posted}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="bg-[#D9E4D3] text-[#2D4425] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#2D4425]/10">{job.type}</span>
                <span className="bg-[#EEE1D5] text-[#63442D] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#63442D]/10">International Opportunity</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setSelectedJob(job)}
                className="bg-natural-primary text-white px-8 py-3.5 rounded-xl font-black text-sm hover:bg-natural-secondary transition-all shadow-lg shadow-natural-primary/10 active:scale-95"
              >
                Apply Now
              </button>
              <button className="text-natural-muted font-bold text-xs hover:text-natural-text transition-colors">
                Save for later
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
