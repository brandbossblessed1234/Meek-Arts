import React, { useState, useRef } from 'react';

interface MeekLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  onAdminTrigger?: () => void;
}

export const OFFICIAL_LOGO_SRC = '/assets/aistudio/759034263_973317582408340_6684353305294085176_n__1__27edce82.jpg';

export const MeekLogo: React.FC<MeekLogoProps> = ({ 
  className = '', 
  size = 'md',
  showWordmark = true,
  onAdminTrigger
}) => {
  const [clickCount, setClickCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
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
      title={onAdminTrigger ? 'Meek Arts – 3D Art' : undefined}
    >
      {/* Official 3D Sculpted Bronze Emblem */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center transition-transform active:scale-95 duration-150`}>
        <div className={`absolute -inset-0.5 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 transition-all duration-300 ${
          clickCount > 0 ? 'opacity-100 shadow-[0_0_25px_rgba(212,175,55,0.85)] scale-105' : 'opacity-40 group-hover:opacity-80 shadow-[0_0_15px_rgba(212,175,55,0.25)]'
        }`} />
        <div className="w-full h-full rounded-full overflow-hidden border border-amber-400/60 bg-neutral-950 relative z-10 shadow-inner">
          <img 
            src={OFFICIAL_LOGO_SRC} 
            alt="Meek Arts Official Emblem" 
            className="w-full h-full object-cover select-none pointer-events-none"
            loading="eager"
          />
        </div>
      </div>

      {showWordmark && (
        <div className="flex flex-col text-left leading-tight">
          <span className={`font-heading font-bold text-neutral-100 uppercase ${titleSizes[size]}`}>
            MEEK <span className="text-amber-400 font-extrabold">ARTS</span>
          </span>
          <span className={`font-sans uppercase font-medium text-amber-500/90 ${subSizes[size]}`}>
            3D ART · SCULPTURES
          </span>
        </div>
      )}
    </div>
  );
};
