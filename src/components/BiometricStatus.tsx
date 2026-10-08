import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Fingerprint, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import biometricService, { BiometricStatus as BioStatus } from '../services/biometricService';
import { theme } from '../constants/theme';
import { AppButton } from './AppButton';
import * as Linking from 'expo-linking';

export const BiometricStatus = () => {
  const [status, setStatus] = useState<BioStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const checkStatus = async () => {
    setLoading(true);
    const result = await biometricService.checkStatus();
    setStatus(result);
    setLoading(false);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  if (loading) return null;

  if (!status?.hasHardware) {
    return (
      <View style={styles.container}>
        <AlertCircle color={theme.colors.danger} size={32} />
        <Text style={styles.errorText}>Tu dispositivo no cuenta con hardware biométrico compatible.</Text>
      </View>
    );
  }

  if (!status.isEnrolled) {
    return (
      <View style={styles.container}>
        <AlertCircle color={theme.colors.secondary} size={32} />
        <Text style={styles.warningText}>No tienes biometría configurada en este dispositivo.</Text>
        <Text style={styles.subText}>Por favor, configura tu huella o Face ID en los ajustes de tu sistema operativo.</Text>
        <AppButton 
          title="Abrir Ajustes" 
          variant="secondary" 
          onPress={() => Linking.openSettings()} 
          style={{ marginTop: 12 }}
        />
        <AppButton 
          title="Reintentar" 
          variant="outline" 
          onPress={checkStatus} 
          style={{ marginTop: 8 }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.successContainer]}>
      <CheckCircle2 color={theme.colors.success} size={24} />
      <Text style={styles.successText}>Biometría configurada y lista</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  successContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.danger,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    fontWeight: '500',
  },
  warningText: {
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    fontSize: 14,
  },
  successText: {
    color: theme.colors.success,
    marginLeft: theme.spacing.sm,
    fontWeight: '500',
  }
});
