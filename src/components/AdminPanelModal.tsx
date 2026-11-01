import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Calendar,
  MessageSquare,
  DollarSign,
  Download,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Phone,
  MessageCircle,
  FileCode,
  Tag,
  RefreshCw,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { BookingRequest, ContactMessage, ServiceTariff, BookingStatus } from '../types';
import {
  updateBookingStatus,
  deleteBooking,
  markContactRead,
  deleteContactMessage,
  formatCLP,
  exportBookingsToCSV,
} from '../lib/storage';
import { COMPANY_INFO } from '../data/newrouteData';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingRequest[];
  contacts: ContactMessage[];
  tariffs: ServiceTariff[];
  onRefreshData: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  bookings,
  contacts,
  tariffs,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'reservas' | 'contactos' | 'tarifas' | 'cloudflare'>('reservas');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [driverInput, setDriverInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');

  if (!isOpen) return null;

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'todos' || b.status === statusFilter;
    const matchesSearch =
      b.referenceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const pendingCount = bookings.filter((b) => b.status === 'pendiente').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmada').length;
  const unreadContactsCount = contacts.filter((c) => !c.read).length;
  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelada')
    .reduce((sum, b) => sum + b.totalEstimatedPrice, 0);

  const handleSelectBooking = (b: BookingRequest) => {
    setSelectedBooking(b);
    setDriverInput(b.assignedDriver || '');
    setNotesInput(b.adminNotes || '');
  };

  const handleUpdateStatus = (id: string, newStatus: BookingStatus) => {
    updateBookingStatus(id, newStatus, notesInput, driverInput);
    onRefreshData();
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({
        ...selectedBooking,
        status: newStatus,
        assignedDriver: driverInput,
        adminNotes: notesInput,
      });
    }
  };

  const handleSaveNotes = () => {
    if (!selectedBooking) return;
    updateBookingStatus(selectedBooking.id, selectedBooking.status, notesInput, driverInput);
    onRefreshData();
    alert('Detalles y asignación guardados correctamente.');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar esta reserva del registro?')) {
      deleteBooking(id);
      setSelectedBooking(null);
      onRefreshData();
    }
  };

  const handleDeleteContact = (id: string) => {
    if (window.confirm('¿Eliminar este mensaje de contacto?')) {
      deleteContactMessage(id);
      onRefreshData();
    }
  };

  const handleToggleContactRead = (id: string, currentRead: boolean) => {
    markContactRead(id, !currentRead);
    onRefreshData();
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pendiente':
        return <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-xs font-semibold border border-amber-200">Pendiente</span>;
      case 'confirmada':
        return <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-semibold border border-emerald-200">Confirmada</span>;
      case 'en_curso':
        return <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs font-semibold border border-blue-200">En Curso</span>;
      case 'completada':
        return <span className="inline-flex items-center gap-1 text-stone-700 bg-stone-100 px-2 py-0.5 rounded text-xs font-semibold border border-stone-200">Completada</span>;
      case 'cancelada':
        return <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-xs font-semibold border border-rose-200">Cancelada</span>;
      default:
        return null;
    }
  };

  const buildClientWhatsAppMessage = (b: BookingRequest) => {
    const text =
      `Hola ${b.customerName}, le saludamos de New Route Chile respecto a su reserva ${b.referenceCode} ` +
      `para el día ${b.date} a las ${b.time} hrs (${b.serviceName}). ` +
      `${b.assignedDriver ? `Su móvil y conductor asignado es: ${b.assignedDriver}. ` : ''}` +
      `¿Tiene alguna duda o requerimiento adicional para su traslado?`;
    return `https://wa.me/${b.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-stone-50 rounded-2xl shadow-2xl border border-stone-300 overflow-hidden my-4 max-h-[92vh] flex flex-col text-stone-900">
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-display text-white">
                  Panel de Administración New Route
                </h3>
                <span className="text-[10px] bg-stone-800 text-amber-400 font-mono px-2 py-0.5 rounded">
                  v2.4 Live
                </span>
              </div>
              <p className="text-xs text-stone-400 font-light">
                Gestión integral de solicitudes, clientes y parámetros de la plataforma
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Cerrar panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick KPI Bar */}
        <div className="bg-white border-b border-stone-200 px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4 shrink-0 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-stone-500 text-[11px]">Por Confirmar</div>
              <div className="text-base font-bold text-stone-900 font-display">{pendingCount} reservas</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-stone-500 text-[11px]">Confirmadas</div>
              <div className="text-base font-bold text-stone-900 font-display">{confirmedCount} reservas</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-stone-500 text-[11px]">Mensajes Nuevos</div>
              <div className="text-base font-bold text-stone-900 font-display">{unreadContactsCount} contactos</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-stone-100 text-stone-700">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <div className="text-stone-500 text-[11px]">Volumen en Cartera</div>
              <div className="text-base font-bold text-amber-800 font-display">{formatCLP(totalRevenue)}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-stone-100 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('reservas')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'reservas'
                  ? 'bg-white text-stone-900 border-t-2 border-amber-600 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Solicitudes de Reservas ({bookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('contactos')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'contactos'
                  ? 'bg-white text-stone-900 border-t-2 border-amber-600 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Mensajes de Contacto ({contacts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tarifas')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'tarifas'
                  ? 'bg-white text-stone-900 border-t-2 border-amber-600 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Tarifario de Servicios ({tariffs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('cloudflare')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'cloudflare'
                  ? 'bg-white text-stone-900 border-t-2 border-amber-600 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-amber-600" />
              <span>Astro JS & Cloudflare</span>
            </button>
          </div>

          {activeTab === 'reservas' && (
            <button
              onClick={() => exportBookingsToCSV(bookings)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium cursor-pointer mb-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Exportar Excel / CSV</span>
            </button>
          )}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {/* TAB 1: RESERVAS */}
          {activeTab === 'reservas' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Buscar por cliente, teléfono o código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                  <Filter className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span className="text-xs text-stone-500 shrink-0">Estado:</span>
                  {['todos', 'pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 text-xs rounded-md capitalize cursor-pointer font-medium transition-colors shrink-0 ${
                        statusFilter === st
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings Table / List */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Bookings List */}
                <div className={`space-y-2.5 ${selectedBooking ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
                  {filteredBookings.length === 0 ? (
                    <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200 text-stone-500 text-xs">
                      No se encontraron reservas con el filtro seleccionado.
                    </div>
                  ) : (
                    filteredBookings.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => handleSelectBooking(b)}
                        className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                          selectedBooking?.id === b.id
                            ? 'border-amber-500 bg-amber-50/40 shadow-sm'
                            : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-stone-900 text-xs">
                              {b.referenceCode}
                            </span>
                            <span className="text-stone-400">·</span>
                            <span className="text-stone-500">
                              {new Date(b.createdAt).toLocaleDateString('es-CL')}
                            </span>
                          </div>
                          {getStatusBadge(b.status)}
                        </div>

                        <div className="font-bold text-stone-900 text-sm">{b.customerName}</div>
                        <div className="text-stone-600 font-medium">{b.serviceName}</div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-stone-100 text-stone-500">
                          <div>
                            📅 <strong>{b.date}</strong> ({b.time} hrs)
                          </div>
                          <div>
                            👥 <strong>{b.passengers} pax</strong> ({b.luggageCount} maletas)
                          </div>
                          <div className="font-bold text-amber-800 text-right sm:text-left font-display">
                            {formatCLP(b.totalEstimatedPrice)}
                          </div>
                        </div>

                        {b.assignedDriver && (
                          <div className="mt-2 text-[11px] text-emerald-800 font-medium">
                            🚗 Conductor: {b.assignedDriver}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Right: Detail & Actions Panel */}
                {selectedBooking && (
                  <div className="lg:col-span-5 bg-stone-50 rounded-2xl border border-stone-200 p-5 text-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                      <div>
                        <div className="text-[11px] text-stone-500">Detalles de la Reserva</div>
                        <div className="font-mono font-bold text-sm text-stone-900">
                          {selectedBooking.referenceCode}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedBooking(null)}
                        className="text-stone-400 hover:text-stone-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 text-stone-700">
                      <div>
                        <span className="text-stone-500 block">Servicio Solicitado:</span>
                        <strong className="text-stone-900">{selectedBooking.serviceName}</strong>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-stone-500 block">Fecha & Hora:</span>
                          <strong>{selectedBooking.date} / {selectedBooking.time} hrs</strong>
                        </div>
                        <div>
                          <span className="text-stone-500 block">Pasajeros:</span>
                          <strong>{selectedBooking.passengers} ({selectedBooking.luggageCount} maletas)</strong>
                        </div>
                      </div>

                      <div>
                        <span className="text-stone-500 block">Origen / Recogida:</span>
                        <div className="p-2 bg-white rounded border border-stone-200 text-stone-800">
                          {selectedBooking.pickupAddress}
                        </div>
                      </div>

                      {selectedBooking.dropoffAddress && (
                        <div>
                          <span className="text-stone-500 block">Destino:</span>
                          <div className="p-2 bg-white rounded border border-stone-200 text-stone-800">
                            {selectedBooking.dropoffAddress}
                          </div>
                        </div>
                      )}

                      {selectedBooking.flightNumber && (
                        <div>
                          <span className="text-stone-500 block">Vuelo:</span>
                          <strong>{selectedBooking.flightNumber}</strong>
                        </div>
                      )}

                      <div className="pt-2 border-t border-stone-200">
                        <span className="text-stone-500 block">Contacto Pasajero:</span>
                        <div className="font-semibold text-stone-900">{selectedBooking.customerName}</div>
                        <div>Email: {selectedBooking.customerEmail}</div>
                        <div>Tel: {selectedBooking.customerPhone}</div>
                      </div>

                      {/* Special tags */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {selectedBooking.needsBilingualDriver && (
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200">
                            Chofer Bilingüe
                          </span>
                        )}
                        {selectedBooking.needsBabySeat && (
                          <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-medium border border-purple-200">
                            Silla de Bebé
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Operational Management */}
                    <div className="pt-3 border-t border-stone-200 space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          Cambiar Estado de la Reserva:
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {(['pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada'] as BookingStatus[]).map((st) => (
                            <button
                              key={st}
                              onClick={() => handleUpdateStatus(selectedBooking.id, st)}
                              className={`py-1.5 px-2 rounded text-[11px] font-medium capitalize cursor-pointer transition-colors ${
                                selectedBooking.status === st
                                  ? 'bg-amber-600 text-white font-bold'
                                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          Asignar Conductor & Móvil:
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Carlos Muñoz (Móvil 04 - Sprinter VIP)"
                          value={driverInput}
                          onChange={(e) => setDriverInput(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded p-1.5 text-xs text-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          Notas Internas de Operación:
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Notas de vuelo, confirmación de restaurante, etc."
                          value={notesInput}
                          onChange={(e) => setNotesInput(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded p-1.5 text-xs text-stone-900"
                        />
                      </div>

                      <button
                        onClick={handleSaveNotes}
                        className="w-full py-2 rounded bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer"
                      >
                        Guardar Conductor y Notas
                      </button>

                      {/* Direct WhatsApp to passenger */}
                      <a
                        href={buildClientWhatsAppMessage(selectedBooking)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Notificar al Pasajero vía WhatsApp</span>
                      </a>

                      <button
                        onClick={() => handleDelete(selectedBooking.id)}
                        className="w-full py-2 text-rose-600 hover:bg-rose-50 rounded text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar esta reserva</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MENSAJES DE CONTACTO */}
          {activeTab === 'contactos' && (
            <div className="space-y-4">
              <div className="text-xs text-stone-500 mb-2">
                Consultas enviadas a través del formulario de la landing page.
              </div>

              {contacts.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200 text-stone-500 text-xs">
                  No hay mensajes registrados.
                </div>
              ) : (
                <div className="space-y-3">
                  {contacts.map((c) => (
                    <div
                      key={c.id}
                      className={`p-4 rounded-xl border text-xs transition-colors ${
                        c.read ? 'bg-white border-stone-200' : 'bg-amber-50/50 border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <strong className="text-stone-900 text-sm">{c.name}</strong>
                          <span className="text-stone-400">·</span>
                          <span className="text-stone-500">
                            {new Date(c.createdAt).toLocaleString('es-CL')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleContactRead(c.id, c.read)}
                            className="text-stone-500 hover:text-stone-800 text-[11px] underline cursor-pointer"
                          >
                            {c.read ? 'Marcar como no leído' : 'Marcar como leído'}
                          </button>
                          <button
                            onClick={() => handleDeleteContact(c.id)}
                            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-stone-700 font-semibold mb-1">
                        Asunto: {c.subject}
                      </div>

                      <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-800 leading-relaxed">
                        {c.message}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-3 pt-2 border-t border-stone-100 text-stone-600">
                        <span>📧 {c.email}</span>
                        {c.phone && <span>📞 {c.phone}</span>}
                        {c.phone && (
                          <a
                            href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${c.name}, le respondemos de New Route Chile sobre su consulta.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Responder por WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TARIFARIO DE SERVICIOS */}
          {activeTab === 'tarifas' && (
            <div className="space-y-4">
              <div className="text-xs text-stone-500 mb-2">
                Listado oficial de servicios y tarifas extraídas del sitio oficial de New Route.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tariffs.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl border border-stone-200 bg-white text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">{t.name}</h4>
                        <p className="text-stone-500 text-[11px]">{t.subtitle}</p>
                      </div>
                      <span className="font-mono text-[10px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
                        {t.category}
                      </span>
                    </div>

                    <p className="text-stone-600 text-xs line-clamp-2">{t.description}</p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 font-display">
                      <div className="bg-stone-50 p-2 rounded">
                        <span className="text-[10px] text-stone-500 block">1 a 3 PAX</span>
                        <strong className="text-stone-900 text-sm">{formatCLP(t.price1to3)}</strong>
                      </div>
                      <div className="bg-amber-50 p-2 rounded">
                        <span className="text-[10px] text-amber-800 block">4 a 6 PAX</span>
                        <strong className="text-amber-900 text-sm">{formatCLP(t.price4to6)}</strong>
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-500">
                      ⏱ Duración: {t.durationApprox}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ASTRO JS & CLOUDFLARE PAGES MIGRATION GUIDE */}
          {activeTab === 'cloudflare' && (
            <div className="space-y-6 text-xs text-stone-800">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <h4 className="font-bold text-sm text-stone-900 font-display flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-amber-700" />
                  <span>Arquitectura Astro JS & Despliegue en Cloudflare Pages</span>
                </h4>
                <p className="text-stone-700 mt-1 leading-relaxed">
                  Para máxima velocidad de carga (Core Web Vitals & 100% PageSpeed), esta aplicación está estructurada con el patrón de <em>Islas Interactivas</em> de Astro. A continuación tienes la configuración exacta y archivos listos para compilar en <strong>Cloudflare Pages</strong> con 0 latencia global y SSL automático.
                </p>
              </div>

              {/* Step 1: astro.config.mjs */}
              <div className="space-y-2">
                <div className="font-bold text-stone-900 text-xs flex items-center justify-between">
                  <span>1. Archivo de Configuración: <code>astro.config.mjs</code></span>
                  <span className="text-stone-500 text-[10px]">Cloudflare Adapter (SSR/Edge)</span>
                </div>
                <pre className="p-3.5 bg-stone-900 text-stone-200 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
{`import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server', // o 'hybrid' para SSG ultrarrápido con SSR para reservas
  adapter: cloudflare({
    imageService: 'cloudflare',
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [
    react(),
    tailwind()
  ],
  site: 'https://newroute.cl',
});`}
                </pre>
              </div>

              {/* Step 2: Cloudflare Wrangler config */}
              <div className="space-y-2">
                <div className="font-bold text-stone-900 text-xs">
                  2. Archivo <code>wrangler.toml</code> para Cloudflare
                </div>
                <pre className="p-3.5 bg-stone-900 text-stone-200 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
{`name = "newroute-landing"
compatibility_date = "2026-10-31"
compatibility_flags = ["nodejs_compat"]

[site]
bucket = "./dist"

[env.production.vars]
COMPANY_PHONE = "+56 2 2394 2153"
WHATSAPP_NUMBER = "56984128890"`}
                </pre>
              </div>

              {/* Step 3: Deployment instructions */}
              <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 space-y-2">
                <div className="font-bold text-stone-900">
                  Pasos de Despliegue en Cloudflare Dashboard (3 Minutos):
                </div>
                <ol className="list-decimal list-inside space-y-1 text-stone-600 leading-relaxed">
                  <li>Inicia sesión en tu cuenta de <strong>Cloudflare</strong> y ve a <em>Workers & Pages &gt; Create application &gt; Pages</em>.</li>
                  <li>Conecta tu repositorio de GitHub / GitLab donde alojas el código de New Route.</li>
                  <li>Selecciona el Preset de Compilación: <strong>Astro</strong>.</li>
                  <li>Comando de build: <code>npm run build</code> | Carpeta de salida: <code>dist</code>.</li>
                  <li>Haz clic en <strong>Save and Deploy</strong>. Cloudflare Pages generará tu URL con CDN global y certificado HTTPS gratuito de inmediato.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-100 border-t border-stone-200 px-6 py-3 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <div className="flex items-center gap-2">
            <span>New Route Chile © 2006–2026</span>
            <span>·</span>
            <span>Ahumada 236, Of. 510</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
};
