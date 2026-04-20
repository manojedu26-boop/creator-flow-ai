import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Star, Zap, 
  TrendingUp, BarChart3, Target,
  Instagram, Youtube, Smartphone,
  ExternalLink, ShieldCheck, Sparkles,
  ArrowRight, Users, Eye
} from "lucide-react";
import { db } from "@/lib/db";
import { PageTransition } from "@/components/shared/MotionComponents";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export const BrandDashboard = () => {
  const navigate = useNavigate();
  const [creators, setCreators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNiche, setActiveNiche] = useState("All");

  const niches = ["All", "Tech", "Fitness", "Lifestyle", "Gaming", "Fashion", "Finance"];

  const fetchCreators = () => {
    setIsLoading(true);
    setTimeout(() => {
      const allUsers = db.getAll<any>('users');
      // Filter for creators only
      const creatorList = allUsers.filter(u => u.type === 'Creator');
      setCreators(creatorList);
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  const filteredCreators = creators.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.niche.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNiche = activeNiche === "All" || c.niche.includes(activeNiche);
    return matchesSearch && matchesNiche;
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full"
        />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Scanning Global Talent Index...</p>
      </div>
    );
  }

  return (
    <PageTransition className="space-y-12 pb-32">
       {/* High-Fidelity Search & Filter */}
       <div className="flex flex-col gap-10">
          <div className="space-y-4">
             <h2 className="text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8] text-white">
                Discover<br/>
                <span className="text-indigo-600 italic">the Elite.</span>
             </h2>
             <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] max-w-xl">
                Access over <span className="text-white">2.4M verified creators</span> with real-time engagement auditing. Filter by niche, reach, or neural match score.
             </p>
          </div>

          <div className="flex flex-col xl:flex-row gap-6 p-4 bg-white/5 border border-white/5 rounded-[3rem] backdrop-blur-3xl">
             <div className="flex-1 relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search creators by name, handle, or niche..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 bg-slate-900/50 rounded-2xl pl-16 pr-8 text-[11px] font-black uppercase tracking-widest text-white border border-white/5 focus:border-indigo-600 transition-all outline-none"
                />
             </div>
             <div className="flex flex-wrap gap-2">
                {niches.map(niche => (
                  <button
                    key={niche}
                    onClick={() => setActiveNiche(niche)}
                    className={cn(
                      "px-6 h-16 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                      activeNiche === niche ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "bg-white/5 text-slate-500 hover:text-white"
                    )}
                  >
                    {niche}
                  </button>
                ))}
                <button className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all">
                   <Filter className="w-5 h-5" />
                </button>
             </div>
          </div>
       </div>

       {/* Creator Index Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
             {filteredCreators.map((creator, i) => (
                <motion.div
                  key={creator.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-slate-900 border border-white/5 rounded-[4rem] p-10 hover:border-indigo-600/50 transition-all relative overflow-hidden"
                >
                   {/* Background Glow */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl -z-10 group-hover:bg-indigo-600/10 transition-all" />
                   
                   <div className="flex items-center justify-between mb-8">
                      <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-blue-600 p-1 shadow-2xl group-hover:scale-105 transition-transform">
                         <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-slate-950 border-2 border-slate-950">
                            <img src={creator.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.name}`} alt="" className="w-full h-full object-cover" />
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="flex items-center gap-1.5 text-emerald-500 mb-1">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Verified</span>
                         </div>
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Score: 98.4</p>
                      </div>
                   </div>

                   <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-1 truncate">{creator.name}</h3>
                   <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-6">{creator.handle}</p>

                   {/* Quick Metrics */}
                   <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                         <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Total Reach</p>
                         <p className="text-xl font-black text-white tracking-tighter">{creator.followerCounts?.Instagram || '45K'}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                         <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Match Rate</p>
                         <p className="text-xl font-black text-emerald-500 tracking-tighter">92%</p>
                      </div>
                   </div>

                   <div className="flex flex-wrap gap-2 mb-10">
                      <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[8px] font-black text-slate-500 uppercase">{creator.niche}</span>
                      {creator.platforms?.map((p: string) => (
                        <span key={p} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/10 rounded-lg text-[8px] font-black text-indigo-500 uppercase">{p}</span>
                      ))}
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => navigate(`/kit/${creator.handle.replace('@', '')}`)}
                        className="h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-white hover:text-slate-950 transition-all active:scale-95"
                      >
                         <Eye className="w-4 h-4" /> Media Kit
                      </button>
                      <button 
                        className="h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95"
                      >
                         Send Offer <ArrowRight className="w-4 h-4" />
                      </button>
                   </div>
                </motion.div>
             ))}
          </AnimatePresence>
       </div>
    </PageTransition>
  );
};
