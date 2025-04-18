import React, { useState, useCallback, memo, useMemo } from 'react';
import { Phone, X, MapPin, Mail, MessageCircle } from 'lucide-react';
import config from '../data/config.json';

const ContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'call' | 'chat' | 'map'>('call');

  // Получаем данные из конфига
  const { phones = [], email, address, addressNote } = config.CONTACT_INFO || {};
  
  // Фильтруем соцсети, оставляем только Telegram и Viber
  const socialLinks = useMemo(() => 
    config.SOCIAL_LINKS.filter(link => 
      link.name === 'Telegram' || link.name === 'Viber'
    ), []);

  // Формируем контакты
  const contacts = useMemo(() => ({
    call: phones.map(phone => ({
      name: `Позвонить (${phone.provider})`,
      number: phone.number,
      url: `tel:${phone.number.replace(/\D/g, '')}`,
      icon: <Phone size={18} className="text-blue-500" />,
      color: 'text-blue-500',
      isExternal: false
    })),
    chat: [
      ...socialLinks.map(link => ({
        name: link.name,
        url: link.url,
        icon: link.name === 'Telegram' ? <MessageCircle size={18} className="text-blue-400" /> : 
              link.name === 'Viber' ? <MessageCircle size={18} className="text-purple-500" /> : null,
        color: link.name === 'Telegram' ? 'text-blue-400' : 
              link.name === 'Viber' ? 'text-purple-500' : 'text-red-400',
        isExternal: true
      })),
      ...(email ? [{
        name: 'Email',
        url: `mailto:${email}`,
        icon: <Mail size={18} className="text-red-400" />,
        color: 'text-red-400',
        isExternal: false
      }] : [])
    ],
    map: address ? [{
      name: 'Как проехать',
      url: `https://yandex.ru/maps/?text=${encodeURIComponent(address)}`,
      icon: <MapPin size={18} className="text-green-500" />,
      color: 'text-green-500',
      description: addressNote ? `${address} ${addressNote}` : address,
      isExternal: true
    }] : []
  }), [phones, socialLinks, email, address, addressNote]);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const setTab = useCallback((tab: 'call' | 'chat' | 'map') => {
    setActiveTab(tab);
  }, []);

  const handleContactClick = useCallback((url: string, isExternal: boolean) => {
    if (isExternal) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  }, []);

  // Если нет контактных данных, не рендерим компонент
  if (!phones.length && !socialLinks.length && !email && !address) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Контакты панель */}
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-72 bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Заголовок */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
            <h3 className="font-medium text-lg">Свяжитесь с нами</h3>
            <p className="text-sm opacity-90">Мы ответим в течение 5 минут</p>
          </div>

          {/* Табы - показываем только те, для которых есть данные */}
          <div className="flex border-b">
            {Object.entries(contacts).map(([tab, items]) => (
              items.length > 0 && (
                <button
                  key={tab}
                  onClick={() => setTab(tab as any)}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'call' && 'Звонок'}
                  {tab === 'chat' && 'Мессенджеры'}
                  {tab === 'map' && 'Адрес'}
                </button>
              )
            ))}
          </div>

          {/* Контент табов */}
          <div className="p-3">
            {contacts[activeTab].map((contact, index) => (
              <button
                key={index}
                onClick={() => handleContactClick(contact.url, contact.isExternal)}
                className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors mb-2 last:mb-0 w-full text-left"
              >
                <div className={`p-2 rounded-full ${contact.color} bg-blue-50 mr-3`}>
                  {contact.icon}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{contact.name}</p>
                  {contact.number && (
                    <p className="text-sm text-gray-500">{contact.number}</p>
                  )}
                  {contact.description && (
                    <p className="text-xs text-gray-500 mt-1">{contact.description}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Основная кнопка */}
      <button
        onClick={toggleMenu}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
          isOpen 
            ? 'bg-gray-100 border-2 border-gray-300 hover:bg-gray-200' 
            : 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
        } relative group`}
      >
        {isOpen ? (
          <X size={28} className="text-gray-700" />
        ) : (
          <>
            <Phone size={24} className="text-white" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white animate-ping opacity-75"></span>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white"></span>
          </>
        )}
      </button>
    </div>
  );
};

export default memo(ContactButton);