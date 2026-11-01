import React from 'react';
import { ServicesAndRates } from '../ServicesAndRates';
import { ServiceTariff } from '../../types';
import { ChevronRight, HelpCircle, ShieldCheck, Clock, Luggage, CreditCard } from 'lucide-react';

interface ServiciosPageProps {
  tariffs: ServiceTariff[];
  onSelectServiceToBook: (serviceId: string) => void;
  onNavigate: (page: 'home' | 'empresa' | 'servicios') => void;
}

export const ServiciosPage: React.FC<ServiciosPageProps> = ({
  tariffs,
  onSelectServiceToBook,
  onNavigate,
}) => {
  const faqs = [
    {
      q: '¿Qué incluye la tarifa de traslado al Aeropuerto SCL?',
      a: 'Incluye recepción en el área de llegadas con letrero personalizado, asistencia con las maletas, peajes de autopista (TAG), monitoreo en tiempo real del vuelo y espera de hasta 60 minutos sin costo adicional por retrasos.',
    },
    {
      q: '¿Cuál es la diferencia entre la tarifa de 1-3 PAX y 4-6 PAX?',
      a: 'Para 1 a 3 personas se asigna un Sedán Ejecutivo de confort o SUV. Para 4 a 6 personas se dispone de una Van Ejecutiva espaciosa con maletero ampliado para equipaje de gran tamaño.',
    },
    {
      q: '¿Las tarifas de las Rutas del Vino incluyen las entradas y degustaciones?',
      a: 'Nuestras tarifas cubren el transporte privado exclusivo de ida y vuelta con chofer a disposición durante la jornada. Las entradas a los tours guiados de las viñas y almuerzos se coordinan o abonan directamente en las bodegas según la preferencia de cada cliente.',
    },
    {
      q: '¿Tienen conductores bilingües?',
      a: 'Sí, disponemos de conductores con dominio fluido del idioma inglés. Puedes indicarlo al momento de realizar la reserva online o por WhatsApp.',
    },
    {
      q: '¿Qué medios de pago aceptan?',
      a: 'Aceptamos transferencias bancarias locales, tarjetas de crédito/débito internacionales, efectivo en pesos chilenos (CLP) o dólares estadounidenses (USD) y facturación electrónica para empresas con RUT.',
    },
  ];

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
            <span className="text-amber-400 font-medium">Servicios & Tarifas Oficiales</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
              Tarifario Oficial 2026 · New Route Chile
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
              Servicios Turísticos & Tarifas
            </h1>
            <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
              Consulta los valores oficiales en pesos chilenos (CLP) para traslados al Aeropuerto SCL, rutas del vino, centros de esquí en los Andes, termas naturales y tours patrimoniales.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services & Rates Catalog Component */}
      <ServicesAndRates
        tariffs={tariffs}
        onSelectServiceToBook={onSelectServiceToBook}
      />

      {/* Guarantees & Features Grid */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-stone-700">
            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h4 className="font-bold text-stone-900 text-sm">Tarifas Fijas 24/7</h4>
              <p className="text-stone-500 leading-relaxed">
                Sin sobreprecios nocturnos, días festivos o aumentos de tarifa dinámica por lluvia o demanda.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <Luggage className="w-5 h-5 text-amber-600" />
              <h4 className="font-bold text-stone-900 text-sm">Equipaje Sin Cargo Extra</h4>
              <p className="text-stone-500 leading-relaxed">
                Capacidad garantizada para maletas de bodega, bolsos de mano y equipamiento deportivo de ski.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <h4 className="font-bold text-stone-900 text-sm">Seguros de Pasajero</h4>
              <p className="text-stone-500 leading-relaxed">
                Pólizas con cobertura integral conforme al Decreto Supremo 80 del Ministerio de Transportes.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <CreditCard className="w-5 h-5 text-amber-600" />
              <h4 className="font-bold text-stone-900 text-sm">Facturación & Pago Fácil</h4>
              <p className="text-stone-500 leading-relaxed">
                Emitimos facturas y boletas electrónicas en pesos chilenos o dólares con pago online o presencial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-stone-100/70 border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block mb-1">
              Preguntas Frecuentes
            </span>
            <h2 className="text-3xl font-bold font-display text-stone-900">
              Dudas Habituales sobre Tarifas y Traslados
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-2"
              >
                <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-stone-900 font-display">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{faq.q}</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
