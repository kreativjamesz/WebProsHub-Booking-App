import { AdminLoginRequest, AdminLoginResponse } from './adminAuth.types';
import { AdminUser } from '../admin.types';                                           

// Admin Authentication API Functions
export const adminAuthApi = {
  // Admin login
  login: async (credentials: AdminLoginRequest): Promise<AdminLoginResponse> => {
    try {
      const response = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  },

  // Admin logout
  logout: async (): Promise<void> => {
    try {
      await fetch('/api/admin-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'logout' }),
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Get current admin user
  getCurrentAdmin: async (token: string): Promise<AdminUser> => {
    try {
      const response = await fetch('/api/admin-auth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get admin user');
      }

      const data = await response.json();
      return data.adminUser;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get admin user');
    }
  },

  // Refresh admin token
  refreshToken: async (token: string): Promise<{ adminToken: string }> => {
    try {
      const response = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'refresh' }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Token refresh failed');
    }
  },

  // Update admin profile
  updateProfile: async (token: string, updates: Partial<AdminUser>): Promise<AdminUser> => {
    try {
      const response = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'profile', ...updates }),
      });

      if (!response.ok) {
        throw new Error('Profile update failed');
      }

      const data = await response.json();
      return data.adminUser;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Profile update failed');
    }
  },
};
