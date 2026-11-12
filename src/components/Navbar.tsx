import React, { useState } from 'react';
import { MeekLogo } from './MeekLogo';
import { Menu, X, PhoneCall } from 'lucide-react';

interface NavbarProps {
  onOpenOrderModal: () => void;
  onNavigateToAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenOrderModal, onNavigateToAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-neutral-950/85 border-b border-neutral-900/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark with 5-click Admin Backdoor */}
        <div className="flex items-center shrink-0">
          <MeekLogo size="md" onAdminTrigger={onNavigateToAdmin} />
        </div>

        {/* Zone 2: 4–5 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-300">
          <a href="#portfolio" className="hover:text-amber-400 transition-colors py-1 whitespace-nowrap shrink-0">
            Works
          </a>
          <a href="#about" className="hover:text-amber-400 transition-colors py-1 whitespace-nowrap shrink-0">
            About
          </a>
          <a href="#services" className="hover:text-amber-400 transition-colors py-1 whitespace-nowrap shrink-0">
            Services
          </a>
          <a href="#how-to-order" className="hover:text-amber-400 transition-colors py-1 whitespace-nowrap shrink-0">
            Process
          </a>
          <a href="#contact" className="hover:text-amber-400 transition-colors py-1 whitespace-nowrap shrink-0">
            Contact
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <button
            onClick={onOpenOrderModal}
            className="px-5 py-2.5 text-xs font-bold tracking-[0.14em] uppercase text-neutral-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 rounded shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all transform active:scale-95 whitespace-nowrap shrink-0"
          >
            ORDER NOW
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-2 text-neutral-300 hover:text-amber-400"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-950/98 border-b border-neutral-800 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3 text-sm uppercase tracking-widest font-medium text-neutral-300">
            <a 
              href="#portfolio" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-amber-400 border-b border-neutral-900"
            >
              Portfolio & Works
            </a>
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-amber-400 border-b border-neutral-900"
            >
              About Studio
            </a>
            <a 
              href="#services" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-amber-400 border-b border-neutral-900"
            >
              Custom Services
            </a>
            <a 
              href="#how-to-order" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-amber-400 border-b border-neutral-900"
            >
              How to Order
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-amber-400"
            >
              Contact Studio
            </a>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrderModal();
              }}
              className="w-full py-3 text-xs font-bold tracking-widest uppercase text-neutral-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 rounded text-center"
            >
              ORDER YOUR CUSTOM ARTWORK
            </button>
            
            <a
              href="tel:09385667572"
              className="flex items-center justify-center gap-2 py-2.5 text-xs tracking-wider uppercase text-neutral-300 border border-neutral-800 rounded hover:border-amber-500/50"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              Call Studio (09385667572)
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
