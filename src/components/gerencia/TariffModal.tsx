import React from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { ServiceTariff, ServiceCategory } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingTariff: ServiceTariff | null;
  tariffForm: Partial<ServiceTariff>;
  setTariffForm: (form: Partial<ServiceTariff>) => void;
  handleSaveTariff: (e: React.FormEvent) => void;
  handlePrice1to3Change: (val: number) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export const TariffModal: React.FC<Props> = ({
  isOpen, onClose, editingTariff, tariffForm, setTariffForm,
  handleSaveTariff, handlePrice1to3Change, handleImageUpload, isUploading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl my-8 transition-colors duration-300">
        <div className="bg-stone-900 dark:bg-black px-6 py-4 flex justify-between rounded-t-2xl">
          <h3 className="text-lg font-bold text-white">{editingTariff ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSaveTariff} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 dark:text-stone-300">Nombre *</label>
              <input type="text" required value={tariffForm.name || ''} onChange={e => setTariffForm({...tariffForm, name: e.target.value})} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 dark:text-stone-300">Subtítulo</label>
              <input type="text" value={tariffForm.subtitle || ''} onChange={e => setTariffForm({...tariffForm, subtitle: e.target.value})} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 dark:text-stone-300">Categoría</label>
              <select value={tariffForm.category || 'aeropuerto'} onChange={e => setTariffForm({...tariffForm, category: e.target.value as ServiceCategory})} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors">
                <option value="aeropuerto">Aeropuerto</option>
                <option value="vinos">Vinos</option>
                <option value="ski">Ski</option>
                <option value="termas">Termas</option>
                <option value="city_tour">City Tour</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 dark:text-stone-300">Duración</label>
              <input type="text" placeholder="Ej: 7 horas" value={tariffForm.durationApprox || ''} onChange={e => setTariffForm({...tariffForm, durationApprox: e.target.value})} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 dark:text-stone-300">Descripción</label>
            <textarea rows={2} value={tariffForm.description || ''} onChange={e => setTariffForm({...tariffForm, description: e.target.value})} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 dark:text-stone-300">Precio 1-3 PAX</label>
              <input type="number" required value={tariffForm.price1to3 || ''} onChange={e => handlePrice1to3Change(parseInt(e.target.value) || 0)} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 dark:text-stone-300">Precio 4-6 PAX</label>
              <input type="number" required value={tariffForm.price4to6 || ''} onChange={e => setTariffForm({...tariffForm, price4to6: parseInt(e.target.value)})} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 dark:text-stone-300">Precio 7+ PAX (VIP)</label>
              <input type="number" placeholder="Calculado automáticamente" value={tariffForm.price7plus || ''} onChange={e => setTariffForm({...tariffForm, price7plus: parseInt(e.target.value) || undefined})} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold mb-1 dark:text-stone-300">Imagen del Servicio (ImageKit)</label>
            <div className="flex items-center gap-4">
              {tariffForm.image && (
                <div className="w-16 h-16 rounded border border-stone-300 dark:border-stone-700 overflow-hidden shrink-0"><img src={tariffForm.image} alt="Preview" className="w-full h-full object-cover" /></div>
              )}
              <label className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer text-xs font-semibold transition-colors ${isUploading ? 'bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400' : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-600'}`}>
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>{isUploading ? 'Subiendo...' : 'Subir Imagen'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="hidden" />
              </label>
            </div>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">Tamaño máximo recomendado: 5MB. Formatos: JPG, PNG.</p>
          </div>

          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">Cancelar</button>
            <button type="submit" disabled={isUploading} className="px-5 py-2.5 rounded-lg bg-amber-500 disabled:opacity-50 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};