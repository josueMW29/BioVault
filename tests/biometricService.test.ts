import biometricService from '../src/services/biometricService';
import * as LocalAuthentication from 'expo-local-authentication';

jest.mock('expo-local-authentication');

describe('BiometricService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return hardware and enrollment status', async () => {
    (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
    (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
    (LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock).mockResolvedValue([1]);

    const status = await biometricService.checkStatus();
    expect(status.hasHardware).toBe(true);
    expect(status.isEnrolled).toBe(true);
    expect(status.supportedTypes).toEqual([1]);
  });

  it('should authenticate successfully', async () => {
    (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
    (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
    (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({ success: true });

    const result = await biometricService.authenticate();
    expect(result).toBe(true);
    expect(LocalAuthentication.authenticateAsync).toHaveBeenCalled();
  });

  it('should fail authentication if cancelled', async () => {
    (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
    (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
    (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({ success: false, error: 'user_cancel' });

    const result = await biometricService.authenticate();
    expect(result).toBe(false);
  });

  it('should fail if no hardware', async () => {
    (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(false);
    
    const result = await biometricService.authenticate();
    expect(result).toBe(false);
    expect(LocalAuthentication.authenticateAsync).not.toHaveBeenCalled();
  });
});
