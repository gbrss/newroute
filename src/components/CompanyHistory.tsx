import React from 'react';
import { ShieldCheck, History, Award, Building2, MapPin, CheckCircle2 } from 'lucide-react';
import { COMPANY_INFO, IMAGES } from '../data/newrouteData';

export const CompanyHistory: React.FC = () => {
  return (
    <section id="historia" className="py-20 lg:py-28 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Presentation */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-xl border border-stone-200">
                <img
                  src={IMAGES.city}
                  alt="Centro histórico de Santiago de Chile y turismo New Route"
                  className="w-full h-[440px] object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              {/* Float Experience Badge */}
              <div className="absolute -bottom-6 -right-6 bg-stone-900 text-white p-6 rounded-xl border border-stone-800 shadow-xl max-w-[260px]">
                <div className="text-3xl font-bold font-display text-amber-400 mb-1">
                  18+ Años
                </div>
                <p className="text-xs text-stone-300 leading-snug">
                  Entregando servicio continuo en Santiago, cordillera y valles vitivinícolas desde 2006.
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Content */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-700">
              <History className="w-4 h-4 text-amber-600" />
              <span>Nuestra Historia & Trayectoria</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-display text-stone-900 tracking-tight leading-tight">
              Una empresa nacida de la <span className="text-amber-700">alta hotelería</span> para pasajeros y empresas exigentes
            </h2>

            <div className="space-y-4 text-stone-600 leading-relaxed font-normal text-base">
              <p>
                <strong>New Route Chile</strong> fue fundada en el año <strong>2006</strong> por un equipo multidisciplinario de más de 20 profesionales con una amplia trayectoria vinculada al área de <strong>Hotelería y Turismo</strong>, sumando cada integrante un mínimo de 10 años de experiencia comprobada en el rubro.
              </p>
              <p>
                Nuestro objetivo fundacional se mantiene intacto: entregar un servicio de transporte privado y turismo receptivo de máxima categoría dentro de la Región Metropolitana y zonas turísticas de Chile, operando de manera continua las <strong>24 horas del día</strong> los 365 días del año.
              </p>
              <p>
                A lo largo de casi dos décadas, hemos consolidado estrechas alianzas con los principales hoteles de 4 y 5 estrellas de la capital, destacando acuerdos y tarifas preferentes con el <strong>Hotel InterContinental Santiago</strong>, aerolíneas y corporaciones multinacionales que confían en nuestra puntualidad inquebrantable.
              </p>
            </div>

            {/* Strategic Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-stone-50 border border-stone-200">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Conductores de Turismo</h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Profesionales con credenciales, capacitación en servicio al cliente y opción bilingüe (español/inglés).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-stone-50 border border-stone-200">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Seguridad & Seguros</h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Toda nuestra flota cuenta con pólizas de seguros de pasajeros por asiento y GPS en tiempo real.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-stone-50 border border-stone-200">
                <Building2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Oficina Central</h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Ahumada 236, Oficina 510, Santiago Centro. Coordinación operativa y soporte directo a clientes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-stone-50 border border-stone-200">
                <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Disponibilidad 24/7</h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Atención telefónica y vía WhatsApp para traslados de madrugada o emergencias hoteleras.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Quote Footer */}
            <div className="pt-2 flex items-center gap-2 text-xs text-stone-500">
              <MapPin className="w-4 h-4 text-amber-700" />
              <span>Sede Matriz: Ahumada 236, Of. 510, Santiago RM · Teléfono: +56 2 2394 2153</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
