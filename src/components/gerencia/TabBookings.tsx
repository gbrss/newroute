import React from 'react';
import { CalendarPlus, Download, Search, Filter, MessageCircle, Trash2 } from 'lucide-react';
import { BookingRequest, BookingStatus } from '../../types';
import { formatCLP } from '../../lib/storage';

interface Props {
  bookings: BookingRequest[];
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  selectedBooking: BookingRequest | null;
  handleSelectBooking: (b: BookingRequest) => void;
  setSelectedBooking: (b: BookingRequest | null) => void;
  driverInput: string;
  setDriverInput: (v: string) => void;
  notesInput: string;
  setNotesInput: (v: string) => void;
  handleUpdateStatus: (id: string, status: BookingStatus) => void;
  handleSaveNotes: () => void;
  handleDeleteBooking: (id: string) => void;
  buildClientWhatsAppMessage: (b: BookingRequest) => string;
  onOpenBookingModal: () => void;
  onExport: () => void;
  getStatusBadge: (status: BookingStatus) => React.ReactNode;
}

export const TabBookings: React.FC<Props> = ({
  bookings, statusFilter, setStatusFilter, searchTerm, setSearchTerm,
  selectedBooking, handleSelectBooking, setSelectedBooking,
  driverInput, setDriverInput, notesInput, setNotesInput,
  handleUpdateStatus, handleSaveNotes, handleDeleteBooking,
  buildClientWhatsAppMessage, onOpenBookingModal, onExport, getStatusBadge
}) => {
  return (
    <div className="space-y-6">
      <div className="flex sm:hidden items-center gap-2 w-full">
        <button onClick={onOpenBookingModal} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-sm"><CalendarPlus className="w-4 h-4" /> Reservar</button>
        <button onClick={onExport} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-stone-900 dark:bg-black hover:bg-stone-800 text-white text-xs font-medium"><Download className="w-4 h-4 text-amber-400" /> Exportar</button>
      </div>

      <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-600 transition-colors" />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" /><span className="text-xs text-stone-500 dark:text-stone-400">Filtrar:</span>
          {['todos', 'pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada'].map((st) => (
            <button key={st} onClick={() => setStatusFilter(st)} className={`px-3 py-1.5 text-xs rounded-lg capitalize ${statusFilter === st ? 'bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 shadow-sm' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'}`}>{st}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`space-y-3 ${selectedBooking ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          {bookings.map((b) => (
            <div key={b.id} onClick={() => handleSelectBooking(b)} className={`p-5 rounded-2xl border text-xs cursor-pointer transition-all bg-white dark:bg-stone-900 ${selectedBooking?.id === b.id ? 'border-amber-500 shadow-md ring-1 ring-amber-500' : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 hover:shadow-sm'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><span className="font-mono font-bold text-stone-900 dark:text-white text-xs">{b.referenceCode}</span><span className="text-stone-400">·</span><span className="text-stone-500 dark:text-stone-400">{new Date(b.createdAt).toLocaleDateString('es-CL')}</span></div>
                {getStatusBadge(b.status)}
              </div>
              <div className="font-bold text-stone-900 dark:text-white text-base">{b.customerName}</div>
              <div className="text-amber-800 dark:text-amber-400 font-semibold">{b.serviceName}</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 text-stone-600 dark:text-stone-300">
                <div>📅 <strong>{b.date}</strong> ({b.time} hrs)</div>
                <div>👥 <strong>{b.passengers} pax</strong> ({b.luggageCount} maletas)</div>
                <div className="font-bold text-amber-900 dark:text-amber-400 font-display text-right sm:text-left">{formatCLP(b.totalEstimatedPrice)}</div>
              </div>
              {b.assignedDriver && (
                <div className="mt-2.5 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900/50">🚗 Conductor Asignado: {b.assignedDriver}</div>
              )}
            </div>
          ))}
        </div>

        {selectedBooking && (
          <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 text-xs space-y-4 shadow-sm sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div><div className="text-[11px] text-stone-500 dark:text-stone-400">Solicitud Seleccionada</div><div className="font-mono font-bold text-base text-stone-900 dark:text-white">{selectedBooking.referenceCode}</div></div>
              <button onClick={() => setSelectedBooking(null)} className="text-stone-400 hover:text-stone-700 dark:hover:text-white p-1 text-xs underline cursor-pointer">Cerrar</button>
            </div>
            <div className="space-y-2.5 text-stone-700 dark:text-stone-300">
              <div><span className="text-stone-500 dark:text-stone-400 block">Servicio Solicitado:</span><strong className="text-stone-900 dark:text-white text-sm">{selectedBooking.serviceName}</strong></div>
              <div className="grid grid-cols-2 gap-2"><div><span className="text-stone-500 dark:text-stone-400 block">Fecha & Hora:</span><strong className="text-stone-900 dark:text-white">{selectedBooking.date} a las {selectedBooking.time} hrs</strong></div><div><span className="text-stone-500 dark:text-stone-400 block">Pasajeros:</span><strong className="text-stone-900 dark:text-white">{selectedBooking.passengers} personas</strong></div></div>
              <div><span className="text-stone-500 dark:text-stone-400 block">Origen:</span><div className="p-2.5 bg-stone-50 dark:bg-stone-950 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-medium">{selectedBooking.pickupAddress}</div></div>
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800"><span className="text-stone-500 dark:text-stone-400 block">Pasajero:</span><div className="font-bold text-stone-900 dark:text-white">{selectedBooking.customerName}</div><div>Email: {selectedBooking.customerEmail}</div><div>Teléfono: {selectedBooking.customerPhone}</div></div>
            </div>
            <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-3">
              <div><label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">Estado Operativo:</label><div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">{(['pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada'] as BookingStatus[]).map((st) => (<button key={st} onClick={() => handleUpdateStatus(selectedBooking.id, st)} className={`py-1.5 px-2 rounded-lg text-[11px] font-medium capitalize cursor-pointer transition-colors ${selectedBooking.status === st ? 'bg-amber-600 text-white font-bold' : 'bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'}`}>{st}</button>))}</div></div>
              <div><label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">Asignar Móvil / Conductor:</label><input type="text" value={driverInput} onChange={(e) => setDriverInput(e.target.value)} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-600 transition-colors" /></div>
              <div><label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">Notas Internas de Despacho:</label><textarea rows={2} value={notesInput} onChange={(e) => setNotesInput(e.target.value)} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-600 transition-colors" /></div>
              <button onClick={handleSaveNotes} className="w-full py-2.5 rounded-lg bg-stone-900 dark:bg-amber-500 hover:bg-stone-800 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-bold text-xs cursor-pointer transition-colors">Guardar Asignación & Notas</button>
              <a href={buildClientWhatsAppMessage(selectedBooking)} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"><MessageCircle className="w-4 h-4" /> Notificar al Pasajero vía WhatsApp</a>
              <button onClick={() => handleDeleteBooking(selectedBooking.id)} className="w-full py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"><Trash2 className="w-3.5 h-3.5" /> Eliminar solicitud</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};