import React from 'react';
import { CheckCircle, Award, Users, Clock, Shield, Wrench, MapPin, Phone, X } from 'lucide-react';
import companyData from '../data/config.json';
import { SeoMarkup } from '../utils/seoMarkup';
import { RepairForm } from '../forms/RepairForm';

const STATS = [
  { number: '24+', label: 'года опыта', description: 'Кузовной ремонт в Минске с 1999 года' },
  { number: '15K+', label: 'автомобилей', description: 'Отремонтировано с гарантией качества' },
  { number: '98%', label: 'клиентов', description: 'Довольны качеством кузовного ремонта' },
  { number: '12', label: 'месяцев гарантии', description: 'На покраску и кузовные работы в Минске' }
];

const ADVANTAGES = [
  { icon: Wrench, title: 'Профессиональное оборудование', description: 'Современные стенды Car-O-Liner и Spanesi для точного ремонта кузова' },
  { icon: Users, title: 'Квалифицированные мастера', description: 'Сертифицированные специалисты по кузовному ремонту с опытом от 10 лет' },
  { icon: Shield, title: 'Гарантия на работы', description: 'Официальная гарантия до 5 лет на покраску и кузовной ремонт' },
  { icon: Clock, title: 'Соблюдение сроков', description: 'Оперативный ремонт вмятин и покраска автомобилей в Минске' }
];

const FEATURES = [
  'Собственный цех 1200 м² с профессиональной покрасочной камерой',
  'Точная диагностика геометрии кузова на 3D-измерительном комплексе',
  'Используем только оригинальные запчасти и материалы премиум-класса',
  'Честное ценообразование на кузовной ремонт без скрытых платежей',
  'Сертифицированный центр для страховых случаев и СТО',
  'Удобная зона ожидания с кофе и Wi-Fi для клиентов'
];

const TEAM = [
  { name: 'Алексей Петров', position: 'Главный мастер по кузовному ремонту', exp: '15 лет', img: 'https://images.unsplash.com/photo-1593628525442-f94a810619e0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODR8fCVEMSU4NyVEMCVCNSVEMCVCQiVEMCVCRSVEMCVCMiVEMCVCNSVEMCVCQXxlbnwwfHwwfHx8MA%3D%3D', skills: 'Стапельные работы, восстановление геометрии' },
  { name: 'Дмитрий Иванов', position: 'Маляр-покрасчик', exp: '12 лет', img: 'https://images.unsplash.com/photo-1635090431958-170491953c6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8JUQxJTg3JUQwJUI1JUQwJUJCJUQwJUJFJUQwJUIyJUQwJUI1JUQwJUJBfGVufDB8fDB8fHww', skills: 'Локальная и полная покраска автомобилей' },
    { name: 'Алексей Петров', position: 'Главный мастер по кузовному ремонту', exp: '15 лет', img: 'https://images.unsplash.com/photo-1580994550402-9de7e88df4ec?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8JUQxJTg3JUQwJUI1JUQwJUJCJUQwJUJFJUQwJUIyJUQwJUI1JUQwJUJBfGVufDB8fDB8fHww', skills: 'Стапельные работы, восстановление геометрии' },
  { name: 'Дмитрий Иванов', position: 'Маляр-покрасчик', exp: '12 лет', img: 'https://images.unsplash.com/photo-1637502922679-6b5ee379d254?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQ2fHwlRDElODclRDAlQjUlRDAlQkIlRDAlQkUlRDAlQjIlRDAlQjUlRDAlQkF8ZW58MHx8MHx8fDA%3D', skills: 'Локальная и полная покраска автомобилей' }
];

