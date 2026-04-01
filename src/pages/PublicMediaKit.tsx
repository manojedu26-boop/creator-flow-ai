import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "../lib/db";
import { 
  Instagram, Youtube, Link2, Globe, 
  MapPin, CheckCircle2, ShieldCheck 
} from "lucide-react";

const PublicMediaKit = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = db.getAll<any>('users').find(u => u.firstName?.toLowerCase() === id?.toLowerCase() || u.id === id);
    if (user) {
      setData(user);
    }
    setTimeout(() => setLoading(false), 1200);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Loading Creator Identity...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <h1 className="text-white font-black uppercase tracking-widest opacity-20">404 • Creator Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-primary selection:text-white font-sans overflow-x-hidden">
      {/* GLOW DECORATIONS */}
      <div className="fixed top-0 left-1/4 w-[50vw] h-[50vw] bg-primary/10 blur-[150px] rounded-full -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[50vw] h-[50vw] bg-indigo-500/10 blur-[150px] rounded-full -z-10" />

      <main className="max-w-5xl mx-auto px-6 py-20 space-y-24">
        {/* HERO SECTION */}
        <section className="flex flex-col md:flex-row gap-12 items-center md:items-end justify-between">
          <div className="space-y-8 flex-1">
            <motion.div 
               initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
               className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-primary to-orange-500 p-1 shadow-2xl"
            >
              <div className="w-full h-full rounded-[2.3rem] overflow-hidden bg-black">
                {data.photo ? <img src={data.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">{data.name?.[0]}</div>}
              </div>
            </motion.div>
            
            <div className="space-y-4">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                 className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]"
               >
                 <ShieldCheck className="w-4 h-4" /> Verified Creator Profile
               </motion.div>
               <motion.h1 
                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]"
               >
                 {data.name}
               </motion.h1>
               <motion.p 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                 className="text-zinc-500 text-lg md:text-xl font-medium tracking-tight"
               >
                 {data.niche} Creator • Based in Mumbai • 1.2M+ Reach
               </motion.p>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
            className="flex flex-col gap-4 w-full md:w-auto"
          >
             <button className="h-14 px-10 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">Work with me</button>
             <div className="flex gap-2">
                <div className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center"><Instagram className="w-5 h-5 text-zinc-500" /></div>
                <div className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center"><Youtube className="w-5 h-5 text-zinc-500" /></div>
                <div className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center"><Link2 className="w-5 h-5 text-zinc-500" /></div>
             </div>
          </motion.div>
        </section>

        {/* STATS GRID */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: 'Followers', value: data.followerCounts?.ig || '124K', sub: 'Instagram' },
             { label: 'Subscribers', value: data.followerCounts?.yt || '85K', sub: 'YouTube' },
             { label: 'Engagement', value: '4.8%', sub: 'Combined Avg' },
             { label: 'Monthly Reach', value: '2.4M', sub: 'Verified by CF' },
           ].map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + (i * 0.1) }}
               className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4"
             >
                <div className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{stat.label}</div>
                <div className="text-3xl md:text-4xl font-black tracking-tight">{stat.value}</div>
                <div className="text-[10px] font-black uppercase text-primary tracking-widest">{stat.sub}</div>
             </motion.div>
           ))}
        </section>

        {/* ABOUT / VISION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <motion.div 
             initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}
             className="space-y-6"
           >
              <h2 className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">The Vision</h2>
              <p className="text-2xl font-black tracking-tight leading-relaxed">
                 "I create content that bridges the gap between human curiosity and high-fidelity storytelling. My goal is to inspire through aesthetics and authenticity."
              </p>
           </motion.div>
           <motion.div 
             initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }}
             className="space-y-6 bg-white/5 border border-white/10 p-10 rounded-[2.5rem]"
           >
              <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Brand Collaborations</h3>
              <div className="flex flex-wrap gap-8 items-center opacity-40 font-black grayscale pt-4">
                 <span className="text-2xl">ADOBE</span>
                 <span className="text-2xl">NIKE</span>
                 <span className="text-2xl">SAMSUNG</span>
                 <span className="text-2xl">GOPRO</span>
              </div>
           </motion.div>
        </section>

        {/* FOOTER */}
        <footer className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 pb-20">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest">CreatorForge Verified Kit • 2026</span>
           </div>
           <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest">
              <a href="#">Privacy Policy</a>
              <a href="#">Campaign Rules</a>
              <a href="#">Contact Agent</a>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default PublicMediaKit;
