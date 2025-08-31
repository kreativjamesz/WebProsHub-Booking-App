import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// System settings interface
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

// Analytics interface
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

// Admin system management state interface
export interface AdminSystemState {
  // Data
  settings: SystemSettings;
  analytics: SystemAnalytics | null;

  // Loading states
  isLoadingSettings: boolean;
  isLoadingAnalytics: boolean;
  isUpdatingSettings: boolean;
  isPerformingSystemAction: boolean;

  // Error handling
  error: string | null;

  // Success messages
  successMessage: string | null;

  // System status
  isMaintenanceMode: boolean;
  systemHealth: "healthy" | "warning" | "critical";
}

const initialState: AdminSystemState = {
  settings: {
    general: {
      siteName: "My Booking App",
      siteDescription: "Professional booking management system",
      contactEmail: "admin@mybookingapp.com",
      supportPhone: "+1 (555) 123-4567",
      timezone: "UTC-5",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12-hour",
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordExpiry: 90,
      ipWhitelist: "",
      auditLogging: true,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      bookingConfirmations: true,
      bookingReminders: true,
      systemAlerts: true,
      marketingEmails: false,
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      autoBackup: true,
      backupFrequency: "daily",
      maxFileSize: 10,
      allowedFileTypes: "jpg,png,pdf,doc",
      rateLimiting: true,
      maxRequestsPerMinute: 100,
    },
  },
  analytics: null,
  isLoadingSettings: false,
  isLoadingAnalytics: false,
  isUpdatingSettings: false,
  isPerformingSystemAction: false,
  error: null,
  successMessage: null,
  isMaintenanceMode: false,
  systemHealth: "healthy",
};

// Async thunks
export const fetchSystemSettings = createAsyncThunk(
  "adminSystem/fetchSystemSettings",
  async () => {
    // TODO: Replace with actual API call
    const response = await fetch("/api/admin/system/settings");
    const data = await response.json();
    return data;
  }
);

export const updateSystemSettings = createAsyncThunk(
  "adminSystem/updateSystemSettings",
  async ({
    section,
    settings,
  }: {
    section: keyof SystemSettings;
    settings: Partial<SystemSettings[keyof SystemSettings]>;
  }) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/admin/system/settings/${section}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const data = await response.json();
    return { section, settings: data };
  }
);

export const fetchSystemAnalytics = createAsyncThunk(
  "adminSystem/fetchSystemAnalytics",
  async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
    // TODO: Replace with actual API call
    const response = await fetch(
      `/api/admin/system/analytics?startDate=${startDate}&endDate=${endDate}`
    );
    const data = await response.json();
    return data;
  }
);

