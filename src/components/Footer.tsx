import React from 'react';
import { Compass, Phone, Mail, MapPin, Clock, Settings } from 'lucide-react';
import { COMPANY_INFO } from '../data/newrouteData';
import { AppPage } from './Navbar';

interface FooterProps {
  onNavigate: (page: AppPage) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking }) => {
  return (
    <footer className="bg-stone-950 text-stone-400 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand & History */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5 text-stone-950" />
              </div>
              <div>
                <span className="text-lg font-bold font-display text-white tracking-tight">
                  NEW ROUTE CHILE
                </span>
                <p className="text-[11px] text-stone-500 font-medium">
                  Transporte de Pasajeros & Turismo Receptivo
                </p>
              </div>
            </div>

            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              Fundada en 2006. Casi dos décadas entregando soluciones de transporte privado, convenios hoteleros, excursiones a valles vitivinícolas y centros de esquí con los más altos estándares de calidad y seguridad.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onOpenBooking}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Solicitar Reserva 24/7
              </button>
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Datos de Contacto Central
            </div>

            <ul className="space-y-2.5 text-stone-300 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${COMPANY_INFO.phoneRaw}`} className="hover:text-amber-400">
                  {COMPANY_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-amber-400">
                  {COMPANY_INFO.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{COMPANY_INFO.schedule}</span>
              </li>
            </ul>
          </div>

          {/* Individual Pages & Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Páginas del Sitio
            </div>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Página de Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('empresa');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Nuestra Empresa (Historia 2006 & Flota)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('servicios');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Servicios & Tarifas Oficiales 2026
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      document.getElementById('testimonios')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Testimonios & Reseñas
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Contacto & Ubicación Ahumada 236
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Micro Copyright */}
        <div className="mt-12 pt-6 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px]">
          <div>
            © 2006–2026 New Route Chile SpA. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                onNavigate('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-stone-300 cursor-pointer"
            >
              Subir al Inicio ↑
            </button>
            <span aria-hidden="true" className="text-stone-800">·</span>
            <button
              onClick={() => {
                onNavigate('gerencia' as any);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 text-stone-500 hover:text-amber-400 transition-colors cursor-pointer text-[11px] group"
              title="Portal de Acceso a Gerencia & Operaciones"
            >
              <Settings className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 group-hover:rotate-45 transition-all" />
              <span>Acceso Gerencia ⚙️</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
