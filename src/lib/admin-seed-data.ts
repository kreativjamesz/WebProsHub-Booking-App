// Admin seed data for development and testing purposes
// This file contains mock admin data that can be used during development

export const mockAdminUsers = [
  {
    id: "admin1",
    name: "Super Admin",
    email: "admin@example.com",
    role: "SUPER_ADMIN",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "admin2",
    name: "Moderator User",
    email: "moderator@example.com",
    role: "MODERATOR",
    createdAt: new Date("2024-01-02"),
  },
  {
    id: "admin3",
    name: "Support Staff",
    email: "support@example.com",
    role: "SUPPORT",
    createdAt: new Date("2024-01-03"),
  },
];

export const mockAdminStats = {
  totalUsers: 1250,
  totalBusinesses: 89,
  totalBookings: 2340,
  activePromotions: 12,
  revenueThisMonth: 125000,
  newUsersThisWeek: 45,
  pendingApprovals: 8,
};

export const mockRecentActivity = [
  {
    id: "1",
    type: "USER_REGISTRATION",
    description: "New user registered: john.doe@example.com",
    timestamp: new Date("2024-01-15T10:30:00"),
    severity: "info",
  },
  {
    id: "2",
    type: "BUSINESS_APPROVAL",
    description: "Business 'Hair Salon Pro' approved",
    timestamp: new Date("2024-01-15T09:15:00"),
    severity: "success",
  },
  {
    id: "3",
    type: "BOOKING_CREATED",
    description: "New booking created for Car Wash Express",
    timestamp: new Date("2024-01-15T08:45:00"),
    severity: "info",
  },
  {
    id: "4",
    type: "PAYMENT_RECEIVED",
    description: "Payment received: ₱500 for booking #1234",
    timestamp: new Date("2024-01-15T08:30:00"),
    severity: "success",
  },
  {
    id: "5",
    type: "SUPPORT_TICKET",
    description: "Support ticket opened: Technical issue with booking system",
    timestamp: new Date("2024-01-15T08:00:00"),
    severity: "warning",
  },
];
