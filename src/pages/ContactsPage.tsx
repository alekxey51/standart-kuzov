import React, { useState, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import companyData from '../data/config.json';
import { SeoMarkup } from '../utils/seoMarkup';
import { 
  formatPhoneNumber, 
  validatePhoneNumber, 
  handlePhoneChange as handlePhoneChangeUtil,
  handlePhoneFocus as handlePhoneFocusUtil
} from '../utils/checkPhone';
import { sendToTelegram } from '../utils/telegram';

export function ContactsPage() {
  const { CONTACT_INFO, COMPANY_INFO } = companyData;
  const [contactInfo, setContactInfo] = useState({
    name: '', phone: '', email: '', message: '', consent: false
  });
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => 
    handlePhoneChangeUtil(e, contactInfo.phone, 
      (phone) => setContactInfo({...contactInfo, phone}), 
      () => setPhoneError('')
    );

  const handlePhoneFocus = () => 
    handlePhoneFocusUtil(contactInfo.phone, 
      (phone) => setContactInfo({...contactInfo, phone})
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !validatePhoneNumber(contactInfo.phone)) 
      return setPhoneError('Введите корректный номер телефона');

    setIsSubmitting(true);
    try {
      await sendToTelegram(`
<b>Новое сообщение с сайта</b>
👤 Имя: ${contactInfo.name}
📞 Телефон: <code>${contactInfo.phone.replace(/\s/g, '')}</code>
📧 Email: <code>${contactInfo.email || '-'}</code>
💬 Сообщение: ${contactInfo.message}
      `);
      
      setIsSubmitted(true);
      setContactInfo({ name: '', phone: '', email: '', message: '', consent: false });
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error('Ошибка отправки:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ContactItem = ({ icon: Icon, title, children }: { 
    icon: React.ComponentType<{className?: string}>, 
    title: string, 
    children: React.ReactNode 
  }) => (
    <div className="flex items-start gap-3">
      <div className="bg-blue-100 p-2 rounded-full">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        {children}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50">
      <SeoMarkup seoData={{
        title: `Контакты автосервиса кузовного ремонта в Минске | ${COMPANY_INFO.companyName}`,
        description: `Контактная информация автосервиса ${COMPANY_INFO.companyName}. Адрес: ${CONTACT_INFO.address}, телефоны: ${CONTACT_INFO.phones.map(p => p.number).join(', ')}. Режим работы: ${CONTACT_INFO.workHours.weekdays}`,
        keywords: "контакты автосервиса, кузовной ремонт Минск, адрес, телефон, как проехать, график работы",
        canonicalUrl: `contacts`,
        breadcrumbName: 'Контакты',
        services: [
          "Кузовной ремонт", "Покраска автомобиля", "Ремонт вмятин без покраски",
          "Восстановление геометрии кузова", "Полировка кузова", "Ремонт бампера"
        ]
      }}/>
      
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-800 text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Контакты</h1>
          <p className="text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto">Адрес, телефоны и форма обратной связи</p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-lg p-6 mb-8 sm:mb-12 shadow-sm transition-shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ContactItem icon={MapPin} title="Адрес">
              <p className="text-sm sm:text-base text-gray-600">{CONTACT_INFO.address}</p>
              {CONTACT_INFO.addressNote && <p className="text-xs sm:text-sm text-gray-500 mt-1">{CONTACT_INFO.addressNote}</p>}
            </ContactItem>

            <ContactItem icon={Phone} title="Телефоны">
              <div className="space-y-1">
                {CONTACT_INFO.phones.map((phone, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-2">
                    <a href={`tel:${phone.number.replace(/\D/g, '')}`} className="text-sm sm:text-base text-blue-600 hover:text-blue-800 whitespace-nowrap">
                      {phone.number}
                    </a>
                    <span className="text-xs text-gray-500">{phone.provider}</span>
                  </div>
                ))}
              </div>
            </ContactItem>

            <ContactItem icon={Mail} title="Email">
              <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm sm:text-base text-blue-600 hover:text-blue-800 break-all">
                {CONTACT_INFO.email}
              </a>
            </ContactItem>

            <ContactItem icon={Clock} title="Режим работы">
              <p className="text-sm sm:text-base text-gray-600">{CONTACT_INFO.workHours.weekdays}</p>
              <p className="text-sm sm:text-base text-gray-600">{CONTACT_INFO.workHours.weekends}</p>
            </ContactItem>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mb-10 sm:mb-12">
          <div className="lg:order-2 bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden flex-1">
            <div className="p-6 sm:p-8 md:p-10">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Обратная связь</h2>
              
              {isSubmitted && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-100 text-green-700 rounded-lg text-sm sm:text-base">
                  Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Ваше имя *</label>
                  <input
                    type="text"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Телефон *</label>
                    <input
                      type="tel"
                      ref={phoneInputRef}
                      value={contactInfo.phone}
                      onChange={handlePhoneChange}
                      onFocus={handlePhoneFocus}
                      placeholder="+375 (__) ___-__-__"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {phoneError && <p className="mt-1 text-xs sm:text-sm text-red-600">{phoneError}</p>}
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Email</label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Сообщение *</label>
                  <textarea
                    value={contactInfo.message}
                    onChange={(e) => setContactInfo({...contactInfo, message: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={contactInfo.consent}
                    onChange={(e) => setContactInfo({...contactInfo, consent: e.target.checked})}
                    required
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-3 text-xs sm:text-sm text-gray-700">
                    Я согласен на обработку персональных данных *
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-medium rounded-lg transition-colors ${
                    isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white flex items-center justify-center`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Отправить сообщение
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:order-1 bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden flex-1">
            <div className="p-6 sm:p-8 md:p-10">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Реквизиты компании</h2>
              <div className="text-sm sm:text-base text-gray-600 space-y-2 sm:space-y-3">
                {Object.entries({
                  'Сокращенное наименование': COMPANY_INFO.brieflyName,
                  'Полное наименование': COMPANY_INFO.legalName,
                  'УНП': COMPANY_INFO.ynp,
                  'Расчетный счет': COMPANY_INFO.rCheck,
                  'БИК': COMPANY_INFO.bik,
                  'Адрес банка': COMPANY_INFO.addressBank,
                  'Директор': COMPANY_INFO.director,
                  'Юридический адрес': COMPANY_INFO.legalAddress,
                  'Почтовый адрес': COMPANY_INFO.postalAddress
                }).map(([key, value]) => (
                  <p key={key}><span className="font-medium">{key}:</span> {value}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden">
          <iframe
            src={`https://yandex.ru/map-widget/v1/?um=constructor%3A19b95fb86aca14aedc931014cef4d62bd0ac4909fb34c31ceb82b2929f99adce&amp;source=constructor`}
            width="100%"
            height="400"
            frameBorder="0"
            title="Карта проезда к автосервису"
            className="border-0"
            loading="lazy"
            aria-label="Карта с расположением автосервиса"
          />
        </div>
      </div>
    </div>
  );
}