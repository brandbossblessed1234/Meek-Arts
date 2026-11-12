import React, { useState, useRef } from 'react';

interface MeekLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  onAdminTrigger?: () => void;
}

export const MeekLogo: React.FC<MeekLogoProps> = ({ 
  className = '', 
  size = 'md',
  showWordmark = true,
  onAdminTrigger
}) => {
  const [clickCount, setClickCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-sm tracking-wider',
    md: 'text-base lg:text-lg tracking-[0.18em]',
    lg: 'text-xl lg:text-2xl tracking-[0.2em]',
    xl: 'text-2xl lg:text-3xl tracking-[0.22em]',
  };

  const subSizes = {
    sm: 'text-[9px] tracking-widest',
    md: 'text-[10px] tracking-[0.25em]',
    lg: 'text-xs tracking-[0.3em]',
    xl: 'text-sm tracking-[0.35em]',
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (!onAdminTrigger) return;
    
    // Prevent default link navigation if inside an <a> tag
    e.preventDefault();
    e.stopPropagation();

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const nextCount = clickCount + 1;

    if (nextCount >= 5) {
      setClickCount(0);
      onAdminTrigger();
      return;
    }

    setClickCount(nextCount);

    // Reset after 3 seconds of inactivity
    timerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 3000);
  };

  return (
    <div 
      onClick={handleLogoClick}
      className={`relative inline-flex items-center gap-3 select-none cursor-pointer group ${className}`}
      title={onAdminTrigger ? 'Meek Studio 3D Art' : undefined}
    >
      {/* 3D Geometric Gold Sculptural Emblem */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center transition-transform active:scale-95 duration-150`}>
        <div className={`absolute inset-0 rounded-lg bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[1.5px] transition-all ${
          clickCount > 0 ? 'shadow-[0_0_25px_rgba(212,175,55,0.7)] scale-105' : 'shadow-[0_0_15px_rgba(212,175,55,0.3)]'
        }`}>
          <div className="w-full h-full bg-neutral-950 rounded-[7px] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/40 via-transparent to-amber-400/10" />
            
            {/* Sculpted Monogram M with 3D Facets matching the real Meek Studio 3D Art brass plaque */}
            <svg viewBox="0 0 40 40" className="w-[72%] h-[72%] text-amber-400 fill-current drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <polygon points="6,34 6,8 14,8 20,20 26,8 34,8 34,34 27,34 27,17 21,27 19,27 13,17 13,34" fill="url(#goldFacet)" />
              <polygon points="6,8 14,8 20,20 19,27 13,17 13,34 6,34" fill="url(#goldLight)" opacity="0.9" />
              <polygon points="20,20 26,8 34,8 34,34 27,34 27,17 21,27" fill="url(#goldDark)" opacity="0.85" />
              <defs>
                <linearGradient id="goldFacet" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fde68a" />
                  <stop offset="50%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
                <linearGradient id="goldLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fffbeb" />
                  <stop offset="100%" stopColor="#d4af37" />
                </linearGradient>
                <linearGradient id="goldDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#451a03" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {showWordmark && (
        <div className="flex flex-col text-left leading-tight">
          <span className={`font-heading font-bold text-neutral-100 uppercase ${titleSizes[size]}`}>
            MEEK <span className="text-amber-400 font-extrabold">STUDIO</span>
          </span>
          <span className={`font-sans uppercase font-medium text-amber-500/90 ${subSizes[size]}`}>
            3D ART · SCULPTURES
          </span>
        </div>
      )}
    </div>
  );
};
