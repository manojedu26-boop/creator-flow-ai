import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export const FluidCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isVisible]);

  const springConfig = { damping: 30, stiffness: 300 };
  const cursorX = useSpring(mousePos.x, springConfig);
  const cursorY = useSpring(mousePos.y, springConfig);

  return (
    <motion.div
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        opacity: isVisible ? 1 : 0,
      }}
      className="fixed top-0 left-0 w-6 h-6 border-2 border-blue-600 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
    >
      <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-sm animate-pulse" />
    </motion.div>
  );
};
