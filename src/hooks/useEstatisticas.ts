import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { buscarEstatisticas, limparErro } from '../store/slices/estatisticasSlice';

interface UseEstatisticasReturn {
  data: unknown;
  loading: boolean;
  error: string | null;
  quantPessoasDesaparecidas: number;
  quantPessoasEncontradas: number;
  totalPessoas: number;
  ultimaAtualizacao: string | null;
  recarregarEstatisticas: () => void;
  limparErroAtual: () => void;
}

export const useEstatisticas = (): UseEstatisticasReturn => {
  const dispatch = useAppDispatch();
  const { data, loading, error, ultimaAtualizacao } = useAppSelector(
    (state) => state.estatisticas
  );

  const recarregarEstatisticas = () => {
    dispatch(buscarEstatisticas());
  };

  const limparErroAtual = () => {
    dispatch(limparErro());
  };

  // Carrega dados iniciais
  useEffect(() => {
    dispatch(buscarEstatisticas());
  }, [dispatch]);

  return {
    data,
    loading,
    error,
    quantPessoasDesaparecidas: data?.quantPessoasDesaparecidas || 0,
    quantPessoasEncontradas: data?.quantPessoasEncontradas || 0,
    totalPessoas: (data?.quantPessoasDesaparecidas || 0) + (data?.quantPessoasEncontradas || 0),
    ultimaAtualizacao,
    recarregarEstatisticas,
    limparErroAtual,
  };
};
