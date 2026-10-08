import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { VaultFile } from '../types/file';
import { initVaultDirectory } from '../services/fileService';

interface VaultContextType {
  isUnlocked: boolean;
  unlockVault: () => void;
  lockVault: () => void;
  files: VaultFile[];
  addFile: (file: VaultFile) => void;
  removeFile: (id: string, uri: string) => void;
  loadFiles: () => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [files, setFiles] = useState<VaultFile[]>([]);

  useEffect(() => {
    initVaultDirectory();
    loadFilesFromStorage();
  }, []);

  const loadFilesFromStorage = async () => {
    try {
      const storedFiles = await SecureStore.getItemAsync('vault_metadata');
      if (storedFiles) {
        setFiles(JSON.parse(storedFiles));
      }
    } catch (e) {
      console.error("Error al cargar metadatos", e);
    }
  };

  const saveFilesToStorage = async (newFiles: VaultFile[]) => {
    try {
      await SecureStore.setItemAsync('vault_metadata', JSON.stringify(newFiles));
    } catch (e) {
      console.error("Error al guardar metadatos", e);
    }
  };

  const unlockVault = () => setIsUnlocked(true);
  const lockVault = () => setIsUnlocked(false);

  const addFile = (file: VaultFile) => {
    const updated = [file, ...files];
    setFiles(updated);
    saveFilesToStorage(updated);
  };

  const removeFile = (id: string, uri: string) => {
    const updated = files.filter(f => f.id !== id);
    setFiles(updated);
    saveFilesToStorage(updated);
  };

  return (
    <VaultContext.Provider value={{ isUnlocked, unlockVault, lockVault, files, addFile, removeFile, loadFiles: loadFilesFromStorage }}>
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (context === undefined) throw new Error('useVault debe usarse dentro de VaultProvider');
  return context;
};
