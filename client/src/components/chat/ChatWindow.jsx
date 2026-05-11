import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Sparkles, Loader2, Info, ArrowDown, X, Smartphone, Camera, Gamepad2, Battery, Cpu, Monitor, Zap, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CATEGORIES = [
  { 
    id: 'budget', 
    label: 'Budget', 
    icon: <Zap size={14} />,
    options: ['Under 15K', '15K–25K', '25K–45K', 'Flagship (60K+)', 'Ultra-Premium']
  },
  { 
    id: 'gaming', 
    label: 'Gaming', 
    icon: <Gamepad2 size={14} />,
    options: ['Casual', 'Competitive', 'Extreme Gaming', 'No Gaming']
  },
  { 
    id: 'camera', 
    label: 'Camera', 
    icon: <Camera size={14} />,
    options: ['Photography', 'Video Recording', 'Selfie Focus', 'Pro-Grade']
  },
  { 
    id: 'battery', 
    label: 'Battery', 
    icon: <Battery size={14} />,
    options: ['All-day', 'Fast Charging', 'Heavy Usage', 'Standard']
  },
  { 
    id: 'performance', 
    label: 'Performance', 
    icon: <Cpu size={14} />,
    options: ['Multitasking', 'Office Use', 'Daily Driver', 'Pure Speed']
  }
];

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your **PhoneGenius AI**. \n\nTo give you the best recommendation, you can either **type your requirements** or use the **Quick Selectors** below. What's your priority today?" }
  ]);
  const [input, setInput] = useState('');
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [sessionId] = useState(Math.random().toString(36).substring(7));
  const [isMinimal, setIsMinimal] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const toggleTag = (option) => {
    if (tags.includes(option)) {
      setTags(tags.filter(t => t !== option));
    } else {
      setTags([...tags, option]);
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if ((!input.trim() && tags.length === 0) || isLoading) return;

    const fullMessage = tags.length > 0 
      ? `My requirements are: ${tags.join(', ')}. ${input.trim()}`
      : input.trim();

    setInput('');
    setTags([]);
    setMessages(prev => [...prev, { role: 'user', content: fullMessage }]);
    setIsLoading(true);
    setActiveCategory(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          message: fullMessage,
          sessionId,
          minimalMode: isMinimal
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') continue;

            try {
              const data = JSON.parse(dataStr);
              if (data.content) {
                assistantMessage += data.content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].content = assistantMessage;
                  return newMessages;
                });
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to my brain. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative bg-transparent overflow-hidden">
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-center py-4 px-4">
        <div className="glass px-6 py-2 rounded-full border border-white/10 flex items-center gap-4 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-medium text-gray-300">Live AI Assistant</span>
          </div>
          <div className="w-[1px] h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-500 font-bold">Minimal Mode</span>
            <button 
              onClick={() => setIsMinimal(!isMinimal)}
              className={cn(
                "w-7 h-4 rounded-full transition-all duration-300 relative",
                isMinimal ? "bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.5)]" : "bg-zinc-800"
              )}
            >
              <div className={cn(
                "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-300",
                isMinimal ? "left-[14px]" : "left-0.5"
              )} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-20 pb-60 px-4 md:px-0 scrollbar-hide"
      >
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx}
                className={cn(
                  "flex w-full gap-4 sm:gap-6",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "flex gap-3 sm:gap-5 max-w-[90%] sm:max-w-[85%]",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xl transition-transform duration-300 hover:scale-110",
                    msg.role === 'user' ? "bg-purple-600 glow-purple" : "bg-zinc-900 border border-white/10"
                  )}>
                    {msg.role === 'user' ? <User size={18} className="text-white" /> : <Bot size={18} className="text-purple-400" />}
                  </div>
                  
                  <div className={cn(
                    "space-y-1 sm:space-y-2 py-1",
                    msg.role === 'user' ? "text-right" : "text-left"
                  )}>
                    <div className="text-[10px] font-bold tracking-tighter text-gray-500 uppercase">
                      {msg.role === 'user' ? 'You' : 'PhoneGenius AI'}
                    </div>
                    <div className={cn(
                      "text-[15px] sm:text-[16px] leading-relaxed",
                      msg.role === 'user' ? "text-white font-medium" : "text-gray-200"
                    )}>
                      {msg.role === 'user' ? (
                        <div className="bg-purple-600/10 border border-purple-500/20 px-4 sm:px-5 py-2 sm:py-3 rounded-2xl rounded-tr-none">
                          {msg.content}
                        </div>
                      ) : (
                        <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-li:my-1">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              img: ({ node, ...props }) => (
                                <img 
                                  {...props} 
                                  className="rounded-2xl border border-white/10 my-6 max-h-60 sm:max-h-80 w-auto object-contain bg-white/5 shadow-2xl mx-auto"
                                  onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop";
                                  }}
                                />
                              ),
                              a: ({ node, ...props }) => (
                                <a {...props} className="text-purple-400 hover:text-purple-300 underline underline-offset-4 decoration-purple-500/50 transition-colors font-bold" target="_blank" rel="noopener noreferrer" />
                              ),
                              table: ({ node, ...props }) => (
                                <div className="overflow-x-auto my-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                                  <table {...props} className="min-w-full divide-y divide-white/10" />
                                </div>
                              )
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-5 px-4 md:px-0">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center animate-pulse">
                <Bot size={20} className="text-purple-500" />
              </div>
              <div className="flex gap-1.5 items-center bg-white/5 px-5 py-3 rounded-2xl rounded-tl-none border border-white/10">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Interactive Selector & Input Section */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pb-6 sm:pb-10 pt-10 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="max-w-4xl mx-auto px-4 md:px-0 space-y-4">
          
          {/* Category Selectors */}
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 text-xs font-semibold",
                  activeCategory === cat.id 
                    ? "bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]" 
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20"
                )}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Option Chips (Dynamic) */}
          <AnimatePresence mode="wait">
            {activeCategory && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex flex-wrap gap-2 justify-center bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl"
              >
                {CATEGORIES.find(c => c.id === activeCategory).options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => toggleTag(opt)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-1.5 rounded-lg border transition-all duration-300 text-[11px] font-medium",
                      tags.includes(opt)
                        ? "bg-purple-500/20 border-purple-500 text-purple-300"
                        : "bg-black/20 border-white/5 text-gray-400 hover:border-white/20 hover:text-gray-200"
                    )}
                  >
                    {tags.includes(opt) && <Check size={12} />}
                    {opt}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-1000 group-focus-within:opacity-40" />
            <div className="relative flex flex-col bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 group-focus-within:border-purple-500/50">
              
              {/* Selected Tags Area */}
              <AnimatePresence>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 border-b border-white/5">
                    {tags.map(tag => (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        key={tag}
                        className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-[10px] font-bold rounded-full shadow-lg glow-purple"
                      >
                        {tag}
                        <button onClick={() => toggleTag(tag)} className="hover:text-pink-300">
                          <X size={10} />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                )}
              </AnimatePresence>

              <div className="flex items-center p-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={tags.length > 0 ? "Add more details..." : "Describe your perfect phone..."}
                  className="flex-1 bg-transparent border-none py-3 px-4 text-[15px] sm:text-[16px] text-white focus:outline-none placeholder:text-gray-500"
                />
                <button 
                  type="submit"
                  disabled={(!input.trim() && tags.length === 0) || isLoading}
                  className={cn(
                    "p-3 rounded-xl transition-all duration-300",
                    (input.trim() || tags.length > 0) ? "bg-purple-600 text-white shadow-lg glow-purple scale-100" : "bg-white/5 text-gray-500 scale-95"
                  )}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : <Send className="w-5 h-5 sm:w-6 sm:h-6" />}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default ChatWindow;
