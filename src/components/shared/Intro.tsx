import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const Intro = ({ onComplete }: { onComplete: () => void }) => {
  const [isDone, setIsDone] = useState(false);
  const text = "CREATORFORGE";
  const letters = text.split("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDone(true);
      setTimeout(onComplete, 1200); // Increased for smoother exit
    }, 4500); // Slightly longer for the cinematic reveal
    return () => clearTimeout(timer);
  }, [onComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.8,
      },
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      filter: "blur(20px)",
      transition: { duration: 1.2, ease: "easeInOut" }
    } as any,
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      z: -1000,
      y: 50,
      rotateX: -100,
      rotateY: 20,
      filter: "blur(10px)",
    },
    visible: { 
      opacity: 1, 
      z: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      filter: "blur(0px)",
      transition: { 
        type: "spring",
        damping: 15,
        stiffness: 70,
        mass: 1.2
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
          className="fixed inset-0 z-[9999] bg-[#07071A] flex flex-col items-center justify-center overflow-hidden"
          style={{ perspective: "2000px" }}
        >
          {/* CINEMATIC LIGHTING */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div 
               animate={{ 
                 opacity: [0.1, 0.2, 0.1],
                 scale: [1, 1.1, 1]
               }}
               transition={{ duration: 6, repeat: Infinity }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[150px] rounded-full"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
          </div>

          <div className="flex gap-2 md:gap-6 select-none relative z-10" style={{ transformStyle: "preserve-3d" }}>
            {letters.map((char, i) => (
              <motion.span
                key={i}
                variants={letterVariants}
                className="text-6xl md:text-8xl lg:text-[10rem] font-bebas tracking-tighter text-white relative inline-block group"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Main Letter */}
                <span className="relative z-10 block">{char}</span>
                
                {/* 3D Depth Layer */}
                <span className="absolute inset-0 text-primary/10 -translate-z-2 blur-[1px] select-none block" style={{ transform: "translateZ(-10px)" }}>
                    {char}
                </span>

                {/* Light Sweep Effect */}
                <motion.div 
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: "200%", opacity: [0, 1, 0] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 3,
                    delay: i * 0.1 + 2
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 pointer-events-none"
                />
              </motion.span>
            ))}
          </div>

          {/* SYSTEM INITIALIZING DECOR */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 1.2 }}
            className="absolute bottom-24 flex flex-col items-center gap-6"
          >
             <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-white/20" />
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.8em] text-white/40">Initializing Engine</span>
                <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-white/20" />
             </div>
             
             <div className="flex gap-1.5">
                {[...Array(3)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ 
                      scaleY: [1, 2, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{ 
                      duration: 0.8, 
                      repeat: Infinity, 
                      delay: i * 0.2 
                    }}
                    className="w-[2px] h-3 bg-primary"
                  />
                ))}
             </div>
          </motion.div>

          {/* CORNER DECOR */}
          <div className="absolute top-12 left-12 font-mono text-[8px] text-white/20 uppercase tracking-widest hidden md:block">
            Forge-OS v4.2.0 // Terminal
          </div>
          <div className="absolute bottom-12 right-12 font-mono text-[8px] text-white/20 uppercase tracking-widest hidden md:block">
            00:00:CORE_STABLE
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
