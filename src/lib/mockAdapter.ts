import MockAdapter from 'axios-mock-adapter';
import { apiClient } from './axios';
import { ApiResponse } from '../types/api';

// Mock data para estatísticas
const mockStatsResponse = {
  "quantPessoasDesaparecidas": 30,
  "quantPessoasEncontradas": 22
};

// Mock data para informações de desaparecido (versão simplificada)
const mockInfoResponse = [
  {
    "ocoId": 1527,
    "informacao": "Estava no CPA 3 comendo pastel, é verdade",
    "data": "2022-01-20",
    "id": 1696,
    "anexos": []
  },
  {
    "ocoId": 1527,
    "informacao": "Visto na casa do Lucas onde passou 3 dias",
    "data": "2025-05-04",
    "id": 1643,
    "anexos": []
  },
  {
    "ocoId": 1527,
    "informacao": "Vi dia 08/04 no centro de Cuiabá",
    "data": "2025-04-08",
    "id": 1594,
    "anexos": []
  },
  {
    "ocoId": 1527,
    "informacao": "FOI VISTO NO BAIRRO BOA ESPERANÇA",
    "data": "2022-01-20",
    "id": 1795,
    "anexos": []
  },
  {
    "ocoId": 1527,
    "informacao": "Essa senhora foi vista no estúdio do Zorra Total",
    "data": "2025-04-05",
    "id": 1510,
    "anexos": [
      "https://s3dev.pjc.mt.gov.br/abitus.informacao-desaparecido/be18e0a9-299e-49a1-9664-d39fc08b0267.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pjc%40dev%2F20250905%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250905T194326Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Signature=af86acef0e07e72aff130a22b6be606c5991462106a9cdb2088484a8b01c55a8"
    ]
  },
  {
    "ocoId": 1527,
    "informacao": "Teste de envio\r\nTeste de envio",
    "data": "2025-09-05",
    "id": 2014,
    "anexos": []
  },
  {
    "ocoId": 1527,
    "informacao": "Olá vi no CPA",
    "data": "2025-09-05",
    "id": 2013,
    "anexos": []
  },
  {
    "ocoId": 1527,
    "informacao": "Foi visto na RUA XYZ",
    "data": "2025-09-01",
    "id": 1710,
    "anexos": []
  },
  {
    "ocoId": 1527,
    "informacao": "Casa do Lucas",
    "data": "2025-05-08",
    "id": 1646,
    "anexos": []
  },
  {
    "ocoId": 1527,
    "informacao": "Estava perdida",
    "data": "2025-09-02",
    "id": 1835,
    "anexos": []
  }
];

