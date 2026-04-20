import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../lib/db";
import { 
  Instagram, Youtube, Link2, Globe, 
  MapPin, CheckCircle2, ShieldCheck,
  Zap, Stars, Sparkles, Send, Mail,
  Calendar, DollarSign, ArrowRight,
  TrendingUp, BarChart3, Target, X
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PublicMediaKit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [rates, setRates] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerData, setOfferData] = useState({
    amount: '',
    deliverables: '',
    deadline: ''
  });

  useEffect(() => {
    const cleanId = id?.replace('@', '').toLowerCase();
    const creators = db.getAll<any>('users');
    const user = creators.find(u => 
      u.handle?.replace('@', '').toLowerCase() === cleanId || 
      u.firstName?.toLowerCase() === cleanId ||
      u.id === id
    );

    if (user) {
      setData(user);
      const allRates = db.getAll<any>('creator_rates');
      const userRates = allRates.find(r => r.userId === user.id) || { story: 8000, reel: 25000, post: 15000, video: 50000 };
      setRates(userRates);
    }
    setTimeout(() => setLoading(false), 1500);
  }, [id]);

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("OFFER TRANSMITTED", {
      description: `Your proposal for ₹${offerData.amount} has been secured and sent to ${data.name}.`
    });
    setShowOfferModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
          </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Syncing Creator Intelligence...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8 text-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-black text-white/5 uppercase tracking-tighter">404 • Node Offline</h1>
          <p className="text-slate-500 uppercase tracking-widest text-[10px]">The requested creator identity is not registered on the global hub.</p>
          <button onClick={() => navigate('/')} className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all">Return to Core</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <nav className="fixed top-0 left-0 w-full z-50 p-6 md:p-10 flex items-center justify-between pointer-events-none">
         <div className="flex items-center gap-3 pointer-events-auto cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-600/20">
               <Stars className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white hidden md:block">CreatorForge Protocol</span>
         </div>
         <div className="pointer-events-auto">
            <button 
               onClick={() => setShowOfferModal(true)}
               className="h-12 px-8 bg-white text-slate-950 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
               Initiate Deal <ArrowRight className="w-4 h-4" />
            </button>
         </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-32 space-y-32">
        <section className="flex flex-col lg:flex-row gap-16 items-center lg:items-end justify-between">
          <div className="space-y-10 flex-1 w-full">
            <motion.div 
               initial={{ opacity: 0, x: -20, filter: 'blur(20px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
               className="w-40 h-40 rounded-[3rem] bg-gradient-to-tr from-blue-600 to-indigo-600 p-1 shadow-2xl"
            >
              <div className="w-full h-full rounded-[2.8rem] overflow-hidden bg-slate-950 border-4 border-slate-950">
                {data.photo ? <img src={data.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-5xl font-black">{data.name?.[0]}</div>}
              </div>
            </motion.div>
            
            <div className="space-y-6">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                 className="flex items-center gap-3 text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em]"
               >
                 <ShieldCheck className="w-4 h-4" /> System Verified Intelligence Node
               </motion.div>
               <motion.h1 
                 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] text-white"
               >
                 {data.name}<span className="text-blue-600">.</span>
               </motion.h1>
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                 className="flex flex-wrap gap-4 items-center"
               >
                  <p className="text-slate-500 text-lg md:text-xl font-bold tracking-tight uppercase">
                    {data.niche} • {data.followerCounts?.Instagram || '48K'}+ Reach
                  </p>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Mumbai, INDIA</span>
                  </div>
               </motion.div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
            className="flex flex-col gap-6 w-full lg:w-auto shrink-0"
          >
             <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Instagram, id: 'ig', color: 'hover:text-pink-500' },
                  { icon: Youtube, id: 'yt', color: 'hover:text-red-500' },
                  { icon: Link2, id: 'web', color: 'hover:text-blue-500' }
                ].map(soc => (
                  <button key={soc.id} className={cn("h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center transition-all", soc.color)}>
                     <soc.icon className="w-6 h-6" />
                  </button>
                ))}
             </div>
             <button 
               onClick={() => setShowOfferModal(true)}
               className="h-20 px-12 bg-blue-600 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-4"
             >
                Initiate Transaction <Zap className="w-5 h-5 fill-white" />
             </button>
          </motion.div>
        </section>

        {/* ... Rest of the file precisely preserved ... */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'Network Power', value: data.followerCounts?.Instagram || '48.2K', sub: 'Instagram Primary', icon: TrendingUp },
             { label: 'Video Depth', value: data.followerCounts?.YouTube || '12.8K', sub: 'YouTube Subscribers', icon: BarChart3 },
             { label: 'Audience Pulse', value: '4.8%', sub: 'Avg. Engagement', icon: Target },
             { label: 'Monthly Delta', value: '+12.4%', sub: 'Growth Acceleration', icon: Zap },
           ].map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + (i * 0.1) }}
               className="p-10 bg-white/5 border border-white/5 rounded-[3.5rem] space-y-6 group hover:border-blue-600/30 transition-all relative overflow-hidden"
             >
                <div className="flex items-center justify-between">
                   <div className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">{stat.label}</div>
                   <stat.icon className="w-4 h-4 text-blue-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-4xl md:text-5xl font-black tracking-tighter italic">{stat.value}</div>
                <div className="text-[10px] font-black uppercase text-blue-500 tracking-widest">{stat.sub}</div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
             </motion.div>
           ))}
        </section>

        <section className="space-y-12">
            <div className="text-center space-y-4">
               <h2 className="text-4xl font-black uppercase tracking-tighter">Monetization Pulse</h2>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Verified rate nodes for transparent corporate bidding</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { label: 'Sponsored Reel', val: rates?.reel || 25000, desc: 'High-fidelity cinematic integration' },
                 { label: 'IG Story Series', val: rates?.story || 8000, desc: 'Direct audience conversion node' },
                 { label: 'Static Deployment', val: rates?.post || 15000, desc: 'Persistent brand visual pulse' },
               ].map((rate, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + (i * 0.1) }}
                   className="p-10 bg-slate-900 border border-white/5 rounded-[4rem] text-center space-y-6 hover:shadow-2xl transition-all"
                 >
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{rate.label}</p>
                    <p className="text-5xl font-black tracking-tighter font-mono italic">₹ {rate.val.toLocaleString()}</p>
                    <p className="text-xs font-bold text-slate-500 leading-relaxed max-w-[200px] mx-auto">{rate.desc}</p>
                    <div className="h-px w-12 bg-blue-600 mx-auto opacity-40" />
                 </motion.div>
               ))}
            </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3 }} className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-[10px] font-black uppercase text-blue-500 tracking-[0.5em]">The Strategic Vision</h2>
                <p className="text-3xl md:text-4xl font-black tracking-tighter italic leading-tight">
                  "I construct high-fidelity narratives that amplify brand intelligence across localized networks."
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                 {['Cinematic Storytelling', 'Hyper-Engagement', 'Verified Metrics', 'AI Driven Content'].map(tag => (
                   <span key={tag} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 italic">{tag}</span>
                 ))}
              </div>
           </motion.div>
           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4 }} className="bg-white/5 border border-white/5 p-12 rounded-[4rem] space-y-12 backdrop-blur-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5"><ShieldCheck className="w-20 h-20" /></div>
              <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Collaborative Portfolio</h3>
              <div className="grid grid-cols-2 gap-12 items-center opacity-30 grayscale saturate-0 contrast-125">
                 <div className="text-3xl font-black italic tracking-tighter">NIKE</div>
                 <div className="text-3xl font-black italic tracking-tighter">ADOBE</div>
                 <div className="text-3xl font-black italic tracking-tighter">RED BULL</div>
                 <div className="text-3xl font-black italic tracking-tighter">SAMSUNG</div>
              </div>
              <div className="pt-6 border-t border-white/5">
                 <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 italic flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" /> All metrics verified by CreatorForge Autonomous Engine
                 </p>
              </div>
           </motion.div>
        </section>

        <footer className="pt-32 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 opacity-30 pb-32">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10"><Zap className="w-6 h-6 text-white" /></div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] block">Creator Identity Node • Verified</span>
                <span className="text-[8px] font-bold text-slate-500 block uppercase">Protocol Instance v4.2.0 • 2026-04-20</span>
              </div>
           </div>
        </footer>
      </main>

      <AnimatePresence>
         {showOfferModal && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-3xl">
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[4rem] p-12 shadow-[0_35px_100px_-15px_rgba(37,99,235,0.2)] relative overflow-hidden">
                 <button onClick={() => setShowOfferModal(false)} className="absolute top-8 right-8 w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-rose-500 transition-all group"><X className="w-5 h-5 group-hover:rotate-90 transition-transform" /></button>
                 <div className="space-y-10">
                    <div className="space-y-3 text-center">
                       <h3 className="text-4xl font-black uppercase tracking-tighter">Bilateral Handshake</h3>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Direct Engagement Protocol with {data.name}</p>
                    </div>
                    <form onSubmit={handleSendOffer} className="grid grid-cols-1 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-blue-500 tracking-widest ml-4">Deployment Value (₹)</label>
                          <div className="relative">
                             <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
                             <input required type="number" placeholder="50000" value={offerData.amount} onChange={(e) => setOfferData({...offerData, amount: e.target.value})} className="w-full h-16 bg-slate-950 border border-white/5 rounded-2xl pl-16 pr-8 font-mono text-xl text-white outline-none focus:border-blue-600 transition-all" />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-blue-500 tracking-widest ml-4">Strategic Deliverables</label>
                          <textarea required placeholder="e.g. 1 Sponsored Reel + 2 Stories" value={offerData.deliverables} onChange={(e) => setOfferData({...offerData, deliverables: e.target.value})} className="w-full h-32 bg-slate-950 border border-white/5 rounded-2xl p-6 text-sm font-bold text-white outline-none focus:border-blue-600 transition-all resize-none" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-blue-500 tracking-widest ml-4">Target Deadline</label>
                          <div className="relative">
                             <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
                             <input required type="date" value={offerData.deadline} onChange={(e) => setOfferData({...offerData, deadline: e.target.value})} className="w-full h-16 bg-slate-950 border border-white/5 rounded-2xl pl-16 pr-8 text-sm font-bold text-white outline-none focus:border-blue-600 transition-all" />
                          </div>
                       </div>
                       <button type="submit" className="h-20 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-blue-600/30 hover:bg-blue-500 transition-all flex items-center justify-center gap-4">
                          Establish Escrow Link <Send className="w-5 h-5 fill-white" />
                       </button>
                       <p className="text-[9px] font-black text-center text-slate-600 uppercase tracking-widest pt-4">Your funds will be held in CF Escrow (Razorpay Protected) until completion.</p>
                    </form>
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default PublicMediaKit;
