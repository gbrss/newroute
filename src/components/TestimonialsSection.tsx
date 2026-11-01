import React from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';
import { TESTIMONIALS } from '../data/newrouteData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonios" className="py-20 lg:py-28 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-700 mb-2">
            <MessageSquareQuote className="w-4 h-4 text-amber-600" />
            <span>Opiniones & Reseñas Verificadas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-stone-900 tracking-tight">
            La Confianza de Huéspedes y Empresas
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2 font-light">
            Más de 18 años atendiendo a viajeros internacionales, embajadas y huéspedes de prestigiosos hoteles de Santiago.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-stone-50 rounded-2xl p-7 border border-stone-200 hover:border-amber-400 transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Stars and date */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  {/* Clean unboxed metadata according to Zero-Pill discipline */}
                  <div className="text-xs text-stone-600">
                    <span>{t.date}</span>
                  </div>
                </div>

                <blockquote className="text-sm text-stone-800 leading-relaxed italic">
                  "{t.comment}"
                </blockquote>
              </div>

              {/* Author Info */}
              <div className="mt-6 pt-4 border-t border-stone-200/80">
                <div className="font-bold text-sm text-stone-900">{t.author}</div>
                {/* Editorial metadata without pills */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-600 mt-1">
                  <span>{t.roleOrOrigin}</span>
                  {t.hotelOrCompany && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-stone-700 font-medium">{t.hotelOrCompany}</span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-800 font-semibold">{t.serviceUsed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hotel Partnership Badge Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-stone-900 text-stone-300 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 font-bold text-lg font-display">
              5★
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                Colaboración Oficial con Hotelería de Santiago
              </div>
              <div className="text-stone-400 text-xs mt-0.5">
                Convenio de tarifas preferentes y atención prioritaria para conserjerías y huéspedes del Hotel InterContinental Santiago.
              </div>
            </div>
          </div>

          <div className="text-stone-400 text-xs shrink-0 font-medium">
            Facturación electrónica para empresas
          </div>
        </div>
      </div>
    </section>
  );
};
