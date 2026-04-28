/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, TreePine, AlertCircle, Loader2, CloudSun, MapPin } from "lucide-react";
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { getWeatherByCity, getCurrentWeather, WeatherData } from "../services/weatherService";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Weather tool definition
const getWeatherTool: FunctionDeclaration = {
  name: "get_weather",
  description: "Get the current weather for a specific location to provide pitch curation advice.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: {
        type: Type.STRING,
        description: "The city and country, e.g., 'London, UK' or 'Mumbai, IN'"
      }
    },
    required: ["location"]
  }
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hello! I am TurfDoc, your professional grounds management assistant. Are you planning a pitch preparation, dealing with turf stress, or looking for soil drainage advice?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localWeather, setLocalWeather] = useState<WeatherData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('groundpro_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUserAvatar(parsed.photoURL || null);
    }
  }, []);

  useEffect(() => {
    // Try to get local weather on mount
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const weather = await getCurrentWeather(position.coords.latitude, position.coords.longitude);
        if (weather) setLocalWeather(weather);
      });
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Use ref to current messages to avoid closure issues and unnecessary re-renders
      const currentMessages = [...messages, { role: "user", content: userMessage }];
      const history = currentMessages.slice(0, -1).map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const response = await genAI.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
          ...history,
          {
            role: "user",
            parts: [{ 
              text: `Current local context (if available): ${localWeather ? JSON.stringify(localWeather) : "Location unknown"}.
              User Query: ${userMessage}` 
            }]
          }
        ],
        config: {
          systemInstruction: "You are TurfDoc, an expert ground manager. You have access to weather data tools. If a user asks for advice, ALWAYS check the weather if it's relevant (e.g., watering, covering pitches, disease risk). Provide technical advice focusing on moisture, clay, and turf health.",
          tools: [{ functionDeclarations: [getWeatherTool] }],
          toolConfig: { includeServerSideToolInvocations: true }
        }
      });

      let assistantContent = "";
      const functionCalls = response.functionCalls;

      if (functionCalls && functionCalls.length > 0) {
        // Handle weather function call
        const weatherCall = functionCalls.find(fc => fc.name === "get_weather");
        if (weatherCall) {
          const location = (weatherCall.args as any).location;
          const weatherData = await getWeatherByCity(location);
          
          // Send tool output back to model
          const secondResponse = await genAI.models.generateContent({
            model: "gemini-3.1-pro-preview",
            contents: [
              ...history,
              { role: "user", parts: [{ text: userMessage }] },
              { role: "assistant", parts: [{ functionCall: weatherCall }] },
              { 
                role: "user", 
                parts: [{ 
                  text: `Weather data for ${location}: ${JSON.stringify(weatherData || "Error fetching weather")}. Now provide your expertise-based proactive advice.` 
                }] 
              }
            ],
            config: {
              systemInstruction: "You are TurfDoc. Use the provided weather data to give specific, proactive advice on pitch prep, watering, and disease risk.",
            }
          });
          assistantContent = secondResponse.text || "I've analyzed the atmospheric conditions, but I'm having trouble formulating a specific recommendation. Please check your soil moisture manually.";
        }
      } else {
        assistantContent = response.text || "I apologize, I'm having trouble analyzing that request.";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: assistantContent }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Error connecting to TurfDoc systems. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col bg-white rounded-[32px] shadow-2xl border border-natural-border overflow-hidden ring-1 ring-natural-primary/5">
      {/* Header */}
      <div className="bg-gradient-to-br from-natural-primary to-natural-secondary p-8 text-white flex items-center justify-between relative overflow-hidden">
        {/* Abstract background element */}
        <div className="absolute right-[-20px] top-[-20px] opacity-10">
           <TreePine size={160} />
        </div>
        
        <div className="flex items-center space-x-5 relative z-10">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl">
            <Sparkles size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight leading-none">TurfDoc AI</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/60 mt-1.5">Expert Grounds Intelligence</p>
          </div>
        </div>
        
        {localWeather && (
          <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
            <CloudSun size={20} className="text-[#D9F4D3]" />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest leading-none">{localWeather.city}</p>
              <p className="text-xs font-bold">{localWeather.temperature}°C • {localWeather.condition}</p>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2 text-[10px] font-black text-white bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full relative z-10 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D9F4D3] animate-pulse" />
          <span>Real-time Guidance</span>
        </div>
      </div>

      {/* Chat area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 bg-natural-bg/30"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((m, idx) => (
            <motion.div
              key={`${idx}-${m.role}`}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] flex items-start gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                {/* Icon/Avatar Container */}
                <div className={`shrink-0 mt-1 relative`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md transition-transform hover:scale-105 ${
                    m.role === "user" 
                      ? "bg-white border border-natural-border text-natural-primary" 
                      : "bg-natural-primary text-white shadow-natural-primary/20"
                  }`}>
                    {m.role === "user" ? (
                      userAvatar ? (
                        <img src={userAvatar} alt="User" className="w-full h-full rounded-2xl object-cover" />
                      ) : (
                        <User size={20} className="font-bold" />
                      )
                    ) : (
                      <Sparkles size={20} className="animate-pulse" />
                    )}
                  </div>
                  {m.role === "assistant" && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className="flex flex-col">
                  {m.role === "assistant" && (
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-natural-muted mb-1.5 ml-1">
                      TurfDoc Analyst
                    </span>
                  )}
                  <div className={`p-6 rounded-[28px] shadow-sm text-sm font-bold leading-relaxed relative ${
                    m.role === "user" 
                      ? "bg-natural-primary text-white rounded-tr-none shadow-xl shadow-natural-primary/10" 
                      : "bg-white text-natural-text border border-natural-border rounded-tl-none hover:border-natural-primary/20 transition-colors"
                  }`}>
                    {m.content}
                    
                    {/* Role Indicator Bubble for user */}
                    {m.role === "user" && (
                      <div className="absolute -top-2 -right-2 bg-white text-natural-primary text-[8px] font-black px-2 py-0.5 rounded-full border border-natural-primary/10 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        YOU
                      </div>
                    )}
                  </div>
                  <div className={`mt-2 flex items-center gap-2 group ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <span className="text-[9px] font-black uppercase tracking-widest text-natural-muted/40">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-md p-6 rounded-[32px] border border-natural-border shadow-xl ring-1 ring-natural-primary/5">
                <div className="flex space-x-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div 
                      key={i}
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 1, 0.3],
                        y: [0, -4, 0]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1.2, 
                        delay: i * 0.15,
                        ease: "easeInOut"
                      }}
                      className="w-2.5 h-2.5 bg-natural-primary rounded-full shadow-sm shadow-natural-primary/20" 
                    />
                  ))}
                </div>
                <span className="text-[11px] text-natural-primary font-black uppercase tracking-[0.25em]">Analyzing Grounds...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <div className="p-6 bg-white border-t border-natural-border">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about NPK ratios, pitch rolling, or grass disease..."
            className="w-full bg-natural-bg border border-natural-border rounded-[20px] px-7 py-5 pr-20 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-natural-primary/5 focus:border-natural-primary transition-all shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2.5 p-4 bg-natural-primary text-white rounded-[16px] shadow-xl shadow-natural-primary/20 hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4">
          <AlertCircle size={12} className="text-natural-muted" />
          <p className="text-[10px] text-natural-muted font-bold uppercase tracking-wider text-center">
            Cross-verify AI suggestions with local climate reports.
          </p>
        </div>
      </div>
    </div>
  );
}
