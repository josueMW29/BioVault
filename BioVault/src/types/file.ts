export type FileType = 'photo' | 'video' | 'document';

export interface VaultFile {
  id: string;
  name: string;
  uri: string;
  type: FileType;
  size?: number;
  createdAt: number;
  mimeType?: string;
}
