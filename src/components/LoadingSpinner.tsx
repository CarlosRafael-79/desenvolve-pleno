'use client';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ 
  message = 'Carregando...', 
  size = 'md' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className={`inline-block animate-spin rounded-full border-b-2 border-blue-600 mb-4 ${sizeClasses[size]}`}></div>
      <h3 className={`font-semibold text-gray-900 mb-2 ${textSizeClasses[size]}`}>
        {message}
      </h3>
      <p className="text-gray-600">Aguarde um momento</p>
    </div>
  );
}
