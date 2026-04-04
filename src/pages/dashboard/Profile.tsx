import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle, MapPin, Globe, Instagram, 
  Youtube, Play, Heart, MessageSquare, 
  Share2, ArrowLeft, Trophy, Zap, 
  Briefcase, Mail, UserPlus, ExternalLink
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export const Profile = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const isMe = id === 'me';

  const creator = {
    name: isMe ? (user?.name || "Jack Dorsey") : "Maya Hills",
    handle: isMe ? (user?.handle || "@jack") : "@mayahills_vlog",
    location: isMe ? "Mumbai, India" : "Mumbai, India",
    niche: isMe ? [user?.niche || "Digital"] : ["Travel", "Wellness", "Tech"],
    followers: isMe ? (user?.followerCounts || { ig: "24K", yt: "12K", tt: "45K" }) : { ig: "24K", yt: "12K", tt: "45K" },
    photo: isMe ? user?.photo : null,
    score: 92,
    engagement: "4.8%",
    frequency: "5 posts/week",
    primary: "Instagram",
    about: isMe ? `Authentic storytelling for brands in the ${user?.niche} space. Building communities across ${Object.keys(user?.followerCounts || {}).join(', ')}.` : "Creating cinematic travel stories and wellness routines for the modern adventurer. Partnered with 20+ global brands to bring authentic storytelling to life.",
    openTo: ["Paid Collabs", "UGC", "Ambassador", "Affiliate"],
    stats: [
      { label: 'Avg Engagement', val: '4.8%', icon: Heart },
      { label: 'Content Frequency', val: '5/wk', icon: Zap },
      { label: 'Creator Score', val: '92', icon: Trophy },
      { label: 'Primary Platform', val: 'IG', icon: Globe },
    ]
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 md:px-0">
      {/* HEADER NAV */}
      <div className="flex items-center justify-between mb-10">
         <Link to="/network" className="h-14 w-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm group">
            <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:-translate-x-1 transition-transform" />
         </Link>
         <div className="flex gap-4">
            <button className="h-14 px-8 rounded-2xl bg-white border border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all">Archive Feed</button>
            <button className="h-14 px-10 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all flex items-center gap-3">
               <Share2 className="w-4 h-4" /> Export Media Kit
            </button>
         </div>
      </div>

      {/* HERO SECTION */}
      <div className="relative rounded-[4rem] overflow-hidden shadow-2xl bg-white border border-slate-100 mb-14 group">
         <div className="h-80 w-full bg-slate-900 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-indigo-600/20" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900 to-transparent" />
         </div>
         
         <div className="px-14 pb-14 relative">
            <div className="flex flex-col lg:flex-row gap-12 items-end -mt-24">
               <div className="relative">
                  <div className="w-48 h-48 rounded-[3rem] bg-slate-100 border-[8px] border-white shadow-2xl flex items-center justify-center font-black text-6xl text-slate-900 overflow-hidden ring-1 ring-slate-100 transition-transform group-hover:scale-105">
                     {(isMe && user?.photo) ? (
                       <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                     ) : (
                       <>{creator.name[0]}{creator.name.split(' ')[1]?.[0] || ''}</>
                     )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-3 bg-blue-600 rounded-full border-[6px] border-white shadow-xl">
                     <CheckCircle className="w-8 h-8 text-white" />
                  </div>
               </div>

               <div className="flex-1 space-y-5 pb-6">
                  <div className="space-y-2">
                     <h2 className="text-5xl font-black tracking-tighter uppercase text-slate-900 leading-none">
                        {creator.name} 
                     </h2>
                     <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[11px] flex items-center gap-3">
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-600" /> {creator.location}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span>{creator.handle}</span>
                     </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {creator.niche.map(n => <span key={n} className="px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-[9px] font-black uppercase tracking-widest text-blue-600">#{n} Mastery</span>)}
                  </div>
               </div>

               <div className="flex gap-4 pb-6">
                  <div className="flex gap-2 h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl items-center mr-2">
                     <Instagram className="w-5 h-5 text-slate-400 hover:text-pink-500 transition-colors cursor-pointer" />
                     <Youtube className="w-5 h-5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer" />
                     <Globe className="w-5 h-5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer" />
                  </div>
                  <button className="h-16 px-10 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all flex items-center gap-3 active:scale-95">
                     <UserPlus className="w-5 h-5" /> Secure Partnership
                  </button>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* LEFT COLL — STATS & ABOUT */}
         <div className="lg:col-span-1 space-y-12">
            <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 shadow-sm space-y-10">
               <div className="grid grid-cols-2 gap-5">
                  {creator.stats.map(s => (
                    <div key={s.label} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-50 flex flex-col gap-3 group/stat transition-all hover:bg-white hover:border-blue-100 hover:shadow-md">
                       <s.icon className="w-6 h-6 text-blue-600 group-hover/stat:scale-110 transition-transform" />
                       <div>
                          <span className="text-[10px] font-black uppercase text-slate-400 block leading-none mb-2 tracking-widest">{s.label}</span>
                          <span className="text-2xl font-black text-slate-900">{s.val}</span>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="space-y-5">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 border-b border-slate-50 pb-3">Strategic Mandate</h4>
                  <p className="text-[15px] font-medium leading-relaxed text-slate-600">{creator.about}</p>
               </div>

               <div className="space-y-5">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 border-b border-slate-50 pb-3">Available Vectors</h4>
                  <div className="flex flex-wrap gap-2">
                     {creator.openTo.map(o => (
                       <div key={o} className="px-4 py-2 bg-blue-50 border border-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                          {o}
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 shadow-sm space-y-8">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Collaborative History</h4>
               <div className="grid grid-cols-3 gap-5 grayscale opacity-30 group-hover:opacity-100 transition-opacity">
                  {['Nike', 'Apple', 'GoPro', 'Uber', 'Amazon', 'Sony'].map(b => (
                    <div key={b} className="aspect-square bg-slate-50 rounded-2xl flex items-center justify-center text-[9px] font-black uppercase tracking-tighter border border-slate-50">{b}</div>
                  ))}
               </div>
            </div>
         </div>

         {/* RIGHT COLL — PORTFOLIO */}
         <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">Portfolio Signal</h3>
               <div className="flex gap-6">
                  {['All', 'Reels', 'Static', 'Collabs'].map(f => <button key={f} className={`text-[10px] font-black uppercase tracking-[0.2em] hover:text-blue-600 transition-colors ${f === 'All' ? 'text-blue-600 underline underline-offset-8 decoration-2' : 'text-slate-400'}`}>{f}</button>)}
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
               {[1,2,3,4,5,6,7,8,9].map(i => (
                 <div key={i} className="aspect-[4/5] bg-slate-100 border border-slate-100 rounded-[2.5rem] relative group cursor-pointer overflow-hidden transition-all hover:border-blue-600/40 hover:shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500 z-20">
                       <div className="flex items-center gap-2.5 text-white">
                          <Heart className="w-5 h-5 fill-white" /> <span className="text-[11px] font-black uppercase tracking-widest">1,240</span>
                       </div>
                       <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                          <ExternalLink className="w-5 h-5 text-white" />
                       </div>
                    </div>
                    {/* Cinematic Placeholder */}
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-white relative">
                       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/50 to-transparent" />
                       <Instagram className="w-10 h-10 text-slate-200 group-hover:text-pink-500/20 transition-all duration-700" />
                       <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">Signal Entry_{i}</span>
                    </div>
                 </div>
               ))}
            </div>

            <button className="w-full py-7 border-2 border-dashed border-slate-100 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 hover:border-blue-600/20 hover:text-blue-600 hover:bg-blue-50/30 transition-all shadow-sm">
               Synchronize Global Feed
            </button>
         </div>
      </div>
    </div>
  );
};
