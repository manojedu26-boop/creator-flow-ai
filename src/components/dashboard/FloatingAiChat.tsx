import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, X, Send, Sparkles, Command, 
  MessageSquare, BrainCircuit, Zap, 
  TrendingUp, Users, Target, ChevronDown
} from "lucide-react";
import { Typewriter } from "../shared/MotionComponents";
import { useAuth } from "../../contexts/AuthContext";
import { BottomSheet } from "../ui/BottomSheet";

export const FloatingAiChat = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([
    { 
      role: 'assistant', 
      content: `Good afternoon, ${user?.firstName || 'Creator'}! I see your ${user?.niche || ''} content is trending. How can I help you scale?` 
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const quickPrompts = [
    "Post ideas today?",
    "Pitch for Zomato",
    "Reach dropping?",
    "Collab ideas",
    "My rates?"
  ];

  const handleSend = (text?: string) => {
    const input = text || message;
    if (!input.trim()) return;

    setHistory(prev => [...prev, { role: 'user', content: input }]);
    if (!text) setMessage("");

    // Mock AI Response
    setTimeout(() => {
      const stats = Object.entries(user?.followerCounts || {}).map(([p, c]) => `${c} on ${p}`).join(', ');
      setHistory(prev => [...prev, { 
        role: 'assistant', 
        content: `Based on your ${user?.niche || 'creator'} data (${stats || 'growing reach'}), you should focus on ${user?.niche || 'engaging'} content today at 6:30 PM for maximum ROI.` 
      }]);
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const renderChatUI = () => (
    <>
      {!isMobile && (
        <div className="p-5 md:p-6 bg-primary/5 border-b border-border/20 flex items-center justify-between shrink-0">
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
              <ChevronDown className="w-5 h-5 hidden md:flex" />
           </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 no-scrollbar">
          {history.map((h, i) => (
            <motion.div 
              initial={{ opacity: 0, x: h.role === 'user' ? 20 : -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              key={i} 
              className={`flex ${h.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
               <div className={`max-w-[85%] p-4 rounded-2xl text-xs md:text-[13px] font-medium leading-relaxed ${
                 h.role === 'user' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/10' : 'bg-muted/10 border border-border/40'
               }`}>
                  {h.role === 'assistant' ? <Typewriter text={h.content} speed={25} /> : h.content}
               </div>
            </motion.div>
          ))}
         <div ref={chatEndRef} />
      </div>

      <div className="p-5 md:p-6 space-y-4 bg-muted/5 border-t border-border/20 shrink-0 pb-safe-offset">
         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {quickPrompts.map(p => (
              <button 
                key={p} 
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-4 py-2 bg-background border border-border/40 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-all active:scale-95"
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
              className="w-full h-12 md:h-14 bg-background border border-border/40 rounded-[1.25rem] md:rounded-[1.5rem] pl-5 pr-14 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
            <button 
              onClick={() => handleSend()}
              className="absolute right-2 top-2 md:right-3 md:top-3 w-8 h-8 md:w-8 md:h-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
            >
               <Send className="w-4 h-4 md:w-4 md:h-4" />
            </button>
         </div>
      </div>
    </>
  );

  return (
    <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-[200]">
      <AnimatePresence>
        {!isMobile && isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed inset-4 md:inset-auto md:bottom-20 md:right-0 md:w-[400px] md:h-[560px] bg-card border border-primary/30 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden backdrop-blur-xl z-[201]"
          >
             {renderChatUI()}
          </motion.div>
        )}
      </AnimatePresence>

      {isMobile && (
        <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} height="70vh" title="AI Assistant">
          <div className="flex flex-col h-full">
            {renderChatUI()}
          </div>
        </BottomSheet>
      )}

      <motion.button 
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all relative group overflow-hidden ${
          isOpen ? 'bg-black rotate-90' : 'bg-primary border-4 border-primary/20'
        }`}
      >
         <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
         {!isOpen && (
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full border-2 border-white/40" 
            />
         )}
         {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6 md:w-7 md:h-7" />}
         <span className="sr-only">AI Assistant</span>
      </motion.button>
    </div>
  );
};
