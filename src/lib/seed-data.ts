import { prisma } from "./database";
import { Category, Business, Service, Promo, User } from "@/lib/types";
import { faker } from "@faker-js/faker";

// Sample data generators with Faker
const generateFakeData = (
  counts: {
    categories?: number;
    businesses?: number;
    services?: number;
    promos?: number;
    users?: number;
  } = {}
) => {
  // Set seed for consistent data generation
  faker.seed(123);

  const categoryNames = [
    "Beauty & Wellness",
    "Home Services",
    "Fitness & Health",
    "Education",
    "Technology",
    "Automotive",
    "Food & Catering",
    "Events & Entertainment",
    "Healthcare",
    "Legal Services",
    "Financial Services",
    "Real Estate",
    "Transportation",
    "Pet Services",
    "Art & Design",
    "Sports & Recreation",
  ];

  const icons = [
    "💄",
    "🏠",
    "💪",
    "📚",
    "💻",
    "🚗",
    "🍽️",
    "🎉",
    "🏥",
    "⚖️",
    "💰",
    "🏢",
    "🚌",
    "🐾",
    "🎨",
    "⚽",
  ];
  const colors = [
    "#FF69B4",
    "#32CD32",
    "#FF4500",
    "#4169E1",
    "#00CED1",
    "#FF8C00",
    "#8B4513",
    "#9370DB",
    "#20B2AA",
    "#FF6347",
    "#FFD700",
    "#8A2BE2",
    "#FF1493",
    "#00FA9A",
    "#FF69B4",
    "#32CD32",
  ];

  // Generate categories
  const categories: Omit<Category, "id">[] = Array.from(
    { length: counts.categories || 8 },
    (_, i) => ({
      name: categoryNames[i] || faker.commerce.department(),
      description: faker.lorem.sentence(),
      icon:
        icons[i] || faker.helpers.arrayElement(["🌟", "✨", "🔥", "💎", "🎯"]),
      color: colors[i] || faker.internet.color(),
      isActive: faker.datatype.boolean(0.9), // 90% chance of being active
      createdAt: faker.date.past({ years: 2 }),
      updatedAt: faker.date.recent({ days: 30 }),
    })
  );

  // Generate users (including business owners)
  const users: Omit<User, "id">[] = Array.from(
    { length: counts.users || 20 },
    () => ({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: "!Password123", // Default password for seeded users
      role: faker.helpers.arrayElement(["CUSTOMER", "BUSINESS_OWNER"]),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 7 }),
    })
  );

  // Generate businesses
  const businesses: Omit<Business, "id">[] = Array.from(
    { length: counts.businesses || 15 },
    () => ({
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      logo: `https://picsum.photos/200/200?random=${faker.number.int({
        min: 1,
        max: 1000,
      })}`,
      coverImage: `https://picsum.photos/800/400?random=${faker.number.int({
        min: 1,
        max: 1000,
      })}`,
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode(),
      phone: faker.phone.number({ style: "international" }),
      email: faker.internet.email(),
      website: faker.internet.url(),
      categoryId: "", // Will be set after categories are created
      ownerId: "", // Will be set after users are created
      isActive: faker.datatype.boolean(0.85), // 85% chance of being active
      rating: faker.number.float({ min: 3.0, max: 5.0, fractionDigits: 1 }),
      reviewCount: faker.number.int({ min: 0, max: 500 }),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ refDate: new Date().toString() }),
    })
  );

  // Generate services
  const services: Omit<Service, "id">[] = Array.from(
    { length: counts.services || 50 },
    () => ({
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      price: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
      duration: faker.helpers.arrayElement([30, 45, 60, 90, 120, 180]), // in minutes
      businessId: "", // Will be set after businesses are created
      categoryId: "", // Will be set after categories are created
      image: `https://picsum.photos/400/300?random=${faker.number.int({
        min: 1,
        max: 1000,
      })}`,
      isActive: faker.datatype.boolean(0.9), // 90% chance of being active
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ refDate: new Date().toString() }),
    })
  );

  // Generate promos
  const promos: Omit<Promo, "id">[] = Array.from(
    { length: counts.promos || 25 },
    () => ({
      title:
        faker.commerce.productAdjective() + " " + faker.commerce.productName(),
      description: faker.lorem.sentence(),
      discountPercentage: faker.helpers.arrayElement([
        5, 10, 15, 20, 25, 30, 40, 50,
      ]),
      businessId: "", // Will be set after businesses are created
      startDate: faker.date.recent({ refDate: new Date().toString() }),
      endDate: faker.date.soon({ days: 90 }),
      isActive: faker.datatype.boolean(0.8), // 80% chance of being active
      createdAt: faker.date.past({ refDate: new Date().toString() }),
      updatedAt: faker.date.recent({ refDate: new Date().toString() }),
    })
  );

  return { categories, businesses, services, promos, users };
};

interface SeedingResult {
  success: boolean;
  categories?: Category[];
  businesses?: Business[];
  error?: unknown;
}

