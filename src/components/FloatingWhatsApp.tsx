import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { COMPANY_INFO } from '../data/newrouteData';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const defaultMsg = encodeURIComponent(
    'Hola New Route Chile, me comunico desde la web oficial. Quisiera cotizar un traslado / tour privado.'
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 pointer-events-none">
      {/* Friendly floating speech bubble */}
      {showTooltip && (
        <div className="pointer-events-auto bg-stone-900 text-white p-3.5 rounded-2xl shadow-2xl border border-stone-800 max-w-xs text-xs relative animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-stone-400 hover:text-white p-0.5"
            aria-label="Cerrar notificación"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Operaciones New Route 24/7</span>
          </div>
          <p className="text-stone-300 pr-3">
            ¿Necesitas un traslado urgente al aeropuerto o consultar tarifas de hoy? Escríbenos directamente.
          </p>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${defaultMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-2xl shadow-emerald-600/50 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-8 h-8 fill-current" />
        <span className="sr-only">Contactar a New Route Chile por WhatsApp</span>
      </a>
    </div>
  );
};
