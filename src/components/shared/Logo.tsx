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

/**
 * RESTORED IDENTITY NODE v4.0
 * Official high-fidelity vector representation for CreatorForge AI.
 * Replaces corrupted legacy placeholders with a premium Obsidian Blue technical identifier.
 */
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
      {/* RESTORED IDENTITY NODE: High-Fidelity Technical Vector */}
      <motion.div 
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative shrink-0 flex items-center justify-center transition-all duration-300",
          "w-9 h-9", // Controlled default size
          iconClassName
        )}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(59,130,246,0.35)]">
          <defs>
            <linearGradient id="logo-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="logo-grad-accent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          
          {/* External Technical Ring */}
          <circle 
            cx="50" cy="50" r="45" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" 
            className="text-slate-200/50"
            strokeDasharray="10 5"
          />
          
          {/* Core Identity Octagon */}
          <path 
            d="M50 5 L85 20 L95 50 L85 80 L50 95 L15 80 L5 50 L15 20 Z" 
            fill="url(#logo-grad-accent)"
            className="stroke-blue-500/30"
            strokeWidth="2"
          />
          
          {/* Central 'C' Prism */}
          <path 
            d="M40 35 Q30 35 30 50 Q30 65 40 65 L45 65 Q55 65 55 50 Q55 35 45 35 Z" 
            fill="none" 
            stroke="url(#logo-grad-primary)" 
            strokeWidth="8"
            strokeLinecap="round"
            className="drop-shadow-[0_0_3px_rgba(59,130,246,0.8)]"
          />
          
          {/* Neural Connectivity Node */}
          <circle cx="50" cy="50" r="4" fill="#3b82f6">
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </motion.div>

      {/* Dynamic Brand Text: High-Density Unification */}
      {!iconOnly && (
        <motion.div 
          initial={{ opacity: 0, x: reverse ? 10 : -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <span className={cn(
            "text-slate-950 font-black text-2xl tracking-tighter uppercase leading-[0.8]",
            textClassName
          )}>
            CREATORFORGE<span className="text-blue-600 italic">AI</span>
          </span>
          <span className="text-[7.5px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1.5 ml-0.5">
            Elite Creator Interface
          </span>
        </motion.div>
      )}
    </div>
  );
};
