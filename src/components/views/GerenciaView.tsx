import React, { useState, useEffect } from 'react';
import ImageKit from 'imagekit-javascript';
import { BookingRequest, ContactMessage, ServiceTariff, BookingStatus } from '../../types';
import {
  updateBookingStatus, deleteBooking, markContactRead, deleteContactMessage,
  exportBookingsToCSV, getStoredTariffs, saveTariff, deleteTariff
} from '../../lib/storage';

// Importación de los componentes
import { GerenciaLogin } from '../gerencia/GerenciaLogin';
import { GerenciaHeader } from '../gerencia/GerenciaHeader';
import { GerenciaKpis } from '../gerencia/GerenciaKpis';
import { GerenciaTabs } from '../gerencia/GerenciaTabs';
import { TabBookings } from '../gerencia/TabBookings';
import { TabContacts } from '../gerencia/TabContacts';
import { TabTariffs } from '../gerencia/TabTariffs';
import { TabSupport } from '../gerencia/TabSupport';
import { TariffModal } from '../gerencia/TariffModal';

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
      document.title = isAuthenticated ? 'Panel de Gerencia | New Route Chile' : 'Iniciar Sesión | New Route Chile';
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
      <GerenciaLogin
        username={username} setUsername={setUsername}
        password={password} setPassword={setPassword}
        showPassword={showPassword} setShowPassword={setShowPassword}
        handleLogin={handleLogin} loginError={loginError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col font-sans selection:bg-amber-800 selection:text-white transition-colors duration-300">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <GerenciaHeader isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} handleLogout={handleLogout} />
      
      <GerenciaKpis pendingCount={pendingCount} confirmedCount={confirmedCount} unreadContactsCount={unreadContactsCount} totalRevenue={totalRevenue} />
      
      <GerenciaTabs 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        bookingsCount={bookings.length} contactsCount={contacts.length} tariffsCount={tariffs.length}
        onOpenBookingModal={() => window.dispatchEvent(new CustomEvent('open-booking-modal'))}
        onExport={() => exportBookingsToCSV(bookings)}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8">
        {activeTab === 'reservas' && (
          <TabBookings
            bookings={filteredBookings} statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            selectedBooking={selectedBooking} handleSelectBooking={handleSelectBooking} setSelectedBooking={setSelectedBooking}
            driverInput={driverInput} setDriverInput={setDriverInput}
            notesInput={notesInput} setNotesInput={setNotesInput}
            handleUpdateStatus={handleUpdateStatus} handleSaveNotes={handleSaveNotes} handleDeleteBooking={handleDeleteBooking}
            buildClientWhatsAppMessage={buildClientWhatsAppMessage}
            onOpenBookingModal={() => window.dispatchEvent(new CustomEvent('open-booking-modal'))}
            onExport={() => exportBookingsToCSV(bookings)}
            getStatusBadge={getStatusBadge}
          />
        )}

        {activeTab === 'contactos' && (
          <TabContacts contacts={contacts} handleToggleContactRead={handleToggleContactRead} handleDeleteContact={handleDeleteContact} />
        )}

        {activeTab === 'tarifas' && (
          <TabTariffs tariffs={tariffs} handleOpenTariffModal={handleOpenTariffModal} handleDeleteTariff={handleDeleteTariff} />
        )}

        {activeTab === 'soporte' && <TabSupport />}
      </main>

      <TariffModal
        isOpen={isTariffModalOpen} onClose={() => setIsTariffModalOpen(false)}
        editingTariff={editingTariff} tariffForm={tariffForm} setTariffForm={setTariffForm}
        handleSaveTariff={handleSaveTariff} handlePrice1to3Change={handlePrice1to3Change}
        handleImageUpload={handleImageUpload} isUploading={isUploading}
      />
    </div>
  );
};