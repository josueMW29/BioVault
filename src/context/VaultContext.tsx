import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import lockService from '../services/lockService';
import fileService from '../services/fileService';
import biometricService from '../services/biometricService';
import { VaultItem } from '../types/file';

interface VaultContextType {
  isUnlocked: boolean;
  unlock: () => Promise<boolean>;
  lock: () => void;
  items: VaultItem[];
  loadItems: () => Promise<void>;
  importFile: (uri: string, name: string, mimeType?: string, size?: number) => Promise<boolean>;
  deleteFile: (id: string) => Promise<boolean>;
  isLoading: boolean;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider = ({ children }: { children: ReactNode }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [items, setItems] = useState<VaultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize vault directory and load items on start
  useEffect(() => {
    const init = async () => {
      await fileService.initVault();
      // Items are loaded but NOT shown until unlocked, managed by UI.
      setIsLoading(false);
    };
    init();
  }, []);

  // Handle app background/foreground for auto-lock
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        const autoLock = await lockService.isAutoLockEnabled();
        if (autoLock && isUnlocked) {
          lock();
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isUnlocked]);

  const loadItems = async () => {
    setIsLoading(true);
    const loadedItems = await fileService.getVaultItems();
    setItems(loadedItems);
    setIsLoading(false);
  };

  const unlock = async (): Promise<boolean> => {
    const success = await biometricService.authenticate();
    if (success) {
      setIsUnlocked(true);
      await loadItems();
    }
    return success;
  };

  const lock = () => {
    setIsUnlocked(false);
    setItems([]); // Clear from memory when locked
  };

  const importFile = async (uri: string, name: string, mimeType?: string, size?: number): Promise<boolean> => {
    const newItem = await fileService.importFile(uri, name, mimeType, size);
    if (newItem) {
      setItems(prev => [newItem, ...prev]);
      return true;
    }
    return false;
  };

  const deleteFile = async (id: string): Promise<boolean> => {
    const success = await fileService.deleteFile(id);
    if (success) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
    return success;
  };

  return (
    <VaultContext.Provider value={{
      isUnlocked,
      unlock,
      lock,
      items,
      loadItems,
      importFile,
      deleteFile,
      isLoading
    }}>
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};
