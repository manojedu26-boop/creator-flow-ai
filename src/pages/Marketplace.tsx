
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, DollarSign, Briefcase, 
  ChevronRight, Sparkles, Zap, Tag, Clock,
  MapPin, Globe, ExternalLink, ShieldCheck
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "@/components/shared/MotionComponents";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

// TS Interface for Listings
interface BrandListing {
  id: string;
  brand_name: string;
  logo_url: string;
  campaign_brief: string;
  budget_min: number;
  budget_max: number;
  niche_tags: string[];
  platform_requirements: string[];
  deadline: string;
}

export const Marketplace = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);

  const { data: listings, isLoading } = useQuery({
    queryKey: ['brand_listings', searchQuery, selectedNiche],
    queryFn: async () => {
      let query = supabase
        .from('brand_listings')
        .select('*')
        .eq('status', 'listed');
      
      if (searchQuery) {
        query = query.ilike('brand_name', `%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      // Client-side niche filter
      if (selectedNiche) {
        return (data as BrandListing[]).filter(l => l.niche_tags.includes(selectedNiche));
      }
      
      return data as BrandListing[];
    }
  });

  const niches = ["Fitness", "Adventure", "Extreme Sports", "Running", "Supplements", "Lifestyle"];

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      <Navbar />
      
      <main className="pt-32 pb-64 px-6">
        <div className="container max-w-7xl">
          {/* Header & Search */}
          <div className="mb-20 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-10 shadow-2xl shadow-blue-900/20">
                 <ShieldCheck className="w-4 h-4" /> Global Monetization Surface
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-10 uppercase italic">
                The Gold <br />
                <span className="text-blue-500 not-italic">Marketplace.</span>
              </h1>
              <p className="text-slate-400 font-medium text-lg md:text-2xl leading-relaxed italic">
                Disrupt your revenue trajectory. Direct access to the world's most ambitious brand campaigns.
              </p>
            </motion.div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search brands..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-20 bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-blue-600/20 focus:border-blue-500 transition-all shadow-2xl"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {niches.map(niche => (
                  <button 
                    key={niche}
                    onClick={() => setSelectedNiche(selectedNiche === niche ? null : niche)}
                    className={`h-12 px-6 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                      selectedNiche === niche 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="aspect-[4/5] rounded-[3.5rem] bg-white/5 border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              <AnimatePresence mode="popLayout">
                {listings?.map((listing, i) => (
                  <motion.div
                    key={listing.id}
                    layoutId={listing.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative rounded-[3.5rem] bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-12 flex flex-col hover:border-blue-500 transition-all duration-500 cursor-pointer overflow-hidden h-[540px]"
                    onClick={() => navigate(`/marketplace/${listing.id}`)}
                  >
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-40" />
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
                    
                    <div className="relative z-10 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-10">
                        <div className="w-20 h-20 rounded-[2rem] bg-slate-950 border border-white/10 p-3 shadow-2xl group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                          <img 
                            src={listing.logo_url} 
                            alt={listing.brand_name} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-[8px] font-black uppercase tracking-widest text-blue-500 shadow-xl">
                          Live Opportunity
                        </div>
                      </div>

                      <h3 className="text-3xl font-black tracking-tighter uppercase mb-2 group-hover:text-blue-500 transition-colors">
                        {listing.brand_name}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mb-8">
                        {listing.niche_tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-slate-500">{tag}</span>
                        ))}
                      </div>

                      <p className="text-md text-slate-400 font-medium leading-relaxed italic mb-10 line-clamp-3">
                        "{listing.campaign_brief}"
                      </p>

                      <div className="mt-auto space-y-6">
                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                           <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Campaign Budget</p>
                              <p className="text-2xl font-black text-blue-500 tracking-tighter leading-none">
                                ₹{(listing.budget_min / 1000).toFixed(0)}K - ₹{(listing.budget_max / 1000).toFixed(0)}K
                              </p>
                           </div>
                           <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500">
                              <ChevronRight className="w-6 h-6 text-white" />
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && listings?.length === 0 && (
            <div className="py-40 text-center">
               <p className="text-xl font-bold text-slate-500 uppercase tracking-widest italic mb-6">No matching campaigns found</p>
               <button onClick={() => {setSearchQuery(""); setSelectedNiche(null);}} className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] underline decoration-2 underline-offset-8">Reset Filters</button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
