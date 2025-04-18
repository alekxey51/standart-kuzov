import React from 'react';
import { CheckCircle, Award, Users, Clock, Wrench, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { value: '24+', label: 'года работы', icon: Clock },
  { value: '15K+', label: 'отремонтированных авто', icon: Wrench },
  { value: '98%', label: 'довольных клиентов', icon: Users },
  { value: '5 лет', label: 'гарантия на работы', icon: Shield }
];

const features = [
  'Собственный цех 1200 м²',
  '3D-измерительный комплекс',
  'Оригинальные запчасти',
  'Страховая сертификация',
  'Гарантия до 5 лет',
  'Комфортная зона ожидания'
];

export function AboutUs() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white" id="о-компании">
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="relative">
            <img
              src="https://i.ibb.co/B2Yp351Q/36f155ad-765f-496d-9623-7cc2aac6e1c1.png"
              alt="Наш автосервис"
              className="rounded-lg shadow-md w-full"
            />
            
            <div className="absolute -bottom-4 -right-4 bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-1">
                <Award className="text-yellow-500 mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-bold text-sm sm:text-base">Лучший сервис 2023</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-600">по версии Auto.by</div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              Профессиональный автосервис с 1999 года
            </h2>
            
            <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Наша команда специализируется на комплексном восстановлении автомобилей после ДТП. 
              Мы сочетаем многолетний опыт с современными технологиями ремонта, используя только 
              профессиональное оборудование и материалы премиум-класса.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {features.map((item) => (
                <li key={item} className="flex items-start">
                  <CheckCircle className="text-blue-600 mr-2 mt-0.5 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {stats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="bg-gray-50 p-3 sm:p-4 rounded-md text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">{value}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/about"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 sm:px-5 rounded-md transition-colors text-sm sm:text-base"
              >
                Подробнее о компании
              </Link>
              <Link
                to="/reviews"
                className="border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-medium px-4 py-2 sm:px-5 rounded-md transition-colors text-sm sm:text-base"
              >
                Отзывы клиентов
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}