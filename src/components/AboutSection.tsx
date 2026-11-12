import React from 'react';
import { useData } from '../context/DataContext';
import { Layers, Eye, Hammer, Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { settings } = useData();

  return (
    <section id="about" className="relative py-24 bg-neutral-950 border-t border-neutral-900 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-[0.25em] text-amber-400 mb-3">
            <span className="w-6 h-[1.5px] bg-amber-400" />
            <span>About Meek Studio</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-wide text-neutral-100">
            {settings.aboutTitle || 'THE ART OF BRINGING IDEAS TO LIFE'}
          </h2>
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Main Prose Narrative */}
          <div className="lg:col-span-7 space-y-6 text-neutral-300 text-base sm:text-lg font-light leading-relaxed">
            <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-amber-400 first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-none">
              {settings.aboutText || 
                'Meek Studio 3D Art is a creative studio based in Iloilo City, specializing in unique 3D art, custom sculptures, collectible figures, and creative artwork. We transform ideas and imagination into tangible works of art through creativity, craftsmanship, and attention to detail.'
              }
            </p>

            <p className="text-neutral-400 text-base">
              Every creation begins with pure imagination. Whether you provide a 2D sketch, concept art, reference photograph, or an original character idea, our studio engineers the 3D topology, sculpts the organic and mechanical nuances, and refines every curve for tangible physical presence.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                <div className="flex items-center gap-3 mb-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  <h4 className="font-heading text-sm font-semibold uppercase text-neutral-200">
                    Precision 3D Sculpting
                  </h4>
                </div>
                <p className="text-xs text-neutral-400">
                  Sub-millimeter detail modeling for characters, armor sets, and intricate display pieces.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                <div className="flex items-center gap-3 mb-2">
                  <Hammer className="w-5 h-5 text-amber-400" />
                  <h4 className="font-heading text-sm font-semibold uppercase text-neutral-200">
                    Artisan Finishing
                  </h4>
                </div>
                <p className="text-xs text-neutral-400">
                  Meticulous post-processing, surface smoothing, and specialized metallic or hand-applied gold accents.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Studio Heritage & Workshop Showcase */}
          <div className="lg:col-span-5 relative space-y-6">
            <div className="rounded-2xl overflow-hidden border border-amber-500/25 bg-neutral-900 relative shadow-2xl group">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src="/assets/aistudio/773167137_984629687943796_2392283727810284078_n_8d92f796.jpg"
                  alt="Meek Studio 3D Art Workshop"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5 bg-neutral-950/90 border-t border-neutral-800">
                <div className="flex items-center justify-between text-xs text-neutral-400 uppercase tracking-widest">
                  <span className="text-amber-400 font-semibold">Studio Workshop</span>
                  <span>Iloilo City, PH</span>
                </div>
                <p className="mt-2 text-xs text-neutral-300">
                  From digital prototype to physical sculpture — every project is crafted with singular dedication to art.
                </p>
              </div>
            </div>

            {/* Quote Strip */}
            <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/30 flex items-center gap-4">
              <Eye className="w-8 h-8 text-amber-500 shrink-0" />
              <p className="text-xs text-neutral-300 italic font-serif">
                &ldquo;Art is not just what you see, but what you make others feel through physical form and presence.&rdquo;
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