// Mock data baseado na resposta da API fornecida
const mockApiResponse: ApiResponse = {
  "totalPages": 45,
  "totalElements": 449,
  "first": true,
  "last": false,
  "numberOfElements": 10,
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "unsorted": true,
      "sorted": false,
      "empty": true
    },
    "offset": 0,
    "unpaged": false,
    "paged": true
  },
  "size": 10,
  "content": [
    {
      "id": 2387,
      "nome": "Carlos Rafael",
      "idade": 0,
      "sexo": "MASCULINO",
      "vivo": true,
      "urlFoto": "https://s3dev.pjc.mt.gov.br/delegaciadigital.desaparecidos/2025/4/b67f72a32061698702164f256d8c712fcc41d827a7aca34cd9c91c4e24fe68b3-1743695106948.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pjc%40dev%2F20250905%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250905T193840Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Signature=123ae6085d3f775d6838208b3512d850d7c95bd9661c352fa32ccd8d8d94e251",
      "ultimaOcorrencia": {
        "dtDesaparecimento": "2025-04-02T22:22:00",
        "dataLocalizacao": "2025-04-03T10:00:00",
        "encontradoVivo": false,
        "localDesaparecimentoConcat": "asdasd - Cuiabá/MT",
        "ocorrenciaEntrevDesapDTO": {
          "informacao": null,
          "vestimentasDesaparecido": "vestido branco"
        },
        "listaCartaz": null,
        "ocoId": 1527
      }
    },
    {
      "id": 2366,
      "nome": "JONATHAN ALVES",
      "idade": 47,
      "sexo": "MASCULINO",
      "vivo": true,
      "urlFoto": "https://s3dev.pjc.mt.gov.br/delegaciadigital.desaparecidos/2025/3/86b08bbb-9404-32d4-95cd-4011912315cd?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pjc%40dev%2F20250905%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250905T193840Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Signature=1a60a12610f7f57796fd194fa92bc76200c6b10f217546da28fc27b850c081fc",
      "ultimaOcorrencia": {
        "dtDesaparecimento": "2025-04-02T11:11:00",
        "dataLocalizacao": "2025-04-03T10:00:00",
        "encontradoVivo": false,
        "localDesaparecimentoConcat": "centro - Várzea Grande/MT",
        "ocorrenciaEntrevDesapDTO": {
          "informacao": null,
          "vestimentasDesaparecido": "estava vestida."
        },
        "listaCartaz": null,
        "ocoId": 1526
      }
    },
    {
      "id": 2386,
      "nome": "ALINA DA SOUZA",
      "idade": 0,
      "sexo": "FEMININO",
      "vivo": true,
      "urlFoto": null,
      "ultimaOcorrencia": {
        "dtDesaparecimento": "2025-04-01T15:00:00",
        "dataLocalizacao": "2025-04-03T10:00:00",
        "encontradoVivo": false,
        "localDesaparecimentoConcat": "terra nova - Cuiabá/MT",
        "ocorrenciaEntrevDesapDTO": {
          "informacao": null,
          "vestimentasDesaparecido": "sdada"
        },
        "listaCartaz": null,
        "ocoId": 1525
      }
    },
    {
      "id": 2364,
      "nome": "JOANA DA SILVA",
      "idade": 40,
      "sexo": "FEMININO",
      "vivo": false,
      "urlFoto": "https://s3dev.pjc.mt.gov.br/abitus.foto-pessoa/2025/04/f8a94ad40086d0fceb3482edac8a9b2375bf39129cb5c6165e3ad7f76f2c6646-1746025960749.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pjc%40dev%2F20250905%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250905T193840Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Signature=bb6f01c77b9cc9e86186c2d32e28c4de4c6581029ef97825a8c1cb89f911ba0f",
      "ultimaOcorrencia": {
        "dtDesaparecimento": "2025-03-27T14:00:00",
        "dataLocalizacao": null,
        "encontradoVivo": false,
        "localDesaparecimentoConcat": "CPAV - Cuiabá/MT",
        "ocorrenciaEntrevDesapDTO": {
          "informacao": "asdas",
          "vestimentasDesaparecido": "SHORT PRETO E CAMISA BRANCA"
        },
        "listaCartaz": null,
        "ocoId": 1524
      }
    },
    {
      "id": 2384,
      "nome": "KAIO ALVES LACERDA",
      "idade": 40,
      "sexo": "MASCULINO",
      "vivo": true,
      "urlFoto": "https://s3dev.pjc.mt.gov.br/delegaciadigital.desaparecidos/2025/3/55866d3389c865eb4789ffdbb8deb5cfd21ee4f3a6d241902c9c07387dde9a9e-1743091789341.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pjc%40dev%2F20250905%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250905T193840Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Signature=3f16a8b8b09a24a846e385560def885ca0853ebd1b6204dba1c259107f70f983",
      "ultimaOcorrencia": {
        "dtDesaparecimento": "2025-03-26T15:30:00",
        "dataLocalizacao": "2025-04-03T10:00:00",
        "encontradoVivo": false,
        "localDesaparecimentoConcat": "PEDRA NOVENTA - Cuiabá/MT",
        "ocorrenciaEntrevDesapDTO": {
          "informacao": null,
          "vestimentasDesaparecido": "CALÇA BRANCA E CAMISETA AZUL DE MANGA LONGA"
        },
        "listaCartaz": null,
        "ocoId": 1522
      }
    },
    {
      "id": 2385,
      "nome": "HUGO DA SILVA",
      "idade": 0,
      "sexo": "MASCULINO",
      "vivo": true,
      "urlFoto": "https://s3dev.pjc.mt.gov.br/delegaciadigital.desaparecidos/2025/3/42a2dffab80003b49f259af60b0bb7c3e504ecdbcfdc5f550899ddf06da26126-1743099900685.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pjc%40dev%2F20250905%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250905T193840Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Signature=0c3e67945f01d1a9c7bf67f08708acceecf3bfecf9149f2620fc532cf3e0ac7a",
      "ultimaOcorrencia": {
        "dtDesaparecimento": "2025-03-26T15:00:00",
        "dataLocalizacao": "2025-04-03T10:00:00",
        "encontradoVivo": false,
        "localDesaparecimentoConcat": "terra nova - Cuiabá/MT",
        "ocorrenciaEntrevDesapDTO": {
          "informacao": null,
          "vestimentasDesaparecido": ""
        },
        "listaCartaz": null,
        "ocoId": 1523
      }
    },
    {
      "id": 2382,
      "nome": "MARIA DESAPARECIDA",
      "idade": 0,
      "sexo": "FEMININO",
      "vivo": true,
      "urlFoto": null,
      "ultimaOcorrencia": {
        "dtDesaparecimento": "2025-03-24T10:00:00",
        "dataLocalizacao": "2025-04-03T10:00:00",
        "encontradoVivo": false,
        "localDesaparecimentoConcat": "cenytro - Cuiabá/MT",
        "ocorrenciaEntrevDesapDTO": {
          "informacao": null,
          "vestimentasDesaparecido": ""
        },
        "listaCartaz": null,
        "ocoId": 1519
      }
    },
    {
      "id": 2335,
      "nome": "João da Silva",
      "idade": 35,
      "sexo": "MASCULINO",
      "vivo": true,
      "urlFoto": "https://s3dev.pjc.mt.gov.br/abitus.foto-pessoa/3f96ad2b10594470833957b77ff420fedc794ef89d51c9bdef0e321bc301c0fc-1621948089453.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pjc%40dev%2F20250905%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250905T193840Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Signature=a7e03aa2be5d406abfff27c4ea813e1a6c5bdd9543b047f6ede17a1873c85440",
      "ultimaOcorrencia": {
        "dtDesaparecimento": "2025-03-21T20:34:06.069",
        "dataLocalizacao": "2025-04-03T10:00:00",
        "encontradoVivo": true,
        "localDesaparecimentoConcat": "Jardim das Acácias - Brasiléia/SP",
        "ocorrenciaEntrevDesapDTO": {
          "informacao": "A pessoa foi vista pela última vez em frente à sua casa.",
          "vestimentasDesaparecido": "Camisa branca e jeans"
        },
        "listaCartaz": null,
        "ocoId": 1517
      }
    },
    {
      "id": 2341,
      "nome": "CRISTIANE RUSSO DE SOUSA",
      "idade": 65,
      "sexo": "MASCULINO",
      "vivo": false,
      "urlFoto": "https://s3dev.pjc.mt.gov.br/abitus.foto-pessoa/2025/04/4e24828aa7a05fb05853e2e12ed3c9c810399301aa120ea27d75547b303d5fbb-1746026724559.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pjc%40dev%2F20250905%2Fus-east-1%2Fsus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250905T193840Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Signature=db74df795db7d4a75c8e60d4771ad3fd7089ad69c5734f6d46dc9beefc0295c4",
      "ultimaOcorrencia": {
        "dtDesaparecimento": "2025-03-19T14:22:00",
        "dataLocalizacao": null,
        "encontradoVivo": false,
        "localDesaparecimentoConcat": "asdsd - Cuiabá/MT",
        "ocorrenciaEntrevDesapDTO": {
          "informacao": "asdasd",
          "vestimentasDesaparecido": "ASDA"
        },
        "listaCartaz": null,
        "ocoId": 1515
      }
    },
    {
      "id": 2379,
      "nome": "ASDASDA",
      "idade": 29,
      "sexo": "MASCULINO",
      "vivo": true,
      "urlFoto": "https://s3dev.pjc.mt.gov.br/abitus.foto-pessoa/2025/04/2dbc9815c995477b79fa1701d5f31e1e1f0b2b1ec39c2460f7dc5064f8c5e050-1746025112278.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pjc%40dev%2F20250905%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250905T193840Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Signature=9b39652cfc3b8c694c20214a621f03f1f87a084c0f3a49e2e1878a7f49485784",
      "ultimaOcorrencia": {
        "dtDesaparecimento": "2025-03-18T11:11:00",
        "dataLocalizacao": "2025-04-03T10:00:00",
        "encontradoVivo": false,
        "localDesaparecimentoConcat": "ASDASDAS - Barra do Garças/MT",
        "ocorrenciaEntrevDesapDTO": {
          "informacao": null,
          "vestimentasDesaparecido": "ASDASD"
        },
        "listaCartaz": null,
        "ocoId": 1516
      }
    }
  ],
  "number": 0,
  "sort": {
    "unsorted": true,
    "sorted": false,
    "empty": true
  },
  "empty": false
};

