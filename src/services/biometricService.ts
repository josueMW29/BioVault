import * as LocalAuthentication from 'expo-local-authentication';

export interface BiometricStatus {
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: LocalAuthentication.AuthenticationType[];
}

class BiometricService {
  /**
   * Check if the device supports biometric authentication and if it is configured.
   */
  async checkStatus(): Promise<BiometricStatus> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      return {
        hasHardware,
        isEnrolled,
        supportedTypes,
      };
    } catch (error) {
      console.error('Error checking biometric status:', error);
      return {
        hasHardware: false,
        isEnrolled: false,
        supportedTypes: [],
      };
    }
  }

  /**
   * Prompt the user to authenticate using biometrics.
   */
  async authenticate(promptMessage: string = 'Autentícate para acceder a BioVault'): Promise<boolean> {
    try {
      const status = await this.checkStatus();
      if (!status.hasHardware || !status.isEnrolled) {
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Usar código del dispositivo',
        disableDeviceFallback: false,
        cancelLabel: 'Cancelar',
      });

      return result.success;
    } catch (error) {
      console.error('Error during biometric authentication:', error);
      return false;
    }
  }
}

export default new BiometricService();
