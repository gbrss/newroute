import React from 'react';
import { LifeBuoy, MessageCircle } from 'lucide-react';

export const TabSupport: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto mt-4 sm:mt-12 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-12 shadow-sm text-center transition-colors duration-300">
      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 sm:mb-6 shadow-inner">
        <LifeBuoy className="w-8 h-8 sm:w-10 sm:h-10" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold font-display text-stone-900 dark:text-white mb-2 sm:mb-3">Soporte Técnico Web</h2>
      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6 sm:mb-8 max-w-lg mx-auto">
        ¿Experimentas algún problema con el sitio web, el panel de administración o el sistema de reservas? 
        Contáctame directamente para resolverlo lo antes posible.
      </p>
      <a
        href={`https://wa.me/56945422388?text=${encodeURIComponent('Hola, necesito soporte técnico para el sitio web de New Route Chile.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-full sm:w-auto gap-2 sm:gap-3 px-4 py-3 sm:px-8 sm:py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition-all transform hover:scale-105"
      >
        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Contactar a Soporte (+56 9 4542 2388)</span>
      </a>
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-stone-200 dark:border-stone-800">
        <p className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400">Servicio disponible para reportar errores, solicitar mejoras o resolver dudas técnicas.</p>
      </div>
    </div>
  );
};