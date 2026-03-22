import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, X, Send, Sparkles, Command, 
  MessageSquare, BrainCircuit, Zap, 
  TrendingUp, IndianRupee, Users, Target
} from "lucide-react";

export const FloatingAiChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([
    { role: 'assistant', content: 'Good afternoon! I see your engagement is peaking on Reels today. How can I help you scale?' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "What should I post today?",
    "Write a pitch for Zomato",
    "Why is my reach dropping?",
    "Find me 3 collab ideas",
    "Am I charging enough?"
  ];

  const handleSend = (text?: string) => {
    const input = text || message;
    if (!input.trim()) return;

    setHistory(prev => [...prev, { role: 'user', content: input }]);
    if (!text) setMessage("");

    // Mock AI Response
    setTimeout(() => {
      setHistory(prev => [...prev, { 
        role: 'assistant', 
        content: `Based on your live data (₹ 45k avg deal size and 4.8% engagement), you should focus on 'Tech Lifestyle' content today at 6:30 PM for maximum ROI.` 
      }]);
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-[400px] h-[560px] bg-card border border-primary/30 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* HEADER */}
            <div className="p-6 bg-primary/5 border-b border-border/20 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
                     <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                     <h3 className="text-sm font-black uppercase tracking-tight">AI Assistant</h3>
                     <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black text-emerald-500 uppercase">Live & Data-Aware</span>
                     </div>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-full transition-all">
                  <X className="w-5 h-5" />
               </button>
            </div>

            {/* CHAT AREA */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
               {history.map((h, i) => (
                 <motion.div 
                   initial={{ opacity: 0, x: h.role === 'user' ? 20 : -20 }} 
                   animate={{ opacity: 1, x: 0 }} 
                   key={i} 
                   className={`flex ${h.role === 'user' ? 'justify-end' : 'justify-start'}`}
                 >
                    <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] font-medium leading-relaxed ${
                      h.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/10 border border-border/40'
                    }`}>
                       {h.content}
                    </div>
                 </motion.div>
               ))}
               <div ref={chatEndRef} />
            </div>

            {/* QUICK PROMPTS & INPUT */}
            <div className="p-6 space-y-4 bg-muted/5 border-t border-border/20">
               <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {quickPrompts.map(p => (
                    <button 
                      key={p} 
                      onClick={() => handleSend(p)}
                      className="whitespace-nowrap px-4 py-2 bg-background border border-border/40 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-all"
                    >
                       {p}
                    </button>
                  ))}
               </div>
               <div className="relative">
                  <input 
                    placeholder="Ask anything..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="w-full h-14 bg-background border border-border/40 rounded-[1.5rem] pl-6 pr-14 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                  />
                  <button 
                    onClick={() => handleSend()}
                    className="absolute right-3 top-3 w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                  >
                     <Send className="w-4 h-4" />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all relative group overflow-hidden ${
          isOpen ? 'bg-black rotate-90' : 'bg-primary border-4 border-primary/20'
        }`}
      >
         <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
         <motion.div 
           animate={{ scale: [1, 1.2, 1] }} 
           transition={{ repeat: Infinity, duration: 2 }}
           className="absolute inset-0 rounded-full border-2 border-white/40" 
         />
         {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
         <span className="sr-only">AI Assistant</span>
      </motion.button>
    </div>
  );
};
