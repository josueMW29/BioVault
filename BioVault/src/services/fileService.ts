import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { VaultFile, FileType } from '../types/file';

const VAULT_DIR = `${FileSystem.documentDirectory}biovault/`;

export const initVaultDirectory = async () => {
  const dirInfo = await FileSystem.getInfoAsync(VAULT_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(VAULT_DIR, { intermediates: true });
  }
};

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

export const importImageOrVideo = async (): Promise<VaultFile | null> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: false,
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const asset = result.assets[0];
    const fileName = asset.fileName || `media_${Date.now()}`;
    const destUri = `${VAULT_DIR}${generateId()}_${fileName}`;
    
    await FileSystem.copyAsync({
      from: asset.uri,
      to: destUri
    });

    const fileInfo = await FileSystem.getInfoAsync(destUri);

    return {
      id: generateId(),
      name: fileName,
      uri: destUri,
      type: asset.type === 'video' ? 'video' : 'photo',
      size: fileInfo.exists ? fileInfo.size : 0,
      createdAt: Date.now(),
      mimeType: asset.mimeType
    };
  }
  return null;
};

export const importDocument = async (): Promise<VaultFile | null> => {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const asset = result.assets[0];
    const destUri = `${VAULT_DIR}${generateId()}_${asset.name}`;
    
    await FileSystem.copyAsync({
      from: asset.uri,
      to: destUri
    });

    return {
      id: generateId(),
      name: asset.name,
      uri: destUri,
      type: 'document',
      size: asset.size,
      createdAt: Date.now(),
      mimeType: asset.mimeType
    };
  }
  return null;
};

export const deleteFileFromVault = async (uri: string) => {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
    return true;
  } catch (error) {
    console.error("Error al eliminar archivo:", error);
    return false;
  }
};
