import React from 'react';
import companyData from '../data/config.json';
import { SeoMarkup } from '../utils/seoMarkup';

export function PrivacyPolicyPage() {
  const { COMPANY_INFO, CONTACT_INFO } = companyData;
  
const seoData = {
    title: `Политика обработки персональных данных | ${COMPANY_INFO.companyName}`,
    description: `Порядок сбора, хранения и защиты персональных данных в ${COMPANY_INFO.companyName}. Соответствует законодательству Республики Беларусь.`,
    keywords: "политика конфиденциальности, защита персональных данных, обработка данных автосервис",
    canonicalUrl: `privacy-policy`,
    breadcrumbName: 'Обработка персональных данных',
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
    <div className="bg-gray-50">
      <SeoMarkup seoData={seoData}/>

      <main className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          {/* Заголовок и метаданные */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Политика обработки персональных данных</h1>
          </header>

          {/* Основное содержание */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            {/* Введение */}
            <div className="mb-8">
              <div className="prose text-gray-600">
                <p>
                  <strong>{COMPANY_INFO.legalName}</strong> (далее – <strong>"Компания"</strong>), являясь оператором персональных данных в соответствии с законодательством Республики Беларусь, соблюдает требования <strong>Закона Республики Беларусь от 7 мая 2021 г. № 99-З "О защите персональных данных"</strong> и иных нормативных правовых актов.
                </p>
                <p>
                  Настоящая Политика определяет порядок сбора, хранения, использования и защиты персональных данных пользователей сайта <strong>{COMPANY_INFO.siteUrl}</strong> (далее – <strong>"Сайт"</strong>) и клиентов, обращающихся за услугами кузовного ремонта и покраски автомобилей.
                </p>
              </div>
            </div>

            {/* Разделы политики */}
            <section id="section-1" className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Какие персональные данные мы обрабатываем?</h2>
              <div className="prose text-gray-600">
                <p>Компания может обрабатывать следующие данные:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li><strong>ФИО</strong> (для заявок).</li>
                  <li><strong>Контактные данные</strong> (телефон, email).</li>
                  <li><strong>Данные автомобиля</strong> (марка, модель, VIN, госномер).</li>
                  <li><strong>Техническая информация</strong> (данные cookie – в соответствии с Политикой cookie).</li>
                </ul>
              </div>
            </section>

            <section id="section-2" className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Цели обработки персональных данных</h2>
              <div className="prose text-gray-600">
                <p>Данные используются для:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Оформления заказов и договоров на услуги.</li>
                  <li>Связи с клиентом (уточнение деталей ремонта, информирование о статусе заказа).</li>
                  <li>Улучшения качества обслуживания.</li>
                  <li>Отправки рекламных и информационных материалов (только с согласия).</li>
                </ul>
              </div>
            </section>

            <section id="section-3" className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Правовые основания обработки</h2>
              <div className="prose text-gray-600">
                <p>Обработка персональных данных осуществляется на основании:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li><strong>Согласия субъекта персональных данных</strong> (при оформлении заявки, подписке на рассылку).</li>
                  <li><strong>Договора</strong> (при заключении соглашения на оказание услуг).</li>
                  <li><strong>Закона</strong> (например, для налогового учета).</li>
                </ul>
              </div>
            </section>

            <section id="section-4" className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Кому мы передаем данные?</h2>
              <div className="prose text-gray-600">
                <p>Компания не передает персональные данные третьим лицам без согласия, за исключением случаев:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li><strong>Государственных органов</strong> (по запросу в рамках законодательства).</li>
                  <li><strong>Банков и платежных систем</strong> (для проведения оплаты).</li>
                  <li><strong>Субподрядчиков</strong> (если это необходимо для выполнения услуг, с соблюдением конфиденциальности).</li>
                </ul>
              </div>
            </section>

            <section id="section-5" className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Срок хранения данных</h2>
              <div className="prose text-gray-600">
                <p>Персональные данные хранятся:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>До достижения целей обработки.</li>
                  <li>В течение сроков, установленных законодательством.</li>
                </ul>
              </div>
            </section>

            <section id="section-6" className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Защита персональных данных</h2>
              <div className="prose text-gray-600">
                <p>Компания принимает меры для защиты данных, включая:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Использование защищенных каналов передачи данных (SSL).</li>
                  <li>Ограничение доступа к данным только для уполномоченных сотрудников.</li>
                  <li>Регулярный аудит систем безопасности.</li>
                </ul>
              </div>
            </section>

            <section id="section-7" className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Права субъектов персональных данных</h2>
              <div className="prose text-gray-600">
                <p>Вы имеете право:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li><strong>Запрашивать доступ</strong> к своим данным.</li>
                  <li><strong>Требовать исправления</strong> неточных данных.</li>
                  <li><strong>Отозвать согласие</strong> на обработку.</li>
                </ul>
              </div>
            </section>

            {/* Контактная информация */}
            <section id="contact" className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Как связаться с нами?</h2>
              <div className="prose text-gray-600">
                <p>По вопросам обработки персональных данных обращайтесь:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li><strong>Email</strong>: {COMPANY_INFO.contactEmail}</li>
                </ul>
              </div>
            </section>

            <section id="section-8" className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Изменения в Политике</h2>
              <div className="prose text-gray-600">
                <p>
                  Компания вправе обновлять Политику. Новая версия публикуется на Сайте.
                </p>
              </div>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}