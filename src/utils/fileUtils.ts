export const formatBytes = (bytes?: number, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getFileType = (mimeType: string | undefined, fileName: string): 'image' | 'video' | 'document' | 'other' => {
  if (mimeType) {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType === 'application/pdf' || mimeType.includes('document') || mimeType.includes('text')) return 'document';
  }
  
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
  if (['mp4', 'mov', 'avi'].includes(ext || '')) return 'video';
  if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) return 'document';
  
  return 'other';
};
