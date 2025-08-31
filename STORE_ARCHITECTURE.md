# 🏗️ Store Architecture - Separation of Concerns

## 📋 Overview

This document outlines the new Redux store architecture that properly separates concerns based on user roles and data access patterns. The architecture is designed to be scalable, maintainable, and follows the single responsibility principle.

## 🎯 Architecture Principles

1. **Single Responsibility**: Each slice handles one specific domain
2. **Role-Based Separation**: Different user types have dedicated slices
3. **Public Data Access**: Guest users can access public data without authentication
4. **Shared Core Data**: Common data is shared across all user types
5. **Authentication Isolation**: Auth logic is completely separated by user type

## 🏛️ Store Structure

```
src/lib/stores/
├── index.ts                    # Main store configuration
├── features/
│   ├── auth/                  # User authentication only
│   │   ├── authSlice.ts
│   │   ├── auth.api.ts
│   │   └── auth.types.ts
│   ├── admin/                 # Admin authentication & operations
│   │   ├── adminAuthSlice.ts  # Admin authentication only
│   │   ├── adminOperationsSlice.ts # Admin data operations
│   │   └── admin.api.ts
│   ├── public/                # Public data (guest access)
│   │   └── publicSlice.ts
│   ├── customer/              # Customer operations
│   │   └── customerSlice.ts
│   ├── business-owner/        # Business owner operations
│   │   └── businessOwnerSlice.ts
│   └── core/                  # Shared data (all user types)
│       ├── businessesSlice.ts
│       ├── servicesSlice.ts
│       ├── categoriesSlice.ts
│       ├── bookingsSlice.ts
│       └── promosSlice.ts
```

## 🔐 Authentication Slices

### 1. Auth Slice (`auth`)
- **Purpose**: Regular user authentication only
- **Data**: User profile, authentication tokens
- **Operations**: Login, logout, profile management
- **Access**: Regular customers and business owners

### 2. Admin Auth Slice (`adminAuth`)
- **Purpose**: Administrator authentication only
- **Data**: Admin user profile, admin tokens
- **Operations**: Admin login, logout, profile management
- **Access**: Administrators only

### 3. Admin Operations Slice (`adminOperations`)
- **Purpose**: Admin-specific data management operations
- **Data**: User management, business management, system operations
- **Operations**: User CRUD, business CRUD, role management, business owner assignment
- **Access**: Authenticated administrators only

## 👥 Role-Based Slices

### 4. Public Slice (`public`)
- **Purpose**: Public data accessible to everyone
- **Data**: Business listings, services, categories
- **Operations**: Search, filtering, browsing
- **Access**: Guests, customers, business owners, admins
- **Authentication**: Not required

**Features:**
- Business listings with search and filtering
- Service categories
- Public business information
- Pagination support

### 5. Customer Slice (`customer`)
- **Purpose**: Customer-specific operations
- **Data**: Customer profile, bookings, reviews, favorites
- **Operations**: Booking management, review submission, profile updates
- **Access**: Authenticated customers only

**Features:**
- Profile management
- Booking history and creation
- Review submission
- Favorites management
- Pagination for all data

### 6. Business Owner Slice (`businessOwner`)
- **Purpose**: Business owner operations
- **Data**: Business management, services, bookings, analytics
- **Operations**: Business updates, service management, booking handling
- **Access**: Authenticated business owners only

**Features:**
- Business profile management
- Service creation and management
- Booking status updates
- Analytics and reporting
- Review monitoring

## 🔄 Core Data Slices (Shared)

### 7. Core Slices
These slices provide shared data that can be accessed by all user types:

- **Businesses**: Business information and listings
- **Services**: Service offerings and details
- **Categories**: Service categories and classifications
- **Bookings**: Booking records and status
- **Promos**: Promotional offers and discounts

## 📊 State Persistence Strategy

### Persistence Configuration
```typescript
// Auth data - persisted for session continuity
auth: ['user', 'isAuthenticated']

// Admin data - persisted for admin sessions
admin: ['adminUser', 'isAdminAuthenticated']

// Customer data - persisted for user preferences
customer: ['profile', 'favorites']

// Business owner data - persisted for business context
businessOwner: ['profile', 'currentBusiness']

// Public data - not persisted (always fresh)
public: [] // No persistence needed
```

