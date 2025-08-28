# Marketplace Booking App

A fully-featured marketplace application for booking services from local businesses, built with Next.js, TypeScript, Redux Toolkit, and Appwrite.

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
- Secure authentication with Appwrite
- Protected routes and API endpoints
- Input validation and sanitization
- Secure data handling

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **State Management**: Redux Toolkit, React Redux
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Appwrite (Backend-as-a-Service)
- **Authentication**: Appwrite Auth
- **Database**: Appwrite Database
- **Storage**: Appwrite Storage
- **Forms**: React Hook Form with Zod validation

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Appwrite account and project

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

### 3. Appwrite Setup

1. Create an Appwrite account at [appwrite.io](https://appwrite.io)
2. Create a new project
3. Get your project ID and endpoint URL
4. Create the following collections in your Appwrite database:

#### Collections Structure

**Users Collection**
- `$id` (auto-generated)
- `email` (string, required, unique)
- `name` (string, required)
- `role` (string, required, enum: customer, business_owner, admin)
- `avatar` (string, optional)
- `phone` (string, optional)
- `address` (string, optional)
- `createdAt` (string, required)
- `updatedAt` (string, required)

**Businesses Collection**
- `$id` (auto-generated)
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
- `createdAt` (string, required)
- `updatedAt` (string, required)

**Categories Collection**
- `$id` (auto-generated)
- `name` (string, required)
- `description` (string, required)
- `icon` (string, required)
- `color` (string, required)
- `isActive` (boolean, required)
- `createdAt` (string, required)
- `updatedAt` (string, required)

**Services Collection**
- `$id` (auto-generated)
- `name` (string, required)
- `description` (string, required)
- `price` (number, required)
- `duration` (number, required)
- `businessId` (string, required)
- `categoryId` (string, required)
- `image` (string, optional)
- `isActive` (boolean, required)
- `createdAt` (string, required)
- `updatedAt` (string, required)

**Bookings Collection**
- `$id` (auto-generated)
- `customerId` (string, required)
- `businessId` (string, required)
- `serviceId` (string, required)
- `scheduledDate` (string, required)
- `scheduledTime` (string, required)
- `status` (string, required, enum: pending, confirmed, completed, cancelled)
- `totalPrice` (number, required)
- `notes` (string, optional)
- `createdAt` (string, required)
- `updatedAt` (string, required)

**Promos Collection**
- `$id` (auto-generated)
- `title` (string, required)
- `description` (string, required)
- `discountPercentage` (number, required)
- `businessId` (string, required)
- `startDate` (string, required)
- `endDate` (string, required)
- `isActive` (boolean, required)
- `createdAt` (string, required)
- `updatedAt` (string, required)

**Reviews Collection**
- `$id` (auto-generated)
- `customerId` (string, required)
- `businessId` (string, required)
- `rating` (number, required)
- `comment` (string, required)
- `createdAt` (string, required)
- `updatedAt` (string, required)

### 4. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
```

### 5. Update Appwrite Configuration

Edit `src/lib/appwrite.ts` and replace the placeholder values:

```typescript
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
```

### 6. Create Storage Buckets

Create the following storage buckets in Appwrite:
- `business-logos` - for business logo images
- `service-images` - for service images
- `user-avatars` - for user profile pictures

### 7. Set Up Permissions

Configure appropriate permissions for each collection:
- Users can read their own data
- Business owners can read/write their business data
- Admins have full access to all collections
- Public read access for businesses, services, and categories

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
│   └── businesses/        # Business listing and search
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions and configurations
│   ├── stores/           # Redux store and slices
│   ├── appwrite.ts       # Appwrite client configuration
│   ├── hooks.ts          # Custom React hooks
│   └── types.ts          # TypeScript type definitions
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

- **Authentication**: Secure user authentication with Appwrite
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
