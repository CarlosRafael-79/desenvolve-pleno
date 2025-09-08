'use client';

import { useEffect, useState } from 'react';

export default function DetailPageLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Mostra o loader por um tempo mínimo para prevenir flash branco
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-300 text-sm">Carregando dados da pessoa...</p>
      </div>
    </div>
  );
}
