import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ExploreSearch } from '@/components/explore/ExploreSearch';
import { TrendingNow } from '@/components/explore/TrendingNow';
import { CreatorSpotlight } from '@/components/explore/CreatorSpotlight';
import { BentoDiscovery } from '@/components/explore/BentoDiscovery';
import { NicheLeaderboard } from '@/components/explore/NicheLeaderboard';
import { BrandCastingBoard } from '@/components/explore/BrandCastingBoard';
import { CollabBazaar } from '@/components/explore/CollabBazaar';
import { PageTransition } from '@/components/shared/MotionComponents';
import { Sparkles, Globe, Compass } from 'lucide-react';

export const Explore = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-white pb-32">
        {/* Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 origin-left z-[1000]"
          style={{ scaleX }}
        />

        {/* Global Hub Header */}
        <header className="pt-16 pb-10 px-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-indigo-600/5 blur-[120px] -z-10 rounded-full animate-pulse" />
           <div className="max-w-7xl mx-auto space-y-4">
              <div className="flex items-center gap-4">
                 <div className="px-5 py-2 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-xl flex items-center gap-3">
                    <Globe className="w-4 h-4 text-indigo-400" /> Platform Intelligence
                 </div>
                 <div className="h-0.5 w-12 bg-slate-100" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Discovery Engine V3.0</span>
              </div>
              <h1 className="text-7xl font-black uppercase tracking-tighter text-slate-950 leading-[0.9]">
                 The <span className="text-indigo-600 underline decoration-indigo-600/20 underline-offset-[12px]">Discovery</span> Engine
              </h1>
              <p className="text-xl font-black text-slate-400 uppercase tracking-tight max-w-2xl leading-relaxed">
                 Access real-time platform topology, identify high-velocity trends, and secure premium brand node connections.
              </p>
           </div>
        </header>

        {/* Section 1: Search & Niche (Sticky) */}
        <ExploreSearch />

        <div className="max-w-7xl mx-auto space-y-32 pt-20">
           {/* Section 2: Trending Now */}
           <TrendingNow />

           {/* Section 3: Creator Spotlight */}
           <CreatorSpotlight />

           {/* Section 4: Bento Discovery Grid */}
           <BentoDiscovery />

           {/* Section 5: Niche Leaderboard */}
           <NicheLeaderboard />

           {/* Section 6: Brand Casting Board */}
           <BrandCastingBoard />

           {/* Section 7: Collab Bazaar */}
           <CollabBazaar />
           
           {/* Final Hub Call to Action */}
           <section className="px-8 flex items-center justify-center pt-20">
              <div className="w-full max-w-4xl p-16 bg-slate-950 rounded-[4rem] text-center space-y-10 relative overflow-hidden shadow-2xl">
                 <div className="absolute inset-0 bg-indigo-600/10 blur-[80px] -z-10" />
                 <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] mx-auto flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                    <Compass className="w-12 h-12 text-white animate-spin" style={{ animationDuration: '8s' }} />
                 </div>
                 <div className="space-y-4">
                    <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Your Intelligence Node is Active</h2>
                    <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-relaxed">
                       You are currently synchronizing with the global creator cluster. Fresh trends and opportunities arrive every 15 minutes.
                    </p>
                 </div>
                 <button className="h-16 px-12 bg-white text-slate-950 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.4em] hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95 flex items-center gap-4 mx-auto">
                   Refresh All Systems <Sparkles className="w-5 h-5" />
                 </button>
              </div>
           </section>
        </div>
      </div>
    </PageTransition>
  );
};
