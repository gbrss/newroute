import React, { useState } from 'react';
import { Calendar, Users, MapPin, ArrowRight, ShieldCheck, Clock, Award } from 'lucide-react';
import { COMPANY_INFO, IMAGES, SERVICES_TARIFFS } from '../data/newrouteData';

interface HeroProps {
  onQuickBook: (serviceId?: string) => void;
  onOpenAstro?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onQuickBook, onOpenAstro }) => {
  const [selectedService, setSelectedService] = useState('transfer-aeropuerto');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickBook(selectedService);
  };

  return (
    <section id="inicio" className="relative min-h-[680px] lg:min-h-[760px] flex items-center bg-stone-950 text-white overflow-hidden">
      {/* Background Photography with atmospheric overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={IMAGES.hero}
          alt="Transporte ejecutivo New Route Chile en ruta con cordillera de los Andes"
          className="w-full h-full object-cover object-center filter brightness-[0.45] scale-105 transition-transform duration-1000 ease-out"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Presentation */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Fundada en 2006 · Santiago de Chile</span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span>18+ Años de Excelencia</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight leading-[1.08] text-white">
              Transporte Privado de Alta Gama & <span className="text-amber-400">Turismo Receptivo 24/7</span>
            </h1>

            <p className="text-lg sm:text-xl text-stone-300 max-w-2xl leading-relaxed font-light">
              Conexión directa entre el Aeropuerto SCL, hoteles de lujo, viñas de prestigio y los Andes chilenos. Conductores profesionales formados en alta hotelería y flota ejecutiva de máximo estándar.
            </p>

            {/* Proof Points */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-stone-300 border-t border-stone-800/80">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Atención 24/7 sin recargo nocturno</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Seguro de asiento y chofer profesional</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Convenio InterContinental & 5★</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <a
                href="#servicios"
                className="px-5 py-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-xs border border-stone-700 transition-colors"
              >
                Ver Todas las Tarifas Oficiales
              </a>
              {onOpenAstro && (
                <button
                  onClick={onOpenAstro}
                  className="px-4 py-3 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 font-bold text-xs border border-amber-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Código Astro JS & Cloudflare</span>
                </button>
              )}
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent('Hola New Route Chile, deseo consultar disponibilidad para un traslado.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-stone-300 hover:text-emerald-400 font-medium text-xs transition-colors py-2 px-2"
              >
                <span>WhatsApp 24/7: {COMPANY_INFO.whatsapp}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Integrated Instant Booking Quote Card */}
          <div className="lg:col-span-5">
            <div className="bg-stone-900/90 backdrop-blur-md rounded-2xl border border-stone-800 p-6 sm:p-8 shadow-2xl">
              <div className="mb-6">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                  Sistema de Reservas
                </span>
                <h2 className="text-2xl font-bold font-display text-white">
                  Cotiza tu Traslado o Tour
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Reserva online inmediata con tarifas fijas en pesos chilenos.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Servicio o Destino
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    {SERVICES_TARIFFS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-500" />
                      <span>Fecha tentativa</span>
                    </label>
                    <input
                      type="date"
                      defaultValue={new Date().toISOString().slice(0, 10)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-stone-500" />
                      <span>Pasajeros</span>
                    </label>
                    <select
                      defaultValue="1-3"
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    >
                      <option value="1-3">1 a 3 Pasajeros (Sedán / SUV)</option>
                      <option value="4-6">4 a 6 Pasajeros (Van Ejecutiva)</option>
                      <option value="7+">7 o más (Grupo / Van Sprinter)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-500" />
                    <span>Lugar de recogida / Hotel</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Aeropuerto SCL, Hotel InterContinental, Las Condes..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Calendar className="w-4 h-4 text-stone-950" />
                  <span>Continuar y Confirmar Reserva</span>
                </button>

                <p className="text-[11px] text-center text-stone-400 pt-1">
                  Sin cargos ocultos · Confirmación inmediata vía web o WhatsApp
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
