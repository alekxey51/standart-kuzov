import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import worksData from '../data/portfolio.json';
import { RepairForm } from '../forms/RepairForm';
import { WorkDetailsModal } from '../forms/DetailsPortfolioForm';
import companyData from '../data/config.json';
import { SeoMarkup } from '../utils/seoMarkup';

interface Work {
  id: number;
  title: string;
  category: string;
  description: string;
  before: string;
  after: string;
}

const categories = ['Все работы', 'Кузовной ремонт', 'Покраска', 'Полировка', 'Антикоррозийная обработка'];
const services = ["Кузовной ремонт", "Покраска автомобиля", "Ремонт вмятин без покраски", "Восстановление геометрии кузова", "Полировка кузова", "Ремонт бампера"];
const WORKS_PER_PAGE = 6;

export function PortfolioPage() {
  const { COMPANY_INFO } = companyData;
  const works: Work[] = worksData.works;
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [sliderValues, setSliderValues] = useState<Record<number, number>>({});
  const [selectedWork, setSelectedWork] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredWorks = useMemo(() => 
    selectedCategory === categories[0] 
      ? works 
      : works.filter(work => work.category === selectedCategory), 
    [selectedCategory, works]);

  const totalPages = Math.ceil(filteredWorks.length / WORKS_PER_PAGE);
  const currentWorks = useMemo(() => 
    filteredWorks.slice((currentPage - 1) * WORKS_PER_PAGE, currentPage * WORKS_PER_PAGE), 
    [currentPage, filteredWorks]);

  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleSliderChange = (id: number, value: number) => 
    setSliderValues(prev => ({ ...prev, [id]: value }));

  const toggleDetails = (id: number | null) => {
    setSelectedWork(id);
    document.body.style.overflow = id ? 'hidden' : 'auto';
  };

  const handleFormSubmit = (data: { name: string; phone: string; carModel: string; date: string }) => {
    alert('Ваша заявка принята! Мы свяжемся с вами в ближайшее время.');
    setShowForm(false);
    toggleDetails(null);
  };

  React.useEffect(() => setCurrentPage(1), [selectedCategory]);

  return (
    <div className="bg-gray-50">
      <SeoMarkup seoData={{
        title: `Примеры работ по кузовному ремонту | ${COMPANY_INFO.companyName}`,
        description: `Фото до и после кузовного ремонта, покраски и полировки автомобилей в сервисе ${COMPANY_INFO.name}. Реальные примеры восстановления автомобилей после ДТП.`,
        keywords: "кузовной ремонт, покраска автомобиля, ремонт авто Минск, полировка кузова, удаление вмятин, стапельные работы, покраска бампера, рихтовка без покраски, примеры кузовного ремонта, фото покраски авто, работы автосервиса, восстановление автомобилей, ремонт после ДТП",
        canonicalUrl: `portfolio`,
        breadcrumbName: 'Портфолио',
        services
      }}/>

      <section className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Наши работы</h1>
          <p className="text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto">
            Примеры восстановления автомобилей в нашем сервисе
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {currentWorks.map(work => {
            const sliderValue = sliderValues[work.id] || 50;
            return (
              <article key={work.id} className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative aspect-video rounded-t-lg sm:rounded-t-xl overflow-hidden">
                  <img src={work.before} alt={`${work.title} - До`} className="absolute inset-0 w-full h-full object-cover" 
                    style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }} />
                  <img src={work.after} alt={`${work.title} - После`} className="absolute inset-0 w-full h-full object-cover" 
                    style={{ clipPath: `inset(0 0 0 ${sliderValue}%)` }} />
                  <div className="absolute inset-0">
                    <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${sliderValue}%`, transform: 'translateX(-50%)' }}>
                      <div className="relative">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full flex items-center justify-center shadow-lg cursor-ew-resize">
                          <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 sm:h-10 bg-white" />
                      </div>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={sliderValue}
                      onChange={(e) => handleSliderChange(work.id, +e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                    />
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-0.5 sm:py-1 rounded mb-2">
                    {work.category}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2 h-[3em]">
                    {work.title}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2">
                    {work.description}
                  </p>
                  <button 
                    onClick={() => toggleDetails(work.id)}
                    className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center text-sm sm:text-base"
                  >
                    Смотреть подробнее <ChevronRight className="ml-1" size={14} sm:size={18} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 sm:mt-8">
            <button 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-1.5 sm:p-2 rounded-md border border-gray-300 mr-3 sm:mr-4 transition-colors duration-300 ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md mx-0.5 sm:mx-1 font-medium transition-colors duration-300 text-xs sm:text-sm ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-1.5 sm:p-2 rounded-md border border-gray-300 ml-3 sm:ml-4 transition-colors duration-300 ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          </div>
        )}

        <div className="visually-hidden" aria-hidden="true">
          <p>
            {COMPANY_INFO.name} демонстрирует примеры работ по кузовному ремонту и покраске автомобилей.
            В нашем портфолио вы можете увидеть фото автомобилей до и после ремонта.
            Мы выполняем: {categories.filter(c => c !== 'Все работы').join(', ')}.
          </p>
          <p>Наши специалисты восстановили более {works.length} автомобилей.</p>
        </div>

        {selectedWork && <WorkDetailsModal selectedWork={selectedWork} onClose={() => toggleDetails(null)} />}

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
                workTitle={works.find(w => w.id === selectedWork)?.title || ''}
                onClose={() => setShowForm(false)}
                onSubmit={handleFormSubmit}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}