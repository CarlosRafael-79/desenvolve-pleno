import { apiRequest } from '../lib/axios';
import { ApiResponse, FiltroParams, EstatisticasResponse, InformacoesDesaparecidoResponse, PessoaDesaparecida } from '../types/api';

export class DesaparecidosService {
  private static readonly BASE_URL = '/pessoas/aberto/filtro';

  /**
   * Busca pessoas desaparecidas com filtros opcionais
   */
  static async buscarPessoasDesaparecidas(filtros: FiltroParams = {}): Promise<ApiResponse> {
    try {
      // Constrói os parâmetros da query string
      const params = new URLSearchParams();
      
      if (filtros.pagina !== undefined) params.append('pagina', filtros.pagina.toString());
      if (filtros.porPagina !== undefined) params.append('porPagina', filtros.porPagina.toString());
      if (filtros.nome) params.append('nome', filtros.nome);
      if (filtros.faixaIdadeInicial !== undefined) params.append('faixaIdadeInicial', filtros.faixaIdadeInicial.toString());
      if (filtros.faixaIdadeFinal !== undefined) params.append('faixaIdadeFinal', filtros.faixaIdadeFinal.toString());
      if (filtros.sexo) params.append('sexo', filtros.sexo);
      if (filtros.status) params.append('status', filtros.status);

      const queryString = params.toString();
      const url = queryString ? `${this.BASE_URL}?${queryString}` : this.BASE_URL;

      console.log(`🔍 Buscando pessoas desaparecidas: ${url}`);
      console.log(`🔍 URL completa: ${this.BASE_URL}`);
      console.log(`🔍 Query string: ${queryString}`);

      const response = await apiRequest<ApiResponse>({
        method: 'GET',
        url,
      });

      console.log(`✅ Encontradas ${response.totalElements} pessoas desaparecidas`);
      return response;

    } catch (error) {
      console.error('❌ Erro ao buscar pessoas desaparecidas:', error);
      throw new Error('Falha ao carregar dados de pessoas desaparecidas');
    }
  }








  /**
   * Busca com múltiplos filtros
   */
  static async buscarComFiltros(filtros: FiltroParams): Promise<ApiResponse> {
    return this.buscarPessoasDesaparecidas(filtros);
  }

  /**
   * Busca uma pessoa específica por ID
   */
  static async buscarPessoaPorId(id: number): Promise<PessoaDesaparecida> {
    try {
      console.log(`🔍 Buscando pessoa com ID: ${id}`);
      const response = await apiRequest<PessoaDesaparecida>({
        method: 'GET',
        url: `/pessoas/${id}`,
      });
      console.log(`✅ Pessoa encontrada:`, response);
      return response;
    } catch (error: any) {
      console.error(`❌ Erro ao buscar pessoa com ID ${id}:`, error);
      throw new Error('Falha ao carregar dados da pessoa');
    }
  }

  /**
   * Busca estatísticas de pessoas desaparecidas
   */
  static async buscarEstatisticas(): Promise<EstatisticasResponse> {
    try {
      console.log('📊 Buscando estatísticas...');

      const response = await apiRequest<EstatisticasResponse>({
        method: 'GET',
        url: '/pessoas/aberto/estatistico',
      });

      console.log(`✅ Estatísticas carregadas: ${response.quantPessoasDesaparecidas} desaparecidas, ${response.quantPessoasEncontradas} encontradas`);
      return response;

    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      throw new Error('Falha ao carregar estatísticas');
    }
  }

