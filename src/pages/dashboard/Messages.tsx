import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Star, MessageSquare, Send, 
  Sparkles, ShieldCheck, Mail, Clock, 
  MoreHorizontal, ChevronRight, User,
  Instagram, Youtube, Filter, Hash,
  CheckCircle2, AlertCircle, Trash2,
  FileText, CornerUpLeft, Wand2, Type
} from "lucide-react";

type Tab = 'dms' | 'brands' | 'comments' | 'templates';

export const Messages = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dms');
  const [selectedId, setSelectedId] = useState<string>('1');
  const [showAiSuggest, setShowAiSuggest] = useState(false);

  const chats = [
    { id: '1', name: 'Nike PR Team', last: 'Looking forward to the Reel drafting!', time: '10:42 AM', unread: 2, brand: true, type: 'brands' },
    { id: '2', name: 'Sarah Chen', last: 'Hey! Would love to collab on the...', time: 'Yesterday', unread: 0, brand: false, type: 'dms' },
    { id: '3', name: 'Adobe Creative', last: 'Your contract has been approved.', time: '2 days ago', unread: 0, brand: true, type: 'brands' },
    { id: '4', name: 'Alex Rivera', last: 'Yo, check this audio out 🔥', time: 'Mon', unread: 5, brand: false, type: 'dms' },
  ];

  const comments = [
    { id: 'c1', post: 'New Desk Setup', user: 'coder_pro', text: 'Where did you get that monitor arm?', time: '2h', type: 'Question', sentiment: 'Positive' },
    { id: 'c2', post: 'Travel Vlog', user: 'wanderlust', text: 'This lighting is incredible!', time: '5h', type: 'Comment', sentiment: 'Positive' },
    { id: 'c3', post: 'New Desk Setup', user: 'spam_bot', text: 'Check bio for free cash!!', time: '10h', type: 'Spam', sentiment: 'Negative' },
  ];

  return (
    <div className="flex h-[calc(100vh-140px)] -mx-8 -my-6 overflow-hidden bg-background">
      {/* LEFT — INBOX LIST */}
      <div className="w-[380px] border-r border-border/30 flex flex-col h-full bg-card/10 backdrop-blur-md">
         <div className="p-8 space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
               Messages
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
               <input placeholder="Search conversations..." className="w-full h-12 bg-muted/20 border border-border/20 rounded-2xl pl-10 pr-4 text-xs focus:outline-none focus:border-primary/50 transition-all" />
            </div>
            
            <div className="flex gap-1 bg-muted/20 p-1.5 rounded-2xl border border-border/20 overflow-x-auto no-scrollbar">
               {(['dms', 'brands', 'comments', 'templates'] as Tab[]).map(t => (
                 <button 
                  key={t} 
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === t ? 'bg-background shadow-lg text-primary scale-105' : 'text-muted-foreground hover:text-foreground'
                  }`}
                 >
                    {t === 'dms' ? 'Network' : t === 'brands' ? 'Brands' : t === 'comments' ? 'Comments' : 'Templates'}
                 </button>
               ))}
            </div>
         </div>

         <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-10 space-y-1">
            {activeTab === 'comments' ? (
              <div className="space-y-4 px-2">
                 {comments.map(c => (
                    <div key={c.id} className="p-5 rounded-[2rem] border border-border/20 bg-card/40 backdrop-blur-sm hover:border-primary/40 transition-all cursor-pointer space-y-3 shadow-sm hover:shadow-xl hover:-translate-y-1 group">
                       <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-black text-[10px] text-primary">{c.user[0].toUpperCase()}</div>
                             <span className="text-xs font-black">{c.user}</span>
                          </div>
                          <span className="text-[9px] font-bold text-muted-foreground">{c.time}</span>
                       </div>
                       <p className="text-[11px] font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity whitespace-pre-wrap text-muted-foreground group-hover:text-foreground">"{c.text}"</p>
                       <div className="flex items-center justify-between pt-2">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                            c.type === 'Spam' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          }`}>{c.type}</span>
                          <button className="text-[9px] font-black text-primary uppercase hover:underline flex items-center gap-1">
                             <Sparkles className="w-3 h-3" /> AI Reply
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
            ) : (
              <div className="space-y-2 px-2">
                 {chats.filter(c => activeTab === 'brands' ? c.type === 'brands' : c.type === 'dms').map(chat => (
                    <div 
                      key={chat.id} 
                      onClick={() => setSelectedId(chat.id)}
                      className={`p-5 rounded-[2rem] flex items-center gap-4 transition-all cursor-pointer border ${
                        selectedId === chat.id ? 'bg-card border-primary/30 shadow-2xl scale-[1.02] z-10' : 'bg-transparent border-transparent hover:bg-muted/10'
                      }`}
                    >
                       <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-indigo-400 font-black text-lg">
                             {chat.name[0]}
                          </div>
                          {chat.brand && (
                            <div className="absolute -top-1 -right-1 p-1 bg-amber-400 rounded-full shadow-lg">
                               <Star className="w-3 h-3 text-white fill-white" />
                            </div>
                          )}
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                             <h4 className="font-black text-sm truncate uppercase tracking-tight">{chat.name}</h4>
                             <span className="text-[9px] font-bold text-muted-foreground">{chat.time}</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <p className={`text-[11px] truncate font-medium ${chat.unread > 0 ? 'text-foreground font-black' : 'text-muted-foreground'}`}>
                                {chat.last}
                             </p>
                             {chat.unread > 0 && (
                               <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[9px] font-black text-white shadow-lg shadow-primary/20">{chat.unread}</span>
                             )}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
            )}
         </div>
      </div>

      {/* RIGHT — CONVERSATION PANE */}
      <div className="flex-1 flex flex-col h-full bg-card/5 backdrop-blur-3xl relative overflow-hidden">
         {/* AI TOOLBAR */}
         <div className="h-16 border-b border-border/30 bg-background/50 backdrop-blur-md flex items-center px-8 gap-4 shadow-sm z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 mr-4">
               <Sparkles className="w-4 h-4 animate-spin-slow" /> AI Strategy
            </span>
            <div className="flex gap-2 h-9">
               {[
                 { label: 'Suggest Reply', icon: Wand2, primary: true },
                 { label: 'Formal Tone', icon: ShieldCheck },
                 { label: 'Casual Tone', icon: Type },
                 { label: 'Write Pitch', icon: FileText },
               ].map(tool => (
                 <motion.button 
                  key={tool.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => tool.label === 'Suggest Reply' && setShowAiSuggest(true)}
                  className={`px-4 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border transition-all ${
                    tool.primary ? 'bg-primary text-white border-primary shadow-[0_0_20px_-5px_hsl(var(--primary))]' : 'bg-background border-border/40 hover:border-primary/40'
                  }`}
                 >
                    <tool.icon className="w-3.5 h-3.5" />
                    <span className="hidden lg:block">{tool.label}</span>
                 </motion.button>
               ))}
            </div>
         </div>

         {/* MESSAGE VIEW */}
         <div className="flex-1 overflow-y-auto p-12 space-y-8 no-scrollbar scroll-smooth">
            <div className="flex flex-col items-center justify-center py-10 opacity-30 select-none">
               <span className="text-[10px] font-black uppercase tracking-[0.5em]">Secure Business Connection</span>
               <div className="h-px w-24 bg-primary/40 mt-4" />
            </div>

            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-2xl bg-muted/20 border border-border/40 flex items-center justify-center text-xs font-black">N</div>
               <div className="max-w-[70%] space-y-2">
                  <div className="bg-card/50 backdrop-blur-md border border-border/40 p-6 rounded-[2.5rem] rounded-tl-none shadow-sm hover:shadow-xl transition-shadow">
                     <p className="text-sm font-medium leading-relaxed">
                        Hi Jack! We loved your recent video on "Desk Setup Minimal". We'd love to partner with you for our upcoming Spring collection. Are you free for a quick sync next week?
                     </p>
                  </div>
                  <span className="text-[9px] font-black uppercase text-muted-foreground pl-4">Yesterday, 4:12 PM • Delivered</span>
               </div>
            </div>

            <div className="flex items-start gap-4 flex-row-reverse">
               <div className="w-10 h-10 rounded-2xl bg-primary border border-primary/40 flex items-center justify-center text-white text-xs font-black uppercase tracking-tighter shadow-lg shadow-primary/20">ME</div>
               <div className="max-w-[70%] space-y-2 text-right">
                  <div className="bg-primary text-primary-foreground p-6 rounded-[2.5rem] rounded-tr-none shadow-[0_20px_40px_-15px_hsl(var(--primary))]">
                     <p className="text-sm font-black leading-relaxed">
                        Hey team! Thanks for reaching out. I'd love to chat. Would Wednesday at 2 PM IST work for you?
                     </p>
                  </div>
                  <span className="text-[9px] font-black uppercase text-muted-foreground pr-4 italic flex items-center justify-end gap-1">
                     <CheckCircle2 className="w-3 h-3 text-primary" /> Read by Nike
                  </span>
               </div>
            </div>

            <div className="flex items-center gap-2 text-primary opacity-60 px-4">
               <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Nike is typing</span>
               <div className="flex gap-1">
                  {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
               </div>
            </div>
            
            <AnimatePresence>
               {showAiSuggest && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 30 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.9, y: 30 }} 
                    className="p-10 bg-primary/10 border border-primary/30 rounded-[3rem] shadow-3xl space-y-8 backdrop-blur-xl relative overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 p-8 text-primary opacity-10 pointer-events-none">
                        <Sparkles className="w-24 h-24" />
                     </div>
                     <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-primary text-white rounded-2xl shadow-lg animate-pulse"><Sparkles className="w-5 h-5" /></div>
                           <div>
                              <h3 className="text-sm font-black uppercase tracking-tighter">AI Success Blueprint</h3>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Tone: Strategic & Professional</p>
                           </div>
                        </div>
                        <button onClick={() => setShowAiSuggest(false)} className="p-3 hover:bg-muted/20 rounded-2xl transition-all group"><Trash2 className="w-5 h-5 text-muted-foreground group-hover:text-rose-500 transition-colors" /></button>
                     </div>
                     <div className="p-8 bg-background/50 border border-white/10 rounded-[2rem] italic text-[15px] font-medium leading-relaxed text-foreground shadow-sm">
                        "I've looked into the Spring collection and it aligns perfectly with my current aesthetic. Wednesday at 2 PM IST works great. I'll share my media kit before then. Looking forward!"
                     </div>
                     <div className="flex gap-4 relative z-10">
                        <button className="flex-1 py-4 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20">Apply to Input</button>
                        <button className="px-8 py-4 bg-background/40 border border-border/40 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-muted transition-all flex items-center gap-2">
                           <Wand2 className="w-4 h-4" /> Regenerate
                        </button>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* INPUT AREA */}
         <div className="p-8 bg-background/50 backdrop-blur-lg border-t border-border/30">
            <div className="max-w-4xl mx-auto flex items-end gap-6 h-22">
               <div className="flex-1 h-full bg-muted/10 border border-border/40 rounded-[2rem] px-8 flex items-center relative overflow-hidden group hover:border-primary/40 focus-within:border-primary/40 focus-within:bg-muted/5 transition-all">
                  <input placeholder="Compose a world-class reply..." className="w-full bg-transparent focus:outline-none text-sm font-bold placeholder:text-muted-foreground/50" />
                  <div className="absolute right-8 flex items-center gap-6">
                     <button title="Hashtag Suggestion" className="p-2 hover:text-primary transition-colors"><Hash className="w-5 h-5 text-muted-foreground/60" /></button>
                     <button title="Undo last AI" className="p-2 hover:text-primary transition-colors"><CornerUpLeft className="w-5 h-5 text-muted-foreground/60" /></button>
                  </div>
               </div>
               <button className="h-full w-24 bg-primary text-white rounded-[2rem] shadow-[0_20px_40px_-10px_hsl(var(--primary))] hover:shadow-[0_25px_50px_-12px_hsl(var(--primary))] hover:scale-105 active:scale-95 flex items-center justify-center transition-all group overflow-hidden relative">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <Send className="w-7 h-7 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
