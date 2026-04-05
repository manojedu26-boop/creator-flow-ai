import { Sparkles, Globe, Twitter, Instagram, Youtube, Zap } from "lucide-react";

const Footer = () => (
  <footer className="bg-slate-950 border-t border-white/5 pt-32 pb-16 px-6">
    <div className="container max-w-7xl relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
        <div className="col-span-1 md:col-span-5">
          <div className="flex items-center gap-3 font-black text-3xl tracking-tighter uppercase text-white mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
               <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span>CreatorForge<span className="text-blue-500 font-black italic ml-1">AI</span></span>
          </div>
          <p className="text-slate-500 font-medium text-xl leading-relaxed max-w-sm mb-10">
            The high-fidelity command centre for the world's most ambitious icons. Built for the future of creator intelligence.
          </p>
          <div className="flex items-center gap-4">
             {[Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-2xl hover:scale-110 active:scale-95">
                   <Icon className="w-6 h-6" />
                </a>
             ))}
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-8">Intelligence</h4>
          <ul className="space-y-4 text-sm font-black text-slate-500 uppercase tracking-widest">
            <li><a href="#features" className="hover:text-white transition-colors">Stack</a></li>
            <li><a href="#pricing" className="hover:text-white transition-colors">Investment</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Trajectory</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Nodes</a></li>
          </ul>
        </div>

        <div className="col-span-1 md:col-span-2">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-8">Company</h4>
          <ul className="space-y-4 text-sm font-black text-slate-500 uppercase tracking-widest">
            <li><a href="#" className="hover:text-white transition-colors">Manifesto</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Journal</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Operations</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
          </ul>
        </div>

        <div className="col-span-1 md:col-span-3">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-8">Legal Terminal</h4>
          <ul className="space-y-4 text-sm font-black text-slate-500 uppercase tracking-widest">
            <li><a href="#" className="hover:text-white transition-colors">Privacy Prot.</a></li>
            <li><a href="#" className="hover:text-white transition-colors">TOS Archive</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
          </ul>
        </div>
      </div>

      <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-4">
           <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
              © 2026 CREATORFORGE AI Ltd. // ALL SYSTEMS NOMINAL v4.2
           </p>
        </div>
        <div className="flex items-center gap-12">
           <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 transition-colors hover:text-blue-500 cursor-default">
              <Globe className="w-4 h-4" /> Global Node (GBR)
           </div>
           <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 cursor-default">
              Prod Alpha <Zap className="w-4 h-4 fill-blue-500 text-blue-500" />
           </div>
        </div>
      </div>
    </div>

    {/* Footer Accent */}
    <div className="absolute bottom-0 right-0 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
  </footer>
);

export default Footer;
