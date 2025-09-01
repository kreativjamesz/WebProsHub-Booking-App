import { getCookie } from '@/lib/utils/cookies';
import { User, Business, Category } from '@/types';

// Types for API responses
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface AdminApiError extends Error {
  status?: number;
  code?: string;
}

// Update types for different operations
type UserUpdates = Partial<Pick<User, 'role' | 'name' | 'email'>>;
type BusinessUpdates = Partial<Pick<Business, 'name' | 'description' | 'isActive' | 'categoryId'>>;
type CategoryUpdates = Partial<Pick<Category, 'name' | 'description' | 'icon' | 'color' | 'isActive'>>;
type SystemSettings = Record<string, unknown>;

// Admin API Client Class
class AdminApiClient {
  private baseUrl: string;
  private getAuthHeaders: () => HeadersInit;

  constructor() {
    this.baseUrl = '/api/admin';
    this.getAuthHeaders = () => {
      const adminToken = getCookie('adminToken');
      return {
        'Authorization': adminToken ? `Bearer ${adminToken}` : '',
        'Content-Type': 'application/json',
      };
    };
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getAuthHeaders();

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      // Handle authentication errors
      if (response.status === 401) {
        throw new Error('Admin authentication required');
      }

      if (response.status === 403) {
        throw new Error('Insufficient permissions');
      }

      // Handle other HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const apiError = error as AdminApiError;
      console.error(`API Error (${endpoint}):`, apiError);
      
      return {
        success: false,
        error: apiError.message || 'An unexpected error occurred',
      };
    }
  }

  // Users Management
  async getUsers(params: {
    page?: number;
    search?: string;
    role?: string;
    status?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all') {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/users${queryString ? `?${queryString}` : ''}`;
    
    return this.request<User[]>(endpoint);
  }

  async getUserById(userId: string) {
    return this.request<User>(`/users/${userId}`);
  }

  async updateUserRole(userId: string, role: string) {
    return this.request<User>(`/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async updateUserStatus(userId: string, isActive: boolean) {
    return this.request<User>(`/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }

  async deleteUser(userId: string) {
    return this.request<{ success: boolean }>(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async bulkUpdateUsers(userIds: string[], updates: UserUpdates) {
    return this.request<User[]>(`/users/bulk-update`, {
      method: 'PATCH',
      body: JSON.stringify({ userIds, updates }),
    });
  }

  // Businesses Management
  async getBusinesses(params: {
    page?: number;
    search?: string;
    status?: string;
    category?: string;
    city?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all') {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/businesses${queryString ? `?${queryString}` : ''}`;
    
    return this.request<Business[]>(endpoint);
  }

  async getBusinessById(businessId: string) {
    return this.request<Business>(`/businesses/${businessId}`);
  }

  async updateBusinessStatus(businessId: string, isActive: boolean) {
    return this.request<Business>(`/businesses/${businessId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }

  async updateBusinessDetails(businessId: string, updates: BusinessUpdates) {
    return this.request<Business>(`/businesses/${businessId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async assignBusinessOwner(businessId: string, ownerEmail: string) {
    return this.request<Business>(`/businesses/${businessId}/assign-owner`, {
      method: 'PATCH',
      body: JSON.stringify({ ownerEmail }),
    });
  }

  async deleteBusiness(businessId: string) {
    return this.request<{ success: boolean }>(`/businesses/${businessId}`, {
      method: 'DELETE',
    });
  }

  async bulkUpdateBusinesses(businessIds: string[], updates: BusinessUpdates) {
    return this.request<Business[]>(`/businesses/bulk-update`, {
      method: 'PATCH',
      body: JSON.stringify({ businessIds, updates }),
    });
  }

  // Categories Management
  async getCategories() {
    return this.request<Category[]>('/categories');
  }

  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, updates: CategoryUpdates) {
    return this.request<Category>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteCategory(id: string) {
    return this.request<{ success: boolean }>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // System Management
  async getSystemStats() {
    return this.request<Record<string, unknown>>('/system/stats');
  }

  async getSystemSettings() {
    return this.request<SystemSettings>('/system/settings');
  }

  async updateSystemSettings(section: string, settings: SystemSettings) {
    return this.request<SystemSettings>(`/system/settings/${section}`, {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  }

  // Utility methods
  async uploadFile(file: File, endpoint: string) {
    const formData = new FormData();
    formData.append('file', file);

    const headers = this.getAuthHeaders();
    delete (headers as Record<string, string>)['Content-Type']; // Let browser set content-type for FormData

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('File upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!getCookie('adminToken');
  }

  // Clear authentication (logout)
  logout(): void {
    // This would typically clear cookies/tokens
    // Implementation depends on your auth strategy
  }
}

// Export singleton instance
export const adminClient = new AdminApiClient();
