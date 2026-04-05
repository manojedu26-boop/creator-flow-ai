import React, { useState, useEffect, useCallback } from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Home, BarChart3, Briefcase, Video, 
  Calendar, Zap, Settings, User, LogOut, 
  ArrowRight, Sparkles, Command as CommandIcon,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [search, setSearch] = useState("");

  const runCommand = useCallback((command: () => void) => {
    command();
    onClose();
    setSearch("");
  }, [onClose]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
      }
      
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-command flex items-start justify-center pt-[15vh] p-4 sm:p-6 md:p-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-[2.5rem] shadow-floating overflow-hidden"
          >
            <Command className="flex flex-col h-full max-h-[60vh] md:max-h-[500px]">
              <div className="flex items-center px-8 border-b border-slate-100">
                <Search className="w-5 h-5 text-slate-400" />
                <Command.Input
                  autoFocus
                  placeholder="Type a command or search..."
                  value={search}
                  onValueChange={setSearch}
                  className="flex-1 h-20 px-4 bg-transparent border-none text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-0 text-base"
                />
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">ESC</span>
                </div>
              </div>

              <Command.List className="overflow-y-auto p-4 md:p-6 no-scrollbar h-full">
                <Command.Empty className="py-12 text-center">
                   <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100 italic font-serif">?</div>
                   <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">No Intelligence Found</p>
                </Command.Empty>

                <Command.Group heading={<span className="px-4 mb-4 block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Primary Nodes</span>}>
                  <CommandItem 
                    onSelect={() => runCommand(() => navigate("/dashboard"))}
                    icon={<Home className="w-4 h-4" />}
                    label="Command Dashboard"
                    shortcut="G D"
                  />
                  <CommandItem 
                    onSelect={() => runCommand(() => navigate("/analytics"))}
                    icon={<BarChart3 className="w-4 h-4" />}
                    label="Analytics Intelli-Room"
                    shortcut="G A"
                  />
                  <CommandItem 
                    onSelect={() => runCommand(() => navigate("/studio"))}
                    icon={<Video className="w-4 h-4" />}
                    label="AI Content Studio"
                    shortcut="G S"
                  />
                  <CommandItem 
                    onSelect={() => runCommand(() => navigate("/deals"))}
                    icon={<Briefcase className="w-4 h-4" />}
                    label="Brand Pipeline"
                    shortcut="G B"
                  />
                  <CommandItem 
                    onSelect={() => runCommand(() => navigate("/calendar"))}
                    icon={<Calendar className="w-4 h-4" />}
                    label="Smart Calendar"
                    shortcut="G C"
                  />
                </Command.Group>

                <div className="h-4" />

                <Command.Group heading={<span className="px-4 mb-4 block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Actions & System</span>}>
                  <CommandItem 
                    onSelect={() => runCommand(() => console.log("New Campaign"))}
                    icon={<PlusIcon />}
                    label="Initialize New Campaign"
                    color="text-blue-600"
                  />
                  <CommandItem 
                    onSelect={() => runCommand(() => navigate("/settings"))}
                    icon={<Settings className="w-4 h-4" />}
                    label="System Preferences"
                  />
                  <CommandItem 
                    onSelect={() => runCommand(() => navigate("/profile"))}
                    icon={<User className="w-4 h-4" />}
                    label="User Profile"
                  />
                  <CommandItem 
                    onSelect={() => runCommand(() => logout())}
                    icon={<LogOut className="w-4 h-4" />}
                    label="Terminate Session"
                    color="text-rose-500"
                  />
                </Command.Group>
              </Command.List>

              <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md border border-slate-200 bg-white shadow-sm flex items-center justify-center">
                      <span className="text-[10px] font-bold text-slate-400">↵</span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Execute</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md border border-slate-200 bg-white shadow-sm flex items-center justify-center">
                      <span className="text-[12px] font-bold text-slate-400">↑↓</span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Navigate</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <Sparkles className="w-3.5 h-3.5 fill-blue-600" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Ready For Command</span>
                </div>
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const CommandItem = ({ icon, label, shortcut, onSelect, color = "text-slate-900" }: {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  onSelect: () => void;
  color?: string;
}) => (
  <Command.Item
    onSelect={onSelect}
    className="flex items-center justify-between px-6 py-4.5 rounded-2xl cursor-pointer aria-selected:bg-slate-50 transition-all group"
  >
    <div className="flex items-center gap-5">
      <div className={cn("w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-aria-selected:bg-white group-aria-selected:border-slate-200 transition-all", color)}>
        {icon}
      </div>
      <span className={cn("text-[13px] font-black uppercase tracking-widest group-aria-selected:translate-x-1 transition-transform", color)}>
        {label}
      </span>
    </div>
    {shortcut && (
      <div className="flex gap-1">
        {shortcut.split(" ").map(s => (
          <div key={s} className="min-w-[1.5rem] h-6 px-1.5 rounded-md border border-slate-200 bg-white flex items-center justify-center shadow-sm">
            <span className="text-[10px] font-black text-slate-400">{s}</span>
          </div>
        ))}
      </div>
    )}
  </Command.Item>
);

const PlusIcon = () => (
  <div className="w-4 h-4 relative flex items-center justify-center">
    <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-20" />
    <div className="relative w-full h-full bg-blue-600 rounded-lg flex items-center justify-center">
      <span className="text-white text-xs font-bold font-sans">+</span>
    </div>
  </div>
);
