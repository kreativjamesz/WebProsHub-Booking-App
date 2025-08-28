import { databases, DATABASE_ID, COLLECTIONS, storage, BUCKETS } from './appwrite';
import { ID } from 'appwrite';
import { SeedingResult, ClearDatabaseResult } from './types/test-connection';

// Sample data generators
const generateFakeData = () => {
  const categories = [
    { name: 'Beauty & Wellness', description: 'Hair salons, spas, nail services' },
    { name: 'Home Services', description: 'Cleaning, repairs, maintenance' },
    { name: 'Fitness & Health', description: 'Personal training, yoga, nutrition' },
    { name: 'Education', description: 'Tutoring, language classes, workshops' },
    { name: 'Technology', description: 'IT support, web development, consulting' },
    { name: 'Automotive', description: 'Car wash, repairs, detailing' },
    { name: 'Food & Catering', description: 'Catering, meal prep, cooking classes' },
    { name: 'Events & Entertainment', description: 'Party planning, DJ services, photography' }
  ];

  const businesses = [
    {
      name: 'Glamour Salon & Spa',
      description: 'Premium beauty services for all occasions',
      address: '123 Main Street, Downtown',
      phone: '+1-555-0123',
      email: 'info@glamoursalon.com',
      categoryId: '', // Will be set after categories are created
      ownerId: '', // Will be set after users are created
      isActive: true,
      rating: 4.8,
      reviewCount: 127
    },
    {
      name: 'TechPro Solutions',
      description: 'Professional IT consulting and support services',
      address: '456 Tech Avenue, Business District',
      phone: '+1-555-0456',
      email: 'hello@techpro.com',
      categoryId: '',
      ownerId: '',
      isActive: true,
      rating: 4.9,
      reviewCount: 89
    },
    {
      name: 'FitLife Studio',
      description: 'Personal training and group fitness classes',
      address: '789 Fitness Blvd, Health Center',
      phone: '+1-555-0789',
      email: 'train@fitlife.com',
      categoryId: '',
      ownerId: '',
      isActive: true,
      rating: 4.7,
      reviewCount: 156
    }
  ];

  const services = [
    {
      name: 'Haircut & Styling',
      description: 'Professional haircut and styling service',
      price: 45.00,
      duration: 60,
      businessId: '',
      categoryId: ''
    },
    {
      name: 'Deep Tissue Massage',
      description: 'Relaxing therapeutic massage',
      price: 80.00,
      duration: 90,
      businessId: '',
      categoryId: ''
    },
    {
      name: 'IT Consultation',
      description: 'Technology strategy and planning',
      price: 120.00,
      duration: 120,
      businessId: '',
      categoryId: ''
    },
    {
      name: 'Personal Training Session',
      description: 'One-on-one fitness training',
      price: 65.00,
      duration: 60,
      businessId: '',
      categoryId: ''
    }
  ];

  const promos = [
    {
      title: 'New Customer Special',
      description: '20% off your first service',
      discount: 20,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      businessId: '',
      isActive: true
    },
    {
      title: 'Weekend Discount',
      description: '15% off all weekend bookings',
      discount: 15,
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      businessId: '',
      isActive: true
    }
  ];

  return { categories, businesses, services, promos };
};

export async function seedDatabase(): Promise<SeedingResult> {
  try {
    console.log('🌱 Starting database seeding...');
    
    const { categories, businesses, services, promos } = generateFakeData();
    
    // 1. Create Categories
    console.log('📂 Creating categories...');
    const createdCategories = [];
    for (const category of categories) {
      const created = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.CATEGORIES,
        ID.unique(),
        {
          ...category,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );
      createdCategories.push(created);
      console.log(`✅ Created category: ${category.name}`);
    }

    // 2. Create Businesses
    console.log('🏢 Creating businesses...');
    const createdBusinesses = [];
    for (const business of businesses) {
      const category = createdCategories.find(c => 
        c.name === (business.name.includes('Salon') ? 'Beauty & Wellness' : 
                   business.name.includes('Tech') ? 'Technology' : 'Fitness & Health')
      );
      
      const created = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.BUSINESSES,
        ID.unique(),
        {
          ...business,
          categoryId: category?.$id || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );
      createdBusinesses.push(created);
      console.log(`✅ Created business: ${business.name}`);
    }

    // 3. Create Services
    console.log('🛠️ Creating services...');
    for (const service of services) {
      const business = createdBusinesses.find(b => 
        service.name.includes('Hair') ? b.name.includes('Salon') :
        service.name.includes('Massage') ? b.name.includes('Salon') :
        service.name.includes('IT') ? b.name.includes('Tech') :
        service.name.includes('Training') ? b.name.includes('Fit') : false
      );
      
      const category = createdCategories.find(c => 
        service.name.includes('Hair') || service.name.includes('Massage') ? c.name === 'Beauty & Wellness' :
        service.name.includes('IT') ? c.name === 'Technology' :
        service.name.includes('Training') ? c.name === 'Fitness & Health' : false
      );

      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.SERVICES,
        ID.unique(),
        {
          ...service,
          businessId: business?.$id || '',
          categoryId: category?.$id || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );
      console.log(`✅ Created service: ${service.name}`);
    }

    // 4. Create Promos
    console.log('🎉 Creating promotions...');
    for (const promo of promos) {
      const business = createdBusinesses[Math.floor(Math.random() * createdBusinesses.length)];
      
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.PROMOS,
        ID.unique(),
        {
          ...promo,
          businessId: business?.$id || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );
      console.log(`✅ Created promo: ${promo.title}`);
    }

    console.log('🎊 Database seeding completed successfully!');
    return { success: true, categories: createdCategories, businesses: createdBusinesses };
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    return { success: false, error };
  }
}

export async function clearDatabase(): Promise<ClearDatabaseResult> {
  try {
    console.log('🧹 Clearing database...');
    
    // Clear all collections (be careful with this in production!)
    const collections = [COLLECTIONS.PROMOS, COLLECTIONS.SERVICES, COLLECTIONS.BUSINESSES, COLLECTIONS.CATEGORIES];
    
    for (const collection of collections) {
      const documents = await databases.listDocuments(DATABASE_ID, collection);
      for (const doc of documents.documents) {
        await databases.deleteDocument(DATABASE_ID, collection, doc.$id);
      }
      console.log(`🗑️ Cleared collection: ${collection}`);
    }
    
    console.log('✅ Database cleared successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Database clearing failed:', error);
    return { success: false, error };
  }
}
