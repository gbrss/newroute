import { BookingRequest, ContactMessage, ServiceTariff } from '../types';
import { INITIAL_BOOKINGS_SEED, INITIAL_CONTACT_SEED, SERVICES_TARIFFS } from '../data/newrouteData';

const BOOKINGS_KEY = 'newroute_bookings_v1';
const CONTACTS_KEY = 'newroute_contacts_v1';
const TARIFFS_KEY = 'newroute_tariffs_v1';

export function getStoredBookings(): BookingRequest[] {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_BOOKINGS_SEED));
      return INITIAL_BOOKINGS_SEED;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading bookings from localStorage', e);
    return INITIAL_BOOKINGS_SEED;
  }
}

export function saveBookings(bookings: BookingRequest[]): void {
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.error('Error saving bookings to localStorage', e);
  }
}

export function createBooking(bookingData: Omit<BookingRequest, 'id' | 'referenceCode' | 'createdAt' | 'status'>): BookingRequest {
  const current = getStoredBookings();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const newBooking: BookingRequest = {
    ...bookingData,
    id: 'b-' + Date.now(),
    referenceCode: `NR-2026-${randNum}`,
    createdAt: new Date().toISOString(),
    status: 'pendiente',
  };
  const updated = [newBooking, ...current];
  saveBookings(updated);
  return newBooking;
}

export function updateBookingStatus(id: string, status: BookingRequest['status'], adminNotes?: string, assignedDriver?: string): BookingRequest[] {
  const current = getStoredBookings();
  const updated = current.map(item => {
    if (item.id === id) {
      return {
        ...item,
        status,
        ...(adminNotes !== undefined ? { adminNotes } : {}),
        ...(assignedDriver !== undefined ? { assignedDriver } : {}),
      };
    }
    return item;
  });
  saveBookings(updated);
  return updated;
}

export function deleteBooking(id: string): BookingRequest[] {
  const current = getStoredBookings();
  const updated = current.filter(item => item.id !== id);
  saveBookings(updated);
  return updated;
}

export function getStoredContacts(): ContactMessage[] {
  try {
    const raw = localStorage.getItem(CONTACTS_KEY);
    if (!raw) {
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(INITIAL_CONTACT_SEED));
      return INITIAL_CONTACT_SEED;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading contacts from localStorage', e);
    return INITIAL_CONTACT_SEED;
  }
}

export function saveContacts(contacts: ContactMessage[]): void {
  try {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  } catch (e) {
    console.error('Error saving contacts to localStorage', e);
  }
}

export function createContactMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read' | 'replied'>): ContactMessage {
  const current = getStoredContacts();
  const newMsg: ContactMessage = {
    ...msg,
    id: 'c-' + Date.now(),
    createdAt: new Date().toISOString(),
    read: false,
    replied: false,
  };
  const updated = [newMsg, ...current];
  saveContacts(updated);
  return newMsg;
}

export function markContactRead(id: string, read = true): ContactMessage[] {
  const current = getStoredContacts();
  const updated = current.map(c => c.id === id ? { ...c, read } : c);
  saveContacts(updated);
  return updated;
}

export function deleteContactMessage(id: string): ContactMessage[] {
  const current = getStoredContacts();
  const updated = current.filter(c => c.id !== id);
  saveContacts(updated);
  return updated;
}

export function getStoredTariffs(): ServiceTariff[] {
  try {
    const raw = localStorage.getItem(TARIFFS_KEY);
    if (!raw) {
      localStorage.setItem(TARIFFS_KEY, JSON.stringify(SERVICES_TARIFFS));
      return SERVICES_TARIFFS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return SERVICES_TARIFFS;
  }
}

export function saveTariffs(tariffs: ServiceTariff[]): void {
  try {
    localStorage.setItem(TARIFFS_KEY, JSON.stringify(tariffs));
  } catch (e) {
    console.error('Error saving tariffs to localStorage', e);
  }
}

export function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function exportBookingsToCSV(bookings: BookingRequest[]): void {
  const headers = ['Codigo Ref', 'Fecha Creacion', 'Servicio', 'Cliente', 'Email', 'Telefono', 'Fecha Traslado', 'Hora', 'Pasajeros', 'Origen', 'Destino', 'Vuelo', 'Total CLP', 'Estado', 'Notas Admin'];
  const rows = bookings.map(b => [
    b.referenceCode,
    new Date(b.createdAt).toLocaleDateString('es-CL'),
    `"${b.serviceName.replace(/"/g, '""')}"`,
    `"${b.customerName.replace(/"/g, '""')}"`,
    b.customerEmail,
    b.customerPhone,
    b.date,
    b.time,
    b.passengers,
    `"${b.pickupAddress.replace(/"/g, '""')}"`,
    `"${(b.dropoffAddress || '').replace(/"/g, '""')}"`,
    `"${(b.flightNumber || '').replace(/"/g, '""')}"`,
    b.totalEstimatedPrice,
    b.status,
    `"${(b.adminNotes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `newroute_reservas_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
