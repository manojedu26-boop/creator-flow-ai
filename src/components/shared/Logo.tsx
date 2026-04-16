import React from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  iconOnly?: boolean;
  onClick?: () => void;
}

export const Logo = ({ 
  className, 
  iconClassName, 
  textClassName,
  iconOnly = false, 
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
      className={cn("flex items-center gap-3 cursor-pointer group", className)}
      onClick={handleClick}
    >
      <div className={cn(
        "relative shrink-0 w-11 h-11 flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95",
        iconClassName
      )}>
        <img 
          src="/logo.png" 
          alt="CreatorForge AI" 
          className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          onError={(e) => {
            // Fallback to a styled CF text if image is missing
            (e.target as any).style.display = 'none';
            (e.target as any).parentElement.innerHTML = '<span class="text-amber-500 font-black text-xl">CF</span>';
          }}
        />
      </div>
      {!iconOnly && (
        <span className={cn(
          "text-white font-black text-2xl tracking-tighter uppercase",
          textClassName
        )}>
          CREATORFORGE<span className="text-blue-500">AI</span>
        </span>
      )}
    </div>
  );
};
