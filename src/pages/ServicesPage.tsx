import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Paintbrush, Car, Shield, Settings, PenTool, Sparkles, ChevronRight, Phone, MapPin, Clock, Zap, Package } from 'lucide-react';
import servicesData from '../data/services.json';
import companyData from '../data/config.json';
import { SeoMarkup } from '../utils/seoMarkup';
import { formatPhoneNumber, validatePhoneNumber, handlePhoneChange as handlePhoneChangeUtil } from '../utils/checkPhone';
import { sendToTelegram } from '../utils/telegram';

const iconComponents = { Wrench, Paintbrush, Car, Shield, Settings, PenTool, Sparkles, Zap, Package };

interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  seoDescription: string;
}

interface FormData {
  name: string;
  phone: string;
  service: string;
}

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-5 sm:p-6 rounded-lg sm:rounded-xl shadow-md text-center" itemScope itemType="https://schema.org/Service">
    <div className="bg-blue-100 w-12 sm:w-16 h-12 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
      <Icon className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600" />
    </div>
    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-800" itemProp="name">{title}</h3>
    <p className="text-gray-600 text-sm sm:text-base" itemProp="description">{description}</p>
  </div>
);

export function ServicesPage() {
  const { COMPANY_INFO, CONTACT_INFO } = companyData;
  const services: Service[] = servicesData.SERVICES;
  const [formData, setFormData] = useState<FormData>({ name: '', phone: '', service: '' });
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const seoData = {
    title: `Услуги кузовного ремонта и покраски | ${COMPANY_INFO.companyName}`,
    description: `Полный спектр услуг по кузовному ремонту и покраске автомобилей в Минске. Профессиональное оборудование, гарантия качества.`,
    keywords: "кузовной ремонт, покраска автомобиля, ремонт авто Минск, полировка кузова, удаление вмятин, стапельные работы, покраска бампера, рихтовка без покраски",
    canonicalUrl: `services`,
    breadcrumbName: 'Услуги',
    services: services.map(service => service.title)
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePhoneChangeUtil(
      e,
      formData.phone,
      (phone) => setFormData({...formData, phone}),
      setPhoneError
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhoneNumber(formData.phone)) {
      setPhoneError('Введите полный номер телефона');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const selectedService = services.find(s => s.id === formData.service)?.title || '-';
      const message = `
<b>Новая заявка с сайта</b>

👤 Имя: ${formData.name}
📞 Телефон: <code>${formData.phone.replace(/\s/g, '')}</code>
🔧 Услуга: ${selectedService}
      `;

      await sendToTelegram(message);
      setSubmitSuccess(true);
      setFormData({ name: '', phone: '', service: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Ошибка отправки:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50">
      <SeoMarkup seoData={seoData}/>

      <section className="relative bg-gradient-to-r from-blue-700 to-blue-800 text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Профессиональный кузовной ремонт</h1>
          <p className="text-lg sm:text-xl lg:text-2xl max-w-4xl mx-auto mb-6 sm:mb-8">
            Восстановление автомобилей любой сложности с гарантией качества
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <a href={`tel:${CONTACT_INFO.phones[0].number.replace(/\D/g, '')}`}
              className="bg-white text-blue-700 font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg hover:bg-blue-100 transition-colors duration-300 flex items-center justify-center text-sm sm:text-base">
              <Phone className="mr-2" size={16} /> Записаться
            </a>
            <a href={`https://yandex.ru/maps/?text=${encodeURIComponent(CONTACT_INFO.address)}`} 
              target="_blank" rel="noopener noreferrer"
              className="bg-transparent border-2 border-white text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg hover:bg-white hover:text-blue-700 transition-colors duration-300 flex items-center justify-center text-sm sm:text-base">
              <MapPin className="mr-2" size={16} /> Как проехать
            </a>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => {
            const IconComponent = iconComponents[service.icon as keyof typeof iconComponents];
            return (
              <article key={service.id} className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group flex flex-col" itemScope itemType="https://schema.org/Service">
                <div className="h-40 sm:h-48 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
                  <IconComponent className="w-12 sm:w-16 h-12 sm:h-16 text-white" />
                </div>
                <div className="p-4 sm:p-6 flex-grow">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800" itemProp="name">{service.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6" itemProp="description">{service.description}</p>
                  
                  <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-700 text-sm sm:text-base">
                        <span className="w-4 sm:w-5 h-4 sm:h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L7 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        </span>
                        <span itemProp="feature">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-lg sm:text-xl font-bold text-blue-600" itemProp="price">{service.price}</span>
                    <Link to={`/services/${service.id}`} className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-300 flex items-center text-sm sm:text-base">
                      Подробнее <ChevronRight className="ml-1" size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main> 

      <section className="bg-gray-100 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 bg-blue-700 p-6 sm:p-8 lg:p-10 flex items-center">
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 leading-tight">Запишитесь на ремонт сегодня</h2>
                  <p className="text-blue-100 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
                    Оставьте заявку и получите бесплатную консультацию от наших специалистов
                  </p>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center text-white">
                      <Phone className="mr-3 sm:mr-4 flex-shrink-0" size={18} />
                      <div className="flex flex-col">
                        {CONTACT_INFO.phones.map((phone, index) => (
                          <a key={index} href={`tel:${phone.number.replace(/\D/g, '')}`} className="text-lg sm:text-xl hover:underline">
                            {formatPhoneNumber(phone.number)} <span className="text-blue-200 text-xs sm:text-sm ml-1">({phone.provider})</span>
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center text-white" itemScope itemType="https://schema.org/PostalAddress">
                      <MapPin className="mr-3 sm:mr-4 flex-shrink-0" size={18} />
                      <div>
                        <span className="text-lg sm:text-xl" itemProp="streetAddress">{CONTACT_INFO.address}</span>
                        {CONTACT_INFO.addressNote && <span className="block text-blue-100 text-xs sm:text-sm">{CONTACT_INFO.addressNote}</span>}
                      </div>
                    </div>
                    <div className="flex items-center text-white" itemScope itemType="https://schema.org/OpeningHoursSpecification">
                      <Clock className="mr-3 sm:mr-4 flex-shrink-0" size={18} />
                      <div>
                        <span className="text-lg sm:text-xl" itemProp="opens">{CONTACT_INFO.workHours.weekdays}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 p-6 sm:p-8 lg:p-10">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" itemScope itemType="https://schema.org/ContactPage">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2 sm:mb-3 text-base sm:text-lg">Ваше имя*</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange}
                      className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base sm:text-lg"
                      required />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-2 sm:mb-3 text-base sm:text-lg">Телефон*</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handlePhoneChange}
                      onFocus={() => !formData.phone && setFormData({...formData, phone: '+375 '})}
                      className={`w-full px-4 sm:px-5 py-2.5 sm:py-3.5 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base sm:text-lg`}
                      placeholder="+375 (__) ___-__-__" required />
                    {phoneError && <p className="mt-1 text-xs sm:text-sm text-red-600">{phoneError}</p>}
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-gray-700 mb-2 sm:mb-3 text-base sm:text-lg">Услуга</label>
                    <select id="service" name="service" value={formData.service} onChange={handleInputChange}
                      className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base sm:text-lg">
                      <option value="">Выберите услугу</option>
                      {services.map(service => <option key={service.id} value={service.id}>{service.title}</option>)}
                    </select>
                  </div>
                  <button type="submit" disabled={isSubmitting}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-lg transition-colors duration-300 text-base sm:text-lg shadow-md hover:shadow-lg ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                    {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                  </button>
                  {submitSuccess && (
                    <div className="p-3 bg-green-100 text-green-700 rounded-lg text-center text-sm sm:text-base">
                      Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Почему выбирают нас</h2>
          <div className="w-16 sm:w-20 h-1 bg-blue-600 mx-auto mb-4 sm:mb-6"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <FeatureCard icon={Shield} title="Гарантия качества" description="Даем гарантию на все виды работ. Используем только проверенные материалы." />
          <FeatureCard icon={Settings} title="Современное оборудование" description="Работаем на профессиональном оборудовании ведущих мировых брендов." />
          <FeatureCard icon={Car} title="Опытные мастера" description="Наши специалисты с опытом работы от 10 лет выполнят ремонт любой сложности." />
        </div>
      </section>

      <div className="visually-hidden" aria-hidden="true">
        <p>{COMPANY_INFO.name} предлагает профессиональные услуги по кузовному ремонту и покраске автомобилей в Минске. В нашем сервисе вы можете заказать: {services.map(s => s.title).join(', ')}.</p>
        <p>Мы используем только качественные материалы и современное оборудование. Наши мастера имеют сертификаты и многолетний опыт работы. Гарантия на все виды работ.</p>
      </div>
    </div>
  );
}