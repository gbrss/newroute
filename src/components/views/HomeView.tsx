import React from 'react';
import { Hero } from '../Hero';
import { TestimonialsSection } from '../TestimonialsSection';
import { ContactForm } from '../ContactForm';
import { ServiceTariff } from '../../types';
import { formatCLP } from '../../lib/storage';
import { ArrowRight, Plane, Wine, Mountain, ShieldCheck, Clock, Award, Users } from 'lucide-react';
import { COMPANY_INFO, IMAGES } from '../../data/newrouteData';

interface HomePageProps {
  onQuickBook: (serviceId?: string) => void;
  onNavigate: (page: 'home' | 'empresa' | 'servicios') => void;
  onOpenAstro: () => void;
  featuredTariffs: ServiceTariff[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onQuickBook,
  onNavigate,
  onOpenAstro,
  featuredTariffs,
}) => {
  return (
    <div>
      {/* Hero Section with Quick Booking Widget */}
      <Hero onQuickBook={onQuickBook} onOpenAstro={onOpenAstro} />

      {/* Featured Teaser: Rutas Más Solicitadas (preview only, full catalog on individual page) */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block mb-1">
                Servicios Destacados
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
                Experiencias & Traslados Populares
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Tarifas directas y fijas con conductores profesionales y vehículos de alta gama.
              </p>
            </div>

            <button
              onClick={() => onNavigate('servicios')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-800 hover:text-amber-950 transition-colors group cursor-pointer"
            >
              <span>Ver Catálogo Completo & Todas las Tarifas</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* 3 Featured Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTariffs.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all flex flex-col group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 bg-stone-900/90 text-white text-[11px] font-medium px-2 py-0.5 rounded backdrop-blur-sm">
                    {item.durationApprox}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-stone-900 leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-500 block">Desde (1-3 PAX)</span>
                      <strong className="text-sm font-bold text-amber-800 font-display">
                        {formatCLP(item.price1to3)}
                      </strong>
                    </div>

                    <button
                      onClick={() => onQuickBook(item.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-amber-600 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Teaser linking to "Nuestra Empresa" page */}
      <section className="py-16 bg-stone-900 text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                Tradición & Confianza Hotelera
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                New Route Chile: Más de 18 Años de Excelencia
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                Fundada en 2006 en Santiago por especialistas en alta hotelería y turismo receptivo. Conoce nuestra historia, equipo de conductores certificados y alianzas preferentes con hoteles 5 estrellas.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-stone-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Atención 24 Horas</span>
                </span>
                <span aria-hidden="true" className="text-stone-700">·</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Seguros de Pasajero</span>
                </span>
                <span aria-hidden="true" className="text-stone-700">·</span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Convenio InterContinental</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <button
                onClick={() => onNavigate('empresa')}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <span>Conocer Nuestra Empresa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Reviews Section */}
      <TestimonialsSection />

      {/* Contact Form Section */}
      <ContactForm />
    </div>
  );
};
