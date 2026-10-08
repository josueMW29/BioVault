import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useVault } from '../../src/context/VaultContext';
import { FileCard } from '../../src/components/FileCard';
import { EmptyState } from '../../src/components/EmptyState';
import { AppButton } from '../../src/components/AppButton';
import { theme } from '../../src/constants/theme';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { ShieldCheck, Plus, Image as ImageIcon, FileText, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { VaultItem } from '../../src/types/file';

export default function HomeScreen() {
  const { items, importFile, deleteFile, lock } = useVault();
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'document'>('all');

  const stats = useMemo(() => {
    return items.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [items]);

  const filteredItems = useMemo(() => {
    if (filter === 'all') return items;
    if (filter === 'image') return items.filter(i => i.type === 'image' || i.type === 'video');
    return items.filter(i => i.type === filter);
  }, [items, filter]);

  const handleImportMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      // asset.fileName might be null in some OS versions
      const name = asset.fileName || asset.uri.split('/').pop() || 'media_file';
      await importFile(asset.uri, name, asset.mimeType, asset.fileSize);
    }
  };

  const handleImportDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      await importFile(asset.uri, asset.name, asset.mimeType, asset.size);
    }
  };

  const handleItemPress = (item: VaultItem) => {
    if (item.type === 'image' || item.type === 'video') {
      router.push({ pathname: '/(protected)/media-viewer', params: { id: item.id } });
    } else {
      router.push({ pathname: '/(protected)/document-viewer', params: { id: item.id } });
    }
  };

  const handleLongPress = (item: VaultItem) => {
    Alert.alert(
      'Eliminar archivo',
      `¿Estás seguro de eliminar "${item.name}" de la bóveda? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteFile(item.id) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <ShieldCheck color={theme.colors.success} size={28} />
          <Text style={styles.statusTitle}>Bóveda Protegida</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.image || 0}</Text>
            <Text style={styles.statLabel}>Fotos</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.video || 0}</Text>
            <Text style={styles.statLabel}>Videos</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.document || 0}</Text>
            <Text style={styles.statLabel}>Docs</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <AppButton 
          title="Foto / Video" 
          icon={<ImageIcon size={18} color="#FFF" />} 
          onPress={handleImportMedia}
          style={{ flex: 1, marginRight: 8 }}
        />
        <AppButton 
          title="Documento" 
          icon={<FileText size={18} color="#FFF" />} 
          onPress={handleImportDocument}
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>

      <View style={styles.filterRow}>
        {(['all', 'image', 'document'] as const).map(f => (
          <AppButton 
            key={f}
            title={f === 'all' ? 'Todos' : f === 'image' ? 'Medios' : 'Docs'} 
            variant={filter === f ? 'primary' : 'secondary'}
            onPress={() => setFilter(f)}
            style={styles.filterBtn}
          />
        ))}
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <FileCard 
            item={item} 
            onPress={handleItemPress} 
            onLongPress={handleLongPress} 
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState 
            title="Bóveda vacía" 
            description="Importa fotos, videos o documentos para protegerlos aquí." 
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  statusCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  statusTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: theme.spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  filterBtn: {
    flex: 1,
    marginHorizontal: 4,
    minHeight: 36,
    paddingVertical: 8,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xxl,
  }
});
