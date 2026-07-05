// Sadece desteklenen görsel tiplerini kabul eden özel bir tip
export type ValidImageMimeType = 'image/jpeg' | 'image/png' | 'image/webp';

export interface ImageUploadPayload {
  id: string; // Gönderilen veriyi eşlemek için
  file: File;
  style: string;
}

export interface FlavorResponse {
  id: string;
  originalImageUrl: string;
  generatedImageUrl: string;
  status: 'success' | 'error';
  message?: string;
}