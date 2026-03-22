import { Sparkles } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/30 py-12 px-4">
    <div className="container max-w-5xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <span>CREATORX</span>
            <span className="text-primary text-sm font-semibold">AI</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AI-powered marketing for content creators. Based in Jersey, Channel Islands.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Roadmap</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          © 2025 CREATORX AI Ltd. Registered in Jersey, Channel Islands.
        </p>
        <div className="flex items-center gap-4">
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Twitter</a>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Instagram</a>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">TikTok</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
