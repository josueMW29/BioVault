import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, AppState, Alert } from 'react-native';
import { ShieldAlert, Fingerprint } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useVault } from '../../src/context/VaultContext';
import { AppButton } from '../../src/components/AppButton';
import { BiometricStatus } from '../../src/components/BiometricStatus';
import { theme } from '../../src/constants/theme';
import biometricService from '../../src/services/biometricService';

export default function BiometricScreen() {
  const router = useRouter();
  const { unlock, isUnlocked } = useVault();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [canAuthenticate, setCanAuthenticate] = useState(false);

  useEffect(() => {
    // Check if we can authenticate
    const checkBio = async () => {
      const status = await biometricService.checkStatus();
      setCanAuthenticate(status.hasHardware && status.isEnrolled);
    };
    checkBio();
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      router.replace('/(protected)/home');
    }
  }, [isUnlocked]);

  const handleAuthenticate = async () => {
    if (isAuthenticating) return;
    
    setIsAuthenticating(true);
    try {
      const success = await unlock();
      if (!success) {
        Alert.alert('Autenticación fallida', 'No se pudo verificar tu identidad.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <ShieldAlert size={64} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>BioVault</Text>
          <Text style={styles.subtitle}>Tus archivos privados, protegidos por ti</Text>
        </View>

        <View style={styles.content}>
          <BiometricStatus />
          
          {canAuthenticate && (
            <AppButton
              title="Desbloquear Bóveda"
              icon={<Fingerprint size={20} color="#FFF" />}
              onPress={handleAuthenticate}
              loading={isAuthenticating}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  }
});
