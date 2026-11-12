import React from 'react';
import { MeekLogo } from './MeekLogo';
import { ArrowDown, Sparkles, Compass } from 'lucide-react';
import { useData } from '../context/DataContext';

interface HeroProps {
  onOpenOrderModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenOrderModal }) => {
  const { settings, projects } = useData();
  
  // Use featured project or hero image
  const featured = projects.find(p => p.isFeatured && p.isPublished) || projects[0];
  const heroImage = featured?.coverImage || '/src/assets/images/meek_hero_sculpture_1794441974326.jpg';

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-neutral-950 py-16 lg:py-24">
      {/* Background radial glow & dark texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(212,175,55,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-[1px]" />
      
      {/* Decorative subtle hairline grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Studio Brand, Headlines, Verse, and Actions */}
          <div className="lg:col-span-7 flex flex-col text-left space-y-8">
            
            {/* Studio Badge / Wordmark */}
            <div>
              <MeekLogo size="lg" />
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase text-neutral-100 tracking-[0.06em] leading-[1.12]">
                BRING YOUR <br />
                <span className="gold-gradient-text drop-shadow-[0_4px_24px_rgba(212,175,55,0.3)]">
                  IMAGINATION
                </span> <br />
                TO LIFE.
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-neutral-300 font-light tracking-wide max-w-2xl leading-relaxed">
                {settings.supportingText || 'Custom 3D Art. Creative Sculptures. Extraordinary Details.'}
              </p>
            </div>

            {/* Inspirational Verse Box */}
            <div className="relative p-5 sm:p-6 rounded-xl bg-neutral-900/60 border border-amber-500/20 backdrop-blur-sm max-w-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="absolute -top-3 left-6 px-2.5 py-0.5 bg-neutral-950 border border-amber-500/40 rounded text-[10px] uppercase font-bold tracking-[0.2em] text-amber-400">
                Inspirational Statement
              </div>
              <blockquote className="italic font-serif text-amber-100/90 text-sm sm:text-base leading-relaxed">
                &ldquo;{settings.bibleVerse || 'Blessed are the meek: for they shall inherit the earth.'}&rdquo;
              </blockquote>
              <div className="mt-2 text-right text-xs font-semibold uppercase tracking-widest text-amber-400/80">
                — {settings.bibleReference || 'Matthew 5:5'}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href="#portfolio"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-bold tracking-[0.16em] uppercase text-neutral-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 rounded-lg shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:shadow-[0_0_35px_rgba(212,175,55,0.5)] transition-all transform active:scale-95 text-center"
              >
                <Compass className="w-4 h-4 text-neutral-950" />
                EXPLORE OUR WORK
              </a>

              <button
                onClick={onOpenOrderModal}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-bold tracking-[0.16em] uppercase text-amber-300 bg-neutral-900/80 hover:bg-neutral-800 border border-amber-500/40 hover:border-amber-400 rounded-lg transition-all transform active:scale-95 text-center shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                ORDER YOUR CUSTOM ARTWORK
              </button>
            </div>

            {/* Trust and Location markers */}
            <div className="pt-2 flex items-center gap-6 text-xs text-neutral-400 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{settings.location || 'Iloilo City, Philippines'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Worldwide Collector Shipping</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Impact 3D Artwork Showcase Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none group">
              
              {/* Outer gold glow framing */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-amber-400/30 via-amber-500/10 to-transparent blur-xl opacity-75 group-hover:opacity-100 transition duration-1000" />
              
              {/* Main Artwork Container */}
              <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-neutral-900 shadow-2xl">
                <div className="aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] w-full overflow-hidden relative">
                  <img
                    src={heroImage}
                    alt="Meek Studio 3D Artwork"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle gallery lighting vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-85" />
                  
                  {/* Floating artwork information card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-neutral-950/80 border border-amber-500/25 backdrop-blur-md">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
                          Featured Creation
                        </span>
                        <h4 className="font-heading text-sm sm:text-base font-semibold text-neutral-100 leading-snug">
                          {featured?.title || 'Mythos Wyrm – Metallic Gold & Charcoal'}
                        </h4>
                        <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                          {featured?.category || 'Display Sculptures'}
                        </p>
                      </div>
                      <a
                        href="#portfolio"
                        className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors shrink-0"
                        title="View in Gallery"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