  /**
   * Busca informações de uma ocorrência específica com paginação
   */
  static async buscarInformacoesDesaparecido(ocorrenciaId: number, page: number = 1): Promise<{
    content: InformacoesDesaparecidoResponse;
    totalPages: number;
    currentPage: number;
    totalElements: number;
  }> {
    try {
      console.log(`📋 Buscando informações da ocorrência ${ocorrenciaId}, página ${page}...`);

      const response = await apiRequest<any>({
        method: 'GET',
        url: `/ocorrencias/informacoes-desaparecido?ocorrenciaId=${ocorrenciaId}&page=${page}`,
      });

      console.log(`🔍 Resposta completa da API:`, response);
      console.log(`🔍 Tipo da resposta:`, typeof response);
      console.log(`🔍 É array?`, Array.isArray(response));
      console.log(`🔍 Tem content?`, response?.content);
      console.log(`🔍 Content é array?`, Array.isArray(response?.content));

      // Verificar se a resposta existe
      if (!response) {
        console.warn(`⚠️ Resposta vazia para ocorrência ${ocorrenciaId}`);
        return {
          content: [],
          totalPages: 1,
          currentPage: page,
          totalElements: 0
        };
      }

      // Se a resposta é um array direto, transformamos em formato paginado
      let content: InformacoesDesaparecidoResponse;
      let totalElements: number;
      let totalPages: number;

      if (Array.isArray(response)) {
        // Se a resposta é um array direto
        content = response;
        totalElements = response.length;
        totalPages = Math.ceil(totalElements / 10) || 1;
        console.log(`📊 Resposta é array direto com ${totalElements} itens`);
      } else if (response.value && Array.isArray(response.value)) {
        // Se a resposta tem estrutura com 'value' (estrutura da API real)
        content = response.value;
        totalElements = response.Count || response.value.length;
        totalPages = Math.ceil(totalElements / 10) || 1;
        console.log(`📊 Resposta tem estrutura 'value' com ${totalElements} itens`);
      } else if (response.content && Array.isArray(response.content)) {
        // Se a resposta tem estrutura paginada
        content = response.content;
        totalElements = response.totalElements || response.content.length;
        totalPages = response.totalPages || Math.ceil(totalElements / 10) || 1;
        console.log(`📊 Resposta é paginada com ${totalElements} itens`);
      } else {
        // Se não conseguimos identificar a estrutura
        console.warn(`⚠️ Estrutura de resposta não reconhecida para ocorrência ${ocorrenciaId}`);
        content = [];
        totalElements = 0;
        totalPages = 1;
      }

      console.log(`✅ ${content.length} informações carregadas para a ocorrência ${ocorrenciaId}`);
      
      return {
        content,
        totalPages,
        currentPage: page,
        totalElements
      };

    } catch (error) {
      console.error(`❌ Erro ao buscar informações da ocorrência ${ocorrenciaId}:`, error);
      console.error(`❌ Detalhes do erro:`, error);
      
      // Retornar resposta vazia em caso de erro para não quebrar a UI
      return {
        content: [],
        totalPages: 1,
        currentPage: page,
        totalElements: 0
      };
    }
  }

  /**
   * Envia uma nova informação sobre um desaparecido
   */
  static async enviarInformacaoDesaparecido(
    ocorrenciaId: number,
    informacao: string,
    data: string,
    anexos: File[] = []
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log(`📤 Enviando informação para ocorrência ${ocorrenciaId}...`);

      // Criar FormData para suportar arquivos
      const formData = new FormData();
      
      // Adicionar arquivos se houver
      anexos.forEach((file, index) => {
        formData.append('files', file);
      });

      // Fazer a requisição POST
      const response = await apiRequest<any>({
        method: 'POST',
        url: `/ocorrencias/informacoes-desaparecido?informacao=${encodeURIComponent(informacao)}&data=${data}&ocoId=${ocorrenciaId}`,
        data: formData,
        // Não definir Content-Type manualmente para multipart/form-data
        // O axios define automaticamente com o boundary correto
      });

      console.log(`✅ Informação enviada com sucesso para ocorrência ${ocorrenciaId}`);
      return {
        success: true,
        message: 'Informação enviada com sucesso!',
        data: response
      };

    } catch (error: any) {
      console.error(`❌ Erro ao enviar informação para ocorrência ${ocorrenciaId}:`, error);
      
      let errorMessage = 'Erro ao enviar informação. Tente novamente.';
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'Timeout: O upload está demorando muito. Tente com arquivos menores ou verifique sua conexão.';
      } else if (error.response?.status === 413) {
        errorMessage = 'Arquivo muito grande. Tente com arquivos menores que 10MB.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Erro no servidor. Tente novamente em alguns minutos.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Dados inválidos. Verifique as informações e tente novamente.';
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }
}
