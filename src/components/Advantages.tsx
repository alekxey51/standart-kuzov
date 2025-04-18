import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Shield, Clock, PenTool, Calendar, ThumbsUp, ChevronLeft, ChevronRight } from 'lucide-react';

const advantages = [
  { icon: Shield, title: 'Гарантия качества', description: 'Предоставляем официальную гарантию до 5 лет на все виды кузовных работ и покраску' },
  { icon: Clock, title: 'Оптимальные цены', description: 'Честное ценообразование без скрытых платежей. Рассчитаем стоимость сразу по фото' },
  { icon: PenTool, title: 'Опыт 24+ года', description: 'Профессиональные мастера с опытом работы от 10 лет. Работаем с автомобилями любых марок' },
  { icon: Calendar, title: 'Соблюдение сроков', description: 'Выполняем ремонт точно в срок. При необходимости предоставляем подменный автомобиль' },
  { icon: ThumbsUp, title: 'Комплексный подход', description: 'Полный цикл работ от диагностики до финишной полировки. Все в одном месте' }
];

const getVisibleCount = (width: number) => {
  if (width < 640) return 1;
  if (width < 768) return 2;
  if (width < 1024) return 3;
  if (width < 1280) return 4;
  return 5;
};

export function Advantages() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [windowWidth, setWindowWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const showArrows = visibleCount < advantages.length;

  // Функция для обновления видимого количества элементов
  const updateVisibleCount = useCallback(() => {
    const width = window.innerWidth;
    setWindowWidth(width);
    setVisibleCount(getVisibleCount(width));
  }, []);

  // Получаем видимые преимущества
  const getVisibleAdvantages = useCallback(() => {
    const result = [];
    for (let i = 0; i < Math.min(visibleCount, advantages.length); i++) {
      const index = (currentIndex + i) % advantages.length;
      result.push(advantages[index]);
    }
    return result;
  }, [currentIndex, visibleCount]);

  // Автопрокрутка
  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    intervalRef.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % advantages.length);
        setIsTransitioning(false);
      }, 300);
    }, 3000);
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const navigateSlide = useCallback((direction: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + direction + advantages.length) % advantages.length);
      setIsTransitioning(false);
    }, 300);
    stopAutoPlay();
    if (!isHovered) {
      setTimeout(startAutoPlay, 5000);
    }
  }, [isHovered, startAutoPlay, stopAutoPlay]);

  // Инициализация и обработка ресайза
  useEffect(() => {
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => {
      window.removeEventListener('resize', updateVisibleCount);
      stopAutoPlay();
    };
  }, [updateVisibleCount, stopAutoPlay]);

  // Управление автопрокруткой
  useEffect(() => {
    if (!isHovered && showArrows) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
    return () => stopAutoPlay();
  }, [isHovered, showArrows, startAutoPlay, stopAutoPlay]);

  return (
    <div className="relative -mt-16 md:-mt-24 z-10">
      <div className="container mx-auto px-4">
        <div 
          className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-gray-100"
          ref={containerRef}
        >
          <div 
            className="relative overflow-hidden rounded-lg"
            onMouseEnter={() => {
              setIsHovered(true);
              stopAutoPlay();
            }}
            onMouseLeave={() => {
              setIsHovered(false);
              if (showArrows) startAutoPlay();
            }}
          >
            {showArrows && (
              <>
                <button
                  onClick={() => navigateSlide(-1)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 p-1 sm:p-2 rounded-full shadow-md bg-white hover:bg-gray-100 transition-all"
                  aria-label="Предыдущие работы"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </button>
                <button
                  onClick={() => navigateSlide(1)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 p-1 sm:p-2 rounded-full shadow-md bg-white hover:bg-gray-100 transition-all"
                  aria-label="Следующие работы"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </button>
              </>
            )}
            
            <div className="flex flex-nowrap transition-transform duration-300">
              {getVisibleAdvantages().map(({ icon: Icon, title, description }, index) => (
                <div 
                  key={`${title}-${index}`}
                  className={`flex-shrink-0 flex flex-col items-center text-center p-4 hover:bg-blue-50/50 rounded-xl transition-all duration-300 group ${
                    isTransitioning ? 'opacity-70' : 'opacity-100 hover:-translate-y-1'
                  }`}
                  style={{ 
                    width: `${100 / Math.min(visibleCount, advantages.length)}%`,
                    minWidth: `${100 / Math.min(visibleCount, advantages.length)}%`
                  }}
                >
                  <div className="p-3 rounded-full mb-4 bg-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Icon size={28} className="text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}