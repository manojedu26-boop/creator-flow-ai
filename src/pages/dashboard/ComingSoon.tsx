import { motion } from "framer-motion";

export const ComingSoon = ({ title }: { title: string }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="h-[60vh] flex flex-col items-center justify-center text-center gap-4"
  >
    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
      <span className="text-4xl animate-pulse">🚧</span>
    </div>
    <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
    <p className="text-muted-foreground max-w-md">
      This module is part of the CreatorForge AI architecture and is currently under construction. Check back soon!
    </p>
    <button className="mt-4 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-[0_0_20px_-5px_hsl(var(--primary))] transition-all active:scale-[0.98]">
      Notify Me When Live
    </button>
  </motion.div>
);
