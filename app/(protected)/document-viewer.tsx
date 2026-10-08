import React from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVault } from '../../src/context/VaultContext';
import { theme } from '../../src/constants/theme';
import { AppButton } from '../../src/components/AppButton';
import { FileText } from 'lucide-react-native';
import * as Sharing from 'expo-sharing';
import { formatBytes } from '../../src/utils/fileUtils';

export default function DocumentViewer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items } = useVault();
  const router = useRouter();
  
  const item = items.find(i => i.id === id);

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Documento no encontrado</Text>
        <AppButton title="Volver" onPress={() => router.back()} />
      </View>
    );
  }

  const handleOpenDocument = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(item.uri, {
          dialogTitle: 'Abrir Documento Privado',
        });
      } else {
        alert('No se puede compartir o abrir documentos en este dispositivo.');
      }
    } catch (error) {
      console.error('Error opening document:', error);
      alert('Error al abrir el documento.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FileText size={80} color={theme.colors.primary} />
        </View>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.meta}>
          {item.mimeType || 'Documento'} • {formatBytes(item.size)}
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Los documentos se abren de forma segura utilizando el visor nativo del sistema. No se guardan copias fuera de la bóveda.
          </Text>
        </View>

        <AppButton 
          title="Abrir Documento" 
          onPress={handleOpenDocument}
          style={styles.openBtn}
        />
        <AppButton 
          title="Volver" 
          variant="outline" 
          onPress={() => router.back()} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  meta: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  infoBox: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.secondary,
  },
  infoText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  openBtn: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 18,
    marginBottom: theme.spacing.md,
  }
});
