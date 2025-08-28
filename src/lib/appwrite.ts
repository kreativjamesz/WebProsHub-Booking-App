import { Client, Account, Databases, Storage, Functions } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6553b5a05f4a98cf5ca5');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Database IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6553cd62446e35aed1e6';

// Collection IDs
export const COLLECTIONS = {
    USERS: 'users',
    BUSINESSES: 'businesses',
    SERVICES: 'services',
    CATEGORIES: 'categories',
    BOOKINGS: 'bookings',
    PROMOS: 'promos',
    REVIEWS: 'reviews'
} as const;

// Bucket IDs
export const BUCKETS = {
    BUSINESS_LOGOS: 'business-logos',
    SERVICE_IMAGES: 'service-images',
    USER_AVATARS: 'user-avatars'
} as const;

export default client;
