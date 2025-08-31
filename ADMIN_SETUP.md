# 🔐 Admin System Setup Guide

## Overview
This guide explains how to set up and use the separate admin system for BookMyService, which provides enhanced security and management capabilities.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

### 2. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push the schema to your database
npm run db:push
```

### 3. Seed Admin Users
```bash
npm run seed:admin
```

## 🔑 Admin Login Credentials

After running the seeder, you'll have these admin accounts:

### Super Administrator
- **Email**: `superadmin@bookmyservice.com`
- **Password**: `!SuperAdmin123`
- **Role**: `SUPER_ADMIN`
- **Access**: Full system access

### System Administrator
- **Email**: `admin@bookmyservice.com`
- **Password**: `!Admin123`
- **Role**: `ADMIN`
- **Access**: Standard admin operations

### Content Moderator
- **Email**: `moderator@bookmyservice.com`
- **Password**: `!Moderator123`
- **Role**: `MODERATOR`
- **Access**: Content and business moderation

### Customer Support
- **Email**: `support@bookmyservice.com`
- **Password**: `!Support123`
- **Role**: `SUPPORT`
- **Access**: User management only

## 🌐 Access Points

### Admin Login
- **URL**: `/admin-login`
- **Purpose**: Secure admin authentication
- **Features**: Role-based access control

### Admin Dashboard
- **URL**: `/admin`
- **Purpose**: Main admin interface
- **Access**: Requires admin authentication

## 🛡️ Security Features

### Enhanced Authentication
- **Separate admin login** from regular user auth
- **Role-based permissions** system
- **Audit logging** for all admin actions
- **Session management** with IP tracking

### Admin Roles & Permissions

#### SUPER_ADMIN
- Full system access
- User management
- Business management
- System settings
- Data export
- Audit logs
- Payment management
- Content moderation
- Analytics access
- API access
- Backup/restore

#### ADMIN
- User management
- Business management
- Content moderation
- Analytics access
- Audit logs

#### MODERATOR
- Content moderation
- Business management

#### SUPPORT
- User management only

## 📊 Database Schema

### Admin Users Table
```sql
admin_users
├── id (String, Primary Key)
├── email (String, Unique)
├── name (String)
├── password (String, Hashed)
├── role (AdminRole)
├── twoFactorEnabled (Boolean)
├── twoFactorSecret (String?)
├── lastLoginAt (DateTime?)
├── loginAttempts (Int)
├── lockedUntil (DateTime?)
├── department (String?)
├── employeeId (String, Unique)
├── isActive (Boolean)
├── permissions (AdminPermission[])
├── createdAt (DateTime)
├── updatedAt (DateTime)
├── createdBy (String?)
└── updatedBy (String?)
```

### Audit Logs Table
```sql
admin_audit_logs
├── id (String, Primary Key)
├── adminId (String, Foreign Key)
├── action (String)
├── resource (String)
├── resourceId (String?)
├── details (JSON?)
├── ipAddress (String?)
├── userAgent (String?)
└── timestamp (DateTime)
```

### Admin Sessions Table
```sql
admin_sessions
├── id (String, Primary Key)
├── adminId (String, Foreign Key)
├── token (String, Unique)
├── expiresAt (DateTime)
├── isActive (Boolean)
├── ipAddress (String?)
├── userAgent (String?)
└── createdAt (DateTime)
```

## 🚨 Security Best Practices

### Password Policy
- **Minimum length**: 12 characters
- **Required**: Uppercase, lowercase, numbers, special characters
- **Example**: `!SuperAdmin123`

### Access Control
- **Role-based permissions** for all operations
- **Audit logging** for accountability
- **Session management** with expiration
- **IP tracking** for security monitoring

### Two-Factor Authentication
- **Optional 2FA** for enhanced security
- **TOTP support** for authenticator apps
- **Backup codes** for account recovery

## 🔧 Development

### Adding New Admin Users
```typescript
import { seedAdminUsers } from '@/lib/admin-seed-data';

// Add to your seeding process
await seedAdminUsers();
```

### Customizing Permissions
```typescript
// In admin-seed-data.ts
const customAdmin = {
  email: 'custom@example.com',
  name: 'Custom Admin',
  password: '!CustomPass123',
  role: 'ADMIN',
  permissions: ['USER_MANAGEMENT', 'BUSINESS_MANAGEMENT']
};
```

### API Integration
```typescript
// Check admin permissions
const hasPermission = adminUser.permissions.includes('USER_MANAGEMENT');

// Log admin actions
await logAdminAction(adminId, 'USER_DELETE', 'users', userId);
```

## 🚀 Deployment

### Environment Variables
```env
# Admin-specific settings
ADMIN_SESSION_SECRET=your-admin-session-secret
ADMIN_TOKEN_EXPIRY=24h
ADMIN_MAX_LOGIN_ATTEMPTS=5
ADMIN_LOCKOUT_DURATION=15m
```

### Database Migration
```bash
# Generate migration
npx prisma migrate dev --name add-admin-tables

# Deploy to production
npx prisma migrate deploy
```

## 📝 Troubleshooting

### Common Issues

#### Admin Login Fails
- Check if admin users exist in database
- Verify password hashing is working
- Check role permissions

#### Permission Denied
- Verify admin user has required permissions
- Check if admin account is active
- Review role assignments

#### Database Errors
- Ensure Prisma schema is up to date
- Check database connection
- Verify table structure

### Debug Commands
```bash
# Check admin users
npx prisma studio

# Reset admin data
npm run seed:admin

# Check database status
npx prisma db pull
```

## 🔗 Related Files

- `src/app/admin-login/page.tsx` - Admin login page
- `src/lib/admin-seed-data.ts` - Admin user seeder
- `prisma/admin-users-schema.prisma` - Admin database schema
- `src/app/admin/page.tsx` - Admin dashboard

## 📞 Support

For admin system issues:
1. Check this documentation
2. Review audit logs for errors
3. Verify database schema
4. Check admin user permissions

---

**⚠️ Security Note**: Always change default passwords in production and use strong, unique passwords for each admin account.
