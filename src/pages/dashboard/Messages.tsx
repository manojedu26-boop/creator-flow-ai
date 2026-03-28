import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Star, MessageSquare, Send, Sparkles, ShieldCheck, Clock,
  MoreHorizontal, ChevronRight, Filter, CheckCircle2, Trash2,
  Wand2, Smile, Paperclip, ChevronLeft, Target, X, Check,
  CheckCheck, Loader2, UserPlus, DollarSign, HandshakeIcon
} from "lucide-react";
import { PageTransition, staggerContainer, staggerItem } from "../../components/shared/MotionComponents";
import { EmptyState } from "../../components/shared/EmptyState";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "../../components/ui/sonner";
import { db } from "../../lib/db";
import { useNavigate, useSearchParams } from "react-router-dom";

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

// ─── Component ──────────────────────────────────────────────────────────────
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

  // Deep-link: open specific conversation from URL param
  useEffect(() => {
    const convId = searchParams.get("conv");
    if (convId) { setSelectedId(convId); setIsMobileChatOpen(true); }
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedId]);

  // Mark as read when chat opened — clear unread badge
  useEffect(() => {
    setChats(prev => prev.map(c => c.id === selectedId ? { ...c, unread: 0 } : c));
  }, [selectedId]);

  // Simulate incoming message every 30s
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
        db.insert("notifications", {
          id: `notif_msg_${Date.now()}`,
          title: "New Message from Nike PR Team",
          body: incomingMsg.text,
          type: "message", time: "Just now", read: false, link: "/messages?conv=1"
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

    // Optimistic → sent → read transition
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
    // Typewriter effect
    let i = 0;
    const interval = setInterval(() => {
      setReplyText(suggestion.slice(0, i));
      i += 3;
      if (i > suggestion.length) {
        setReplyText(suggestion);
        clearInterval(interval);
        setIsAiGenerating(false);
        inputRef.current?.focus();
        toast.success("AI reply generated!", { description: "Edit it before sending." });
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
      toast.success("Collab Accepted! 🎉", { description: "A draft deal has been created in your Brand Deals hub." });
      navigate("/deals");
    } else if (action === "declined") {
      toast.info("Collab Declined", { description: "A polite decline has been sent automatically." });
    } else {
      toast.info("Counter-Propose sent!", { description: "Your modified terms have been sent back." });
    }
  };

  const filteredChats = chats.filter(c => {
    const matchTab = activeTab === "brands" ? c.type === "brands" : c.type === "dms";
    const matchSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <PageTransition>
      <div className="flex h-[calc(100vh-140px)] -mx-4 md:-mx-8 -my-6 overflow-hidden bg-background/50 relative">
        {/* BG accents */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

        {/* ══════════ LEFT — INBOX ══════════ */}
        <div className={`w-full lg:w-[380px] border-r border-white/5 flex-col h-full bg-black/30 backdrop-blur-3xl z-10 shrink-0 ${isMobileChatOpen ? "hidden lg:flex" : "flex"}`}>
          <div className="p-5 md:p-6 space-y-4 border-b border-white/5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                Inbox
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black border border-primary/20 animate-pulse">LIVE</span>
              </h2>
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-all cursor-pointer">
                <Filter className="w-4 h-4" />
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-zinc-600"
              />
            </div>

            <div className="flex gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
              {(["brands", "dms", "comments"] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    activeTab === t ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {t === "dms" ? "Network" : t === "brands" ? "Brands" : "Audience"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar py-2">
            {activeTab === "comments" ? (
              <div className="space-y-2 px-3">
                {COMMENTS.map(c => (
                  <div key={c.id} className="p-4 rounded-3xl border border-white/5 bg-white/[0.03] hover:border-primary/30 transition-all cursor-pointer space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-[10px]">{c.user[0].toUpperCase()}</div>
                        <div>
                          <span className="text-xs font-black block">{c.user}</span>
                          <span className="text-[9px] font-bold text-zinc-500 uppercase">{c.post}</span>
                        </div>
                      </div>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${c.type === "Spam" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>{c.type}</span>
                    </div>
                    <p className="text-[12px] text-zinc-400 leading-relaxed">"{c.text}"</p>
                    <button className="w-full h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
                      <Sparkles className="w-3 h-3" /> AI Reply
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1 px-3">
                {filteredChats.length === 0 ? (
                  <EmptyState icon={MessageSquare} title="No conversations" description="Start a new conversation from the Creator Network." />
                ) : (
                  filteredChats.map(chat => (
                    <motion.div
                      key={chat.id}
                      onClick={() => { setSelectedId(chat.id); setIsMobileChatOpen(true); }}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-3xl flex items-center gap-3 cursor-pointer border transition-all ${
                        selectedId === chat.id ? "bg-white/[0.07] border-primary/30 shadow-lg" : "border-transparent hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className={`w-12 h-12 rounded-2xl ${chat.color} flex items-center justify-center text-white font-black text-lg shadow-lg border border-white/10`}>{chat.avatar}</div>
                        {chat.brand && (
                          <div className="absolute -top-1 -right-1 p-0.5 bg-amber-400 rounded-full shadow-lg border-2 border-black">
                            <Star className="w-2.5 h-2.5 text-white fill-white" />
                          </div>
                        )}
                        {chat.online && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-black" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <h4 className="font-black text-[13px] truncate uppercase tracking-tight flex items-center gap-1.5">
                            {chat.name}
                            {chat.verified && <CheckCircle2 className="w-3 h-3 text-blue-400 shrink-0" />}
                          </h4>
                          <span className="text-[9px] font-bold text-zinc-500 shrink-0">{chat.time}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <p className={`text-[11px] truncate flex-1 ${chat.unread > 0 ? "text-white font-black" : "text-zinc-500 font-medium"}`}>{chat.last}</p>
                          {chat.unread > 0 && (
                            <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[9px] font-black text-white shrink-0">{chat.unread}</span>
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

        {/* ══════════ RIGHT — CONVERSATION ══════════ */}
        <div className={`flex-1 flex flex-col h-full bg-transparent relative overflow-hidden ${isMobileChatOpen ? "flex" : "hidden lg:flex"}`}>
          {/* Chat header */}
          <div className="h-[68px] border-b border-white/5 bg-black/40 backdrop-blur-3xl flex items-center px-4 lg:px-6 justify-between z-10 shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsMobileChatOpen(false)} className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className={`w-9 h-9 rounded-2xl ${selectedChat?.color || "bg-zinc-800"} flex items-center justify-center text-white font-black shrink-0`}>
                {selectedChat?.avatar}
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-1.5">
                  {selectedChat?.name}
                  {selectedChat?.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                </h3>
                <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
                  {selectedChat?.online ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online now</> : <span className="text-zinc-500">Offline</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="hidden sm:flex h-9 px-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Deal History
              </button>
              <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Co-Pilot toolbar */}
          <div className="bg-primary/5 py-3 px-4 lg:px-6 flex items-center gap-4 border-b border-white/5 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary whitespace-nowrap flex items-center gap-1.5 shrink-0">
              <Sparkles className="w-3.5 h-3.5" /> AI Co-Pilot
            </span>
            <div className="flex gap-2">
              {[
                { label: "Suggest Reply", icon: Wand2, primary: true, action: handleAiSuggest },
                { label: "Contract", icon: ShieldCheck, action: () => navigate("/contracts") },
                { label: "Pricing", icon: Target, action: () => toast.info("Opening rate calculator...") },
                { label: "Next Steps", icon: ChevronRight, action: () => toast.info("AI analyzing conversation...") },
              ].map(tool => (
                <button
                  key={tool.label}
                  onClick={tool.action}
                  disabled={isAiGenerating && tool.primary}
                  className={`h-8 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border transition-all whitespace-nowrap disabled:opacity-60 ${
                    tool.primary ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 hover:scale-[1.02]" : "bg-black/30 border-white/10 hover:bg-white/5"
                  }`}
                >
                  {isAiGenerating && tool.primary ? <Loader2 className="w-3 h-3 animate-spin" /> : <tool.icon className="w-3 h-3" />}
                  {isAiGenerating && tool.primary ? "Generating..." : tool.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 no-scrollbar">
            <div className="flex flex-col items-center py-4 opacity-30 pointer-events-none select-none">
              <div className="px-4 py-1 rounded-full border border-white/20 bg-black text-[8px] font-black uppercase tracking-widest">End-to-End Encrypted</div>
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary/40 to-transparent mt-3" />
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
                  <div className={`flex items-end gap-3 ${msg.from === "me" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-2xl flex items-center justify-center text-white font-black text-[10px] shrink-0 ${msg.from === "me" ? "bg-primary shadow-lg shadow-primary/30" : `${selectedChat?.color || "bg-zinc-800"}`}`}>
                      {msg.from === "me" ? userInitials : selectedChat?.avatar}
                    </div>
                    <div className={`max-w-[75%] space-y-1 ${msg.from === "me" ? "items-end" : "items-start"} flex flex-col`}>
                      <div className={`px-5 py-3.5 rounded-3xl text-[13px] leading-relaxed font-medium ${
                        msg.from === "me"
                          ? "bg-primary text-white rounded-br-sm shadow-lg shadow-primary/20"
                          : "bg-white/[0.07] border border-white/10 rounded-bl-sm"
                      }`}>
                        {msg.text}
                      </div>
                      <div className={`flex items-center gap-1 px-1 ${msg.from === "me" ? "flex-row-reverse" : ""}`}>
                        <span className="text-[9px] font-black uppercase text-zinc-600">{msg.time}</span>
                        {msg.from === "me" && msg.status && (
                          <span className="text-[9px]">
                            {msg.status === "sending" && <Loader2 className="w-3 h-3 animate-spin text-zinc-600" />}
                            {msg.status === "sent" && <Check className="w-3 h-3 text-zinc-500" />}
                            {msg.status === "read" && <CheckCheck className="w-3 h-3 text-primary" />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input area */}
          <div className="p-4 md:p-6 bg-black/40 backdrop-blur-3xl border-t border-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <div className={`flex-1 h-14 bg-white/5 border rounded-3xl px-5 flex items-center gap-3 transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 ${isAiGenerating ? "border-primary/40 bg-primary/5" : "border-white/10"}`}>
                <input
                  ref={inputRef}
                  placeholder={isAiGenerating ? "AI is thinking..." : "Type a reply... (Enter to send)"}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                  disabled={isAiGenerating}
                  className="flex-1 bg-transparent focus:outline-none text-sm font-medium placeholder:text-zinc-600 disabled:opacity-50"
                />
                <div className="flex items-center gap-3 text-zinc-600">
                  <Paperclip className="hidden sm:block w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                  <Smile className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={!replyText.trim() || isAiGenerating}
                className="w-14 h-14 bg-primary text-white rounded-3xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 flex items-center justify-center transition-all group disabled:opacity-40 disabled:scale-100 shrink-0"
              >
                <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
    className="border border-primary/30 bg-primary/5 rounded-3xl p-5 space-y-4 max-w-md"
  >
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
        <HandshakeIcon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-primary">Collab Request</p>
        <p className="text-[10px] text-zinc-500 font-bold">{data.summary}</p>
      </div>
    </div>

    <div className="space-y-2 text-[12px] text-zinc-300">
      <div className="flex gap-2"><span className="text-zinc-500 font-bold w-14 shrink-0">Idea:</span> <span>{data.idea}</span></div>
      <div className="flex gap-2"><span className="text-zinc-500 font-bold w-14 shrink-0">Rate:</span> <span className="text-emerald-400 font-bold">{data.rate}</span></div>
    </div>

    {data.status === "pending" ? (
      <div className="flex gap-2 pt-1">
        <button onClick={onAccept} className="flex-1 h-10 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all">
          ✓ Accept
        </button>
        <button onClick={onDecline} className="flex-1 h-10 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all">
          Decline
        </button>
        <button onClick={onCounter} className="flex-1 h-10 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all">
          Counter
        </button>
      </div>
    ) : (
      <div className={`h-9 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest ${
        data.status === "accepted" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
        data.status === "declined" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
        "bg-amber-500/10 text-amber-400 border border-amber-500/20"
      }`}>
        {data.status === "accepted" ? "✓ Accepted — deal created" : data.status === "declined" ? "✗ Declined" : "Counter-proposal sent"}
      </div>
    )}
  </motion.div>
);
