import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, MapPin, Banknote } from 'lucide-react';
import vacanciesData from '../data/vacancies.json';
import companyData from '../data/config.json';
import { SeoMarkup } from '../utils/seoMarkup';

export const Vacancies = () => {
  const activeVacancies = vacanciesData.VACANCIES_LIST.filter(v => v.isActive);
  const { COMPANY_INFO } = companyData;
  const icons = { Clock, MapPin, Banknote };
  const infoItems = ['experience', 'location', 'salary'];

  const seoData = {
    title: `Кузовной ремонт и покраска автомобилей в Минске | ${COMPANY_INFO.companyName}`,
    description: `Профессиональный кузовной ремонт и покраска автомобилей в Минске. Современное оборудование Опытные мастера. Запишитесь онлайн!`,
    keywords: "кузовной ремонт, покраска автомобиля, ремонт авто Минск, полировка кузова, удаление вмятин, стапельные работы, покраска бампера, рихтовка без покраски",
    canonicalUrl: `vacancies`,
    breadcrumbName: 'Вакансии',
    services: [
      "Кузовной ремонт", "Покраска автомобиля", "Ремонт вмятин без покраски",
      "Восстановление геометрии кузова", "Полировка кузова", "Ремонт бампера"
    ]
  };

  return (
    <>
      <SeoMarkup seoData={seoData}/>
      <div className="py-20 container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Вакансии</h1>
        
        {!activeVacancies.length ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">В данный момент нет активных вакансий</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeVacancies.map(({ id, title, description, ...rest }) => (
              <Link
                key={id}
                to={`/vacancies/${id}`}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col h-full"
              > 
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-semibold hover:underline">{title}</h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {description.length > 100 ? `${description.substring(0, 100)}...` : description}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-gray-500 mt-auto">
                  {infoItems.map(item => {
                    const Icon = icons[item === 'experience' ? 'Clock' : item === 'location' ? 'MapPin' : 'Banknote'];
                    return rest[item] && (
                      <div key={item} className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{item === 'experience' ? `Опыт работы: ${rest[item]}` : rest[item]}</span>
                      </div>
                    );
                  })}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};