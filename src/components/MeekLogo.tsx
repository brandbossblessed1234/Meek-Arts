import React, { useState, useRef } from 'react';

interface MeekLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  layout?: 'horizontal' | 'centered';
  onAdminTrigger?: () => void;
}

export const OFFICIAL_LOGO_SRC = '/assets/aistudio/759034263_973317582408340_6684353305294085176_n__1__27edce82.jpg';
export const OFFICIAL_BANNER_SRC = '/assets/aistudio/728503931_942722405467858_6747721557390210102_n_53a1a41c.jpg';

export const MeekLogo: React.FC<MeekLogoProps> = ({ 
  className = '', 
  size = 'md',
  showWordmark = true,
  layout,
  onAdminTrigger
}) => {
  const [clickCount, setClickCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Default layout: centered for lg & xl, horizontal for sm & md
  const effectiveLayout = layout || (size === 'lg' || size === 'xl' ? 'centered' : 'horizontal');

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
    xl: 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32',
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

  // Center / Stacked Layout (matching the master artwork in 728503931...jpg)
  if (effectiveLayout === 'centered') {
    return (
      <div 
        onClick={handleLogoClick}
        className={`relative flex flex-col items-center justify-center text-center select-none cursor-pointer group ${className}`}
        title={onAdminTrigger ? 'MEEK Studio 3D Art' : undefined}
      >
        {/* Official 3D Sculpted Bronze Emblem with 5-click backdoor */}
        <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center transition-transform active:scale-95 duration-150 mb-3 sm:mb-4`}>
          <div className={`absolute -inset-1 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 transition-all duration-300 ${
            clickCount > 0 ? 'opacity-100 shadow-[0_0_35px_rgba(212,175,55,0.9)] scale-105' : 'opacity-40 group-hover:opacity-85 shadow-[0_0_25px_rgba(212,175,55,0.35)]'
          }`} />
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-amber-400/70 bg-neutral-950 relative z-10 shadow-2xl">
            <img 
              src={OFFICIAL_LOGO_SRC} 
              alt="MEEK Studio 3D Art Official Emblem" 
              className="w-full h-full object-cover select-none pointer-events-none"
              loading="eager"
            />
          </div>
        </div>

        {showWordmark && (
          <div className="flex flex-col items-center justify-center text-center">
            {/* M E E K (Font from official master artwork) */}
            <span className="font-brand font-black uppercase tracking-[0.3em] text-3xl sm:text-4xl md:text-5xl lg:text-6xl bronze-3d-text leading-[1.05]">
              MEEK
            </span>

            {/* S T U D I O */}
            <span className="font-brand font-bold uppercase tracking-[0.34em] text-lg sm:text-xl md:text-2xl lg:text-3xl text-neutral-200 leading-[1.1] mt-1 sm:mt-1.5">
              STUDIO
            </span>

            {/* —— 3 D   A R T —— (in the middle, flanked by accent lines) */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-4 w-44 sm:w-56 md:w-64 mt-2 sm:mt-3">
              <span className="h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/70 to-amber-500 flex-1 shadow-sm" />
              <span className="font-brand text-[11px] sm:text-xs md:text-sm uppercase font-bold tracking-[0.32em] text-amber-400 shrink-0">
                3D ART
              </span>
              <span className="h-[1.5px] bg-gradient-to-l from-transparent via-amber-400/70 to-amber-500 flex-1 shadow-sm" />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Horizontal Layout (for Navbar, Footer, and compact screens)
  return (
    <div 
      onClick={handleLogoClick}
      className={`relative inline-flex items-center gap-3 select-none cursor-pointer group ${className}`}
      title={onAdminTrigger ? 'MEEK Studio 3D Art' : undefined}
    >
      {/* Official 3D Sculpted Bronze Emblem */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center transition-transform active:scale-95 duration-150`}>
        <div className={`absolute -inset-0.5 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 transition-all duration-300 ${
          clickCount > 0 ? 'opacity-100 shadow-[0_0_25px_rgba(212,175,55,0.85)] scale-105' : 'opacity-40 group-hover:opacity-80 shadow-[0_0_15px_rgba(212,175,55,0.25)]'
        }`} />
        <div className="w-full h-full rounded-full overflow-hidden border border-amber-400/60 bg-neutral-950 relative z-10 shadow-inner">
          <img 
            src={OFFICIAL_LOGO_SRC} 
            alt="MEEK Studio 3D Art Official Emblem" 
            className="w-full h-full object-cover select-none pointer-events-none"
            loading="eager"
          />
        </div>
      </div>

      {showWordmark && (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="font-brand font-black uppercase tracking-[0.24em] text-neutral-100 text-sm sm:text-base leading-none">
            MEEK <span className="text-amber-400 font-extrabold">STUDIO</span>
          </div>
          {/* —— 3D ART —— (in the middle with horizontal lines) */}
          <div className="flex items-center justify-center gap-1.5 w-full mt-1">
            <span className="h-[1px] bg-gradient-to-r from-transparent via-amber-500/60 to-amber-500/20 flex-1" />
            <span className="font-brand text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.3em] text-amber-400 shrink-0">
              3D ART
            </span>
            <span className="h-[1px] bg-gradient-to-l from-transparent via-amber-500/60 to-amber-500/20 flex-1" />
          </div>
        </div>
      )}
    </div>
  );
};
