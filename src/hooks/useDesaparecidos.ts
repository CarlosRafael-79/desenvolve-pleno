import { useState, useEffect, useCallback } from 'react';
import { DesaparecidosService } from '../services/desaparecidosService';
import { ApiResponse, FiltroParams, PessoaDesaparecida } from '../types/api';

interface UseDesaparecidosReturn {
  data: ApiResponse | null;
  loading: boolean;
  error: string | null;
  pessoas: PessoaDesaparecida[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  buscarPessoas: (filtros?: FiltroParams) => Promise<void>;
}

export const useDesaparecidos = (filtrosIniciais?: FiltroParams): UseDesaparecidosReturn => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtrosAtuais, setFiltrosAtuais] = useState<FiltroParams>({
    pagina: 0,
    porPagina: 12,
    ...filtrosIniciais
  });

  const buscarPessoas = useCallback(async (filtros?: FiltroParams) => {
    setLoading(true);
    setError(null);
    
    try {
      // Se filtros são fornecidos, usa eles diretamente (substitui os atuais)
      // Se não, usa os filtros atuais
      const filtrosParaUsar = filtros !== undefined ? filtros : filtrosAtuais;
      setFiltrosAtuais(filtrosParaUsar);
      
      console.log('🔍 Buscando com filtros:', filtrosParaUsar);
      const response = await DesaparecidosService.buscarPessoasDesaparecidas(filtrosParaUsar);
      setData(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar pessoas desaparecidas:', err);
    } finally {
      setLoading(false);
    }
  }, [filtrosAtuais]);


  // Carrega dados iniciais
  useEffect(() => {
    buscarPessoas();
  }, []);

  return {
    data,
    loading,
    error,
    pessoas: data?.content || [],
    totalPages: data?.totalPages || 0,
    totalElements: data?.totalElements || 0,
    currentPage: data?.number || 0,
    hasNextPage: data ? !data.last : false,
    hasPreviousPage: data ? !data.first : false,
    buscarPessoas,
  };
};
