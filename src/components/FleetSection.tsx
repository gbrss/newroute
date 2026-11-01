import React from 'react';
import { Shield, Wifi, Snowflake, Briefcase, Check, Car } from 'lucide-react';
import { IMAGES } from '../data/newrouteData';

export const FleetSection: React.FC = () => {
  const fleetCategories = [
    {
      title: 'Mercedes-Benz Sprinter VIP',
      type: 'Van Ejecutiva (7 a 19 Pasajeros)',
      description: 'Nuestra flota insignia para grupos, familias grandes y comitivas de congresos. Espacio de sobra para valijas grandes, equipaje de ski y trayectos de larga distancia con máxima suavidad.',
      features: ['Asientos individuales reclinables en cuero', 'Climatización bi-zona frío/calor', 'Gran maletero independiente', 'Porta-skies y cadenas de nieve'],
      image: IMAGES.hero,
    },
    {
      title: 'SUV Ejecutiva 4x4',
      type: 'Camioneta Tracción Integral (1 a 4 Pasajeros)',
      description: 'Vehículos con tracción a las cuatro ruedas preparados para el ascenso a la alta cordillera, centros de ski (Valle Nevado, Portillo) y caminos de ripio en viñas boutique.',
      features: ['Tracción 4WD para nieve y barro', 'Suspensión adaptativa de confort', 'Amplio espacio para compras de vinos', 'Seguro de montaña para pasajeros'],
      image: IMAGES.ski,
    },
    {
      title: 'Sedán Ejecutivo Confort',
      type: 'Automóvil de Gama Alta (1 a 3 Pasajeros)',
      description: 'Elegancia y discreción para traslados ejecutivos directos aeropuerto-hotel y servicio a disposición por hora en el distrito financiero de Santiago.',
      features: ['Insonorización acústica de cabina', 'Cargadores USB y conectividad', 'Conductores de impecable presentación', 'Acceso prioritario aeropuerto'],
      image: IMAGES.wine,
    },
  ];

  return (
    <section id="flota" className="py-20 bg-stone-900 text-white border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400 mb-2">
            <Car className="w-4 h-4 text-amber-500" />
            <span>Nuestra Flota</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            Vehículos Ejecutivos Preparados para Todo Terreno
          </h2>
          <p className="text-stone-400 text-sm sm:text-base mt-2 font-light">
            Mantenimiento preventivo riguroso en talleres de marca, seguros al día y homologación del Ministerio de Transportes y Telecomunicaciones de Chile.
          </p>
        </div>

        {/* Fleet Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fleetCategories.map((f, idx) => (
            <div
              key={idx}
              className="bg-stone-950/80 rounded-2xl border border-stone-800 overflow-hidden flex flex-col group hover:border-amber-500/40 transition-colors"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={f.image}
                  alt={f.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <span className="text-xs font-semibold text-amber-400">{f.type}</span>
                <h3 className="text-xl font-bold font-display text-white mt-1">{f.title}</h3>
                <p className="text-xs text-stone-400 mt-2 leading-relaxed flex-1">
                  {f.description}
                </p>

                <div className="my-5 pt-4 border-t border-stone-800 space-y-2">
                  {f.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-stone-300">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Standards Grid */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-stone-300 text-xs">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="font-semibold text-white">Seguros por Asiento</div>
              <div className="text-stone-400 text-[11px]">Pólizas de responsabilidad civil</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Snowflake className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="font-semibold text-white">Equipamiento Nieve</div>
              <div className="text-stone-400 text-[11px]">Cadenas y tracción autorizada</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="font-semibold text-white">Capacidad de Valijas</div>
              <div className="text-stone-400 text-[11px]">Espacio para equipaje sobredimensionado</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Wifi className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="font-semibold text-white">Monitoreo Satelital</div>
              <div className="text-stone-400 text-[11px]">GPS y telemetría 24/7</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
