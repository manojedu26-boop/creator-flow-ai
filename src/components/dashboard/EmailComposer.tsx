import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Paperclip, ChevronDown, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { BottomSheet } from "../ui/BottomSheet";
import { toast } from "../ui/sonner";
import { AutoResizeTextarea } from "../shared/AutoResizeTextarea";

export interface EmailTemplate {
  name: string;
  subject: string;
  body: string;
}

interface EmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTo?: string;
  initialSubject?: string;
  initialBody?: string;
  templates?: EmailTemplate[];
  dealContext?: { brand: string; amount: string; type: string };
  onSent?: (data: { to: string; subject: string; body: string }) => void;
}

export const EmailComposer = ({
  isOpen,
  onClose,
  initialTo = "",
  initialSubject = "",
  initialBody = "",
  templates = [],
  dealContext,
  onSent
}: EmailComposerProps) => {
  const [to, setTo] = useState(initialTo);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [isSending, setIsSending] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTo(initialTo);
      setSubject(initialSubject);
      setBody(initialBody);
    }
  }, [isOpen, initialTo, initialSubject, initialBody]);

  const handleSend = async () => {
    if (!to || !subject || !body) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSending(true);
    // Simulate API call to SendGrid
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSending(false);
    toast.success("Email sent successfully ✓", {
      description: `Sent to ${to}`
    });
    
    if (onSent) onSent({ to, subject, body });
    onClose();
    
    // Reset state
    setTo("");
    setSubject("");
    setBody("");
    setAttachments([]);
  };

  const applyTemplate = (template: EmailTemplate) => {
    setSubject(template.subject);
    setBody(template.body);
    setShowTemplates(false);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={() => !isSending && onClose()} title="New Email" height="90vh">
      <div className="space-y-4 pt-4 pb-10">
        {/* Recipient */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">To</label>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="brand@contact.com"
            className="w-full h-12 bg-white/5 dark:bg-white/5 light:bg-zinc-100 border border-white/10 dark:border-white/10 light:border-zinc-200 rounded-2xl px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        {/* Subject + Templates */}
        <div className="space-y-1.5 relative">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Subject</label>
            {templates.length > 0 && (
              <button 
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:underline"
              >
                Use Template <ChevronDown className={`w-3 h-3 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Campaign Pitch - [Brand Name]"
            className="w-full h-12 bg-white/5 dark:bg-white/5 light:bg-zinc-100 border border-white/10 dark:border-white/10 light:border-zinc-200 rounded-2xl px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
          />

          <AnimatePresence>
            {showTemplates && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 z-50 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              >
                {templates.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => applyTemplate(t)}
                    className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-white/5 transition-all border-b border-white/5 last:border-0"
                  >
                    {t.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Body */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Message Body</label>
          <AutoResizeTextarea
            value={body}
            onChange={(e: any) => setBody(e.target.value)}
            placeholder="Write your email here..."
            className="w-full min-h-[300px] bg-white/5 dark:bg-white/5 light:bg-zinc-100 border border-white/10 dark:border-white/10 light:border-zinc-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none font-medium leading-relaxed"
          />
        </div>

        {/* Formatting simulation + Attachment */}
        <div className="flex items-center justify-between py-2 border-y border-white/5">
          <div className="flex items-center gap-4 text-zinc-500">
            <button className="hover:text-white transition-colors"><Paperclip className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-white/10" />
            <button className="text-[10px] font-black uppercase">B</button>
            <button className="text-[10px] font-black uppercase">I</button>
            <button className="text-[10px] font-black uppercase underline">U</button>
          </div>
          {attachments.length > 0 && (
            <span className="text-[10px] font-black text-primary uppercase">{attachments.length} attachment(s)</span>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleSend}
          disabled={isSending}
          className="w-full h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Email
            </>
          )}
        </button>

        {dealContext && (
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 mt-4 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[11px] font-bold text-zinc-400">
              <span className="text-primary font-black uppercase">CreatorForge AI:</span> Since this is a {dealContext.type} for {dealContext.brand}, I've optimized the tone to be professional yet creative.
            </p>
          </div>
        )}
      </div>
    </BottomSheet>
  );
};
