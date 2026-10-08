import fileService from '../src/services/fileService';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('expo-file-system', () => ({
  documentDirectory: 'file://document/dir/',
  getInfoAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  copyAsync: jest.fn(),
  deleteAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('FileService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should import a file and save metadata', async () => {
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: true });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));

    const result = await fileService.importFile('file://source/path.jpg', 'image.jpg', 'image/jpeg', 1024);

    expect(result).not.toBeNull();
    expect(result?.name).toBe('image.jpg');
    expect(result?.type).toBe('image');
    expect(FileSystem.copyAsync).toHaveBeenCalled();
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('should delete a file', async () => {
    const mockItem = { id: '123', uri: 'file://path', name: 'test.jpg' };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockItem]));
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: true });

    const success = await fileService.deleteFile('123');

    expect(success).toBe(true);
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith('file://path');
    
    // Check it saves the empty array
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@biovault_items', '[]');
  });
});
