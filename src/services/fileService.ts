import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VaultItem } from '../types/file';
import { getFileType } from '../utils/fileUtils';

const VAULT_METADATA_KEY = '@biovault_items';
const VAULT_DIR = `${FileSystem.documentDirectory}vault/`;

class FileService {
  /**
   * Initializes the vault directory if it doesn't exist.
   */
  async initVault(): Promise<void> {
    const dirInfo = await FileSystem.getInfoAsync(VAULT_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(VAULT_DIR, { intermediates: true });
    }
  }

  /**
   * Generates a unique ID for a file.
   */
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
  }

  /**
   * Get all items from the vault.
   */
  async getVaultItems(): Promise<VaultItem[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(VAULT_METADATA_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error reading vault metadata:', e);
      return [];
    }
  }

  /**
   * Save vault items metadata.
   */
  private async saveVaultItems(items: VaultItem[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(items);
      await AsyncStorage.setItem(VAULT_METADATA_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving vault metadata:', e);
    }
  }

  /**
   * Import a file into the vault.
   */
  async importFile(sourceUri: string, originalName: string, mimeType?: string, size?: number): Promise<VaultItem | null> {
    try {
      await this.initVault();
      
      const id = this.generateId();
      // Ensure we keep the original extension if possible
      const ext = originalName.split('.').pop();
      const fileName = `${id}${ext ? `.${ext}` : ''}`;
      const destinationUri = `${VAULT_DIR}${fileName}`;

      // Copy file to our secure app sandbox
      await FileSystem.copyAsync({
        from: sourceUri,
        to: destinationUri,
      });

      const type = getFileType(mimeType, originalName);

      const newItem: VaultItem = {
        id,
        name: originalName,
        uri: destinationUri,
        type,
        mimeType,
        size,
        createdAt: Date.now(),
      };

      const items = await this.getVaultItems();
      items.unshift(newItem); // Add to beginning
      await this.saveVaultItems(items);

      return newItem;
    } catch (error) {
      console.error('Error importing file:', error);
      return null;
    }
  }

  /**
   * Delete a file from the vault.
   */
  async deleteFile(id: string): Promise<boolean> {
    try {
      const items = await this.getVaultItems();
      const itemToDelete = items.find(item => item.id === id);
      
      if (!itemToDelete) return false;

      // Remove from filesystem
      const fileInfo = await FileSystem.getInfoAsync(itemToDelete.uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(itemToDelete.uri);
      }

      // Remove from metadata
      const updatedItems = items.filter(item => item.id !== id);
      await this.saveVaultItems(updatedItems);

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
}

export default new FileService();
