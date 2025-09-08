import { setupMockAdapter } from '../lib/mockAdapter';

// Configuração do ambiente
export const appConfig = {
  // URL base da API
  API_BASE_URL: 'https://abitus-api.geia.vip/v1',
  
  // Configurações do mock  
  MOCK: {
    // Ativa o mock em desenvolvimento ou quando a variável de ambiente estiver definida
    ENABLED: false,
    
    // Delay simulado para as respostas do mock (em ms)
    DELAY: 500,
  },
  
  // Configurações de paginação padrão
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  
  // Configurações de timeout
  TIMEOUT: {
    REQUEST: 10000, // 10 segundos
    RETRY_DELAY: 1000, // 1 segundo entre tentativas
    MAX_RETRIES: 2,
  }
};

// Inicializa a configuração do mock
export const initializeMock = () => {
  console.log('🔧 Inicializando configuração do mock...');
  console.log('🔧 Mock ENABLED:', appConfig.MOCK.ENABLED);
  
  if (appConfig.MOCK.ENABLED) {
    console.log('🎭 Inicializando Mock Adapter...');
    setupMockAdapter();
    console.log('✅ Mock Adapter inicializado com sucesso');
  } else {
    console.log('🌐 Usando API real');
  }
};


// Função para verificar se o mock está ativo
export const isMockActive = () => {
  console.log('🔍 isMockActive called, returning:', appConfig.MOCK.ENABLED);
  return appConfig.MOCK.ENABLED;
};