export const toggleMaintenanceMode = createAsyncThunk(
  "adminSystem/toggleMaintenanceMode",
  async (enabled: boolean) => {
    // TODO: Replace with actual API call
    const response = await fetch("/api/admin/system/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    });
    const data = await response.json();
    return data;
  }
);

export const performSystemBackup = createAsyncThunk(
  "adminSystem/performSystemBackup",
  async () => {
    // TODO: Replace with actual API call
    const response = await fetch("/api/admin/system/backup", {
      method: "POST",
    });
    const data = await response.json();
    return data;
  }
);

export const clearSystemCache = createAsyncThunk(
  "adminSystem/clearSystemCache",
  async () => {
    // TODO: Replace with actual API call
    const response = await fetch("/api/admin/system/cache/clear", {
      method: "POST",
    });
    const data = await response.json();
    return data;
  }
);

export const getSystemHealth = createAsyncThunk(
  "adminSystem/getSystemHealth",
  async () => {
    // TODO: Replace with actual API call
    const response = await fetch("/api/admin/system/health");
    const data = await response.json();
    return data;
  }
);

const adminSystemSlice = createSlice({
  name: "adminSystem",
  initialState,
  reducers: {
    // Clear messages
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },

    // Update settings locally (for form handling)
    updateSettingsLocally: (
      state,
      action: PayloadAction<{
        section: keyof SystemSettings;
        settings: Partial<SystemSettings[keyof SystemSettings]>;
      }>
    ) => {
      const { section, settings } = action.payload;
      // Use type assertion to bypass the complex intersection type issue
      (state.settings as any)[section] = {
        ...state.settings[section],
        ...settings,
      };
    },

    // Reset settings to default
    resetSettingsToDefault: (state) => {
      state.settings = initialState.settings;
    },

    // Reset state
    resetSystemState: (state) => {
      state.settings = initialState.settings;
      state.analytics = null;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch system settings
    builder
      .addCase(fetchSystemSettings.pending, (state) => {
        state.isLoadingSettings = true;
        state.error = null;
      })
      .addCase(fetchSystemSettings.fulfilled, (state, action) => {
        state.isLoadingSettings = false;
        state.settings = action.payload;
      })
      .addCase(fetchSystemSettings.rejected, (state, action) => {
        state.isLoadingSettings = false;
        state.error = action.error.message || "Failed to fetch system settings";
      });

    // Update system settings
    builder
      .addCase(updateSystemSettings.pending, (state) => {
        state.isUpdatingSettings = true;
        state.error = null;
      })
      .addCase(updateSystemSettings.fulfilled, (state, action) => {
        state.isUpdatingSettings = false;
        const { section, settings } = action.payload;
        state.settings[section] = { ...state.settings[section], ...settings };
        state.successMessage = `${section} settings updated successfully`;
      })
      .addCase(updateSystemSettings.rejected, (state, action) => {
        state.isUpdatingSettings = false;
        state.error =
          action.error.message || "Failed to update system settings";
      });

    // Fetch system analytics
    builder
      .addCase(fetchSystemAnalytics.pending, (state) => {
        state.isLoadingAnalytics = true;
        state.error = null;
      })
      .addCase(fetchSystemAnalytics.fulfilled, (state, action) => {
        state.isLoadingAnalytics = false;
        state.analytics = action.payload;
      })
      .addCase(fetchSystemAnalytics.rejected, (state, action) => {
        state.isLoadingAnalytics = false;
        state.error =
          action.error.message || "Failed to fetch system analytics";
      });

    // Toggle maintenance mode
    builder
      .addCase(toggleMaintenanceMode.pending, (state) => {
        state.isPerformingSystemAction = true;
        state.error = null;
      })
      .addCase(toggleMaintenanceMode.fulfilled, (state, action) => {
        state.isPerformingSystemAction = false;
        state.isMaintenanceMode = action.payload.maintenanceMode;
        state.successMessage = `Maintenance mode ${
          action.payload.maintenanceMode ? "enabled" : "disabled"
        } successfully`;
      })
      .addCase(toggleMaintenanceMode.rejected, (state, action) => {
        state.isPerformingSystemAction = false;
        state.error =
          action.error.message || "Failed to toggle maintenance mode";
      });

    // Perform system backup
    builder
      .addCase(performSystemBackup.pending, (state) => {
        state.isPerformingSystemAction = true;
        state.error = null;
      })
      .addCase(performSystemBackup.fulfilled, (state) => {
        state.isPerformingSystemAction = false;
        state.successMessage = "System backup completed successfully";
      })
      .addCase(performSystemBackup.rejected, (state, action) => {
        state.isPerformingSystemAction = false;
        state.error = action.error.message || "Failed to perform system backup";
      });

    // Clear system cache
    builder
      .addCase(clearSystemCache.pending, (state) => {
        state.isPerformingSystemAction = true;
        state.error = null;
      })
      .addCase(clearSystemCache.fulfilled, (state) => {
        state.isPerformingSystemAction = false;
        state.successMessage = "System cache cleared successfully";
      })
      .addCase(clearSystemCache.rejected, (state, action) => {
        state.isPerformingSystemAction = false;
        state.error = action.error.message || "Failed to clear system cache";
      });

    // Get system health
    builder
      .addCase(getSystemHealth.pending, (state) => {
        state.isLoadingAnalytics = true;
        state.error = null;
      })
      .addCase(getSystemHealth.fulfilled, (state, action) => {
        state.isLoadingAnalytics = false;
        state.systemHealth = action.payload.health;
        state.isMaintenanceMode = action.payload.maintenanceMode;
      })
      .addCase(getSystemHealth.rejected, (state, action) => {
        state.isLoadingAnalytics = false;
        state.error = action.error.message || "Failed to get system health";
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  updateSettingsLocally,
  resetSettingsToDefault,
  resetSystemState,
} = adminSystemSlice.actions;

export default adminSystemSlice.reducer;
