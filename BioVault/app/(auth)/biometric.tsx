import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../src/constants/theme';
import { authenticateAsync } from '../../src/services/biometricService';
import { useVault } from '../../src/context/VaultContext';
import { router } from 'expo-router';
import AppButton from '../../src/components/AppButton';
import { useEffect, useState } from 'react';

export default function BiometricScreen() {
  const { unlockVault } = useVault();
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async () => {
    setError(null);
    const success = await authenticateAsync('Verifica tu identidad para acceder a BioVault');
    if (success) {
      unlockVault();
      router.replace('/(protected)/home');
    } else {
      setError('Autenticación fallida o cancelada.');
    }
  };

  useEffect(() => {
    handleAuth();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bóveda Bloqueada</Text>
      <Text style={styles.subtitle}>Usa tu huella dactilar o Face ID para acceder.</Text>
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      <AppButton title="Intentar de nuevo" onPress={handleAuth} variant="primary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.s },
  subtitle: { fontSize: 16, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: theme.spacing.xl },
  error: { color: theme.colors.danger, marginBottom: theme.spacing.l }
});
