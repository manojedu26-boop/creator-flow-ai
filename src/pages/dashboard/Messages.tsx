import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Star, MessageSquare, Send, 
  Sparkles, ShieldCheck, Mail, Clock, 
  MoreHorizontal, ChevronRight, User,
  Instagram, Youtube, Filter, Hash,
  CheckCircle2, AlertCircle, Trash2,
  FileText, CornerUpLeft, Wand2, Type, 
  Smile, Paperclip, ChevronLeft, Target
} from "lucide-react";
import { PageTransition, staggerContainer, staggerItem } from "../../components/shared/MotionComponents";

type Tab = 'dms' | 'brands' | 'comments' | 'templates';

export const Messages = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dms');
  const [selectedId, setSelectedId] = useState<string>('1');
  const [showAiSuggest, setShowAiSuggest] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const chats = [
    { id: '1', name: 'Nike PR Team', last: 'Looking forward to the Reel drafting!', time: '10:42 AM', unread: 2, brand: true, type: 'brands', avatar: 'N', color: 'bg-zinc-900' },
    { id: '2', name: 'Sarah Chen', last: 'Hey! Would love to collab on the next travel series.', time: 'Yesterday', unread: 0, brand: false, type: 'dms', avatar: 'S', color: 'bg-indigo-500' },
    { id: '3', name: 'Adobe Creative', last: 'Your contract has been approved. Welcome aboard!', time: '2 days ago', unread: 0, brand: true, type: 'brands', avatar: 'A', color: 'bg-rose-600' },
    { id: '4', name: 'Alex Rivera', last: 'Yo, check this audio out 🔥 It is trending big.', time: 'Mon', unread: 5, brand: false, type: 'dms', avatar: 'R', color: 'bg-emerald-500' },
  ];

  const comments = [
    { id: 'c1', post: 'New Desk Setup', user: 'coder_pro', text: 'Where did you get that monitor arm?', time: '2h', type: 'Question', sentiment: 'Positive' },
    { id: 'c2', post: 'Travel Vlog', user: 'wanderlust', text: 'This lighting is incredible! What gear?', time: '5h', type: 'Comment', sentiment: 'Positive' },
    { id: 'c3', post: 'New Desk Setup', user: 'spam_bot', text: 'Check bio for free cash!!', time: '10h', type: 'Spam', sentiment: 'Negative' },
  ];

  const handleChatSelect = (id: string) => {
    setSelectedId(id);
    setIsMobileChatOpen(true);
  };

  return (
    <PageTransition>
      <div className="flex h-[calc(100vh-160px)] -mx-4 md:-mx-8 -my-6 overflow-hidden bg-transparent relative">
        {/* BACKGROUND GLOWS */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

        {/* LEFT — INBOX LIST (Glass Sidebar Style) */}
        <div className={`w-full lg:w-[420px] border-r border-white/5 flex flex-col h-full bg-[#07071A]/40 backdrop-blur-3xl z-10 ${isMobileChatOpen ? 'hidden lg:flex' : 'flex'}`}>
           <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bebas tracking-[3px] text-white uppercase">Inbox</h1>
                  <p className="font-mono text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">4 Unread Conversations</p>
                </div>
                <div className="w-10 h-10 rounded-xl glass-elevated border border-white/5 flex items-center justify-center hover:border-primary/40 transition-all cursor-pointer group">
                   <Filter className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>

              <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                 <input 
                  placeholder="SEARCH MESSAGES..." 
                  className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-xl pl-12 pr-4 text-[10px] font-mono font-bold tracking-widest focus:outline-none focus:border-primary/40 transition-all placeholder:text-muted-foreground/30" 
                 />
              </div>
              
              <div className="flex gap-1 glass-elevated p-1 rounded-xl border border-white/5 scrollbar-none">
                 {(['dms', 'brands', 'comments', 'templates'] as Tab[]).map(t => (
                   <button 
                    key={t} 
                    onClick={() => setActiveTab(t)}
                    className={`flex-1 py-2.5 px-2 rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest transition-all ${
                      activeTab === t ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-white hover:bg-white/5'
                    }`}
                   >
                      {t === 'dms' ? 'Chat' : t === 'brands' ? 'Deals' : t === 'comments' ? 'Feed' : 'Assets'}
                   </button>
                 ))}
              </div>
           </div>

           <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex-1 overflow-y-auto no-scrollbar px-6 pb-12 space-y-2"
           >
              {activeTab === 'comments' ? (
                <div className="space-y-4">
                   {comments.map(c => (
                      <motion.div 
                        key={c.id} 
                        variants={staggerItem}
                        className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer space-y-4 group relative overflow-hidden"
                      >
                         <div className="flex justify-between items-start relative z-10">
                            <div className="flex items-center gap-3">
                               <div className="w-9 h-9 rounded-xl glass-elevated flex items-center justify-center font-mono text-xs text-primary border border-primary/20">{c.user[0]}</div>
                               <div>
                                  <span className="text-[11px] font-syne font-bold block text-white">{c.user}</span>
                                  <span className="text-[8px] font-mono font-bold text-muted-foreground uppercase opacity-60 tracking-wider">ON {c.post}</span>
                                </div>
                            </div>
                            <span className="font-mono text-[9px] font-bold text-muted-foreground uppercase">{c.time}</span>
                         </div>
                         <p className="font-syne text-[12px] font-medium leading-relaxed text-white/70 group-hover:text-white transition-colors">"{c.text}"</p>
                         <div className="flex items-center justify-between pt-2">
                            <span className={`font-mono text-[8px] font-bold uppercase px-3 py-1 rounded-full border ${
                              c.type === 'Spam' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-success/10 text-success border-success/20'
                            }`}>{c.type}</span>
                            <button className="h-8 px-5 rounded-xl glass-elevated text-primary text-[9px] font-mono font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2 border border-primary/20">
                               <Sparkles className="w-3 h-3" /> AI Respond
                            </button>
                         </div>
                      </motion.div>
                   ))}
                </div>
              ) : (
                <div className="space-y-1">
                   {chats.filter(c => activeTab === 'brands' ? c.type === 'brands' : c.type === 'dms').map(chat => (
                      <motion.div 
                        key={chat.id} 
                        variants={staggerItem}
                        onClick={() => handleChatSelect(chat.id)}
                        className={`p-5 rounded-2xl flex items-center gap-4 transition-all cursor-pointer border ${
                          selectedId === chat.id ? 'bg-white/[0.05] border-white/10 shadow-2xl' : 'bg-transparent border-transparent hover:bg-white/[0.02]'
                        }`}
                      >
                         <div className="relative shrink-0">
                            <div className={`w-14 h-14 rounded-2xl ${chat.color} flex items-center justify-center text-white font-bebas text-2xl shadow-xl border border-white/10`}>
                               {chat.avatar}
                            </div>
                            {chat.brand && (
                              <div className="absolute -top-1 -right-1 p-1 bg-amber-400 rounded-lg shadow-lg border-2 border-[#07071A]">
                                 <Star className="w-2.5 h-2.5 text-white fill-white" />
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-[#07071A] shadow-lg" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                               <h4 className="font-syne font-bold text-[13px] text-white tracking-tight">{chat.name}</h4>
                               <span className="font-mono text-[9px] font-bold text-muted-foreground">{chat.time}</span>
                            </div>
                            <div className="flex justify-between items-center gap-3">
                               <p className={`text-[11px] truncate font-syne ${chat.unread > 0 ? 'text-white font-bold' : 'text-muted-foreground'}`}>
                                  {chat.last}
                               </p>
                               {chat.unread > 0 && (
                                 <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary text-white shadow-lg shadow-primary/20">{chat.unread}</span>
                               )}
                            </div>
                         </div>
                      </motion.div>
                   ))}
                </div>
              )}
           </motion.div>
        </div>

        {/* RIGHT — CONVERSATION PANE (Glass Elevated Area) */}
        <div className={`flex-1 flex flex-col h-full bg-white/[0.02] relative overflow-hidden backdrop-blur-3xl ${isMobileChatOpen ? 'flex' : 'hidden lg:flex'}`}>
           {/* HEADER */}
           <div className="h-24 border-b border-white/5 bg-[#07071A]/40 backdrop-blur-2xl flex items-center px-10 justify-between z-10">
              <div className="flex items-center gap-5">
                 <button 
                  onClick={() => setIsMobileChatOpen(false)}
                  className="lg:hidden p-3 glass-elevated rounded-xl hover:bg-white/10 transition-all border border-white/5"
                 >
                    <ChevronLeft className="w-5 h-5 text-white" />
                 </button>
                 <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white font-bebas text-2xl shadow-2xl">N</div>
                 <div className="min-w-0">
                    <h3 className="text-xl font-bebas tracking-[1px] text-white flex items-center gap-2 truncate">
                       Nike PR Team
                       <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                       <p className="font-mono text-[9px] font-bold text-success uppercase tracking-widest flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Verified Partner
                       </p>
                       <span className="w-1 h-1 rounded-full bg-white/10" />
                       <p className="font-mono text-[9px] font-bold text-muted-foreground uppercase">Response: 42m</p>
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <button className="hidden sm:flex h-11 px-6 rounded-xl glass-elevated border border-white/5 hover:bg-white/5 transition-all text-[10px] font-mono font-bold uppercase tracking-widest items-center gap-3 text-white">
                    <Clock className="w-4 h-4 text-primary" /> Deal Board
                 </button>
                 <div className="w-11 h-11 rounded-xl glass-elevated border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all cursor-pointer group">
                    <MoreHorizontal className="w-5 h-5 text-muted-foreground group-hover:text-white" />
                 </div>
              </div>
           </div>

           {/* AI TOOLBAR — PREDICTIVE (Elevated Bar) */}
           <div className="bg-primary/5 py-4 px-10 flex items-center gap-8 border-b border-white/5 overflow-x-auto no-scrollbar scroll-smooth">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-primary whitespace-nowrap flex items-center gap-3 shrink-0">
                 <Sparkles className="w-4 h-4 drop-shadow-[0_0_8px_rgba(255,107,171,0.5)]" /> AI Strategist
              </span>
              <div className="flex gap-3">
                 {[
                   { label: 'Craft Response', icon: Wand2, primary: true },
                   { label: 'Audit Contract', icon: ShieldCheck },
                   { label: 'Pricing Engine', icon: Target },
                   { label: 'Next Actions', icon: ChevronRight },
                 ].map(tool => (
                    <button 
                     key={tool.label}
                     onClick={() => tool.label === 'Craft Response' && setShowAiSuggest(true)}
                     className={`h-10 px-6 rounded-xl text-[9px] font-mono font-bold uppercase tracking-widest flex items-center gap-3 transition-all whitespace-nowrap ${
                       tool.primary ? 'bg-primary text-white shadow-[0_0_20px_-5px_hsl(var(--primary))]' : 'glass-elevated border border-white/5 text-white/70 hover:text-white hover:bg-white/5'
                     }`}
                    >
                       <tool.icon className="w-3.5 h-3.5" />
                       {tool.label}
                    </button>
                 ))}
              </div>
           </div>

           {/* MESSAGE VIEW (Space-y-12 for flow) */}
           <div className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar relative">
              <div className="sticky top-0 z-0 flex flex-col items-center justify-center py-8 opacity-10 pointer-events-none">
                 <div className="px-6 py-1.5 rounded-full glass-elevated border border-white/5 text-[8px] font-mono font-bold uppercase tracking-[0.4em] text-white">SECURE BUSINESS TUNNEL</div>
              </div>

              {/* MESSAGES */}
              <div className="flex items-start gap-5">
                 <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white font-bebas text-xl shadow-2xl shrink-0">N</div>
                 <div className="max-w-[70%] space-y-3">
                    <div className="glass-card border border-white/5 p-6 rounded-[2.5rem] rounded-tl-none shadow-sm group hover:border-white/10 transition-colors">
                       <p className="font-syne text-[15px] font-medium leading-[1.6] text-white/90">
                          Hi Jack! Your latest <span className="text-primary font-bold">"Minimal Desk"</span> series performed exceptionally. We're interested in a <span className="text-secondary font-bold">4-week exclusive partnership</span> for the upcoming Tech Pack rollout. Would a Tuesday briefing work?
                       </p>
                    </div>
                    <span className="font-mono text-[9px] font-bold uppercase text-muted-foreground/50 pl-2 tracking-widest flex items-center gap-2">10:42 — SENT FROM HQ</span>
                 </div>
              </div>

              <div className="flex items-start gap-5 flex-row-reverse">
                 <div className="w-12 h-12 rounded-2xl bg-primary shadow-[0_0_30px_-5px_hsl(var(--primary))] flex items-center justify-center text-white font-bebas text-xl shrink-0">ME</div>
                 <div className="max-w-[70%] space-y-3 text-right">
                    <div className="bg-primary p-6 rounded-[2.5rem] rounded-tr-none shadow-2xl shadow-primary/20">
                       <p className="font-syne text-[15px] font-bold leading-[1.6] text-white">
                          Hey Nike Team! The Tech Pack looks incredible. Tuesday works perfectly for me. Should I prepare a preliminary moodboard for the Reels?
                       </p>
                    </div>
                    <span className="font-mono text-[9px] font-bold uppercase text-primary pr-2 tracking-widest flex items-center justify-end gap-2"><CheckCircle2 className="w-3 h-3" /> READ</span>
                 </div>
              </div>

              <AnimatePresence>
                 {showAiSuggest && (
                    <motion.div 
                      initial={{ opacity: 0, y: 100, scale: 0.9 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }} 
                      exit={{ opacity: 0, y: 100, scale: 0.9 }} 
                      className="p-10 glass-elevated border border-primary/30 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] space-y-8 backdrop-blur-3xl relative overflow-hidden group"
                    >
                       <div className="absolute top-[-30%] right-[-20%] p-10 text-primary opacity-5 group-hover:opacity-10 transition-opacity">
                          <Sparkles className="w-80 h-80 rotate-12" />
                       </div>
                       <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-5">
                             <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl"><Sparkles className="w-7 h-7" /></div>
                             <div>
                                <h3 className="text-xl font-bebas tracking-widest text-white">AI Response Engineering</h3>
                                <p className="font-mono text-[9px] font-bold text-muted-foreground uppercase mt-1">Tone: Professional x Collaborative</p>
                             </div>
                          </div>
                          <button onClick={() => setShowAiSuggest(false)} className="w-10 h-10 glass-elevated rounded-xl flex items-center justify-center hover:bg-rose-500/10 hover:text-rose-500 transition-all border border-white/5"><Trash2 className="w-4 h-4" /></button>
                       </div>
                       <div className="p-8 bg-black/40 border border-white/5 rounded-[2rem] italic font-syne text-lg leading-relaxed text-white/90 shadow-inner">
                          "Absolutely. I'll have the <span className="text-primary font-bold">preliminary moodboard</span> ready by Monday evening. I've also spotted some viral audio patterns that would fit the 'Speed' aesthetic of the Tech Pack perfectly. Looking forward to it!"
                       </div>
                       <div className="flex gap-4 relative z-10">
                          <button className="flex-1 h-14 bg-primary text-white rounded-2xl font-mono text-[10px] font-bold uppercase tracking-[2px] shadow-xl hover:shadow-primary/30 active:scale-95 transition-all">Execute Response</button>
                          <button className="h-14 px-8 glass-elevated border border-white/5 rounded-2xl font-mono text-[10px] font-bold uppercase tracking-[2px] text-white hover:bg-white/5 transition-all">Refine Tone</button>
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>

           {/* INPUT AREA (Premium Glass) */}
           <div className="p-10 bg-[#07071A]/40 backdrop-blur-3xl border-t border-white/5">
              <div className="max-w-5xl mx-auto flex items-end gap-6 h-auto">
                 <div className="flex-1 h-16 bg-white/[0.02] border border-white/5 rounded-[2rem] px-8 flex items-center relative overflow-hidden group focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20 shadow-2xl transition-all">
                    <input 
                      placeholder="MESSAGE NIKE PR TEAM..." 
                      className="w-full bg-transparent focus:outline-none font-mono text-[11px] font-bold tracking-widest text-white placeholder:text-muted-foreground/20" 
                    />
                    <div className="flex items-center gap-6 text-muted-foreground/30 ml-4">
                       <Paperclip className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
                       <Smile className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
                    </div>
                 </div>
                 <button className="h-16 w-32 bg-primary text-white rounded-[2rem] shadow-[0_0_30px_-5px_hsl(var(--primary))] hover:shadow-primary/40 hover:scale-[1.05] active:scale-95 flex items-center justify-center transition-all group overflow-hidden">
                    <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </PageTransition>
  );
};

// Dummy icons since some were missing or renamed
const HistoryIcon = ({ className }: { className?: string }) => <Clock className={className} />;
const IndianRupee = ({ className }: { className?: string }) => <span className={className}>₹</span>;
