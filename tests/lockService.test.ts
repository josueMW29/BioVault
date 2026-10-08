import lockService from '../src/services/lockService';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store');

describe('LockService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true by default if no value is set', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    const result = await lockService.isAutoLockEnabled();
    expect(result).toBe(true);
  });

  it('should return false if value is "false"', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('false');
    const result = await lockService.isAutoLockEnabled();
    expect(result).toBe(false);
  });

  it('should set auto lock enabled', async () => {
    await lockService.setAutoLockEnabled(false);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('biovault_auto_lock_enabled', 'false');
  });
});
