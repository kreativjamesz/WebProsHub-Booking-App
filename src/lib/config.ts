export const config = {
  database: {
    url: process.env.DATABASE_URL || 'mysql://username:password@localhost:3366/my_booking_app',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-long-and-random',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  adminJwt: {
    secret: process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-long-and-random',
    expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '7d',
  },
  nextauth: {
    secret: process.env.NEXTAUTH_SECRET || 'your-nextauth-secret-key-here',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
  app: {
    name: process.env.APP_NAME || 'My Booking App',
    url: process.env.APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
  },
  // Optional: External services
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
} as const;

export type Config = typeof config;
