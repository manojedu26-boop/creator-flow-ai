import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Search, Filter, Sparkles, 
  MessageSquare, Heart, Share2, Link2, 
  CheckCircle, Briefcase, Trophy, Lightbulb,
  MoreHorizontal, PlusCircle, Globe, MapPin, 
  ChevronRight, TrendingUp, UserPlus
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "../../components/ui/sonner";

type FeedFilter = 'all' | 'collabs' | 'castings' | 'wins' | 'tips';

export const Network = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('all');

  return (
    <div className="flex h-[calc(100vh-80px)] -mx-8 -my-6 overflow-hidden">
      {/* LEFT PANE — DISCOVER */}
      <div className="w-[300px] border-r border-border/30 bg-card/10 overflow-y-auto p-6 space-y-8 no-scrollbar">
         <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
               <Globe className="w-3.5 h-3.5" /> Discover
            </h3>
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <input placeholder="Search creators..." className="w-full h-11 bg-muted/20 border border-border/40 rounded-xl pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
         </div>

         <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Suggested Matches</h4>
            <div className="space-y-3">
               {[
                 { name: 'Leo Marcus', niche: 'VFX / 3D', followers: '12K', avatar: 'LM' },
                 { name: 'Elena Sun', niche: 'Minimalist Design', followers: '8K', avatar: 'ES' },
                 { name: 'Rohan D.', niche: 'Tech Reviews', followers: '55K', avatar: 'RD' },
               ].map(c => (
                 <div key={c.name} className="flex items-center gap-3 p-3 rounded-2xl border border-border/30 hover:border-primary/40 transition-all cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary text-xs shrink-0">{c.avatar}</div>
                    <div className="flex-1 min-w-0">
                       <p className="text-xs font-black truncate">{c.name}</p>
                       <span className="text-[9px] font-bold text-muted-foreground uppercase">{c.niche}</span>
                    </div>
                    <button className="p-2 opacity-0 group-hover:opacity-100 bg-primary/10 text-primary rounded-lg transition-all"><UserPlus className="w-3.5 h-3.5" /></button>
                 </div>
               ))}
            </div>
         </div>

         <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live Brand Castings</h4>
            <div className="space-y-3">
               {[
                 { brand: 'Adobe', requirement: 'Creative Cloud Tutorial', budget: '$2K+' },
                 { brand: 'Samsung', requirement: 'New Galaxy Promo', budget: '$5K+' },
               ].map(b => (
                 <div key={b.brand} className="p-4 rounded-2xl bg-muted/20 border border-border/40 hover:bg-muted/30 cursor-pointer transition-all">
                    <div className="flex justify-between items-start mb-1">
                       <span className="text-xs font-black">{b.brand}</span>
                       <span className="text-[9px] font-black text-emerald-500">{b.budget}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">{b.requirement}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* CENTRE PANE — FEED */}
      <div className="flex-1 overflow-y-auto bg-muted/5 p-8 no-scrollbar scroll-smooth">
         <div className="max-w-2xl mx-auto space-y-6">
            {/* AI assisted composer */}
            <div className="bg-card border border-border/40 rounded-[2rem] p-6 shadow-xl relative group">
               <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary shrink-0" />
                  <div className="flex-1 flex flex-col justify-center">
                     <p className="text-sm font-bold text-muted-foreground">What's the latest in your creator journey?</p>
                  </div>
                  <button className="h-10 px-6 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2">
                     <Sparkles className="w-3.5 h-3.5" /> AI Assist
                  </button>
               </div>
               <div className="mt-6 flex items-center gap-6 px-2 border-t border-border/20 pt-4">
                  {[
                    { icon: Briefcase, label: 'Collab Opp' },
                    { icon: Trophy, label: 'Share a Win' },
                    { icon: Lightbulb, label: 'Post a Tip' },
                  ].map(a => (
                    <button key={a.label} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                       <a.icon className="w-4 h-4" /> {a.label}
                    </button>
                  ))}
               </div>
            </div>

            {/* FEED FILTERS */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
               {['all', 'collabs', 'castings', 'wins', 'tips'].map(f => (
                 <button 
                  key={f} 
                  onClick={() => setActiveFilter(f as FeedFilter)}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeFilter === f ? 'bg-black text-white shadow-xl' : 'bg-card border border-border/40 text-muted-foreground hover:border-primary/40'
                  }`}
                 >
                    {f}
                 </button>
               ))}
            </div>

            {/* FEED ITEMS */}
            <div className="space-y-6">
               {[
                 { id: 1, type: 'collab', author: 'Maya Hills', avatar: 'MH', niche: 'Travel / Wellness', content: 'Looking for a NYC-based creator for a high-energy vlog swap! My audience is 85% US-based. Hit me up if you are interested in a day-in-the-life series.', followers: '24K', time: '2h ago' },
                 { id: 2, type: 'win', author: 'David V.', avatar: 'DV', niche: 'Gaming', content: 'Just signed my first long-term contract with Razer! 🐉 Huge shoutout to the Forge AI community for the pitch feedback. Keep grinding everyone!', followers: '105K', time: '5h ago' },
                 { id: 3, type: 'casting', author: 'Lululemon', avatar: 'LL', niche: 'Brand', content: 'URGENT: Looking for fitness creators in London for an upcoming popup shop opening. 3-week campaign starting April 1st. Application link in profile.', followers: 'Brand', time: '8h ago' },
               ].map(post => (
                 <motion.div 
                   layout
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   key={post.id} 
                   className="bg-card border border-border/40 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
                 >
                    <div className="flex justify-between items-start mb-6">
                       <div className="flex gap-4">
                          <Link to={`/network/profile/${post.id}`} className="w-14 h-14 rounded-[1.25rem] bg-muted flex items-center justify-center font-black text-lg text-foreground border border-border/40 hover:scale-105 transition-transform">
                             {post.avatar}
                          </Link>
                          <div>
                             <h4 className="font-black text-base flex items-center gap-1.5">
                                {post.author} <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
                             </h4>
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">{post.niche} • {post.followers}</span>
                                <span className="text-[10px] text-muted-foreground opacity-50">• {post.time}</span>
                             </div>
                          </div>
                       </div>
                       <button className="p-2 hover:bg-muted rounded-full text-muted-foreground"><MoreHorizontal className="w-5 h-5" /></button>
                    </div>

                    <div className="space-y-4">
                       <p className="text-sm font-medium leading-[1.7] text-foreground/90">{post.content}</p>
                       <div className="pt-6 border-t border-border/30 flex items-center justify-between">
                          <div className="flex items-center gap-6">
                             <button className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground hover:text-rose-500 transition-colors">
                                <Heart className="w-4 h-4" /> 84
                             </button>
                             <button className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors">
                                <MessageSquare className="w-4 h-4" /> 12
                             </button>
                             <button className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors">
                                <Share2 className="w-4 h-4" /> Share
                             </button>
                          </div>
                          <button className="h-10 px-6 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95">
                             {post.type === 'casting' ? 'Apply Now' : 'Connect'}
                          </button>
                       </div>
                    </div>
                    {post.type === 'win' && (
                       <div className="absolute top-0 right-0 p-8 pt-6 pointer-events-none">
                          <Trophy className="w-20 h-20 text-indigo-500 opacity-[0.05] -rotate-12" />
                       </div>
                    )}
                 </motion.div>
               ))}
            </div>
         </div>
      </div>

      {/* RIGHT PANE — YOUR PROFILE PREVIEW */}
      <div className="w-[300px] border-l border-border/30 bg-card/10 overflow-y-auto p-8 space-y-10 no-scrollbar">
         <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
               <TrendingUp className="w-3.5 h-3.5" /> Your Presence
            </h3>
            
            <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-tr from-primary/20 to-secondary/20" />
               <div className="relative mt-8 space-y-4 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-background border-4 border-card shadow-2xl flex items-center justify-center font-black text-2xl overflow-hidden">
                     {user?.photo ? (
                       <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                     ) : (
                       <span>{user?.name?.[0]}{user?.name?.split(' ')[1]?.[0]}</span>
                     )}
                  </div>
                  <div>
                     <h4 className="font-black text-lg">{user?.name || 'Creator'}</h4>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase">{user?.niche || 'Fitness'} • Mumbai</p>
                  </div>
                  <Link to="/network/profile/me" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View Full Profile</Link>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div className="p-4 rounded-2xl bg-muted/10 border border-border/40">
                  <span className="text-xl font-black text-foreground block">142</span>
                  <span className="text-[9px] font-black text-muted-foreground uppercase">Connections</span>
               </div>
               <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                  <span className="text-xl font-black text-emerald-500 block">3</span>
                  <span className="text-[9px] font-black text-emerald-500 uppercase">Brand Views</span>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center text-[10px] font-black uppercase">
                  <span>Profile Strength</span>
                  <span className="text-primary">78%</span>
               </div>
               <div className="h-2 w-full bg-muted/20 rounded-full overflow-hidden border border-border/30">
                  <motion.div initial={{ width: 0 }} animate={{ width: '78%' }} className="h-full bg-gradient-to-r from-primary to-secondary" />
               </div>
               <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-4 group cursor-pointer hover:bg-primary/10 transition-colors">
                  <PlusCircle className="w-6 h-6 text-primary" />
                  <p className="text-[9px] font-bold leading-tight uppercase">Add a portfolio project to reach 100%</p>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Recent Network Activity</h3>
            <div className="space-y-4">
               {[
                 { user: 'Nike', act: 'viewed your profile', time: '1d ago' },
                 { user: 'Sarah Chen', act: 'commented on your win', time: '2d ago' },
               ].map((a, i) => (
                 <div key={i} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <p className="text-[11px] font-medium leading-relaxed">
                       <span className="font-black">{a.user}</span> {a.act}
                       <span className="block text-[9px] text-muted-foreground opacity-50">{a.time}</span>
                    </p>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};
