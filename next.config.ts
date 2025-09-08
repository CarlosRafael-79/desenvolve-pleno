import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração para Docker - gera um build standalone
  output: 'standalone',
  
  // Otimizações para produção
  compress: true,
  
  // Configurações de imagem
  images: {
    unoptimized: false,
    domains: [],
  },
  
  // Configurações de segurança
  poweredByHeader: false,
  
  // Remover configurações experimentais que causam problemas
  // experimental: {
  //   optimizeCss: true, // Esta configuração causa erro com critters
  // },
};

export default nextConfig;