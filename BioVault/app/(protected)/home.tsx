import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useVault } from '../../src/context/VaultContext';
import { theme } from '../../src/constants/theme';
import { importImageOrVideo, importDocument, deleteFileFromVault } from '../../src/services/fileService';
import AppButton from '../../src/components/AppButton';
import FileCard from '../../src/components/FileCard';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { files, addFile, removeFile, lockVault } = useVault();

  const handleImportMedia = async () => {
    const file = await importImageOrVideo();
    if (file) addFile(file);
  };

  const handleImportDoc = async () => {
    const file = await importDocument();
    if (file) addFile(file);
  };

  const handleDelete = (id: string, uri: string) => {
    Alert.alert('Eliminar archivo', '¿Estás seguro de que deseas eliminar este archivo permanentemente?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        const success = await deleteFileFromVault(uri);
        if (success) removeFile(id, uri);
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Bóveda</Text>
        <TouchableOpacity onPress={lockVault} style={styles.lockBtn}>
          <Text style={styles.lockBtnText}>Bloquear</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{files.filter(f => f.type === 'photo').length}</Text>
          <Text style={styles.statLabel}>Fotos</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{files.filter(f => f.type === 'video').length}</Text>
          <Text style={styles.statLabel}>Videos</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{files.filter(f => f.type === 'document').length}</Text>
          <Text style={styles.statLabel}>Docs</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <AppButton title="Importar Foto/Video" onPress={handleImportMedia} style={{flex: 1, marginRight: 8}} />
        <AppButton title="Importar Documento" onPress={handleImportDoc} variant="secondary" style={{flex: 1}} />
      </View>

      <Text style={styles.sectionTitle}>Archivos Protegidos</Text>
      
      {files.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Tu bóveda está vacía.</Text>
        </View>
      ) : (
        <FlatList
          data={files}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FileCard file={item} onDelete={() => handleDelete(item.id, item.uri)} />
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.m, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.l },
  title: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text },
  lockBtn: { backgroundColor: theme.colors.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: theme.borderRadius.round, borderWidth: 1, borderColor: theme.colors.border },
  lockBtnText: { color: theme.colors.danger, fontWeight: '600' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.l },
  statBox: { flex: 1, backgroundColor: theme.colors.surface, padding: theme.spacing.m, borderRadius: theme.borderRadius.m, marginHorizontal: 4, alignItems: 'center', borderColor: theme.colors.border, borderWidth: 1 },
  statNum: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary },
  statLabel: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 4 },
  actionRow: { flexDirection: 'row', marginBottom: theme.spacing.l },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: theme.colors.text, marginBottom: theme.spacing.m },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: theme.colors.textSecondary, fontSize: 16 }
});
