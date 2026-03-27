import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { RefreshCcw, ArrowLeft, Trash2, CheckCircle2, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const useLongPress = (onLongPress: () => void, onClick: () => void, { shouldPreventDefault = true, delay = 500 } = {}) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();
  const target = useRef<HTMLElement>();

  const start = useCallback((event: any) => {
    if (shouldPreventDefault && event.target) {
        event.target.addEventListener("touchend", preventDefault, { passive: false });
        target.current = event.target;
    }
    timeout.current = setTimeout(() => {
        onLongPress();
        setLongPressTriggered(true);
    }, delay);
  }, [onLongPress, delay, shouldPreventDefault]);

  const clear = useCallback((event: any, shouldTriggerClick = true) => {
    timeout.current && clearTimeout(timeout.current);
    shouldTriggerClick && !longPressTriggered && onClick();
    setLongPressTriggered(false);
    if (shouldPreventDefault && target.current) {
        target.current.removeEventListener("touchend", preventDefault);
    }
  }, [onClick, longPressTriggered, shouldPreventDefault]);

  return {
    onMouseDown: (e: any) => start(e),
    onTouchStart: (e: any) => start(e),
    onMouseUp: (e: any) => clear(e),
    onMouseLeave: (e: any) => clear(e, false),
    onTouchEnd: (e: any) => clear(e)
  };
};

const preventDefault = (e: Event) => {
    const touchEvent = e as unknown as TouchEvent;
    if (touchEvent.touches.length < 2 && touchEvent.preventDefault) {
        touchEvent.preventDefault();
    }
};

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  const pullThreshold = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].pageY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current === 0 || isRefreshing) return;

    const currentY = e.touches[0].pageY;
    const diff = currentY - startY.current;

    if (diff > 0 && containerRef.current?.scrollTop === 0) {
      // Resistance factor
      const distance = Math.min(diff * 0.4, pullThreshold + 20);
      setPullDistance(distance);
      
      // Prevent default to disable native pull-to-refresh
      if (diff > 10) e.preventDefault();
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= pullThreshold && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
    setPullDistance(0);
    startY.current = 0;
  };

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-y-auto no-scrollbar relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none z-50"
        style={{ transform: `translateY(${pullDistance - 50}px)` }}
      >
        <div className={`p-3 rounded-full bg-card border border-primary/20 shadow-xl transition-opacity ${pullDistance > 10 || isRefreshing ? 'opacity-100' : 'opacity-0'}`}>
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : pullDistance * 2 }}
            transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : { type: 'spring' }}
          >
            <RefreshCcw className={`w-5 h-5 ${pullDistance >= pullThreshold ? 'text-primary' : 'text-muted-foreground'}`} />
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        animate={{ y: isRefreshing ? 60 : pullDistance }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

interface SwipeActionProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export const SwipeAction: React.FC<SwipeActionProps> = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight,
  leftAction,
  rightAction 
}) => {
  const x = useSpring(0, { damping: 20, stiffness: 200 });

  return (
    <div className="relative overflow-hidden touch-pan-y">
      <div className="absolute inset-0 flex justify-between items-center px-6">
        <div className="text-primary">{leftAction}</div>
        <div className="text-destructive">{rightAction}</div>
      </div>
      
      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: onSwipeLeft ? -100 : 0, right: onSwipeRight ? 100 : 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.x > 80 && onSwipeRight) {
            onSwipeRight();
            x.set(0);
          } else if (info.offset.x < -80 && onSwipeLeft) {
            onSwipeLeft();
            x.set(0);
          } else {
            x.set(0);
          }
        }}
        className="relative bg-background z-10"
      >
        {children}
      </motion.div>
    </div>
  );
};

interface SwipeUpActionProps {
  children: React.ReactNode;
  actions: React.ReactNode;
  onSwipeUp?: () => void;
}

export const SwipeUpAction: React.FC<SwipeUpActionProps> = ({ children, actions, onSwipeUp }) => {
  const y = useSpring(0, { damping: 20, stiffness: 200 });
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="relative overflow-hidden touch-pan-x rounded-[2rem]">
      <div className="absolute inset-x-0 bottom-0 h-[60px] flex items-center justify-center gap-4 bg-primary/10 border-t border-primary/20 text-primary px-4">
        {actions}
      </div>
      <motion.div
        style={{ y }}
        drag="y"
        dragConstraints={{ top: -60, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y < -40) {
            setIsRevealed(true);
            if (onSwipeUp) onSwipeUp();
            y.set(-60); // lock open temporarily
            setTimeout(() => { setIsRevealed(false); y.set(0); }, 3000);
          } else {
            y.set(0);
          }
        }}
        className="relative z-10 w-full bg-background"
      >
        {children}
      </motion.div>
    </div>
  );
};

export const IOSSwipeBack = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) {
          navigate(-1);
        }
      }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
};
