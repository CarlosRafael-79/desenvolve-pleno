'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { atualizarFiltros, limparFiltros, resetarPagina } from '../store/slices/filtrosSlice';
import { buscarPessoasDesaparecidas } from '../store/slices/desaparecidosSlice';
import { FiltroParams } from '../types/api';

interface SearchBarProps {
  loading: boolean;
}

export interface SearchBarRef {
  clearFilters: () => void;
}

const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(({ loading }, ref) => {
  const dispatch = useAppDispatch();
  const filtros = useAppSelector((state) => state.filtros);

  const clearFilters = () => {
    dispatch(limparFiltros());
    // Não executa busca automaticamente - usuário deve clicar em "Buscar"
  };

  useImperativeHandle(ref, () => ({
    clearFilters
  }));

  const handleInputChange = (field: keyof FiltroParams, value: unknown) => {
    dispatch(atualizarFiltros({ [field]: value }));
  };

  const handleSearch = () => {
    // Remove campos vazios antes de enviar e sempre reseta para página 0
    const filtrosLimpos = Object.fromEntries(
      Object.entries(filtros).filter(([, value]) => 
        value !== '' && value !== undefined && value !== null
      )
    );
    
    // Sempre resetar para página 0 em uma nova busca
    const filtrosComPaginaResetada = {
      ...filtrosLimpos,
      pagina: 0
    };
    
    // Resetar a página no estado dos filtros
    dispatch(resetarPagina());
    dispatch(buscarPessoasDesaparecidas(filtrosComPaginaResetada));
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg border border-purple-700 p-8 mb-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Buscar Pessoas Desaparecidas
          </h2>
        </div>
        <p className="text-gray-300">
          Use os filtros abaixo para encontrar pessoas desaparecidas em Mato Grosso
        </p>
      </div>

      {/* Todos os Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nome da Pessoa
          </label>
          <input
            type="text"
            value={filtros.nome || ''}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            placeholder="Digite o nome..."
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
          />
        </div>

        {/* Sexo */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Sexo
          </label>
          <select
            value={filtros.sexo || ''}
            onChange={(e) => handleInputChange('sexo', e.target.value || undefined)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
          >
            <option value="">Todos</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMININO">Feminino</option>
          </select>
        </div>

        {/* Idade Mínima */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Idade Mínima
          </label>
          <input
            type="number"
            value={filtros.faixaIdadeInicial || ''}
            onChange={(e) => handleInputChange('faixaIdadeInicial', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Ex: 18"
            min="0"
            max="120"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
          />
        </div>

        {/* Idade Máxima */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Idade Máxima
          </label>
          <input
            type="number"
            value={filtros.faixaIdadeFinal || ''}
            onChange={(e) => handleInputChange('faixaIdadeFinal', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Ex: 65"
            min="0"
            max="120"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <select
            value={filtros.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value || undefined)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
          >
            <option value="">Todos</option>
            <option value="DESAPARECIDO">Desaparecido</option>
            <option value="LOCALIZADO">Localizado</option>
          </select>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleSearch}
          disabled={loading}
          className="flex-1 bg-purple-800 text-white px-8 py-4 rounded-xl hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Buscando...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar Pessoas
            </span>
          )}
        </button>
        
        <button
          onClick={handleClearFilters}
          className="px-8 py-4 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 font-semibold transition-all duration-200 border border-gray-600"
        >
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpar Filtros
          </span>
        </button>
      </div>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