// Função para filtrar dados baseado nos parâmetros
const filterData = (data: ApiResponse, params: URLSearchParams): ApiResponse => {
  let filteredContent = [...data.content];

  // Filtro por nome
  const nome = params.get('nome');
  if (nome) {
    filteredContent = filteredContent.filter(pessoa => 
      pessoa.nome.toLowerCase().includes(nome.toLowerCase())
    );
  }

  // Filtro por sexo
  const sexo = params.get('sexo');
  if (sexo) {
    filteredContent = filteredContent.filter(pessoa => pessoa.sexo === sexo);
  }

  // Filtro por faixa de idade inicial
  const faixaIdadeInicial = params.get('faixaIdadeInicial');
  if (faixaIdadeInicial) {
    const idadeMin = parseInt(faixaIdadeInicial);
    filteredContent = filteredContent.filter(pessoa => pessoa.idade >= idadeMin);
  }

  // Filtro por faixa de idade final
  const faixaIdadeFinal = params.get('faixaIdadeFinal');
  if (faixaIdadeFinal) {
    const idadeMax = parseInt(faixaIdadeFinal);
    filteredContent = filteredContent.filter(pessoa => pessoa.idade <= idadeMax);
  }

  // Filtro por status
  const status = params.get('status');
  if (status) {
    if (status === 'DESAPARECIDO') {
      filteredContent = filteredContent.filter(pessoa => !pessoa.ultimaOcorrencia.dataLocalizacao);
    } else if (status === 'LOCALIZADO') {
      filteredContent = filteredContent.filter(pessoa => pessoa.ultimaOcorrencia.dataLocalizacao);
    }
  }

  // Paginação
  const pagina = parseInt(params.get('pagina') || '0');
  const porPagina = parseInt(params.get('porPagina') || '10');
  const startIndex = pagina * porPagina;
  const endIndex = startIndex + porPagina;
  const paginatedContent = filteredContent.slice(startIndex, endIndex);

  return {
    ...data,
    content: paginatedContent,
    totalElements: filteredContent.length,
    totalPages: Math.ceil(filteredContent.length / porPagina),
    numberOfElements: paginatedContent.length,
    size: porPagina,
    number: pagina,
    first: pagina === 0,
    last: pagina >= Math.ceil(filteredContent.length / porPagina) - 1,
    pageable: {
      ...data.pageable,
      pageNumber: pagina,
      pageSize: porPagina,
      offset: startIndex
    }
  };
};

