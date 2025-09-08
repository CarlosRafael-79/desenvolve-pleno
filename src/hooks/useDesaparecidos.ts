import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { buscarPessoasDesaparecidas, limparErro } from '../store/slices/desaparecidosSlice';
import { atualizarFiltros, limparFiltros, resetarPagina } from '../store/slices/filtrosSlice';
import { FiltroParams, PessoaDesaparecida, ApiResponse } from '../types/api';

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
  filtros: FiltroParams;
  buscarPessoas: (filtros?: FiltroParams) => void;
  limparFiltrosEBuscar: () => void;
  limparErroAtual: () => void;
}

export const useDesaparecidos = (): UseDesaparecidosReturn => {
  const dispatch = useAppDispatch();
  const { data, loading, error, currentPage, totalPages, totalElements } = useAppSelector(
    (state) => state.desaparecidos
  );
  const filtros = useAppSelector((state) => state.filtros);

  const buscarPessoas = (novosFiltros?: FiltroParams) => {
    if (novosFiltros) {
      // Se for uma nova busca (não paginação), resetar página para 0
      const filtrosComPaginaResetada = {
        ...novosFiltros,
        pagina: 0
      };
      dispatch(atualizarFiltros(filtrosComPaginaResetada));
      dispatch(buscarPessoasDesaparecidas(filtrosComPaginaResetada));
    } else {
      // Busca com filtros atuais, mas sempre resetar página para 0
      const filtrosComPaginaResetada = {
        ...filtros,
        pagina: 0
      };
      dispatch(resetarPagina());
      dispatch(buscarPessoasDesaparecidas(filtrosComPaginaResetada));
    }
  };

  const limparFiltrosEBuscar = () => {
    dispatch(limparFiltros());
    // Não executa busca automaticamente - usuário deve clicar em "Buscar"
  };

  const limparErroAtual = () => {
    dispatch(limparErro());
  };

  // Remover carregamento automático - dados só serão carregados quando o usuário clicar em "Buscar"

  // Buscar apenas quando a página mudar (para paginação)
  useEffect(() => {
    if (filtros.pagina !== undefined && filtros.pagina !== currentPage && filtros.pagina > 0) {
      dispatch(buscarPessoasDesaparecidas(filtros));
    }
  }, [dispatch, filtros.pagina, currentPage, filtros]);

  return {
    data,
    loading,
    error,
    pessoas: data?.content || [],
    totalPages,
    totalElements,
    currentPage,
    hasNextPage: data ? !data.last : false,
    hasPreviousPage: data ? !data.first : false,
    filtros,
    buscarPessoas,
    limparFiltrosEBuscar,
    limparErroAtual,
  };
};
