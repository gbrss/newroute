import React, { useState, useEffect } from 'react';
import {
  Lock, ShieldCheck, LogOut, Calendar, MessageSquare, DollarSign,
  Download, Search, Filter, CheckCircle, AlertCircle, Trash2,
  MessageCircle, Tag, FileCode, ArrowLeft, KeyRound, Eye,
  EyeOff, CalendarPlus, Plus, Edit, Upload, X, Loader2, Sun, Moon,
  LifeBuoy // <-- NUEVO ICONO DE SOPORTE
} from 'lucide-react';
import ImageKit from 'imagekit-javascript';
import { BookingRequest, ContactMessage, ServiceTariff, BookingStatus, ServiceCategory } from '../../types';
import {
  updateBookingStatus, deleteBooking, markContactRead, deleteContactMessage,
  formatCLP, exportBookingsToCSV, getStoredTariffs, saveTariff, deleteTariff
} from '../../lib/storage';

import logoImg from '../../assets/images/logo.png';

interface GerenciaPageProps {
  bookings: BookingRequest[];
  contacts: ContactMessage[];
  tariffs: ServiceTariff[];
}

const AUTH_STORAGE_KEY = 'newroute_gerencia_session_v1';
const BOOKINGS_STORAGE_KEY = 'newroute_bookings_v1';
const CONTACTS_STORAGE_KEY = 'newroute_contacts_v1';

