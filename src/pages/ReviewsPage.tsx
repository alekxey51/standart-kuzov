import React, { useState, useMemo } from 'react';
import { Star, ChevronRight, ChevronLeft, Quote, MessageSquare } from 'lucide-react';
import reviewsData from '../data/reviews.json';
import companyData from '../data/config.json';
import { SeoMarkup } from '../utils/seoMarkup';
import { ReviewModal } from '../forms/ReviewModel';

const REVIEWS_PER_PAGE = 6;
const services = [
  "Кузовной ремонт", "Покраска автомобиля", "Ремонт вмятин без покраски",
  "Восстановление геометрии кузова", "Полировка кузова", "Ремонт бампера"
];

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  text: string;
  car: string;
  service: string;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => {
      const starValue = i + 1;
      return (
        <div key={i} className="relative">
          {rating >= starValue ? (
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
          ) : rating >= starValue - 0.5 ? (
            <>
              <div className="absolute overflow-hidden" style={{ width: '50%' }}>
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
              </div>
              <Star size={16} className="text-gray-300" />
            </>
          ) : (
            <Star size={16} className="text-gray-300" />
          )}
        </div>
      );
    })}
  </div>
);

export function ReviewsPage() {
  const { COMPANY_INFO } = companyData;
  const allReviews: Review[] = reviewsData.reviews;
  const [currentPage, setCurrentPage] = useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
  const averageRating = useMemo(() => 
    Math.round((allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length) * 10) / 10, 
    [allReviews]);

  const totalPages = Math.ceil(allReviews.length / REVIEWS_PER_PAGE);
  const currentReviews = useMemo(() => 
    allReviews.slice((currentPage - 1) * REVIEWS_PER_PAGE, currentPage * REVIEWS_PER_PAGE), 
    [currentPage, allReviews]);

  const paginationRange = useMemo(() => {
    const maxVisible = 5;
    const start = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
    const end = Math.min(start + maxVisible - 1, totalPages);
    return { start, end };
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePrevPage = () => currentPage > 1 && setCurrentPage(p => p - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(p => p + 1);

  const handleSubmitReview = (review: { rating: number; text: string; name: string; photos: File[] }) => {
    console.log('Новый отзыв:', review);
    setIsReviewModalOpen(false);
  };

  return (
    <div className="bg-gray-50">
      <SeoMarkup seoData={{
        title: `Отзывы клиентов | ${COMPANY_INFO.companyName}`,
        description: `Реальные отзывы о кузовном ремонте и покраске автомобилей в ${COMPANY_INFO.companyName}.`,
        keywords: "отзывы кузовной ремонт, покраска автомобиля отзывы, автосервис Минск отзывы, ремонт авто отзывы",
        canonicalUrl: `reviews`,
        breadcrumbName: 'Отзывы',
        services
      }}/>

      <section className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Отзывы клиентов</h1>
          <p className="text-lg sm:text-xl lg:text-2xl max-w-4xl mx-auto">
            Вот что говорят владельцы автомобилей после ремонта в нашем сервисе.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {currentReviews.map(review => (
            <article key={review.id} className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="p-6 sm:p-8 h-full flex flex-col">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-blue-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                    <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{review.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">{review.car}</p>
                  </div>
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <StarRating rating={review.rating} />
                  <span className="text-xs sm:text-sm text-gray-500">
                    {review.date} • {review.service}
                  </span>
                </div>
                
                <p className="text-sm sm:text-base text-gray-700 mb-6 flex-grow">{review.text}</p>
              </div>
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <nav className="flex justify-center items-center mt-8">
            <button 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-1.5 sm:p-2 rounded-md border border-gray-300 ${currentPage === 1 ? 'opacity-50' : 'hover:bg-gray-100'}`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <div className="flex mx-1 sm:mx-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                (i + 1 >= paginationRange.start && i + 1 <= paginationRange.end) && (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md mx-1 text-xs sm:text-sm ${
                      currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              ))}
            </div>
            
            <button 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-1.5 sm:p-2 rounded-md border border-gray-300 ${currentPage === totalPages ? 'opacity-50' : 'hover:bg-gray-100'}`}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </nav>
        )}
      </main>

      <section className="bg-gradient-to-r from-blue-700 to-blue-800 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Оставьте свой отзыв</h2>
          <button 
            onClick={() => setIsReviewModalOpen(true)}
            className="bg-white text-blue-600 font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg hover:bg-blue-50 flex items-center mx-auto text-sm sm:text-base"
          >
            <MessageSquare className="mr-2" size={18} />
            Написать отзыв
          </button>
        </div>
      </section>

      <div className="sr-only">
        <p>
          {COMPANY_INFO.name} - автосервис в Минске. Средняя оценка: {averageRating} из 5.
          Мы выполняем: {services.join(', ')}.
        </p>
      </div>

      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}