'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const useNavigation = () => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const navigateTo = useCallback(async (path: string) => {
    setIsNavigating(true);
    
    try {
      // Navegação imediata sem delay
      router.push(path);
    } catch (error) {
      console.error('Erro na navegação:', error);
    } finally {
      // Reset do estado mais rápido
      setTimeout(() => setIsNavigating(false), 200);
    }
  }, [router]);

  return {
    isNavigating,
    navigateTo
  };
};