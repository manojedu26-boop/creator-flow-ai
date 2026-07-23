import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eraser, Paintbrush, RotateCcw, Sparkles } from "lucide-react";
import { sound } from "@/lib/sound";

const COLORS = ["#ec4899", "#10b981", "#3b82f6", "#eab308", "#ffffff"];

export const InteractiveCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#ec4899");
  const [brushSize, setBrushSize] = useState(6);
  const [mode, setMode] = useState<"brush" | "spray">("spray");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Draw initial welcome graffiti watermark
      ctx.font = "900 24px monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.textAlign = "center";
      ctx.fillText("WTF CANVAS // SPRAY OR DRAW ANYWHERE HERE", rect.width / 2, rect.height / 2);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    sound.playSpray();

    if (mode === "spray") {
      // Spray paint effect
      ctx.fillStyle = color;
      const density = 30;
      for (let i = 0; i < density; i++) {
        const offsetAngle = Math.random() * Math.PI * 2;
        const offsetRadius = Math.random() * brushSize * 2.5;
        const offsetX = Math.cos(offsetAngle) * offsetRadius;
        const offsetY = Math.sin(offsetAngle) * offsetRadius;
        ctx.fillRect(x + offsetX, y + offsetY, 1.5, 1.5);
      }
    } else {
      // Solid brush stroke
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.beginPath();
  };

  const clearCanvas = () => {
    sound.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <section className="py-24 px-6 bg-[#07080c] text-white border-t border-white/5 relative overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-pink-500 mb-2 block">
              [08 // COLLABORATIVE SPRAY CANVAS]
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none">
              WTF <span className="underline decoration-pink-500/80 decoration-2 underline-offset-8">CANVAS.</span>
            </h2>
          </div>

          {/* Tools Palette */}
          <div className="flex items-center gap-4 flex-wrap bg-white/[0.04] p-3 rounded-2xl border border-white/10">
            {/* Colors */}
            <div className="flex items-center gap-2 pr-4 border-r border-white/10">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => { setColor(c); sound.playClick(); }}
                  className={`w-6 h-6 rounded-full transition-transform ${color === c ? "scale-125 ring-2 ring-white" : "opacity-70 hover:opacity-100"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {/* Mode selector */}
            <button
              onClick={() => { setMode(mode === "spray" ? "brush" : "spray"); sound.playClick(); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 ${mode === "spray" ? "bg-pink-500 text-black" : "bg-white/10 text-white"}`}
            >
              <Paintbrush className="w-3.5 h-3.5" />
              {mode}
            </button>

            {/* Clear button */}
            <button
              onClick={clearCanvas}
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all"
              title="Clear Canvas"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Canvas Area */}
        <div className="relative rounded-[2.5rem] border border-white/15 bg-black/80 overflow-hidden shadow-2xl h-[450px]">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full cursor-crosshair touch-none"
          />
        </div>
      </div>
    </section>
  );
};

export default InteractiveCanvas;
