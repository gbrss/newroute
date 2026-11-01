import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, Luggage, ShieldCheck, CheckCircle2, ArrowRight, MessageCircle } from 'lucide-react';
import { ServiceTariff, BookingRequest } from '../types';
import { createBooking, formatCLP } from '../lib/storage';
import { COMPANY_INFO } from '../data/newrouteData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tariffs: ServiceTariff[];
  preselectedServiceId?: string;
  onBookingCreated?: (booking: BookingRequest) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  tariffs,
  preselectedServiceId,
  onBookingCreated,
}) => {
  const [serviceId, setServiceId] = useState<string>(preselectedServiceId || 'transfer-aeropuerto');
  const [passengersGroup, setPassengersGroup] = useState<'1-3' | '4-6' | '7+'>('1-3');
  const [passengersCount, setPassengersCount] = useState<number>(2);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState<string>('09:00');
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [dropoffAddress, setDropoffAddress] = useState<string>('');
  const [flightNumber, setFlightNumber] = useState<string>('');
  const [luggageCount, setLuggageCount] = useState<number>(2);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [needsBilingualDriver, setNeedsBilingualDriver] = useState<boolean>(false);
  const [needsBabySeat, setNeedsBabySeat] = useState<boolean>(false);

  const [confirmedBooking, setConfirmedBooking] = useState<BookingRequest | null>(null);
  const [formError, setFormError] = useState<string>('');

  useEffect(() => {
    if (preselectedServiceId) {
      setServiceId(preselectedServiceId);
    }
  }, [preselectedServiceId]);

  if (!isOpen) return null;

  const currentService = tariffs.find((t) => t.id === serviceId) || tariffs[0];

  // Calculate price
  let estimatedPrice = 0;
  if (passengersGroup === '1-3') {
    estimatedPrice = currentService.price1to3;
  } else if (passengersGroup === '4-6') {
    estimatedPrice = currentService.price4to6;
  } else {
    // 7+ pax: base price + 40%
    estimatedPrice = Math.round(currentService.price4to6 * 1.4);
  }

  const handlePassengersGroupChange = (grp: '1-3' | '4-6' | '7+') => {
    setPassengersGroup(grp);
    if (grp === '1-3' && passengersCount > 3) setPassengersCount(3);
    if (grp === '4-6' && (passengersCount < 4 || passengersCount > 6)) setPassengersCount(4);
    if (grp === '7+' && passengersCount < 7) setPassengersCount(7);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || !pickupAddress.trim()) {
      setFormError('Por favor completa todos los campos obligatorios (*).');
      return;
    }

    const created = createBooking({
      serviceId: currentService.id,
      serviceName: currentService.name,
      customerName,
      customerEmail,
      customerPhone,
      date,
      time,
      passengers: passengersCount,
      pickupAddress,
      dropoffAddress: dropoffAddress.trim() || undefined,
      flightNumber: flightNumber.trim() || undefined,
      luggageCount,
      specialRequests: specialRequests.trim() || undefined,
      needsBilingualDriver,
      needsBabySeat,
      totalEstimatedPrice: estimatedPrice,
    });

    setConfirmedBooking(created);
    if (onBookingCreated) {
      onBookingCreated(created);
    }
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setSpecialRequests('');
    onClose();
  };

  const buildWhatsAppText = (booking: BookingRequest) => {
    return encodeURIComponent(
      `¡Hola New Route Chile! Acabo de registrar la solicitud de reserva ${booking.referenceCode} a través de su sitio web:\n\n` +
      `• Servicio: ${booking.serviceName}\n` +
      `• Fecha: ${booking.date} a las ${booking.time} hrs\n` +
      `• Pasajeros: ${booking.passengers} (Equipaje: ${booking.luggageCount} maletas)\n` +
      `• Origen: ${booking.pickupAddress}\n` +
      `${booking.dropoffAddress ? `• Destino: ${booking.dropoffAddress}\n` : ''}` +
      `${booking.flightNumber ? `• N° Vuelo: ${booking.flightNumber}\n` : ''}` +
      `• Tarifa Estimada: ${formatCLP(booking.totalEstimatedPrice)}\n` +
      `• Titular: ${booking.customerName} (${booking.customerPhone})\n\n` +
      `¿Podrían confirmarme la disponibilidad del móvil? ¡Muchas gracias!`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-stone-900 text-white px-6 py-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Sistema de Gestión de Reservas
            </div>
            <h3 className="text-xl font-bold font-display text-white mt-0.5">
              {confirmedBooking ? '¡Solicitud de Reserva Registrada!' : 'Reservar Traslado / Tour Privado'}
            </h3>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {confirmedBooking ? (
          /* Confirmation Success Screen */
          <div className="p-6 sm:p-8 space-y-6 text-stone-800">
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Reserva creada exitosamente</h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Hemos registrado tus datos en el sistema central de New Route Chile.
                </p>
              </div>
            </div>

            <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <span className="text-stone-500 font-medium">Código de Referencia:</span>
                <span className="font-mono font-bold text-stone-900 text-sm">{confirmedBooking.referenceCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Servicio:</span>
                <span className="font-semibold text-stone-900">{confirmedBooking.serviceName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Fecha y Hora:</span>
                <span className="font-medium text-stone-800">{confirmedBooking.date} a las {confirmedBooking.time} hrs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Pasajeros:</span>
                <span className="font-medium text-stone-800">{confirmedBooking.passengers} personas ({confirmedBooking.luggageCount} maletas)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Lugar de recogida:</span>
                <span className="font-medium text-stone-800">{confirmedBooking.pickupAddress}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                <span className="text-stone-700 font-bold">Tarifa Total Estimada:</span>
                <span className="text-base font-bold text-amber-700 font-display">
                  {formatCLP(confirmedBooking.totalEstimatedPrice)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${buildWhatsAppText(confirmedBooking)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 text-white" />
                <span>Confirmar Inmediatamente por WhatsApp (+56 9 8412 8890)</span>
              </a>

              <button
                onClick={handleReset}
                className="w-full py-2.5 px-4 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors"
              >
                Volver a la página principal
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg font-medium">
                {formError}
              </div>
            )}

            {/* Step 1: Service Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                1. Selección de Servicio
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-sm text-stone-900 focus:outline-none focus:border-amber-600"
              >
                {tariffs.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — ({formatCLP(t.price1to3)} / {formatCLP(t.price4to6)})
                  </option>
                ))}
              </select>
              <p className="text-xs text-stone-500 mt-1 italic">{currentService.subtitle}</p>
            </div>

            {/* Step 2: Passenger Size & Group */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                2. Tamaño del Grupo & Vehículo
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handlePassengersGroupChange('1-3')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    passengersGroup === '1-3'
                      ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="text-xs font-bold">1 a 3 Personas</div>
                  <div className="text-[11px] text-stone-500 font-normal mt-0.5">Sedán / SUV</div>
                  <div className="text-xs text-amber-700 font-bold mt-1 font-display">
                    {formatCLP(currentService.price1to3)}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePassengersGroupChange('4-6')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    passengersGroup === '4-6'
                      ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="text-xs font-bold">4 a 6 Personas</div>
                  <div className="text-[11px] text-stone-500 font-normal mt-0.5">Van Ejecutiva</div>
                  <div className="text-xs text-amber-700 font-bold mt-1 font-display">
                    {formatCLP(currentService.price4to6)}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePassengersGroupChange('7+')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    passengersGroup === '7+'
                      ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="text-xs font-bold">7+ Personas</div>
                  <div className="text-[11px] text-stone-500 font-normal mt-0.5">Sprinter VIP</div>
                  <div className="text-xs text-amber-700 font-bold mt-1 font-display">
                    {formatCLP(Math.round(currentService.price4to6 * 1.4))}
                  </div>
                </button>
              </div>
            </div>

            {/* Step 3: Date, Time & Coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  <span>Fecha de Traslado *</span>
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>Hora de Recogida *</span>
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" />
                  <span>Dirección o Lugar de Recogida *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Aeropuerto SCL, Hotel InterContinental, Ahumada 236..."
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Destino o Hotel Final
                </label>
                <input
                  type="text"
                  placeholder="Ej: Hotel Las Condes, Viña Casas del Bosque..."
                  value={dropoffAddress}
                  onChange={(e) => setDropoffAddress(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  N° de Vuelo (Si aplica)
                </label>
                <input
                  type="text"
                  placeholder="Ej: LATAM LA 501 / Sky 204"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            {/* Luggage & Amenities */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
                  <Luggage className="w-3.5 h-3.5 text-stone-500" />
                  <span>Cantidad de Maletas</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={luggageCount}
                  onChange={(e) => setLuggageCount(parseInt(e.target.value) || 0)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="flex flex-col justify-center space-y-2 pt-2">
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needsBilingualDriver}
                    onChange={(e) => setNeedsBilingualDriver(e.target.checked)}
                    className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span>Conductor bilingüe (inglés)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needsBabySeat}
                    onChange={(e) => setNeedsBabySeat(e.target.checked)}
                    className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span>Silla de seguridad para infante</span>
                </label>
              </div>
            </div>

            {/* Step 4: Contact Details */}
            <div className="pt-2 border-t border-stone-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                3. Datos del Pasajero o Solicitante
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@ejemplo.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+56 9 ..."
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Notas Adicionales / Requerimientos Especiales
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre equipaje de esquí, paradas intermedias, facturación a empresa..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            {/* Total Calculation & Submit */}
            <div className="p-4 rounded-xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-[11px] text-stone-400 uppercase tracking-wider">
                  Total Estimado a Pagar
                </div>
                <div className="text-2xl font-bold font-display text-amber-400">
                  {formatCLP(estimatedPrice)}
                </div>
                <div className="text-[10px] text-stone-400">
                  Sin recargo nocturno · Servicio garantizado 24/7
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Confirmar y Enviar Reserva</span>
                <ArrowRight className="w-4 h-4 text-stone-950" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
