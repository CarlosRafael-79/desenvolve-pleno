'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { FiltroParams } from '../types/api';

interface SearchBarProps {
  onSearch: (filtros: FiltroParams) => void;
  loading: boolean;
}

export interface SearchBarRef {
  clearFilters: () => void;
}

const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(({ onSearch, loading }, ref) => {
  const [filtros, setFiltros] = useState<FiltroParams>({
    pagina: 0,
    porPagina: 12,
    nome: '',
    faixaIdadeInicial: undefined,
    faixaIdadeFinal: undefined,
    sexo: undefined,
    status: undefined
  });

  const clearFilters = () => {
    setFiltros({
      pagina: 0,
      porPagina: 12,
      nome: '',
      faixaIdadeInicial: undefined,
      faixaIdadeFinal: undefined,
      sexo: undefined,
      status: undefined
    });
  };

  useImperativeHandle(ref, () => ({
    clearFilters
  }));

  const handleInputChange = (field: keyof FiltroParams, value: any) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    // Remove campos vazios antes de enviar
    const filtrosLimpos = Object.fromEntries(
      Object.entries(filtros).filter(([_, value]) => 
        value !== '' && value !== undefined && value !== null
      )
    );
    
    onSearch(filtrosLimpos);
  };

  const handleClearFilters = () => {
    clearFilters();
    // Apenas limpa os campos visualmente, não executa busca
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Buscar Pessoas Desaparecidas
          </h2>
        </div>
        <p className="text-gray-600">
          Use os filtros abaixo para encontrar pessoas desaparecidas em Mato Grosso
        </p>
      </div>

      {/* Todos os Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome da Pessoa
          </label>
          <input
            type="text"
            value={filtros.nome || ''}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            placeholder="Digite o nome..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        {/* Sexo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sexo
          </label>
          <select
            value={filtros.sexo || ''}
            onChange={(e) => handleInputChange('sexo', e.target.value || undefined)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option value="">Todos</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMININO">Feminino</option>
          </select>
        </div>

        {/* Idade Mínima */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Idade Mínima
          </label>
          <input
            type="number"
            value={filtros.faixaIdadeInicial || ''}
            onChange={(e) => handleInputChange('faixaIdadeInicial', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Ex: 18"
            min="0"
            max="120"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        {/* Idade Máxima */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Idade Máxima
          </label>
          <input
            type="number"
            value={filtros.faixaIdadeFinal || ''}
            onChange={(e) => handleInputChange('faixaIdadeFinal', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Ex: 65"
            min="0"
            max="120"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filtros.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value || undefined)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
          className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
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
          className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 font-semibold transition-all duration-200 border border-gray-200"
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
