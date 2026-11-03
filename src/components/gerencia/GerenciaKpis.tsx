import React from 'react';
import { AlertCircle, CheckCircle, MessageSquare, DollarSign } from 'lucide-react';
import { formatCLP } from '../../lib/storage';

interface Props {
  pendingCount: number;
  confirmedCount: number;
  unreadContactsCount: number;
  totalRevenue: number;
}

export const GerenciaKpis: React.FC<Props> = ({ pendingCount, confirmedCount, unreadContactsCount, totalRevenue }) => {
  return (
    <section className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 sm:px-8 py-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50">
          <div className="p-2.5 rounded-lg bg-amber-500 text-stone-950"><AlertCircle className="w-5 h-5" /></div>
          <div><div className="text-stone-500 dark:text-stone-400 text-[11px]">Por Confirmar</div><div className="text-lg font-bold text-stone-900 dark:text-white font-display">{pendingCount} reservas</div></div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50">
          <div className="p-2.5 rounded-lg bg-emerald-600 text-white"><CheckCircle className="w-5 h-5" /></div>
          <div><div className="text-stone-500 dark:text-stone-400 text-[11px]">Confirmadas</div><div className="text-lg font-bold text-stone-900 dark:text-white font-display">{confirmedCount} reservas</div></div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50">
          <div className="p-2.5 rounded-lg bg-blue-600 text-white"><MessageSquare className="w-5 h-5" /></div>
          <div><div className="text-stone-500 dark:text-stone-400 text-[11px]">Mensajes Nuevos</div><div className="text-lg font-bold text-stone-900 dark:text-white font-display">{unreadContactsCount} contactos</div></div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
          <div className="p-2.5 rounded-lg bg-stone-900 dark:bg-black text-amber-400"><DollarSign className="w-5 h-5" /></div>
          <div><div className="text-stone-500 dark:text-stone-400 text-[11px]">Total Estimado</div><div className="text-lg font-bold text-amber-800 dark:text-amber-400 font-display">{formatCLP(totalRevenue)}</div></div>
        </div>
      </div>
    </section>
  );
};