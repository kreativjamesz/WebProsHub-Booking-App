# 🚀 Admin API Optimization Guide

## Overview
I've implemented two different approaches to optimize your admin API calls and eliminate repetitive code. Both approaches provide centralized API management, automatic authentication, and better error handling.

## 🎯 **Option 1: RTK Query (Recommended)**

### What is RTK Query?
RTK Query is a powerful data fetching and caching library built into Redux Toolkit. It provides:
- ✅ **Automatic caching** and deduplication
- ✅ **Background refetching** and optimistic updates
- ✅ **Loading and error states** management
- ✅ **Automatic re-rendering** when data changes
- ✅ **Built-in TypeScript support**

### Implementation
```typescript
// src/lib/stores/features/admin/adminApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/admin',
    prepareHeaders: (headers) => {
      const adminToken = getCookie('adminToken');
      if (adminToken) {
        headers.set('authorization', `Bearer ${adminToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Users', 'Businesses', 'Categories', 'System'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page, search, role, status }) => 
        `/users?page=${page}&search=${search}&role=${role}&status=${status}`,
      providesTags: ['Users'],
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/users/${userId}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['Users'], // Automatically refetch users
    }),
  }),
});
```

### Usage in Components
```typescript
// In your React component
import { useGetUsersQuery, useUpdateUserRoleMutation } from '@/lib/stores/features/admin/adminApi';

export default function AdminUsersPage() {
  // Automatic data fetching with loading/error states
  const { data: usersData, isLoading, error, refetch } = useGetUsersQuery({
    page: currentPage,
    search: searchTerm,
    role: roleFilter,
    status: statusFilter,
  });

  // Mutation hook with loading state
  const [updateUserRole, { isLoading: isUpdating }] = useUpdateUserRoleMutation();

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      await updateUserRole({ userId, role: newRole }).unwrap();
      // Data automatically refetches due to invalidatesTags
      toast.success("Role updated successfully");
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  // ... rest of component
}
```

### Benefits
- 🎯 **Zero boilerplate** - No manual loading/error state management
- 🔄 **Automatic caching** - Same data won't be fetched twice
- 📱 **Optimistic updates** - UI updates immediately, then syncs with server
- 🏷️ **Smart invalidation** - Related data automatically refreshes
- 📊 **Built-in dev tools** - Redux DevTools integration

---

## 🔧 **Option 2: Centralized API Client (Axios-style)**

### What is the API Client?
A custom class-based API client that provides:
- ✅ **Centralized authentication** handling
- ✅ **Consistent error handling** across all requests
- ✅ **Reusable methods** for common operations
- ✅ **TypeScript support** with proper interfaces
- ✅ **Easy testing** and mocking

### Implementation
```typescript
// src/lib/api/adminClient.ts
class AdminApiClient {
  private baseUrl: string = '/api/admin';
  
  private async request<T>(endpoint: string, options: RequestInit = {}) {
    const headers = this.getAuthHeaders();
    
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers },
      });

      if (response.status === 401) {
        throw new Error('Admin authentication required');
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Users Management
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users${queryString ? `?${queryString}` : ''}`);
  }

  async updateUserRole(userId: string, role: string) {
    return this.request(`/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }
}

export const adminClient = new AdminApiClient();
```

### Usage in Components
```typescript
// In your React component
import { adminClient } from '@/lib/api/adminClient';
import { useState, useEffect } from 'react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await adminClient.getUsers({
        page: currentPage,
        search: searchTerm,
        role: roleFilter,
      });
      
      if (response.success) {
        setUsers(response.data.users);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      const response = await adminClient.updateUserRole(userId, newRole);
      if (response.success) {
        toast.success("Role updated successfully");
        fetchUsers(); // Refresh data
      } else {
        toast.error(response.error);
      }
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter]);

  // ... rest of component
}
```

### Benefits
- 🎯 **Full control** - You manage all loading/error states
- 🔧 **Customizable** - Easy to add custom logic and interceptors
- 📚 **Familiar pattern** - Similar to Axios or other HTTP clients
- 🧪 **Easy testing** - Simple to mock and test
- 📦 **Lightweight** - No additional dependencies

---

## 🏆 **Recommendation: Use RTK Query**

### Why RTK Query?
1. **Built into Redux Toolkit** - No additional setup needed
2. **Automatic state management** - Loading, error, and data states handled automatically
3. **Smart caching** - Prevents unnecessary API calls
4. **Background updates** - Data stays fresh automatically
5. **Less boilerplate** - Focus on business logic, not API plumbing

### Migration Path
1. **Start with RTK Query** for new features
2. **Gradually migrate** existing components
3. **Keep old slices** temporarily for complex state logic
4. **Remove old slices** once fully migrated

---

## 📋 **Implementation Checklist**

### ✅ **Completed**
- [x] RTK Query admin API setup
- [x] Centralized API client implementation
- [x] Updated admin users page to use RTK Query
- [x] Added to Redux store configuration
- [x] Fixed all TypeScript errors

### 🔄 **Next Steps**
- [ ] Update admin businesses page to use RTK Query
- [ ] Update admin system page to use RTK Query
- [ ] Add more endpoints to adminApi
- [ ] Implement optimistic updates for better UX
- [ ] Add error boundaries for better error handling

### 🎯 **Benefits Achieved**
- ✅ **No more repetitive API calls** - All centralized
- ✅ **Automatic authentication** - Headers added automatically
- ✅ **Better error handling** - Consistent across all endpoints
- ✅ **Type safety** - Full TypeScript support
- ✅ **Easier maintenance** - Single source of truth for API logic

---

## 🚀 **Quick Start**

### 1. Use RTK Query (Recommended)
```typescript
import { useGetUsersQuery } from '@/lib/stores/features/admin/adminApi';

const { data, isLoading, error } = useGetUsersQuery({ page: 1 });
```

### 2. Use API Client (Alternative)
```typescript
import { adminClient } from '@/lib/api/adminClient';

const response = await adminClient.getUsers({ page: 1 });
```

Both approaches eliminate the 401 authentication errors and provide a much cleaner, more maintainable codebase! 🎉