// Cria o mock adapter
let mockAdapter: MockAdapter | null = null;

const createMockAdapter = () => {
  if (!mockAdapter) {
    console.log('🔧 Criando Mock Adapter...');
    mockAdapter = new MockAdapter(apiClient, { delayResponse: 500 });
    console.log('✅ Mock Adapter criado');
  }
  return mockAdapter;
};

// Configura os mocks
export const setupMockAdapter = () => {
  console.log('🔧 Configurando Mock Adapter...');
  
  const adapter = createMockAdapter();
  
  // Mock para a API de pessoas desaparecidas - versão mais genérica
  adapter.onGet(/\/pessoas\/aberto\/filtro/).reply((config) => {
    console.log('🎭 Mock Adapter: Intercepting pessoas request!');
    console.log('🎭 Mock Adapter: Request URL:', config.url);
    console.log('🎭 Mock Adapter: Request method:', config.method);
    console.log('🎭 Mock Adapter: Base URL:', config.baseURL);
    
    const url = new URL(config.url || '', config.baseURL || 'https://abitus-api.geia.vip/v1');
    const params = url.searchParams;
    
    console.log('🎭 Mock Adapter: Query params:', Object.fromEntries(params.entries()));
    
    const filteredData = filterData(mockApiResponse, params);
    
    console.log('🎭 Mock Adapter: Returning mock data with', filteredData.content.length, 'items');
    return [200, filteredData];
  });

  // Mock adicional para capturar qualquer requisição que não seja interceptada
  adapter.onAny().reply((config) => {
    console.log('🎭 Mock Adapter: Intercepting ANY request!');
    console.log('🎭 Mock Adapter: Method:', config.method);
    console.log('🎭 Mock Adapter: URL:', config.url);
    console.log('🎭 Mock Adapter: Base URL:', config.baseURL);
    
    // Se for uma requisição para pessoas desaparecidas, retorna os dados mock
    if (config.url?.includes('/pessoas/aberto/filtro')) {
      const url = new URL(config.url || '', config.baseURL || 'https://abitus-api.geia.vip/v1');
      const params = url.searchParams;
      const filteredData = filterData(mockApiResponse, params);
      return [200, filteredData];
    }
    
    // Se for uma requisição para estatísticas, retorna os dados mock
    if (config.url?.includes('/pessoas/aberto/estatistico')) {
      console.log('🎭 Mock Adapter: Intercepting statistics via ANY handler');
      return [200, mockStatsResponse];
    }
    
    // Se for uma requisição para informações de desaparecido, retorna os dados mock
    if (config.url?.includes('/ocorrencias/informacoes-desaparecido')) {
      console.log('🎭 Mock Adapter: Intercepting info via ANY handler');
      return [200, mockInfoResponse];
    }
    
    // Se for uma requisição para pessoa por ID, retorna os dados mock
    if (config.url?.match(/\/pessoas\/\d+$/)) {
      console.log('🎭 Mock Adapter: Intercepting pessoa by ID via ANY handler');
      console.log('🎭 Mock Adapter: Request URL:', config.url);
      
      // Extrai o ID da URL
      const urlParts = config.url?.split('/');
      const id = urlParts?.[urlParts.length - 1];
      console.log('🎭 Mock Adapter: Extracted ID:', id);
      
      // Busca a pessoa nos dados mock
      const pessoa = mockApiResponse.content.find(p => p.id.toString() === id);
      console.log('🎭 Mock Adapter: Available IDs:', mockApiResponse.content.map(p => p.id));
      
      if (pessoa) {
        console.log('🎭 Mock Adapter: Pessoa encontrada:', pessoa.nome);
        return [200, pessoa];
      } else {
        console.log('🎭 Mock Adapter: Pessoa não encontrada para ID:', id);
        return [404, { error: 'Pessoa não encontrada' }];
      }
    }
    
    // Para outras requisições, retorna 404
    return [404, { error: 'Not found' }];
  });

  // Mock para estatísticas
  adapter.onGet(/\/pessoas\/aberto\/estatistico/).reply((config) => {
    console.log('🎭 Mock Adapter: Intercepting statistics request!');
    console.log('🎭 Mock Adapter: Request URL:', config.url);
    console.log('🎭 Mock Adapter: Base URL:', config.baseURL);
    console.log('🎭 Mock Adapter: Returning mock statistics');
    return [200, mockStatsResponse];
  });

  // Mock para informações de desaparecido com paginação
  adapter.onGet(/\/ocorrencias\/informacoes-desaparecido/).reply((config) => {
    console.log('🎭 Mock Adapter: Intercepting info request!');
    console.log('🎭 Mock Adapter: Request URL:', config.url);
    
    // Extrai parâmetros da URL
    const url = new URL(config.url || '', config.baseURL || 'https://abitus-api.geia.vip/v1');
    const params = url.searchParams;
    const page = parseInt(params.get('page') || '1');
    const pageSize = 5; // 5 informações por página
    
    // Simula paginação
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedContent = mockInfoResponse.slice(startIndex, endIndex);
    const totalPages = Math.ceil(mockInfoResponse.length / pageSize);
    
    const response = {
      content: paginatedContent,
      totalPages: totalPages,
      currentPage: page,
      totalElements: mockInfoResponse.length
    };
    
    console.log('🎭 Mock Adapter: Returning paginated info data:', response);
    return [200, response];
  });

  // Mock para pessoa por ID
  adapter.onGet(/\/pessoas\/\d+/).reply((config) => {
    console.log('🎭 Mock Adapter: Intercepting pessoa by ID request!');
    console.log('🎭 Mock Adapter: Request URL:', config.url);
    console.log('🎭 Mock Adapter: Base URL:', config.baseURL);
    console.log('🎭 Mock Adapter: Full URL:', `${config.baseURL}${config.url}`);
    
    // Extrai o ID da URL
    const urlParts = config.url?.split('/');
    const id = urlParts?.[urlParts.length - 1];
    console.log('🎭 Mock Adapter: Extracted ID:', id);
    
    // Busca a pessoa nos dados mock
    const pessoa = mockApiResponse.content.find(p => p.id.toString() === id);
    console.log('🎭 Mock Adapter: Available IDs:', mockApiResponse.content.map(p => p.id));
    
    if (pessoa) {
      console.log('🎭 Mock Adapter: Pessoa encontrada:', pessoa.nome);
      return [200, pessoa];
    } else {
      console.log('🎭 Mock Adapter: Pessoa não encontrada para ID:', id);
      return [404, { error: 'Pessoa não encontrada' }];
    }
  });

  // Mock para simular erro da API (opcional - para testes)
  adapter.onGet('/pessoas/aberto/filtro/error').reply(() => {
    console.log('🎭 Mock Adapter: Simulating API error');
    return [500, { error: 'API temporarily unavailable' }];
  });

  // Mock para POST de informações de desaparecido
  adapter.onPost(/\/ocorrencias\/informacoes-desaparecido/).reply((config) => {
    console.log('🎭 Mock Adapter: Intercepting POST info request!');
    console.log('🎭 Mock Adapter: Request URL:', config.url);
    console.log('🎭 Mock Adapter: Request data type:', typeof config.data);
    console.log('🎭 Mock Adapter: Is FormData:', config.data instanceof FormData);
    
    // Simular delay para simular upload de arquivos
    const delay = Math.random() * 1000 + 500; // 500-1500ms
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular resposta de sucesso
        const mockResponse = {
          ocoId: 1527,
          informacao: "Informação enviada via mock",
          data: new Date().toISOString().split('T')[0],
          id: Math.floor(Math.random() * 10000) + 2000,
          anexos: []
        };
        
        console.log('🎭 Mock Adapter: Returning mock POST response:', mockResponse);
        resolve([200, mockResponse]);
      }, delay);
    });
  });

  console.log('✅ Mock Adapter configured successfully');
};


// Função para verificar se o mock adapter está configurado
export const isMockAdapterConfigured = () => {
  // Verifica se o mock está configurado verificando se há handlers registrados
  return mockAdapter && (mockAdapter.history.get.length > 0 || mockAdapter.history.post.length > 0);
};
