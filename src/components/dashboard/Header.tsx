import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Search, ChevronDown, X, CheckCheck,
  Sparkles, DollarSign, TrendingUp, AlertTriangle,
  MessageSquare, Users, Clock, Zap, Globe, Sun, Moon,
  Command as CommandIcon
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { SearchOverlay } from "./SearchOverlay";
import { db } from "../../lib/db";
import { toast } from "@/components/ui/sonner";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: "deal" | "revenue" | "warning" | "trending" | "message" | "connection" | "reminder" | "ai";
  time: string;
  read: boolean;
  link?: string;
  highlight?: string; // ID of thing to highlight on the linked page
}

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  deal:       { icon: DollarSign,    color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
  revenue:    { icon: DollarSign,    color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
  trending:   { icon: TrendingUp,    color: "text-blue-600",    bg: "bg-blue-50 border-blue-100" },
  warning:    { icon: AlertTriangle, color: "text-amber-600",   bg: "bg-amber-50 border-amber-100" },
  message:    { icon: MessageSquare, color: "text-violet-600",  bg: "bg-violet-50 border-violet-100" },
  connection: { icon: Users,         color: "text-cyan-600",    bg: "bg-cyan-50 border-cyan-100" },
  reminder:   { icon: Clock,         color: "text-slate-600",   bg: "bg-slate-100 border-slate-200" },
  ai:         { icon: Sparkles,      color: "text-blue-600",    bg: "bg-blue-50 border-blue-100" },
};

// Request push permission
const requestPushPermission = async () => {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    const result = await Notification.requestPermission();
    if (result === "granted") {
      toast.success("Push notifications enabled! 🔔", { description: "You'll get alerts even when the app is closed." });
    }
  }
};

// Send OS push notification
const sendPush = (title: string, body: string) => {
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    new Notification(title, { body, icon: "/favicon.ico" });
  }
};

