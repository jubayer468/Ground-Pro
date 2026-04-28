/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Home, BookOpen, Briefcase, MessageSquare, User, Settings, Info, ShoppingBag, GraduationCap, Users, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ user, activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Feed' },
    { id: 'chat', icon: Users, label: 'Community Hub' },
    { id: 'discover', icon: Search, label: 'Discover Curators' },
    { id: 'knowledge', icon: BookOpen, label: 'Knowledge Hub' },
    { id: 'marketplace', icon: ShoppingBag, label: 'Marketplace' },
    { id: 'jobs', icon: Briefcase, label: 'Job Board' },
    { id: 'ai', icon: MessageSquare, label: 'AI Assistant' },
    { id: 'training', icon: GraduationCap, label: 'Training' },
    { id: 'messages', icon: MessageSquare, label: 'Direct Messages' },
    { id: 'profile', icon: User, label: 'Professional Profile' },
  ];

  return (
    <div className="w-64 h-screen bg-natural-sidebar text-natural-text flex flex-col fixed left-0 top-0 border-r border-natural-border shadow-[4px_0_24px_rgba(45,68,37,0.02)]">
      <div className="p-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-natural-primary">
          GroundPro
        </h1>
        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-natural-muted mt-1.5">Curator Console</p>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-5 py-3 rounded-xl transition-all duration-300 group ${
              activeTab === item.id 
                ? 'bg-natural-primary text-white shadow-xl shadow-natural-primary/20 scale-[1.02]' 
                : 'text-natural-muted hover:bg-natural-bg hover:text-natural-text'
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-natural-muted/60 group-hover:text-natural-primary'} />
            <span className="font-semibold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="flex items-center gap-3 p-4 bg-natural-bg rounded-2xl border border-natural-border">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} className="w-9 h-9 rounded-full ring-4 ring-white shadow-sm object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-natural-primary flex items-center justify-center text-white text-xs font-bold ring-4 ring-white shadow-sm">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
          )}
          <div className="overflow-hidden">
            <div className="font-bold text-sm truncate">{user?.displayName || 'User'}</div>
            <div className="text-[10px] text-natural-muted font-semibold uppercase tracking-wider truncate">Professional</div>
          </div>
        </div>
      </div>
    </div>
  );
}
