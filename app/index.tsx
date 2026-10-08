import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useVault } from '../src/context/VaultContext';
import { View, ActivityIndicator } from 'react-native';
import { theme } from '../src/constants/theme';
import biometricService from '../src/services/biometricService';

export default function Index() {
  const { isUnlocked } = useVault();
  const [isReady, setIsReady] = useState(false);
  const [hasBiometrics, setHasBiometrics] = useState(false);

  useEffect(() => {
    const checkSetup = async () => {
      const status = await biometricService.checkStatus();
      setHasBiometrics(status.hasHardware && status.isEnrolled);
      setIsReady(true);
    };
    checkSetup();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Routing Logic
  // If the vault is unlocked, go to protected area
  if (isUnlocked) {
    return <Redirect href="/(protected)/home" />;
  }

  // If locked, go to biometric prompt
  return <Redirect href="/(auth)/biometric" />;
}
