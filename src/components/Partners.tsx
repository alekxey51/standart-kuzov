import React, { useEffect, useRef, useState } from 'react';
import partnersData from '../data/partners.json';

interface Partner {
  name: string;
  logo: string;
}

export function Partners() {
  const partners = partnersData.partners as Partner[];
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState(6);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemWidth, setItemWidth] = useState(150);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Определяем количество видимых элементов и их ширину
  useEffect(() => {
    const updateResponsiveSettings = () => {
      const width = window.innerWidth;
              
     if (width < 768) {
        setVisibleItems(4);
       setItemWidth(130);
      } else if (width < 1024) {
        setVisibleItems(6);
       setItemWidth(130);
      } else if (width < 1280) {
        setVisibleItems(8);
       setItemWidth(140);
      } else {
        setVisibleItems(10);
       setItemWidth(150);
      }
    };

    updateResponsiveSettings();
    window.addEventListener('resize', updateResponsiveSettings);
    return () => window.removeEventListener('resize', updateResponsiveSettings);
  }, []);

  // Автоматическая прокрутка с плавным переходом
  useEffect(() => {
    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex(prev => (prev + 1) % partners.length);
          setIsTransitioning(false);
        }, 500); // Длительность анимации
      }, 3000);
    };

    startAutoScroll();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [partners.length]);

  // Обработчики свайпа
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Свайп влево
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % partners.length);
        setIsTransitioning(false);
      }, 500);
    } else if (touchEndX.current - touchStartX.current > 50) {
      // Свайп вправо
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prev => (prev - 1 + partners.length) % partners.length);
        setIsTransitioning(false);
      }, 500);
    }
    
    // Перезапускаем автопрокрутку
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % partners.length);
        setIsTransitioning(false);
      }, 500);
    }, 3000);
  };

  // Создаем циклический список партнеров для карусели
  const getVisiblePartners = () => {
    const result = [];
    for (let i = 0; i < visibleItems; i++) {
      const index = (currentIndex + i) % partners.length;
      result.push(partners[index]);
    }
    return result;
  };

  const visiblePartners = getVisiblePartners();

  return (
    <section className="py-8 sm:py-12 bg-white relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="container px-4 sm:px-6 mx-auto relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Партнеры
          </h2>
          <div className="w-12 sm:w-16 h-0.5 bg-blue-600 mx-auto" />
        </div>
        
        <div 
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex justify-center overflow-hidden">
            <div className={`flex gap-2 sm:gap-4 md:gap-6 px-2 sm:px-0 ${isTransitioning ? 'opacity-70' : 'opacity-100'} transition-opacity duration-500`}>
              {visiblePartners.map((partner, index) => (
                <div
                  key={`${partner.name}-${currentIndex + index}`}
                  className={`group relative p-2 sm:p-3 md:p-4 bg-white rounded-lg shadow-xs hover:shadow-md transition-all border border-gray-50 hover:border-blue-100 ${
                    index === 0 ? 'scale-95' : index === visibleItems - 1 ? 'scale-95' : 'scale-100'
                  }`}
                  style={{ 
                    width: `${itemWidth}px`,
                    minWidth: `${itemWidth * 0.8}px`,
                    flexShrink: 0,
                    transition: 'transform 0.5s ease, opacity 0.5s ease',
                  }}
                >
                  <div className="aspect-[3/2] flex items-center justify-center">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-full h-full object-contain max-h-8 sm:max-h-10 md:max-h-12 grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100"
                      title={partner.name}
                      loading="lazy"
                      width={100}
                      height={70}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
                    <div className="absolute bottom-0 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="text-xs font-medium text-white bg-blue-600 px-2 py-1 rounded shadow-sm">
                        {partner.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}