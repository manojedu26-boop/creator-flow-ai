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
      <div className="w-[380px] border-r border-border/30 flex flex-col h-full bg-card/10">
         <div className="p-8 space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
               Messages
            </h2>
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <input placeholder="Search conversations..." className="w-full h-12 bg-muted/10 border border-border/40 rounded-2xl pl-10 pr-4 text-xs focus:outline-none" />
            </div>
            
            <div className="flex gap-1 bg-muted/10 p-1 rounded-2xl border border-border/40 overflow-x-auto no-scrollbar">
               {(['dms', 'brands', 'comments', 'templates'] as Tab[]).map(t => (
                 <button 
                  key={t} 
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === t ? 'bg-background shadow-md' : 'text-muted-foreground hover:text-foreground'
                  }`}
                 >
                    {t === 'dms' ? 'Network' : t === 'brands' ? 'Brands' : t === 'comments' ? 'Comments' : 'Templates'}
                 </button>
               ))}
            </div>
         </div>

         <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-10">
            {activeTab === 'comments' ? (
              <div className="space-y-3">
                 {comments.map(c => (
                    <div key={c.id} className="p-5 rounded-3xl border border-border/40 bg-card hover:border-primary/40 transition-all cursor-pointer space-y-3 shadow-sm">
                       <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-black text-[10px]">{c.user[0].toUpperCase()}</div>
                             <span className="text-xs font-black">{c.user}</span>
                          </div>
                          <span className="text-[9px] font-bold text-muted-foreground">{c.time}</span>
                       </div>
                       <p className="text-[11px] font-medium leading-relaxed italic opacity-80">"{c.text}"</p>
                       <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                            c.type === 'Spam' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          }`}>{c.type}</span>
                          <button className="text-[9px] font-black text-primary uppercase hover:underline">Draft Reply</button>
                       </div>
                    </div>
                 ))}
              </div>
            ) : (
              <div className="space-y-1">
                 {chats.filter(c => activeTab === 'brands' ? c.type === 'brands' : c.type === 'dms').map(chat => (
                    <div 
                      key={chat.id} 
                      onClick={() => setSelectedId(chat.id)}
                      className={`p-5 rounded-3xl flex items-center gap-4 transition-all cursor-pointer group ${
                        selectedId === chat.id ? 'bg-card border border-primary/20 shadow-xl' : 'hover:bg-muted/10'
                      }`}
                    >
                       <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-lg">
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
                             <h4 className="font-black text-sm truncate">{chat.name}</h4>
                             <span className="text-[9px] font-bold text-muted-foreground">{chat.time}</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <p className="text-[11px] text-muted-foreground truncate font-medium">
                                {chat.last}
                             </p>
                             {chat.unread > 0 && (
                               <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[9px] font-black text-white">{chat.unread}</span>
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
      <div className="flex-1 flex flex-col h-full bg-muted/5 relative overflow-hidden">
         {/* AI TOOLBAR */}
         <div className="h-16 border-b border-border/30 bg-background flex items-center px-8 gap-4 shadow-sm z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 mr-4">
               <Sparkles className="w-4 h-4" /> AI Toolbar
            </span>
            <div className="flex gap-2 h-9">
               {[
                 { label: 'Suggest Reply', icon: Wand2, primary: true },
                 { label: 'Formal Tone', icon: ShieldCheck },
                 { label: 'Casual Tone', icon: Type },
                 { label: 'Write Pitch', icon: FileText },
               ].map(tool => (
                 <button 
                  key={tool.label}
                  onClick={() => tool.label === 'Suggest Reply' && setShowAiSuggest(true)}
                  className={`px-4 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border transition-all ${
                    tool.primary ? 'bg-primary text-white border-primary shadow-lg hover:scale-105' : 'bg-background border-border/40 hover:border-primary/40'
                  }`}
                 >
                    <tool.icon className="w-3.5 h-3.5" />
                    <span className="hidden lg:block">{tool.label}</span>
                 </button>
               ))}
            </div>
         </div>

         {/* MESSAGE VIEW */}
         <div className="flex-1 overflow-y-auto p-12 space-y-8 no-scrollbar">
            <div className="flex flex-col items-center justify-center py-10 opacity-30">
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Encrypted Connection Active</span>
               <div className="h-px w-20 bg-border mt-4" />
            </div>

            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-xl bg-muted" />
               <div className="max-w-[70%] space-y-2">
                  <div className="bg-card border border-border/40 p-5 rounded-[2rem] rounded-tl-none shadow-sm">
                     <p className="text-sm font-medium leading-relaxed">
                        Hi Jack! We loved your recent video on "Desk Setup Minimal". We'd love to partner with you for our upcoming Spring collection. Are you free for a quick sync next week?
                     </p>
                  </div>
                  <span className="text-[9px] font-black uppercase text-muted-foreground pl-2">Yesterday, 4:12 PM</span>
               </div>
            </div>

            <div className="flex items-start gap-4 flex-row-reverse">
               <div className="w-10 h-10 rounded-xl bg-primary" />
               <div className="max-w-[70%] space-y-2 text-right">
                  <div className="bg-primary text-primary-foreground p-5 rounded-[2rem] rounded-tr-none shadow-xl">
                     <p className="text-sm font-medium leading-relaxed">
                        Hey team! Thanks for reaching out. I'd love to chat. Would Wednesday at 2 PM IST work for you?
                     </p>
                  </div>
                  <span className="text-[9px] font-black uppercase text-muted-foreground pr-2">Today, 9:30 AM</span>
               </div>
            </div>
            
            <AnimatePresence>
               {showAiSuggest && (
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="p-8 bg-card border border-primary/30 rounded-[2.5rem] shadow-2xl space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-primary/10 rounded-lg text-primary"><Sparkles className="w-4 h-4" /></div>
                           <div>
                              <h3 className="text-xs font-black uppercase tracking-tight">AI Suggested Reply</h3>
                              <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">Tone: Professional yet Creative</p>
                           </div>
                        </div>
                        <button onClick={() => setShowAiSuggest(false)} className="p-2 hover:bg-muted rounded-full transition-all"><Trash2 className="w-4 h-4 text-muted-foreground" /></button>
                     </div>
                     <div className="p-6 bg-muted/5 border border-border/20 rounded-2xl italic text-[13px] font-medium leading-relaxed text-foreground/80">
                        "I've looked into the Spring collection and it aligns perfectly with my current aesthetic. Wednesday at 2 PM IST works great. I'll share my media kit before then. Looking forward!"
                     </div>
                     <div className="flex gap-3">
                        <button className="flex-1 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all">Apply to Input</button>
                        <button className="px-6 py-3 border border-border/40 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all">Regenerate</button>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* INPUT AREA */}
         <div className="p-8 bg-background border-t border-border/30">
            <div className="max-w-4xl mx-auto flex items-end gap-6 h-20">
               <div className="flex-1 h-full bg-muted/10 border border-border/40 rounded-[1.5rem] px-8 flex items-center relative overflow-hidden group hover:border-primary/40 transition-all">
                  <input placeholder="Type a message..." className="w-full bg-transparent focus:outline-none text-sm font-medium" />
                  <div className="absolute right-6 flex items-center gap-4">
                     <Hash className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary transition-all" />
                     <CornerUpLeft className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary transition-all" />
                  </div>
               </div>
               <button className="h-full w-20 bg-primary text-white rounded-[1.5rem] shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center transition-all group">
                  <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
