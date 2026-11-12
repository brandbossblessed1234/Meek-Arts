import React from 'react';
import { Phone, MessageSquare, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';

interface FloatingMobileCTAProps {
  onOpenOrderModal: () => void;
}

export const FloatingMobileCTA: React.FC<FloatingMobileCTAProps> = ({ onOpenOrderModal }) => {
  const { settings } = useData();
  const phone = (settings.contactNumber || '09385667572').replace(/[^0-9]/g, '');

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 md:hidden p-3 bg-neutral-950/95 border-t border-neutral-800 backdrop-blur-lg shadow-[0_-8px_25px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        
        {/* Quick Call */}
        <a
          href={`tel:${phone}`}
          className="flex-1 py-2.5 px-2 bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-lg flex items-center justify-center gap-1.5 text-neutral-200 text-xs font-semibold uppercase tracking-wider"
        >
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>Call</span>
        </a>

        {/* Quick SMS */}
        <a
          href={`sms:${phone}`}
          className="flex-1 py-2.5 px-2 bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-lg flex items-center justify-center gap-1.5 text-neutral-200 text-xs font-semibold uppercase tracking-wider"
        >
          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
          <span>SMS</span>
        </a>

        {/* Commission Order */}
        <button
          onClick={onOpenOrderModal}
          className="flex-[2] py-2.5 px-3 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-neutral-950 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider shadow-md active:scale-95 transition-transform"
        >
          <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
          <span>Order Art</span>
        </button>

      </div>
    </div>
  );
};
