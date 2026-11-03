import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ServiceTariff } from '../../types';
import { formatCLP } from '../../lib/storage';

// IMPORTAMOS LA IMAGEN POR DEFECTO
import defaultServiceImg from '../../assets/images/defaultService.png';

interface Props {
  tariffs: ServiceTariff[];
  handleOpenTariffModal: (tariff?: ServiceTariff) => void;
  handleDeleteTariff: (id: string) => void;
}

export const TabTariffs: React.FC<Props> = ({ tariffs, handleOpenTariffModal, handleDeleteTariff }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="text-xs text-stone-500 dark:text-stone-400">Tarifas oficiales en pesos chilenos (CLP).</div>
        <button onClick={() => handleOpenTariffModal()} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 dark:bg-amber-500 hover:bg-stone-800 dark:hover:bg-amber-400 text-white dark:text-stone-950 text-xs font-bold transition-colors shadow-sm w-full sm:w-auto justify-center"><Plus className="w-4 h-4 text-amber-400 dark:text-stone-950" /> Agregar Servicio</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tariffs.map((t) => (
          <div key={t.id} className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs flex flex-col justify-between group transition-colors duration-300">
            <div>
              {/* AQUÍ USAMOS LA IMAGEN POR DEFECTO SI NO HAY IMAGEN */}
              <img 
                src={t.image || defaultServiceImg.src} 
                alt={t.name} 
                className="w-full h-32 object-cover rounded-lg mb-3" 
              />
              <h4 className="font-bold text-sm font-display pr-2 text-stone-900 dark:text-white">{t.name}</h4>
              <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-1">{t.subtitle}</p>
              <span className="inline-block mt-2 font-mono text-[10px] bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded uppercase text-stone-600 dark:text-stone-300">{t.category}</span>
            </div>
            <div className="mt-4">
              <p className="text-stone-600 dark:text-stone-300 line-clamp-2 mb-3">{t.description}</p>
              <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-stone-100 dark:border-stone-800">
                <div className="bg-stone-50 dark:bg-stone-950 p-2 rounded border border-stone-200 dark:border-stone-700 text-center">
                  <span className="text-[9px] text-stone-500 dark:text-stone-400 block">1-3 PAX</span>
                  <strong className="text-[11px] text-stone-900 dark:text-white">{formatCLP(t.price1to3)}</strong>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded border border-amber-200 dark:border-amber-900/50 text-center">
                  <span className="text-[9px] text-amber-800 dark:text-amber-400 block">4-6 PAX</span>
                  <strong className="text-[11px] text-amber-900 dark:text-amber-300">{formatCLP(t.price4to6)}</strong>
                </div>
                <div className="bg-stone-50 dark:bg-stone-950 p-2 rounded border border-stone-200 dark:border-stone-700 text-center">
                  <span className="text-[9px] text-stone-500 dark:text-stone-400 block">7+ PAX</span>
                  <strong className="text-[11px] text-stone-900 dark:text-white">{formatCLP(t.price7plus || Math.round(t.price4to6 * 1.4))}</strong>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button onClick={() => handleOpenTariffModal(t)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg font-semibold transition-colors"><Edit className="w-3.5 h-3.5" /> Editar</button>
                <button onClick={() => handleDeleteTariff(t.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-400 rounded-lg font-semibold transition-colors"><Trash2 className="w-3.5 h-3.5" /> Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};