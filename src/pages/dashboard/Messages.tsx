import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Search, Star, MessageSquare, Send, Sparkles, ShieldCheck, Clock,
  MoreHorizontal, ChevronRight, Filter, CheckCircle2, Trash2,
  Wand2, Smile, Paperclip, ChevronLeft, Target, X, Check,
  CheckCheck, Loader2, DollarSign, HandshakeIcon, Lightbulb
} from "lucide-react";
import { PageTransition, staggerItem } from "../../components/shared/MotionComponents";
import { EmptyState } from "../../components/shared/EmptyState";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "../../components/ui/sonner";
import { db } from "../../lib/db";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "../../lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────
type Tab = "dms" | "brands" | "comments";
type MessageStatus = "sending" | "sent" | "read";

interface Message {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
  status?: MessageStatus;
  type?: "text" | "collab";
  collabData?: CollabRequest;
}

interface CollabRequest {
  summary: string;
  idea: string;
  rate: string;
  status: "pending" | "accepted" | "declined" | "countered";
}

interface Chat {
  id: string;
  name: string;
  last: string;
  time: string;
  unread: number;
  brand: boolean;
  type: "dms" | "brands";
  avatar: string;
  color: string;
  verified?: boolean;
  online?: boolean;
}

// ─── AI Reply generation (simulated) ────────────────────────────────────────
const AI_REPLIES: Record<string, string> = {
  "1": "Hey Nike team! I've checked my content calendar and I have a perfect window in early April — perfect timing for a Spring campaign. I'd love to include a YouTube integration as well since my fitness audience skews 60% YouTube. Happy to jump on a 15-min call Wednesday to lock in the details?",
  "2": "Hey Sarah! Love the idea of a travel collab — your aesthetic would pair so well with my audience's vibe. I'm thinking we could do a joint Reel where we each show our top 3 hidden spots. Want to jam on this over a DM call this week?",
  "3": "Hi Adobe team, super excited to officially be on board. I'll start reviewing the creative brief and have my first content concept ready by Friday. Would it work to have a quick onboarding call early next week?",
  "4": "Yo Alex! That audio is 🔥🔥 — the bass drop at the 8-second mark is perfect for a transition reel. Already scheming a concept around it. Let's collab on this one together?",
};

// ─── Conversations ──────────────────────────────────────────────────────────
const INITIAL_MESSAGES: Record<string, Message[]> = {
  "1": [
    { id: "m1", from: "them", text: "Hi! We reached out because your \"Desk Setup Minimal\" video hit massive numbers. We'd love to partner for our Spring 2026 tech line. Are you free to discuss a 3-post reel series?", time: "10:42 AM", status: "read" },
    { id: "m2", from: "me", text: "Hey team! I'm a huge fan of the brand. That series sounds perfect for my audience. I'm definitely interested. When were you thinking of starting?", time: "10:48 AM", status: "read" },
    { id: "m3", from: "them", text: "Looking forward to the Reel drafting! We're targeting early April launch. Budget is ₹60,000 for the full series. Does that work for you?", time: "11:10 AM", status: "read" },
  ],
  "2": [
    { id: "m4", from: "them", text: "Hey! Would love to collab on the next travel series. My Mumbai → Goa content did 2M views last month — think our audiences overlap perfectly 🙌", time: "Yesterday", status: "read" },
    {
      id: "m5", from: "them", text: "", time: "Yesterday",
      type: "collab",
      collabData: {
        summary: "Joint Travel Series: Mumbai → Goa",
        idea: "3-part Reel series: each creator shows their POV of the same journey. Cross-post on both channels.",
        rate: "Rev share: 50/50 on brand deals from crossover content",
        status: "pending",
      }
    },
  ],
  "3": [
    { id: "m6", from: "them", text: "Your contract has been approved. Welcome aboard! Please check your email for the signed PDF and onboarding docs.", time: "2 days ago", status: "read" },
    { id: "m7", from: "me", text: "Amazing! So excited to be part of Adobe's creator family. I'll review everything and get back by Friday.", time: "2 days ago", status: "read" },
  ],
  "4": [
    { id: "m8", from: "them", text: "Yo, check this audio out 🔥 It's trending big on TikTok right now. Used it on my last video and hit 800K views in 24h.", time: "Mon", status: "read" },
  ],
};

