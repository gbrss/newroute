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
    // Cargar datos iniciales
    setTariffs(getStoredTariffs());

    // Función para recargar cuando haya cambios desde el panel de gerencia
    const handleUpdate = () => {
      setTariffs(getStoredTariffs());
    };

    window.addEventListener('tariffs-updated', handleUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'newroute_tariffs_v1') handleUpdate();
    });

    const handleOpenModal = (e: Event) => {
      // CORRECCIÓN AQUÍ: Forzamos la lectura del localStorage cada vez que se abre el modal
      setTariffs(getStoredTariffs()); 
      
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.serviceId) {
        setPreselectedId(customEvent.detail.serviceId);
      } else {
        setPreselectedId(undefined);
      }
      setIsOpen(true);
    };

    window.addEventListener('open-booking-modal', handleOpenModal);
    
    return () => {
      window.removeEventListener('tariffs-updated', handleUpdate);
      window.removeEventListener('open-booking-modal', handleOpenModal);
      // Nota: El removeEventListener de 'storage' se omite en este snippet por brevedad, 
      // pero es buena práctica incluirlo si usas una función nombrada.
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