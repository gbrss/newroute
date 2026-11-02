export type ServiceCategory = 'todos' | 'aeropuerto' | 'vinos' | 'ski' | 'termas' | 'city_tour';

export interface ServiceTariff {
  id: string;
  category: ServiceCategory;
  name: string;
  subtitle: string;
  description: string;
  price1to3: number; // CLP
  price4to6: number; // CLP
  price7plus?: number; // CLP
  priceGroupNote?: string;
  durationApprox: string;
  highlights: string[];
  image: string;
  featured?: boolean;
}

export type BookingStatus = 'pendiente' | 'confirmada' | 'en_curso' | 'completada' | 'cancelada';

export interface BookingRequest {
  id: string;
  referenceCode: string;
  createdAt: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  passengers: number;
  pickupAddress: string;
  dropoffAddress?: string;
  flightNumber?: string;
  luggageCount: number;
  specialRequests?: string;
  needsBilingualDriver?: boolean;
  needsBabySeat?: boolean;
  totalEstimatedPrice: number;
  status: BookingStatus;
  adminNotes?: string;
  assignedDriver?: string;
}

export interface ContactMessage {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  replied: boolean;
}

export interface Testimonial {
  id: string;
  author: string;
  roleOrOrigin: string;
  hotelOrCompany?: string;
  comment: string;
  rating: number;
  serviceUsed: string;
  date: string;
}
