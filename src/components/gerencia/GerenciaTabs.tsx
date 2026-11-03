import React from 'react';
import { Calendar, MessageSquare, Tag, LifeBuoy, CalendarPlus, Download } from 'lucide-react';

interface Props {
  activeTab: 'reservas' | 'contactos' | 'tarifas' | 'soporte';
  setActiveTab: (tab: 'reservas' | 'contactos' | 'tarifas' | 'soporte') => void;
  bookingsCount: number;
  contactsCount: number;
  tariffsCount: number;
  onOpenBookingModal: () => void;
  onExport: () => void;
}

export const GerenciaTabs: React.FC<Props> = ({
  activeTab, setActiveTab, bookingsCount, contactsCount, tariffsCount, onOpenBookingModal, onExport
}) => {
  return (
    <section className="bg-stone-100 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 px-4 sm:px-8 pt-3 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        
        {/* Móvil: Selector */}
        <div className="w-full sm:hidden pb-3">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as any)}
            className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg p-2.5 text-xs font-bold text-stone-900 dark:text-white shadow-sm focus:outline-none focus:border-amber-500"
          >
            <option value="reservas">📅 Solicitudes de Reservas ({bookingsCount})</option>
            <option value="contactos">💬 Mensajes de Contacto ({contactsCount})</option>
            <option value="tarifas">🏷️ Tarifario ({tariffsCount})</option>
            <option value="soporte">🆘 Soporte Técnico</option>
          </select>
        </div>

        {/* Escritorio: Botones */}
        <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('reservas')} className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${activeTab === 'reservas' ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white border-t-2 border-amber-600 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'}`}><Calendar className="w-3.5 h-3.5" /> Reservas ({bookingsCount})</button>
          <button onClick={() => setActiveTab('contactos')} className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${activeTab === 'contactos' ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white border-t-2 border-amber-600 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'}`}><MessageSquare className="w-3.5 h-3.5" /> Contactos ({contactsCount})</button>
          <button onClick={() => setActiveTab('tarifas')} className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${activeTab === 'tarifas' ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white border-t-2 border-amber-600 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'}`}><Tag className="w-3.5 h-3.5" /> Tarifas ({tariffsCount})</button>
          <button onClick={() => setActiveTab('soporte')} className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${activeTab === 'soporte' ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white border-t-2 border-amber-600 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'}`}><LifeBuoy className="w-3.5 h-3.5" /> Soporte</button>
        </div>

        {activeTab === 'reservas' && (
          <div className="hidden sm:flex items-center gap-2 mb-2">
            <button onClick={onOpenBookingModal} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-sm"><CalendarPlus className="w-3.5 h-3.5" /> Reservar</button>
            <button onClick={onExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 dark:bg-black hover:bg-stone-800 text-white text-xs font-medium"><Download className="w-3.5 h-3.5 text-amber-400" /> Exportar</button>
          </div>
        )}
      </div>
    </section>
  );
};