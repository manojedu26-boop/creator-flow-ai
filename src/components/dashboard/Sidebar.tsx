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
      className="fixed left-0 top-0 bottom-0 z-50 bg-white border-r border-slate-100 hidden lg:flex flex-col shadow-sm overflow-visible"
      animate={{ width: expanded ? 280 : 80 }}
      transition={springTransition}
      onMouseEnter={() => setIsHoverExpanded(true)}
      onMouseLeave={() => setIsHoverExpanded(false)}
    >
      {/* Logo + Pin Toggle */}
      <div
        className="flex items-center h-20 px-5 gap-3 cursor-pointer border-b border-slate-50 relative shrink-0 group"
        onClick={toggleSidebar}
      >
        <div className="relative shrink-0">
          <Sparkles className="w-8 h-8 text-blue-600" />
          {isExpanded && (
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-600 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          )}
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.span
              className="font-black tracking-tighter text-xl whitespace-nowrap uppercase text-slate-900"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              CreatorForge<span className="text-blue-600 italic">AI</span>
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
              <div className={`w-4 h-4 rounded-full border-2 border-slate-200 flex items-center justify-center transition-all ${isExpanded ? "bg-blue-600 border-blue-600" : ""}`}>
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
                isActive ? "bg-blue-50 text-blue-600 shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
              title={!expanded ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-0 bottom-0 w-[4px] bg-blue-600 rounded-r-full"
                />
              )}

              {/* Icon with notification badge */}
              <div className="relative shrink-0">
                <item.icon className={`w-5 h-5 transition-all ${isActive ? "text-blue-600" : "group-hover:text-slate-900"}`} />
                {isNotifications && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border border-white">
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
      <div className="p-3 border-t border-slate-50 relative" ref={userMenuRef}>
        {/* User Menu Popup */}
        <AnimatePresence>
          {showUserMenu && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-3 right-3 mb-2 bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden z-50 text-slate-900 font-bold"
            >
              <div className="p-4 border-b border-slate-50">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-900">{user?.name || "Creator"}</p>
                <p className="text-[10px] text-slate-400 font-bold tracking-tight">{user?.email}</p>
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
                  className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all hover:bg-slate-50 ${(item as any).danger ? "text-rose-600 hover:bg-rose-50" : "text-slate-500 hover:text-slate-900"}`}
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
          className="w-full flex items-center gap-3 p-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all group shadow-sm"
        >
          <div className="w-9 h-9 shrink-0 relative">
            {user?.photo ? (
              <img src={user.photo} alt="" className="w-full h-full rounded-full object-cover border border-slate-100 shadow-sm" />
            ) : (
              <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-[11px] font-black text-white">
                {user?.firstName?.[0]}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                className="flex flex-col min-w-0 flex-1 text-left"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <span className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tight">{user?.handle || "@creator"}</span>
                <div className="flex gap-1.5 mt-0.5">
                  {user?.platforms?.includes("Instagram") && <Instagram className="w-3 h-3 text-pink-500" />}
                  {user?.platforms?.includes("YouTube") && <Youtube className="w-3 h-3 text-red-500" />}
                  {user?.platforms?.includes("TikTok") && <Play className="w-3 h-3 text-slate-900" />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {expanded && (
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showUserMenu ? "-rotate-90" : "rotate-90"}`} />
          )}
        </button>
      </div>
    </motion.div>
  );
};
