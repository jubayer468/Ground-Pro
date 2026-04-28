/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Image as ImageIcon, Video, Paperclip, X, User, Smile, Loader2, Play } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  text: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  };
  timestamp: string;
  reactions?: Record<string, number>;
}

export default function CommunityChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'image' | 'video', url: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // In production/deployment, we should use the same origin
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('chat:history', (history: Message[]) => {
      setMessages(history);
    });

    newSocket.on('chat:message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('chat:reaction', ({ messageId, reactions }: { messageId: string, reactions: Record<string, number> }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, reactions } : msg
      ));
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const [errorHeader, setErrorHeader] = useState<string | null>(null);

  useEffect(() => {
    if (errorHeader) {
      const timer = setTimeout(() => setErrorHeader(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorHeader]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorHeader("File is too large. Max 5MB permitted.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const type = file.type.startsWith('video') ? 'video' : 'image';
      setSelectedMedia({ type, url: reader.result as string });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedMedia) return;
    if (!socket) return;

    const newMessage = {
      sender: "Jubayer Ahmed", // Simulated user
      text: inputText,
      media: selectedMedia || undefined,
    };

    socket.emit('chat:message', newMessage);
    setInputText('');
    setSelectedMedia(null);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    if (!socket) return;
    socket.emit('chat:reaction', { messageId, emoji });
  };

  return (
    <div className="flex flex-col h-[75vh] bg-white rounded-[40px] border border-natural-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-8 py-5 border-b border-natural-border bg-natural-bg/30 flex justify-between items-center relative">
        <AnimatePresence>
          {errorHeader && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-red-500 text-white text-[10px] font-black py-2 px-8 flex justify-center z-10 uppercase tracking-widest shadow-lg"
            >
              {errorHeader}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-natural-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-natural-primary/20">
            <User size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-natural-text">Global Curator Chat</h3>
            <p className="text-[10px] font-bold text-natural-primary uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-natural-primary rounded-full animate-pulse" />
              Live Now
            </p>
          </div>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-natural-bg overflow-hidden">
              <img src={`https://i.pravatar.cc/150?u=${i}`} alt="avatar" className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-white bg-natural-primary flex items-center justify-center text-[10px] font-black text-white">
            +12
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-natural-bg/10">
        {messages.map((msg, idx) => {
          const isOwn = msg.sender === "Jubayer Ahmed";
          return (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={msg.id || idx}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] space-y-2 ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                 <div className="flex items-center gap-2 mb-1">
                   {!isOwn && <span className="text-[10px] font-black uppercase tracking-widest text-natural-muted">{msg.sender}</span>}
                   <span className="text-[8px] font-bold text-natural-muted/60">
                     {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                 </div>
                 
                 <div className="relative group">
                   <div className={`p-4 rounded-3xl text-sm font-medium shadow-sm leading-relaxed ${
                     isOwn 
                       ? 'bg-natural-primary text-white rounded-tr-none' 
                       : 'bg-white border border-natural-border text-natural-text rounded-tl-none'
                   }`}>
                     {msg.media && (
                       <div className="mb-3 rounded-2xl overflow-hidden border border-black/5 bg-black/5">
                          {msg.media.type === 'image' ? (
                            <img src={msg.media.url} alt="Shared media" className="w-full max-h-80 object-cover" />
                          ) : (
                            <div className="relative aspect-video flex items-center justify-center">
                              <video src={msg.media.url} className="w-full max-h-80" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group cursor-pointer">
                                 <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-100 hover:scale-110 transition-transform">
                                   <Play size={24} fill="currentColor" />
                                 </div>
                              </div>
                            </div>
                          )}
                       </div>
                     )}
                     {msg.text && <p>{msg.text}</p>}
                   </div>

                   {/* Quick Reactions */}
                   <div className={`absolute top-0 ${isOwn ? 'right-full mr-2' : 'left-full ml-2'} opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-natural-border rounded-full p-1 shadow-xl flex gap-1 z-10`}>
                      {['👍', '🔥', '❤️', '🏆', '😮'].map(emoji => (
                        <button 
                          key={emoji}
                          onClick={() => handleReaction(msg.id, emoji)}
                          className="hover:scale-125 transition-transform p-1"
                        >
                          {emoji}
                        </button>
                      ))}
                   </div>
                 </div>

                 {/* Display Reactions */}
                 {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                   <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                     {Object.entries(msg.reactions).map(([emoji, count]) => (
                       <div key={emoji} className="bg-white border border-natural-border rounded-full px-2 py-0.5 text-[10px] font-black flex items-center gap-1 shadow-sm">
                         <span>{emoji}</span>
                         <span className="text-natural-muted">{count}</span>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-natural-border bg-white">
        <AnimatePresence>
          {selectedMedia && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 relative group"
            >
              <div className="relative rounded-2xl overflow-hidden border-2 border-natural-primary/20 aspect-video md:aspect-auto md:h-32 inline-block">
                {selectedMedia.type === 'image' ? (
                  <img src={selectedMedia.url} alt="preview" className="h-full w-auto object-cover" />
                ) : (
                  <video src={selectedMedia.url} className="h-full w-auto object-cover" />
                )}
                <button 
                  onClick={() => setSelectedMedia(null)}
                  className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSendMessage} className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-natural-muted hover:text-natural-primary hover:bg-natural-bg rounded-2xl transition-all"
            >
              {isUploading ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
            </button>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-natural-muted hover:text-natural-primary hover:bg-natural-bg rounded-2xl transition-all hidden sm:flex"
            >
              <Video size={20} />
            </button>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
            className="hidden" 
          />

          <div className="flex-1 relative">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Post an update, photo, or technical question..."
              className="w-full bg-natural-bg/50 border border-natural-border rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:border-natural-primary transition-all pr-12"
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-natural-muted hover:text-natural-primary transition-colors"
            >
              <Smile size={18} />
            </button>
          </div>

          <button 
            type="submit"
            disabled={!inputText.trim() && !selectedMedia}
            className="p-3 bg-natural-primary text-white rounded-2xl shadow-lg shadow-natural-primary/20 hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
