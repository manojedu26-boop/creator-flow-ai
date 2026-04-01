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
import { cn } from "@/lib/utils";

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

  const renderChatUI = () => (
    <>
      {!isMobile && (
        <div className="p-5 md:p-6 bg-blue-50 border-b border-blue-100 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl text-white shadow-sm">
                 <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                 <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Elite Assistant</h3>
                 <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase">System Active</span>
                 </div>
              </div>
           </div>
           <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white rounded-full transition-all border border-transparent hover:border-blue-100">
              <ChevronDown className="w-5 h-5 hidden md:flex text-slate-400 hover:text-blue-600" />
           </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar bg-slate-50/50">
          {history.map((h, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10, x: h.role === 'user' ? 20 : -20 }} 
              animate={{ opacity: 1, y: 0, x: 0 }} 
              key={i} 
              className={cn("flex", h.role === 'user' ? 'justify-end' : 'justify-start')}
            >
               <div className={cn(
                 "max-w-[85%] p-5 rounded-3xl text-sm font-medium leading-relaxed shadow-sm relative overflow-hidden",
                 h.role === 'user' 
                 ? 'bg-blue-600 text-white rounded-tr-none' 
                 : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
               )}>
                  {h.role === 'assistant' && (
                    <div className="absolute inset-0 bg-mesh-primary opacity-5 pointer-events-none" />
                  )}
                  <div className="relative z-10">
                    {h.role === 'assistant' ? <Typewriter text={h.content} speed={20} /> : h.content}
                  </div>
               </div>
            </motion.div>
          ))}
          <div ref={chatEndRef} />
      </div>

      <div className="p-5 md:p-6 space-y-4 bg-white border-t border-slate-100 shrink-0 pb-safe-offset">
         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {quickPrompts.map(p => (
              <button 
                key={p} 
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all active:scale-95 text-slate-500"
              >
                 {p}
              </button>
            ))}
         </div>
         <div className="relative">
            <input 
              placeholder="Ask Elite AI anything..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full h-12 md:h-14 bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-14 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all shadow-inner"
            />
            <button 
              onClick={() => handleSend()}
              className="absolute right-2 top-2 md:right-3 md:top-3 w-8 h-8 md:w-8 md:h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
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
            initial={{ opacity: 0, y: 40, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="fixed inset-4 md:inset-auto md:bottom-24 md:right-0 md:w-[420px] md:h-[620px] bg-white/90 border border-slate-200 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] flex flex-col overflow-hidden backdrop-blur-3xl z-[201]"
          >
             <div className="absolute inset-0 bg-mesh-primary opacity-30 pointer-events-none" />
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all relative group overflow-hidden ${
          isOpen ? 'bg-slate-900 rotate-90' : 'bg-blue-600 shadow-blue-500/30'
        }`}
      >
         <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
         {!isOpen && (
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }} 
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute inset-0 rounded-full border-4 border-white/20" 
            />
         )}
         {isOpen ? <X className="w-7 h-7" /> : <Bot className="w-7 h-7 md:w-8 md:h-8" />}
         <span className="sr-only">AI Assistant</span>
      </motion.button>
    </div>
  );
};
