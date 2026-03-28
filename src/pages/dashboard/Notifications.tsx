import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, CheckCheck, Trash2, Filter, DollarSign,
  TrendingUp, AlertTriangle, MessageSquare, Users,
  Clock, Sparkles, RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageTransition, staggerContainer, staggerItem } from "../../components/shared/MotionComponents";
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
}

const typeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  deal:       { icon: DollarSign,    color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", label: "Brand Deal" },
  revenue:    { icon: DollarSign,    color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", label: "Revenue" },
  trending:   { icon: TrendingUp,    color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20",       label: "Trending" },
  warning:    { icon: AlertTriangle, color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20",     label: "Alert" },
  message:    { icon: MessageSquare, color: "text-violet-400",  bg: "bg-violet-500/10 border-violet-500/20",   label: "Message" },
  connection: { icon: Users,         color: "text-cyan-400",    bg: "bg-cyan-500/10 border-cyan-500/20",       label: "Network" },
  reminder:   { icon: Clock,         color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20",     label: "Reminder" },
  ai:         { icon: Sparkles,      color: "text-primary",     bg: "bg-primary/10 border-primary/20",         label: "AI Insight" },
};

type FilterType = "all" | "unread" | "deal" | "trending" | "message" | "reminder";

export const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(() => {
    const all = db.getAll<Notification>("notifications");
    setNotifications([...all].reverse());
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = notifications.filter(n => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter || (filter === "deal" && n.type === "revenue");
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = (notif: Notification) => {
    if (!notif.read) {
      db.update<Notification>("notifications", notif.id, { read: true } as any);
      load();
    }
    if (notif.link) navigate(notif.link);
  };

  const markAllRead = () => {
    notifications.forEach(n => {
      if (!n.read) db.update<Notification>("notifications", n.id, { read: true } as any);
    });
    load();
    toast.success("All notifications marked as read.");
  };

  const deleteNotif = (id: string) => {
    db.delete("notifications", id);
    load();
    toast.success("Notification removed.");
  };

  const clearAll = () => {
    const readOnes = notifications.filter(n => n.read);
    readOnes.forEach(n => db.delete("notifications", n.id));
    load();
    toast.success(`${readOnes.length} read notifications cleared.`);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    load();
    setIsRefreshing(false);
    toast.success("Notifications refreshed.");
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: "all",      label: "All" },
    { key: "unread",   label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}` },
    { key: "deal",     label: "Deals" },
    { key: "trending", label: "Trending" },
    { key: "message",  label: "Messages" },
    { key: "reminder", label: "Reminders" },
  ];

  return (
    <PageTransition>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 max-w-3xl mx-auto">
        {/* Page Header */}
        <motion.div variants={staggerItem} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Notifications</h1>
            <p className="text-muted-foreground text-sm font-bold mt-1">
              {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount !== 1 ? "s" : ""}` : "You're all caught up!"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
            >
              <RefreshCw className={`w-4 h-4 text-zinc-400 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="h-10 px-5 rounded-2xl bg-primary/10 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2"
              >
                <CheckCheck className="w-4 h-4" /> Mark all read
              </button>
            )}
            {notifications.some(n => n.read) && (
              <button
                onClick={clearAll}
                className="h-10 px-5 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Clear Read
              </button>
            )}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={staggerItem} className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f.key
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white/5 border border-white/10 text-zinc-500 hover:text-white hover:border-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* List */}
        <motion.div variants={staggerItem} className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 gap-4 text-zinc-600"
              >
                <Bell className="w-14 h-14 opacity-20" />
                <p className="text-[12px] font-black uppercase tracking-widest">No notifications here</p>
              </motion.div>
            ) : (
              filtered.map(notif => {
                const config = typeConfig[notif.type] || typeConfig.ai;
                const Icon = config.icon;
                return (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => markRead(notif)}
                    className={`flex items-start gap-4 p-5 rounded-3xl border cursor-pointer group transition-all hover:border-white/20 ${
                      notif.read
                        ? "bg-white/[0.02] border-white/5 opacity-60 hover:opacity-80"
                        : "bg-white/[0.04] border-white/10 hover:bg-white/[0.06]"
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${config.bg}`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${config.bg} ${config.color}`}>
                          {config.label}
                        </span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="font-black text-[13px] text-white">{notif.title}</p>
                      <p className="text-[12px] text-zinc-400 leading-relaxed mt-1">{notif.body}</p>
                      <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-2">{notif.time}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={e => { e.stopPropagation(); deleteNotif(notif.id); }}
                        className="p-1.5 text-zinc-600 hover:text-rose-400 transition-colors rounded-xl hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
};
