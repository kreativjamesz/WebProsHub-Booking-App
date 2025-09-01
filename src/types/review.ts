export interface Review {
  id: string;
  customerId: string;
  businessId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}
