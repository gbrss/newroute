import React, { useState, useEffect } from 'react';
import {
  Lock,
  ShieldCheck,
  LogOut,
  Calendar,
  MessageSquare,
  DollarSign,
  Download,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Trash2,
  MessageCircle,
  Tag,
  FileCode,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import { BookingRequest, ContactMessage, ServiceTariff, BookingStatus } from '../../types';
import {
  updateBookingStatus,
  deleteBooking,
  markContactRead,
  deleteContactMessage,
  formatCLP,
  exportBookingsToCSV,
} from '../../lib/storage';

interface GerenciaPageProps {
  bookings: BookingRequest[];
  contacts: ContactMessage[];
  tariffs: ServiceTariff[];
  onRefreshData: () => void;
  onNavigateHome: () => void;
}

const AUTH_STORAGE_KEY = 'newroute_gerencia_session_v1';

export const GerenciaPage: React.FC<GerenciaPageProps> = ({
  bookings,
  contacts,
  tariffs,
  onRefreshData,
  onNavigateHome,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  // Dashboard state
  const [activeTab, setActiveTab] = useState<'reservas' | 'contactos' | 'tarifas' | 'cloudflare'>('reservas');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [driverInput, setDriverInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');

  useEffect(() => {
    // Check if session is already active
    const saved = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (saved === 'active') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Valid credentials:
    // User: "gerencia" or "admin@newroute.cl" or "admin"
    // Pass: "gerencia2026" or "NewRoute2026!" or "admin123"
    const isValidUser = cleanUser === 'gerencia' || cleanUser === 'admin@newroute.cl' || cleanUser === 'admin';
    const isValidPass = cleanPass === 'gerencia2026' || cleanPass === 'NewRoute2026!' || cleanPass === 'admin123';

    if (isValidUser && isValidPass) {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'active');
      setLoginError('');
    } else {
      setLoginError('Credenciales incorrectas. Verifique su usuario y contraseña corporativa.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setUsername('');
    setPassword('');
  };

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
    alert('Asignación de móvil y notas guardadas correctamente.');
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

  // 1. LOGIN SCREEN (When not authenticated)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center p-4 selection:bg-amber-800 selection:text-white">
        <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-2xl relative">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-semibold tracking-wider text-amber-400 uppercase">
              Acceso Restringido · /gerencia
            </span>
            <h1 className="text-2xl font-bold font-display text-white mt-1">
              Portal de Gerencia & Operaciones
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              New Route Chile · Sistema Central de Solicitudes y Despacho
            </p>
          </div>

          {loginError && (
            <div className="mb-5 p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Usuario o Correo Corporativo
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="gerencia o admin@newroute.cl"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Contraseña de Acceso
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-3.5 pr-10 py-2.5 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-lg shadow-amber-500/20"
            >
              <KeyRound className="w-4 h-4 text-stone-950" />
              <span>Ingresar al Panel de Gerencia</span>
            </button>
          </form>

          {/* Access Credentials Hint for Authorized Users */}
          <div className="mt-6 pt-4 border-t border-stone-800/80 text-[11px] text-stone-500 space-y-1">
            <div className="font-semibold text-stone-400">Credenciales autorizadas de gerencia:</div>
            <div>Usuario: <code className="text-amber-400/90 font-mono">gerencia</code> o <code className="text-amber-400/90 font-mono">admin@newroute.cl</code></div>
            <div>Clave: <code className="text-amber-400/90 font-mono">gerencia2026</code> o <code className="text-amber-400/90 font-mono">NewRoute2026!</code></div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al sitio web principal</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED MANAGEMENT DASHBOARD
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans selection:bg-amber-800 selection:text-white">
      {/* Top Gerencia Bar */}
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base font-display text-white">
                  GERENCIA & OPERACIONES
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                  /gerencia
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-light">
                New Route Chile · Central de Despacho 24/7
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateHome}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ver Web Pública</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* KPI Bar */}
      <section className="bg-white border-b border-stone-200 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/70 border border-amber-100">
            <div className="p-2.5 rounded-lg bg-amber-500 text-stone-950">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-stone-500 text-[11px]">Por Confirmar</div>
              <div className="text-lg font-bold text-stone-900 font-display">{pendingCount} reservas</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
            <div className="p-2.5 rounded-lg bg-emerald-600 text-white">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-stone-500 text-[11px]">Confirmadas</div>
              <div className="text-lg font-bold text-stone-900 font-display">{confirmedCount} reservas</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/70 border border-blue-100">
            <div className="p-2.5 rounded-lg bg-blue-600 text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-stone-500 text-[11px]">Mensajes Nuevos</div>
              <div className="text-lg font-bold text-stone-900 font-display">{unreadContactsCount} contactos</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
            <div className="p-2.5 rounded-lg bg-stone-900 text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-stone-500 text-[11px]">Total Estimado</div>
              <div className="text-lg font-bold text-amber-800 font-display">{formatCLP(totalRevenue)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Bar */}
      <section className="bg-stone-100 border-b border-stone-200 px-4 sm:px-8 pt-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('reservas')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
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
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
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
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'tarifas'
                  ? 'bg-white text-stone-900 border-t-2 border-amber-600 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Tarifario ({tariffs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('cloudflare')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'cloudflare'
                  ? 'bg-white text-stone-900 border-t-2 border-amber-600 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-amber-600" />
              <span>Astro & Cloudflare</span>
            </button>
          </div>

          {activeTab === 'reservas' && (
            <button
              onClick={() => exportBookingsToCSV(bookings)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium cursor-pointer mb-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Exportar Excel / CSV</span>
            </button>
          )}
        </div>
      </section>

      {/* Main Tab Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8">
        {/* TAB 1: RESERVAS */}
        {activeTab === 'reservas' && (
          <div className="space-y-6">
            {/* Filter and Search */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="Buscar por código, cliente o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <Filter className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span className="text-xs text-stone-500 shrink-0">Filtrar:</span>
                {['todos', 'pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 text-xs rounded-lg capitalize cursor-pointer font-medium transition-colors shrink-0 ${
                      statusFilter === st
                        ? 'bg-stone-900 text-white shadow-sm'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* List & Detail Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Bookings */}
              <div className={`space-y-3 ${selectedBooking ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
                {filteredBookings.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
                    No se registran solicitudes con el criterio seleccionado.
                  </div>
                ) : (
                  filteredBookings.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => handleSelectBooking(b)}
                      className={`p-5 rounded-2xl border text-xs cursor-pointer transition-all bg-white ${
                        selectedBooking?.id === b.id
                          ? 'border-amber-500 shadow-md ring-1 ring-amber-500'
                          : 'border-stone-200 hover:border-stone-300 hover:shadow-sm'
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

                      <div className="font-bold text-stone-900 text-base">{b.customerName}</div>
                      <div className="text-amber-800 font-semibold">{b.serviceName}</div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-100 text-stone-600">
                        <div>
                          📅 <strong>{b.date}</strong> ({b.time} hrs)
                        </div>
                        <div>
                          👥 <strong>{b.passengers} pax</strong> ({b.luggageCount} maletas)
                        </div>
                        <div className="font-bold text-amber-900 font-display text-right sm:text-left">
                          {formatCLP(b.totalEstimatedPrice)}
                        </div>
                      </div>

                      {b.assignedDriver && (
                        <div className="mt-2.5 text-[11px] text-emerald-800 font-medium bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                          🚗 Conductor Asignado: {b.assignedDriver}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Right Column: Detail Card */}
              {selectedBooking && (
                <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 text-xs space-y-4 shadow-sm sticky top-24">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <div>
                      <div className="text-[11px] text-stone-500">Solicitud Seleccionada</div>
                      <div className="font-mono font-bold text-base text-stone-900">
                        {selectedBooking.referenceCode}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="text-stone-400 hover:text-stone-700 p-1 text-xs underline cursor-pointer"
                    >
                      Cerrar
                    </button>
                  </div>

                  <div className="space-y-2.5 text-stone-700">
                    <div>
                      <span className="text-stone-500 block">Servicio Solicitado:</span>
                      <strong className="text-stone-900 text-sm">{selectedBooking.serviceName}</strong>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-stone-500 block">Fecha & Hora:</span>
                        <strong>{selectedBooking.date} a las {selectedBooking.time} hrs</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 block">Pasajeros:</span>
                        <strong>{selectedBooking.passengers} personas</strong>
                      </div>
                    </div>

                    <div>
                      <span className="text-stone-500 block">Origen:</span>
                      <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-stone-800 font-medium">
                        {selectedBooking.pickupAddress}
                      </div>
                    </div>

                    {selectedBooking.dropoffAddress && (
                      <div>
                        <span className="text-stone-500 block">Destino:</span>
                        <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-stone-800 font-medium">
                          {selectedBooking.dropoffAddress}
                        </div>
                      </div>
                    )}

                    {selectedBooking.flightNumber && (
                      <div>
                        <span className="text-stone-500 block">N° de Vuelo:</span>
                        <div className="font-mono font-bold text-stone-900">{selectedBooking.flightNumber}</div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-200">
                      <span className="text-stone-500 block">Pasajero:</span>
                      <div className="font-bold text-stone-900">{selectedBooking.customerName}</div>
                      <div>Email: {selectedBooking.customerEmail}</div>
                      <div>Teléfono: {selectedBooking.customerPhone}</div>
                    </div>
                  </div>

                  {/* Operational Management */}
                  <div className="pt-3 border-t border-stone-200 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Estado Operativo:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {(['pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada'] as BookingStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleUpdateStatus(selectedBooking.id, st)}
                            className={`py-1.5 px-2 rounded-lg text-[11px] font-medium capitalize cursor-pointer transition-colors ${
                              selectedBooking.status === st
                                ? 'bg-amber-600 text-white font-bold'
                                : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Asignar Móvil / Conductor:
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Carlos Muñoz (Móvil 04 - Sprinter VIP)"
                        value={driverInput}
                        onChange={(e) => setDriverInput(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Notas Internas de Despacho:
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Observaciones de vuelo, equipaje de nieve, facturación..."
                        value={notesInput}
                        onChange={(e) => setNotesInput(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
                      />
                    </div>

                    <button
                      onClick={handleSaveNotes}
                      className="w-full py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer transition-colors"
                    >
                      Guardar Asignación & Notas
                    </button>

                    <a
                      href={buildClientWhatsAppMessage(selectedBooking)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Notificar al Pasajero vía WhatsApp</span>
                    </a>

                    <button
                      onClick={() => handleDelete(selectedBooking.id)}
                      className="w-full py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar solicitud</span>
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
              Mensajes recibidos a través del formulario público.
            </div>

            {contacts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
                No hay mensajes en la bandeja de entrada.
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map((c) => (
                  <div
                    key={c.id}
                    className={`p-5 rounded-2xl border text-xs transition-colors bg-white ${
                      c.read ? 'border-stone-200' : 'border-amber-400 bg-amber-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <strong className="text-stone-900 text-sm font-display">{c.name}</strong>
                        <span className="text-stone-400">·</span>
                        <span className="text-stone-500">
                          {new Date(c.createdAt).toLocaleString('es-CL')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleContactRead(c.id, c.read)}
                          className="text-stone-500 hover:text-stone-900 text-[11px] underline cursor-pointer"
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

                    <div className="text-stone-800 font-bold mb-1.5">
                      Asunto: {c.subject}
                    </div>

                    <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-stone-800 leading-relaxed">
                      {c.message}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-stone-100 text-stone-600">
                      <span>📧 {c.email}</span>
                      {c.phone && <span>📞 {c.phone}</span>}
                      {c.phone && (
                        <a
                          href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${c.name}, le respondemos desde New Route Chile respecto a su consulta.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
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

        {/* TAB 3: TARIFARIO */}
        {activeTab === 'tarifas' && (
          <div className="space-y-4">
            <div className="text-xs text-stone-500 mb-2">
              Tarifas oficiales fijadas en pesos chilenos (CLP) para el servicio hotelero y turístico.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tariffs.map((t) => (
                <div key={t.id} className="p-5 rounded-2xl border border-stone-200 bg-white text-xs space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm font-display">{t.name}</h4>
                      <p className="text-stone-500 text-[11px]">{t.subtitle}</p>
                    </div>
                    <span className="font-mono text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-600 font-semibold">
                      {t.category}
                    </span>
                  </div>

                  <p className="text-stone-600 text-xs leading-relaxed">{t.description}</p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 font-display">
                    <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                      <span className="text-[10px] text-stone-500 block">1 a 3 PAX</span>
                      <strong className="text-stone-900 text-sm">{formatCLP(t.price1to3)}</strong>
                    </div>
                    <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                      <span className="text-[10px] text-amber-800 block">4 a 6 PAX</span>
                      <strong className="text-amber-900 text-sm">{formatCLP(t.price4to6)}</strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-stone-500">
                    ⏱ Duración Aproximada: <strong>{t.durationApprox}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ASTRO & CLOUDFLARE */}
        {activeTab === 'cloudflare' && (
          <div className="space-y-6 text-xs text-stone-800">
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
              <h4 className="font-bold text-sm text-stone-900 font-display flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-700" />
                <span>Configuración de Despliegue en Cloudflare Pages</span>
              </h4>
              <p className="text-stone-700 mt-1 leading-relaxed">
                El proyecto cuenta con el adaptador oficial <code>@astrojs/cloudflare</code> configurado para ejecutar el sitio y la gestión de reservas en el Edge global de Cloudflare.
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-stone-900 text-xs">
                Comandos de compilación y despliegue rápido:
              </div>
              <pre className="p-4 bg-stone-900 text-stone-200 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
{`# 1. Compilación de producción
npm run build

# 2. Despliegue directo en Cloudflare Pages
npx wrangler pages deploy dist --project-name newroute-cl`}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
