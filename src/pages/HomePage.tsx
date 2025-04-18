import React, { useState } from 'react';
import { HeroSlider } from '../components/HeroSlider';
import { Advantages } from '../components/Advantages';
import { Services } from '../components/Services';
import { AboutUs } from '../components/AboutUs';
import { CallToAction } from '../components/CallToAction';
import { Portfolio } from '../components/Portfolio';
import { Partners } from '../components/Partners';
import { QuizModal } from '../forms/QuizModalForm';
import companyData from '../data/config.json';
import { SeoMarkup } from '../utils/seoMarkup';

export function HomePage() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const { COMPANY_INFO, CONTACT_INFO, SOCIAL_LINKS } = companyData;

  // SEO-данные для страницы
  const seoData = {
    title: `Кузовной ремонт и покраска автомобилей в Минске | ${COMPANY_INFO.companyName}`,
    description: `Профессиональный кузовной ремонт и покраска автомобилей в Минске. Современное оборудование Опытные мастера. Запишитесь онлайн!`,
    keywords: "кузовной ремонт, покраска автомобиля, ремонт авто Минск, полировка кузова, удаление вмятин, стапельные работы, покраска бампера, рихтовка без покраски",
    canonicalUrl: ``,
    breadcrumbName: 'Главная',
    services: [
      "Кузовной ремонт",
      "Покраска автомобиля",
      "Ремонт вмятин без покраски",
      "Восстановление геометрии кузова",
      "Полировка кузова",
      "Ремонт бампера"
    ]
  };

  return (
    <>
      <SeoMarkup seoData={seoData}/>

      {/* Основное содержимое страницы с семантической разметкой */}
      <main itemScope itemType="https://schema.org/WebPage">
        {/* Секция с микроразметкой для слайдера */}
        <section itemScope itemType="https://schema.org/WPHeader">
          <HeroSlider onOpenQuiz={() => setIsQuizOpen(true)} />
        </section>

        {/* Секция преимуществ с микроразметкой */}
        <section itemScope itemType="https://schema.org/ItemList">
          <h2 className="visually-hidden">Наши преимущества</h2>
          <Advantages />
        </section>

        {/* Секция услуг с микроразметкой */}
        <section itemScope itemType="https://schema.org/Service">
          <h2 className="visually-hidden">Услуги автосервиса</h2>
          <Services />
        </section>

        {/* Секция "О нас" с микроразметкой */}
        <section itemScope itemType="https://schema.org/AboutPage">
          <AboutUs />
        </section>

        {/* CTA секция с микроразметкой */}
        <section itemScope itemType="https://schema.org/ContactPage">
          <CallToAction onOpenQuiz={() => setIsQuizOpen(true)} />
        </section>

        {/* Портфолио работ с микроразметкой */}
        <section itemScope itemType="https://schema.org/ImageGallery">
          <Portfolio />
        </section>

        {/* Секция партнеров */}
        <section>
          <Partners />
        </section>
      </main>

      {/* Модальное окно квиза */}
      <QuizModal 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)}
        servicesList={seoData.services}
      />

      {/* Скрытые SEO-тексты для поисковых систем */}
      <div className="visually-hidden" aria-hidden="true">
        <p>
          {COMPANY_INFO.brieflyName} - профессиональный автосервис в Минске, специализирующийся на 
          кузовном ремонте и покраске автомобилей. Мы предлагаем полный спектр услуг: 
          Наш сервис оснащен современным оборудованием, 
          а мастера имеют сертификаты и опыт работы от 10 лет.
        </p>
        <p>
          Расположены по адресу: {CONTACT_INFO.address}. Работаем {CONTACT_INFO.workHours.weekdays}, 
          {CONTACT_INFO.workHours.weekends}. Телефон для записи: {CONTACT_INFO.phones[0].number}.
        </p>
      </div>
    </>
  );
}