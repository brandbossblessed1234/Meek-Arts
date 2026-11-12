import React from 'react';
import { MeekLogo } from './MeekLogo';
import { useData } from '../context/DataContext';
import { Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigateToAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToAdmin }) => {
  const { settings } = useData();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-neutral-950 border-t border-neutral-900 text-neutral-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-900">
          
          {/* Brand & Studio Description */}
          <div className="md:col-span-6 space-y-4">
            <MeekLogo size="md" onAdminTrigger={onNavigateToAdmin} />
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md font-light leading-relaxed">
              Bespoke 3D sculptures, customized collectible figures, and extraordinary 3D art engineered and crafted with precision in Iloilo City, Philippines.
            </p>
            <blockquote className="text-xs italic text-amber-400/90 font-serif">
              &ldquo;{settings.bibleVerse}&rdquo; — {settings.bibleReference}
            </blockquote>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-200">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs uppercase tracking-wider">
              <li>
                <a href="#portfolio" className="hover:text-amber-400 transition-colors">
                  Finished Portfolio
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-amber-400 transition-colors">
                  About Studio
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">
                  Custom Services
                </a>
              </li>
              <li>
                <a href="#how-to-order" className="hover:text-amber-400 transition-colors">
                  How to Order
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-amber-400 transition-colors">
                  Contact & Inquiries
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-200">
              Studio Location
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{settings.location || 'Iloilo City, Philippines'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${(settings.contactNumber || '09385667572').replace(/[^0-9]/g, '')}`} className="hover:text-amber-400 font-mono">
                  {settings.contactNumber || '09385667572'}
                </a>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <ExternalLink className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href={settings.facebookUrl || 'https://www.facebook.com/profile.php?id=100091903210785'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 text-blue-300 font-medium"
                >
                  Facebook Official Page
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar with Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {currentYear} {settings.businessName || 'MEEK ARTS'}. All rights reserved.</p>
          <p className="text-[11px] text-neutral-600">
            Handcrafted with excellence in Iloilo City, Philippines
          </p>
        </div>

      </div>
    </footer>
  );
};