## 🚀 Usage Examples

### Public Data (Guest Access)
```typescript
// Accessible without authentication
const { businesses, categories } = useAppSelector(state => state.public);
const dispatch = useAppDispatch();

useEffect(() => {
  dispatch(fetchPublicBusinesses({ page: 1 }));
  dispatch(fetchPublicCategories());
}, [dispatch]);
```

### Customer Operations
```typescript
// Only for authenticated customers
const { profile, bookings, favorites } = useAppSelector(state => state.customer);

useEffect(() => {
  if (isAuthenticated) {
    dispatch(fetchCustomerProfile());
    dispatch(fetchCustomerBookings({ page: 1 }));
    dispatch(fetchCustomerFavorites());
  }
}, [isAuthenticated, dispatch]);
```

### Business Owner Operations
```typescript
// Only for authenticated business owners
const { businesses, services, analytics } = useAppSelector(state => state.businessOwner);

useEffect(() => {
  if (isAuthenticated && userRole === 'BUSINESS_OWNER') {
    dispatch(fetchBusinessOwnerBusinesses({ page: 1 }));
    dispatch(fetchBusinessOwnerAnalytics({ businessId: currentBusinessId }));
  }
}, [isAuthenticated, userRole, currentBusinessId, dispatch]);
```

### Admin Operations
```typescript
// Only for authenticated admins
const { adminUser, isAdminAuthenticated } = useAppSelector(state => state.adminAuth);

useEffect(() => {
  if (isAdminAuthenticated) {
    // Admin-specific operations
  }
}, [isAdminAuthenticated]);
```

## 🔒 Security & Access Control

### Route Protection
- **Public Routes**: Accessible to everyone
- **Customer Routes**: Require customer authentication
- **Business Owner Routes**: Require business owner authentication
- **Admin Routes**: Require admin authentication

### Data Isolation
- Each role only accesses its designated slice
- No cross-contamination between user types
- Clear boundaries for data access

## 📈 Benefits of New Architecture

### 1. **Scalability**
- Easy to add new user roles
- Independent scaling of different slices
- Clear separation of concerns

### 2. **Maintainability**
- Single responsibility principle
- Easy to debug and test
- Clear code organization

### 3. **Performance**
- Only re-render components that need specific data
- Efficient state updates
- Optimized persistence

### 4. **Security**
- Role-based access control
- Data isolation
- Clear authentication boundaries

### 5. **Developer Experience**
- Intuitive API design
- Clear data flow
- Easy to understand and modify

## 🔧 Migration Guide

### From Old Architecture
1. **Update imports**: Change from mixed slices to role-specific slices
2. **Update selectors**: Use appropriate slice for each user type
3. **Update dispatches**: Use role-specific actions
4. **Remove mixed logic**: Clean up any remaining mixed concerns

### Example Migration
```typescript
// OLD (Mixed concerns)
const { user, adminUser, businesses } = useAppSelector(state => state.auth);

// NEW (Separated concerns)
const { user } = useAppSelector(state => state.auth);
const { adminUser } = useAppSelector(state => state.adminAuth);
const { businesses } = useAppSelector(state => state.public);
```

## 🎯 Best Practices

### 1. **Always Use Role-Appropriate Slices**
- Customers: Use `customer` slice
- Business Owners: Use `businessOwner` slice
- Admins: Use `adminAuth` slice for auth, `adminOperations` for data
- Public Data: Use `public` slice

### 2. **Avoid Cross-Slice Dependencies**
- Each slice should be independent
- Use shared core slices for common data
- Don't mix authentication logic

### 3. **Proper Error Handling**
- Each slice handles its own errors
- Clear error messages for debugging
- Graceful fallbacks for failed operations

### 4. **Loading States**
- Granular loading states for better UX
- Skeleton loaders during data fetching
- Optimistic updates where appropriate

## 🚀 Future Enhancements

### Planned Features
1. **Real-time Updates**: WebSocket integration for live data
2. **Offline Support**: Enhanced offline capabilities
3. **Advanced Caching**: Smart caching strategies
4. **Performance Monitoring**: Store performance analytics
5. **Developer Tools**: Enhanced Redux DevTools integration

---

This architecture provides a solid foundation for a scalable, maintainable, and secure booking application with clear separation of concerns and role-based access control.
