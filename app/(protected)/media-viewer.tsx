import React from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVault } from '../../src/context/VaultContext';
import { theme } from '../../src/constants/theme';
import { AppButton } from '../../src/components/AppButton';
import { useVideoPlayer, VideoView } from 'expo-video';

export default function MediaViewer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items } = useVault();
  const router = useRouter();
  
  const item = items.find(i => i.id === id);

  // Initialize video player only if it's a video
  const player = useVideoPlayer(item?.type === 'video' ? item.uri : null, player => {
    player.loop = true;
    player.play();
  });

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Archivo no encontrado</Text>
        <AppButton title="Volver" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppButton title="Cerrar" variant="outline" onPress={() => router.back()} style={styles.closeBtn} />
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="middle">{item.name}</Text>
      </View>
      
      <View style={styles.content}>
        {item.type === 'image' ? (
          <Image 
            source={{ uri: item.uri }} 
            style={styles.image} 
            resizeMode="contain" 
          />
        ) : item.type === 'video' ? (
          <VideoView 
            style={styles.video} 
            player={player} 
            allowsFullscreen 
            allowsPictureInPicture 
          />
        ) : (
          <Text style={styles.errorText}>Formato no soportado</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background for media viewer
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  closeBtn: {
    minHeight: 40,
    paddingVertical: 8,
    marginRight: theme.spacing.md,
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
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
