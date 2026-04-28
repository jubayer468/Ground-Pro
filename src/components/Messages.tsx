/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Send, User, ChevronRight, MessageSquare, Phone, Info, Plus } from 'lucide-react';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
}

const MOCK_CHATS: Chat[] = [
  { id: '1', name: 'Darren Gough', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100', lastMessage: 'The pH levels look a bit high today.', time: '12:45', unread: 2, online: true },
  { id: '2', name: 'Sarah Grounds', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100', lastMessage: 'Did you see the new ICC guidelines?', time: 'Yesterday', unread: 0, online: false },
  { id: '3', name: 'Mike Atherton', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', lastMessage: 'Great work on the Lord\'s pitch!', time: 'Oct 22', unread: 0, online: true },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 'm1', senderId: '1', text: 'Hi, I saw your latest report on the moisture content.', time: '12:30' },
    { id: 'm2', senderId: 'me', text: 'Thanks! I spent most of the morning testing with the moisture meter.', time: '12:35' },
    { id: 'm3', senderId: '1', text: 'The pH levels look a bit high today. Are you considering any lime application?', time: '12:45' },
  ]
};

export default function DirectMessages() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChat) {
      setMessages(MOCK_MESSAGES[selectedChat.id] || []);
    }
  }, [selectedChat]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const msg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <div className="flex gap-8 h-[calc(100vh-220px)]">
      {/* Sidebar / Chat List */}
      <div className="w-80 flex flex-col bg-white border border-natural-border rounded-[40px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-natural-border">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-natural-muted group-focus-within:text-natural-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search curators..." 
              className="w-full bg-natural-bg border border-natural-border rounded-2xl py-3 pl-11 pr-4 text-xs font-bold focus:outline-none focus:border-natural-primary transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {MOCK_CHATS.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${
                selectedChat?.id === chat.id 
                  ? 'bg-natural-primary text-white shadow-lg shadow-natural-primary/20' 
                  : 'hover:bg-natural-bg text-natural-text'
              }`}
            >
              <div className="relative">
                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-2xl object-cover" />
                {chat.online && (
                  <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full bg-emerald-500`} />
                )}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="font-black text-sm truncate">{chat.name}</h4>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${selectedChat?.id === chat.id ? 'text-white/70' : 'text-natural-muted'}`}>
                    {chat.time}
                  </span>
                </div>
                <p className={`text-xs font-medium truncate ${selectedChat?.id === chat.id ? 'text-white/80' : 'text-natural-muted'}`}>
                  {chat.lastMessage}
                </p>
              </div>
              {chat.unread > 0 && selectedChat?.id !== chat.id && (
                <div className="w-5 h-5 bg-natural-primary text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white border border-natural-border rounded-[40px] overflow-hidden shadow-sm relative">
        <AnimatePresence mode="wait">
          {selectedChat ? (
            <motion.div 
              key={selectedChat.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full"
            >
              <div className="p-6 border-b border-natural-border flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={selectedChat.avatar} alt={selectedChat.name} className="w-12 h-12 rounded-2xl object-cover" />
                    {selectedChat.online && (
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-natural-primary leading-tight">{selectedChat.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-natural-muted">
                      {selectedChat.online ? 'Active Now' : 'Last seen yesterday'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-3 bg-natural-bg text-natural-muted hover:text-natural-primary rounded-2xl border border-natural-border transition-all">
                    <Phone size={18} />
                  </button>
                  <button className="p-3 bg-natural-bg text-natural-muted hover:text-natural-primary rounded-2xl border border-natural-border transition-all">
                    <Info size={18} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-6 bg-natural-bg/30">
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] group`}>
                      <div className={`p-5 rounded-3xl text-sm font-bold shadow-sm ${
                        msg.senderId === 'me'
                          ? 'bg-natural-primary text-white rounded-tr-none'
                          : 'bg-white text-natural-text border border-natural-border rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <p className={`text-[9px] font-black uppercase tracking-widest mt-2 px-1 ${
                        msg.senderId === 'me' ? 'text-right text-natural-muted' : 'text-left text-natural-muted'
                      }`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-8 bg-white border-t border-natural-border">
                <div className="relative group">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type your message..." 
                    className="w-full bg-natural-bg border border-natural-border rounded-3xl py-5 pl-8 pr-16 font-bold text-natural-text focus:outline-none focus:border-natural-primary transition-all"
                  />
                  <button 
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-natural-primary text-white rounded-2xl shadow-lg shadow-natural-primary/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
              <div className="w-24 h-24 bg-natural-bg rounded-full flex items-center justify-center mb-6 border border-natural-border">
                <MessageSquare className="text-natural-primary/30" size={40} />
              </div>
              <h3 className="text-2xl font-black text-natural-primary tracking-tight mb-2">Direct Messaging</h3>
              <p className="text-natural-muted font-medium max-w-xs mx-auto">
                Select a curator to start a professional conversation or discuss grounds management.
              </p>
              <button className="mt-8 flex items-center gap-2 bg-natural-primary text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-natural-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                <Plus size={18} />
                <span>Start New Connection</span>
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
