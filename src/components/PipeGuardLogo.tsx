import React from 'react';

interface PipeGuardLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  textClassName?: string;
  subtextClassName?: string;
}

export const PipeGuardLogo: React.FC<PipeGuardLogoProps> = ({
  className = "w-10 h-10",
  size,
  showText = false,
  textClassName = "text-slate-900 font-bold font-display text-lg tracking-tight",
  subtextClassName = "text-[10px] font-mono font-semibold tracking-wider text-sky-600 uppercase"
}) => {
  const customStyle = size ? { width: size, height: size } : undefined;

  return (
    <div className="inline-flex items-center gap-3 select-none">
      <div 
        className={`relative shrink-0 flex items-center justify-center ${className}`}
        style={customStyle}
      >
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          <defs>
            <linearGradient id="shieldFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F0F9FF" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>
            <linearGradient id="dropletWaterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>

          {/* SHIELD BACKGROUND */}
          <path 
            d="M 50 8 L 84 20 L 84 52 C 84 72, 50 92, 50 92 C 50 92, 16 72, 16 52 L 16 20 Z" 
            fill="url(#shieldFillGrad)" 
            stroke="#033B60" 
            strokeWidth="4.5" 
            strokeLinejoin="round" 
          />

          {/* SHIELD INNER RIGHT SHADE */}
          <path 
            d="M 50 11 L 81 22 L 81 52 C 81 70, 50 88, 50 88 Z" 
            fill="#BAE6FD" 
            opacity="0.5" 
          />

          {/* SHIELD INNER ACCENT BORDER */}
          <path 
            d="M 50 14 L 78 24 L 78 50 C 78 66, 50 82, 50 82 C 50 82, 22 66, 22 50 L 22 24 Z" 
            fill="none" 
            stroke="#0284C7" 
            strokeWidth="1.8" 
            strokeLinejoin="round" 
            opacity="0.8" 
          />

          {/* WATER DROPLET */}
          <path 
            d="M 50 20 C 50 20, 62 35, 62 43 C 62 49.5, 56.5 54, 50 54 C 43.5 54, 38 49.5, 38 43 C 38 35, 50 20, 50 20 Z" 
            fill="url(#dropletWaterGrad)" 
            stroke="#033B60" 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
          />
          
          {/* DROPLET HIGHLIGHT */}
          <path 
            d="M 43 41 C 43 36, 47 28, 48 26" 
            stroke="#FFFFFF" 
            strokeWidth="2" 
            strokeLinecap="round" 
          />

          {/* HORIZONTAL PIPE INFRASTRUCTURE */}
          {/* Left Pipe Flange */}
          <rect x="6" y="49" width="6" height="16" rx="1.5" fill="#033B60" stroke="#033B60" strokeWidth="1" />
          <rect x="12" y="52" width="10" height="10" fill="#E2E8F0" stroke="#033B60" strokeWidth="2.5" />

          {/* Right Pipe Flange */}
          <rect x="88" y="49" width="6" height="16" rx="1.5" fill="#033B60" stroke="#033B60" strokeWidth="1" />
          <rect x="78" y="52" width="10" height="10" fill="#E2E8F0" stroke="#033B60" strokeWidth="2.5" />

          {/* Main Pipe Body Cross-Beam */}
          <rect x="18" y="53" width="64" height="8" fill="#F8FAFC" stroke="#033B60" strokeWidth="2.8" />

          {/* ACOUSTIC SINE WAVE VIBRATION (CYAN & NAVY) */}
          {/* Back/Shadow Sine Wave */}
          <path 
            d="M 12 57 Q 26 57 34 46 Q 42 34 50 57 Q 58 78 66 68 Q 74 57 88 57" 
            fill="none" 
            stroke="#033B60" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Foreground Bright Cyan Acoustic Wave */}
          <path 
            d="M 12 57 Q 26 57 34 46 Q 42 34 50 57 Q 58 78 66 68 Q 74 57 88 57" 
            fill="none" 
            stroke="#0284C7" 
            strokeWidth="2.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={textClassName}>PIPEGUARD</span>
          <span className={subtextClassName}>INSPIRE-MANAK</span>
        </div>
      )}
    </div>
  );
};
