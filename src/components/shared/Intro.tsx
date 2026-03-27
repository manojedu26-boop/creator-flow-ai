import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const Intro = ({ onComplete }: { onComplete: () => void }) => {
  const [isDone, setIsDone] = useState(false);
  const text = "CREATORFORGE";
  const letters = text.split("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDone(true);
      setTimeout(onComplete, 1000); // Wait for exit animation
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      transition: { duration: 1 }
    },
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 100, 
      rotateX: -90, 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0, 
      transition: { 
        type: "spring",
        damping: 12,
        stiffness: 100
      } as any
    },
  };

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden perspective-1000"
        >
          {/* Ambient Background Glow */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-x-0 h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"
          />

          <div className="flex gap-2 md:gap-4 select-none">
            {letters.map((char, i) => (
              <motion.span
                key={i}
                variants={letterVariants}
                className="text-4xl md:text-7xl lg:text-9xl font-black tracking-tighter text-white relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                {char}
                {/* Secondary Ghost Letter for Depth */}
                <motion.span
                  className="absolute inset-0 text-primary/30 blur-sm -z-10"
                  animate={{ 
                    x: [0, 5, 0],
                    y: [0, -5, 0],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: i * 0.1 
                  }}
                >
                  {char}
                </motion.span>
              </motion.span>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="absolute bottom-20 flex flex-col items-center gap-4"
          >
             <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">The Future of Creation</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
