import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AdminLoginRequest, AdminLoginResponse } from './adminAuth.types';
import { AdminUser } from '../admin.types';

// Admin Auth API - No baseUrl to avoid conflicts
export const adminAuthApi = createApi({
  reducerPath: 'adminAuthApi',
  baseQuery: fetchBaseQuery({
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['AdminAuth'],
  endpoints: (builder) => ({
    // Admin login
    adminLogin: builder.mutation<AdminLoginResponse, AdminLoginRequest>({
      query: (credentials) => ({
        url: '/api/admin-auth',
        method: 'POST',
        body: { action: 'login', ...credentials },
      }),
      invalidatesTags: ['AdminAuth'],
    }),

    // Admin logout
    adminLogout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/api/admin-auth',
        method: 'POST',
        body: { action: 'logout' },
      }),
      invalidatesTags: ['AdminAuth'],
    }),

    // Get current admin user
    getCurrentAdmin: builder.query<{ success: boolean; user: AdminUser }, void>({
      query: () => ({
        url: '/api/admin-auth',
        method: 'GET',
      }),
      providesTags: ['AdminAuth'],
    }),

    // Refresh admin token
    refreshToken: builder.mutation<{ success: boolean; adminToken: string }, void>({
      query: () => ({
        url: '/api/admin-auth',
        method: 'POST',
        body: { action: 'refresh' },
      }),
      invalidatesTags: ['AdminAuth'],
    }),

    // Update admin profile
    updateProfile: builder.mutation<{ success: boolean; adminUser: AdminUser }, Partial<AdminUser>>({
      query: (updates) => ({
        url: '/api/admin-auth',
        method: 'POST',
        body: { action: 'profile', ...updates },
      }),
      invalidatesTags: ['AdminAuth'],
    }),
  }),
});

// Export hooks
export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useGetCurrentAdminQuery,
  useRefreshTokenMutation,
  useUpdateProfileMutation,
} = adminAuthApi;
