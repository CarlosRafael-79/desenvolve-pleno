'use client';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { atualizarPagina } from '../store/slices/filtrosSlice';
import { buscarPessoasDesaparecidas } from '../store/slices/desaparecidosSlice';

interface PaginationProps {
  loading?: boolean;
}

export default function Pagination({ 
  loading = false 
}: PaginationProps) {
  const dispatch = useAppDispatch();
  const { currentPage, totalPages } = useAppSelector((state) => state.desaparecidos);
  const filtros = useAppSelector((state) => state.filtros);

  const handlePageChange = (page: number) => {
    dispatch(atualizarPagina(page));
    dispatch(buscarPessoasDesaparecidas({ ...filtros, pagina: page }));
  };
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        {/* Informações da página */}
        <div className="text-sm text-gray-300 mb-4 sm:mb-0">
          <span className="font-medium">
            Página {currentPage + 1} de {totalPages}
          </span>
        </div>

        {/* Navegação */}
        <div className="flex items-center space-x-2">
          {/* Botão Anterior */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0 || loading}
            className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>

          {/* Números das páginas */}
          <div className="flex items-center space-x-1">
            {visiblePages.map((page, index) => {
              if (page === '...') {
                return (
                  <span key={index} className="px-3 py-2 text-sm text-gray-500">
                    ...
                  </span>
                );
              }

              const pageNumber = page as number;
              const isCurrentPage = pageNumber === currentPage + 1;

              return (
                <button
                  key={index}
                  onClick={() => handlePageChange(pageNumber - 1)}
                  disabled={loading}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isCurrentPage
                      ? 'bg-purple-800 text-white'
                      : 'text-gray-300 bg-gray-700 border border-gray-600 hover:bg-gray-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          {/* Botão Próximo */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1 || loading}
            className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próximo →
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
            Carregando...
          </div>
        </div>
      )}
    </div>
  );
}
