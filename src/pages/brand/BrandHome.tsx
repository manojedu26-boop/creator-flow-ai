import { motion } from "framer-motion";
import { 
  TrendingUp, Users, Megaphone, 
  ArrowUpRight, Clock, Sparkles, 
  Target, BarChart3, ChevronRight,
  ShieldCheck, Zap, MessageSquare, Plus, Check, X
} from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "../../lib/db";
import { toast } from "../../components/ui/sonner";
import { IndianRupee } from "../../components/shared/CurrencyIcon";

export const BrandHome = () => {
  const [stats, setStats] = useState({
    live: 0,
    reach: '4.2M',
    spend: '₹ 8.5L',
    booked: 0
  });
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    const castings = db.getAll<any>('castings');
    const apps = db.getAll<any>('applications');
    
    setStats(prev => ({
      ...prev,
      live: castings.filter(c => c.status === 'Live').length,
      booked: apps.filter(a => a.status === 'Approved').length
    }));
    
    setApplications(apps.filter(a => a.status === 'Pending'));
  }, []);

  const handleApplication = (id: string, status: 'Approved' | 'Skipped') => {
    db.update('applications', id, { status });
    setApplications(prev => prev.filter(a => a.id !== id));
    toast.success(status === 'Approved' ? "Creator Approved!" : "Application Skipped", {
       description: status === 'Approved' ? "They've been moved to the Active Deals section." : "This application has been archived."
    });
    if (status === 'Approved') {
       setStats(prev => ({ ...prev, booked: prev.booked + 1 }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* ACTIVE CAMPAIGNS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Live Campaigns', value: stats.live.toString(), sub: 'Across 4 Platforms', icon: Megaphone, color: 'text-primary' },
           { label: 'Total Reach (30d)', value: stats.reach, sub: '+14% vs last mo', icon: Users, color: 'text-indigo-400' },
           { label: 'Total Spend (YTD)', value: stats.spend, sub: 'Budget: ₹ 12L', icon: IndianRupee, color: 'text-emerald-400' },
           { label: 'Creators Booked', value: stats.booked.toString(), sub: '8 Pending Replies', icon: Zap, color: 'text-amber-400' },
         ].map((stat, i) => (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             key={stat.label} 
             className="bg-white/5 border border-white/10 p-6 rounded-[2rem] shadow-2xl group hover:border-primary/40 transition-all"
           >
              <div className="flex justify-between items-start mb-4">
                 <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                 </div>
                 <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> LIVE
                 </span>
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</p>
                 <h3 className="text-2xl font-black tracking-tight text-white">{stat.value}</h3>
                 <p className="text-[10px] font-medium text-zinc-400 mt-2 uppercase tracking-tighter">{stat.sub}</p>
              </div>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* LEFT: CREATORS AWAITING RESPONSE */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
               <Clock className="w-5 h-5 text-amber-500" /> Awaiting Response
            </h3>
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
               <div className="p-4 space-y-1">
                  {[
                    { name: 'Alex Rivera', campaign: 'Summer Vibes 2026', status: 'Negotiating', avatar: 'AR' },
                    { name: 'Sarah Chen', campaign: 'Tech Unboxing', status: 'Outreach Sent', avatar: 'SC' },
                    { name: 'Jasmine K.', campaign: 'Travel Series', status: 'Brief Sent', avatar: 'JK' },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black">{c.avatar}</div>
                          <div>
                             <h4 className="font-black text-sm text-white">{c.name}</h4>
                             <p className="text-[10px] font-bold text-zinc-500 uppercase">{c.campaign}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className="text-[9px] font-black uppercase text-amber-500 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">{c.status}</span>
                          <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all text-white">
                             <MessageSquare className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full py-4 border-t border-white/5 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-all bg-white/2">
                  View Full Pipeline
               </button>
            </div>

            {/* RECENT APPLICATIONS */}
            <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2 pt-4">
               <Target className="w-5 h-5 text-indigo-500" /> Recent Applications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {applications.length > 0 ? applications.map(a => (
                 <div key={a.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4 group">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black">
                             {a.creatorName?.[0]}
                          </div>
                          <div>
                             <h4 className="font-black text-sm text-white">{a.creatorName}</h4>
                             <span className="text-[9px] font-bold text-zinc-500 uppercase">Applied to {a.castingId === 'cast_1' ? 'Adobe Brief' : 'Samsung Launch'}</span>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className="text-[10px] font-black text-indigo-400">{a.match}% AI Match</span>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => handleApplication(a.id, 'Skipped')}
                         className="flex-1 py-1.5 bg-white/5 text-[9px] font-black uppercase rounded-lg text-zinc-400 hover:bg-white/10"
                       >
                          Skip
                       </button>
                       <button 
                         onClick={() => handleApplication(a.id, 'Approved')}
                         className="flex-1 py-1.5 bg-indigo-500 text-white text-[9px] font-black uppercase rounded-lg shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                       >
                          Approve
                       </button>
                    </div>
                 </div>
               )) : (
                 <div className="md:col-span-2 p-12 text-center bg-white/2 rounded-[2.5rem] border border-dashed border-white/10">
                    <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">No new applications</p>
                 </div>
               )}
            </div>
         </div>

         {/* RIGHT: AI MATCHED CREATORS */}
         <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> AI Matches
               </h3>
               <button className="text-[10px] font-black text-primary uppercase hover:underline">Refresh</button>
            </div>
            <div className="space-y-4">
               {[
                 { name: 'Kunal Shah', followers: '850K', niche: 'Fintech', cost: '₹ 50k - 80k', avatar: 'KS' },
                 { name: 'Ananya M.', followers: '120K', niche: 'Wellness', cost: '₹ 15k - 25k', avatar: 'AM' },
                 { name: 'Rohan D.', followers: '2.4M', niche: 'Gaming', cost: '₹ 1.2L - 2L', avatar: 'RD' },
               ].map((m) => (
                 <div key={m.name} className="bg-white/5 border border-white/10 p-5 rounded-3xl space-y-4 hover:border-primary/40 transition-all shadow-xl group">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white font-black text-xl">
                          {m.avatar}
                       </div>
                       <div>
                          <h4 className="font-black text-base text-white">{m.name}</h4>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase">{m.niche} • {m.followers}</p>
                       </div>
                    </div>
                    <div className="flex items-center justify-between bg-black/40 p-3 rounded-2xl">
                       <div className="space-y-0.5">
                          <span className="text-[9px] font-black uppercase text-zinc-500">Est. Cost</span>
                          <p className="text-xs font-black text-primary">{m.cost}</p>
                       </div>
                       <button className="p-3 bg-primary text-white rounded-xl shadow-lg active:scale-90 transition-all">
                          <Plus className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
            <div className="p-6 bg-primary/5 border border-dashed border-primary/20 rounded-[2.5rem] text-center space-y-3">
                <p className="text-[10px] font-black uppercase text-primary tracking-widest">Targeting Analysis</p>
                <p className="text-xs font-medium text-zinc-400 leading-relaxed">
                   Based on your competitors, these 3 creators have a combined audience overlap of 42% with your target.
                </p>
            </div>
         </div>
      </div>
    </div>
  );
};

const IndianRupee = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/></svg>
);
