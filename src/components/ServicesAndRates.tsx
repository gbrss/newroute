import React, { useState, useEffect } from 'react';
import { ServiceTariff, ServiceCategory } from '../types';
import { getStoredTariffs, formatCLP } from '../lib/storage';
import { SERVICES_TARIFFS } from '../data/newrouteData';
import { Clock, Users, ArrowRight, Check, Sparkles } from 'lucide-react';

export const ServicesAndRates: React.FC = () => {
  const [tariffs, setTariffs] = useState<ServiceTariff[]>(SERVICES_TARIFFS);
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('todos');

  useEffect(() => {
    // Cargar datos iniciales
    setTariffs(getStoredTariffs());

    // Escuchar cambios desde el panel de gerencia
    const handleUpdate = () => setTariffs(getStoredTariffs());
    window.addEventListener('tariffs-updated', handleUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'newroute_tariffs_v1') handleUpdate();
    });

    return () => {
      window.removeEventListener('tariffs-updated', handleUpdate);
    };
  }, []);

  const categories: { id: ServiceCategory; label: string }[] = [
    { id: 'todos', label: 'Todos los Servicios' },
    { id: 'aeropuerto', label: 'Aeropuerto SCL' },
    { id: 'vinos', label: 'Rutas del Vino' },
    { id: 'ski', label: 'Centros de Ski' },
    { id: 'termas', label: 'Termas & Cordillera' },
    { id: 'city_tour', label: 'City Tours & Regiones' },
  ];

  const filtered = activeCategory === 'todos'
    ? tariffs
    : tariffs.filter((t) => t.category === activeCategory);

  return (
    <section id="servicios" className="py-20 lg:py-28 bg-stone-100/70 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-amber-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Tarifario Oficial 2026</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-stone-900 tracking-tight">
            Servicios Turísticos & Tarifas de Traslado
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-3 font-light">
            Valores oficiales en pesos chilenos (CLP) para vehículos ejecutivos. Sin cargos sorpresa ni tarifas dinámicas ocultas.
          </p>

          {/* Interactive Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 p-1.5 bg-stone-200/80 rounded-xl max-w-2xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Card Image */}
              <div className="relative h-48 overflow-hidden bg-stone-900">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <span className="flex items-center gap-1 font-medium bg-stone-900/80 px-2 py-0.5 rounded backdrop-blur-sm">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item.durationApprox}</span>
                  </span>
                  {item.featured && (
                    <span className="bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded text-[11px]">
                      Más Solicitado
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold font-display text-stone-900 leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-amber-800 font-medium mt-1">
                  {item.subtitle}
                </p>
                <p className="text-xs text-stone-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Highlights List */}
                <div className="my-4 pt-3 border-t border-stone-100 space-y-1.5 flex-1">
                  {item.highlights.slice(0, 3).map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-stone-600">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing Box - 3 Columnas */}
                <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 mb-4">
                  <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
                    Tarifa Oficial (CLP)
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <div className="text-stone-500 text-[9px] flex items-center gap-1 mb-0.5">
                        <Users className="w-3 h-3 text-stone-400" />
                        <span>1 a 3 PAX</span>
                      </div>
                      <div className="text-[11px] font-bold text-stone-900 font-display">
                        {formatCLP(item.price1to3)}
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <div className="text-stone-500 text-[9px] flex items-center gap-1 mb-0.5">
                        <Users className="w-3 h-3 text-stone-400" />
                        <span>4 a 6 PAX</span>
                      </div>
                      <div className="text-[11px] font-bold text-amber-700 font-display">
                        {formatCLP(item.price4to6)}
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <div className="text-stone-500 text-[9px] flex items-center gap-1 mb-0.5">
                        <Users className="w-3 h-3 text-stone-400" />
                        <span>7+ PAX</span>
                      </div>
                      <div className="text-[11px] font-bold text-amber-700 font-display">
                        {formatCLP(item.price7plus || Math.round(item.price4to6 * 1.4))}
                      </div>
                    </div>
                  </div>
                  {item.priceGroupNote && (
                    <p className="text-[10px] text-stone-500 mt-1.5 italic">
                      * {item.priceGroupNote}
                    </p>
                  )}
                </div>

                {/* Booking Trigger Button */}
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-booking-modal', { detail: { serviceId: item.id } }))}
                  className="w-full py-2.5 px-4 rounded-lg bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Reservar Este Servicio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Notice on Custom Group Logistics */}
        <div className="mt-12 p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-stone-900">
              ¿Viajas con un grupo corporativo o delegación de más de 7 pasajeros?
            </h4>
            <p className="text-xs text-stone-600 mt-1">
              Disponemos de vans Mercedes-Benz Sprinter para 12, 16 y 19 pasajeros con tarifas especiales por jornada o temporada.
            </p>
          </div>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-booking-modal', { detail: { serviceId: 'disposicion-por-hora' } }))}
            className="shrink-0 px-5 py-2.5 rounded-lg bg-stone-900 text-amber-400 hover:bg-stone-800 font-semibold text-xs transition-colors cursor-pointer"
          >
            Cotizar Van Grupal
          </button>
        </div>
      </div>
    </section>
  );
};