import React, { useState, useEffect } from 'react';
import { X, Check, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import worksData from '../data/portfolio.json';
import { RepairForm } from '../forms/RepairForm';

interface Work {
  id: number;
  title: string;
  category: string;
  description: string;
  before: string;
  after: string;
  gallery?: string[];
  details: {
    time: string;
    price: string;
    features: string[];
  };
}

interface WorkDetailsModalProps {
  selectedWork: number | null;
  onClose: () => void;
}

export function WorkDetailsModal({ selectedWork, onClose }: WorkDetailsModalProps) {
  const [showForm, setShowForm] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const work = worksData.works.find(w => w.id === selectedWork);
  const galleryImages = work?.gallery?.length ? work.gallery : work ? [work.before, work.after] : [];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!work) return null;

  const handleFormSubmit = (data: { name: string; phone: string; carModel: string; date: string }) => {
    console.log('Форма отправлена:', { work: work.title, ...data });
    setShowForm(false);
    onClose();
  };

  const openFullscreen = (img: string, index: number) => {
    setFullscreenImage(img);
    setCurrentImageIndex(index);
  };

  const closeFullscreen = () => setFullscreenImage(null);

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1)
      : (currentImageIndex === galleryImages.length - 1 ? 0 : currentImageIndex + 1);
    setCurrentImageIndex(newIndex);
    setFullscreenImage(galleryImages[newIndex]);
  };

  const renderImageGallery = (images: string[], isMobileGallery = false) => (
    <div className={`flex ${isMobileGallery ? 'overflow-x-auto space-x-4 no-scrollbar' : 'flex-col space-y-4'}`}>
      {images.map((img, index) => (
        <div key={index} className={`relative rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors ${isMobileGallery ? 'flex-shrink-0 aspect-[4/3] w-32 h-24' : 'w-full h-40'}`}>
          <img 
            src={img} 
            alt={`Пример работы ${index + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => openFullscreen(img, index)}
          />
          <button 
            className="absolute top-2 right-2 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              openFullscreen(img, index);
            }}
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
        <div className={`bg-white rounded-xl max-h-[90vh] w-full max-w-4xl flex ${isMobile ? 'flex-col' : 'flex-row'} overflow-hidden`}>
          <div className={`flex flex-col ${!isMobile && galleryImages.length ? 'w-2/3' : 'w-full'}`}>
            <div className="relative flex-shrink-0">
              <div className="relative w-full h-52 sm:h-80 overflow-hidden">
                <img 
                  src={work.before} 
                  alt="До" 
                  className="absolute inset-0 w-full h-full object-cover" 
                  style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
                />
                <img 
                  src={work.after} 
                  alt="После" 
                  className="absolute inset-0 w-full h-full object-cover" 
                  style={{ clipPath: `inset(0 0 0 ${sliderValue}%)` }}
                />
                <div className="absolute inset-0">
                  <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${sliderValue}%`, transform: 'translateX(-50%)' }}>
                    <div className="relative">
                      <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg cursor-ew-resize">
                        <X className="w-3.5 h-3.5" />
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-11 bg-white" />
                    </div>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(+e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                  />
                </div>
              </div>

              {isMobile && (
                <button onClick={onClose} className="absolute top-2.5 right-2.5 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-100 z-10 transition-colors">
                  <X className="w-4.5 h-4.5" />
                </button>
              )}
            </div>

            {isMobile && galleryImages.length > 0 && (
              <div className="w-full border-t border-gray-200 p-4">
                {renderImageGallery(galleryImages, true)}
              </div>
            )}

            <div className="p-5 flex flex-col" style={{ height: isMobile ? 'auto' : 'calc(100% - 320px)' }}>
              <div className="mb-3.5">
                <h2 className="text-lg font-bold text-gray-900 mb-1.5">{work.title}</h2>
                <span className="text-xs text-gray-600 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  {work.category}
                </span>
              </div>
              
              <div className={`flex-1 ${isMobile ? '' : 'overflow-y-auto'} pr-2`}>
                <p className="text-sm text-gray-700 mb-5">{work.description}</p>
                <div className="mb-5">
                  <h3 className="text-base font-semibold text-gray-800 mb-3">Выполненные работы</h3>
                  <ul className="space-y-2.5">
                    {work.details.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="flex-shrink-0 h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-md text-sm transition-colors shadow-md hover:shadow-lg mt-4"
                onClick={() => setShowForm(true)}
              >
                Записаться на ремонт
              </button>
            </div>
          </div>

          {!isMobile && galleryImages.length > 0 && (
            <div className="w-1/3 border-l border-gray-200 flex flex-col flex-shrink-0 relative" style={{ height: 'inherit' }}>
              <div className="sticky top-0 bg-white z-10 border-b border-gray-200 flex justify-between items-center p-5">
                <h3 className="text-base font-semibold text-gray-800">Галерея работ</h3>
                <button onClick={onClose} className="bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-100 transition-colors">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {renderImageGallery(galleryImages)}
              </div>
            </div>
          )}
        </div>
      </div>

      {fullscreenImage && (
        <div className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4" onClick={closeFullscreen}>
          <div className="relative w-full h-full flex items-center justify-center">
            <button 
              onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
              className="absolute left-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors z-10"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
            
            <div className="max-w-full max-h-full flex items-center justify-center">
              <img 
                src={fullscreenImage} 
                alt="Полноэкранный просмотр"
                className="max-w-full max-h-full object-contain cursor-pointer"
                onClick={(e) => e.stopPropagation()}
                style={{ maxHeight: '90vh' }}
              />
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
              className="absolute right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors z-10"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
            
            <button 
              onClick={closeFullscreen}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/75 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-sm mx-4 p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold text-gray-900">Запись на ремонт</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <RepairForm 
              workTitle={work.title}
              onClose={() => setShowForm(false)}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      )}
    </>
  );
}