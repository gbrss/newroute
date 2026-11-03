import React, { useState, useEffect } from 'react';
import { BookingModal } from './BookingModal';
import { getStoredTariffs } from '../lib/storage';
import { SERVICES_TARIFFS } from '../data/newrouteData';
import { ServiceTariff } from '../types';

export const BookingWrapper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedId, setPreselectedId] = useState<string | undefined>(undefined);
  const [tariffs, setTariffs] = useState<ServiceTariff[]>(SERVICES_TARIFFS);

  useEffect(() => {
    // Cargar tarifas desde Turso al inicio
    getStoredTariffs().then(setTariffs);

    const handleUpdate = () => {
      getStoredTariffs().then(setTariffs);
    };

    window.addEventListener('tariffs-updated', handleUpdate);
    
    const handleOpenModal = (e: Event) => {
      // 1. Abrimos el modal inmediatamente
      setIsOpen(true);
      
      // 2. Capturamos el servicio seleccionado
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.serviceId) {
        setPreselectedId(customEvent.detail.serviceId);
      } else {
        setPreselectedId(undefined);
      }

      // 3. Actualizamos las tarifas en segundo plano
      getStoredTariffs().then(setTariffs);
    };

    window.addEventListener('open-booking-modal', handleOpenModal);
    
    return () => {
      window.removeEventListener('tariffs-updated', handleUpdate);
      window.removeEventListener('open-booking-modal', handleOpenModal);
    };
  }, []);

  return (
    <BookingModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      tariffs={tariffs}
      preselectedServiceId={preselectedId}
    />
  );
};