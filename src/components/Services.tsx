import React from 'react';
import { Wrench, Paintbrush, Car, Shield, Settings, PenTool as Tool } from 'lucide-react';
import { Link } from 'react-router-dom';
import servicesData from '../data/services.json';

const iconMap = {
  Wrench,
  Paintbrush,
  Car,
  Shield,
  Settings,
  PenTool: Tool,
  Sparkles: Car
};

interface Service {
  id: string;
  icon: keyof typeof iconMap;
  title: string;
  description: string;
  price: string;
}

export function Services() {
  const { SERVICES } = servicesData;

  return (
    <section className="py-12 sm:py-16 bg-gray-50 overflow-hidden" id="услуги">
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Наши услуги
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-blue-600 mx-auto mb-4 sm:mb-6" />
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Полный спектр услуг по кузовному ремонту и покраске автомобилей любой марки
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {SERVICES.map(({ id, icon, title, description, price }) => {
            const Icon = iconMap[icon] || Car;
            return (
              <div
                key={id}
                className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full"
              >
                <div className="p-4 sm:p-6 flex-grow">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="bg-blue-100 p-2 sm:p-3 rounded-md sm:rounded-lg">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                      {title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                    {description}
                  </p>
                </div>

                <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg sm:text-xl font-bold text-blue-600">
                      {price}
                    </span>
                    <Link
                      to={`/services`}
                      className="text-blue-600 hover:text-blue-800 transition-colors flex items-center text-sm sm:text-base font-medium"
                    >
                      Подробнее
                      <ChevronRight className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);