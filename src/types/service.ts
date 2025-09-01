export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  businessId: string;
  categoryId: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServicesState {
  services: Service[];
  selectedService: Service | null;
  isLoading: boolean;
  error: string | null;
}
