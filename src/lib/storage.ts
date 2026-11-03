// src/lib/storage.ts
import { BookingRequest, ContactMessage, ServiceTariff } from '../types';
import { INITIAL_BOOKINGS_SEED, INITIAL_CONTACT_SEED, SERVICES_TARIFFS } from '../data/newrouteData';

const API_URL = '/api/db';

// --- RESERVAS ---
export async function getStoredBookings(): Promise<BookingRequest[]> {
  try {
    const res = await fetch(`${API_URL}/bookings`);
    if (!res.ok) throw new Error('Error fetching bookings');
    return await res.json();
  } catch (e) {
    console.error(e);
    return INITIAL_BOOKINGS_SEED;
  }
}

export async function createBooking(bookingData: Omit<BookingRequest, 'id' | 'referenceCode' | 'createdAt' | 'status'>): Promise<BookingRequest> {
  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });
  if (!res.ok) throw new Error('Error creando reserva');
  return await res.json();
}

export async function updateBookingStatus(id: string, status: string, adminNotes?: string, assignedDriver?: string): Promise<void> {
  await fetch(`${API_URL}/bookings`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status, adminNotes, assignedDriver })
  });
}

export async function deleteBooking(id: string): Promise<void> {
  await fetch(`${API_URL}/bookings`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
}

// --- CONTACTOS ---
export async function getStoredContacts(): Promise<ContactMessage[]> {
  try {
    const res = await fetch(`${API_URL}/contacts`);
    if (!res.ok) throw new Error('Error fetching contacts');
    return await res.json();
  } catch (e) {
    console.error(e);
    return INITIAL_CONTACT_SEED;
  }
}

export async function createContactMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read' | 'replied'>): Promise<ContactMessage> {
  const res = await fetch(`${API_URL}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msg)
  });
  if (!res.ok) throw new Error('Error creando mensaje');
  return await res.json();
}

export async function markContactRead(id: string, read = true): Promise<void> {
  await fetch(`${API_URL}/contacts`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, read })
  });
}

export async function deleteContactMessage(id: string): Promise<void> {
  await fetch(`${API_URL}/contacts`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
}

// --- TARIFAS ---
export async function getStoredTariffs(): Promise<ServiceTariff[]> {
  try {
    const res = await fetch(`${API_URL}/tariffs`);
    if (!res.ok) throw new Error('Error fetching tariffs');
    return await res.json();
  } catch (e) {
    console.error(e);
    return SERVICES_TARIFFS;
  }
}

export async function saveTariff(tariff: ServiceTariff, isEditing: boolean): Promise<void> {
  // Si la imagen es undefined, la enviamos como null
  const payload = { ...tariff, image: tariff.image || null, isEditing };
  const res = await fetch(`${API_URL}/tariffs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al guardar servicio');
  }
}

export async function deleteTariff(id: string): Promise<void> {
  await fetch(`${API_URL}/tariffs`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
}

// --- UTILIDADES ---
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
    b.referenceCode, new Date(b.createdAt).toLocaleDateString('es-CL'),
    `"${b.serviceName.replace(/"/g, '""')}"`, `"${b.customerName.replace(/"/g, '""')}"`,
    b.customerEmail, b.customerPhone, b.date, b.time, b.passengers,
    `"${b.pickupAddress.replace(/"/g, '""')}"`, `"${(b.dropoffAddress || '').replace(/"/g, '""')}"`,
    `"${(b.flightNumber || '').replace(/"/g, '""')}"`, b.totalEstimatedPrice, b.status,
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