import axios from 'axios';
import { ApiRoutes } from '../core/enums/api.enum';
import type { ImageUploadPayload, FlavorResponse } from '../core/types/flavor.type';

// Merkezi Axios istemcisi
const apiClient = axios.create({
  baseURL: ApiRoutes.BASE_URL,
});

export const FlavorService = {
  // SADECE POST İŞLEMİ (Görsel Gönderme)
  generateImage: async (payload: ImageUploadPayload): Promise<FlavorResponse> => {
    const formData = new FormData();
    formData.append('id', payload.id);
    formData.append('file', payload.file);
    formData.append('style', payload.style);

    const response = await apiClient.post<FlavorResponse>(
      ApiRoutes.GENERATE_IMAGE, 
      formData, 
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return response.data;
  },

  // SADECE GET İŞLEMİ (Geçmişi Alma - İleride kullanılacak)
  getHistory: async () => {
    const response = await apiClient.get(ApiRoutes.GET_HISTORY);
    return response.data;
  }
};