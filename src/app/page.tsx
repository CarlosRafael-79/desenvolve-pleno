'use client';

import { useDesaparecidos } from '../hooks/useDesaparecidos';
import { useEstatisticas } from '../hooks/useEstatisticas';
import { useRef } from 'react';
import { isMockActive } from '../config/config';
import SearchBar, { SearchBarRef } from '../components/SearchBar';
import { LazyPersonCard } from '../components/lazy/LazyPages';
import Pagination from '../components/Pagination';
import CarrosselAcoes from '@/components/CarrosselAcoes';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const {
    pessoas,
    loading,
    error,
    totalElements,
    currentPage,
    totalPages
  } = useDesaparecidos();

  const {
    quantPessoasDesaparecidas,
    quantPessoasEncontradas,
    totalPessoas,
    loading: statsLoading
  } = useEstatisticas();

  const searchBarRef = useRef<SearchBarRef>(null);



  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Encontre Pessoas Desaparecidas
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Ajude famílias a reencontrar seus entes queridos. Cada informação pode fazer a diferença.
            </p>
            
            {/* Carrossel de Ações */}
            <div className="max-w-6xl mx-auto">
              <CarrosselAcoes />
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Total de Pessoas */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-blue-700 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Total de Pessoas</p>
                  <p className="text-2xl font-bold text-white">
                    {statsLoading ? '...' : totalPessoas.toLocaleString()}
                  </p>
                </div>
              </div>
              {/* Barra de Progresso - Total sempre 100% */}
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: '100%' }}></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">100% do total</p>
            </div>

            {/* Pessoas Desaparecidas */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-red-700 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Desaparecidas</p>
                  <p className="text-2xl font-bold text-white">
                    {statsLoading ? '...' : quantPessoasDesaparecidas.toLocaleString()}
                  </p>
                </div>
              </div>
              {/* Barra de Progresso - Percentual de desaparecidas */}
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-red-400 to-red-500 h-2 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: statsLoading ? '0%' : `${totalPessoas > 0 ? (quantPessoasDesaparecidas / totalPessoas) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {statsLoading ? '...' : `${totalPessoas > 0 ? ((quantPessoasDesaparecidas / totalPessoas) * 100).toFixed(1) : 0}% do total`}
              </p>
            </div>

            {/* Pessoas Encontradas */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-green-700 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Encontradas</p>
                  <p className="text-2xl font-bold text-white">
                    {statsLoading ? '...' : quantPessoasEncontradas.toLocaleString()}
                  </p>
                </div>
              </div>
              {/* Barra de Progresso - Percentual de encontradas */}
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: statsLoading ? '0%' : `${totalPessoas > 0 ? (quantPessoasEncontradas / totalPessoas) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {statsLoading ? '...' : `${totalPessoas > 0 ? ((quantPessoasEncontradas / totalPessoas) * 100).toFixed(1) : 0}% do total`}
              </p>
            </div>
          </div>

          {/* Barra de Busca */}
          <SearchBar ref={searchBarRef} loading={loading} />

          {/* Status da API */}
          <div className={`border rounded-xl p-4 mb-8 ${
            isMockActive() 
              ? 'bg-purple-900/30 border-purple-600' 
              : 'bg-green-900/30 border-green-600'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  isMockActive() ? 'bg-purple-400' : 'bg-green-400'
                }`}></div>
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  isMockActive() ? 'text-purple-300' : 'text-green-300'
                }`}>
                  <strong>Status:</strong> {isMockActive() ? 'Usando dados de demonstração' : 'Conectado à API real'}
                </p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-900/30 border border-red-600 rounded-xl p-6 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 text-red-400">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-red-300">Erro ao carregar dados</h3>
                  <p className="mt-1 text-sm text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Estado Vazio Inicial */}
          {!loading && !error && pessoas.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Busque por pessoas desaparecidas
              </h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                Use a barra de busca acima para encontrar pessoas desaparecidas em Mato Grosso. 
                Você pode filtrar por nome, idade, sexo e status.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ✓ Busca por nome
                </span>
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ✓ Filtro por idade
                </span>
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ✓ Filtro por sexo
                </span>
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ✓ Status de localização
                </span>
              </div>
              <button
                onClick={() => {
                  searchBarRef.current?.clearFilters();
                }}
                className="bg-purple-700 text-white px-6 py-3 rounded-xl hover:bg-purple-800 transition-colors font-medium"
              >
                Limpar Filtros
              </button>
            </div>
          )}

          {/* Resultados */}
          {!loading && !error && pessoas.length > 0 && (
            <>
              {/* Título dos Resultados */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Resultados da Busca
                </h2>
                <div className="flex items-center space-x-4 text-gray-300">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {totalElements} pessoas encontradas
                  </span>
                  <span className="text-sm">
                    Página {currentPage + 1} de {totalPages}
                  </span>
                </div>
              </div>

              {/* Grid de Cards com Lazy Loading */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {pessoas.map((pessoa) => (
                  <LazyPersonCard
                    key={pessoa.id}
                    pessoa={pessoa}
                  />
                ))}
              </div>

              {/* Paginação */}
              <Pagination loading={loading} />
            </>
          )}


          {/* Loading */}
          {loading && (
            <LoadingSpinner 
              message="Carregando dados..." 
              size="md"
            />
          )}
        </div>
    </div>
  );
}