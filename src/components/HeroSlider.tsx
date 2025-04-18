import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface HeroSliderProps {
  onOpenQuiz: () => void;
}

const slides = [
  {
    title: 'Кузовной ремонт любой сложности',
    subtitle: 'Профессиональное восстановление геометрии кузова с гарантией качества',
    image: 'https://cdn.qwenlm.ai/output/d1dd9684-45fa-4df0-b5d6-e21bffdb5e51/t2i/1bc518b1-748e-4fc8-8225-b5c36c1b321b/25102b49-432e-415e-8f33-683dbdd3fa12.png?key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZV91c2VyX2lkIjoiZDFkZDk2ODQtNDVmYS00ZGYwLWI1ZDYtZTIxYmZmZGI1ZTUxIiwicmVzb3VyY2VfaWQiOiIyNTEwMmI0OS00MzJlLTQxNWUtOGYzMy02ODNkYmRkM2ZhMTIiLCJyZXNvdXJjZV9jaGF0X2lkIjpudWxsfQ.pcs6KnCTUJOLa0xmSJqCQkkdisojO-ZzhxRsqQvyHgw',
    cta: 'Рассчитать стоимость'
  },
  {
    title: 'Покрасочные работы премиум-класса',
    subtitle: 'Идеальное покрытие с точным подбором цвета и защитным лаком',
    image: 'https://cdn.qwenlm.ai/output/d1dd9684-45fa-4df0-b5d6-e21bffdb5e51/t2i/bbbce063-64eb-4997-a43a-2252bc207060/f4e7bb61-c748-4483-a6dc-ec4ebc44cf1a.png?key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZV91c2VyX2lkIjoiZDFkZDk2ODQtNDVmYS00ZGYwLWI1ZDYtZTIxYmZmZGI1ZTUxIiwicmVzb3VyY2VfaWQiOiJmNGU3YmI2MS1jNzQ4LTQ0ODMtYTZkYy1lYzRlYmM0NGNmMWEiLCJyZXNvdXJjZV9jaGF0X2lkIjpudWxsfQ.VdfplEGErmrqfL2doczxNz29iLHC-Q_avLXZsh0QDBE',
    cta: 'Записаться на покраску'
  },
  {
    title: 'Комплексный уход за автомобилем',
    subtitle: 'От антикоррозийной обработки до керамического покрытия',
    image: 'https://cdn.qwenlm.ai/output/d1dd9684-45fa-4df0-b5d6-e21bffdb5e51/t2i/bbbce063-64eb-4997-a43a-2252bc207060/d77cb4df-0ad8-4050-9157-9d5a4ca30bb8.png?key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZV91c2VyX2lkIjoiZDFkZDk2ODQtNDVmYS00ZGYwLWI1ZDYtZTIxYmZmZGI1ZTUxIiwicmVzb3VyY2VfaWQiOiJkNzdjYjRkZi0wYWQ4LTQwNTAtOTE1Ny05ZDVhNGNhMzBiYjgiLCJyZXNvdXJjZV9jaGF0X2lkIjpudWxsfQ.99IjHBfrVBtAo04QPc_8N38MxkhtQwl6ItbO8dDyadA',
    cta: 'Получить консультацию'
  }
];

export function HeroSlider({ onOpenQuiz }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);

  const sliderHeight = Math.min(Math.max(windowWidth / aspectRatio, 500), 700);

  const navigateSlide = useCallback((direction: 1 | -1) => {
    setCurrentSlide(prev => (prev + direction + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    navigateSlide(e.clientX - left < width / 2 ? -1 : 1);
  };

  const loadImageAspectRatio = useCallback((url: string) => {
    const img = new Image();
    img.onload = () => setAspectRatio(img.width / img.height);
    img.src = url;
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => navigateSlide(1), 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, navigateSlide]);

  useEffect(() => {
    loadImageAspectRatio(slides[0].image);
  }, [loadImageAspectRatio]);

  return (
    <div 
      className="relative w-full overflow-hidden" 
      style={{ height: `${sliderHeight}px` }}
      onClick={handleClick}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute w-full h-full object-cover"
            style={{ 
              objectPosition: 'center',
              transform: windowWidth < 768 ? 'scale(1.1)' : 'none'
            }}
            onLoad={() => loadImageAspectRatio(slide.image)}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />

          <div className="relative h-full flex items-center md:-mt-10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
                  {slide.title}
                </h1>
                <p className="text-base sm:text-lg text-white/90 mb-4 sm:mb-6">
                  {slide.subtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQuiz();
                    }}
                    className="
                      bg-gradient-to-r from-blue-700 to-blue-800 
                      hover:from-blue-800 hover:to-blue-900
                      text-white 
                      py-3 px-6 sm:px-8
                      rounded-lg 
                      font-medium 
                      shadow-md hover:shadow-lg
                      transition-all
                      text-sm sm:text-base
                    "
                  >
                    {slide.cta}
                  </button>
                  <Link
                    to="/portfolio"
                    className="
                      bg-transparent 
                      border-2 border-white 
                      hover:bg-white hover:text-black 
                      text-white 
                      py-3 px-6
                      rounded-lg 
                      transition-colors 
                      text-center 
                      font-medium
                      text-sm sm:text-base
                    "
                    onClick={(e) => e.stopPropagation()}
                  >
                    Смотреть примеры работ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}