export function AboutPage() {
  const [showForm, setShowForm] = React.useState(false);
  const { COMPANY_INFO, CONTACT_INFO } = companyData;

  const seoData = {
    title: `Кузовной ремонт и покраска автомобилей в Минске | ${COMPANY_INFO.companyName}`,
    description: `Качественный кузовной ремонт и покраска автомобилей в Минске. ✅ 20 лет опыта ✅ Гарантия 1 лет ✅ Современное оборудование. Запишитесь онлайн!`,
    keywords: "кузовной ремонт, покраска авто, Минск, ремонт вмятин, покраска бампера, стапель, рихтовка",
    canonicalUrl: `about`,
    breadcrumbName: 'О компании',
    services: [
      "Кузовной ремонт", "Покраска автомобиля", "Ремонт вмятин без покраски", 
      "Восстановление геометрии кузова", "Полировка кузова", "Ремонт бампера"
    ]
  };

  const toggleForm = React.useCallback((show) => {
    setShowForm(show);
    document.body.style.overflow = show ? 'hidden' : 'auto';
  }, []);

  return (
    <div className="bg-gray-50">
      <SeoMarkup seoData={seoData} />
      
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-800 text-white py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">О компании</h1>
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl max-w-3xl mx-auto">
            Ремонт вмятин, покраска, восстановление геометрии кузова
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat, i) => (
            <div key={i} className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300" itemScope itemType="https://schema.org/QuantitativeValue">
              <meta itemProp="value" content={stat.number.replace('+', '')} />
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2" itemProp="description">{stat.number}</div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">{stat.label}</h3>
              <p className="text-xs sm:text-sm text-gray-600" itemProp="name">{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container px-4 sm:px-6 mx-auto py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img
                src="https://i.ibb.co/B2Yp351Q/36f155ad-765f-496d-9623-7cc2aac6e1c1.png"
                alt="Наш автосервис"
                className="rounded-lg shadow-md w-full"
                loading="lazy"
              />
              <div className="absolute -bottom-4 -right-4 bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center mb-1">
                  <Award className="text-yellow-500 mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-bold text-sm sm:text-base">Лучший сервис 2023</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-600">по версии Auto.by</div>
              </div>
            </div>
          </div>

          <div className="order-2 lg:order-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              Профессиональный кузовной ремонт в Минске
            </h2>
            
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Наш автосервис специализируется на комплексном восстановлении автомобилей после ДТП. 
              Мы предлагаем полный спектр услуг: от ремонта вмятин без покраски до полного восстановления геометрии кузова.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {FEATURES.map((item, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="text-blue-600 mr-2 mt-0.5 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm lg:text-base text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button 
                onClick={() => toggleForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 sm:px-5 rounded-md transition-colors text-xs sm:text-sm lg:text-base flex items-center"
              >
                <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Записаться на ремонт
              </button>
              <a 
                href={`https://yandex.ru/maps/?text=${encodeURIComponent(CONTACT_INFO.address)}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-medium px-4 py-2 sm:px-5 rounded-md transition-colors text-xs sm:text-sm lg:text-base flex items-center"
              >
                <MapPin className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Как проехать
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16 px-2">
            <>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Преимущества нашего автосервиса
              </h2>
              <div className="w-16 sm:w-20 h-1 bg-blue-600 mx-auto mb-4 sm:mb-6" />
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 max-w-2xl mx-auto">
                Почему клиенты выбирают наш кузовной ремонт и покраску автомобилей
              </p>
            </>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {ADVANTAGES.map((advantage, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-3 sm:p-6 text-center" itemScope itemType="https://schema.org/Service">
                <div className="bg-blue-100 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <advantage.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1 sm:mb-2" itemProp="name">{advantage.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600" itemProp="description">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-gradient-to-r from-blue-700 to-blue-800 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
            Нужен качественный кузовной ремонт?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-4xl mx-auto">
            Свяжитесь с нами для консультации и записи на ремонт
          </p>
          <a 
            href={`tel:${CONTACT_INFO.phones[0].number.replace(/\D/g, '')}`} 
            className="bg-white text-blue-600 font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg hover:bg-blue-50 transition-colors duration-300 inline-block text-sm sm:text-base"
            itemProp="telephone"
          >
            <Phone className="inline mr-2" size={18} /> Позвонить
          </a>
        </div>
      </section>
      
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Наши специалисты
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-blue-600 mx-auto mb-4 sm:mb-6" />
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 max-w-2xl mx-auto">
              Опытные мастера с профессиональным образованием и многолетним стажем
            </p>
          </>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {TEAM.map((member, i) => (
            <div key={i} className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300" itemScope itemType="https://schema.org/Person">
              <img src={member.img} alt={`${member.name} - ${member.position}`} className="w-full h-40 sm:h-64 object-cover" loading="lazy" itemProp="image" />
              <div className="p-3 sm:p-6">
                <h3 className="text-sm sm:text-lg lg:text-xl font-bold mb-1" itemProp="name">{member.name}</h3>
                <p className="text-blue-600 font-medium text-xs sm:text-sm lg:text-base mb-2" itemProp="jobTitle">{member.position}</p>
                <p className="text-xs sm:text-sm text-gray-600">Опыт работы: <span itemProp="experienceYears">{member.exp}</span></p>
                <meta itemProp="skills" content={member.skills} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg sm:rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Запись на ремонт</h3>
              <button onClick={() => toggleForm(false)} className="text-gray-500 hover:text-gray-700" aria-label="Закрыть форму">
                <X size={24} />
              </button>
            </div>
            <RepairForm onClose={() => toggleForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}