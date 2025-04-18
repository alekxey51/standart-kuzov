import React from 'react';
import { Button } from './Button';
import { Phone, Camera, ChevronRight, MapPin } from 'lucide-react';
import config from '../data/config.json';

interface CallToActionProps {
  onOpenQuiz: () => void;
}

export function CallToAction({ onOpenQuiz }: CallToActionProps) {
  const phoneNumber = config.CONTACT_INFO?.phones?.[0]?.number || '+375 (29) 943-28-53';
  const address = config.CONTACT_INFO?.address || 'г. Минск, ул. Автомобилистов 2Б';
  const formattedPhone = phoneNumber.replace(/\D/g, '');
  const displayPhone = phoneNumber.split(') ')[1]?.split('-').join(' ') || phoneNumber;

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Узнайте точную стоимость ремонта за 5 минут
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-10">
            Отправьте фото повреждений и получите детальный расчет с вариантами ремонта
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button
              onClick={onOpenQuiz}
              className="flex items-center justify-center bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
            >
              <Camera className="w-5 h-5 mr-2 sm:mr-3" />
              Отправить фото на расчет
              <ChevronRight className="w-5 h-5 ml-2 sm:ml-3" />
            </Button>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:block w-px h-10 bg-blue-400/50"></div>
              <a
                href={`tel:${formattedPhone}`}
                className="flex items-center gap-2 sm:gap-3 text-white hover:text-blue-100 transition-colors group"
              >
                <div className="bg-blue-500 p-2 rounded-full group-hover:bg-blue-400 transition-colors">
                  <Phone size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm text-blue-200">Контактный телефона</div>
                  <div className="text-lg sm:text-xl font-bold">
                    {displayPhone}
                    <span className="text-xs sm:text-sm font-normal text-blue-200 ml-2">А1 МТС</span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-blue-200 text-sm flex items-center justify-center gap-2">
            <MapPin size={16} />
            <span>Или приезжайте на бесплатный осмотр по адресу: {address}</span>
          </div>
        </div>
      </div>
    </section>
  );
}