const CHATS: Chat[] = [
  { id: "1", name: "Nike PR Team", last: "Looking forward to the Reel drafting!", time: "10:42 AM", unread: 2, brand: true, type: "brands", avatar: "N", color: "bg-zinc-900", verified: true, online: true },
  { id: "2", name: "Sarah Chen", last: "Hey! Would love to collab on the next travel series.", time: "Yesterday", unread: 0, brand: false, type: "dms", avatar: "S", color: "bg-indigo-500", online: true },
  { id: "3", name: "Adobe Creative", last: "Your contract has been approved.", time: "2 days ago", unread: 0, brand: true, type: "brands", avatar: "A", color: "bg-rose-600", verified: true, online: false },
  { id: "4", name: "Alex Rivera", last: "Yo, check this audio out 🔥", time: "Mon", unread: 5, brand: false, type: "dms", avatar: "R", color: "bg-emerald-500", online: true },
];

const COMMENTS = [
  { id: "c1", post: "New Desk Setup", user: "coder_pro", text: "Where did you get that monitor arm?", time: "2h", type: "Question", sentiment: "Positive" },
  { id: "c2", post: "Travel Vlog", user: "wanderlust_kk", text: "This lighting is incredible! What gear are you using?", time: "5h", type: "Comment", sentiment: "Positive" },
  { id: "c3", post: "New Desk Setup", user: "spam_bot99", text: "Check bio for free cash!!!", time: "10h", type: "Spam", sentiment: "Negative" },
];

