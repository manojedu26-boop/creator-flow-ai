import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Users, Heart, DollarSign, Zap, PenTool, BarChart3, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const kpis = [
  { label: "Total Reach (7d)", value: "2.4M", delta: "+18.2%", icon: TrendingUp },
  { label: "Follower Growth", value: "+12,847", delta: "+6.1%", icon: Users },
  { label: "Engagement Rate", value: "4.7%", delta: "+0.8%", icon: Heart },
  { label: "Est. Revenue", value: "$3,240", delta: "+$890", icon: DollarSign },
];

const aiTasks = [
  "Post a Reel about trending fitness tips — your audience engages 3.4x more with Reels on Tuesdays",
  "Reply to 12 unanswered comments from the last 48 hours",
  "Your media kit is outdated — update it with this week's stats",
  "Draft a pitch to @NikeTraining — they're looking for fitness creators",
];

const quickActions = [
  { label: "Generate Caption", icon: PenTool },
  { label: "Create Post Idea", icon: Zap },
  { label: "View Analytics", icon: BarChart3 },
  { label: "Content Calendar", icon: Calendar },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-glass border-b border-border/30">
        <div className="container max-w-6xl flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <Sparkles className="w-5 h-5 text-primary" />
            <span>CREATORX</span>
            <span className="text-primary text-sm font-semibold">AI</span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="container max-w-6xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-1">Welcome back, Creator 🔥</h1>
          <p className="text-muted-foreground mb-8">Here's your growth snapshot for today.</p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              className="rounded-xl bg-glass p-4 border border-border/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-accent mt-1">{kpi.delta}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* AI Tasks */}
          <motion.div
            className="rounded-xl bg-glass border border-border/30 p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-gold" />
              Today's AI Tasks
            </h3>
            <ul className="space-y-3">
              {aiTasks.map((task, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {task}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="rounded-xl bg-glass border border-border/30 p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  className="flex items-center gap-3 rounded-lg bg-muted/30 border border-border/30 px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-muted/50 active:scale-[0.97]"
                >
                  <action.icon className="w-4 h-4 text-primary" />
                  {action.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Growth Chart Placeholder */}
        <motion.div
          className="mt-6 rounded-xl bg-glass border border-border/30 p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold mb-4">30-Day Growth Trend</h3>
          <div className="h-48 flex items-center justify-center rounded-lg bg-muted/20">
            <p className="text-sm text-muted-foreground">📈 Connect your accounts to see real-time growth data</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
