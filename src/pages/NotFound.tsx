import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, ArrowRight, Home } from 'lucide-react';
import companyData from '../data/config.json';
import { SeoMarkup } from '../utils/seoMarkup';

const ActionButton = ({ to, onClick, icon: Icon, children, className, ...props }) => {
  const Component = to ? Link : 'button';
  return (
    <Component
      to={to}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${className}`}
      {...props}
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      {children}
    </Component>
  );
};

export default function NotFound() {
  const { COMPANY_INFO, CONTACT_INFO } = companyData;

  const seoData = {
    title: `Страница не найдена (404) | ${COMPANY_INFO.companyName}`,
    description: `Запрошенная страница не существует. Вернитесь на главную или воспользуйтесь поиском по сайту ${COMPANY_INFO.companyName}.`,
    keywords: "кузовной ремонт, покраска автомобиля, ремонт авто Минск, полировка кузова, удаление вмятин, стапельные работы, покраска бампера, рихтовка без покраски",
    canonicalUrl: `*`,
    breadcrumbName: '404',
    services: [
      "Кузовной ремонт", "Покраска автомобиля", "Ремонт вмятин без покраски", 
      "Восстановление геометрии кузова", "Полировка кузова", "Ремонт бампера"
    ]
  };

  return (
    <>
      <SeoMarkup seoData={seoData}/>

      <div className="flex flex-col items-center justify-start pt-10 md:pt-20 bg-[#f8fafc] px-4 sm:px-6 lg:px-8 min-h-screen" itemScope itemType="https://schema.org/WebPage">
        <div className="text-center w-full max-w-md mx-auto lg:max-w-xl">
          <div className="relative mb-6 md:mb-8 mx-auto w-32 h-32 md:w-40 md:h-40" itemProp="image" itemScope itemType="https://schema.org/ImageObject">
            <div className="absolute inset-0 bg-indigo-100 rounded-full animate-pulse opacity-20"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <Rocket className="w-16 h-16 md:w-20 md:h-20 text-blue-700 animate-bounce" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2 md:mb-3" itemProp="headline">404</h1>
          <h2 className="text-lg sm:text-xl font-medium text-gray-600 mb-4 md:mb-5" itemProp="alternativeHeadline">Ой, кажется мы потерялись</h2>
          <p className="text-sm sm:text-base text-gray-500 mb-6 md:mb-8" itemProp="description">
            Страница, которую вы ищете, была перемещена или больше не существует.
            Попробуйте вернуться на <Link to="/" className="text-blue-600 hover:underline">главную страницу</Link> или воспользуйтесь поиском.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <ActionButton 
              to="/" 
              icon={Home} 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm"
              itemProp="relatedLink"
            >
              На главную
            </ActionButton>
            <ActionButton 
              onClick={() => window.history.back()} 
              icon={ArrowRight} 
              className="text-blue-600 border border-indigo-100 hover:border-indigo-200 hover:bg-indigo-50"
              aria-label="Вернуться на предыдущую страницу"
            >
              Вернуться назад
            </ActionButton>
          </div>

          <div className="mt-8 md:mt-10 text-xs sm:text-sm text-gray-400 pb-10 md:pb-20">
            <p>Нужна помощь?{' '}
              <a href={`mailto:${COMPANY_INFO.supportEmail}`} className="text-blue-500 hover:underline" itemProp="email">
                Напишите нам
              </a>
            </p>
            <p className="mt-1 sm:mt-2">Или позвоните: {' '}
              <a href={`tel:${CONTACT_INFO.phones[0].number.replace(/\D/g, '')}`} className="text-blue-500 hover:underline" itemProp="telephone">
                {COMPANY_INFO.contactPhone}
              </a>
            </p>
          </div>

          <div className="visually-hidden" aria-hidden="true">
            <p>{COMPANY_INFO.name} - профессиональный сервис по ремонту автомобилей. Основные разделы сайта: кузовной ремонт, покраска автомобилей, полировка, удаление вмятин без покраски, антикоррозийная обработка.</p>
          </div>
        </div>
      </div>
    </>
  );
}