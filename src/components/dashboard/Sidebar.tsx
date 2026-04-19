import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, BarChart3, Handshake, BrainCircuit, Calendar,
  TrendingUp, Globe, DollarSign, ShieldCheck, Palette,
  MessageSquare, MessageCircle, Bell, Settings, Sparkles,
  LogOut, Instagram, Youtube, Play, User, RefreshCcw,
  ChevronRight, Activity, Compass
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/db";
import { toast } from "@/components/ui/sonner";
import { cn } from "../../lib/utils";
import { Logo } from "../shared/Logo";

export const navGroups = [
  {
    title: "HQ",
    items: [
      { icon: Home,         label: "Home",              href: "/dashboard" },
      { icon: Activity,     label: "The Pulse",         href: "/pulse", badge: "🔴" },
      { icon: Compass,      label: "Explore",           href: "/explore" },
    ]
  },
  {
    title: "Creative Hub",
    items: [
      { icon: BrainCircuit, label: "AI Studio",         href: "/studio" },
      { icon: Play,         label: "Video Edit",       href: "/editor" },
      { icon: Calendar,     label: "Calendar",          href: "/calendar" },
      { icon: TrendingUp,   label: "Growth",            href: "/growth" },
    ]
  },
  {
    title: "Business",
    items: [
      { icon: BarChart3,    label: "Analytics",         href: "/analytics" },
      { icon: Compass,      label: "Marketplace",       href: "/marketplace" },
      { icon: Handshake,    label: "Brand Deals",       href: "/deals" },
      { icon: DollarSign,   label: "Revenue",           href: "/revenue" },
      { icon: ShieldCheck,  label: "Contracts",         href: "/contracts" },
      { icon: Palette,      label: "Media Kit",         href: "/mediakit" },
    ]
  },
  {
    title: "Networking",
    items: [
      { icon: Globe,        label: "Network",           href: "/network" },
      { icon: MessageSquare,label: "Messages",          href: "/messages" },
      { icon: Bell,         label: "Notifications",     href: "/notifications" },
    ]
  }
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

  // Sync sidebar width to CSS variable for layout awareness
  useEffect(() => {
    const width = expanded ? 280 : 80;
    document.documentElement.style.setProperty("--sidebar-w", `${width}px`);
  }, [expanded]);

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
      className="fixed left-0 top-0 bottom-0 z-sidebar bg-white border-r border-slate-100 hidden lg:flex flex-col shadow-[1px_0_10px_rgba(0,0,0,0.02)] overflow-hidden"
      animate={{ width: expanded ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={() => setIsHoverExpanded(true)}
      onMouseLeave={() => setIsHoverExpanded(false)}
    >
      {/* Logo + Pin Toggle */}
      <div
        className={cn(
          "flex items-center h-[var(--header-h)] cursor-pointer border-b border-slate-50 relative shrink-0 group transition-all duration-300",
          expanded ? "px-6 gap-4" : "justify-center px-0 gap-0"
        )}
        onClick={toggleSidebar}
      >
        <Logo 
          iconOnly={!expanded} 
          iconClassName="w-8 h-8"
          textClassName="text-lg text-slate-950"
          className={cn(
            "transition-all duration-300",
            !expanded && "px-0"
          )}
        />
        <AnimatePresence>
          {expanded && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 absolute bottom-3 left-20 whitespace-nowrap"
            >
              Suite v3.1
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items Grouped - Compact Vertical Logic */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <AnimatePresence>
              {expanded && (
                <motion.h3 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 truncate"
                >
                  {group.title}
                </motion.h3>
              )}
            </AnimatePresence>
            
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.href ||
                  (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
                const isNotifications = item.href === "/notifications";

                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={cn(
                      "flex items-center rounded-xl relative transition-all duration-300 ease-in-out group py-1.5",
                      expanded ? "px-4 gap-2.5" : "justify-center px-0 gap-0",
                      isActive 
                        ? "bg-slate-950 text-white shadow-xl shadow-slate-200" 
                        : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                    )}
                    title={!expanded ? item.label : undefined}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavTab"
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-500 rounded-full"
                      />
                    )}

                    {/* Icon with notification badge */}
                    <div className="relative shrink-0 flex items-center justify-center">
                      <item.icon className={cn(
                        "w-4.5 h-4.5 transition-all outline-none",
                        isActive ? "text-blue-500" : "group-hover:text-slate-900"
                      )} />
                      {isNotifications && unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border border-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </div>

                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          initial={{ opacity: 0, width: 0, x: -10 }}
                          animate={{ opacity: 1, width: "auto", x: 0 }}
                          exit={{ opacity: 0, width: 0, x: -10 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden flex items-center"
                        >
                          <span className="font-bold text-[9px] uppercase tracking-wider whitespace-nowrap">
                            {item.label}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Notification count in expanded mode */}
                    {isNotifications && unreadCount > 0 && expanded && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-auto shrink-0 min-w-[20px] h-5 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1.5"
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </motion.span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
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
          className={cn(
            "w-full flex items-center p-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all group shadow-sm",
            expanded ? "gap-3" : "justify-center"
          )}
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
