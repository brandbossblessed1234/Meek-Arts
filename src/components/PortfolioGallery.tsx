import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Project, ProjectCategory } from '../types';
import { ProjectLightbox } from './ProjectLightbox';
import { Sparkles, Maximize2, Layers } from 'lucide-react';

const CATEGORIES: ('All' | ProjectCategory)[] = [
  'All',
  '3D Character Sculptures',
  'Custom Figures',
  'Collectible Art',
  'Display Sculptures',
  'Other Custom Projects',
];

interface PortfolioGalleryProps {
  onInquireAboutProject: (projectTitle: string) => void;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ onInquireAboutProject }) => {
  const { projects } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Filter only published projects for public visitors
  const publishedProjects = useMemo(() => {
    return projects.filter(p => p.isPublished);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return publishedProjects;
    return publishedProjects.filter(p => p.category === selectedCategory);
  }, [publishedProjects, selectedCategory]);

  return (
    <section id="portfolio" className="relative py-24 bg-neutral-950 border-t border-neutral-900">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="text-left max-w-2xl">
            <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-[0.25em] text-amber-400 mb-3">
              <span className="w-6 h-[1.5px] bg-amber-400" />
              <span>Finished Portfolio</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-wide text-neutral-100">
              OUR FINISHED WORKS
            </h2>
            <p className="mt-3 text-neutral-400 text-sm sm:text-base font-light">
              Explore bespoke 3D sculptures, customized collectible figures, and handcrafted art commissioned by clients and collectors.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400 uppercase tracking-widest font-mono shrink-0">
            <span className="text-amber-400 font-bold tabular-nums">{filteredProjects.length}</span>
            <span>Artworks on Display</span>
          </div>
        </div>

        {/* Category Filter Tabs (Zero-pill discipline: segmented clean tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-10 border-b border-neutral-900 custom-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 rounded-md ${
                selectedCategory === cat
                  ? 'bg-amber-400/10 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/30">
            <Layers className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-neutral-300">No artworks found in this category</h3>
            <p className="text-xs text-neutral-500 mt-1">Check back soon or explore our other collections.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const imageCount = project.images ? project.images.length : 1;
              return (
                <div
                  key={project.id}
                  onClick={() => setActiveProject(project)}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-neutral-900/70 border border-neutral-800/80 hover:border-amber-500/40 transition-all duration-300 flex flex-col shadow-lg hover:shadow-2xl hover:shadow-amber-950/20"
                >
                  {/* Image container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Expand icon on hover */}
                    <div className="absolute top-3 right-3 p-2 rounded-lg bg-neutral-950/70 border border-neutral-700/60 text-neutral-300 group-hover:text-amber-400 group-hover:border-amber-400/80 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm">
                      <Maximize2 className="w-4 h-4" />
                    </div>

                    {/* Multi-photo indicator if more than 1 image */}
                    {imageCount > 1 && (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-neutral-950/80 border border-neutral-700/80 text-[10px] font-mono text-neutral-300 backdrop-blur-sm">
                        {imageCount} photos
                      </div>
                    )}

                    {/* Featured highlight */}
                    {project.isFeatured && (
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-amber-500/90 text-neutral-950 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Information block */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Quiet unboxed metadata */}
                      <div className="flex items-center gap-2 text-xs text-neutral-400 uppercase tracking-widest font-medium mb-2">
                        <span className="text-amber-400 font-semibold">{project.category}</span>
                        {project.completionDate && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{project.completionDate}</span>
                          </>
                        )}
                      </div>

                      <h3 className="font-heading text-lg font-bold text-neutral-100 group-hover:text-amber-300 transition-colors leading-snug">
                        {project.title}
                      </h3>

                      <p className="mt-2 text-neutral-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* View prompt */}
                    <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 group-hover:text-amber-400 transition-colors">
                      <span className="uppercase tracking-widest font-semibold">View Artwork</span>
                      <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      <ProjectLightbox
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onInquire={(title) => {
          setActiveProject(null);
          onInquireAboutProject(title);
        }}
      />
    </section>
  );
};
