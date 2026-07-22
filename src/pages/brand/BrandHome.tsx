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
    <div className="max-w-7xl mx-auto space-y-10 pb-20 text-slate-900">
      {/* ACTIVE CAMPAIGNS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Live Campaigns', value: stats.live.toString(), sub: 'Across 4 Platforms', icon: Megaphone, color: 'text-indigo-600', bg: 'bg-indigo-50' },
           { label: 'Total Reach (30d)', value: stats.reach, sub: '+14% vs last mo', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
           { label: 'Total Spend (YTD)', value: stats.spend, sub: 'Budget: ₹ 12L', icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Creators Booked', value: stats.booked.toString(), sub: '8 Pending Replies', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
         ].map((stat, i) => (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             key={stat.label} 
             className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm group hover:border-indigo-600/40 transition-all hover:shadow-md"
           >
              <div className="flex justify-between items-start mb-4">
                 <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                 </div>
                 <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1 border border-emerald-100">
                    <ArrowUpRight className="w-3 h-3" /> LIVE
                 </span>
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                 <h3 className="text-2xl font-black tracking-tight text-slate-950">{stat.value}</h3>
                 <p className="text-[10px] font-medium text-slate-500 mt-2 uppercase tracking-tighter">{stat.sub}</p>
              </div>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* LEFT: CREATORS AWAITING RESPONSE */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-950 flex items-center gap-2">
               <Clock className="w-5 h-5 text-amber-500" /> Awaiting Response
            </h3>
            <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
               <div className="p-4 space-y-1">
                  {[
                    { name: 'Alex Rivera', campaign: 'Summer Vibes 2026', status: 'Negotiating', avatar: 'AR' },
                    { name: 'Sarah Chen', campaign: 'Tech Unboxing', status: 'Outreach Sent', avatar: 'SC' },
                    { name: 'Jasmine K.', campaign: 'Travel Series', status: 'Brief Sent', avatar: 'JK' },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">{c.avatar}</div>
                          <div>
                             <h4 className="font-black text-sm text-slate-900">{c.name}</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">{c.campaign}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className="text-[9px] font-black uppercase text-amber-600 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">{c.status}</span>
                          <button className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all text-slate-700">
                             <MessageSquare className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full py-4 border-t border-slate-100 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-all bg-slate-50/50">
                  View Full Pipeline
               </button>
            </div>

            {/* RECENT APPLICATIONS */}
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-950 flex items-center gap-2 pt-4">
               <Target className="w-5 h-5 text-indigo-500" /> Recent Applications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {applications.length > 0 ? applications.map(a => (
                 <div key={a.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4 group">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black border border-indigo-100">
                             {a.creatorName?.[0]}
                          </div>
                          <div>
                             <h4 className="font-black text-sm text-slate-900">{a.creatorName}</h4>
                             <span className="text-[9px] font-bold text-slate-400 uppercase">Applied to {a.castingId === 'cast_1' ? 'Adobe Brief' : 'Samsung Launch'}</span>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{a.match}% AI Match</span>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => handleApplication(a.id, 'Skipped')}
                         className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[9px] font-black uppercase rounded-lg text-slate-500"
                       >
                          Skip
                       </button>
                       <button 
                         onClick={() => handleApplication(a.id, 'Approved')}
                         className="flex-1 py-1.5 bg-indigo-600 text-white text-[9px] font-black uppercase rounded-lg shadow-lg shadow-indigo-600/20 active:scale-95 transition-all hover:bg-indigo-500"
                       >
                          Approve
                       </button>
                    </div>
                 </div>
               )) : (
                 <div className="md:col-span-2 p-12 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">No new applications</p>
                 </div>
               )}
            </div>
         </div>

         {/* RIGHT: AI MATCHED CREATORS */}
         <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-xl font-black uppercase tracking-tight text-slate-950 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" /> AI Matches
               </h3>
               <button className="text-[10px] font-black text-indigo-600 uppercase hover:underline">Refresh</button>
            </div>
            <div className="space-y-4">
               {[
                 { name: 'Kunal Shah', followers: '850K', niche: 'Fintech', cost: '₹ 50k - 80k', avatar: 'KS' },
                 { name: 'Ananya M.', followers: '120K', niche: 'Wellness', cost: '₹ 15k - 25k', avatar: 'AM' },
                 { name: 'Rohan D.', followers: '2.4M', niche: 'Gaming', cost: '₹ 1.2L - 2L', avatar: 'RD' },
               ].map((m) => (
                 <div key={m.name} className="bg-white border border-slate-100 p-5 rounded-3xl space-y-4 hover:border-indigo-600/40 transition-all shadow-sm hover:shadow-md group">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white font-black text-xl">
                          {m.avatar}
                       </div>
                       <div>
                          <h4 className="font-black text-base text-slate-950">{m.name}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{m.niche} • {m.followers}</p>
                       </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl text-white">
                       <div className="space-y-0.5">
                          <span className="text-[9px] font-black uppercase text-slate-400">Est. Cost</span>
                          <p className="text-xs font-black text-indigo-400">{m.cost}</p>
                       </div>
                       <button className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg active:scale-90 transition-all hover:bg-indigo-500">
                          <Plus className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
            <div className="p-6 bg-indigo-50 border border-dashed border-indigo-200 rounded-[2.5rem] text-center space-y-3">
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Targeting Analysis</p>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
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
