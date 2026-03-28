import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Download, Send, FileText, CheckCircle2, ChevronRight, Plus, Trash2, Calendar, Sparkles } from "lucide-react";
import { BottomSheet } from "../ui/BottomSheet";
import { toast } from "../ui/sonner";
import jsPDF from "jspdf";
import { EmailComposer } from "./EmailComposer";

interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
}

interface InvoiceGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  dealValue: string;
  dealType: string;
}

export const InvoiceGenerator = ({ isOpen, onClose, brandName, dealValue, dealType }: InvoiceGeneratorProps) => {
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(Math.random() * 9000) + 1000}`);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [taxRate, setTaxRate] = useState(18); // Default GST

  useEffect(() => {
    if (isOpen) {
      const initialAmount = parseInt(dealValue.replace(/\D/g, '')) || 0;
      setItems([{ id: '1', description: dealType, amount: initialAmount }]);
    }
  }, [isOpen, dealValue, dealType]);

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const handleAddItem = () => {
    setItems([...items, { id: Math.random().toString(), description: "Additional deliverable", amount: 0 }]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const generatePDF = (shouldDownload = true) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(255, 60, 172); // Primary Pink
    doc.text("CREATORFORGE", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("INVOICE", 180, 20, { align: "right" });
    
    // Brand / From
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("FROM:", 14, 40);
    doc.setFont("helvetica", "normal");
    doc.text("Naveen Kumar", 14, 45);
    doc.text("naveen@creatorflare.com", 14, 50);
    
    doc.setFont("helvetica", "bold");
    doc.text("TO:", 120, 40);
    doc.setFont("helvetica", "normal");
    doc.text(brandName, 120, 45);
    
    // Info
    doc.text(`Invoice #: ${invoiceNumber}`, 14, 70);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 75);
    doc.text(`Due Date: ${new Date(dueDate).toLocaleDateString()}`, 14, 80);
    
    // Table Header
    doc.setFillColor(30, 30, 30);
    doc.rect(14, 90, 182, 8, "F");
    doc.setTextColor(255);
    doc.text("Description", 18, 95);
    doc.text("Amount", 180, 95, { align: "right" });
    
    // Table Body
    doc.setTextColor(0);
    let y = 105;
    items.forEach(item => {
      doc.text(item.description, 18, y);
      doc.text(`INR ${item.amount.toLocaleString()}`, 180, y, { align: "right" });
      y += 10;
    });
    
    // Totals
    y += 10;
    doc.line(14, y, 196, y);
    y += 10;
    doc.text("Subtotal", 140, y);
    doc.text(`INR ${subtotal.toLocaleString()}`, 180, y, { align: "right" });
    y += 8;
    doc.text(`GST (${taxRate}%)`, 140, y);
    doc.text(`INR ${taxAmount.toLocaleString()}`, 180, y, { align: "right" });
    y += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL", 140, y);
    doc.text(`INR ${total.toLocaleString()}`, 180, y, { align: "right" });
    
    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150);
    doc.text("Notes: Thank you for your business! Please settle the amount by the due date.", 14, 280);
    
    if (shouldDownload) {
      doc.save(`${invoiceNumber}-${brandName.replace(/\s+/g, '')}.pdf`);
      toast.success("Invoice Downloaded ✓");
    }
    
    return doc;
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={() => onClose()} title="Generate Invoice" height="90vh">
      <div className="space-y-6 pt-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Invoice Number</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm"
            />
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Deliverables</label>
            <button
              onClick={handleAddItem}
              className="text-primary flex items-center gap-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Add Item</span>
            </button>
          </div>
          
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex gap-2 items-start bg-white/5 p-3 rounded-2xl border border-white/10 transition-all">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Description"
                    className="w-full h-9 bg-transparent border-b border-white/10 text-xs font-bold focus:outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-zinc-500 uppercase">INR</span>
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => updateItem(item.id, 'amount', parseInt(e.target.value) || 0)}
                      className="w-full h-8 bg-transparent text-sm font-black focus:outline-none"
                    />
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="p-2 text-zinc-600 hover:text-rose-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Summary */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-white/5 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-zinc-500">
            <span>Subtotal</span>
            <span>INR {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-xs font-bold text-zinc-500">
            <div className="flex items-center gap-2">
              <span>GST</span>
              <select 
                value={taxRate} 
                onChange={(e) => setTaxRate(parseInt(e.target.value))}
                className="bg-zinc-800 border-none rounded-md px-1 py-0.5 text-xs text-primary font-black"
              >
                <option value={0}>0%</option>
                <option value={5}>5%</option>
                <option value={12}>12%</option>
                <option value={18}>18%</option>
              </select>
            </div>
            <span>INR {taxAmount.toLocaleString()}</span>
          </div>
          <div className="h-px bg-white/5 my-1" />
          <div className="flex justify-between items-center text-lg font-black text-white">
            <span className="uppercase tracking-tighter">Total Amount</span>
            <span className="text-primary italic">INR {total.toLocaleString()}</span>
          </div>
        </div>

        {/* Preview State Animation */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-4">
           <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-400" />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase text-emerald-400">AI Financial Check</p>
              <p className="text-xs font-bold text-emerald-400/80 mt-0.5 leading-relaxed italic">
                "Naveen, you've hit your revenue milestone! This invoice brings your monthly brand deal income to ₹1,45,000."
              </p>
           </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-2 gap-3 pb-8">
          <button
            onClick={() => generatePDF(true)}
            className="h-14 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button
            onClick={() => setShowEmailComposer(true)}
            className="h-14 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Send to {brandName}
          </button>
        </div>
      </div>

      {/* Linked Email Composer */}
      <EmailComposer
        isOpen={showEmailComposer}
        onClose={() => setShowEmailComposer(false)}
        initialTo={`${brandName.toLowerCase().replace(/\s+/g, '')}.accounts@example.com`}
        initialSubject={`Invoice ${invoiceNumber} from Naveen Kumar`}
        initialBody={`Hi accounts team at ${brandName},\n\nPlease find attached invoice ${invoiceNumber} for the ${dealType} collaboration.\n\nTotal: INR ${total.toLocaleString()}\nDue Date: ${new Date(dueDate).toLocaleDateString()}\n\nBest,\nNaveen Kumar`}
        templates={[
          { name: "Standard Invoice", subject: `Invoice ${invoiceNumber}`, body: "Hi team, please find attached..." }
        ]}
      />
    </BottomSheet>
  );
};
