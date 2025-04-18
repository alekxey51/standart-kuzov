import React from 'react';
import { Cookie } from 'lucide-react';
import companyData from '../data/config.json';
import { SeoMarkup } from '../utils/seoMarkup';

const POLICY_SECTIONS = [
  {
    id: 'section-1',
    title: '1. Что такое файлы cookie?',
    content: (
      <p>Файлы cookie – это небольшие текстовые файлы, которые сохраняются на вашем устройстве (компьютере, смартфоне, планшете) при посещении веб-сайтов. Они помогают запоминать ваши предпочтения, анализировать поведение пользователей и улучшать функциональность Сайта.</p>
    )
  },
  {
    id: 'section-2',
    title: '2. Какие типы cookie мы используем?',
    content: (
      <>
        <h3 className="font-semibold text-lg">2.1. Необходимые (технические) cookie</h3>
        <p className="mt-1">Эти файлы необходимы для корректной работы Сайта и его основных функций, таких как:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>Сохранение настроек (например, языка или региона).</li>
          <li>Обеспечение безопасности Сайта.</li>
        </ul>
        <p className="mt-2">Без этих cookie Сайт не сможет работать правильно.</p>

        <h3 className="font-semibold text-lg mt-6">2.2. Аналитические cookie</h3>
        <p className="mt-1">Мы используем сервисы аналитики (например, <strong>Google Analytics</strong>, <strong>Яндекс.Метрика</strong>) для сбора информации о том, как пользователи взаимодействуют с Сайтом. Это помогает нам:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>Анализировать посещаемость и популярность страниц.</li>
          <li>Улучшать навигацию и контент.</li>
          <li>Оптимизировать работу Сайта.</li>
        </ul>

        <h3 className="font-semibold text-lg mt-6">2.3. Маркетинговые cookie</h3>
        <p className="mt-1">Эти файлы позволяют показывать релевантную рекламу на основе ваших интересов. Они могут использоваться:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>Для отслеживания эффективности рекламных кампаний.</li>
          <li>Для персонализации предложений и акций.</li>
        </ul>
      </>
    )
  },
  {
    id: 'section-3',
    title: '3. Управление cookie',
    content: (
      <>
        <p>Вы можете контролировать и удалять cookie через настройки своего браузера. Однако отключение некоторых файлов может повлиять на функциональность Сайта.</p>
        
        <h3 className="font-semibold text-lg mt-6">Как отключить cookie?</h3>
        <ul className="list-disc pl-5 mt-2">
          <li><strong>Google Chrome</strong>: Настройки → Конфиденциальность и безопасность → Файлы cookie и данные сайтов.</li>
          <li><strong>Mozilla Firefox</strong>: Настройки → Приватность и защита → Куки и данные сайтов.</li>
          <li><strong>Safari</strong>: Настройки → Конфиденциальность → Управление данными сайтов.</li>
          <li><strong>Microsoft Edge</strong>: Настройки → Конфиденциальность, поиск и службы → Файлы cookie и данные сайтов.</li>
        </ul>
      </>
    )
  },
  {
    id: 'section-4',
    title: '4. Согласие на использование cookie',
    content: (
      <p>Продолжая использовать наш Сайт, вы соглашаетесь с использованием cookie в соответствии с настоящей Политикой. Если вы не согласны, пожалуйста, покиньте Сайт или отключите cookie в настройках браузера.</p>
    )
  },
  {
    id: 'section-5',
    title: '5. Изменения в Политике',
    content: (
      <p>Компания оставляет за собой право вносить изменения в данную Политику. Актуальная версия всегда будет доступна на Сайте.</p>
    )
  }
];

const PolicySection = ({ id, title, children }) => (
  <section id={id} className="mb-8">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="prose text-gray-600">{children}</div>
  </section>
);

export function CookiePolicyPage() {
  const { COMPANY_INFO } = companyData;
  
  const seoData = {
    title: `Политика обработки файлов cookie | ${COMPANY_INFO.companyName}`,
    description: `Информация об использовании файлов cookie на сайте ${COMPANY_INFO.companyName}. Узнайте, какие данные мы собираем и как их используем.`,
    keywords: "политика cookie, использование файлов cookie, cookies автосервис",
    canonicalUrl: `cookie-policy`,
    breadcrumbName: 'Cookie',
    services: [
      "Кузовной ремонт", "Покраска автомобиля", "Ремонт вмятин без покраски", 
      "Восстановление геометрии кузова", "Полировка кузова", "Ремонт бампера"
    ]
  };
  
  return (
    <div className="bg-gray-50">
      <SeoMarkup seoData={seoData}/>
      
      <main className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold">Политика обработки файлов cookie</h1>
            </div>
          </header>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="mb-8">
              <div className="prose text-gray-600">
                <p>
                  <strong>{COMPANY_INFO.legalName}</strong> (далее – <strong>"Компания"</strong>) использует файлы cookie на своем сайте <strong>{COMPANY_INFO.siteUrl}</strong> (далее – <strong>"Сайт"</strong>) для обеспечения удобства пользователей, анализа посещаемости и улучшения качества предоставляемых услуг.
                </p>
                <p>
                  Настоящая Политика обработки файлов cookie объясняет, какие cookie используются, как они применяются и какие у вас есть возможности по управлению ими.
                </p>
              </div>
            </div>

            {POLICY_SECTIONS.map((section) => (
              <PolicySection key={section.id} id={section.id} title={section.title}>
                {section.content}
              </PolicySection>
            ))}

            <section id="contact" className="pt-6 mt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold mb-4">6. Контакты</h2>
              <div className="prose text-gray-600">
                <p>Если у вас есть вопросы относительно использования cookie, свяжитесь с нами:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li><strong>Email</strong>: {COMPANY_INFO.contactEmail}</li>
                </ul>
              </div>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}