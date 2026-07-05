import { useState } from 'react';
import { FlavorService } from '../services/api.service';
import type { ImageUploadPayload, FlavorResponse, ValidImageMimeType } from '../core/types/flavor.type';

export const useFlavor = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<FlavorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processImage = async (payload: ImageUploadPayload) => {
    // 1. Güvenlik Duvarı: Dosya tipi kontrolü (PDF vb. engelleme)
    const validTypes: ValidImageMimeType[] = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(payload.file.type as ValidImageMimeType)) {
      setError('Geçersiz format. Lütfen sadece JPG, PNG veya WEBP yükleyin (PDF desteklenmez).');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Servis katmanına isteği iletiyoruz
      const response = await FlavorService.generateImage(payload);
      setResult(response);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Görsel işlenirken sunucu kaynaklı bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setResult(null);
    setError(null);
  };

  return {
    processImage,
    resetState,
    isLoading,
    result,
    error
  };
};