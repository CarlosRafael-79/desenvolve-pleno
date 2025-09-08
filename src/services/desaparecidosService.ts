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
    } catch (error: unknown) {
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

      const response = await apiRequest<unknown>({
        method: 'GET',
        url: `/ocorrencias/informacoes-desaparecido?ocorrenciaId=${ocorrenciaId}&page=${page}`,
      });

      console.log(`🔍 Resposta completa da API:`, response);
      console.log(`🔍 Tipo da resposta:`, typeof response);
      console.log(`🔍 É array?`, Array.isArray(response));
      console.log(`🔍 Tem content?`, (response as { content?: unknown })?.content);
      console.log(`🔍 Content é array?`, Array.isArray((response as { content?: unknown })?.content));

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
      } else if ((response as { value?: unknown[] }).value && Array.isArray((response as { value?: unknown[] }).value)) {
        // Se a resposta tem estrutura com 'value' (estrutura da API real)
        content = (response as { value: unknown[] }).value as InformacoesDesaparecidoResponse;
        totalElements = (response as { Count?: number }).Count || (response as { value: unknown[] }).value.length;
        totalPages = Math.ceil(totalElements / 10) || 1;
        console.log(`📊 Resposta tem estrutura 'value' com ${totalElements} itens`);
      } else if ((response as { content?: unknown[] }).content && Array.isArray((response as { content?: unknown[] }).content)) {
        // Se a resposta tem estrutura paginada
        content = (response as { content: unknown[] }).content as InformacoesDesaparecidoResponse;
        totalElements = (response as { totalElements?: number }).totalElements || (response as { content: unknown[] }).content.length;
        totalPages = (response as { totalPages?: number }).totalPages || Math.ceil(totalElements / 10) || 1;
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
    localizacao: string = '',
    telefone: string = '',
    anexos: File[] = []
  ): Promise<{ success: boolean; message: string; data?: unknown }> {
    try {
      console.log(`📤 Enviando informação para ocorrência ${ocorrenciaId}...`);

      // Concatenar todas as informações no campo informacao
      let informacaoCompleta = informacao;
      
      if (localizacao && localizacao.trim()) {
        informacaoCompleta += `\n\n📍 Localização: ${localizacao}`;
      }
      
      if (telefone && telefone.trim()) {
        informacaoCompleta += `\n\n📞 Telefone para contato: ${telefone}`;
      }

      console.log('📝 Informação completa:', informacaoCompleta);
      console.log('📅 Data:', data);
      console.log('🆔 Ocorrência ID:', ocorrenciaId);
      console.log('📎 Anexos:', anexos.length);

      // Construir a URL com parâmetros de query
      const params = new URLSearchParams();
      params.append('informacao', informacaoCompleta);
      params.append('data', data);
      params.append('ocoId', ocorrenciaId.toString());
      
      // Adicionar descricao se houver (baseado no exemplo curl)
      if (informacaoCompleta) {
        params.append('descricao', informacaoCompleta);
      }

      const url = `/ocorrencias/informacoes-desaparecido?${params.toString()}`;

      const requestConfig = {
        method: 'POST' as const,
        url,
        data: undefined as FormData | undefined,
      };

      // Se há anexos, usar FormData
      if (anexos.length > 0) {
        const formData = new FormData();
        
        // Adicionar arquivos
        anexos.forEach((file, index) => {
          formData.append('files', file);
          console.log(`📎 Arquivo ${index + 1}:`, file.name, file.size);
        });

        requestConfig.data = formData;
      } else {
        // Se não há anexos, enviar FormData vazio (como no exemplo curl)
        const formData = new FormData();
        formData.append('files', '');
        requestConfig.data = formData;
      }

      // Fazer a requisição POST
      const response = await apiRequest<unknown>(requestConfig);

      console.log(`✅ Informação enviada com sucesso para ocorrência ${ocorrenciaId}`);
      return {
        success: true,
        message: 'Informação enviada com sucesso!',
        data: response
      };

    } catch (error: unknown) {
      console.error(`❌ Erro ao enviar informação para ocorrência ${ocorrenciaId}:`, error);
      console.error(`❌ Detalhes do erro:`, (error as { response?: { data?: unknown } }).response?.data);
      console.error(`❌ Status do erro:`, (error as { response?: { status?: number } }).response?.status);
      
      let errorMessage = 'Erro ao enviar informação. Tente novamente.';
      
      if ((error as { code?: string }).code === 'ECONNABORTED' || (error as { message?: string }).message?.includes('timeout')) {
        errorMessage = 'Timeout: O upload está demorando muito. Tente com arquivos menores ou verifique sua conexão.';
      } else if ((error as { response?: { status?: number } }).response?.status === 413) {
        errorMessage = 'Arquivo muito grande. Tente com arquivos menores que 10MB.';
      } else if ((error as { response?: { status?: number } }).response?.status && (error as { response?: { status?: number } }).response!.status! >= 500) {
        errorMessage = 'Erro no servidor. Tente novamente em alguns minutos.';
      } else if ((error as { response?: { status?: number } }).response?.status === 400) {
        errorMessage = 'Dados inválidos. Verifique as informações e tente novamente.';
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }
}
