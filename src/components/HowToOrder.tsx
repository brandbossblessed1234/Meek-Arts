import React from 'react';
import { Lightbulb, Image as ImageIcon, MessageSquareText, Sparkles, ArrowRight } from 'lucide-react';

interface HowToOrderProps {
  onOpenOrderModal: () => void;
}

export const HowToOrder: React.FC<HowToOrderProps> = ({ onOpenOrderModal }) => {
  const steps = [
    {
      step: '01',
      title: 'SHARE YOUR IDEA',
      description: 'Tell us what artwork you want — a favorite character, personal portrait bust, collectible figure, or original sculpture concept.',
      icon: Lightbulb,
    },
    {
      step: '02',
      title: 'SEND YOUR REFERENCES',
      description: 'Share photos, 2D art, illustrations, or aesthetic moodboards through our inquiry form or direct Facebook chat.',
      icon: ImageIcon,
    },
    {
      step: '03',
      title: 'DISCUSS YOUR PROJECT',
      description: 'Consult directly with our studio to finalize scale, finishes, timeline, and exact transparent pricing for your piece.',
      icon: MessageSquareText,
    },
    {
      step: '04',
      title: 'BRING IT TO LIFE',
      description: 'We sculpt, fabricate, hand-finish, and securely ship your custom 3D art piece directly to your doorstep in the Philippines or abroad.',
      icon: Sparkles,
    },
  ];

  return (
    <section id="how-to-order" className="relative py-24 bg-neutral-950 border-t border-neutral-900 overflow-hidden">
      
      {/* Background radial accent */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-[0.25em] text-amber-400 mb-3">
            <span className="w-6 h-[1.5px] bg-amber-400" />
            <span>Commission Process</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-wide text-neutral-100">
            HOW TO ORDER YOUR CUSTOM 3D ART
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base font-light">
            Our smooth four-step artisan process makes turning your personal concepts into reality straightforward and enjoyable.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl bg-neutral-900/60 border border-neutral-800/90 p-7 flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 shadow-md group"
              >
                <div>
                  {/* Step indicator */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-heading font-black text-amber-500/90 tracking-wider">
                      {item.step}
                    </span>
                    <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-amber-400 group-hover:border-amber-500/50 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-heading text-base font-bold uppercase text-neutral-100 tracking-wide mb-3 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800/60 flex items-center text-[11px] font-mono uppercase tracking-widest text-neutral-500 group-hover:text-amber-400 transition-colors">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prominent Call to Action */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-amber-500/30 shadow-2xl max-w-2xl mx-auto">
            <div className="text-left">
              <h4 className="font-heading text-base sm:text-lg font-bold uppercase text-neutral-100">
                Ready to commission your artwork?
              </h4>
              <p className="text-xs text-neutral-400">
                Start your inquiry now and receive a custom consultation with our studio.
              </p>
            </div>

            <button
              onClick={onOpenOrderModal}
              className="px-8 py-3.5 text-xs font-bold tracking-[0.16em] uppercase text-neutral-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 rounded-lg shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:shadow-[0_0_35px_rgba(212,175,55,0.45)] transition-all transform active:scale-95 shrink-0 flex items-center gap-2"
            >
              <span>ORDER NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </section>
  );
};
