export const ApiRoutes = {
  // localhost yerine 127.0.0.1 kullanıyoruz
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000',
  
  // Backend'deki gerçek uç noktamız
  GENERATE_IMAGE: '/ai/enhance',
  GET_HISTORY: '/ai/history',
} as const;

export type ApiRoutesType = typeof ApiRoutes[keyof typeof ApiRoutes];