export const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>("brands");
  const [selectedId, setSelectedId] = useState<string>("1");
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [chats, setChats] = useState<Chat[]>(CHATS);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const userInitials = user?.name?.split(" ").map(n => n[0]).join("") || "ME";
  const selectedChat = chats.find(c => c.id === selectedId);
  const currentMessages = messages[selectedId] || [];

  useEffect(() => {
    const convId = searchParams.get("conv");
    if (convId) { setSelectedId(convId); setIsMobileChatOpen(true); }
  }, [searchParams]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedId]);

  useEffect(() => {
    setChats(prev => prev.map(c => c.id === selectedId ? { ...c, unread: 0 } : c));
  }, [selectedId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const incomingMsg: Message = {
        id: `auto_${Date.now()}`,
        from: "them",
        text: [
          "Just checking in — any updates on the brief?",
          "The campaign timeline has been updated. Please review! 📋",
          "We loved your last post by the way — very on brand 🙌",
        ][Math.floor(Math.random() * 3)],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "sent",
      };
      setMessages(prev => ({
        ...prev,
        "1": [...(prev["1"] || []), incomingMsg],
      }));
      setChats(prev => prev.map(c =>
        c.id === "1" && selectedId !== "1"
          ? { ...c, unread: c.unread + 1, last: incomingMsg.text, time: "Just now" }
          : c
      ));
      if (selectedId !== "1") {
        toast.info("New message from Nike PR Team", {
          description: incomingMsg.text,
          action: { label: "Open", onClick: () => { setSelectedId("1"); setIsMobileChatOpen(true); } }
        });
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [selectedId]);

  const handleSend = () => {
    if (!replyText.trim()) return;
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      from: "me",
      text: replyText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sending",
    };
    setMessages(prev => ({ ...prev, [selectedId]: [...(prev[selectedId] || []), newMsg] }));
    setChats(prev => prev.map(c => c.id === selectedId ? { ...c, last: replyText.trim(), time: "Just now" } : c));
    setReplyText("");

    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedId]: prev[selectedId].map(m => m.id === newMsg.id ? { ...m, status: "sent" } : m),
      }));
    }, 600);
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedId]: prev[selectedId].map(m => m.id === newMsg.id ? { ...m, status: "read" } : m),
      }));
    }, 2000);
  };

  const handleAiSuggest = async () => {
    setIsAiGenerating(true);
    setReplyText("");
    await new Promise(r => setTimeout(r, 1800));
    const suggestion = AI_REPLIES[selectedId] || "I appreciate your message! Let me get back to you with a detailed response shortly.";
    let i = 0;
    const interval = setInterval(() => {
      setReplyText(suggestion.slice(0, i));
      i += 3;
      if (i > suggestion.length) {
        setReplyText(suggestion);
        clearInterval(interval);
        setIsAiGenerating(false);
        inputRef.current?.focus();
        toast.success("AI response optimized!", { description: "Ready for your review." });
      }
    }, 20);
  };

  const handleCollabAction = (chatId: string, msgId: string, action: "accepted" | "declined" | "countered") => {
    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId].map(m =>
        m.id === msgId && m.collabData ? { ...m, collabData: { ...m.collabData, status: action } } : m
      ),
    }));
    if (action === "accepted") {
      toast.success("Connection Established! 🎉", { description: "Deal details synced to hub." });
      navigate("/deals");
    } else if (action === "declined") {
      toast.info("Request Archived", { description: "Formal notification sent." });
    } else {
      toast.info("AI Countering...", { description: "Terms recalibrating." });
    }
  };

  const filteredChats = chats.filter(c => {
    const matchTab = activeTab === "brands" ? c.type === "brands" : c.type === "dms";
    const matchSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <PageTransition>
      <div className="flex h-[calc(100vh-var(--header-h)-var(--bottom-nav-h)-2.5rem)] -mx-[var(--page-px)] -mt-4 overflow-hidden bg-white relative">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className={cn(
          "w-full lg:w-[400px] border-r border-slate-200 flex flex-col h-full bg-white z-10 shrink-0 shadow-sm transition-all",
          isMobileChatOpen ? "hidden lg:flex" : "flex"
        )}>
          <div className="p-6 md:p-8 space-y-6 border-b border-slate-50 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 flex items-center gap-3">
                Signal <span className="text-blue-600">Sync</span>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[8px] font-black border border-blue-100 uppercase tracking-widest">Live Network</span>
              </h2>
              <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer shadow-sm">
                <Filter className="w-4 h-4" />
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                placeholder="Query network or branding..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-14 bg-slate-50 border border-slate-50 rounded-[1.5rem] pl-12 pr-4 text-xs font-black uppercase tracking-tight focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all shadow-inner placeholder:text-slate-400"
              />
            </div>

            <div className="flex gap-1 bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-100 shadow-inner">
              {(["brands", "dms", "comments"] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 py-3 rounded-2xl text-[8px] font-black uppercase tracking-[0.15em] transition-all ${
                    activeTab === t ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900"
                  }`}
                >
                  {t === "dms" ? "Creator" : t === "brands" ? "Corporate" : "Audience"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar py-2">
            {activeTab === "comments" ? (
              <div className="space-y-4 px-5">
                {COMMENTS.map(c => (
                  <div key={c.id} className="p-6 rounded-[2rem] border border-slate-100 bg-white hover:border-blue-200 transition-all cursor-pointer space-y-4 shadow-sm group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-[11px] border border-blue-100 shadow-sm">{c.user[0].toUpperCase()}</div>
                        <div>
                          <span className="text-xs font-black block text-slate-900 uppercase tracking-tighter">{c.user}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{c.post}</span>
                        </div>
                      </div>
                      <span className={cn(
                        "text-[8px] font-black uppercase px-2.5 py-1 rounded-full border shadow-sm",
                        c.type === "Spam" ? "bg-rose-50 text-rose-500 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                      )}>{c.type}</span>
                    </div>
                    <p className="text-[12px] text-slate-500 leading-relaxed font-medium">"{c.text}"</p>
                    <button className="w-full h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all flex items-center justify-center gap-2">
                       AI Smart Reply
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 px-5">
                {filteredChats.length === 0 ? (
                  <EmptyState icon={MessageSquare} title="No sessions found" description="Connect with elite creators via the Network." />
                ) : (
                  filteredChats.map(chat => (
                    <motion.div
                      key={chat.id}
                      onClick={() => { setSelectedId(chat.id); setIsMobileChatOpen(true); }}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "p-5 rounded-[2.5rem] flex items-center gap-4 cursor-pointer border transition-all",
                        selectedId === chat.id ? "bg-blue-50 border-blue-200 shadow-md transform scale-[1.02]" : "border-transparent bg-white hover:bg-slate-50 hover:border-slate-100"
                      )}
                    >
                      <div className="relative shrink-0">
                        <div className={cn("w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-white font-black text-xl shadow-lg border border-white/20", chat.color)}>{chat.avatar}</div>
                        {chat.brand && (
                          <div className="absolute -top-1 -right-1 p-1 bg-amber-400 rounded-lg shadow-lg border-2 border-white">
                            <Star className="w-3 h-3 text-white fill-white" />
                          </div>
                        )}
                        {chat.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className={cn("font-black text-sm truncate uppercase tracking-tighter flex items-center gap-2", selectedId === chat.id ? 'text-blue-600' : 'text-slate-900')}>
                            {chat.name}
                            {chat.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                          </h4>
                          <span className="text-[10px] font-black text-slate-400 shrink-0 uppercase tracking-widest">{chat.time}</span>
                        </div>
                        <div className="flex justify-between items-center gap-3">
                          <p className={`text-[11px] truncate flex-1 font-medium ${chat.unread > 0 ? "text-slate-900 font-black" : "text-slate-500"}`}>{chat.last}</p>
                          {chat.unread > 0 && (
                            <span className="h-5 px-2 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-black text-white shrink-0 shadow-lg shadow-blue-500/20">{chat.unread}</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className={cn(
          "flex-1 flex flex-col h-full bg-transparent relative overflow-hidden",
          isMobileChatOpen ? "flex" : "hidden lg:flex"
        )}>
          <div className="h-[80px] border-b border-slate-200 bg-white flex items-center px-6 lg:px-10 justify-between z-10 shrink-0 shadow-sm">
            <div className="flex items-center gap-5">
              <button onClick={() => setIsMobileChatOpen(false)} className="lg:hidden p-3 hover:bg-slate-50 rounded-2xl transition-all">
                <ChevronLeft className="w-6 h-6 text-slate-900" />
              </button>
              <div className={cn("w-11 h-11 rounded-[1.25rem] flex items-center justify-center text-white font-black shrink-0 shadow-md", selectedChat?.color || "bg-slate-900")}>
                {selectedChat?.avatar}
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tighter text-slate-900 flex items-center gap-2">
                  {selectedChat?.name}
                  {selectedChat?.verified && <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />}
                </h3>
                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  {selectedChat?.online ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" /> Negotiating Live</> : <span className="text-slate-400">Offline Intelligence</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden sm:flex h-11 px-6 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all text-[10px] font-black uppercase tracking-[0.2em] items-center gap-3 shadow-sm">
                 Campaign Ledger
              </button>
              <button className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer shadow-sm text-slate-400">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-blue-50/80 py-4 px-6 lg:px-10 flex items-center gap-6 border-b border-blue-100/50 backdrop-blur-md overflow-x-auto no-scrollbar shrink-0 shadow-inner">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 whitespace-nowrap flex items-center gap-3 shrink-0">
               Decision Engine
            </span>
            <div className="flex gap-4">
              {[
                { label: "AI Drafting", icon: Sparkles, primary: true, action: handleAiSuggest },
                { label: "Protection", icon: ShieldCheck, action: () => navigate("/contracts") },
                { label: "Market Rates", icon: DollarSign, action: () => toast.info("Analyzing market parity...") },
                { label: "Strategies", icon: Lightbulb, action: () => toast.info("Strategizing next response...") },
              ].map(tool => (
                <button
                  key={tool.label}
                  onClick={tool.action}
                  disabled={isAiGenerating && tool.primary}
                  className={`h-10 px-5 rounded-[1.25rem] text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2.5 border transition-all whitespace-nowrap disabled:opacity-60 shadow-sm ${
                    tool.primary ? "bg-blue-600 text-white border-blue-600 shadow-blue-500/10 hover:bg-blue-700 active:scale-[0.98]" : "bg-white border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600"
                  }`}
                >
                  {isAiGenerating && tool.primary ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <tool.icon className="w-3.5 h-3.5" />}
                  {isAiGenerating && tool.primary ? "Simulating..." : tool.label}
                </button>
              ))}
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-14 space-y-10 no-scrollbar bg-slate-50/30">
            <div className="flex flex-col items-center py-6 opacity-20 pointer-events-none select-none">
              <div className="px-6 py-1.5 rounded-full border border-slate-200 bg-white text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 shadow-sm">Verified Corporate Session</div>
              <div className="h-px w-48 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent mt-4" />
            </div>

            {currentMessages.map(msg => (
              <div key={msg.id}>
                {msg.type === "collab" && msg.collabData ? (
                  <CollabCard
                    data={msg.collabData}
                    onAccept={() => handleCollabAction(selectedId, msg.id, "accepted")}
                    onDecline={() => handleCollabAction(selectedId, msg.id, "declined")}
                    onCounter={() => handleCollabAction(selectedId, msg.id, "countered")}
                  />
                ) : (
                  <div className={cn("flex items-end gap-5", msg.from === "me" ? "flex-row-reverse" : "")}>
                    <div className={cn(
                      "w-10 h-10 rounded-[1.25rem] flex items-center justify-center text-white font-black text-[11px] shrink-0 border border-white/20 shadow-md",
                      msg.from === "me" ? "bg-blue-600" : `${selectedChat?.color || "bg-slate-900"}`
                    )}>
                      {msg.from === "me" ? userInitials : selectedChat?.avatar}
                    </div>
                    <div className={cn("max-w-[75%] space-y-2 flex flex-col", msg.from === "me" ? "items-end" : "items-start")}>
                      <div className={cn(
                        "px-7 py-5 rounded-[2.5rem] text-[15px] leading-relaxed font-bold shadow-sm transition-all relative overflow-hidden group/bubble",
                        msg.from === "me"
                          ? "bg-blue-600 text-white rounded-br-none shadow-blue-500/10"
                          : "bg-white border border-slate-100 text-slate-800 rounded-bl-none"
                      )}>
                        {msg.from === "me" && (
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[20px] rounded-full pointer-events-none" />
                        )}
                        {msg.text}
                      </div>
                      <div className={cn("flex items-center gap-2 px-4", msg.from === "me" ? "flex-row-reverse" : "")}>
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">{msg.time}</span>
                        {msg.from === "me" && msg.status && (
                          <span className="text-[10px]">
                            {msg.status === "sending" && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-300" />}
                            {msg.status === "sent" && <Check className="w-3.5 h-3.5 text-slate-300" />}
                            {msg.status === "read" && <CheckCheck className="w-3.5 h-3.5 text-blue-600" />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-6 md:p-8 bg-white border-t border-slate-200 shrink-0 shadow-2xl">
            <div className="flex items-center gap-5">
              <div className={cn(
                  "flex-1 h-16 bg-slate-50 border rounded-3xl px-8 flex items-center gap-4 transition-all shadow-inner",
                  isAiGenerating ? "border-blue-600 bg-blue-50 shadow-blue-500/5 shadow-inner-2xl" : "border-slate-100 focus-within:border-blue-600 focus-within:bg-white focus-within:shadow-xl"
              )}>
                <input
                  ref={inputRef}
                  placeholder={isAiGenerating ? "AI is processing optimal strategy response..." : "Type strategy message..."}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                  disabled={isAiGenerating}
                  className="flex-1 bg-transparent focus:outline-none text-[13px] font-black text-slate-900 placeholder:text-slate-400 disabled:opacity-50 tracking-tight"
                />
                <div className="flex items-center gap-5 text-slate-300 border-l border-slate-100 pl-5 ml-2">
                  <Paperclip className="hidden sm:block w-5 h-5 hover:text-blue-600 transition-colors cursor-pointer" />
                  <Smile className="w-5 h-5 hover:text-blue-600 transition-colors cursor-pointer" />
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={!replyText.trim() || isAiGenerating}
                className="w-16 h-16 bg-slate-900 text-white rounded-3xl shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all flex items-center justify-center group disabled:opacity-40 shrink-0 active:scale-95"
              >
                <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

// ── Collab Request Card ──────────────────────────────────────────────────────
const CollabCard = ({
  data, onAccept, onDecline, onCounter
}: {
  data: CollabRequest;
  onAccept: () => void;
  onDecline: () => void;
  onCounter: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    className="border border-blue-200 bg-white rounded-[2.5rem] p-8 space-y-6 max-w-lg shadow-sm"
  >
    <div className="flex items-center gap-4">
      <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-inner">
        <HandshakeIcon className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">Dynamic Collaboration</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{data.summary}</p>
      </div>
    </div>

    <div className="space-y-4 text-[13px] text-slate-600">
      <div className="flex gap-4"><span className="text-slate-400 font-black uppercase tracking-widest text-[9px] w-16 shrink-0 pt-1">Strategy:</span> <span className="font-semibold">{data.idea}</span></div>
      <div className="flex gap-4"><span className="text-slate-400 font-black uppercase tracking-widest text-[9px] w-16 shrink-0 pt-1">Proposed:</span> <span className="text-emerald-600 font-black uppercase tracking-tight text-base">{data.rate}</span></div>
    </div>

    {data.status === "pending" ? (
      <div className="flex gap-3 pt-4">
        <button onClick={onAccept} className="flex-1 h-14 rounded-2xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/10 hover:bg-emerald-700 transition-all active:scale-[0.98]">
           Confirm Collab
        </button>
        <button onClick={onCounter} className="flex-1 h-14 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-500/10 hover:bg-blue-600 transition-all active:scale-[0.98]">
           AI Counter
        </button>
        <button onClick={onDecline} className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-100 flex items-center justify-center transition-all shadow-sm">
           <Trash2 className="w-5 h-5" />
        </button>
      </div>
    ) : (
      <div className={cn(
        "h-12 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm",
        data.status === "accepted" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
        data.status === "declined" ? "bg-rose-50 text-rose-500 border-rose-100" :
        "bg-amber-50 text-amber-600 border-amber-100"
      )}>
        {data.status === "accepted" ? "✓ Request Executed — hub updated" : data.status === "declined" ? "✗ Request Archived" : "Counter-Proposal Synced"}
      </div>
    )}
  </motion.div>
);
