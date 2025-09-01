// Admin System Types
export interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    supportPhone: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordExpiry: number;
    ipWhitelist: string;
    auditLogging: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    bookingConfirmations: boolean;
    bookingReminders: boolean;
    systemAlerts: boolean;
    marketingEmails: boolean;
  };
  system: {
    maintenanceMode: boolean;
    debugMode: boolean;
    autoBackup: boolean;
    backupFrequency: string;
    maxFileSize: number;
    allowedFileTypes: string;
    rateLimiting: boolean;
    maxRequestsPerMinute: number;
  };
}

export interface SystemAnalytics {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    growthRate: number;
  };
  businesses: {
    total: number;
    active: number;
    pendingApproval: number;
    growthRate: number;
  };
  bookings: {
    total: number;
    thisMonth: number;
    completed: number;
    cancelled: number;
    revenue: number;
  };
  system: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    activeUsers: number;
  };
}

export interface AdminSystemState {
  settings: SystemSettings;
  analytics: SystemAnalytics | null;
  isLoadingSettings: boolean;
  isLoadingAnalytics: boolean;
  isUpdatingSettings: boolean;
  isPerformingSystemAction: boolean;
  error: string | null;
  successMessage: string | null;
  isMaintenanceMode: boolean;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

// System Metrics
export interface SystemMetrics {
  users: {
    total: number;
    active: number;
    inactive: number;
    growth: number;
  };
  businesses: {
    total: number;
    active: number;
    pending: number;
    growth: number;
  };
  bookings: {
    total: number;
    completed: number;
    cancelled: number;
    revenue: number;
  };
}

// Admin System Actions
export interface AdminSystemActions {
  fetchSystemStats: () => Promise<void>;
  fetchSystemHealth: () => Promise<void>;
  performBackup: () => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
}
