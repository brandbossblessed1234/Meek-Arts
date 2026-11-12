import React from 'react';
import { useData } from '../context/DataContext';
import { ArrowUpRight } from 'lucide-react';

interface ServicesSectionProps {
  onInquireService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onInquireService }) => {
  const { services } = useData();

  return (
    <section id="services" className="relative py-24 bg-neutral-950 border-t border-neutral-900">
      
      {/* Background glow */}
      <div className="absolute right-0 top-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-[0.25em] text-amber-400 mb-3">
            <span className="w-6 h-[1.5px] bg-amber-400" />
            <span>Studio Capabilities</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-wide text-neutral-100">
            OUR CUSTOM 3D SERVICES
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base font-light">
            From initial digital conceptualization to physical fabrication, discover the range of bespoke 3D art solutions crafted by Meek Studio.
          </p>
        </div>

        {/* Services List / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group relative rounded-2xl overflow-hidden bg-neutral-900/60 border border-neutral-800/80 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between p-6 sm:p-7 shadow-lg"
            >
              <div className="space-y-4">
                
                {/* Optional sample photograph */}
                {service.imageUrl && (
                  <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Index & Name */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-mono text-amber-500/80 font-bold tracking-wider">
                      {(index + 1).toString().padStart(2, '0')}.
                    </span>
                    <h3 className="font-heading text-lg sm:text-xl font-bold uppercase text-neutral-100 group-hover:text-amber-300 transition-colors mt-1">
                      {service.name}
                    </h3>
                  </div>

                  {/* Optional Starting Price (Only shown if provided) */}
                  {service.startingPrice && service.startingPrice.trim() !== '' && (
                    <div className="text-right shrink-0">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Starting from</span>
                      <span className="text-xs font-semibold text-amber-400 font-mono">{service.startingPrice}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-light">
                  {service.description}
                </p>

              </div>

              {/* Inquiry Action */}
              <div className="pt-6 mt-6 border-t border-neutral-800/80 flex items-center justify-between">
                <button
                  onClick={() => onInquireService(service.name)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-amber-400 hover:text-amber-300 transition-colors group-hover:translate-x-1 duration-200"
                >
                  <span>Inquire for this service</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

    </section>
  );
};