export const Header = ({ title = "Dashboard", onSearch }: { title?: string; onSearch?: () => void }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const userDropRef = useRef<HTMLDivElement>(null);

  const loadNotifications = useCallback(() => {
    const all = db.getAll<Notification>("notifications");
    // Sort newest first (by id timestamp or reverse array)
    setNotifications([...all].reverse());
  }, []);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Initial load + poll every 60s
  useEffect(() => {
    setMounted(true);
    loadNotifications();
    const id = setInterval(loadNotifications, 60000);
    return () => clearInterval(id);
  }, [loadNotifications]);

  // Request push on mount
  useEffect(() => {
    setTimeout(() => requestPushPermission(), 3000);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notif: Notification) => {
    if (!notif.read) {
      db.update<Notification>("notifications", notif.id, { read: true } as any);
      loadNotifications();
    }
    setShowNotifications(false);
    if (notif.link) navigate(notif.link);
  };

  const markAllRead = () => {
    notifications.forEach(n => {
      if (!n.read) db.update<Notification>("notifications", n.id, { read: true } as any);
    });
    loadNotifications();
    toast.success("All notifications marked as read.");
  };

  const deleteNotif = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    db.delete("notifications", id);
    loadNotifications();
  };

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userDropRef.current && !userDropRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    if (showNotifications || showUserDropdown) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifications, showUserDropdown]);

  const [activePlatform, setActivePlatform] = useState("Global");

  return (
    <>
      <header className="sticky top-0 right-0 h-[var(--header-h)] bg-white/80 backdrop-blur-xl border-b border-slate-100 z-[100] flex items-center justify-between px-4 md:px-10 transition-all duration-300">
        <div className="flex items-center gap-8">
          <h1 className="text-base md:text-xl font-black tracking-tight uppercase truncate max-w-[160px] md:max-w-none text-slate-900">{title}</h1>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          {/* Desktop Search */}
          <div className="relative hidden lg:block group/search">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/search:text-blue-600 transition-colors" />
            <div 
              onClick={onSearch}
              className="h-14 w-80 bg-slate-50 border border-slate-200 rounded-[1.25rem] pl-14 pr-6 flex items-center justify-between cursor-pointer hover:border-blue-300 hover:bg-white hover:shadow-premium transition-all group"
            >
              <span className="text-[12px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">Search for anything...</span>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                <CommandIcon className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] font-black tracking-widest text-slate-400">K</span>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <button onClick={onSearch} className="lg:hidden p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-50"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}

          {/* Notification Bell */}
          <div className="relative" ref={panelRef}>
            <button
              onClick={() => setShowNotifications(prev => !prev)}
              className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-50"
              aria-label="Notifications"
            >
              <Bell className={`w-5 h-5 transition-all ${showNotifications ? "text-blue-600" : ""}`} />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.span>
              )}
            </button>

            {/* Desktop Dropdown Panel */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="hidden lg:flex absolute top-full right-0 mt-2 w-[420px] bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] z-[200] flex-col overflow-hidden"
                >
                  {/* Panel Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                    <div>
                      <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">Recent Notifications</h3>
                      {unreadCount > 0 && (
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{unreadCount} unread alerts</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors px-3 py-1.5 rounded-xl hover:bg-blue-50"
                        >
                          <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[420px] overflow-y-auto no-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-300 gap-3">
                        <Bell className="w-10 h-10 opacity-30" />
                        <p className="text-[11px] font-black uppercase tracking-widest">You're all caught up!</p>
                      </div>
                    ) : (
                      notifications.map(notif => {
                        const config = typeConfig[notif.type] || typeConfig.ai;
                        const Icon = config.icon;
                        return (
                          <motion.div
                            key={notif.id}
                            layout
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex items-start gap-4 px-4 py-4 cursor-pointer border-b border-slate-50 transition-all hover:bg-slate-50 group ${notif.read ? "opacity-60" : ""}`}
                            onClick={() => markAsRead(notif)}
                          >
                            <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center shrink-0 ${config.bg}`}>
                              <Icon className={`w-4 h-4 ${config.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-black text-slate-900">{notif.title}</p>
                              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">{notif.body}</p>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">{notif.time}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {!notif.read && <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm" />}
                              <button
                                onClick={e => deleteNotif(notif.id, e)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-600 transition-all"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>

                  {/* View All */}
                  <div className="p-3 border-t border-slate-50">
                    <button
                      onClick={() => { setShowNotifications(false); navigate("/notifications"); }}
                      className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors py-2.5 rounded-xl hover:bg-slate-50"
                    >
                      View All Notifications →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Avatar */}
          <div className="relative" ref={userDropRef}>
            <button
              onClick={() => setShowUserDropdown(prev => !prev)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 shrink-0 relative">
                {user?.photo ? (
                  <img src={user.photo} alt="" className="w-full h-full rounded-full object-cover border border-slate-100 shadow-sm group-hover:border-blue-400 transition-colors" />
                ) : (
                  <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-sm">
                    {user?.firstName?.[0]}
                  </div>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{user?.firstName || "Creator"}</span>
                <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">{user?.handle || 'Elite Creator'}</span>
              </div>
              <ChevronDown className="hidden md:block w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </button>

            {/* User dropdown mini */}
            <AnimatePresence>
              {showUserDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-full right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden z-[200]"
                >
                  <div className="p-4 border-b border-slate-50">
                    <p className="text-[11px] font-black uppercase text-slate-900 tracking-tight">{user?.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{user?.email}</p>
                  </div>
                  {[
                    { label: "View Profile", action: () => navigate("/network/profile/me") },
                    { label: "Settings", action: () => navigate("/settings") },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={() => { item.action(); setShowUserDropdown(false); }}
                      className="w-full text-left px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all font-bold"
                    >
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Mobile Notification Bottom Sheet */}
      <AnimatePresence>
        {showNotifications && (
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="fixed bottom-0 left-0 right-0 z-[160] bg-zinc-950 border-t border-white/10 rounded-t-[2rem] max-h-[90vh] flex flex-col"
            >
              {/* Handle */}
              <div className="w-8 h-1 rounded-full bg-zinc-700 mx-auto mt-3 mb-2 shrink-0" />

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 shrink-0">
                <div>
                  <h3 className="font-black text-base uppercase tracking-tight">Notifications</h3>
                  {unreadCount > 0 && <p className="text-[10px] text-zinc-500 font-bold">{unreadCount} unread</p>}
                </div>
                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-[10px] font-black uppercase tracking-widest text-primary">
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setShowNotifications(false)} className="p-1 text-zinc-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-600">
                    <Bell className="w-10 h-10 opacity-30" />
                    <p className="text-[11px] font-black uppercase tracking-widest">All caught up!</p>
                  </div>
                ) : (
                  notifications.map(notif => {
                    const config = typeConfig[notif.type] || typeConfig.ai;
                    const Icon = config.icon;
                    return (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif)}
                        className={`flex items-start gap-4 px-5 py-4 border-b border-white/[0.04] cursor-pointer transition-all active:bg-white/5 ${notif.read ? "opacity-60" : ""}`}
                      >
                        <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${config.bg}`}>
                          <Icon className={`w-4.5 h-4.5 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-black text-white">{notif.title}</p>
                          <p className="text-[12px] text-zinc-400 leading-relaxed mt-0.5">{notif.body}</p>
                          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-1.5">{notif.time}</p>
                        </div>
                        {!notif.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
                      </div>
                    );
                  })
                )}
              </div>

              {/* View All */}
              <div className="p-4 border-t border-white/5 shrink-0">
                <button
                  onClick={() => { setShowNotifications(false); navigate("/notifications"); }}
                  className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  View All Notifications
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </>
  );
};
