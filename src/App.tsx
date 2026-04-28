/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import KnowledgeHub from './components/Knowledge';
import JobBoard from './components/Jobs';
import AIAssistant from './components/AIAssistant';
import Marketplace from './components/Marketplace';
import Training from './components/Training';
import CommunityChat from './components/CommunityChat';
import UserProfile from './components/UserProfile';
import DirectMessages from './components/Messages';
import Discover from './components/Discover';
import SplashScreen from './components/SplashScreen';
import Auth from './components/Auth';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Search, User as UserIcon, LogOut } from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const savedUser = localStorage.getItem('groundpro_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('groundpro_user');
    setUser(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Feed />;
      case 'chat':
        return <CommunityChat />;
      case 'discover':
        return <Discover />;
      case 'messages':
        return <DirectMessages />;
      case 'knowledge':
        return <KnowledgeHub />;
      case 'marketplace':
        return <Marketplace />;
      case 'jobs':
        return <JobBoard />;
      case 'ai':
        return <AIAssistant />;
      case 'training':
        return <Training />;
      case 'profile':
        return <UserProfile onUpdateUser={setUser} />;
      default:
        return <Feed />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
      ) : !user ? (
        <motion.div
          key="auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          <Auth onAuthComplete={setUser} />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen bg-natural-bg flex font-sans antialiased text-natural-text overflow-x-hidden"
        >
          {/* Sidebar Navigation */}
          <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content Area */}
          <main className="flex-1 ml-64 p-10">
            <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight capitalize">{activeTab === 'home' ? 'Grounds Overview' : activeTab.replace('-', ' ')}</h2>
                <p className="text-natural-muted text-sm font-medium">Lord's Cricket Ground • Tuesday, Oct 24</p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="relative group max-w-xs transition-all duration-300 focus-within:max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-natural-muted group-focus-within:text-natural-primary" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-80 bg-white border border-natural-border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-natural-primary/5 focus:border-natural-primary transition-all shadow-sm"
                  />
                </div>
                
                <div className="flex items-center gap-3 pl-6 border-l border-natural-border">
                  <div className="text-right flex flex-col justify-center">
                    <p className="text-sm font-black text-natural-primary leading-tight">{user?.displayName}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-natural-muted">Professional</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2.5 bg-white border border-natural-border rounded-xl text-red-500 hover:bg-red-50 transition-all shadow-sm group"
                    title="Logout"
                  >
                    <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </header>

            <section className="max-w-6xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </section>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
