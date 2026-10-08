export type FileType = 'image' | 'video' | 'document' | 'other';

export interface VaultItem {
  id: string;
  name: string;
  uri: string;
  type: FileType;
  mimeType?: string;
  size?: number;
  createdAt: number;
}
