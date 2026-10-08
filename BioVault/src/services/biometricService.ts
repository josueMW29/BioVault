import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

export const checkBiometricAvailability = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

  return {
    hasHardware,
    isEnrolled,
    supportedTypes,
    hasFaceID: supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION),
    hasFingerprint: supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT),
    hasIris: supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS),
  };
};

export const authenticateAsync = async (promptMessage: string = 'Desbloquea BioVault'): Promise<boolean> => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: 'Usar código del dispositivo',
      disableDeviceFallback: false,
      cancelLabel: 'Cancelar',
    });
    return result.success;
  } catch (error) {
    console.error('Error en autenticación biométrica:', error);
    return false;
  }
};
