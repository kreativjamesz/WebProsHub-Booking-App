import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AdminRole } from "@/lib/stores/features/admin/admin.types";
import { UserRole } from "@/lib/stores/features/auth/auth.types";
import { BookingStatus } from "@/lib/stores/features/admin/bookings/bookings.types";

const prisma = new PrismaClient();

// Helper function to get random enum value
function getRandomEnumValue<T extends Record<string, string>>(enumObj: T): T[keyof T] {
  const values = Object.values(enumObj) as T[keyof T][];
  return values[Math.floor(Math.random() * values.length)];
}

// Helper function to get random array element
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

async function main() {
  // Get seed size from command line arguments
  const args = process.argv.slice(2);
  const seedSize = args.includes('--large') ? 'large' : 
                   args.includes('--small') ? 'small' : 'medium';
  
  console.log(`🌱 Starting database seeding (${seedSize} size)...`);

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.adminAuditLog.deleteMany();
  await prisma.adminSession.deleteMany();

  console.log("🗑️  Cleared existing data");

  // Create Categories
  const categories = [
    {
      name: "Beauty & Wellness",
      description: "Salons, spas, and beauty services",
      icon: "💅",
      color: "#FF69B4",
    },
    {
      name: "Health & Fitness",
      description: "Gyms, clinics, and health services",
      icon: "💪",
      color: "#32CD32",
    },
    {
      name: "Food & Dining",
      description: "Restaurants, cafes, and food services",
      icon: "🍽️",
      color: "#FF8C00",
    },
    {
      name: "Professional Services",
      description: "Legal, consulting, and business services",
      icon: "💼",
      color: "#4169E1",
    },
    {
      name: "Home & Garden",
      description: "Cleaning, landscaping, and home services",
      icon: "🏠",
      color: "#228B22",
    },
    {
      name: "Education & Training",
      description: "Schools, tutors, and training centers",
      icon: "📚",
      color: "#9932CC",
    },
    {
      name: "Automotive",
      description: "Car repair, detailing, and automotive services",
      icon: "🚗",
      color: "#DC143C",
    },
    {
      name: "Technology",
      description: "IT services, repair, and tech support",
      icon: "💻",
      color: "#00CED1",
    },
  ];

  const createdCategories = [];
  for (const categoryData of categories) {
    const category = await prisma.category.create({
      data: categoryData,
    });
    createdCategories.push(category);
    console.log(`✅ Created category: ${category.name}`);
  }

  // Create Users (Customers and Business Owners)
  const createdUsers = [];
  const createdBusinesses = [];
  const createdServices = [];

  // Create customers based on seed size
  const customerCount = seedSize === 'small' ? 5 : seedSize === 'medium' ? 20 : 50;
  for (let i = 0; i < customerCount; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: bcrypt.hash("password123", 12).toString(),
        role: UserRole.CUSTOMER,
      },
    });
    createdUsers.push(user);
  }

  // Create business owners based on seed size
  const businessOwnerCount = seedSize === 'small' ? 3 : seedSize === 'medium' ? 10 : 25;
  for (let i = 0; i < businessOwnerCount; i++) {
    const businessOwner = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: bcrypt.hash("password123", 12).toString(),
        role: UserRole.BUSINESS_OWNER,
      },
    });
    createdUsers.push(businessOwner);

    // Create business for this owner
    const business = await prisma.business.create({
      data: {
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        logo: faker.image.url(),
        coverImage: faker.image.url(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        website: faker.internet.url(),
        categoryId: getRandomElement(createdCategories).id,
        ownerId: businessOwner.id,
        isActive: faker.datatype.boolean(), // 80% active
        rating: parseFloat(
          faker.number.float({ min: 1, max: 5, fractionDigits: 1 }).toFixed(1)
        ),
        reviewCount: faker.number.int({ min: 0, max: 100 }),
      },
    });
    createdBusinesses.push(business);

    // Create services based on seed size
    const serviceCount = seedSize === 'small' ? 
      faker.number.int({ min: 2, max: 4 }) : 
      seedSize === 'medium' ? 
      faker.number.int({ min: 3, max: 8 }) : 
      faker.number.int({ min: 5, max: 12 });
    for (let j = 0; j < serviceCount; j++) {
      const service = await prisma.service.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: parseFloat(
            faker.number
              .float({ min: 10, max: 500, fractionDigits: 2 })
              .toFixed(2)
          ),
          duration: faker.number.int({ min: 15, max: 180, multipleOf: 15 }), // 15 min intervals
          businessId: business.id,
          categoryId: business.categoryId,
          image: faker.image.url(),
          isActive: faker.datatype.boolean(), // 90% active
        },
      });
      createdServices.push(service);
    }
  }

  console.log(`✅ Created ${createdUsers.length} users`);
  console.log(`✅ Created ${createdBusinesses.length} businesses`);
  console.log(`✅ Created ${createdServices.length} services`);

  // Create Bookings based on seed size
  const createdBookings = [];
  const bookingCount = seedSize === 'small' ? 15 : seedSize === 'medium' ? 50 : 150;
  for (let i = 0; i < bookingCount; i++) {
    const randomUser = getRandomElement(
      createdUsers.filter((u) => u.role === UserRole.CUSTOMER)
    );
    const randomBusiness = getRandomElement(
      createdBusinesses.filter((b) => b.isActive)
    );
    const businessServices = createdServices.filter(
      (s) => s.businessId === randomBusiness.id
    );

    if (businessServices.length > 0) {
      const randomService = getRandomElement(businessServices);

      const booking = await prisma.booking.create({
        data: {
          userId: randomUser.id,
          businessId: randomBusiness.id,
          serviceId: randomService.id,
          date: faker.date.future(),
          time: faker.helpers.arrayElement([
            "09:00",
            "10:00",
            "11:00",
            "14:00",
            "15:00",
            "16:00",
          ]),
          status: getRandomEnumValue(BookingStatus),
          notes: faker.datatype.boolean() ? faker.lorem.sentence() : null,
        },
      });
      createdBookings.push(booking);
    }
  }

  console.log(`✅ Created ${createdBookings.length} bookings`);

  // Create Admin Users
  const adminUsers = [
    {
      email: "superadmin@mybookingapp.com",
      name: "Super Admin",
      role: AdminRole.SUPER_ADMIN,
      department: "IT",
      employeeId: "EMP001",
      permissions: JSON.stringify(["all"]),
      isActive: true,
    },
    {
      email: "moderator@mybookingapp.com",
      name: "System Moderator",
      role: AdminRole.MODERATOR,
      department: "Operations",
      employeeId: "EMP002",
      permissions: JSON.stringify([
        "user_management",
        "business_management",
        "booking_management",
      ]),
      isActive: true,
    },
    {
      email: "support@mybookingapp.com",
      name: "Customer Support",
      role: AdminRole.SUPPORT,
      department: "Customer Service",
      employeeId: "EMP003",
      permissions: JSON.stringify(["booking_management"]),
      isActive: true,
    },
  ];

  for (const adminData of adminUsers) {
    // Hash password properly for each admin user
    const hashedPassword = await bcrypt.hash("password123", 12);
    
    const admin = await prisma.adminUser.create({
      data: {
        ...adminData,
        password: hashedPassword,
      },
    });
    console.log(`✅ Created admin: ${admin.name} (${admin.role})`);
  }

  console.log("🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   • ${createdCategories.length} categories`);
  console.log(
    `   • ${createdUsers.length} users (${
      createdUsers.filter((u) => u.role === UserRole.CUSTOMER).length
    } customers, ${
      createdUsers.filter((u) => u.role === UserRole.BUSINESS_OWNER).length
    } business owners)`
  );
  console.log(`   • ${createdBusinesses.length} businesses`);
  console.log(`   • ${createdServices.length} services`);
  console.log(`   • ${createdBookings.length} bookings`);
  console.log(`   • ${adminUsers.length} admin users`);

  console.log("\n🔑 Default login credentials:");
  console.log('   • Customer/User: any customer email + "password123"');
  console.log('   • Business Owner: any business owner email + "password123"');
  console.log('   • Super Admin: superadmin@mybookingapp.com + "password123"');
  console.log('   • Moderator: moderator@mybookingapp.com + "password123"');
  console.log('   • Support: support@mybookingapp.com + "password123"');
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
