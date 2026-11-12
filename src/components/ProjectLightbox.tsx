import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { X, ChevronLeft, ChevronRight, Calendar, Tag, Sparkles, MessageSquare } from 'lucide-react';

interface ProjectLightboxProps {
  project: Project | null;
  onClose: () => void;
  onInquire: (projectTitle: string) => void;
}

export const ProjectLightbox: React.FC<ProjectLightboxProps> = ({ project, onClose, onInquire }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset index when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [project]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, currentImageIndex]);

  if (!project) return null;

  const images = project.images && project.images.length > 0 ? project.images : [project.coverImage];
  const activeImage = images[currentImageIndex] || project.coverImage;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-6 lg:p-10 animate-in fade-in duration-300">
      
      {/* Close Button */}
      <button
        onClick={onClose}
        aria-label="Close modal"
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-neutral-900/80 border border-neutral-700/80 text-neutral-300 hover:text-white hover:border-amber-400 transition-colors shadow-lg"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col lg:flex-row bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Left: Image Viewer with Carousel */}
        <div className="relative lg:w-2/3 bg-black flex items-center justify-center min-h-[350px] sm:min-h-[450px] lg:min-h-[600px] overflow-hidden select-none">
          <img
            src={activeImage}
            alt={`${project.title} photograph ${currentImageIndex + 1}`}
            referrerPolicy="no-referrer"
            className="w-full h-full max-h-[85vh] object-contain transition-opacity duration-300"
          />

          {/* Carousel Arrows (only if multiple images) */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                aria-label="Previous photograph"
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-amber-400 transition-colors shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                aria-label="Next photograph"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-amber-400 transition-colors shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Photo count indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-700/80 text-xs font-mono text-neutral-300">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}

          {/* Thumbnail Strip (if multiple images) */}
          {images.length > 1 && (
            <div className="absolute top-4 left-4 flex gap-2 max-w-[80%] overflow-x-auto pb-1 custom-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-12 h-12 rounded-md overflow-hidden border-2 shrink-0 transition-all ${
                    idx === currentImageIndex ? 'border-amber-400 scale-105' : 'border-neutral-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Project Details & Inquire CTA */}
        <div className="lg:w-1/3 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[45vh] lg:max-h-[85vh] bg-neutral-950 border-t lg:border-t-0 lg:border-l border-neutral-800 custom-scrollbar">
          
          <div className="space-y-6">
            
            {/* Category & Status */}
            <div className="flex items-center gap-2 text-xs text-neutral-400 uppercase tracking-widest font-medium">
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-400 font-semibold">{project.category}</span>
              {project.completionDate && (
                <>
                  <span aria-hidden="true">·</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-neutral-500" />
                    <span>{project.completionDate}</span>
                  </div>
                </>
              )}
            </div>

            {/* Title */}
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-neutral-100 uppercase tracking-wide leading-tight">
              {project.title}
            </h3>

            {/* Description */}
            <div className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line font-light border-t border-b border-neutral-900 py-4">
              {project.description}
            </div>

            {/* Studio Specifications Note */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Custom Order Available</span>
              </div>
              <p>
                Interested in commissioning a similar sculpture or custom variations in scale, color palette, or presentation plinth?
              </p>
            </div>

          </div>

          {/* Action Button */}
          <div className="pt-6">
            <button
              onClick={() => {
                onClose();
                onInquire(project.title);
              }}
              className="w-full py-3.5 px-6 text-xs font-bold tracking-[0.16em] uppercase text-neutral-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all flex items-center justify-center gap-2 text-center"
            >
              <MessageSquare className="w-4 h-4 text-neutral-950" />
              INQUIRE ABOUT THIS ARTWORK
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
