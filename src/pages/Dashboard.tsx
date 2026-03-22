import { 
  LayoutDashboard, 
  User, 
  PenTool, 
  FileText, 
  TrendingUp, 
  Briefcase 
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const sidebarLinks = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Profile", icon: User },
  { name: "Write Pitch", icon: PenTool },
  { name: "Media Kit Builder", icon: FileText },
  { name: "Market Trends", icon: TrendingUp },
  { name: "Brand Deals", icon: Briefcase },
];

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/30 bg-card/30 backdrop-blur-xl flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border/30">
          <Link to="/" className="font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
            <span>CREATORX</span>
            <span className="text-primary text-sm font-semibold ml-1">AI</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {sidebarLinks.map((link, idx) => (
            <button 
              key={link.name}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                idx === 0 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary" />
            <div className="text-sm">
              <p className="font-semibold text-foreground">Creator User</p>
              <p className="text-xs text-muted-foreground">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-y-auto hidden-scrollbar">
        {/* Mobile Header */}
        <div className="md:hidden h-14 border-b border-border/30 px-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10">
          <Link to="/" className="font-bold text-lg tracking-tight">
            <span>CREATORX</span><span className="text-primary text-sm font-semibold ml-1">AI</span>
          </Link>
          <button className="p-2"><MenuIcon /></button>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-muted-foreground mb-8">Here's what's happening in your creator ecosystem today.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Quick Stat Cards */}
            {[
              { label: "Total Reach", val: "2.4M", trend: "+12%" },
              { label: "Pending Pitches", val: "14", trend: "3 action items" },
              { label: "Est. Revenue", val: "$4,200", trend: "+$400 this week" }
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border/30 rounded-xl p-6 hover:border-primary/30 transition-colors"
              >
                <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
                <div className="text-3xl font-bold mb-1">{stat.val}</div>
                <div className="text-xs text-primary">{stat.trend}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trending Niches preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-muted/10 border border-border/30 rounded-xl p-6 min-h-[300px] flex flex-col"
            >
              <h3 className="font-semibold text-lg mb-4">Trending in Market</h3>
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border/40 rounded-lg text-muted-foreground text-sm">
                Market Trends Graph Placeholder
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-muted/10 border border-border/30 rounded-xl p-6 min-h-[300px] flex flex-col"
            >
              <h3 className="font-semibold text-lg mb-4">Top Brand Deals match</h3>
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border/40 rounded-lg text-muted-foreground text-sm">
                AI Brand Deal Suggestions
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export default Dashboard;
