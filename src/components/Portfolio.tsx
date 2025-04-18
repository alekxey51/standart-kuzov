import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import worksData from '../data/portfolio.json';
import { WorkDetailsModal } from '../forms/DetailsPortfolioForm';

interface Work {
  id: number;
  title: string;
  category: string;
  description: string;
  before: string;
  after: string;
  details: {
    time: string;
    price: string;
    features: string[];
  };
}

export function Portfolio() {
  const [works, setWorks] = useState<Work[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transition, setTransition] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(4);
  const [hoveredWork, setHoveredWork] = useState<number | null>(null);
  const [selectedWork, setSelectedWork] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Инициализация случайных работ
  useEffect(() => {
    const shuffled = [...worksData.works].sort(() => 0.5 - Math.random());
    setWorks(shuffled.slice(0, 8));
  }, []);

  // Адаптивное количество отображаемых элементов
  useEffect(() => {
    const updateItemsToShow = () => {
      const width = window.innerWidth;
      setItemsToShow(
        width >= 1280 ? 4 :
        width >= 1024 ? 3 :
        width >= 650 ? 2 : 1
      );
    };

    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    return () => window.removeEventListener('resize', updateItemsToShow);
  }, []);

  // Автопрокрутка
  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentIndex, itemsToShow, works.length]);

  const nextSlide = useCallback(() => {
    if (works.length <= itemsToShow) return;
    
    setTransition(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % (works.length - itemsToShow + 1));
      setTransition(false);
    }, 300);
  }, [works.length, itemsToShow]);

  const prevSlide = useCallback(() => {
    if (works.length <= itemsToShow) return;
    
    setTransition(true);
    setTimeout(() => {
      setCurrentIndex(prev => 
        (prev - 1 + (works.length - itemsToShow + 1)) % 
        (works.length - itemsToShow + 1)
      );
      setTransition(false);
    }, 300);
  }, [works.length, itemsToShow]);

  const goToSlide = useCallback((index: number) => {
    setTransition(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setTransition(false);
    }, 300);
  }, []);

  const getVisibleWorks = useCallback(() => {
    if (works.length <= itemsToShow) return works;
    return Array.from({ length: itemsToShow }, (_, i) => 
      works[(currentIndex + i) % works.length]
    );
  }, [works, currentIndex, itemsToShow]);

  const openDetails = useCallback((id: number) => {
    setSelectedWork(id);
    document.body.style.overflow = 'hidden';
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const closeDetails = useCallback(() => {
    setSelectedWork(null);
    document.body.style.overflow = 'auto';
    intervalRef.current = setInterval(nextSlide, 5000);
  }, [nextSlide]);

  const visibleWorks = getVisibleWorks();
  const showControls = works.length > itemsToShow;

  return (
    <div className="bg-gray-50 py-12 sm:py-16" id="portfolio">
      {/* Заголовок */}
      <div className="container mx-auto px-4 sm:px-6 text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Наши работы</h2>
        <div className="w-16 sm:w-20 h-1 bg-blue-600 mx-auto" />
      </div>

      {/* Карусель */}
      <div className="container mx-auto px-4 sm:px-6 relative" ref={containerRef}>
        {showControls && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 p-1 sm:p-2 rounded-full shadow-md bg-white hover:bg-gray-100 transition-all"
              aria-label="Предыдущие работы"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 p-1 sm:p-2 rounded-full shadow-md bg-white hover:bg-gray-100 transition-all"
              aria-label="Следующие работы"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </button>
          </>
        )}

        <div 
          className={`grid grid-cols-1 ${itemsToShow >= 2 ? 'sm:grid-cols-2' : ''} ${
            itemsToShow >= 3 ? 'lg:grid-cols-3' : ''} ${
            itemsToShow >= 4 ? 'xl:grid-cols-4' : ''} gap-4 sm:gap-6 transition-opacity duration-300 ${
            transition ? 'opacity-70' : 'opacity-100'
          }`}
        >
          {visibleWorks.map((work) => (
            <div
              key={work.id}
              className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden hover:shadow-lg sm:hover:shadow-xl transition-shadow duration-300"
              onMouseEnter={() => setHoveredWork(work.id)}
              onMouseLeave={() => setHoveredWork(null)}
            >
              <div 
                className="relative aspect-video cursor-pointer" 
                onClick={() => openDetails(work.id)}
              >
                <img
                  src={hoveredWork === work.id ? work.after : work.before}
                  alt={work.title}
                  className="w-full h-full object-cover transition-opacity duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-blue-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded sm:rounded-md text-xs font-bold">
                  {hoveredWork === work.id ? 'ПОСЛЕ' : 'ДО'}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30">
                  <span className="bg-white text-blue-600 px-3 sm:px-4 py-1 sm:py-2 rounded sm:rounded-lg font-medium text-sm sm:text-base">
                    Подробнее
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-0.5 sm:py-1 rounded mb-1 sm:mb-2">
                  {work.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">{work.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2">{work.description}</p>
                <button 
                  onClick={() => openDetails(work.id)}
                  className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center text-sm sm:text-base"
                >
                  Подробнее <ChevronRight className="ml-1" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Индикаторы */}
      {showControls && (
        <div className="flex justify-center mt-6 sm:mt-8 gap-1.5 sm:gap-2">
          {Array.from({ length: works.length - itemsToShow + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                currentIndex === i ? 'bg-blue-600 w-3 sm:w-4' : 'bg-gray-300'
              }`}
              aria-label={`Перейти к слайду ${i + 1}`}
            />
          ))}
        </div>
      )}

      <WorkDetailsModal 
        selectedWork={selectedWork} 
        onClose={closeDetails} 
      />
    </div>
  );
}