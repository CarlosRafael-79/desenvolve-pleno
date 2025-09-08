import { useState, useCallback } from 'react';
import { DesaparecidosService } from '../services/desaparecidosService';
import { InformacoesDesaparecidoResponse, InformacaoDesaparecido } from '../types/api';

interface UseInformacoesDesaparecidoReturn {
  data: {
    content: InformacoesDesaparecidoResponse;
    totalPages: number;
    currentPage: number;
    totalElements: number;
  } | null;
  loading: boolean;
  error: string | null;
  informacoes: InformacaoDesaparecido[];
  totalInformacoes: number;
  buscarInformacoes: (ocorrenciaId: number) => Promise<void>;
  limparInformacoes: () => void;
}

export const useInformacoesDesaparecido = (): UseInformacoesDesaparecidoReturn => {
  const [data, setData] = useState<{
    content: InformacoesDesaparecidoResponse;
    totalPages: number;
    currentPage: number;
    totalElements: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarInformacoes = useCallback(async (ocorrenciaId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await DesaparecidosService.buscarInformacoesDesaparecido(ocorrenciaId);
      setData(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar informações:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const limparInformacoes = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    informacoes: data?.content || [],
    totalInformacoes: data?.totalElements || 0,
    buscarInformacoes,
    limparInformacoes,
  };
};
