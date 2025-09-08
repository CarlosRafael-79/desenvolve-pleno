'use client';

import { useState } from 'react';
import { useInformacoesDesaparecido } from '../hooks/useInformacoesDesaparecido';
import { InformacaoDesaparecido } from '../types/api';

interface InfoModalProps {
  ocorrenciaId: number;
  nomePessoa: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ 
  ocorrenciaId, 
  nomePessoa, 
  isOpen, 
  onClose 
}: InfoModalProps) {
  const { 
    informacoes, 
    loading, 
    error, 
    totalInformacoes,
    buscarInformacoes,
    limparInformacoes 
  } = useInformacoesDesaparecido();

  const [ocorrenciaAtual, setOcorrenciaAtual] = useState<number | null>(null);

  const handleBuscarInformacoes = async () => {
    if (ocorrenciaId !== ocorrenciaAtual) {
      setOcorrenciaAtual(ocorrenciaId);
      await buscarInformacoes(ocorrenciaId);
    }
  };

  const handleClose = () => {
    limparInformacoes();
    setOcorrenciaAtual(null);
    onClose();
  };

  // Busca informações quando o modal abre
  if (isOpen && ocorrenciaId !== ocorrenciaAtual) {
    handleBuscarInformacoes();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Informações sobre {nomePessoa}
            </h2>
            <p className="text-sm text-gray-300 mt-1">
              Ocorrência ID: {ocorrenciaId}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-300">Carregando informações...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 text-red-400">⚠️</div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Erro</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Informações ({totalInformacoes})
                  </h3>
                </div>
              </div>

              {totalInformacoes === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <p className="text-gray-300">Nenhuma informação encontrada para esta ocorrência.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {informacoes.map((info) => (
                    <InfoCard key={info.id} informacao={info} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface InfoCardProps {
  informacao: InformacaoDesaparecido;
}

function InfoCard({ informacao }: InfoCardProps) {
  const [showAnexos, setShowAnexos] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <p className="text-white text-sm leading-relaxed">
            {informacao.informacao}
          </p>
        </div>
        <div className="ml-4 text-right">
          <p className="text-xs text-gray-500">
            {new Date(informacao.data).toLocaleDateString('pt-BR')}
          </p>
          <p className="text-xs text-gray-400">
            ID: {informacao.id}
          </p>
        </div>
      </div>

      {informacao.anexos.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowAnexos(!showAnexos)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <span className="mr-1">📎</span>
            {informacao.anexos.length} anexo(s)
            <span className="ml-1">{showAnexos ? '▲' : '▼'}</span>
          </button>

          {showAnexos && (
            <div className="mt-2 space-y-2">
              {informacao.anexos.map((anexo, index) => (
                <div key={index} className="bg-gray-50 rounded p-2">
                  <a
                    href={anexo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 break-all"
                  >
                    📄 Anexo {index + 1}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}