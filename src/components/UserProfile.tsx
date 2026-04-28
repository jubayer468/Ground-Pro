/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Phone, MapPin, Briefcase, Calendar, 
  Plus, Edit2, Camera, Link as LinkIcon, Save, X,
  ExternalLink, Award, ShieldCheck, Globe, GripVertical,
  Bold, Italic, List as ListIcon, Type
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Reorder } from 'motion/react';

interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  description: string;
}

interface ProfileData {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  avatar: string;
  cover: string;
  experience: Experience[];
  skills: string[];
}

const DEFAULT_PROFILE: ProfileData = {
  name: "Jubayer Ahmed",
  title: "Head Curator @ Major International Cricket Stadium",
  bio: "Specializing in high-performance clay-base cricket pitches and sustainable sports turf management. Over 15 years of experience in preparing surfaces for ICC-sanctioned matches.",
  location: "London, United Kingdom",
  email: "jubayer.curator@groundpro.com",
  phone: "+44 7700 900000",
  website: "www.groundpro.io/curator/jubayer",
  avatar: "https://i.pravatar.cc/150?u=jubayer",
  cover: "https://images.unsplash.com/photo-1594470117722-da434a3c8371?w=1600&q=80",
  experience: [
    {
      id: '1',
      role: 'Head Curator',
      company: 'Imperial Cricket Grounds',
      location: 'London',
      duration: '2020 - Present',
      description: 'Overseeing a team of 12 groundskeepers. Managed pitch preparation for the 2023 World Series. Implemented AI-driven soil moisture sensors.'
    },
    {
      id: '2',
      role: 'Assistant Grounds Manager',
      company: 'Premier Sports Turf',
      location: 'Birmingham',
      duration: '2015 - 2020',
      description: 'Specialized in winter renovation techniques and NPK calibration for elite playing surfaces.'
    }
  ],
  skills: ["Clay Mineralogy", "Scarification", "Irrigation Systems", "Turf Pathology", "ICC Standards"]
};

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = (el: HTMLTextAreaElement | null) => {
    if (el) {
      // Auto-resize could be added here
    }
  };

  const insertMarkdown = (prefix: string, suffix: string = prefix) => {
    const textarea = document.activeElement as HTMLTextAreaElement;
    if (!textarea || textarea.tagName !== 'TEXTAREA') return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);

    const newValue = `${beforeText}${prefix}${selectedText}${suffix}${afterText}`;
    onChange(newValue);

    // Re-focus and set selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        end + prefix.length
      );
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4 py-2 bg-natural-bg border border-natural-border rounded-2xl">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => insertMarkdown('**')}
            className="p-2 hover:bg-white rounded-lg text-natural-muted hover:text-natural-primary transition-colors"
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('*')}
            className="p-2 hover:bg-white rounded-lg text-natural-muted hover:text-natural-primary transition-colors"
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('\n- ')}
            className="p-2 hover:bg-white rounded-lg text-natural-muted hover:text-natural-primary transition-colors"
            title="List"
          >
            <ListIcon size={16} />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('[', '](url)')}
            className="p-2 hover:bg-white rounded-lg text-natural-muted hover:text-natural-primary transition-colors"
            title="Link"
          >
            <LinkIcon size={16} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-natural-primary bg-white border border-natural-border rounded-lg"
        >
          {isPreview ? <Type size={12} /> : <Globe size={12} />}
          {isPreview ? 'Editor' : 'Preview'}
        </button>
      </div>

      {isPreview ? (
        <div className="w-full bg-natural-bg border border-natural-border rounded-3xl px-6 py-4 min-h-[120px] prose prose-sm max-w-none prose-neutral">
          <ReactMarkdown>{value || '*Nothing to preview*'}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full bg-natural-bg border border-natural-border rounded-3xl px-6 py-4 font-bold text-natural-text focus:outline-none focus:border-natural-primary transition-all resize-none"
        />
      )}
    </div>
  );
}

interface UserProfileProps {
  onUpdateUser: (user: any) => void;
}

