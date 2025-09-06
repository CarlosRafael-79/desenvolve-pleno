'use client';

import { useEffect } from 'react';
import { initializeMock } from '../lib/config';

export default function MockInitializer() {
  useEffect(() => {
    console.log('🚀 MockInitializer: Inicializando mock no client-side...');
    initializeMock();
  }, []);

  return null; // Este componente não renderiza nada
}
