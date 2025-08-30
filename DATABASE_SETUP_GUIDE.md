# Database Setup Guide for My Booking App

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in your project root and copy the variables from `ENVIRONMENT_VARIABLES.txt`:

```bash
# Copy the environment variables
cp ENVIRONMENT_VARIABLES.txt .env
# Then edit .env with your actual values
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Create and run migrations
npm run db:migrate

# Seed with medium dataset (recommended for development)
npm run db:seed
```

## 📊 Seeding Options

### Small Dataset (Development)
```bash
npm run seed:small
# Generates: 5 categories, 8 businesses, 25 services, 12 promos, 15 users
```

### Medium Dataset (Recommended)
```bash
npm run seed:medium
# Generates: 8 categories, 15 businesses, 50 services, 25 promos, 30 users
```

### Large Dataset (Testing)
```bash
npm run seed:large
# Generates: 12 categories, 25 businesses, 100 services, 50 promos, 50 users
```

### Custom Dataset
```bash
# Edit src/lib/seed-data.ts and call seedCustomDataset with your counts
npm run seed
```

## 🔄 Database Management

### Reset Everything
```bash
# Reset migrations and seed fresh data
npm run db:reset
```

### View Database
```bash
# Open Prisma Studio to view/edit data
npm run db:studio
```

### Manual Operations
```bash
# Generate Prisma client
npm run db:generate

# Push schema changes (for development)
npm run db:push

# Create new migration
npm run db:migrate

# Deploy migrations (for production)
npm run db:migrate:deploy
```

## 🌱 What Gets Generated

### Categories
- Business service categories (Beauty, Tech, Fitness, etc.)
- Each with unique icons, colors, and descriptions

### Users
- Mix of customers, business owners, and admins
- Realistic names and emails using Faker

### Businesses
- Company names, addresses, contact info
- Random ratings and review counts
- Assigned to random categories and owners

### Services
- Product names and descriptions
- Realistic pricing ($10-$500)
- Duration options (30min to 3 hours)
- Assigned to random businesses and categories

### Promotions
- Discount offers with percentages
- Valid date ranges
- Assigned to random businesses

## ⚙️ Customization

### Modify Data Generation
Edit `src/lib/seed-data.ts` to:
- Change default counts
- Modify data patterns
- Add new data types
- Adjust Faker settings

### Change Seed Values
```typescript
// In generateFakeData function
faker.seed(123); // Change this number for different data
```

### Add New Fields
Update the Prisma schema and regenerate:
```bash
npm run db:generate
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your `.env` file
   - Verify database is running
   - Test connection with `npm run db:studio`

2. **Migration Errors**
   - Reset with `npm run db:reset`
   - Check schema for syntax errors
   - Verify database permissions

3. **Seeding Fails**
   - Clear database first: `npm run db:reset`
   - Check console for specific errors
   - Verify all required fields are present

### Reset Everything
```bash
# Nuclear option - clears everything
npm run db:reset
```

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@localhost:3306/db` |
| `JWT_SECRET` | Secret for JWT tokens | `your-super-secret-key-here` |
| `NEXTAUTH_SECRET` | NextAuth secret | `your-nextauth-secret` |
| `NODE_ENV` | Environment mode | `development` |

## 🎯 Next Steps

After setup:
1. Test the app with `npm run dev`
2. Visit `/admin` to see admin panel
3. Check `/businesses` for business listings
4. Use Prisma Studio to explore data

## 🔗 Useful Links

- [Prisma Documentation](https://www.prisma.io/docs)
- [Faker.js Documentation](https://fakerjs.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
