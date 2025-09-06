'use client';

import { useRouter } from 'next/navigation';
import { PessoaDesaparecida } from '../types/api';

interface PersonCardProps {
  pessoa: PessoaDesaparecida;
}

export default function PersonCard({ pessoa }: PersonCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/pessoa/${pessoa.id}`);
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isLocalizado = (dataLocalizacao: string | null) => {
    return dataLocalizacao !== null && dataLocalizacao !== '';
  };

  const getStatusColor = (dataLocalizacao: string | null) => {
    return isLocalizado(dataLocalizacao)
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group cursor-pointer hover:border-blue-300"
    >
      {/* Foto no topo */}
      <div className="w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
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
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-xs text-gray-400 font-medium">Foto não disponível</p>
          </div>
        </div>
        
        {/* Status badge sobreposto */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${getStatusColor(pessoa.ultimaOcorrencia.dataLocalizacao)}`}>
            {isLocalizado(pessoa.ultimaOcorrencia.dataLocalizacao) ? 'Localizado' : 'Desaparecido'}
          </span>
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Informações essenciais */}
      <div className="p-6">
        {/* Nome */}
        <h3 className="text-lg font-bold text-gray-900 mb-4 text-center leading-tight group-hover:text-blue-600 transition-colors">
          {pessoa.nome}
        </h3>

        {/* Informações básicas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-medium text-gray-500">Sexo</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{pessoa.sexo === 'MASCULINO' ? 'Masculino' : 'Feminino'}</span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-500">Idade</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{pessoa.idade || 'Não informada'}</span>
          </div>
          
          <div className="flex items-start justify-between py-2">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-500">Local</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%] leading-relaxed" title={pessoa.ultimaOcorrencia.localDesaparecimentoConcat}>
              {pessoa.ultimaOcorrencia.localDesaparecimentoConcat}
            </span>
          </div>
        </div>

        {/* Botão de ação */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
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
