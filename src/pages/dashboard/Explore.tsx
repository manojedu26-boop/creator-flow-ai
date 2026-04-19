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

        {/* Global Hub Header (Compressed) */}
        <header className="pt-8 pb-6 px-4 md:px-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-indigo-600/5 blur-[120px] -z-10 rounded-full" />
           <div className="max-w-7xl mx-auto space-y-2">
              <div className="flex items-center gap-3">
                 <div className="px-3 py-1 bg-slate-950 text-white rounded-full pro-tag border-slate-800 flex items-center gap-2">
                    <Globe className="w-3 h-3 text-indigo-400" /> Platform Multi-Node
                 </div>
                 <span className="pro-label italic opacity-40">Discovery Node 3.5</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter text-slate-950 uppercase leading-none">
                 The <span className="text-indigo-600">Discovery</span> Hub
              </h1>
              <p className="pro-label text-xs tracking-tight max-w-xl leading-relaxed">
                 Real-time platform topology and high-velocity trend identification.
              </p>
           </div>
        </header>

        {/* Section 1: Search & Niche (Sticky) */}
        <ExploreSearch />

        <div className="max-w-7xl mx-auto space-y-12 pt-10">
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
           <section className="px-8 flex items-center justify-center pt-10">
              <div className="w-full max-w-3xl p-8 bg-slate-950 rounded-[2.5rem] text-center space-y-6 relative overflow-hidden shadow-2xl">
                 <div className="absolute inset-0 bg-indigo-600/10 blur-[80px] -z-10" />
                 <div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto flex items-center justify-center border border-white/10">
                    <Compass className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '8s' }} />
                 </div>
                 <div className="space-y-1">
                    <h2 className="text-2xl font-semibold text-white uppercase tracking-tight">Node Active</h2>
                    <p className="pro-label text-slate-500 max-w-xs mx-auto leading-relaxed">
                       Synchronizing global creator clusters. Updates every 15m.
                    </p>
                 </div>
                 <button className="h-14 px-10 bg-white text-slate-950 rounded-xl pro-label font-bold text-slate-950 tracking-[0.2em] hover:bg-white/90 transition-all shadow-md active:scale-95 flex items-center gap-3 mx-auto">
                   Refresh Systems <Sparkles className="w-4 h-4" />
                 </button>
              </div>
           </section>
        </div>
      </div>
    </PageTransition>
  );
};
