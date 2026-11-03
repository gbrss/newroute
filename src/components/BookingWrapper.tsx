// src/components/BookingWrapper.tsx
import React, { useState, useEffect } from 'react';
import { BookingModal } from './BookingModal';
import { getStoredTariffs } from '../lib/storage';
import { SERVICES_TARIFFS } from '../data/newrouteData';
import { ServiceTariff } from '../types';

export const BookingWrapper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedId, setPreselectedId] = useState<string | undefined>(undefined);
  const [tariffs, setTariffs] = useState<ServiceTariff[]>(SERVICES_TARIFFS);

  // --- EFECTO ACTUALIZADO PARA BLOQUEAR EL SCROLL ---
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden'; // <-- BLOQUEA EL SCROLL
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';       // <-- RESTAURA EL SCROLL
    }
    
    // Limpieza por si el componente se desmonta
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    setTariffs(getStoredTariffs());

    const handleUpdate = () => {
      setTariffs(getStoredTariffs());
    };

    window.addEventListener('tariffs-updated', handleUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'newroute_tariffs_v1') handleUpdate();
    });

    const handleOpenModal = (e: Event) => {
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