import * as SecureStore from 'expo-secure-store';

const AUTO_LOCK_KEY = 'biovault_auto_lock_enabled';

class LockService {
  async isAutoLockEnabled(): Promise<boolean> {
    try {
      const value = await SecureStore.getItemAsync(AUTO_LOCK_KEY);
      // Default to true for maximum security
      return value !== 'false';
    } catch (error) {
      console.error('Error reading auto lock setting:', error);
      return true;
    }
  }

  async setAutoLockEnabled(enabled: boolean): Promise<void> {
    try {
      await SecureStore.setItemAsync(AUTO_LOCK_KEY, enabled.toString());
    } catch (error) {
      console.error('Error saving auto lock setting:', error);
    }
  }
}

export default new LockService();
