import React, { useState, useEffect } from 'react';
import { X, Send, Loader2, CheckCircle2, AlertCircle, Upload, Phone } from 'lucide-react';
import { useData } from '../context/DataContext';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialArtworkType?: string;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ 
  isOpen, 
  onClose, 
  initialArtworkType = 'Custom 3D Sculpture' 
}) => {
  const { submitInquiry, uploadImage, settings } = useData();

  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [artworkType, setArtworkType] = useState(initialArtworkType);
  const [description, setDescription] = useState('');
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialArtworkType) {
      setArtworkType(initialArtworkType);
    }
  }, [initialArtworkType]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReferenceFile(file);
      setReferencePreview(URL.createObjectURL(file));
    }
  };

  const removeFile = () => {
    setReferenceFile(null);
    setReferencePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessId(null);

    if (!customerName.trim() || !contactNumber.trim() || !description.trim()) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      let referenceImageUrl = '';

      if (referenceFile) {
        referenceImageUrl = await uploadImage(referenceFile);
      }

      const id = await submitInquiry({
        customerName: customerName.trim(),
        contactNumber: contactNumber.trim(),
        artworkType: artworkType.trim(),
        description: description.trim(),
        referenceImage: referenceImageUrl || undefined,
      });

      setSuccessId(id);
      setCustomerName('');
      setContactNumber('');
      setDescription('');
      setReferenceFile(null);
      setReferencePreview(null);
    } catch (err: unknown) {
      console.error('Inquiry Submission Error:', err);
      const msg = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-800/80 flex items-center justify-between bg-neutral-900/40">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 block">
              Meek Studio 3D Art
            </span>
            <h3 className="font-heading text-lg sm:text-xl font-bold uppercase text-neutral-100">
              Order Custom Artwork
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {successId ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h4 className="font-heading text-xl font-bold uppercase text-neutral-100">
                Inquiry Received!
              </h4>

              <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                Your custom sculpture inquiry has been saved. The studio will review your request and contact you directly via phone or WhatsApp/Viber.
              </p>

              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-xs text-amber-400">
                Reference ID: {successId}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setSuccessId(null);
                    onClose();
                  }}
                  className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-800 text-neutral-200 rounded-lg hover:bg-neutral-700"
                >
                  Close Window
                </button>
                <a
                  href={`tel:${(settings.contactNumber || '09385667572').replace(/[^0-9]/g, '')}`}
                  className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-amber-400 text-neutral-950 rounded-lg hover:bg-amber-300 flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Studio Directly
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              {errorMessage && (
                <div className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Name & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Your Name <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Phone / Contact <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="09XX XXX XXXX"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Artwork Type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Type of Artwork <span className="text-amber-500">*</span>
                </label>
                <select
                  value={artworkType}
                  onChange={(e) => setArtworkType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-400"
                >
                  <option value="Custom 3D Sculpture">Custom 3D Sculpture</option>
                  <option value="Character Figure">Character Figure</option>
                  <option value="Collectible Figure">Collectible Figure</option>
                  <option value="Personalized 3D Art">Personalized 3D Art</option>
                  <option value="Custom Art Project">Custom Art Project</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Project Description <span className="text-amber-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about the desired scale, character pose, finish (metallic gold, graphite, full color), and any references..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm leading-relaxed focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Reference Photograph / Concept (Optional)
                </label>
                {referencePreview ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                    <div className="flex items-center gap-2">
                      <img src={referencePreview} alt="Preview" className="w-10 h-10 object-cover rounded" />
                      <span className="text-xs text-neutral-300 truncate max-w-[180px]">{referenceFile?.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-dashed border-neutral-800 hover:border-amber-500/50 bg-neutral-900/60 cursor-pointer text-xs text-neutral-400 hover:text-neutral-200 transition-colors">
                    <Upload className="w-4 h-4 text-amber-500" />
                    <span>Upload reference image</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 text-xs font-bold tracking-[0.16em] uppercase text-neutral-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 disabled:opacity-50 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};
