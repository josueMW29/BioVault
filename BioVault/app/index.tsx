import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useVault } from '../src/context/VaultContext';
import { theme } from '../src/constants/theme';
import { checkBiometricAvailability } from '../src/services/biometricService';
import AppButton from '../src/components/AppButton';

export default function WelcomeScreen() {
  const { isUnlocked } = useVault();
  const [loading, setLoading] = useState(true);
  const [biometricStatus, setBiometricStatus] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const status = await checkBiometricAvailability();
      setBiometricStatus(status);
      setLoading(false);
      
      if (isUnlocked) {
        router.replace('/(protected)/home');
      }
    };
    init();
  }, [isUnlocked]);

  const handleStart = () => {
    router.replace('/(auth)/biometric');
  };

  if (loading) return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>BioVault</Text>
        <Text style={styles.subtitle}>Tus archivos privados, protegidos por ti.</Text>
        
        {!biometricStatus?.hasHardware ? (
          <Text style={styles.errorText}>Tu dispositivo no cuenta con hardware biométrico compatible.</Text>
        ) : !biometricStatus?.isEnrolled ? (
          <Text style={styles.errorText}>No tienes biometría configurada. Por favor, actívala en los ajustes de tu dispositivo.</Text>
        ) : (
          <AppButton title="Configurar / Entrar" onPress={handleStart} icon="ShieldCheck" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', padding: theme.spacing.xl },
  content: { alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: theme.colors.primary, marginBottom: theme.spacing.s },
  subtitle: { fontSize: 16, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: theme.spacing.xl },
  errorText: { color: theme.colors.danger, textAlign: 'center', marginTop: theme.spacing.m }
});
