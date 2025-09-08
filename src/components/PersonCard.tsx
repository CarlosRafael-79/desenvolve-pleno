'use client';

import { PessoaDesaparecida } from '../types/api';
import LoadingSpinner from './LoadingSpinner';
import { useRouter } from 'next/navigation';

interface PersonCardProps {
  pessoa: PessoaDesaparecida;
}

export default function PersonCard({ pessoa }: PersonCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    // Navegação direta sem delay
    router.push(`/pessoa/${pessoa.id}`);
  };

  const isLocalizado = (dataLocalizacao: string | null) => {
    return dataLocalizacao !== null && dataLocalizacao !== '';
  };

  const getStatusColor = (dataLocalizacao: string | null) => {
    return isLocalizado(dataLocalizacao)
      ? 'bg-green-600 text-green-100 border-green-500' 
      : 'bg-red-600 text-red-100 border-red-500';
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-700 overflow-hidden group cursor-pointer hover:border-purple-500 relative flex flex-col sm:flex-row min-h-80"
    >
      
      {/* Foto no lado esquerdo */}
      <div className="w-full sm:w-56 h-48 sm:h-full bg-gradient-to-br from-gray-700 to-gray-800 relative overflow-hidden flex-shrink-0">
        {pessoa.urlFoto ? (
          <img
            src={pessoa.urlFoto}
            alt={pessoa.nome}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center ${pessoa.urlFoto ? 'hidden' : ''}`}>
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-3 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-sm text-gray-300 font-medium">Foto não disponível</p>
          </div>
        </div>
        
        {/* Status badge sobreposto */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${getStatusColor(pessoa.ultimaOcorrencia.dataLocalizacao)}`}>
            {isLocalizado(pessoa.ultimaOcorrencia.dataLocalizacao) ? 'Localizado' : 'Desaparecido'}
          </span>
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Informações no lado direito */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col">
        {/* Nome */}
        <div className="mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white leading-tight group-hover:text-purple-400 transition-colors min-h-[2.5rem] flex items-center">
            <span className="line-clamp-2 overflow-hidden text-ellipsis" title={pessoa.nome}>
              {pessoa.nome}
            </span>
          </h3>
        </div>

        {/* Informações básicas em grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div className="bg-gray-700 rounded-lg p-3 min-h-[4rem] flex flex-col justify-between">
            <div className="flex items-center space-x-2 mb-1">
              <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">Sexo</span>
            </div>
            <span className="text-sm font-semibold text-white line-clamp-2 overflow-hidden text-ellipsis">
              {pessoa.sexo === 'MASCULINO' ? 'Masculino' : 'Feminino'}
            </span>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-3 min-h-[4rem] flex flex-col justify-between">
            <div className="flex items-center space-x-2 mb-1">
              <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">Idade</span>
            </div>
            <span className="text-sm font-semibold text-white line-clamp-2 overflow-hidden text-ellipsis">
              {pessoa.idade || 'Não informada'}
            </span>
          </div>
        </div>
        
        {/* Local em linha completa */}
        <div className="bg-gray-700 rounded-lg p-3 mb-4 min-h-[4rem] flex flex-col justify-between">
          <div className="flex items-center space-x-2 mb-1">
            <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">Local do Desaparecimento</span>
          </div>
          <span className="text-sm font-semibold text-white leading-relaxed line-clamp-2 overflow-hidden text-ellipsis" title={pessoa.ultimaOcorrencia.localDesaparecimentoConcat}>
            {pessoa.ultimaOcorrencia.localDesaparecimentoConcat}
          </span>
        </div>

        {/* Botão de ação na parte inferior */}
        <div className="mt-auto pt-4 border-t border-gray-600">
          <div className="flex items-center justify-center text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors">
            <span>Ver detalhes</span>
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
