import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AdminUser } from '@/lib/types/admin';

// Admin API base configuration
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      // Get admin token from cookies or state
      const adminToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('adminToken='))
        ?.split('=')[1];
      
      if (adminToken) {
        headers.set('authorization', `Bearer ${adminToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ['AdminUser', 'AdminData'],
  endpoints: (builder) => ({
    // Admin login
    adminLogin: builder.mutation<{ user: AdminUser; token: string }, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/admin-auth',
        method: 'POST',
        body: {
          action: 'login',
          ...credentials,
        },
      }),
      invalidatesTags: ['AdminUser'],
    }),

    // Get admin profile
    getAdminProfile: builder.query<AdminUser, void>({
      query: () => '/admin/profile',
      providesTags: ['AdminUser'],
    }),

    // Update admin profile
    updateAdminProfile: builder.mutation<AdminUser, Partial<AdminUser>>({
      query: (updates) => ({
        url: '/admin/profile',
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['AdminUser'],
    }),

    // Admin logout
    adminLogout: builder.mutation<void, void>({
      query: () => ({
        url: '/admin/logout',
        method: 'POST',
      }),
      invalidatesTags: ['AdminUser'],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useAdminLogoutMutation,
} = adminApi;
