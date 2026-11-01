import React, { useState } from 'react';
import { Phone, Calendar, Menu, X, Clock, MapPin } from 'lucide-react';
import { COMPANY_INFO } from '../data/newrouteData';
import logoNewRoute from '../assets/images/logo.png'; // <-- Importación del logo

export type AppPage = 'home' | 'empresa' | 'servicios';

interface NavbarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  onOpenBooking: () => void;
  onOpenAstro: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenBooking,
  onOpenAstro,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: AppPage, anchor?: string) => {
    setMobileMenuOpen(false);
    onNavigate(page);
    if (anchor) {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100">
      {/* Top micro bar with real contact and 24/7 status */}
      <div className="hidden lg:block bg-stone-950/80 border-b border-stone-800/60 py-1.5 px-4 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-stone-300">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Servicio continuado 24 Horas / 365 Días</span>
            </span>
            <span aria-hidden="true" className="text-stone-700">·</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>Ahumada 236, Of. 510, Santiago Centro</span>
            </span>
            <span aria-hidden="true" className="text-stone-700">·</span>
            <span className="text-stone-300 font-medium">Convenio Preferente Hotelería 5★</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="flex items-center gap-1.5 text-stone-300 hover:text-amber-400 transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>{COMPANY_INFO.phone}</span>
            </a>
            <span aria-hidden="true" className="text-stone-700">·</span>
            <button
              onClick={onOpenAstro}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Astro JS Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand identity */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          {/* Aquí reemplazamos el ícono por la imagen real */}
          {/* Ajustamos el alto (h-12) para que se vea bien en la barra de navegación */}
          <img 
            src={logoNewRoute} 
            alt="New Route Chile Logo" 
            className="h-18 w-auto object-contain transition-transform group-hover:scale-105" 
          />
        </button>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition-colors cursor-pointer py-1 ${
              currentPage === 'home'
                ? 'text-amber-400 font-bold border-b-2 border-amber-400'
                : 'text-stone-300 hover:text-amber-400'
            }`}
          >
            Inicio
          </button>

          <button
            onClick={() => handleNavClick('empresa')}
            className={`transition-colors cursor-pointer py-1 ${
              currentPage === 'empresa'
                ? 'text-amber-400 font-bold border-b-2 border-amber-400'
                : 'text-stone-300 hover:text-amber-400'
            }`}
          >
            Nuestra Empresa
          </button>

          <button
            onClick={() => handleNavClick('servicios')}
            className={`transition-colors cursor-pointer py-1 ${
              currentPage === 'servicios'
                ? 'text-amber-400 font-bold border-b-2 border-amber-400'
                : 'text-stone-300 hover:text-amber-400'
            }`}
          >
            Servicios & Tarifas
          </button>

          <button
            onClick={() => handleNavClick('home', 'testimonios')}
            className="text-stone-300 hover:text-amber-400 transition-colors cursor-pointer py-1"
          >
            Testimonios
          </button>

          <button
            onClick={() => handleNavClick('home', 'contacto')}
            className="text-stone-300 hover:text-amber-400 transition-colors cursor-pointer py-1"
          >
            Contacto
          </button>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm shadow-md shadow-amber-500/20 transition-all transform active:scale-95 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-stone-950" />
            <span>Gestionar Reserva</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenBooking}
            className="p-2 rounded-lg bg-amber-500 text-stone-950 text-xs font-semibold"
            aria-label="Reservar"
          >
            <Calendar className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-stone-300 hover:bg-stone-800 transition-colors"
            aria-label="Menú principal"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-950 border-b border-stone-800 px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-2 text-stone-300 font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left py-2 px-3 rounded cursor-pointer ${
                currentPage === 'home' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'hover:bg-stone-800'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => handleNavClick('empresa')}
              className={`w-full text-left py-2 px-3 rounded cursor-pointer ${
                currentPage === 'empresa' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'hover:bg-stone-800'
              }`}
            >
              Nuestra Empresa (Página Oficial)
            </button>
            <button
              onClick={() => handleNavClick('servicios')}
              className={`w-full text-left py-2 px-3 rounded cursor-pointer ${
                currentPage === 'servicios' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'hover:bg-stone-800'
              }`}
            >
              Servicios & Tarifas Oficiales (Página Oficial)
            </button>
            <button
              onClick={() => handleNavClick('home', 'testimonios')}
              className="w-full text-left py-2 px-3 rounded hover:bg-stone-800 cursor-pointer"
            >
              Testimonios de Clientes
            </button>
            <button
              onClick={() => handleNavClick('home', 'contacto')}
              className="w-full text-left py-2 px-3 rounded hover:bg-stone-800 cursor-pointer"
            >
              Contacto & Ubicación
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAstro();
              }}
              className="w-full text-left py-2 px-3 rounded text-amber-400 hover:bg-stone-800 cursor-pointer"
            >
              Ver Código Astro JS & Cloudflare
            </button>
          </div>

          <div className="pt-3 border-t border-stone-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-amber-500 text-stone-950 font-bold text-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Reservar Traslado / Tour</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};