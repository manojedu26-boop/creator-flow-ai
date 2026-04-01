import { Sparkles, Globe, Twitter, Instagram, Youtube, Zap } from "lucide-react";

const Footer = () => (
  <footer className="bg-white border-t border-slate-100 pt-32 pb-16 px-6">
    <div className="container max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
        <div className="col-span-1 md:col-span-5">
          <div className="flex items-center gap-3 font-black text-3xl tracking-tighter uppercase italic text-slate-950 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
               <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span>CreatorForge<span className="text-blue-600 font-black">AI</span></span>
          </div>
          <p className="text-slate-500 font-bold text-lg leading-relaxed max-w-sm mb-10 italic">
            The high-fidelity command centre for the world's most ambitious creators. Based in Jersey, Channel Islands.
          </p>
          <div className="flex items-center gap-6">
             {[Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-950 hover:text-white transition-all shadow-sm">
                   <Icon className="w-5 h-5" />
                </a>
             ))}
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950 mb-8 italic">Intelligence</h4>
          <ul className="space-y-4 text-sm font-bold text-slate-500">
            <li><a href="#features" className="hover:text-blue-600 transition-colors">Module Set</a></li>
            <li><a href="#pricing" className="hover:text-blue-600 transition-colors">Investment</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Trajectory</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Case Studies</a></li>
          </ul>
        </div>

        <div className="col-span-1 md:col-span-2">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950 mb-8 italic">Company</h4>
          <ul className="space-y-4 text-sm font-bold text-slate-500">
            <li><a href="#" className="hover:text-blue-600 transition-colors">Manifesto</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Journal</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Operations</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Join Team</a></li>
          </ul>
        </div>

        <div className="col-span-1 md:col-span-3">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950 mb-8 italic">Legal Nodes</h4>
          <ul className="space-y-4 text-sm font-bold text-slate-500">
            <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Protocol</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Safety Standards</a></li>
          </ul>
        </div>
      </div>

      <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              © 2026 CREATORFORGE AI Ltd. // All Systems Nominal.
           </p>
        </div>
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">
              <Globe className="w-3.5 h-3.5 text-blue-600" /> English Node (GBR)
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              v3.2.1-Prod <Zap className="w-3.5 h-3.5 fill-slate-400" />
           </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
