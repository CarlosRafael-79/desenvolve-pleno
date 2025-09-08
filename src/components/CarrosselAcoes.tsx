'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CarrosselAcoes() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Como Ajudar",
      subtitle: "Faça a diferença",
      description: "Aprenda como você pode ajudar a encontrar pessoas desaparecidas em Mato Grosso.",
      backgroundColor: "bg-gradient-to-br from-blue-500 to-blue-700",
      buttonText: "Saiba Como Ajudar",
      buttonLink: "/como-ajudar",
      buttonColor: "bg-gray-800 text-blue-400 hover:bg-gray-700"
    },
    {
      id: 2,
      title: "PJC-MT",
      subtitle: "Polícia Civil",
      description: "Acesse o site oficial da Polícia Civil de Mato Grosso para mais informações.",
      backgroundColor: "bg-gradient-to-br from-red-500 to-red-700",
      buttonText: "Acessar Site",
      buttonLink: "https://www.pjc.mt.gov.br",
      buttonColor: "bg-gray-800 text-red-400 hover:bg-gray-700"
    },
    {
      id: 3,
      title: "Compartilhe",
      subtitle: "Espalhe a esperança",
      description: "Compartilhe informações sobre pessoas desaparecidas e ajude a aumentar as chances de encontrá-las.",
      backgroundColor: "bg-gradient-to-br from-green-500 to-green-700",
      buttonText: "Compartilhar",
      buttonLink: "#",
      buttonColor: "bg-gray-800 text-green-400 hover:bg-gray-700"
    }
  ];

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
      {/* Slide Content */}
      <div className={`relative h-80 flex items-center justify-center ${currentSlideData.backgroundColor}`}>
        {/* Content */}
        <div className="relative z-10 px-8 py-12 w-full max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-3">
            {currentSlideData.title}
          </h2>
          <h3 className="text-2xl text-white/90 mb-6">
            {currentSlideData.subtitle}
          </h3>
          <p className="text-white/80 mb-10 text-xl max-w-3xl mx-auto">
            {currentSlideData.description}
          </p>
          
          {currentSlideData.buttonLink === "#" ? (
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Localiza MT - Pessoas Desaparecidas',
                    text: 'Ajude a encontrar pessoas desaparecidas em Mato Grosso',
                    url: window.location.href
                  });
                } else {
                  // Fallback para copiar link
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copiado para a área de transferência!');
                }
              }}
              className={`${currentSlideData.buttonColor} px-10 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-lg`}
            >
              {currentSlideData.buttonText}
            </button>
          ) : (
            <Link
              href={currentSlideData.buttonLink}
              className={`${currentSlideData.buttonColor} px-10 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl inline-block text-lg`}
            >
              {currentSlideData.buttonText}
            </Link>
          )}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800/20 hover:bg-gray-800/30 text-white rounded-full p-3 transition-all duration-200 z-20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800/20 hover:bg-gray-800/30 text-white rounded-full p-3 transition-all duration-200 z-20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide 
                ? 'bg-gray-800' 
                : 'bg-gray-800/50 hover:bg-gray-800/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
