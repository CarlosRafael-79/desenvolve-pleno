'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigation } from '../hooks/useNavigation';

export default function Header() {
  const pathname = usePathname();
  const { isNavigating, navigateTo } = useNavigation();

  const navItems = [
    { href: '/', label: 'Buscar', active: pathname === '/' },
    { href: '/como-ajudar', label: 'Como Ajudar', active: pathname === '/como-ajudar' },
  ];

  const handleNavigation = (href: string) => {
    if (href === pathname) return; // Não navegar se já estiver na página
    navigateTo(href);
  };

  return (
    <header className="bg-gray-900 border-b border-purple-700 sticky top-0 z-50 backdrop-blur-sm bg-gray-900/95 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo e Título */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold group-hover:scale-105 transition-all duration-300">
                <span className="text-white">Localiza </span>
                <span className="text-purple-400">MT</span>
              </h1>
              <p className="text-xs text-gray-400">Pessoas Desaparecidas</p>
            </div>
          </Link>

          {/* Navegação */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                disabled={isNavigating}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  item.active
                    ? 'bg-purple-700 text-white border border-purple-600 shadow-sm'
                    : 'text-gray-300 hover:text-purple-400 hover:bg-purple-800'
                } ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isNavigating && !item.active && (
                  <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Badge PJC-MT */}
          <div className="hidden lg:flex items-center space-x-2 bg-purple-800 px-3 py-2 rounded-lg border border-purple-600">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-purple-200">PJC-MT</span>
          </div>
        </div>

        {/* Navegação Mobile */}
        <div className="md:hidden pb-4">
          <nav className="flex space-x-4">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                disabled={isNavigating}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  item.active
                    ? 'bg-purple-700 text-white border border-purple-600 shadow-sm'
                    : 'text-gray-300 hover:text-purple-400 hover:bg-purple-800'
                } ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isNavigating && !item.active && (
                  <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
