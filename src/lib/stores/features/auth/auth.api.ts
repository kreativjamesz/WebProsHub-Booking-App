import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  LoginRequest, 
  AdminLoginRequest, 
  AuthResponse, 
  AdminAuthResponse,
  User,
  AdminUser 
} from './auth.types';

// Create the API slice
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/',
    prepareHeaders: (headers, { getState }) => {
      // Get token from state for authenticated requests
      const state = getState() as any;
      const token = state.auth?.token || state.auth?.adminToken;
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'AdminUser'],
  endpoints: (builder) => ({
    // Regular User Authentication
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth',
        method: 'POST',
        body: {
          action: 'login',
          ...credentials,
        },
      }),
      invalidatesTags: ['User'],
    }),

    register: builder.mutation<AuthResponse, { email: string; password: string; name: string; role: string }>({
      query: (userData) => ({
        url: 'auth',
        method: 'POST',
        body: {
          action: 'register',
          ...userData,
        },
      }),
      invalidatesTags: ['User'],
    }),

    getCurrentUser: builder.query<{ success: boolean; user: User }, void>({
      query: () => 'auth',
      providesTags: ['User'],
    }),

    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: 'auth',
        method: 'POST',
        body: { action: 'logout' },
      }),
      invalidatesTags: ['User'],
    }),

    // Admin User Authentication
    adminLogin: builder.mutation<AdminAuthResponse, AdminLoginRequest>({
      query: (credentials) => ({
        url: 'admin-auth',
        method: 'POST',
        body: {
          action: 'login',
          ...credentials,
        },
      }),
      invalidatesTags: ['AdminUser'],
    }),

    getCurrentAdminUser: builder.query<{ success: boolean; user: AdminUser }, void>({
      query: () => 'admin-auth',
      providesTags: ['AdminUser'],
    }),

    // Admin User Management (if needed)
    getAdminUsers: builder.query<{ success: boolean; users: AdminUser[] }, void>({
      query: () => 'admin-users',
      providesTags: ['AdminUser'],
    }),

    createAdminUser: builder.mutation<{ success: boolean; user: AdminUser }, Partial<AdminUser>>({
      query: (userData) => ({
        url: 'admin-users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['AdminUser'],
    }),

    updateAdminUser: builder.mutation<{ success: boolean; user: AdminUser }, { id: string; data: Partial<AdminUser> }>({
      query: ({ id, data }) => ({
        url: `admin-users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['AdminUser'],
    }),

    deleteAdminUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `admin-users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminUser'],
    }),
  }),
});

// Export hooks for use in components
export const {
  // Regular auth hooks
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  
  // Admin auth hooks
  useAdminLoginMutation,
  useGetCurrentAdminUserQuery,
  
  // Admin management hooks
  useGetAdminUsersQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
} = authApi;
