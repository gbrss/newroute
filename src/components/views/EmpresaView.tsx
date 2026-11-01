import React from 'react';
import { CompanyHistory } from '../CompanyHistory';
import { FleetSection } from '../FleetSection';
import { COMPANY_INFO, IMAGES } from '../../data/newrouteData';
import { Shield, Clock, Award, Building2, CheckCircle2, ChevronRight, Phone, MessageCircle } from 'lucide-react';

interface EmpresaPageProps {
  onNavigate: (page: 'home' | 'empresa' | 'servicios') => void;
  onOpenBooking: () => void;
}

export const EmpresaPage: React.FC<EmpresaPageProps> = ({ onNavigate, onOpenBooking }) => {
  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Page Header Banner */}
      <section className="bg-stone-900 text-white py-14 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-stone-400 mb-4">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Inicio
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
            <span className="text-amber-400 font-medium">Nuestra Empresa</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
              Acerca de New Route Chile · Est. 2006
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
              Nuestra Empresa & Trayectoria
            </h1>
            <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
              Casi dos décadas entregando soluciones de transporte privado, convenios hoteleros, excursiones a valles vitivinícolas y centros de esquí con los más altos estándares de calidad y seguridad en Chile.
            </p>
          </div>
        </div>
      </section>

      {/* Main History Component */}
      <CompanyHistory />

      {/* Mission, Vision & Strategic Values */}
      <section className="py-20 bg-stone-100/70 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block mb-1">
              Pilares Fundamentales
            </span>
            <h2 className="text-3xl font-bold font-display text-stone-900">
              Misión, Seguridad & Compromiso
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-stone-900">Misión Corporativa</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                Entregar un servicio de transporte y turismo de la más alta calidad, seguridad y puntualidad en la Región Metropolitana y zonas turísticas de Chile, con estándares hoteleros internacionales y atención continuada 24/7.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-stone-900">Seguridad & Normativa</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                Todos nuestros vehículos cumplen con las normativas del Ministerio de Transportes y Telecomunicaciones de Chile. Contamos con pólizas de seguros de pasajeros por asiento y revisión técnica al día.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-stone-900">Convenios Hoteleros</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                Alianzas operativas consolidadas con la conserjería de los principales hoteles de 4 y 5 estrellas de Santiago, destacando acuerdos con el <strong>Hotel InterContinental Santiago</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Fleet Section */}
      <FleetSection />

      {/* CTA Box at Bottom */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
            ¿Deseas cotizar un traslado o tour para tu viaje o empresa?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            Atendemos requerimientos individuales, comitivas internacionales y delegaciones de congresos las 24 horas del día.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenBooking}
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
            >
              Reservar Traslado Online
            </button>
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent('Hola New Route Chile, deseo cotizar servicios para mi empresa/hotel.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Contactar Operaciones 24/7</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
