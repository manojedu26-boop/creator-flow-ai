import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "../../components/ui/sonner";
import { 
  Search, Filter, Users, IndianRupee, 
  MapPin, Globe, Star, CheckCircle2,
  ListFilter, Grid, LayoutList, Mail,
  Plus, Check, Sparkles, SlidersHorizontal
} from "lucide-react";
import { db } from "../../lib/db";
import { Link } from "react-router-dom";

export const DiscoverCreators = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [creators, setCreators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [isCelebrating, setIsCelebrating] = useState(false);

  useEffect(() => {
    // Simulated load from DB
    setIsLoading(true);
    setTimeout(() => {
      const allUsers = db.getAll<any>('users').filter(u => u.type === 'Creator');
      setCreators(allUsers);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredCreators = creators.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                         c.niche.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "All" || c.niche.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  const handleApplication = (id: string, status: 'Approved' | 'Skipped') => {
    db.update<any>('applications', id, { status });
    setCreators(prev => prev.filter(a => a.id !== id));
  };

  const toggleCreator = (id: string) => {
    setSelectedCreators(prev => {
      const isSelecting = !prev.includes(id);
      if (isSelecting) {
        toast.info("Creator added", { description: "Added to potential campaign list." });
      }
      return isSelecting ? [...prev, id] : prev.filter(c => c !== id);
    });
  };

  const handleBulkOutreach = () => {
    setIsCelebrating(true);
    toast.success("Outreach Sent!", {
      description: `Messages sent to ${selectedCreators.length} creators via Dragon All.`,
    });
    setTimeout(() => {
      setIsCelebrating(false);
      setSelectedCreators([]);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 text-slate-900">
      {/* SEARCH & FILTERS HEADER */}
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
         <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, niche, or platform..." 
              className="w-full h-16 bg-white border border-slate-200 rounded-[2rem] pl-16 pr-6 text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 shadow-sm transition-all"
            />
         </div>
         <div className="flex items-center gap-4">
            <button className="h-16 px-8 bg-slate-50 border border-slate-200 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-slate-700 flex items-center gap-3 hover:bg-slate-100 transition-all">
               <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
               <button className="p-2.5 rounded-xl bg-slate-950 text-white shadow-sm"><Grid className="w-5 h-5" /></button>
               <button className="p-2.5 rounded-xl text-slate-400 hover:text-slate-900 transition-all"><LayoutList className="w-5 h-5" /></button>
            </div>
         </div>
      </div>

      {/* FILTER PILLS */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
         {['All', 'Fitness', 'Tech', 'Lifestyle', 'Design'].map(f => (
           <span 
             key={f} 
             onClick={() => setActiveFilter(f)}
             className={`whitespace-nowrap px-6 py-3 border rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${
               activeFilter === f ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-950'
             }`}
           >
              {f}
           </span>
         ))}
      </div>

      {/* CREATOR GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="h-[400px] bg-slate-50 border border-slate-100 rounded-[2.5rem] animate-pulse" />
            ))
         ) : filteredCreators.map((c) => (
            <motion.div 
              key={c.id}
              whileHover={{ y: -5 }}
              className={`bg-white border group rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden ${
                selectedCreators.includes(c.id) ? 'border-indigo-600 ring-2 ring-indigo-600/10' : 'border-slate-100 hover:border-indigo-600/40'
              }`}
            >
               {/* Select Button */}
               <button 
                 onClick={() => toggleCreator(c.id)}
                 className={`absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                   selectedCreators.includes(c.id) ? 'bg-indigo-600 text-white' : 'bg-slate-50 border border-slate-200 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-900'
                 }`}
               >
                  {selectedCreators.includes(c.id) ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
               </button>

               <div className="flex flex-col items-center text-center space-y-4 pt-4">
                  <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-600 flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-indigo-600/10">
                     {c.photo ? <img src={c.photo} className="w-full h-full object-cover rounded-[2rem]" /> : (c.name[0] + (c.name.split(' ')[1]?.[0] || ''))}
                  </div>
                  <div>
                     <h4 className="text-lg font-black text-slate-950 uppercase tracking-tight">{c.name}</h4>
                     <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">{c.niche}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 w-full pt-4">
                     <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Reach</span>
                        <span className="text-xs font-black text-slate-900">{c.followerCounts?.ig || '10K'}</span>
                     </div>
                     <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Engage</span>
                        <span className="text-xs font-black text-slate-900">4.8%</span>
                     </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                     <MapPin className="w-3 h-3 text-indigo-500" /> Mumbai, IN
                  </div>

                  <Link to={`/network/profile/${c.id === 'u1' ? 'me' : c.id}`} className="w-full h-12 mt-4 bg-slate-50 hover:bg-slate-950 border border-slate-200 text-slate-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center">
                     View Profile
                  </Link>
               </div>
            </motion.div>
         ))}
      </div>

      {/* FLOATING ACTION BAR FOR BULK OUTREACH */}
      <AnimatePresence>
         {selectedCreators.length > 0 && (
            <motion.div 
              initial={{ y: 100 }} 
              animate={{ y: 0 }} 
              exit={{ y: 100 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[600px] z-50 bg-slate-950 border border-slate-900 p-6 rounded-[2.5rem] shadow-floating flex items-center justify-between"
            >
               <div className="flex items-center gap-6">
                  <div className="bg-indigo-500/20 text-indigo-400 w-12 h-12 rounded-2xl flex items-center justify-center font-black">
                     {selectedCreators.length}
                  </div>
                  <div>
                     <h5 className="text-sm font-black text-white">Creators Selected</h5>
                     <p className="text-[10px] font-bold text-slate-500 uppercase">Combined Reach: 2.8M</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button className="h-12 px-6 rounded-2xl border border-slate-800 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-900 transition-all">Add to Campaign</button>
                  <button 
                     onClick={handleBulkOutreach}
                     disabled={isCelebrating}
                     className="h-12 px-8 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative hover:bg-indigo-500"
                   >
                      {isCelebrating && (
                        <motion.div 
                         initial={{ y: 20 }} animate={{ y: 0 }}
                         className="absolute inset-0 bg-emerald-500 flex items-center justify-center"
                        >
                           <Check className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                      <Mail className="w-4 h-4" /> Bulk Outreach
                   </button>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

       {/* CONFETTI OVERLAY */}
       {isCelebrating && (
          <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
             <div className="animate-confetti-burst w-full h-full" />
          </div>
       )}
    </div>
  );
};
