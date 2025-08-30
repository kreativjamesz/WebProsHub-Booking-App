# Database Setup for MySQL with Prisma

This guide will help you set up a MySQL database for your booking application using Prisma ORM.

## Prerequisites

- Node.js and npm installed
- MySQL server running (local or cloud)
- Prisma CLI installed globally: `npm install -g prisma`

## 1. Environment Configuration

Create a `.env` file in your project root with the following content:

```env
DATABASE_URL="mysql://username:password@localhost:3306/your_database_name"
```

### Database Options:

#### Option A: Local MySQL
```env
DATABASE_URL="mysql://root:your_password@localhost:3306/booking_app"
```

#### Option B: PlanetScale (MySQL-compatible)
```env
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/your_database_name?sslaccept=strict"
```

#### Option C: Railway MySQL
```env
DATABASE_URL="mysql://username:password@containers-us-west-XX.railway.app:XXXX/railway"
```

#### Option D: Supabase (PostgreSQL - if you prefer to stick with PostgreSQL)
```env
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
```

## 2. Database Setup

### For Local MySQL:
1. Install MySQL Server
2. Create a database: `CREATE DATABASE booking_app;`
3. Create a user: `CREATE USER 'booking_user'@'localhost' IDENTIFIED BY 'your_password';`
4. Grant privileges: `GRANT ALL PRIVILEGES ON booking_app.* TO 'booking_user'@'localhost';`

### For Cloud MySQL:
Follow your provider's documentation to create a MySQL database and get the connection string.

## 3. Prisma Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

3. **Run database migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Push schema to database (alternative to migrations):**
   ```bash
   npx prisma db push
   ```

## 4. Seed the Database

Run the seeding script to populate your database with sample data:

```bash
npm run seed
```

Or manually run:
```bash
node -e "import('./src/lib/seed-data.js').then(m => m.seedDatabase())"
```

## 5. API Endpoints

Your application now uses the following API endpoints:

### Database Operations
- `POST /api/database` - Create, read, update, delete operations
- `GET /api/database` - List operations

### Actions Available:
- `action: "create"` - Create new records
- `action: "list"` - List records with optional filters
- `action: "get"` - Get single record by ID
- `action: "update"` - Update existing records
- `action: "delete" - Delete records
- `action: "clear"` - Clear entire collections

### Models Supported:
- `User` - User accounts and authentication
- `Business` - Business listings
- `Service` - Services offered by businesses
- `Category` - Service categories
- `Booking` - User bookings
- `Promo` - Promotional offers

## 6. Database Schema

The application includes the following models:
- **User**: email, name, role, timestamps
- **Business**: name, description, address, contact info, category
- **Service**: name, description, price, duration
- **Category**: name, description
- **Booking**: date, time, status, user/business/service relations
- **Promo**: title, description, discount, validity

## 7. Troubleshooting

### Common Issues:

1. **Connection refused**: Check if MySQL server is running
2. **Authentication failed**: Verify username/password in DATABASE_URL
3. **Database doesn't exist**: Create the database first
4. **Prisma client not generated**: Run `npx prisma generate`

### Reset Database:
```bash
npx prisma migrate reset
```

### View Database:
```bash
npx prisma studio
```

## 8. Development Workflow

1. Make changes to `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description`
3. Test your changes
4. Commit both schema and migration files

## 9. Production Deployment

For production:
1. Use a managed MySQL service (PlanetScale, Railway, etc.)
2. Set `NODE_ENV=production` in your environment
3. Run `npx prisma migrate deploy` to apply migrations
4. Ensure your database connection string is secure

## 10. Next Steps

- Test the API endpoints
- Customize the data models as needed
- Add more business logic to the API routes
- Implement proper authentication and authorization
- Add data validation and error handling
