import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCookie } from '@/lib/utils/cookies';

// Base query with admin authentication
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/admin',
  prepareHeaders: (headers) => {
    const adminToken = getCookie('adminToken');
    if (adminToken) {
      headers.set('authorization', `Bearer ${adminToken}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Admin API definition
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery,
  tagTypes: ['Users', 'Businesses', 'Categories', 'System'],
  endpoints: (builder) => ({
    // Users Management
    getUsers: builder.query({
      query: ({ page = 1, search = '', role = 'all', status = 'all' }) => ({
        url: `/users?page=${page}&search=${search}&role=${role}&status=${status}`,
      }),
      providesTags: ['Users'],
    }),

    getUserById: builder.query({
      query: (userId: string) => `/users/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'Users', id: userId }],
    }),

    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/users/${userId}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['Users'],
    }),

    updateUserStatus: builder.mutation({
      query: ({ userId, isActive }) => ({
        url: `/users/${userId}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['Users'],
    }),

    deleteUser: builder.mutation({
      query: (userId: string) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),

    // Businesses Management
    getBusinesses: builder.query({
      query: ({ page = 1, search = '', status = 'all', category = 'all', city = 'all' }) => ({
        url: `/businesses?page=${page}&search=${search}&status=${status}&category=${category}&city=${city}`,
      }),
      providesTags: ['Businesses'],
    }),

    getBusinessById: builder.query({
      query: (businessId: string) => `/businesses/${businessId}`,
      providesTags: (result, error, businessId) => [{ type: 'Businesses', id: businessId }],
    }),

    updateBusinessStatus: builder.mutation({
      query: ({ businessId, isActive }) => ({
        url: `/businesses/${businessId}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['Businesses'],
    }),

    updateBusinessDetails: builder.mutation({
      query: ({ businessId, updates }) => ({
        url: `/businesses/${businessId}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['Businesses'],
    }),

    assignBusinessOwner: builder.mutation({
      query: ({ businessId, ownerEmail }) => ({
        url: `/businesses/${businessId}/assign-owner`,
        method: 'PATCH',
        body: { ownerEmail },
      }),
      invalidatesTags: ['Businesses'],
    }),

    deleteBusiness: builder.mutation({
      query: (businessId: string) => ({
        url: `/businesses/${businessId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Businesses'],
    }),

    // Categories Management
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),

    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: '/categories',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Categories'],
    }),

    updateCategory: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/categories/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['Categories'],
    }),

    deleteCategory: builder.mutation({
      query: (id: string) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),

    // System Management
    getSystemStats: builder.query({
      query: () => '/system/stats',
      providesTags: ['System'],
    }),

    getSystemSettings: builder.query({
      query: () => '/system/settings',
      providesTags: ['System'],
    }),

    updateSystemSettings: builder.mutation({
      query: ({ section, settings }) => ({
        url: `/system/settings/${section}`,
        method: 'PATCH',
        body: settings,
      }),
      invalidatesTags: ['System'],
    }),

    // Bulk Operations
    bulkUpdateUsers: builder.mutation({
      query: ({ userIds, updates }) => ({
        url: '/users/bulk-update',
        method: 'PATCH',
        body: { userIds, updates },
      }),
      invalidatesTags: ['Users'],
    }),

    bulkUpdateBusinesses: builder.mutation({
      query: ({ businessIds, updates }) => ({
        url: '/businesses/bulk-update',
        method: 'PATCH',
        body: { businessIds, updates },
      }),
      invalidatesTags: ['Businesses'],
    }),
  }),
});

// Export hooks
export const {
  // Users
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  
  // Businesses
  useGetBusinessesQuery,
  useGetBusinessByIdQuery,
  useUpdateBusinessStatusMutation,
  useUpdateBusinessDetailsMutation,
  useAssignBusinessOwnerMutation,
  useDeleteBusinessMutation,
  
  // Categories
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  
  // System
  useGetSystemStatsQuery,
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  
  // Bulk Operations
  useBulkUpdateUsersMutation,
  useBulkUpdateBusinessesMutation,
} = adminApi;