export const GerenciaPage: React.FC<GerenciaPageProps> = ({
  bookings: initialBookings,
  contacts: initialContacts,
  tariffs: initialTariffs,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const [bookings, setBookings] = useState<BookingRequest[]>(initialBookings);
  const [contacts, setContacts] = useState<ContactMessage[]>(initialContacts);
  const [tariffs, setTariffs] = useState<ServiceTariff[]>(initialTariffs);

  // CAMBIAMOS 'cloudflare' POR 'soporte'
  const [activeTab, setActiveTab] = useState<'reservas' | 'contactos' | 'tarifas' | 'soporte'>('reservas');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [driverInput, setDriverInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');

  const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);
  const [editingTariff, setEditingTariff] = useState<ServiceTariff | null>(null);
  const [tariffForm, setTariffForm] = useState<Partial<ServiceTariff>>({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = isAuthenticated ? 'Panel de Gerencia | New Route Chile' : 'Acceso Restringido | New Route Chile';
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const saved = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (saved === 'active') setIsAuthenticated(true);

    try {
      const storedBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      const storedContacts = localStorage.getItem(CONTACTS_STORAGE_KEY);
      if (storedBookings) setBookings(JSON.parse(storedBookings));
      if (storedContacts) setContacts(JSON.parse(storedContacts));
      setTariffs(getStoredTariffs());
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === BOOKINGS_STORAGE_KEY || e.key === CONTACTS_STORAGE_KEY) refreshData();
      if (e.key === 'newroute_tariffs_v1') setTariffs(getStoredTariffs());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleBookingCreated = () => {
      refreshData();
      try {
        const stored = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY) || '[]');
        if (stored.length > 0) {
          const latest = stored[0];
          setSelectedBooking(latest);
          setDriverInput(latest.assignedDriver || '');
          setNotesInput(latest.adminNotes || '');
          setActiveTab('reservas');
        }
      } catch (e) { console.error(e); }
    };
    window.addEventListener('booking-created', handleBookingCreated);
    return () => window.removeEventListener('booking-created', handleBookingCreated);
  }, []);

  const refreshData = () => {
    try {
      const storedBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      const storedContacts = localStorage.getItem(CONTACTS_STORAGE_KEY);
      if (storedBookings) setBookings(JSON.parse(storedBookings));
      if (storedContacts) setContacts(JSON.parse(storedContacts));
    } catch (e) { console.error(e); }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();
    const isValidUser = ['gerencia', 'admin@newroute.cl', 'admin'].includes(cleanUser);
    const isValidPass = ['gerencia2026', 'NewRoute2026!', 'admin123'].includes(cleanPass);

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

  const handleOpenTariffModal = (tariff?: ServiceTariff) => {
    if (tariff) {
      setEditingTariff(tariff);
      const calculated7Plus = tariff.price7plus || Math.round(tariff.price4to6 * 1.4);
      setTariffForm({ ...tariff, price7plus: calculated7Plus });
    } else {
      setEditingTariff(null);
      setTariffForm({ 
        id: `service-${Date.now()}`, 
        category: 'aeropuerto', 
        featured: false, 
        highlights: [], 
        price1to3: 0, 
        price4to6: 0,
        price7plus: 0
      });
    }
    setIsTariffModalOpen(true);
  };

  const handlePrice1to3Change = (val: number) => {
    const calculated4to6 = Math.round(val * 1.45);
    const calculated7plus = Math.round(calculated4to6 * 1.4);
    setTariffForm({ 
      ...tariffForm, 
      price1to3: val, 
      price4to6: calculated4to6, 
      price7plus: calculated7plus 
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen es demasiado grande. Máximo 5MB.");
      return;
    }

    setIsUploading(true);
    try {
      const authRes = await fetch('/api/imagekit-auth');
      if (!authRes.ok) throw new Error('Error obteniendo autenticación');
      const auth = await authRes.json();

      const imagekit = new ImageKit({
        publicKey: auth.publicKey,
        urlEndpoint: 'https://ik.imagekit.io/zldxbrsss',
      });

      const response = await imagekit.upload({
        file: file,
        fileName: `servicio-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`,
        token: auth.token,
        signature: auth.signature,
        expire: auth.expire,
        folder: '/servicios'
      });

      setTariffForm(prev => ({ ...prev, image: response.url }));
      alert("Imagen subida correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al subir la imagen. Revisa la consola.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveTariff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tariffForm.name || !tariffForm.id) return;

    const highlightsArray = typeof tariffForm.highlights === 'string'
      ? (tariffForm.highlights as string).split(',').map(s => s.trim())
      : tariffForm.highlights || [];

    const finalTariff = { ...tariffForm, highlights: highlightsArray } as ServiceTariff;
    const updated = saveTariff(finalTariff, !!editingTariff);
    if (updated) {
      setTariffs(updated);
      window.dispatchEvent(new Event('tariffs-updated'));
    }
    
    setIsTariffModalOpen(false);
    setEditingTariff(null);
  };

  const handleDeleteTariff = (id: string) => {
    if (window.confirm('¿Eliminar este servicio?')) {
      const updated = deleteTariff(id);
      if (updated) {
        setTariffs(updated);
        window.dispatchEvent(new Event('tariffs-updated'));
      }
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'todos' || b.status === statusFilter;
    const matchesSearch = b.referenceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = bookings.filter((b) => b.status === 'pendiente').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmada').length;
  const unreadContactsCount = contacts.filter((c) => !c.read).length;
  const totalRevenue = bookings.filter((b) => b.status !== 'cancelada').reduce((sum, b) => sum + b.totalEstimatedPrice, 0);

  const handleSelectBooking = (b: BookingRequest) => {
    setSelectedBooking(b); setDriverInput(b.assignedDriver || ''); setNotesInput(b.adminNotes || '');
  };

  const handleUpdateStatus = (id: string, newStatus: BookingStatus) => {
    updateBookingStatus(id, newStatus, notesInput, driverInput); refreshData();
    if (selectedBooking?.id === id) setSelectedBooking({ ...selectedBooking, status: newStatus, assignedDriver: driverInput, adminNotes: notesInput });
  };

  const handleSaveNotes = () => {
    if (!selectedBooking) return;
    updateBookingStatus(selectedBooking.id, selectedBooking.status, notesInput, driverInput);
    alert('Asignación guardada.'); refreshData();
    setSelectedBooking({ ...selectedBooking, assignedDriver: driverInput, adminNotes: notesInput });
  };

  const handleDeleteBooking = (id: string) => {
    if (window.confirm('¿Eliminar reserva?')) { deleteBooking(id); setSelectedBooking(null); refreshData(); }
  };

  const handleDeleteContact = (id: string) => {
    if (window.confirm('¿Eliminar mensaje?')) { deleteContactMessage(id); refreshData(); }
  };

  const handleToggleContactRead = (id: string, currentRead: boolean) => {
    markContactRead(id, !currentRead); refreshData();
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pendiente': return <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-xs font-semibold border border-amber-200">Pendiente</span>;
      case 'confirmada': return <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-semibold border border-emerald-200">Confirmada</span>;
      case 'en_curso': return <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs font-semibold border border-blue-200">En Curso</span>;
      case 'completada': return <span className="inline-flex items-center gap-1 text-stone-700 bg-stone-100 px-2 py-0.5 rounded text-xs font-semibold border border-stone-200">Completada</span>;
      case 'cancelada': return <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-xs font-semibold border border-rose-200">Cancelada</span>;
      default: return null;
    }
  };

  const buildClientWhatsAppMessage = (b: BookingRequest) => {
    const text = `Hola ${b.customerName}, le saludamos de New Route Chile respecto a su reserva ${b.referenceCode}...`;
    return `https://wa.me/${b.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center p-4 selection:bg-amber-800 selection:text-white">
        <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-2xl relative">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-semibold tracking-wider text-amber-400 uppercase">Acceso Restringido</span>
            <h1 className="text-2xl font-bold font-display text-white mt-1">Portal de Gerencia</h1>
          </div>
          {loginError && (
            <div className="mb-5 p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" /><span>{loginError}</span>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">Usuario</label>
              <input type="text" required autoFocus placeholder="gerencia" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">Contraseña</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-3.5 pr-10 py-2.5 text-xs text-white focus:border-amber-500" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-300">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase flex items-center justify-center gap-2 mt-2">
              <KeyRound className="w-4 h-4" /><span>Ingresar</span>
            </button>
          </form>
          <div className="mt-6 text-center">
            <a href="/" className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white"><ArrowLeft className="w-3.5 h-3.5" /> Volver a la web</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col font-sans selection:bg-amber-800 selection:text-white transition-colors duration-300">
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <img src={logoImg.src} alt="New Route Logo" className="h-18 w-auto object-contain" />
            <div>
              <span className="font-bold text-base font-display text-white">GERENCIA & OPERACIONES</span>
              <p className="text-[11px] text-stone-400 font-light">New Route Chile · Central de Despacho 24/7</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors" title="Cambiar tema">
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a href="/" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Ver Web
            </a>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Salir
            </button>
          </div>
        </div>
      </header>

      {/* KPIs - Estilo exacto */}
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

      {/* Tabs */}
      <section className="bg-stone-100 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 px-4 sm:px-8 pt-3 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button onClick={() => setActiveTab('reservas')} className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${activeTab === 'reservas' ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white border-t-2 border-amber-600 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'}`}><Calendar className="w-3.5 h-3.5" /> Solicitudes de Reservas ({bookings.length})</button>
            <button onClick={() => setActiveTab('contactos')} className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${activeTab === 'contactos' ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white border-t-2 border-amber-600 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'}`}><MessageSquare className="w-3.5 h-3.5" /> Mensajes de Contacto ({contacts.length})</button>
            <button onClick={() => setActiveTab('tarifas')} className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${activeTab === 'tarifas' ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white border-t-2 border-amber-600 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'}`}><Tag className="w-3.5 h-3.5" /> Tarifario ({tariffs.length})</button>
            {/* CAMBIAMOS EL NOMBRE Y EL ICONO DE LA PESTAÑA */}
            <button onClick={() => setActiveTab('soporte')} className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${activeTab === 'soporte' ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white border-t-2 border-amber-600 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'}`}><LifeBuoy className="w-3.5 h-3.5" /> Soporte Técnico</button>
          </div>
          {activeTab === 'reservas' && (
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => window.dispatchEvent(new CustomEvent('open-booking-modal'))} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-sm"><CalendarPlus className="w-3.5 h-3.5" /> Reservar</button>
              <button onClick={() => exportBookingsToCSV(bookings)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 dark:bg-black hover:bg-stone-800 text-white text-xs font-medium"><Download className="w-3.5 h-3.5 text-amber-400" /> Exportar</button>
            </div>
          )}
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8">
        {activeTab === 'reservas' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-600 transition-colors" />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <Filter className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" /><span className="text-xs text-stone-500 dark:text-stone-400">Filtrar:</span>
                {['todos', 'pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada'].map((st) => (
                  <button key={st} onClick={() => setStatusFilter(st)} className={`px-3 py-1.5 text-xs rounded-lg capitalize ${statusFilter === st ? 'bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 shadow-sm' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'}`}>{st}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className={`space-y-3 ${selectedBooking ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
                {filteredBookings.map((b) => (
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
        )}

        {activeTab === 'contactos' && (
          <div className="space-y-4">
            <div className="text-xs text-stone-500 dark:text-stone-400 mb-2">Mensajes recibidos a través del formulario público.</div>
            {contacts.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 text-xs">No hay mensajes en la bandeja de entrada.</div>
            ) : (
              <div className="space-y-3">
                {contacts.map((c) => (
                  <div key={c.id} className={`p-5 rounded-2xl border text-xs transition-colors bg-white dark:bg-stone-900 ${c.read ? 'border-stone-200 dark:border-stone-800' : 'border-amber-400 dark:border-amber-600 bg-amber-50/30 dark:bg-amber-900/10'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2"><strong className="text-stone-900 dark:text-white text-sm font-display">{c.name}</strong><span className="text-stone-400">·</span><span className="text-stone-500 dark:text-stone-400">{new Date(c.createdAt).toLocaleString('es-CL')}</span></div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggleContactRead(c.id, c.read)} className="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white text-[11px] underline cursor-pointer">{c.read ? 'Marcar como no leído' : 'Marcar como leído'}</button>
                        <button onClick={() => handleDeleteContact(c.id)} className="text-rose-500 dark:text-rose-400 hover:text-rose-700 p-1 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <div className="text-stone-800 dark:text-stone-200 font-bold mb-1.5">Asunto: {c.subject}</div>
                    <div className="p-3.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 leading-relaxed">{c.message}</div>
                    <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 text-stone-600 dark:text-stone-400">
                      <span>📧 {c.email}</span>
                      {c.phone && <span>📞 {c.phone}</span>}
                      {c.phone && (<a href={`https://wa.me/${c.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /><span>Responder por WhatsApp</span></a>)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tarifas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs text-stone-500 dark:text-stone-400">Tarifas oficiales fijadas en pesos chilenos (CLP) para el servicio hotelero y turístico.</div>
              <button onClick={() => handleOpenTariffModal()} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 dark:bg-amber-500 hover:bg-stone-800 dark:hover:bg-amber-400 text-white dark:text-stone-950 text-xs font-bold transition-colors shadow-sm"><Plus className="w-4 h-4 text-amber-400 dark:text-stone-950" /> Agregar Servicio</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tariffs.map((t) => (
                <div key={t.id} className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs flex flex-col justify-between group transition-colors duration-300">
                  <div>
                    {t.image && <img src={t.image} alt={t.name} className="w-full h-32 object-cover rounded-lg mb-3" />}
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
        )}

        {/* PESTAÑA DE SOPORTE TÉCNICO */}
        {activeTab === 'soporte' && (
          <div className="max-w-2xl mx-auto mt-12 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 sm:p-12 shadow-sm text-center transition-colors duration-300">
            <div className="w-20 h-20 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6 shadow-inner">
              <LifeBuoy className="w-10 h-10" />
            </div>
            
            <h2 className="text-2xl font-bold font-display text-stone-900 dark:text-white mb-3">
              Soporte Técnico Web
            </h2>
            
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-8 max-w-lg mx-auto">
              ¿Experimentas algún problema con el sitio web, el panel de administración o el sistema de reservas? 
              Contáctame directamente para resolverlo lo antes posible.
            </p>

            <a
              href={`https://wa.me/56945422388?text=${encodeURIComponent('Hola, necesito soporte técnico para el sitio web de New Route Chile.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Contactar a Soporte (+56 9 4542 2388)</span>
            </a>

            <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800">
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Servicio disponible para reportar errores, solicitar mejoras o resolver dudas técnicas.
              </p>
            </div>
          </div>
        )}
      </main>

      {isTariffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl my-8 transition-colors duration-300">
            <div className="bg-stone-900 dark:bg-black px-6 py-4 flex justify-between rounded-t-2xl">
              <h3 className="text-lg font-bold text-white">{editingTariff ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
              <button onClick={() => setIsTariffModalOpen(false)} className="text-stone-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveTariff} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold mb-1 dark:text-stone-300">Nombre *</label><input type="text" required value={tariffForm.name || ''} onChange={e => setTariffForm({...tariffForm, name: e.target.value})} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors" /></div>
                <div><label className="block text-xs font-bold mb-1 dark:text-stone-300">Subtítulo</label><input type="text" value={tariffForm.subtitle || ''} onChange={e => setTariffForm({...tariffForm, subtitle: e.target.value})} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors" /></div>
                <div><label className="block text-xs font-bold mb-1 dark:text-stone-300">Categoría</label><select value={tariffForm.category || 'aeropuerto'} onChange={e => setTariffForm({...tariffForm, category: e.target.value as ServiceCategory})} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"><option value="aeropuerto">Aeropuerto</option><option value="vinos">Vinos</option><option value="ski">Ski</option><option value="termas">Termas</option><option value="city_tour">City Tour</option></select></div>
                <div><label className="block text-xs font-bold mb-1 dark:text-stone-300">Duración</label><input type="text" placeholder="Ej: 7 horas" value={tariffForm.durationApprox || ''} onChange={e => setTariffForm({...tariffForm, durationApprox: e.target.value})} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors" /></div>
              </div>
              <div><label className="block text-xs font-bold mb-1 dark:text-stone-300">Descripción</label><textarea rows={2} value={tariffForm.description || ''} onChange={e => setTariffForm({...tariffForm, description: e.target.value})} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors" /></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 dark:text-stone-300">Precio 1-3 PAX</label>
                  <input type="number" required value={tariffForm.price1to3 || 0} onChange={e => handlePrice1to3Change(parseInt(e.target.value) || 0)} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 dark:text-stone-300">Precio 4-6 PAX</label>
                  <input type="number" required value={tariffForm.price4to6 || 0} onChange={e => setTariffForm({...tariffForm, price4to6: parseInt(e.target.value)})} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors" />
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
                <button type="button" onClick={() => setIsTariffModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">Cancelar</button>
                <button type="submit" disabled={isUploading} className="px-5 py-2.5 rounded-lg bg-amber-500 disabled:opacity-50 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};