
import React from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  iconOnly?: boolean;
  /** If true, places icon to the right of text. Defaults to left. */
  reverse?: boolean;
  onClick?: () => void;
}

export const Logo = ({ 
  className, 
  iconClassName, 
  textClassName,
  iconOnly = false, 
  reverse = false,
  onClick 
}: LogoProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate("/");
    }
  };

  return (
    <div 
      className={cn(
        "flex items-center gap-4 cursor-pointer group select-none", 
        reverse ? "flex-row-reverse" : "flex-row",
        className
      )}
      onClick={handleClick}
    >
      {/* High-Fidelity Icon Frame */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative shrink-0 w-12 h-12 flex items-center justify-center transition-all duration-500",
          "rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,85,212,0.2)] group-hover:shadow-[0_15px_40px_rgb(0,85,212,0.4)]",
          "border border-white/20",
          iconClassName
        )}
      >
        <div className="absolute inset-0 bg-blue-600/5 blur-xl group-hover:bg-blue-600/10 transition-colors" />
        <img 
          src="/logo.png" 
          alt="CF" 
          className="w-full h-full object-contain relative z-10 p-1"
          onError={(e) => {
            (e.target as any).style.display = 'none';
            (e.target as any).parentElement.innerHTML = '<span class="text-blue-600 font-extrabold text-2xl uppercase tracking-tighter">CF</span>';
          }}
        />
      </motion.div>

      {/* Dynamic Brand Text */}
      {!iconOnly && (
        <motion.div 
          initial={{ opacity: 0, x: reverse ? 10 : -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <span className={cn(
            "text-white font-black text-2xl tracking-tighter uppercase leading-[0.8]",
            textClassName
          )}>
            CREATORFORGE<span className="text-blue-500 italic">AI</span>
          </span>
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500 mt-1 ml-0.5">
            HQ GLOBAL SYSTEM
          </span>
        </motion.div>
      )}
    </div>
  );
};
