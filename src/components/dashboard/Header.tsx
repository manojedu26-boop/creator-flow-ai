import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, Search, ChevronDown, CheckCircle2, 
  Sparkles, DollarSign, Users, Info, 
  TrendingUp, AlertTriangle, FileText, Target
} from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "platform",
    icon: TrendingUp,
    color: "text-blue-400",
    text: "Your Reel is trending — 3.2x above your average reach!",
    time: "2m ago",
    isRead: false
  },
  {
    id: 2,
    type: "deal",
    icon: DollarSign,
    color: "text-green-400",
    text: "Brand reply received from Nike — respond now",
    time: "15m ago",
    isRead: false
  },
  {
    id: 3,
    type: "ai",
    icon: Sparkles,
    color: "text-purple-400",
    text: "You have no posts scheduled for Thursday — your audience peaks that day",
    time: "1h ago",
    isRead: true
  },
  {
    id: 4,
    type: "network",
    icon: Users,
    color: "text-blue-500",
    text: "3 new creators want to connect with you",
    time: "3h ago",
    isRead: true
  },
  {
    id: 5,
    type: "deal",
    icon: AlertTriangle,
    color: "text-red-400",
    text: "Your contract with XYZ Brand expires in 3 days",
    time: "5h ago",
    isRead: false
  },
  {
    id: 6,
    type: "platform",
    icon: FileText,
    color: "text-zinc-400",
    text: "Weekly analytics report is ready",
    time: "1d ago",
    isRead: true
  },
  {
    id: 7,
    type: "ai",
    icon: Target,
    color: "text-primary",
    text: "New collab match: @travelblogger_raj — 91% match score",
    time: "2d ago",
    isRead: true
  }
];

export const Header = ({ title = "Dashboard" }: { title?: string }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "AI Alerts", "Deals", "Network", "Platform"];

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "All") return true;
    if (activeTab === "AI Alerts") return n.type === "ai";
    if (activeTab === "Deals") return n.type === "deal";
    if (activeTab === "Network") return n.type === "network";
    if (activeTab === "Platform") return n.type === "platform";
    return true;
  });

  return (
    <header className="fixed top-0 left-[72px] lg:left-[260px] right-0 h-[60px] bg-background/80 backdrop-blur-md border-b border-border/40 z-[100] flex items-center justify-between px-6 transition-all duration-300">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        
        <div className="hidden md:flex items-center bg-muted/40 rounded-full p-1 border border-border/50">
          {["All Platforms", "Instagram", "YouTube", "TikTok"].map((platform, i) => (
            <button 
              key={platform}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                i === 0 ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground border border-border/50 rounded-lg px-3 py-1.5 hover:bg-muted/30 cursor-pointer">
          <span>30 Days</span>
          <ChevronDown className="w-4 h-4" />
        </div>

        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="h-9 w-64 bg-muted/30 border border-border/50 rounded-full pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative transition-colors ${showNotifications ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-background/20 backdrop-blur-[2px] z-[-1]"
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="absolute right-0 mt-4 w-[400px] bg-card border border-border/50 rounded-[1.5rem] shadow-2xl overflow-hidden z-50 flex flex-col"
                  style={{ maxHeight: "calc(100vh - 100px)" }}
                >
                  <div className="p-4 border-b border-border/30 flex items-center justify-between bg-muted/20">
                    <h3 className="font-bold text-lg">Notifications</h3>
                    <button className="text-xs text-primary hover:underline flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Mark all as read
                    </button>
                  </div>

                  <div className="flex items-center px-4 py-2 border-b border-border/20 gap-4 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-xs font-medium whitespace-nowrap pb-2 transition-all relative ${
                          activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab}
                        {activeTab === tab && (
                          <motion.div 
                            layoutId="notifTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-y-auto no-scrollbar max-h-[480px]">
                    {filteredNotifications.length > 0 ? (
                      <div className="divide-y divide-border/10">
                        {filteredNotifications.map((notif) => (
                          <div 
                            key={notif.id}
                            className={`p-4 flex gap-4 hover:bg-muted/30 cursor-pointer transition-colors relative group ${!notif.isRead ? "bg-primary/5" : ""}`}
                          >
                            <div className={`w-10 h-10 rounded-full bg-muted/40 flex items-center justify-center shrink-0 border border-border/30 ${notif.color}`}>
                              <notif.icon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <p className="text-sm leading-relaxed">{notif.text}</p>
                              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{notif.time}</span>
                            </div>
                            {!notif.isRead && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]" />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                          <Bell className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                        <p className="text-muted-foreground font-medium italic">No notifications found in {activeTab}</p>
                      </div>
                    )}
                  </div>

                  <div className="p-3 border-t border-border/30 bg-muted/10 text-center">
                    <button className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                      View All Activity Log
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary" />
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
};
