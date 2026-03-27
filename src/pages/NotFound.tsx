import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-0" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="flex items-center gap-4 justify-center mb-12">
          <Sparkles className="w-12 h-12 text-primary animate-pulse" />
          <span className="font-black tracking-tighter text-4xl uppercase">CreatorForge</span>
        </div>

        <h1 className="text-[120px] font-black tracking-tighter leading-none mb-4 text-gradient-primary opacity-20">404</h1>
        
        <h2 className="text-2xl font-black uppercase tracking-tight mb-4">You've reached the Edge of the Creatorverse</h2>
        <p className="text-muted-foreground font-bold text-sm max-w-[400px] mb-10 leading-relaxed mx-auto">
          Seems like this content has been demonetized, deleted, or never existed in this timeline. Don't worry, your stats are safe.
        </p>

        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-white font-black uppercase tracking-widest text-[11px] rounded-[2rem] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Command Centre
        </Link>
      </motion.div>

      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -z-10" />
    </div>
  );
}
