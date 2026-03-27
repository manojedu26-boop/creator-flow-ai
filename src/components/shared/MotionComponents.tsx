import { motion, AnimatePresence, useSpring, useTransform, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

// Section 14.1: Page transitions
export const PageTransition = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Section 14.2: Count-up numbers
export const CountUp = ({ value, prefix = "", suffix = "", decimals = 0 }: { value: number, prefix?: string, suffix?: string, decimals?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 700;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuad = (t: number) => t * (2 - t);
      
      const current = start + (end - start) * easeOutQuad(progress);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [value]);

  return (
    <span>
      {prefix}{displayValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
};

// Section 14.10: AI-powered shimmer button
export const ShimmerButton = ({ children, onClick, className = "" }: { children: React.ReactNode, onClick?: () => void, className?: string }) => (
  <button 
    onClick={onClick}
    className={`relative overflow-hidden group transition-all active:scale-95 ${className}`}
  >
    <motion.div 
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"
      initial={{ x: "-100%" }}
      animate={{ x: "200%" }}
      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
    />
    <div className="relative flex items-center justify-center gap-2">
      <Sparkles className="w-4 h-4" />
      {children}
    </div>
  </button>
);

// Section 14.12: Skeleton Loading Shimmer
export const SkeletonCard = ({ className = "" }: { className?: string }) => (
  <div className={`w-full h-40 bg-muted/10 rounded-[2rem] border border-border/40 overflow-hidden relative ${className}`}>
    <motion.div 
      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
      animate={{ x: ["-100%", "200%"] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
    />
  </div>
);

// Section 14.14: Typewriter Effect
export const Typewriter = ({ text, speed = 30 }: { text: string, speed?: number }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayedText}</span>;
};

// Section 14.15: Staggered entrance animations
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};
