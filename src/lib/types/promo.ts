export interface Promo {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  businessId: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromosState {
  promos: Promo[];
  featuredPromos: Promo[];
  selectedPromo: Promo | null;
  isLoading: boolean;
  error: string | null;
}
