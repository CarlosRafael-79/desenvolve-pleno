'use client';

import dynamic from 'next/dynamic';
import LoadingSpinner from '../LoadingSpinner';

// Componente de loading personalizado para as páginas
const PageLoading = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <div className="flex-1 flex items-center justify-center">
      <LoadingSpinner 
        message="Carregando página..." 
        size="lg"
      />
    </div>
  </div>
);

// Lazy loading para a página de detalhes da pessoa
export const LazyPessoaDetailPage = dynamic(
  () => import('../../app/pessoa/[id]/page'),
  {
    loading: () => <PageLoading />,
    ssr: false // Desabilita SSR para esta página específica
  }
);

// Lazy loading para a página Como Ajudar
export const LazyComoAjudarPage = dynamic(
  () => import('../../app/como-ajudar/page'),
  {
    loading: () => <PageLoading />,
    ssr: false
  }
);

// Lazy loading para componentes pesados (se necessário no futuro)
export const LazyInfoFormModal = dynamic(
  () => import('../InfoFormModal'),
  {
    loading: () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8">
          <LoadingSpinner 
            message="Carregando formulário..." 
            size="sm"
          />
        </div>
      </div>
    ),
    ssr: false
  }
);

// Lazy loading para PersonCard com placeholder que mantém o design
export const LazyPersonCard = dynamic(
  () => import('../PersonCard'),
  {
    loading: () => (
      <div className="bg-gray-800 rounded-2xl shadow-lg border border-purple-700 min-h-80 flex flex-col sm:flex-row">
        {/* Placeholder da imagem */}
        <div className="w-full sm:w-56 h-48 sm:h-full bg-gradient-to-br from-gray-700 to-gray-800 flex-shrink-0 animate-pulse"></div>
        
        {/* Placeholder do conteúdo */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col">
          {/* Placeholder do nome */}
          <div className="h-6 bg-gray-700 rounded mb-4 animate-pulse"></div>
          
          {/* Placeholder das informações */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-700 rounded p-3 animate-pulse">
              <div className="h-4 bg-gray-600 rounded mb-2"></div>
              <div className="h-5 bg-gray-600 rounded"></div>
            </div>
            <div className="bg-gray-700 rounded p-3 animate-pulse">
              <div className="h-4 bg-gray-600 rounded mb-2"></div>
              <div className="h-5 bg-gray-600 rounded"></div>
            </div>
          </div>
          
          {/* Placeholder da localização */}
          <div className="bg-gray-700 rounded p-3 mb-4 animate-pulse">
            <div className="h-4 bg-gray-600 rounded mb-2"></div>
            <div className="h-5 bg-gray-600 rounded"></div>
          </div>
          
          {/* Placeholder do botão */}
          <div className="mt-auto pt-4 border-t border-gray-600">
            <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    ),
    ssr: false
  }
);