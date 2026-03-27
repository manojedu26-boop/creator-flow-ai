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
    location: isMe ? "Mumbai, India" : "Mumbai, India", // Simplified for now
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
    <div className="max-w-6xl mx-auto pb-20">
      {/* HEADER NAV */}
      <div className="flex items-center justify-between mb-8">
         <Link to="/network" className="p-2 hover:bg-muted rounded-full transition-all group">
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
         </Link>
         <div className="flex gap-3">
            <button className="h-10 px-6 rounded-xl border border-border/40 text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all">Report</button>
            <button className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all flex items-center gap-2">
               <Share2 className="w-3.5 h-3.5" /> Share Profile
            </button>
         </div>
      </div>

      {/* HERO SECTION */}
      <div className="relative rounded-[3rem] overflow-hidden shadow-2xl bg-card border border-border/40 mb-12">
         <div className="h-64 w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-600 relative">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
         </div>
         
         <div className="px-12 pb-12 relative">
            <div className="flex flex-col lg:flex-row gap-10 items-end -mt-20">
               <div className="relative">
                  <div className="w-40 h-40 rounded-[2.5rem] bg-background border-[6px] border-card shadow-2xl flex items-center justify-center font-black text-5xl text-foreground mb-2 overflow-hidden">
                     {(isMe && user?.photo) ? (
                       <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                     ) : (
                       <>{creator.name[0]}{creator.name.split(' ')[1]?.[0] || ''}</>
                     )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-2 bg-blue-500 rounded-full border-4 border-card">
                     <CheckCircle className="w-6 h-6 text-white" />
                  </div>
               </div>

               <div className="flex-1 space-y-4 pb-4">
                  <div className="space-y-1">
                     <h2 className="text-4xl font-black tracking-tight flex items-center gap-4">
                        {creator.name} 
                        <div className="flex gap-2">
                           <Instagram className="w-5 h-5 text-muted-foreground" />
                           <Youtube className="w-5 h-5 text-muted-foreground" />
                           <Play className="w-5 h-5 text-muted-foreground" />
                        </div>
                     </h2>
                     <p className="text-muted-foreground font-black uppercase tracking-widest text-xs flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" /> {creator.location} • {creator.handle}
                     </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {creator.niche.map(n => <span key={n} className="px-3 py-1 bg-muted/20 border border-border/30 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground">#{n}</span>)}
                  </div>
               </div>

               <div className="flex gap-3 pb-4">
                  <button className="h-14 px-8 rounded-2xl bg-muted/10 border border-border/40 text-[11px] font-black uppercase tracking-widest hover:bg-muted transition-all flex items-center gap-3">
                     <Mail className="w-4 h-4" /> Message
                  </button>
                  <button className="h-14 px-10 rounded-2xl bg-primary text-primary-foreground text-[11px] font-black uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                     <UserPlus className="w-4 h-4" /> Connect
                  </button>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* LEFT COLL — STATS & ABOUT */}
         <div className="lg:col-span-1 space-y-10">
            <div className="bg-card border border-border/40 rounded-[2.5rem] p-8 shadow-sm space-y-8">
               <div className="grid grid-cols-2 gap-4">
                  {creator.stats.map(s => (
                    <div key={s.label} className="p-5 rounded-[1.5rem] bg-muted/10 border border-border/30 flex flex-col gap-2">
                       <s.icon className="w-5 h-5 text-primary" />
                       <div>
                          <span className="text-[10px] font-black uppercase text-muted-foreground block leading-none mb-1">{s.label}</span>
                          <span className="text-lg font-black text-foreground">{s.val}</span>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-border/20 pb-2">About</h4>
                  <p className="text-sm font-medium leading-relaxed text-foreground/80">{creator.about}</p>
               </div>

               <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-border/20 pb-2">Open To</h4>
                  <div className="flex flex-wrap gap-2">
                     {creator.openTo.map(o => (
                       <div key={o} className="px-3 py-2 bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
                          {o}
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="bg-card border border-border/40 rounded-[2.5rem] p-8 shadow-sm space-y-6">
               <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Brands Previously Worked With</h4>
               <div className="grid grid-cols-3 gap-4 grayscale opacity-40">
                  {['Nike', 'Apple', 'GoPro', 'Uber', 'Amazon', 'Sony'].map(b => (
                    <div key={b} className="aspect-square bg-muted/20 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase">{b}</div>
                  ))}
               </div>
            </div>
         </div>

         {/* RIGHT COLL — PORTFOLIO */}
         <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-xl font-black uppercase tracking-tight">Portfolio Feed</h3>
               <div className="flex gap-4">
                  {['All', 'Reels', 'Static', 'Collabs'].map(f => <button key={f} className={`text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors ${f === 'All' ? 'text-primary underline underline-offset-8' : 'text-muted-foreground'}`}>{f}</button>)}
               </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
               {[1,2,3,4,5,6,7,8,9].map(i => (
                 <div key={i} className="aspect-square bg-muted/20 border border-border/40 rounded-[1.5rem] relative group cursor-pointer overflow-hidden transition-all hover:border-primary/60">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                       <div className="flex items-center gap-1.5 text-white">
                          <Heart className="w-3.5 h-3.5 fill-white" /> <span className="text-[10px] font-black">1.2K</span>
                       </div>
                       <ExternalLink className="w-3.5 h-3.5 text-white" />
                    </div>
                    {/* Placeholder for media */}
                    <div className="w-full h-full flex items-center justify-center">
                       {i % 3 === 0 ? <Play className="w-6 h-6 text-muted-foreground/20" /> : <Instagram className="w-6 h-6 text-muted-foreground/20" />}
                    </div>
                 </div>
               ))}
            </div>

            <button className="w-full py-5 border-2 border-dashed border-border/40 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:border-primary/40 hover:text-primary transition-all">
               Load More Content
            </button>
         </div>
      </div>
    </div>
  );
};
