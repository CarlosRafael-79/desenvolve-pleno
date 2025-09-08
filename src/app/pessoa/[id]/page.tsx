'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PessoaDesaparecida, InformacoesDesaparecidoResponse } from '../../../types/api';
import { DesaparecidosService } from '../../../services/desaparecidosService';
import InfoFormModal from '../../../components/InfoFormModal';
import Toast from '../../../components/Toast';
import LoadingSpinner from '../../../components/LoadingSpinner';
import DetailPageLoader from '../../../components/DetailPageLoader';

export default function PessoaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [pessoa, setPessoa] = useState<PessoaDesaparecida | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [informacoes, setInformacoes] = useState<InformacoesDesaparecidoResponse>([]);
  const [loadingInformacoes, setLoadingInformacoes] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFormModal, setShowFormModal] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const pessoaId = params.id as string;

  // Fechar modal com ESC
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showImageModal) {
        setShowImageModal(false);
      }
    };

    if (showImageModal) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Previne scroll do body
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showImageModal]);

  // Debug para verificar o estado do modal
  useEffect(() => {
    console.log('Estado do modal de imagem:', showImageModal);
  }, [showImageModal]);

  const carregarInformacoes = async (page: number = 1) => {
    if (!pessoa) return;
    
    console.log(`🔍 Carregando informações para pessoa ID: ${pessoa.id}, ocorrência ID: ${pessoa.ultimaOcorrencia.ocoId}`);
    
    setLoadingInformacoes(true);
    try {
      const dados = await DesaparecidosService.buscarInformacoesDesaparecido(
        pessoa.ultimaOcorrencia.ocoId, 
        page
      );
      
      console.log(`🔍 Dados recebidos:`, dados);
      console.log(`🔍 Content:`, dados.content);
      console.log(`🔍 Content length:`, dados.content?.length);
      
      setInformacoes(dados.content || []);
      setTotalPages(dados.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error('Erro ao carregar informações:', err);
    } finally {
      setLoadingInformacoes(false);
    }
  };

  useEffect(() => {
    const carregarPessoa = async () => {
      if (!pessoaId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const dados = await DesaparecidosService.buscarPessoaPorId(parseInt(pessoaId));
        setPessoa(dados);
      } catch (err) {
        setError('Erro ao carregar dados da pessoa');
        console.error('Erro ao carregar pessoa:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarPessoa();
  }, [pessoaId]);

  useEffect(() => {
    if (pessoa) {
      carregarInformacoes(1);
    }
  }, [pessoa]);

  const handleFormSubmit = async (formData: { informacao: string; data: string; anexos: File[] }) => {
    if (!pessoa) return;
    
    setSubmittingForm(true);
    try {
      const result = await DesaparecidosService.enviarInformacaoDesaparecido(
        pessoa.ultimaOcorrencia.ocoId,
        formData.informacao,
        formData.data,
        '', // localizacao - não implementado no modal ainda
        '', // telefone - não implementado no modal ainda
        formData.anexos
      );

      if (result.success) {
        // Recarregar as informações para mostrar a nova informação
        await carregarInformacoes(currentPage);
        setToast({
          message: 'Informação enviada com sucesso!',
          type: 'success',
          isVisible: true
        });
      } else {
        setToast({
          message: result.message,
          type: 'error',
          isVisible: true
        });
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setToast({
        message: 'Erro ao enviar informação. Tente novamente.',
        type: 'error',
        isVisible: true
      });
    } finally {
      setSubmittingForm(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isLocalizado = (dataLocalizacao: string | null) => {
    return dataLocalizacao !== null && dataLocalizacao !== '';
  };

  const getStatusColor = (dataLocalizacao: string | null) => {
    return isLocalizado(dataLocalizacao)
      ? 'bg-green-600 text-green-100 border-green-500' 
      : 'bg-red-600 text-red-100 border-red-500';
  };

  if (loading) {
    return <DetailPageLoader />;
  }

  if (error || !pessoa) {
    return (
      <div className="bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Erro ao carregar dados
            </h3>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              {error || 'Pessoa não encontrada'}
            </p>
            <button
              onClick={() => router.back()}
              className="bg-purple-800 text-white px-6 py-3 rounded-xl hover:bg-purple-900 transition-colors font-medium"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 py-12 page-transition">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Botão Voltar */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar para busca
            </button>
          </div>

          {/* Card Principal */}
          <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden mb-8">
            {/* Foto Destacada */}
            <div className="relative">
              <div className="h-96 bg-gradient-to-br from-gray-700 to-gray-800 relative overflow-hidden">
                {pessoa.urlFoto ? (
                  <>
                    <img
                      src={pessoa.urlFoto}
                      alt={pessoa.nome}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    
                    {/* Fallback para quando a imagem falha ao carregar */}
                    <div className="w-full h-full flex items-center justify-center hidden">
                      <div className="text-center">
                        <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium">Foto não disponível</p>
                      </div>
                    </div>
                    
                    {/* Botão de Expandir */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Botão expandir clicado, abrindo modal');
                        setShowImageModal(true);
                      }}
                      className="absolute top-4 right-4 bg-gray-800/95 hover:bg-gray-700 text-gray-300 hover:text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm z-20 cursor-pointer"
                      title="Expandir imagem"
                      type="button"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">Foto não disponível</p>
                    </div>
                  </div>
                )}
                
                {/* Overlay com informações */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-end justify-between">
                      <div>
                        <h1 className="text-4xl font-bold text-white mb-2">{pessoa.nome}</h1>
                        <p className="text-white/90 text-lg">Pessoa desaparecida</p>
                      </div>
                      <div>
                        <span className={`px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(pessoa.ultimaOcorrencia.dataLocalizacao)}`}>
                          {isLocalizado(pessoa.ultimaOcorrencia.dataLocalizacao) ? 'Localizado' : 'Desaparecido'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Principais */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Sexo</h3>
                    <p className="text-lg font-semibold text-white">
                      {pessoa.sexo === 'MASCULINO' ? 'Masculino' : 'Feminino'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Status Vivo</h3>
                    <p className="text-lg font-semibold text-white">
                      {pessoa.vivo ? 'Sim' : 'Não'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Idade</h3>
                    <p className="text-lg font-semibold text-white">
                      {pessoa.idade || 'Não informada'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Data do Desaparecimento</h3>
                    <p className="text-lg font-semibold text-white">
                      {formatDate(pessoa.ultimaOcorrencia.dtDesaparecimento)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Local do Desaparecimento</h3>
                    <p className="text-lg font-semibold text-white">
                      {pessoa.ultimaOcorrencia.localDesaparecimentoConcat}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            {((pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.vestimentasDesaparecido) || 
              (pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.informacao) || 
              (pessoa.vivo && pessoa.ultimaOcorrencia.dataLocalizacao)) && (
              <div className="border-t border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-white mb-6">Informações Adicionais</h2>
                
                <div className="space-y-6">
                  {/* Vestimentas */}
                  {pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.vestimentasDesaparecido && (
                    <div className="bg-gray-800 rounded-xl p-6">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Vestimentas</h3>
                          <p className="text-white">
                            {pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.vestimentasDesaparecido}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Informações */}
                  {pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.informacao && (
                    <div className="bg-gray-800 rounded-xl p-6">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Informações</h3>
                          <p className="text-white">
                            {pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.informacao}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Data de Localização (se encontrado) */}
                  {isLocalizado(pessoa.ultimaOcorrencia.dataLocalizacao) && (
                    <div className="bg-gray-800 rounded-xl p-6">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Data da Localização</h3>
                          <p className="text-lg font-semibold text-white">
                            {pessoa.ultimaOcorrencia.dataLocalizacao ? formatDate(pessoa.ultimaOcorrencia.dataLocalizacao) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Informações dos Cidadãos */}
            <div className="border-t border-gray-200 p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Informações dos Cidadãos
                    </h2>
                    <p className="text-gray-300 mt-1">
                      Relatos e informações compartilhadas pela comunidade
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFormModal(true)}
                    className="bg-purple-800 text-white px-6 py-3 rounded-xl hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Enviar Informação
                  </button>
                </div>
                
                {/* Call to Action */}
                <div className="bg-gray-800 border border-purple-700 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Você tem informações sobre esta pessoa?
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Se você viu esta pessoa ou tem alguma informação que pode ajudar, compartilhe conosco. 
                        Sua informação pode ser crucial para reunir uma família.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <span className="bg-purple-600 text-purple-100 px-3 py-1 rounded-full text-sm font-medium">
                          ✓ Local onde foi vista
                        </span>
                        <span className="bg-purple-600 text-purple-100 px-3 py-1 rounded-full text-sm font-medium">
                          ✓ Data e horário
                        </span>
                        <span className="bg-purple-600 text-purple-100 px-3 py-1 rounded-full text-sm font-medium">
                          ✓ Vestimentas
                        </span>
                        <span className="bg-purple-600 text-purple-100 px-3 py-1 rounded-full text-sm font-medium">
                          ✓ Fotos ou vídeos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {loadingInformacoes ? (
                <LoadingSpinner 
                  message="Carregando informações..." 
                  size="md"
                />
              ) : informacoes.length > 0 ? (
                <>
                  <div className="space-y-6 mb-8">
                    {informacoes.map((info, index) => (
                      <div key={info.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">
                                Relato #{index + 1}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Enviado em {formatDate(info.data)}
                              </p>
                            </div>
                          </div>
                          <span className="bg-green-600 text-green-100 px-3 py-1 rounded-full text-xs font-medium">
                            Nova informação
                          </span>
                        </div>
                        
                        <div className="bg-gray-800 rounded-lg p-4 mb-4">
                          <p className="text-gray-200 leading-relaxed">
                            {info.informacao}
                          </p>
                        </div>
                        
                        {info.anexos && info.anexos.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              Anexos ({info.anexos.length})
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {info.anexos.map((anexo, anexoIndex) => (
                                <a
                                  key={anexoIndex}
                                  href={anexo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-3 p-3 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                  <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                  </svg>
                                  <span className="text-gray-300 font-medium text-sm">
                                    Anexo {anexoIndex + 1}
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => carregarInformacoes(currentPage - 1)}
                        disabled={currentPage === 1 || loadingInformacoes}
                        className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      
                      <span className="px-3 py-2 text-sm text-gray-700">
                        Página {currentPage} de {totalPages}
                      </span>
                      
                      <button
                        onClick={() => carregarInformacoes(currentPage + 1)}
                        disabled={currentPage === totalPages || loadingInformacoes}
                        className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próximo
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Nenhuma informação disponível
                  </h3>
                  <p className="text-gray-300 mb-6 max-w-md mx-auto">
                    Ainda não há informações fornecidas por cidadãos sobre esta pessoa. 
                    Seja o primeiro a compartilhar informações que possam ajudar.
                  </p>
                  <button
                    onClick={() => setShowFormModal(true)}
                    className="bg-purple-800 text-white px-6 py-3 rounded-xl hover:bg-purple-900 transition-colors font-medium"
                  >
                    Enviar Primeira Informação
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Modal do Formulário */}
      <InfoFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        loading={submittingForm}
        ocorrenciaId={pessoa?.ultimaOcorrencia.ocoId || 0}
      />

      {/* Toast de Notificação */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />

      {/* Modal de Imagem Expandida */}
      {showImageModal && pessoa?.urlFoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={() => {
            console.log('Clicando fora do modal, fechando');
            setShowImageModal(false);
          }}
        >
          {/* Botão de fechar - fora da imagem */}
          <button
            onClick={() => {
              console.log('Fechando modal pelo botão X');
              setShowImageModal(false);
            }}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-30 bg-transparent hover:bg-white hover:bg-opacity-10 rounded-full p-3"
            title="Fechar"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Imagem centralizada */}
          <div 
            className="relative max-w-6xl max-h-full flex items-center justify-center"
            onClick={(e) => {
              console.log('Clicando na imagem, não fechando modal');
              e.stopPropagation();
            }}
          >
            <img
              src={pessoa.urlFoto}
              alt={pessoa.nome}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              style={{ 
                maxWidth: '90vw', 
                maxHeight: '90vh'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                // Mostrar fallback no modal
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) {
                  fallback.classList.remove('hidden');
                }
              }}
            />
            
            {/* Fallback para modal quando imagem falha */}
            <div className="hidden flex flex-col items-center justify-center text-white">
              <div className="w-32 h-32 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-gray-300 font-medium text-lg">Foto não disponível</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
