import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { File, Image as ImageIcon, Film, FileText } from 'lucide-react-native';
import { VaultItem } from '../types/file';
import { theme } from '../constants/theme';
import { formatBytes, formatDate } from '../utils/fileUtils';

interface FileCardProps {
  item: VaultItem;
  onPress: (item: VaultItem) => void;
  onLongPress?: (item: VaultItem) => void;
}

export const FileCard = ({ item, onPress, onLongPress }: FileCardProps) => {
  const renderIcon = () => {
    const size = 32;
    const color = theme.colors.primary;

    if (item.type === 'image') {
      // Return a thumbnail if it's an image
      return (
        <Image 
          source={{ uri: item.uri }} 
          style={styles.thumbnail}
          resizeMode="cover"
        />
      );
    }

    switch (item.type) {
      case 'video': return <Film size={size} color={color} />;
      case 'document': return <FileText size={size} color={color} />;
      default: return <File size={size} color={color} />;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(item)}
      onLongPress={() => onLongPress?.(item)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="middle">
          {item.name}
        </Text>
        <View style={styles.metaContainer}>
          <Text style={styles.meta}>{formatDate(item.createdAt)}</Text>
          {item.size && <Text style={styles.meta}> • {formatBytes(item.size)}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(59, 130, 246, 0.1)', // Primary with opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
  },
  meta: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  }
});
