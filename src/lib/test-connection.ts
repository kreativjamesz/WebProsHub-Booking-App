import { ConnectionTestResult } from './types/test-connection';

export async function testDatabaseConnection(): Promise<ConnectionTestResult> {
  try {
    console.log('🔗 Testing Database connection...');
    
    // For guests, just test if we can reach the API endpoint
    // This verifies the app is working without requiring authentication
    const response = await fetch('/api/database?action=testConnection', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Database connection successful!');
      return {
        success: true,
        collections: result.data || []
      };
    } else {
      throw new Error(result.error || 'Unknown error');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return { success: false, error };
  }
}