export async function seedDatabase(counts?: {
  categories?: number;
  businesses?: number;
  services?: number;
  promos?: number;
  users?: number;
}): Promise<SeedingResult> {
  try {
    console.log("🌱 Starting database seeding...");
    console.log(
      `📊 Generating: ${counts?.categories || 8} categories, ${
        counts?.businesses || 15
      } businesses, ${counts?.services || 50} services, ${
        counts?.promos || 25
      } promos, ${counts?.users || 20} users`
    );

    const { categories, businesses, services, promos, users } =
      generateFakeData(counts);

    // 1. Create Users first (including business owners)
    console.log("👥 Creating users...");
    const createdUsers: User[] = [];
    for (const user of users) {
      const created = await prisma.user.create({
        data: user,
      });
      createdUsers.push(created as User);
      console.log(`✅ Created user: ${created.name} (${created.role})`);
    }

    // 2. Create Categories
    console.log("📂 Creating categories...");
    const createdCategories: Category[] = [];
    for (const category of categories) {
      const created = await prisma.category.create({
        data: category,
      });
      createdCategories.push(created);
      console.log(`✅ Created category: ${category.name}`);
    }

    // 3. Create Businesses (assign random category and owner)
    console.log("🏢 Creating businesses...");
    const createdBusinesses: Business[] = [];
    for (const business of businesses) {
      const randomCategory = faker.helpers.arrayElement(createdCategories);
      const businessOwner = faker.helpers.arrayElement(
        createdUsers.filter((u) => u.role === "BUSINESS_OWNER")
      );

      const created = await prisma.business.create({
        data: {
          ...business,
          categoryId: randomCategory.id,
          ownerId: businessOwner.id,
        },
      });
      createdBusinesses.push(created as Business);
      console.log(
        `✅ Created business: ${business.name} (${randomCategory.name})`
      );
    }

    // 4. Create Services (assign random business and category)
    console.log("🛠️ Creating services...");
    for (const service of services) {
      const randomBusiness = faker.helpers.arrayElement(createdBusinesses);
      const randomCategory = faker.helpers.arrayElement(createdCategories);

      await prisma.service.create({
        data: {
          ...service,
          businessId: randomBusiness.id,
          categoryId: randomCategory.id,
        },
      });
      console.log(
        `✅ Created service: ${service.name} for ${randomBusiness.name}`
      );
    }

    // 5. Create Promos (assign random business)
    console.log("🎉 Creating promotions...");
    for (const promo of promos) {
      const randomBusiness = faker.helpers.arrayElement(createdBusinesses);

      await prisma.promo.create({
        data: {
          ...promo,
          businessId: randomBusiness.id,
        },
      });
      console.log(
        `✅ Created promo: ${promo.title} for ${randomBusiness.name}`
      );
    }

    console.log("🎊 Database seeding completed successfully!");
    return {
      success: true,
      categories: createdCategories,
      businesses: createdBusinesses,
    };
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    return { success: false, error };
  }
}

export async function createAdminUser(): Promise<{
  success: boolean;
  message?: string;
  error?: unknown;
}> {
  try {
    console.log("👑 Creating admin user...");

    // Check if admin user already exists
    const adminExists = await prisma.adminUser.findFirst({
      where: { role: "SUPER_ADMIN" },
    });

    if (adminExists) {
      console.log("✅ Admin user already exists");
      return { success: true, message: "Admin user already exists" };
    }

    // Create admin user in AdminUser model
    const adminUser = await prisma.adminUser.create({
      data: {
        email: "admin@bookmyservice.com",
        name: "James Billy Vasig SuperAdmin",
        password: "!AdminPassword123", // Default password - should be changed
        role: "SUPER_ADMIN",
        permissions: JSON.stringify(["*"]), // All permissions
        department: "System Administration",
        employeeId: "ADMIN001",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("✅ Admin user created:", adminUser.id);
    return {
      success: true,
      message: "Admin user created successfully",
      // Note: Password should be changed after first login
    };
  } catch (error) {
    console.error("❌ Failed to create admin user:", error);
    return { success: false, error };
  }
}

interface ClearDatabaseResult {
  success: boolean;
  message?: string;
  error?: unknown;
}

export async function clearDatabase(): Promise<ClearDatabaseResult> {
  try {
    console.log("🧹 Clearing database...");

    // Clear all collections in reverse order (due to foreign key constraints)
    await prisma.promo.deleteMany();
    console.log("✅ Cleared Promo collection");

    await prisma.service.deleteMany();
    console.log("✅ Cleared Service collection");

    await prisma.booking.deleteMany();
    console.log("✅ Cleared Booking collection");

    await prisma.business.deleteMany();
    console.log("✅ Cleared Business collection");

    await prisma.category.deleteMany();
    console.log("✅ Cleared Category collection");

    await prisma.user.deleteMany();
    console.log("✅ Cleared User collection");

    console.log("🎉 Database cleared successfully!");
    return { success: true, message: "Database cleared successfully" };
  } catch (error) {
    console.error("❌ Failed to clear database:", error);
    return { success: false, error };
  }
}

// Utility functions for different seeding scenarios
export async function seedSmallDataset() {
  return seedDatabase({
    categories: 5,
    businesses: 8,
    services: 25,
    promos: 12,
    users: 15,
  });
}

export async function seedMediumDataset() {
  return seedDatabase({
    categories: 8,
    businesses: 15,
    services: 50,
    promos: 25,
    users: 30,
  });
}

export async function seedLargeDataset() {
  return seedDatabase({
    categories: 12,
    businesses: 25,
    services: 100,
    promos: 50,
    users: 50,
  });
}

export async function seedCustomDataset(counts: {
  categories?: number;
  businesses?: number;
  services?: number;
  promos?: number;
  users?: number;
}) {
  return seedDatabase(counts);
}

// Main function for CLI usage
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case "--small":
        await seedSmallDataset();
        break;
      case "--medium":
        await seedMediumDataset();
        break;
      case "--large":
        await seedLargeDataset();
        break;
      default:
        // Default to medium dataset
        await seedMediumDataset();
        break;
    }

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}
