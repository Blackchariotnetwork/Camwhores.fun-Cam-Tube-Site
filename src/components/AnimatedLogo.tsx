import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  monochrome?: boolean;
  className?: string;
  onClick?: () => void;
}

interface Puff {
  id: number;
  x: number;
  y: number;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  size = 'md',
  showLabel = false,
  monochrome = false,
  className = '',
  onClick,
}) => {
  const [puffs, setPuffs] = useState<Puff[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }[size];

  const handleTap = (e: React.MouseEvent) => {
    // Spawn extra smoke puff on tap/click
    const newPuff = {
      id: Date.now(),
      x: -15 + Math.random() * 8,
      y: -30 - Math.random() * 20,
    };
    setPuffs((prev) => [...prev.slice(-4), newPuff]);
    setTimeout(() => {
      setPuffs((prev) => prev.filter((p) => p.id !== newPuff.id));
    }, 1200);

    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-3 select-none group cursor-pointer ${className}`}
      onClick={handleTap}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      title="Koneko CMS — Click for smoke puff"
    >
      <div className={`relative ${sizeClasses} shrink-0`}>
        {/* Subtle breathing motion container */}
        <motion.div
          animate={{
            y: isHovered ? [0, -3, 0] : [0, -1.5, 0],
            rotate: isHovered ? [0, 1.5, -1.5, 0] : 0,
          }}
          transition={{
            duration: isHovered ? 1.6 : 3.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-full h-full relative"
        >
          {/* Main Logo Image */}
          <img
            src="/assets/aistudio/b9Ofn_1c5c8d7e.png"
            alt="Koneko Tube Mascot"
            className={`w-full h-full object-contain filter transition duration-300 drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)] ${
              monochrome
                ? 'grayscale contrast-125 brightness-95'
                : 'contrast-105'
            }`}
          />

          {/* Cigarette Ash Ember Glow (at coordinate ~27% left, ~78% top) */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              left: '26.8%',
              top: '77.5%',
              width: size === 'sm' ? '3px' : size === 'xl' ? '8px' : '5px',
              height: size === 'sm' ? '3px' : size === 'xl' ? '8px' : '5px',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Inner hot ember */}
            <div className="w-full h-full rounded-full bg-amber-400 animate-ember shadow-[0_0_8px_#ff4500]" />
          </div>

          {/* Drifting Continuous Smoke Wisps */}
          <div
            className="absolute pointer-events-none overflow-visible"
            style={{
              left: '26.8%',
              top: '77.5%',
            }}
          >
            {/* Smoke Strand 1 */}
            <span
              className="absolute w-2.5 h-2.5 rounded-full bg-white/40 blur-[2px] animate-smoke-1 pointer-events-none"
              style={{ left: '-4px', top: '-6px' }}
            />
            {/* Smoke Strand 2 */}
            <span
              className="absolute w-3 h-3 rounded-full bg-zinc-300/35 blur-[2.5px] animate-smoke-2 pointer-events-none"
              style={{ left: '-5px', top: '-8px' }}
            />
            {/* Smoke Strand 3 */}
            <span
              className="absolute w-2 h-2 rounded-full bg-white/30 blur-[2px] animate-smoke-3 pointer-events-none"
              style={{ left: '-3px', top: '-6px' }}
            />
          </div>

          {/* Burst puffs on click */}
          <AnimatePresence>
            {puffs.map((puff) => (
              <motion.div
                key={puff.id}
                initial={{
                  opacity: 0.9,
                  scale: 0.4,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: 0,
                  scale: 2.8,
                  x: puff.x,
                  y: puff.y,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                className="absolute pointer-events-none rounded-full bg-white/60 blur-[3px]"
                style={{
                  left: '26.8%',
                  top: '77.5%',
                  width: '12px',
                  height: '12px',
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {showLabel && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-base font-extrabold tracking-tight text-white uppercase">
              Koneko
            </span>
            <span className="text-xs font-mono font-bold px-1.5 py-0.5 bg-white text-black tracking-widest uppercase">
              TUBE
            </span>
          </div>
          <span className="text-[10px] tracking-wider text-zinc-400 font-mono mt-0.5 uppercase">
            Noir CMS
          </span>
        </div>
      )}
    </div>
  );
};
