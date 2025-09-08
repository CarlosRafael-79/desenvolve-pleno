import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Configuração base do Axios
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: 'https://abitus-api.geia.vip/v1',
    timeout: 10000,
    headers: {
      'Accept': '*/*',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      console.log(`🚀 Making request to: ${config.method?.toUpperCase()} ${config.url}`);
      console.log(`🚀 Base URL: ${config.baseURL}`);
      console.log(`🚀 Full URL: ${config.baseURL}${config.url}`);
      
      // Se for FormData, remover Content-Type para que o axios defina automaticamente
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
        console.log(`🚀 FormData detected, Content-Type will be set automatically`);
      }
      
      return config;
    },
    (error) => {
      console.error('❌ Request error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`✅ Response received: ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      console.error('❌ Response error:', error.response?.status, error.message);
      
      // Se a API estiver offline, podemos tentar usar o mock
      if (error.code === 'NETWORK_ERROR' || error.response?.status >= 500) {
        console.warn('🔄 API appears to be offline, consider using mock data');
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

export const apiClient = createAxiosInstance();

// Função para fazer requisições com retry automático
export const apiRequest = async <T>(
  config: AxiosRequestConfig,
  retries: number = 2
): Promise<T> => {
  try {
    // Aumentar timeout para uploads de arquivos
    const timeout = config.data instanceof FormData ? 30000 : 10000; // 30s para FormData, 10s para outros
    
    const response = await apiClient.request<T>({
      ...config,
      timeout
    });
    return response.data;
  } catch (error) {
    if (retries > 0 && axios.isAxiosError(error)) {
      console.log(`🔄 Retrying request... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      return apiRequest<T>(config, retries - 1);
    }
    throw error;
  }
};
