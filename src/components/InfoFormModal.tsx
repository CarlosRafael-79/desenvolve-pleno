'use client';

import { useState, useRef } from 'react';

interface InfoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  loading: boolean;
  ocorrenciaId: number;
}

interface FormData {
  informacao: string;
  data: string;
  anexos: File[];
}

export default function InfoFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading, 
  ocorrenciaId 
}: InfoFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    informacao: '',
    data: new Date().toISOString().split('T')[0], // Data atual no formato YYYY-MM-DD
    anexos: []
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      if (file.size > maxSize) {
        errors.push(`${file.name} é muito grande (máx. 10MB)`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        anexos: [...prev.anexos, ...validFiles]
      }));
    }

    // Limpar o input para permitir selecionar o mesmo arquivo novamente
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      anexos: prev.anexos.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.informacao.trim()) {
      newErrors.informacao = 'A informação é obrigatória';
    }

    if (!formData.data) {
      newErrors.data = 'A data é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      // Resetar formulário após envio bem-sucedido
      setFormData({
        informacao: '',
        data: new Date().toISOString().split('T')[0],
        anexos: []
      });
      onClose();
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            Enviar Informação
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informação */}
          <div>
            <label htmlFor="informacao" className="block text-sm font-medium text-gray-300 mb-2">
              Informação sobre o desaparecido *
            </label>
            <textarea
              id="informacao"
              name="informacao"
              value={formData.informacao}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                errors.informacao ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Descreva onde e quando você viu a pessoa, como estava vestida, etc..."
              disabled={loading}
            />
            {errors.informacao && (
              <p className="mt-1 text-sm text-red-600">{errors.informacao}</p>
            )}
          </div>

          {/* Data */}
          <div>
            <label htmlFor="data" className="block text-sm font-medium text-gray-300 mb-2">
              Data da observação *
            </label>
            <input
              type="date"
              id="data"
              name="data"
              value={formData.data}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                errors.data ? 'border-red-500' : 'border-gray-600'
              }`}
              style={{
                colorScheme: 'dark'
              }}
              disabled={loading}
            />
            {errors.data && (
              <p className="mt-1 text-sm text-red-600">{errors.data}</p>
            )}
          </div>

          {/* Upload de Arquivos */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Anexos (opcional)
            </label>
            
            {/* Botão de Upload */}
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Clique para adicionar arquivos
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Formatos aceitos: JPG, PNG, PDF, DOC, DOCX (máx. 10MB por arquivo)
              </p>
            </div>

            {/* Lista de Arquivos */}
            {formData.anexos.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Arquivos selecionados:</h4>
                {formData.anexos.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-white">{file.name}</p>
                        <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      disabled={loading}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-800 border border-transparent rounded-md hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {formData.anexos.length > 0 ? 'Enviando arquivos...' : 'Enviando...'}
                </>
              ) : (
                'Enviar Informação'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}