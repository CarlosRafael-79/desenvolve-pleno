import { useState, useEffect, useCallback } from 'react';
import { DesaparecidosService } from '../services/desaparecidosService';
import { EstatisticasResponse } from '../types/api';

interface UseEstatisticasReturn {
  data: EstatisticasResponse | null;
  loading: boolean;
  error: string | null;
  quantPessoasDesaparecidas: number;
  quantPessoasEncontradas: number;
  totalPessoas: number;
  recarregarEstatisticas: () => Promise<void>;
}

export const useEstatisticas = (): UseEstatisticasReturn => {
  const [data, setData] = useState<EstatisticasResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarEstatisticas = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await DesaparecidosService.buscarEstatisticas();
      setData(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar estatísticas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const recarregarEstatisticas = useCallback(async () => {
    await buscarEstatisticas();
  }, [buscarEstatisticas]);

  // Carrega dados iniciais
  useEffect(() => {
    buscarEstatisticas();
  }, [buscarEstatisticas]);

  return {
    data,
    loading,
    error,
    quantPessoasDesaparecidas: data?.quantPessoasDesaparecidas || 0,
    quantPessoasEncontradas: data?.quantPessoasEncontradas || 0,
    totalPessoas: (data?.quantPessoasDesaparecidas || 0) + (data?.quantPessoasEncontradas || 0),
    recarregarEstatisticas,
  };
};
