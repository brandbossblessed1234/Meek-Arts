import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PortfolioGallery } from './components/PortfolioGallery';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { HowToOrder } from './components/HowToOrder';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingMobileCTA } from './components/FloatingMobileCTA';
import { InquiryModal } from './components/InquiryModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.pathname === '/admin' || window.location.search.includes('admin=true') || window.location.hash === '#admin';
  });

  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [prefilledArtworkType, setPrefilledArtworkType] = useState('Custom 3D Sculpture');

  // Sync route on popstate
  useEffect(() => {
    const handleLocationChange = () => {
      const isAdm = window.location.pathname === '/admin' || window.location.search.includes('admin=true') || window.location.hash === '#admin';
      setIsAdminView(isAdm);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (path: string) => {
    if (path === '/admin') {
      window.history.pushState({}, '', '/admin');
      setIsAdminView(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.history.pushState({}, '', '/');
      setIsAdminView(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleInquireFromArtwork = (title: string) => {
    setPrefilledArtworkType(`Inquiry: ${title}`);
    setInquiryModalOpen(true);
  };

  const handleInquireFromService = (serviceName: string) => {
    setPrefilledArtworkType(serviceName);
    setInquiryModalOpen(true);
  };

  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
          
          {isAdminView ? (
            /* Admin Dashboard Mode */
            <AdminDashboard onBackToSite={() => navigateTo('/')} />
          ) : (
            /* Public Website Experience */
            <div className="flex flex-col min-h-screen">
              {/* Navigation Bar */}
              <Navbar 
                onOpenOrderModal={() => {
                  setPrefilledArtworkType('Custom 3D Sculpture');
                  setInquiryModalOpen(true);
                }} 
                onNavigateToAdmin={() => navigateTo('/admin')} 
              />

              {/* Main Landing Page Experience */}
              <main className="flex-1">
                {/* Hero Section */}
                <Hero 
                  onOpenOrderModal={() => {
                    setPrefilledArtworkType('Custom 3D Sculpture');
                    setInquiryModalOpen(true);
                  }} 
                  onNavigateToAdmin={() => navigateTo('/admin')}
                />

                {/* Portfolio / Finished Works Gallery */}
                <PortfolioGallery 
                  onInquireAboutProject={handleInquireFromArtwork} 
                />

                {/* About Us */}
                <AboutSection />

                {/* Custom 3D Art Services */}
                <ServicesSection 
                  onInquireService={handleInquireFromService} 
                />

                {/* 4-Step Commissioning Process */}
                <HowToOrder 
                  onOpenOrderModal={() => {
                    setPrefilledArtworkType('Custom 3D Sculpture');
                    setInquiryModalOpen(true);
                  }} 
                />

                {/* Studio Contact & Commission Inquiry Form */}
                <ContactSection 
                  prefilledArtworkType={prefilledArtworkType} 
                />
              </main>

              {/* Official Studio Footer */}
              <Footer 
                onNavigateToAdmin={() => navigateTo('/admin')} 
              />

              {/* Mobile Quick Action Strip (<15% screen height) */}
              <FloatingMobileCTA 
                onOpenOrderModal={() => {
                  setPrefilledArtworkType('Custom 3D Sculpture');
                  setInquiryModalOpen(true);
                }} 
              />

              {/* Commission Inquiry Modal */}
              <InquiryModal 
                isOpen={inquiryModalOpen} 
                onClose={() => setInquiryModalOpen(false)} 
                initialArtworkType={prefilledArtworkType} 
              />
            </div>
          )}

        </div>
      </DataProvider>
    </AuthProvider>
  );
}
