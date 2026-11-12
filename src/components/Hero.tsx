import React from 'react';
import { MeekLogo } from './MeekLogo';
import { Compass, Sparkles, ChevronDown } from 'lucide-react';
import { useData } from '../context/DataContext';

interface HeroProps {
  onOpenOrderModal: () => void;
  onNavigateToAdmin?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenOrderModal, onNavigateToAdmin }) => {
  const { settings } = useData();

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-neutral-950 py-20 lg:py-28 text-center">
      {/* Background radial gold glow & dark luxury texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(212,175,55,0.15),transparent_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-[1px]" />
      
      {/* Decorative subtle hairline grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Atmospheric lighting accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex flex-col items-center space-y-8 sm:space-y-10">
        
        {/* Studio Emblem & Wordmark (with 5-click admin backdoor) */}
        <div className="flex justify-center">
          <MeekLogo size="lg" onAdminTrigger={onNavigateToAdmin} />
        </div>

        {/* Headline */}
        <div className="space-y-5 max-w-4xl mx-auto">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase text-neutral-100 tracking-[0.08em] leading-[1.12]">
            {settings.headline && 
             settings.headline !== 'BRING YOUR IMAGINATION TO LIFE.' && 
             settings.headline !== 'WHERE IMAGINATION TAKES FORM.' &&
             settings.headline !== 'Envision. Build. Iconic.' &&
             settings.headline !== 'ENVISION. BUILD. ICONIC.' ? (
              settings.headline
            ) : (
              <>
                <span>ENVISION. BUILD. </span>
                <span className="gold-gradient-text drop-shadow-[0_4px_30px_rgba(212,175,55,0.4)] block sm:inline">
                  ICONIC.
                </span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-neutral-300 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
            {settings.supportingText && !settings.supportingText.includes('Creative Sculptures')
              ? settings.supportingText
              : 'Custom 3D Art. Exceptional Craftsmanship. Extraordinary Details.'}
          </p>
        </div>

        {/* Scripture Matthew 5:5 styled with the exact font from the official master artwork */}
        <div className="max-w-2xl mx-auto text-center space-y-1.5 pt-1">
          <p className="font-brand font-medium text-xs sm:text-sm md:text-base uppercase tracking-[0.22em] text-amber-200/90 leading-relaxed">
            {settings.bibleVerse ? settings.bibleVerse.toUpperCase() : 'BLESSED ARE THE MEEK: FOR THEY SHALL INHERIT THE EARTH.'}
          </p>
          <div className="font-brand text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
            {settings.bibleReference ? settings.bibleReference.toUpperCase() : 'MATTHEW 5:5'}
          </div>
        </div>

        {/* Primary Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full sm:w-auto">
          <a
            href="#portfolio"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-bold tracking-[0.16em] uppercase text-neutral-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 rounded-lg shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:shadow-[0_0_35px_rgba(212,175,55,0.5)] transition-all transform active:scale-95 text-center"
          >
            <Compass className="w-4 h-4 text-neutral-950" />
            <span>EXPLORE OUR WORK</span>
          </a>

          <button
            onClick={onOpenOrderModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-bold tracking-[0.16em] uppercase text-amber-300 bg-neutral-900/80 hover:bg-neutral-800 border border-amber-500/40 hover:border-amber-400 rounded-lg transition-all transform active:scale-95 text-center shadow-md"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>ORDER YOUR CUSTOM ARTWORK</span>
          </button>
        </div>

        {/* Trust & Location Markers */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-neutral-400 uppercase tracking-widest border-t border-neutral-900/80 w-full max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>{settings.location || 'Iloilo City, Philippines'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Custom 3D Art Studio</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Worldwide Collector Shipping</span>
          </div>
        </div>

        {/* Subtle Scroll Down Prompt */}
        <a 
          href="#portfolio"
          className="pt-2 text-neutral-500 hover:text-amber-400 transition-colors flex flex-col items-center gap-1 group text-[11px] uppercase tracking-widest"
          title="Scroll to portfolio"
        >
          <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform animate-bounce" />
        </a>

      </div>
    </section>
  );
};
