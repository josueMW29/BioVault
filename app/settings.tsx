import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, SafeAreaView, ScrollView } from 'react-native';
import { AppButton } from '../src/components/AppButton';
import { theme } from '../src/constants/theme';
import lockService from '../src/services/lockService';
import { BiometricStatus } from '../src/components/BiometricStatus';
import { useVault } from '../src/context/VaultContext';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const [autoLock, setAutoLock] = useState(true);
  const { lock } = useVault();
  const router = useRouter();

  useEffect(() => {
    const loadSettings = async () => {
      const isAuto = await lockService.isAutoLockEnabled();
      setAutoLock(isAuto);
    };
    loadSettings();
  }, []);

  const toggleAutoLock = async (value: boolean) => {
    setAutoLock(value);
    await lockService.setAutoLockEnabled(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Configuración</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seguridad</Text>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingText}>Bloqueo automático</Text>
              <Text style={styles.settingSubtext}>Bloquea la bóveda al salir de la app</Text>
            </View>
            <Switch 
              value={autoLock} 
              onValueChange={toggleAutoLock}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado Biométrico</Text>
          <BiometricStatus />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones</Text>
          <AppButton 
            title="Bloquear Ahora" 
            variant="danger" 
            onPress={() => {
              lock();
              router.replace('/(auth)/biometric');
            }}
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>BioVault v1.0.0</Text>
          <Text style={styles.infoTextSub}>Los archivos se almacenan de forma segura en el espacio aislado ("sandbox") del sistema operativo. Al eliminar la aplicación, se perderán los archivos protegidos.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  settingText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtext: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  infoSection: {
    marginTop: theme.spacing.xxl,
    alignItems: 'center',
  },
  infoText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoTextSub: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  }
});
