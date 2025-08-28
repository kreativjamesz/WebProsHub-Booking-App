import { account, databases, DATABASE_ID, COLLECTIONS } from './appwrite';
import { ConnectionTestResult } from './types/test-connection';

export async function testAppwriteConnection(): Promise<ConnectionTestResult> {
  try {
    console.log('🔍 Testing Appwrite connection...');
    console.log('📊 Database ID:', DATABASE_ID);
    console.log('🏢 Collections:', COLLECTIONS);
    
    // Test database connection by trying to list documents from a collection
    const testCollection = await databases.listDocuments(DATABASE_ID, COLLECTIONS.CATEGORIES);
    console.log('✅ Database connection successful!');
    console.log('📚 Test collection accessible: ', testCollection);
    
    return { success: true, collections: [] };
  } catch (error) {
    console.error('❌ Appwrite connection failed:', error);
    return { success: false, error };
  }
}
