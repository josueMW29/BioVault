import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { VaultFile } from '../types/file';
import { theme } from '../constants/theme';

interface Props {
  file: VaultFile;
  onDelete: () => void;
}

export default function FileCard({ file, onDelete }: Props) {
  const isImage = file.type === 'photo';

  return (
    <View style={styles.card}>
      {isImage ? (
        <Image source={{ uri: file.uri }} style={styles.thumbnail} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>{file.type.toUpperCase()}</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{file.name}</Text>
        <Text style={styles.date}>{new Date(file.createdAt).toLocaleDateString()}</Text>
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.m, padding: theme.spacing.s, marginBottom: theme.spacing.s, alignItems: 'center', borderColor: theme.colors.border, borderWidth: 1 },
  thumbnail: { width: 50, height: 50, borderRadius: theme.borderRadius.s, backgroundColor: '#333' },
  placeholder: { width: 50, height: 50, borderRadius: theme.borderRadius.s, backgroundColor: theme.colors.border, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: theme.colors.textSecondary, fontSize: 10, fontWeight: 'bold' },
  info: { flex: 1, marginLeft: theme.spacing.m },
  name: { color: theme.colors.text, fontSize: 16, fontWeight: '500' },
  date: { color: theme.colors.textSecondary, fontSize: 12, marginTop: 4 },
  deleteBtn: { padding: theme.spacing.s },
  deleteText: { color: theme.colors.danger, fontSize: 14 }
});
