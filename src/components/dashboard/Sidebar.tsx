import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, BarChart3, Handshake, BrainCircuit, Calendar,
  TrendingUp, Globe, DollarSign, ShieldCheck, Palette,
  MessageSquare, Bell, Settings, Sparkles,
  LogOut, Instagram, Youtube, Play, User, RefreshCcw,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/db";
import { toast } from "@/components/ui/sonner";

export const navItems = [
  { icon: Home,         label: "Home",              href: "/dashboard" },
  { icon: BarChart3,    label: "Analytics",         href: "/analytics" },
  { icon: Handshake,    label: "Brand Deals",       href: "/deals" },
  { icon: BrainCircuit, label: "AI Studio",         href: "/studio" },
  { icon: Calendar,     label: "Calendar",          href: "/calendar" },
  { icon: TrendingUp,   label: "Growth Strategy",   href: "/growth" },
  { icon: Globe,        label: "Creator Network",   href: "/network" },
  { icon: DollarSign,   label: "Revenue",           href: "/revenue" },
  { icon: ShieldCheck,  label: "Contract Shield",   href: "/contracts" },
  { icon: Palette,      label: "Media Kit",         href: "/mediakit" },
  { icon: MessageSquare,label: "Messages",          href: "/messages" },
  { icon: Bell,         label: "Notifications",     href: "/notifications" },
  { icon: Settings,     label: "Settings",          href: "/settings" },
];

const springTransition: any = { type: "spring", stiffness: 400, damping: 40, mass: 1 };

const SIDEBAR_KEY = "cf_sidebar_expanded";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Persist sidebar state
  const [isExpanded, setIsExpanded] = useState(() => {
    try { return localStorage.getItem(SIDEBAR_KEY) === "true"; } catch { return false; }
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Persist on toggle
  const toggleSidebar = () => {
    setIsExpanded(prev => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_KEY, String(next));
      return next;
    });
  };

  // Hover expand (only when not pinned)
  const [isHoverExpanded, setIsHoverExpanded] = useState(false);
  const expanded = isExpanded || isHoverExpanded;

  // Load unread count + poll every 60s
  useEffect(() => {
    const load = () => {
      const notifs = db.getAll<any>("notifications");
      setUnreadCount(notifs.filter(n => !n.read).length);
    };
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <motion.div
      className="fixed left-0 top-0 bottom-0 z-50 bg-black/50 backdrop-blur-3xl border-r border-white/5 hidden lg:flex flex-col shadow-2xl overflow-visible"
      animate={{ width: expanded ? 280 : 80 }}
      transition={springTransition}
      onMouseEnter={() => setIsHoverExpanded(true)}
      onMouseLeave={() => setIsHoverExpanded(false)}
    >
      {/* Logo + Pin Toggle */}
      <div
        className="flex items-center h-20 px-5 gap-3 cursor-pointer border-b border-white/5 relative shrink-0 group"
        onClick={toggleSidebar}
      >
        <div className="relative shrink-0">
          <Sparkles className="w-8 h-8 text-primary" />
          {isExpanded && (
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          )}
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.span
              className="font-black tracking-tighter text-xl whitespace-nowrap uppercase"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              CreatorForge<span className="text-primary italic">AI</span>
            </motion.span>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {expanded && (
            <motion.div
              className="ml-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={`w-4 h-4 rounded-full border-2 border-white/20 flex items-center justify-center transition-all ${isExpanded ? "bg-primary border-primary" : ""}`}>
                {isExpanded && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href ||
            (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
          const isNotifications = item.href === "/notifications";

          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl relative transition-all group ${
                isActive ? "bg-primary/[0.08] text-white" : "text-zinc-500 hover:bg-white/5 hover:text-white"
              }`}
              title={!expanded ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r-full shadow-[2px_0_12px_rgba(255,60,172,0.6)]"
                />
              )}

              {/* Icon with notification badge */}
              <div className="relative shrink-0">
                <item.icon className={`w-5 h-5 transition-all ${isActive ? "text-primary" : "group-hover:text-white"}`} />
                {isNotifications && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border border-black">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>

              <AnimatePresence>
                {expanded && (
                  <motion.span
                    className="font-black text-[11px] uppercase tracking-widest whitespace-nowrap flex-1"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Notification count in expanded mode */}
              {isNotifications && unreadCount > 0 && expanded && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="shrink-0 min-w-[20px] h-5 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1.5"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Creator Profile Bottom */}
      <div className="p-3 border-t border-white/5 relative" ref={userMenuRef}>
        {/* User Menu Popup */}
        <AnimatePresence>
          {showUserMenu && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-3 right-3 mb-2 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
            >
              <div className="p-3 border-b border-white/5">
                <p className="text-[11px] font-black uppercase tracking-widest text-white">{user?.name || "Creator"}</p>
                <p className="text-[10px] text-zinc-500 font-bold">{user?.email}</p>
              </div>
              {[
                { icon: User, label: "View Profile", action: () => { navigate("/network/profile/me"); setShowUserMenu(false); } },
                { icon: Settings, label: "Settings", action: () => { navigate("/settings"); setShowUserMenu(false); } },
                { icon: RefreshCcw, label: "Switch Account", action: () => { toast.info("Switch Account", { description: "Coming soon — multi-account support" }); setShowUserMenu(false); } },
                { icon: LogOut, label: "Log Out", action: handleLogout, danger: true },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all hover:bg-white/5 ${(item as any).danger ? "text-rose-400 hover:text-rose-300" : "text-zinc-400 hover:text-white"}`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                  <ChevronRight className="w-3 h-3 ml-auto opacity-30" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowUserMenu(prev => !prev)}
          className="w-full flex items-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
        >
          <div className="w-9 h-9 shrink-0 relative">
            {user?.photo ? (
              <img src={user.photo} alt="" className="w-full h-full rounded-full object-cover border border-white/10" />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-[10px] font-black text-white">
                {user?.firstName?.[0]}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full" />
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                className="flex flex-col min-w-0 flex-1 text-left"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <span className="text-[11px] font-black text-white truncate uppercase tracking-tight">{user?.handle || "@creator"}</span>
                <div className="flex gap-1.5 mt-0.5">
                  {user?.platforms?.includes("Instagram") && <Instagram className="w-3 h-3 text-pink-500" />}
                  {user?.platforms?.includes("YouTube") && <Youtube className="w-3 h-3 text-red-500" />}
                  {user?.platforms?.includes("TikTok") && <Play className="w-3 h-3 text-white" />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {expanded && (
            <ChevronRight className={`w-4 h-4 text-zinc-500 transition-transform ${showUserMenu ? "-rotate-90" : "rotate-90"}`} />
          )}
        </button>
      </div>
    </motion.div>
  );
};
