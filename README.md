# Marketplace Booking App

A fully-featured marketplace application for booking services from local businesses, built with Next.js, TypeScript, Redux Toolkit, and MySQL with Prisma ORM.

## Features

### 🏠 **Customer Features**
- Browse and search local businesses
- View business details, services, and reviews
- Book appointments with businesses
- View booking history and status
- Browse promotions and special offers
- User authentication and profile management

### 🏢 **Business Owner Features**
- Business dashboard with analytics
- Manage services (add, edit, delete)
- Handle customer bookings
- Create and manage promotions
- View business performance metrics
- Update business information

### 👑 **Admin Features**
- Full system administration
- User management and role assignment
- Business approval and management
- Assign business owners to businesses
- System monitoring and statistics
- Content moderation

### 🔐 **Security Features**
- Role-based access control (RBAC)
- Secure authentication system
- Protected routes and API endpoints
- Input validation and sanitization
- Secure data handling

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **State Management**: Redux Toolkit, React Redux
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **Authentication**: Custom authentication system
- **Forms**: React Hook Form with Zod validation

## Prerequisites

- Node.js 18+ 
- npm or yarn
- MySQL database (local or cloud)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd my-booking-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Option A: Local MySQL
1. Install MySQL Server
2. Create a database: `CREATE DATABASE booking_app;`
3. Create a user: `CREATE USER 'booking_user'@'localhost' IDENTIFIED BY 'your_password';`
4. Grant privileges: `GRANT ALL PRIVILEGES ON booking_app.* TO 'booking_user'@'localhost';`

#### Option B: Cloud MySQL Services
- **PlanetScale**: MySQL-compatible database service
- **Railway**: Easy MySQL deployment
- **Supabase**: PostgreSQL option (if you prefer)

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/booking_app"

# Next.js Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

### 5. Database Schema Setup

The application uses Prisma with the following models:

#### Database Models

**User Model**
- `id` (auto-generated)
- `email` (string, required, unique)
- `name` (string, required)
- `role` (enum: CUSTOMER, BUSINESS_OWNER, ADMIN)
- `createdAt` (DateTime, required)
- `updatedAt` (DateTime, required)

**Business Model**
- `id` (auto-generated)
- `name` (string, required)
- `description` (string, required)
- `logo` (string, optional)
- `coverImage` (string, optional)
- `address` (string, required)
- `city` (string, required)
- `state` (string, required)
- `zipCode` (string, required)
- `phone` (string, required)
- `email` (string, required)
- `website` (string, optional)
- `categoryId` (string, required)
- `ownerId` (string, required)
- `isActive` (boolean, required)
- `rating` (number, required)
- `reviewCount` (number, required)
- `createdAt` (DateTime, required)
- `updatedAt` (DateTime, required)

**Category Model**
- `id` (auto-generated)
- `name` (string, required)
- `description` (string, required)
- `icon` (string, required)
- `color` (string, required)
- `isActive` (boolean, required)
- `createdAt` (DateTime, required)
- `updatedAt` (DateTime, required)

**Service Model**
- `id` (auto-generated)
- `name` (string, required)
- `description` (string, required)
- `price` (Decimal, required)
- `duration` (number, required, in minutes)
- `businessId` (string, required)
- `categoryId` (string, required)
- `image` (string, optional)
- `isActive` (boolean, required)
- `createdAt` (DateTime, required)
- `updatedAt` (DateTime, required)

**Booking Model**
- `id` (auto-generated)
- `date` (DateTime, required)
- `time` (string, required)
- `status` (enum: PENDING, CONFIRMED, CANCELLED, COMPLETED)
- `notes` (string, optional)
- `userId` (string, required)
- `businessId` (string, required)
- `serviceId` (string, required)
- `createdAt` (DateTime, required)
- `updatedAt` (DateTime, required)

**Promo Model**
- `id` (auto-generated)
- `title` (string, required)
- `description` (string, required)
- `discountPercentage` (number, required)
- `businessId` (string, required)
- `startDate` (DateTime, required)
- `endDate` (DateTime, required)
- `isActive` (boolean, required)
- `createdAt` (DateTime, required)
- `updatedAt` (DateTime, required)

### 6. Database Initialization

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

### 7. Seed the Database

```bash
# Seed with sample data
npm run seed

# Or manually run
node -e "import('./src/lib/seed-data.js').then(m => m.seedDatabase())"
```

### 8. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Authentication pages
│   ├── business/          # Business dashboard
│   ├── businesses/        # Business listing and search
│   └── api/               # API routes
│       └── database/      # Database API endpoints
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions and configurations
│   ├── stores/           # Redux store and slices
│   ├── types/            # TypeScript type definitions
│   ├── database.ts       # Prisma client configuration
│   ├── hooks.ts          # Custom React hooks
│   └── seed-data.ts      # Database seeding functions
├── prisma/               # Database schema and migrations
│   └── schema.prisma     # Prisma schema definition
```

## API Endpoints

### Database Operations
- `POST /api/database` - Create, read, update, delete operations
- `GET /api/database` - List operations

### Available Actions:
- `action: "create"` - Create new records
- `action: "list"` - List records with optional filters
- `action: "get"` - Get single record by ID
- `action: "update"` - Update existing records
- `action: "delete"` - Delete records
- `action: "clear"` - Clear entire collections

### Supported Models:
- `User` - User accounts and authentication
- `Business` - Business listings
- `Service` - Services offered by businesses
- `Category` - Service categories
- `Booking` - User bookings
- `Promo` - Promotional offers

## Database Management Scripts

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Seed database
npm run seed
```

## Usage

### For Customers
1. Register an account or sign in
2. Browse businesses by category or search
3. View business details and services
4. Book appointments
5. Track booking status

### For Business Owners
1. Register as a business owner
2. Create and manage business profile
3. Add services and set pricing
4. Handle customer bookings
5. Create promotions

### For Admins
1. Access admin panel
2. Manage users and businesses
3. Assign business owners
4. Monitor system activity

## Security Features

- **Authentication**: Custom authentication system
- **Authorization**: Role-based access control
- **Input Validation**: Form validation with Zod
- **Data Protection**: Secure API endpoints and data handling
- **Session Management**: Persistent authentication with Redux Persist

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.

## Roadmap

- [ ] Mobile app development
- [ ] Payment integration
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Advanced search filters
- [ ] Review and rating system
- [ ] Business verification system
- [ ] Real-time notifications
- [ ] Advanced reporting dashboard