export default function UserProfile({ onUpdateUser }: UserProfileProps) {
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = localStorage.getItem('groundpro_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<ProfileData>(profile);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      
      // Update profile state and localStorage
      const updatedProfile = { ...profile, avatar: dataUrl };
      setProfile(updatedProfile);
      localStorage.setItem('groundpro_profile', JSON.stringify(updatedProfile));

      // Update user auth state in App and localStorage
      const savedUser = localStorage.getItem('groundpro_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        const updatedUser = { ...user, photoURL: dataUrl };
        localStorage.setItem('groundpro_user', JSON.stringify(updatedUser));
        onUpdateUser(updatedUser);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    localStorage.setItem('groundpro_profile', JSON.stringify(profile));
  }, [profile]);

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      role: '',
      company: '',
      location: '',
      duration: '',
      description: ''
    };
    setEditForm({ ...editForm, experience: [newExp, ...editForm.experience] });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    const updated = editForm.experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setEditForm({ ...editForm, experience: updated });
  };

  const removeExperience = (id: string) => {
    setEditForm({ ...editForm, experience: editForm.experience.filter(exp => exp.id !== id) });
  };

  const toggleSkill = (skill: string) => {
    if (editForm.skills.includes(skill)) {
      setEditForm({ ...editForm, skills: editForm.skills.filter(s => s !== skill) });
    } else {
      setEditForm({ ...editForm, skills: [...editForm.skills, skill] });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header Card */}
      <section className="bg-white rounded-[48px] border border-natural-border shadow-sm overflow-hidden">
        <div className="relative h-64">
          <img src={profile.cover} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-8 right-8 bg-white/20 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-white/40 transition-all border border-white/20 flex items-center gap-2"
          >
            <Edit2 size={16} />
            <span className="text-xs font-black uppercase tracking-widest">Update Profile</span>
          </button>
        </div>

        <div className="px-12 pb-12 relative">
          <div className="absolute -top-20 left-12 w-40 h-40 rounded-[32px] border-8 border-white bg-natural-bg overflow-hidden shadow-2xl group/avatar">
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
              <Camera size={24} className="text-white" />
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </label>
          </div>

          <div className="pt-24 flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-4 max-w-2xl">
              <div>
                <h1 className="text-4xl font-black text-natural-text uppercase tracking-tight flex items-center gap-4">
                  {profile.name}
                  <ShieldCheck className="text-natural-primary" size={28} />
                </h1>
                <p className="text-xl font-bold text-natural-primary mt-1">{profile.title}</p>
              </div>
              <div className="flex flex-wrap gap-6 text-sm font-bold text-natural-muted">
                <span className="flex items-center gap-2">
                  <MapPin size={16} /> {profile.location}
                </span>
                <span className="flex items-center gap-2">
                  <Mail size={16} /> {profile.email}
                </span>
                <span className="flex items-center gap-2">
                  <Globe size={16} /> {profile.website}
                </span>
              </div>
              <div className="text-lg leading-relaxed text-natural-text/70 italic font-medium prose prose-neutral max-w-none">
                <ReactMarkdown>
                  {profile.bio}
                </ReactMarkdown>
              </div>
            </div>

            <div className="bg-natural-bg rounded-3xl p-8 border border-natural-border/50 text-center min-w-[200px]">
              <p className="text-[10px] font-black uppercase tracking-widest text-natural-muted mb-2">Network Strength</p>
              <div className="text-3xl font-black text-natural-primary mb-1">Top 2%</div>
              <p className="text-[10px] font-bold text-natural-text uppercase">Industry Leader Rating</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Experience Section */}
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-white rounded-[40px] border border-natural-border shadow-sm p-10">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-black text-natural-text uppercase tracking-tight flex items-center gap-3">
                <Briefcase className="text-natural-primary" size={24} />
                Professional Experience
              </h2>
            </div>

            <div className="space-y-12">
              {profile.experience.map((exp, idx) => (
                <div key={exp.id} className="relative pl-12 group">
                  {idx !== profile.experience.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-natural-border" />
                  )}
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-xl bg-natural-bg border border-natural-border flex items-center justify-center text-natural-primary z-10">
                    <Award size={16} />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-black text-natural-text tracking-tight">{exp.role}</h3>
                        <p className="text-lg font-bold text-natural-primary mb-1">{exp.company}</p>
                        <div className="flex items-center gap-4 text-xs font-bold text-natural-muted uppercase tracking-wider">
                           <span className="flex items-center gap-1.5"><Calendar size={12} /> {exp.duration}</span>
                           <span className="flex items-center gap-1.5"><MapPin size={12} /> {exp.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-natural-text/70 leading-relaxed font-medium prose prose-sm prose-neutral max-w-none">
                      <ReactMarkdown>
                        {exp.description}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-10">
          {/* Skills */}
          <section className="bg-white rounded-[40px] border border-natural-border shadow-sm p-10">
            <h2 className="text-lg font-black text-natural-text uppercase tracking-tight mb-8 flex items-center gap-3">
              <Award className="text-natural-primary" size={20} />
              Technical Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(skill => (
                <span 
                  key={skill} 
                  className="px-4 py-2 bg-natural-bg border border-natural-border rounded-xl text-xs font-bold text-natural-text hover:border-natural-primary hover:text-natural-primary transition-all cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Contact Details */}
          <section className="bg-natural-secondary text-white rounded-[40px] shadow-2xl shadow-natural-secondary/20 p-10">
            <h2 className="text-lg font-black uppercase tracking-widest mb-8 flex items-center gap-3">
              <User size={20} className="text-natural-primary" />
              Contact Info
            </h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-60">Email Address</p>
                  <p className="text-sm font-bold">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-60">Professional Phone</p>
                  <p className="text-sm font-bold">{profile.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <LinkIcon size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-60">Public Profile</p>
                  <p className="text-sm font-bold truncate max-w-[150px]">{profile.website}</p>
                </div>
              </div>
              <button className="w-full py-5 bg-natural-primary text-white rounded-2xl font-black text-xs shadow-xl shadow-natural-primary/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-3">
                 <ExternalLink size={18} />
                 <span>Share Profile</span>
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-natural-secondary/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[48px] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-natural-border p-12"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-black text-natural-text uppercase tracking-tight">Edit Professional Identity</h2>
                <button onClick={() => setIsEditing(false)} className="p-4 bg-natural-bg rounded-2xl text-natural-muted hover:text-natural-primary transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-12">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-natural-muted ml-4">Full Professional Name</label>
                    <input 
                      type="text" 
                      value={editForm.name} 
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-natural-bg border border-natural-border rounded-3xl px-6 py-4 font-bold text-natural-text focus:outline-none focus:border-natural-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-natural-muted ml-4">Job Title</label>
                    <input 
                      type="text" 
                      value={editForm.title} 
                      onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full bg-natural-bg border border-natural-border rounded-3xl px-6 py-4 font-bold text-natural-text focus:outline-none focus:border-natural-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-natural-muted ml-4">About / Bio (Markdown Supported)</label>
                  <RichTextEditor 
                    value={editForm.bio}
                    onChange={(val) => setEditForm({ ...editForm, bio: val })}
                    placeholder="Tell your professional story..."
                  />
                </div>

                {/* Experience Edit */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase tracking-widest text-natural-primary">Experience History (Drag to Reorder)</h3>
                    <button 
                      onClick={addExperience}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-natural-primary/10 text-natural-primary px-4 py-2 rounded-xl border border-natural-primary/20"
                    >
                      <Plus size={14} /> Add Role
                    </button>
                  </div>
                  
                  <Reorder.Group 
                    axis="y" 
                    values={editForm.experience} 
                    onReorder={(newOrder) => setEditForm({ ...editForm, experience: newOrder })}
                    className="space-y-6"
                  >
                    {editForm.experience.map(exp => (
                      <Reorder.Item 
                        key={exp.id} 
                        value={exp}
                        className="p-8 bg-natural-bg rounded-[32px] border border-natural-border relative group"
                      >
                        <div className="absolute top-8 left-2 -translate-x-full pr-4 cursor-grab active:cursor-grabbing text-natural-muted hover:text-natural-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical size={20} />
                        </div>

                        <button 
                          onClick={() => removeExperience(exp.id)}
                          className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <X size={14} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <input 
                            placeholder="Role Title"
                            value={exp.role}
                            onChange={e => updateExperience(exp.id, 'role', e.target.value)}
                            className="bg-white border border-natural-border rounded-2xl px-5 py-3 text-sm font-bold"
                          />
                          <input 
                            placeholder="Company Name"
                            value={exp.company}
                            onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                            className="bg-white border border-natural-border rounded-2xl px-5 py-3 text-sm font-bold"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <input 
                            placeholder="Duration (e.g. 2020 - Present)"
                            value={exp.duration}
                            onChange={e => updateExperience(exp.id, 'duration', e.target.value)}
                            className="bg-white border border-natural-border rounded-2xl px-5 py-3 text-sm font-bold"
                          />
                          <input 
                            placeholder="Location"
                            value={exp.location}
                            onChange={e => updateExperience(exp.id, 'location', e.target.value)}
                            className="bg-white border border-natural-border rounded-2xl px-5 py-3 text-sm font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-natural-muted ml-2">Description (Markdown Supported)</label>
                          <RichTextEditor 
                            value={exp.description}
                            onChange={(val) => updateExperience(exp.id, 'description', val)}
                            placeholder="Describe your achievements..."
                          />
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>

                <div className="flex items-center gap-4 pt-6">
                  <button 
                    onClick={handleSave}
                    className="flex-1 py-5 bg-natural-primary text-white rounded-3xl font-black text-sm shadow-xl shadow-natural-primary/20 flex items-center justify-center gap-3"
                  >
                    <Save size={20} />
                    <span>Save Changes</span>
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-10 py-5 bg-natural-bg border border-natural-border text-natural-muted rounded-3xl font-black text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
