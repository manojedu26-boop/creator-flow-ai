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
import { EmptyState } from "../../components/shared/EmptyState";
import { useEffect } from "react";

type Tab = 'dms' | 'brands' | 'comments' | 'templates';

export const Messages = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dms');
  const [selectedId, setSelectedId] = useState<string>('1');
  const [showAiSuggest, setShowAiSuggest] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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
      <div className="flex h-[calc(100vh-140px)] lg:h-[calc(100vh-140px)] -mx-4 md:-mx-8 -my-6 overflow-hidden bg-background/50 relative">
        {/* BACKGROUND ACCENTS */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

        {/* LEFT — INBOX LIST */}
        <div className={`w-full lg:w-[400px] border-r border-border/10 flex-col h-full bg-card/20 backdrop-blur-3xl z-10 ${isMobileChatOpen ? 'hidden lg:flex' : 'flex'}`}>
           <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                   Inbox
                   <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black border border-primary/20">LIVE</span>
                </h2>
                <div className="w-10 h-10 rounded-xl bg-muted/20 border border-border/40 flex items-center justify-center hover:bg-primary/10 hover:border-primary/40 transition-all cursor-pointer">
                   <Filter className="w-4 h-4" />
                </div>
              </div>

              <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                 <input 
                  placeholder="Search conversations..." 
                  className="w-full h-14 bg-background/40 border border-border/40 rounded-2xl pl-12 pr-4 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-muted-foreground/50" 
                 />
              </div>
              
              <div className="flex gap-1 bg-muted/10 p-1.5 rounded-2xl border border-border/10 overflow-x-auto no-scrollbar">
                 {(['dms', 'brands', 'comments', 'templates'] as Tab[]).map(t => (
                   <button 
                    key={t} 
                    onClick={() => setActiveTab(t)}
                    className={`flex-1 py-3 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                      activeTab === t ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' : 'text-muted-foreground hover:text-foreground'
                    }`}
                   >
                      {t === 'dms' ? 'Network' : t === 'brands' ? 'Brands' : t === 'comments' ? 'Audience' : 'Asset'}
                   </button>
                 ))}
              </div>
           </div>

           <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex-1 overflow-y-auto no-scrollbar px-4 pb-10 space-y-1"
           >
              {activeTab === 'comments' ? (
                <div className="space-y-4 px-2">
                   {isLoading ? (
                     Array(3).fill(0).map((_, i) => <div key={i} className="h-24 w-full rounded-[2.5rem] bg-muted/10 animate-pulse" />)
                   ) : comments.length > 0 ? (
                     comments.map(c => (
                        <motion.div 
                          key={c.id} 
                          variants={staggerItem}
                          className="p-5 rounded-[2.5rem] border border-border/10 bg-card/30 backdrop-blur-md hover:border-primary/40 transition-all cursor-pointer space-y-4 shadow-sm hover:shadow-2xl group relative overflow-hidden"
                        >
                           {/* ... comment card content ... */}
                           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                              <MessageSquare className="w-12 h-12" />
                           </div>
                           <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                 <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-black text-[10px] text-primary">{c.user[0].toUpperCase()}</div>
                                 <div>
                                    <span className="text-xs font-black block">{c.user}</span>
                                    <span className="text-[8px] font-bold text-muted-foreground uppercase">{c.post}</span>
                                 </div>
                              </div>
                              <span className="text-[9px] font-bold text-muted-foreground bg-muted/20 px-2 py-0.5 rounded-md">{c.time} ago</span>
                           </div>
                           <p className="text-[12px] font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity text-muted-foreground group-hover:text-foreground">"{c.text}"</p>
                           <div className="flex items-center justify-between pt-2">
                              <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full border ${
                                c.type === 'Spam' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              }`}>{c.type}</span>
                              <button className="h-8 px-4 rounded-xl bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2">
                                 <Sparkles className="w-3 h-3" /> AI Reply
                              </button>
                           </div>
                        </motion.div>
                     ))
                   ) : (
                     <EmptyState 
                       icon={MessageSquare} 
                       title="No comments yet" 
                       description="When your audience starts talking, they'll show up here." 
                     />
                   )}
                </div>
              ) : (
                <div className="space-y-2 px-2">
                   {chats.filter(c => activeTab === 'brands' ? c.type === 'brands' : c.type === 'dms').map(chat => (
                      <motion.div 
                        key={chat.id} 
                        variants={staggerItem}
                        onClick={() => handleChatSelect(chat.id)}
                        className={`p-5 rounded-[2.5rem] flex items-center gap-4 transition-all cursor-pointer border ${
                          selectedId === chat.id ? 'bg-card border-primary/40 shadow-2xl scale-[1.02] z-10' : 'bg-transparent border-transparent hover:bg-muted/10'
                        }`}
                      >
                         <div className="relative shrink-0">
                            <div className={`w-14 h-14 rounded-2xl ${chat.color} flex items-center justify-center text-white font-black text-xl shadow-lg border border-white/10 group-hover:scale-105 transition-transform`}>
                               {chat.avatar}
                            </div>
                            {chat.brand && (
                              <div className="absolute -top-1 -right-1 p-1 bg-amber-400 rounded-full shadow-lg border-2 border-background">
                                 <Star className="w-3 h-3 text-white fill-white" />
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background shadow-lg" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                               <h4 className="font-black text-[13px] truncate uppercase tracking-tight">{chat.name}</h4>
                               <span className="text-[9px] font-bold text-muted-foreground">{chat.time}</span>
                            </div>
                            <div className="flex justify-between items-center gap-3">
                               <p className={`text-[11px] truncate font-medium flex-1 ${chat.unread > 0 ? 'text-foreground font-black' : 'text-muted-foreground'}`}>
                                  {chat.last}
                               </p>
                               {chat.unread > 0 && (
                                 <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[9px] font-black text-white shadow-lg shadow-primary/20 shrink-0">{chat.unread}</span>
                               )}
                            </div>
                         </div>
                      </motion.div>
                   ))}
                </div>
              )}
           </motion.div>
        </div>

        {/* RIGHT — CONVERSATION PANE */}
        <div className={`flex-1 flex flex-col h-full bg-transparent relative overflow-hidden backdrop-blur-md ${isMobileChatOpen ? 'flex' : 'hidden lg:flex'}`}>
           {/* HEADER */}
           <div className="h-20 border-b border-border/10 bg-card/30 backdrop-blur-3xl flex items-center px-6 lg:px-10 justify-between z-10">
              <div className="flex items-center gap-4">
                 <button 
                  onClick={() => setIsMobileChatOpen(false)}
                  className="lg:hidden p-2 hover:bg-muted/50 rounded-lg transition-all"
                 >
                    <ChevronLeft className="w-5 h-5" />
                 </button>
                 <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-black shrink-0">N</div>
                 <div className="min-w-0">
                    <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2 truncate">
                       Nike PR Team
                       <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    </h3>
                    <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1 truncate">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Always Responds in 2h
                    </p>
                 </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                 <button className="hidden sm:flex h-10 px-5 rounded-xl border border-border/40 hover:bg-muted/30 transition-all text-[10px] font-black uppercase tracking-widest items-center gap-2">
                    <Clock className="w-4 h-4" /> Deal History
                 </button>
                 <div className="w-10 h-10 rounded-xl bg-muted/20 border border-border/40 flex items-center justify-center hover:bg-muted/40 transition-all cursor-pointer">
                    <MoreHorizontal className="w-5 h-5" />
                 </div>
              </div>
           </div>

           {/* AI TOOLBAR — DYNAMIC INSIGHTS */}
           <div className="bg-primary/5 py-4 px-6 lg:px-10 flex items-center gap-6 border-b border-border/10 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary whitespace-nowrap flex items-center gap-2 shrink-0">
                 <Sparkles className="w-4 h-4" /> AI Co-Pilot
              </span>
              <div className="flex gap-2">
                 {[
                   { label: 'Reply', icon: Wand2, primary: true },
                   { label: 'Contract', icon: ShieldCheck },
                   { label: 'Pricing', icon: Target },
                   { label: 'Next Steps', icon: ChevronRight },
                 ].map(tool => (
                   <button 
                    key={tool.label}
                    onClick={() => tool.label === 'Reply' && setShowAiSuggest(true)}
                    className={`h-9 px-4 lg:px-5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border transition-all whitespace-nowrap ${
                      tool.primary ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-background/50 border-border/40 hover:bg-muted/50'
                    }`}
                   >
                      <tool.icon className="w-3.5 h-3.5" />
                      {tool.label}
                   </button>
                 ))}
              </div>
           </div>

           {/* MESSAGE VIEW */}
           <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 no-scrollbar relative">
              <div className="sticky top-0 z-0 flex flex-col items-center justify-center py-6 opacity-20 pointer-events-none">
                 <div className="px-4 py-1 rounded-full border border-border/40 bg-background text-[8px] font-black uppercase tracking-[0.3em]">Encrypted Connection</div>
                 <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary/40 to-transparent mt-4" />
              </div>

              {/* MESSAGES */}
              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-zinc-900 border border-border/40 flex items-center justify-center text-white font-black text-xs md:text-lg shadow-xl shrink-0">N</div>
                 <div className="max-w-[85%] md:max-w-[65%] space-y-2">
                    <div className="bg-card/40 backdrop-blur-xl border border-border/40 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] rounded-tl-none shadow-sm hover:shadow-2xl transition-all group">
                       <p className="text-sm md:text-md font-medium leading-relaxed">
                          Hi Jack! We reached out because your <span className="text-primary font-bold">"Desk Setup Minimal"</span> video hit massive numbers. We'd love to partner for our Spring 2026 tech line. Are you free to discuss a 3-post reel series?
                       </p>
                    </div>
                    <span className="text-[9px] font-black uppercase text-muted-foreground pl-4 flex items-center gap-2">10:42 AM <Clock className="w-3 h-3" /></span>
                 </div>
              </div>

              <div className="flex items-start gap-4 flex-row-reverse">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary border border-primary/40 flex items-center justify-center text-white text-xs md:text-md font-black uppercase tracking-widest shadow-2xl shadow-primary/30 shrink-0">ME</div>
                 <div className="max-w-[85%] md:max-w-[65%] space-y-2 text-right">
                    <div className="bg-primary text-primary-foreground p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] rounded-tr-none shadow-2xl shadow-primary/20">
                       <p className="text-sm md:text-md font-black leading-relaxed">
                          Hey team! I'm a huge fan of the brand. That series sounds perfect for my audience. I'm definitely interested. When were you thinking of starting?
                       </p>
                    </div>
                    <span className="text-[9px] font-black uppercase text-primary pr-4 flex items-center justify-end gap-1"><CheckCircle2 className="w-3 h-3" /> Read</span>
                 </div>
              </div>

              <AnimatePresence>
                 {showAiSuggest && (
                    <motion.div 
                      initial={{ opacity: 0, y: 50, scale: 0.95 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }} 
                      exit={{ opacity: 0, y: 50, scale: 0.95 }} 
                      className="p-6 md:p-10 bg-primary/10 border border-primary/20 rounded-[2rem] md:rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] space-y-6 md:space-y-8 backdrop-blur-2xl relative overflow-hidden ring-1 ring-primary/30"
                    >
                       <div className="absolute top-[-20%] right-[-10%] p-8 text-primary opacity-5 animate-pulse-slow">
                          <Sparkles className="w-32 md:w-64 h-32 md:h-64" />
                       </div>
                       <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-3 md:gap-4">
                             <div className="p-3 md:p-4 bg-primary text-white rounded-xl md:rounded-2xl shadow-xl shadow-primary/20"><Sparkles className="w-5 h-5 md:w-6 md:h-6" /></div>
                             <div>
                                <h3 className="text-sm md:text-md font-black uppercase tracking-tighter">AI Reply Blueprint</h3>
                                <p className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase opacity-70">Focus: Upselling & Creative Input</p>
                             </div>
                          </div>
                          <button onClick={() => setShowAiSuggest(false)} className="w-8 h-8 md:w-10 md:h-10 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-all flex items-center justify-center"><Trash2 className="w-4 h-4 md:w-5 md:h-5" /></button>
                       </div>
                       <div className="p-4 md:p-8 bg-background/60 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] italic text-xs md:text-[16px] font-medium leading-relaxed text-foreground shadow-inner">
                          "I've checked our timeline and I have a perfect slot in early April. I suggest we include a <span className="text-primary font-black">YouTube integration</span> as well for deeper engagement, as my tech audience spans both platforms. Happy to jump on a call Wednesday?"
                       </div>
                       <div className="flex gap-3 md:gap-4 relative z-10">
                          <button className="flex-1 h-12 md:h-14 bg-primary text-white rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-primary/30 active:scale-95 transition-all">Apply Reply</button>
                          <button className="h-12 md:h-14 px-4 md:px-8 bg-background/50 border border-border/40 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:bg-muted transition-all flex items-center gap-2">
                             <Wand2 className="w-4 h-4" /> Try Casual
                          </button>
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>

           {/* INPUT AREA */}
           <div className="p-6 md:p-10 bg-card/40 backdrop-blur-3xl border-t border-border/10">
              <div className="max-w-4xl mx-auto flex items-end gap-3 md:gap-6 h-auto">
                 <div className="flex-1 h-14 md:h-16 bg-background/50 border border-border/40 rounded-[1.5rem] md:rounded-[2.5rem] px-5 md:px-10 flex items-center relative overflow-hidden group focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-sm hover:border-primary/50 transition-all">
                    <input 
                      placeholder="Type a reply..." 
                      className="w-full bg-transparent focus:outline-none text-xs md:text-sm font-bold placeholder:text-muted-foreground/30" 
                    />
                    <div className="flex items-center gap-3 md:gap-6 text-muted-foreground/50">
                       <Paperclip className="hidden sm:block w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
                       <Smile className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
                    </div>
                 </div>
                 <button className="h-14 w-14 md:h-16 md:w-24 bg-primary text-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-3xl shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-95 flex items-center justify-center transition-all group relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <Send className="w-5 h-5 md:w-6 md:h-6 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
