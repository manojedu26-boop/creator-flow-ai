import React from 'react';
import { motion } from 'framer-motion';
import { usePulse } from '../../contexts/PulseContext';
import { cn } from '../../lib/utils';
import { Sparkles, TrendingUp, TrendingDown, Info } from 'lucide-react';

interface PulseScoreProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDetails?: boolean;
  className?: string;
}

export const PulseScoreRing: React.FC<PulseScoreProps> = ({ 
  size = 'md', 
  showDetails = false,
  className 
}) => {
  const { pulseScore } = usePulse();
  const { score, tier, breakdown } = pulseScore;

  const getTierConfig = (tierName: string) => {
    switch (tierName) {
      case 'Seedling': return { color: 'text-emerald-500', bg: 'from-emerald-500/20 to-emerald-500/5', icon: '🌱', glow: 'shadow-emerald-500/20' };
      case 'Growing': return { color: 'text-teal-500', bg: 'from-teal-500/20 to-teal-500/5', icon: '🌿', glow: 'shadow-teal-500/20' };
      case 'Electric': return { color: 'text-amber-500', bg: 'from-amber-500/20 to-amber-500/5', icon: '⚡', glow: 'shadow-amber-500/20' };
      case 'On Fire': return { color: 'text-rose-500', bg: 'from-rose-500/20 to-rose-500/5', icon: '🔥', glow: 'shadow-rose-500/20' };
      case 'Diamond': return { color: 'text-indigo-500', bg: 'from-indigo-500/20 to-indigo-500/5', icon: '💎', glow: 'shadow-indigo-500/20' };
      case 'ICON': return { color: 'text-purple-600', bg: 'from-purple-600/20 to-amber-400/10', icon: '👑', glow: 'shadow-purple-500/40' };
      default: return { color: 'text-slate-500', bg: 'from-slate-500/20 to-slate-500/5', icon: '✨', glow: 'shadow-slate-500/20' };
    }
  };

  const config = getTierConfig(tier);
  const radius = size === 'xl' ? 80 : size === 'lg' ? 60 : 40;
  const stroke = size === 'xl' ? 12 : 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 1000) * circumference;

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
  };

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div className={cn("relative flex items-center justify-center", sizeClasses[size])}>
        {/* Glow Effect */}
        <div className={cn(
          "absolute inset-4 rounded-full blur-3xl opacity-30 animate-pulse",
          config.bg
        )} />
        
        {/* SVG Ring */}
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90 relative z-10"
        >
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset: circumference }}
            className="text-slate-100"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <motion.circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut" }}
            strokeLinecap="round"
            className={cn(config.color, "drop-shadow-[0_0_8px_rgba(var(--color-rgb),0.5)]")}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Score Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "font-black tracking-tighter leading-none shadow-sm",
              size === 'xl' ? 'text-6xl' : size === 'lg' ? 'text-4xl' : 'text-2xl',
              size === 'xl' ? 'text-slate-950' : 'text-slate-900'
            )}
          >
            {score}
          </motion.span>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={cn(
              "flex items-center gap-1 mt-1 font-black uppercase tracking-widest",
              size === 'xl' ? 'text-[10px]' : 'text-[8px]',
              config.color
            )}
          >
            <span>{config.icon}</span>
            <span>{tier}</span>
          </motion.div>
        </div>
      </div>

      {showDetails && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-premium"
        >
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Platform Health Breakdown</h4>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
              <TrendingUp className="w-3 h-3" />
              <span className="text-[9px] font-black">+12 PTS</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-10 gap-y-6">
            {Object.entries(breakdown).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 capitalize">{key}</span>
                  <span className="text-[10px] font-black text-slate-950">{value}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    className={cn("h-full rounded-full", config.color.replace('text', 'bg'))}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-50">
            <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic text-center">
              "Your high consistency and network strength are driving your DIAMOND status. Focus on growth velocity to hit ICON."
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
