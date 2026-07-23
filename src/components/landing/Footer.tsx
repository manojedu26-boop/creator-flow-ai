import { Logo } from "../shared/Logo";

export const Footer = () => (
  <footer className="bg-[#0A0A0A] border-t border-white/5 py-16 px-6 text-white">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
      <Logo iconOnly={false} />
      
      <div className="flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-slate-400">
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-400 transition-colors">Instagram</a>
        <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-red-400 transition-colors">YouTube</a>
        <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors">TikTok</a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">LinkedIn</a>
      </div>

      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600">
        © 2026 DRAGON ALL • ALL SYSTEMS GO
      </p>
    </div>
  </footer>
);

export default Footer;
