import { Bell, Search, ChevronDown } from "lucide-react";

export const Header = ({ title = "Dashboard" }: { title?: string }) => {
  return (
    <header className="fixed top-0 left-[72px] lg:left-[260px] right-0 h-[60px] bg-background/80 backdrop-blur-md border-b border-border/40 z-40 flex items-center justify-between px-6 transition-all duration-300">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        
        <div className="hidden md:flex items-center bg-muted/40 rounded-full p-1 border border-border/50">
          {["All Platforms", "Instagram", "YouTube", "TikTok"].map((platform, i) => (
            <button 
              key={platform}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                i === 0 ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground border border-border/50 rounded-lg px-3 py-1.5 hover:bg-muted/30 cursor-pointer">
          <span>30 Days</span>
          <ChevronDown className="w-4 h-4" />
        </div>

        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="h-9 w-64 bg-muted/30 border border-border/50 rounded-full pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background" />
        </button>

        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary" />
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
};
