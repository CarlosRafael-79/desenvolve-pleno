'use client';

import { useDesaparecidos } from '../hooks/useDesaparecidos';
import { useEstatisticas } from '../hooks/useEstatisticas';
import { useState, useEffect, useRef } from 'react';
import { initializeMock, isMockActive } from '../lib/config';
import { FiltroParams } from '../types/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar, { SearchBarRef } from '../components/SearchBar';
import PersonCard from '../components/PersonCard';
import Pagination from '../components/Pagination';
import CarrosselAcoes from '@/components/CarrosselAcoes';

export default function Home() {
  const {
    pessoas,
    loading,
    error,
    totalElements,
    currentPage,
    totalPages,
    buscarPessoas
  } = useDesaparecidos();

  const {
    quantPessoasDesaparecidas,
    quantPessoasEncontradas,
    totalPessoas,
    loading: statsLoading,
    error: statsError
  } = useEstatisticas();

  const searchBarRef = useRef<SearchBarRef>(null);

  const handleSearch = (filtros: FiltroParams) => {
    buscarPessoas(filtros);
  };

  const handlePageChange = (page: number) => {
    buscarPessoas({ pagina: page });
  };



  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Encontre Pessoas Desaparecidas
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total de Pessoas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? '...' : totalPessoas.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Pessoas Desaparecidas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Desaparecidas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? '...' : quantPessoasDesaparecidas.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Pessoas Encontradas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Encontradas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? '...' : quantPessoasEncontradas.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de Busca */}
          <SearchBar ref={searchBarRef} onSearch={handleSearch} loading={loading} />

          {/* Status da API */}
          <div className={`border rounded-xl p-4 mb-8 ${
            isMockActive() 
              ? 'bg-purple-50 border-purple-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  isMockActive() ? 'bg-purple-500' : 'bg-green-500'
                }`}></div>
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  isMockActive() ? 'text-purple-800' : 'text-green-800'
                }`}>
                  <strong>Status:</strong> {isMockActive() ? 'Usando dados de demonstração' : 'Conectado à API real'}
                </p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 text-red-500">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-red-800">Erro ao carregar dados</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Resultados */}
          {!loading && !error && pessoas.length > 0 && (
            <>
              {/* Título dos Resultados */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Resultados da Busca
                </h2>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {totalElements} pessoas encontradas
                  </span>
                  <span className="text-sm">
                    Página {currentPage + 1} de {totalPages}
                  </span>
                </div>
              </div>

              {/* Grid de Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                {pessoas.map((pessoa) => (
                  <PersonCard
                    key={pessoa.id}
                    pessoa={pessoa}
                  />
                ))}
              </div>

              {/* Paginação */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </>
          )}

          {/* Estado Vazio */}
          {!loading && !error && pessoas.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Nenhuma pessoa encontrada
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Tente ajustar os filtros de busca ou verificar se os dados estão corretos.
              </p>
              <button
                onClick={() => {
                  searchBarRef.current?.clearFilters();
                  buscarPessoas({
                    pagina: 0,
                    porPagina: 12,
                    nome: '',
                    faixaIdadeInicial: undefined,
                    faixaIdadeFinal: undefined,
                    sexo: undefined,
                    status: undefined
                  });
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Limpar Filtros
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Carregando dados...</h3>
              <p className="text-gray-600">Buscando pessoas desaparecidas</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}