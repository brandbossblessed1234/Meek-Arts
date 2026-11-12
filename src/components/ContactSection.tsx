import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Phone, MessageSquare, ExternalLink, Send, CheckCircle2, AlertCircle, Upload, Loader2, Sparkles } from 'lucide-react';

interface ContactSectionProps {
  prefilledArtworkType?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ prefilledArtworkType = '' }) => {
  const { settings, submitInquiry, uploadImage } = useData();

  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [artworkType, setArtworkType] = useState(prefilledArtworkType || 'Custom 3D Sculpture');
  const [description, setDescription] = useState('');
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

    // Validation
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!contactNumber.trim()) {
      setErrorMessage('Please provide a contact number.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please describe your desired artwork or specifications.');
      return;
    }

    try {
      setSubmitting(true);
      let referenceImageUrl = '';

      if (referenceFile) {
        referenceImageUrl = await uploadImage(referenceFile);
      }

      // Save inquiry to Firestore database
      const id = await submitInquiry({
        customerName: customerName.trim(),
        contactNumber: contactNumber.trim(),
        artworkType: artworkType.trim(),
        description: description.trim(),
        referenceImage: referenceImageUrl || undefined,
      });

      setSuccessId(id);
      // Reset form
      setCustomerName('');
      setContactNumber('');
      setDescription('');
      setReferenceFile(null);
      setReferencePreview(null);
    } catch (err: unknown) {
      console.error('Inquiry Submission Error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to submit inquiry. Please try again or reach out on Facebook.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const contactPhone = settings.contactNumber || '09385667572';
  const cleanPhone = contactPhone.replace(/[^0-9]/g, '');

  return (
    <section id="contact" className="relative py-24 bg-neutral-950 border-t border-neutral-900">
      
      {/* Background ambient lighting */}
      <div className="absolute left-1/4 bottom-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-[0.25em] text-amber-400 mb-3">
            <span className="w-6 h-[1.5px] bg-amber-400" />
            <span>Studio Inquiries</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-wide text-neutral-100">
            CONNECT WITH MEEK STUDIO
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base font-light">
            Discuss your custom 3D sculpture project with our artist directly, request quotations, or visit our official social channel.
          </p>
        </div>

        {/* 2-Column Layout: Direct Action Buttons & Inquiries Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Communication Channels */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800/90 shadow-xl space-y-6">
              
              <div>
                <h3 className="font-heading text-lg font-bold uppercase text-neutral-100 tracking-wide">
                  {settings.businessName || 'MEEK STUDIO 3D ART'}
                </h3>
                <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mt-1">
                  {settings.location || 'Iloilo City, Philippines'}
                </p>
                <p className="text-neutral-400 text-xs mt-2 font-mono">
                  Direct Line: {contactPhone}
                </p>
              </div>

              {/* Functional Quick Action Buttons */}
              <div className="space-y-3 pt-2">
                {/* CALL NOW */}
                <a
                  href={`tel:${cleanPhone}`}
                  className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-900 text-neutral-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-bold uppercase tracking-wider text-neutral-100">
                        CALL NOW
                      </span>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {contactPhone}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400 font-medium tracking-wide">tel</span>
                </a>

                {/* SEND SMS */}
                <a
                  href={`sms:${cleanPhone}`}
                  className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-900 text-neutral-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-bold uppercase tracking-wider text-neutral-100">
                        SEND SMS
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        Direct text message to studio
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400 font-medium tracking-wide">sms</span>
                </a>

                {/* MESSAGE US ON FACEBOOK */}
                <a
                  href={settings.facebookUrl || 'https://www.facebook.com/profile.php?id=100091903210785'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 via-neutral-900 to-neutral-950 border border-blue-900/40 hover:border-blue-500/50 text-neutral-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 group-hover:bg-blue-600/30">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-bold uppercase tracking-wider text-neutral-100">
                        MESSAGE ON FACEBOOK
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        Official Page & Messenger
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-blue-400 font-medium tracking-wide">chat</span>
                </a>
              </div>

              {/* Consultation Note */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs text-neutral-400 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Free Consultation</span>
                </div>
                <p>
                  We are glad to assist with scale sizing, color finishes, structural wall mounts, and shipping logistics.
                </p>
              </div>

            </div>

          </div>

          {/* Right Column: Custom Inquiry Submission Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800/90 shadow-2xl">
              
              <div className="mb-6">
                <h3 className="font-heading text-lg font-bold uppercase text-neutral-100 tracking-wide">
                  SEND A CUSTOM COMMISSION INQUIRY
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Fill in your details below and we will contact you directly with design recommendations and pricing.
                </p>
              </div>

              {/* Success Notification (Confirmed strictly after Firestore saving) */}
              {successId && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wide">
                      Inquiry Successfully Submitted!
                    </h4>
                    <p className="text-xs text-emerald-300/90 mt-1 leading-relaxed">
                      Thank you! Your project inquiry has been saved to the Meek Studio database. We will review your request and get in touch with you shortly.
                    </p>
                    <span className="inline-block mt-2 font-mono text-[11px] text-emerald-400/80">
                      Reference ID: {successId}
                    </span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold block uppercase tracking-wide">Submission Issue</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Customer Name & Contact Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                      Customer Name <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Maria Santos"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-400 text-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                      Contact Number <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="e.g. 0917 123 4567"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-400 text-sm font-mono transition-colors"
                    />
                  </div>
                </div>

                {/* Type of Artwork */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                    Type of Artwork <span className="text-amber-500">*</span>
                  </label>
                  <select
                    value={artworkType}
                    onChange={(e) => setArtworkType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 focus:outline-none focus:border-amber-400 text-sm transition-colors"
                  >
                    <option value="Custom 3D Sculpture">Custom 3D Sculpture (Centerpiece / Display)</option>
                    <option value="Character Figure">Character Figure (Anime / Gaming / Comic)</option>
                    <option value="Collectible Figure">Collectible Figure (Limited Edition / Miniature)</option>
                    <option value="Personalized 3D Art">Personalized 3D Art (Portrait Bust / Crest)</option>
                    <option value="Custom Art Project">Custom Art Project (Props / Architectural / Other)</option>
                  </select>
                </div>

                {/* Project Description */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                    Project Description & Details <span className="text-amber-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your desired artwork, dimensions/height, inspiration, poses, preferred material finish (gold accents, bronze, full color), and target deadline if any..."
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-400 text-sm leading-relaxed transition-colors"
                  />
                </div>

                {/* Reference Image Upload (Optional) */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                    Reference Image or Sketch (Optional)
                  </label>

                  {referencePreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 p-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={referencePreview}
                          alt="Reference preview"
                          className="w-14 h-14 object-cover rounded-lg border border-neutral-800"
                        />
                        <div className="text-xs text-neutral-300">
                          <span className="font-semibold block truncate max-w-[200px]">
                            {referenceFile?.name}
                          </span>
                          <span className="text-neutral-500 text-[10px]">
                            {((referenceFile?.size || 0) / 1024).toFixed(0)} KB
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 border border-rose-900/60 rounded-md hover:bg-rose-950/40 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-neutral-800 hover:border-amber-500/50 bg-neutral-950/60 cursor-pointer transition-colors group">
                      <Upload className="w-6 h-6 text-neutral-500 group-hover:text-amber-400 transition-colors mb-2" />
                      <span className="text-xs text-neutral-300 font-medium">
                        Click or drag to upload reference image
                      </span>
                      <span className="text-[10px] text-neutral-500 mt-0.5">
                        PNG, JPG, or WEBP (Max 15MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 text-xs font-bold tracking-[0.16em] uppercase text-neutral-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 disabled:opacity-50 rounded-xl shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:shadow-[0_0_35px_rgba(212,175,55,0.45)] transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                        <span>SAVING INQUIRY TO STUDIO...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-neutral-950" />
                        <span>SUBMIT ARTWORK INQUIRY</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
