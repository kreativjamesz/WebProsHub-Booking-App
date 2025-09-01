export interface Business {
  id: string;
  name: string;
  description: string | null;
  logo?: string;
  coverImage?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  categoryId: string;
  ownerId: string;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessesState {
  businesses: Business[];
  featuredBusinesses: Business[];
  selectedBusiness: Business | null;
  isLoading: boolean;
  error: string | null;
}
