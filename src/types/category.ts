export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}
