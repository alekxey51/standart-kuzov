import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, Clock, MapPin, Banknote, CheckCircle } from 'lucide-react';
import vacanciesData from '../data/vacancies.json';
import companyData from '../data/config.json';
import { SeoMarkup } from '../utils/seoMarkup';
import { ApplyForm } from '../forms/ApplyForm';

export const VacancyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isApplying, setIsApplying] = React.useState(false);
  
  const vacancy = vacanciesData.VACANCIES_LIST.find(v => v.id === Number(id));
  const { COMPANY_INFO } = companyData;

  if (!vacancy || !vacancy.isActive) {
    return <Navigate to="/404" replace />;
  }

  const seoData = {
    title: `Кузовной ремонт и покраска автомобилей в Минске | ${COMPANY_INFO.companyName}`,
    description: `Профессиональный кузовной ремонт и покраска автомобилей в Минске. Современное оборудование Опытные мастера. Запишитесь онлайн!`,
    keywords: "кузовной ремонт, покраска автомобиля, ремонт авто Минск, полировка кузова, удаление вмятин, стапельные работы, покраска бампера, рихтовка без покраски",
    canonicalUrl: `vacancies`,
    breadcrumbName: 'Вакансия',
    services: [
      "Кузовной ремонт", "Покраска автомобиля", "Ремонт вмятин без покраски",
      "Восстановление геометрии кузова", "Полировка кузова", "Ремонт бампера"
    ]
  };

  const infoItems = [
    { icon: Clock, text: `Опыт работы: ${vacancy.experience}` },
    { icon: MapPin, text: vacancy.location },
    { icon: Banknote, text: vacancy.salary },
    { icon: Briefcase, text: vacancy.type }
  ];

  const sections = [
    { title: 'Обязанности', items: vacancy.responsibilities },
    { title: 'Требования', items: vacancy.requirements },
    { title: 'Условия', items: vacancy.conditions }
  ];

  return (
    <>
      <SeoMarkup seoData={seoData}/>
      <div className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="container px-4 sm:px-6 mx-auto">
          <button
            onClick={() => navigate('/vacancies')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-700 transition mb-6 sm:mb-8 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Назад к вакансиям
          </button>

          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 sm:p-8">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">{vacancy.title}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm sm:text-base text-gray-600">
                {infoItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3">
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <span className="whitespace-nowrap">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">{vacancy.description}</p>

              {sections.map((section) => (
                <div key={section.title} className="mb-6 sm:mb-8">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">{section.title}:</h2>
                  <ul className="space-y-2 sm:space-y-3">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 sm:gap-3">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsApplying(true)}
              className="mt-6 sm:mt-8 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-base sm:text-lg font-medium transition transform hover:scale-[1.02]"
            >
              Откликнуться на вакансию
            </button>
          </div>

          {isApplying && (
            <ApplyForm 
              vacancyTitle={vacancy.title}
              onClose={() => setIsApplying(false)}
              onSubmitSuccess={() => setIsApplying(false)}
            />
          )}
        </div>
      </div>
    </>
  );
};