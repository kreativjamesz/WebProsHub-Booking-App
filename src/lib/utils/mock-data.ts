// Mock data utilities for admin dashboard charts

export const generateMonthlyData = (months: number = 12) => {
  const data = [];
  const currentDate = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    data.push({
      name: date.toLocaleDateString('en-US', { month: 'short' }),
      value: Math.floor(Math.random() * 1000) + 100,
    });
  }
  
  return data;
};

export const generateWeeklyData = (weeks: number = 8) => {
  const data = [];
  const currentDate = new Date();
  
  for (let i = weeks - 1; i >= 0; i--) {
    const date = new Date(currentDate.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    data.push({
      name: `Week ${Math.ceil((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`,
      value: Math.floor(Math.random() * 500) + 50,
    });
  }
  
  return data;
};

export const generateUserRoleData = () => [
  { name: 'Regular Users', value: 1250, color: '#3B82F6' },
  { name: 'Business Owners', value: 320, color: '#10B981' },
  { name: 'Admins', value: 45, color: '#8B5CF6' },
  { name: 'Support', value: 28, color: '#F59E0B' },
];

export const generateBusinessCategoryData = () => [
  { name: 'Beauty & Spa', value: 180, color: '#EC4899' },
  { name: 'Healthcare', value: 145, color: '#06B6D4' },
  { name: 'Fitness', value: 120, color: '#84CC16' },
  { name: 'Education', value: 95, color: '#F97316' },
  { name: 'Automotive', value: 75, color: '#6366F1' },
  { name: 'Other', value: 65, color: '#6B7280' },
];

export const generateBookingStatusData = () => [
  { name: 'Confirmed', value: 45, color: '#10B981' },
  { name: 'Pending', value: 30, color: '#F59E0B' },
  { name: 'Completed', value: 20, color: '#3B82F6' },
  { name: 'Cancelled', value: 5, color: '#EF4444' },
];

export const generateRevenueData = (months: number = 12) => {
  const data = [];
  const currentDate = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    data.push({
      name: date.toLocaleDateString('en-US', { month: 'short' }),
      revenue: Math.floor(Math.random() * 50000) + 10000,
      bookings: Math.floor(Math.random() * 500) + 100,
    });
  }
  
  return data;
};

export const generateTopBusinesses = () => [
  { name: 'Beauty Palace Spa', bookings: 245, revenue: 12500, rating: 4.8 },
  { name: 'Health First Clinic', bookings: 198, revenue: 18900, rating: 4.9 },
  { name: 'FitLife Gym', bookings: 176, revenue: 8900, rating: 4.7 },
  { name: 'Tech Academy', bookings: 154, revenue: 15600, rating: 4.6 },
  { name: 'AutoCare Center', bookings: 132, revenue: 11200, rating: 4.5 },
];

export const generateRecentActivity = () => [
  { action: 'New business registered', business: 'Green Thumb Garden', time: '2 minutes ago', type: 'success' },
  { action: 'Booking confirmed', business: 'Beauty Palace Spa', time: '5 minutes ago', type: 'info' },
  { action: 'Payment received', business: 'Health First Clinic', time: '12 minutes ago', type: 'success' },
  { action: 'User account created', business: 'john.doe@email.com', time: '18 minutes ago', type: 'info' },
  { action: 'Business status updated', business: 'Tech Academy', time: '25 minutes ago', type: 'warning' },
  { action: 'System backup completed', business: 'System', time: '1 hour ago', type: 'success' },
];

export const generateSystemMetrics = () => ({
  cpuUsage: Math.floor(Math.random() * 30) + 20,
  memoryUsage: Math.floor(Math.random() * 40) + 30,
  diskUsage: Math.floor(Math.random() * 20) + 60,
  networkTraffic: Math.floor(Math.random() * 50) + 100,
  activeUsers: Math.floor(Math.random() * 200) + 800,
  uptime: Math.floor(Math.random() * 10) + 99,
});
