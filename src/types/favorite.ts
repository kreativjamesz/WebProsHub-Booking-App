export interface Favorite {
  id: string;
  userId: string;
  businessId: string;
  businessName: string;
  businessDescription?: string;
  businessRating?: number;
  createdAt: Date;
}

export interface FavoritesState {
  favorites: Favorite[];
  isLoading: boolean;
  error: string | null;
}
