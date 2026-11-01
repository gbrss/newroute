import React, { useState, useEffect } from 'react';
import { Navbar, AppPage as PublicAppPage } from './components/Navbar';
import { HomePage as HomeView } from './components/views/HomeView';
import { EmpresaPage as EmpresaView } from './components/views/EmpresaView';
import { ServiciosPage as ServiciosView } from './components/views/ServiciosView';
import { GerenciaPage as GerenciaView } from './components/views/GerenciaView';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { BookingModal } from './components/BookingModal';
import { AstroMigrationModal } from './components/AstroMigrationModal';
import { getStoredBookings, getStoredContacts, getStoredTariffs } from './lib/storage';
import { BookingRequest, ContactMessage, ServiceTariff } from './types';

export type AppPage = PublicAppPage | 'gerencia';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);
  const [isAstroModalOpen, setIsAstroModalOpen] = useState(false);

  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [tariffs, setTariffs] = useState<ServiceTariff[]>([]);

  const loadData = () => {
    setBookings(getStoredBookings());
    setContacts(getStoredContacts());
    setTariffs(getStoredTariffs());
  };

  useEffect(() => {
    loadData();

    // Check pathname and hash for /gerencia or other routes
    const pathname = window.location.pathname.toLowerCase();
    const hash = window.location.hash.replace('#', '').toLowerCase();

    if (pathname.includes('/gerencia') || hash.includes('gerencia')) {
      setCurrentPage('gerencia');
    } else if (hash === 'empresa') {
      setCurrentPage('empresa');
    } else if (hash === 'servicios') {
      setCurrentPage('servicios');
    } else {
      setCurrentPage('home');
    }

    const handleRouteCheck = () => {
      const p = window.location.pathname.toLowerCase();
      const h = window.location.hash.replace('#', '').toLowerCase();

      if (p.includes('/gerencia') || h.includes('gerencia')) {
        setCurrentPage('gerencia');
      } else if (h === 'empresa') {
        setCurrentPage('empresa');
      } else if (h === 'servicios') {
        setCurrentPage('servicios');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleRouteCheck);
    window.addEventListener('popstate', handleRouteCheck);

    return () => {
      window.removeEventListener('hashchange', handleRouteCheck);
      window.removeEventListener('popstate', handleRouteCheck);
    };
  }, []);

  const handleNavigate = (page: AppPage) => {
    setCurrentPage(page);
    if (page === 'gerencia') {
      window.location.hash = 'gerencia';
    } else if (page === 'home') {
      window.location.hash = 'inicio';
    } else {
      window.location.hash = page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (serviceId?: string) => {
    if (serviceId) {
      setPreselectedServiceId(serviceId);
    }
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setPreselectedServiceId(undefined);
  };

  // If on /gerencia, render the isolated Gerencia Portal with login & operations dashboard
  if (currentPage === 'gerencia') {
    return (
      <GerenciaView
        bookings={bookings}
        contacts={contacts}
        tariffs={tariffs}
        onRefreshData={loadData}
        onNavigateHome={() => handleNavigate('home')}
      />
    );
  }

  // Public Web Pages (Home, Empresa, Servicios)
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans selection:bg-amber-800 selection:text-white">
      {/* Navigation (Strictly public, NO admin links anywhere) */}
      <Navbar
        currentPage={currentPage as PublicAppPage}
        onNavigate={(p) => handleNavigate(p)}
        onOpenBooking={() => handleOpenBooking()}
        onOpenAstro={() => setIsAstroModalOpen(true)}
      />

      {/* Main Multi-Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomeView
            onQuickBook={handleOpenBooking}
            onNavigate={(p) => handleNavigate(p)}
            onOpenAstro={() => setIsAstroModalOpen(true)}
            featuredTariffs={tariffs}
          />
        )}

        {currentPage === 'empresa' && (
          <EmpresaView
            onNavigate={(p) => handleNavigate(p)}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentPage === 'servicios' && (
          <ServiciosView
            tariffs={tariffs}
            onSelectServiceToBook={handleOpenBooking}
            onNavigate={(p) => handleNavigate(p)}
          />
        )}
      </main>

      {/* Footer (Strictly public) */}
      <Footer
        onNavigate={(p) => handleNavigate(p)}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Floating 24/7 WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Booking Management & Wizard Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        tariffs={tariffs}
        preselectedServiceId={preselectedServiceId}
        onBookingCreated={() => {
          loadData();
        }}
      />

      {/* Astro JS Migration & Code Hub Modal */}
      <AstroMigrationModal
        isOpen={isAstroModalOpen}
        onClose={() => setIsAstroModalOpen(false)}
      />
    </div>
  );
}
