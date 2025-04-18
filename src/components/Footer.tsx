import { MapPin, Phone, Mail, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../data/config.json';


const PhoneNumber = ({ number, provider }) => (
  <a href={`tel:${number.replace(/\D/g, '')}`} className="hover:text-white">
    {number} <span className="text-xs text-gray-500">({provider})</span>
  </a>
);

const ExpandableSection = ({ title, isExpanded, onToggle, children }) => (
  <div className="border-b border-gray-800 pb-2">
    <button onClick={onToggle} className="flex justify-between items-center w-full py-2">
      <h3 className="text-base font-bold text-white">{title}</h3>
      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </button>
    {isExpanded && children}
  </div>
);

export function Footer() {
  const [expanded, setExpanded] = useState({
    navigation: false,
    contacts: false,
    address: false
  });

  const toggle = (section) => setExpanded(prev => ({ ...prev, [section]: !prev[section] }));

  const { CONTACT_INFO, NAVIGATION_ITEMS, SOCIAL_LINKS, COMPANY_INFO } = config;

  return (
    <footer className="bg-gray-900 text-white pt-8 pb-4">
      <div className="container mx-auto px-4">
        {/* Mobile View */}
        <div className="md:hidden space-y-4 pb-6">
          <div className="space-y-3 mb-4">
            <img src="/src/images/logo-white.svg" alt="Logo"/>
            <p className="text-gray-400 text-sm">
              Профессиональный кузовной ремонт и покраска автомобилей с 1999 года.
            </p>
          </div>
          <div className="flex justify-center gap-5 mb-6">
            {SOCIAL_LINKS.map(({ name, url, icon }) => (
              <a
        key={name}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-blue-400 transition-colors"
        aria-label={name}
      >
        <div
          className="w-5 h-5 bg-current h-[40px]" // Цвет берется из text-*
          style={{
            mask: `url(/src/images/icon/${icon}) no-repeat center / contain`,
            WebkitMask: `url(/src/images/icon/${icon}) no-repeat center / contain`,
          }}
        />
      </a>
            ))}
          </div>

          <ExpandableSection title="Навигация" isExpanded={expanded.navigation} onToggle={() => toggle('navigation')}>
            <ul className="space-y-1 pb-2">
              {NAVIGATION_ITEMS.map(({ name, path }) => (
                <li key={name}>
                  <Link to={path} className="block py-1.5 text-gray-400 hover:text-blue-400 text-sm">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </ExpandableSection>

          <ExpandableSection title="Контакты" isExpanded={expanded.contacts} onToggle={() => toggle('contacts')}>
            <ul className="space-y-2 text-gray-400 text-sm pb-2">
              <li className="flex items-start gap-3 pt-1">
                <Phone size={16} className="mt-0.5 text-blue-400" />
                <div className="flex flex-col">
                  {CONTACT_INFO.phones.map((phone, i) => (
                    <PhoneNumber key={i} number={phone.number} provider={phone.provider} />
                  ))}
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-blue-400" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white">{CONTACT_INFO.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={16} className="text-blue-400" />
                <div>
                  <div>{CONTACT_INFO.workHours.weekdays}</div>
                  <div className="text-xs text-gray-500">{CONTACT_INFO.workHours.weekends}</div>
                </div>
              </li>
            </ul>
          </ExpandableSection>

          <ExpandableSection title="Адрес" isExpanded={expanded.address} onToggle={() => toggle('address')}>
            <div className="flex items-start gap-3 text-gray-400 text-sm pt-1 pb-2">
              <MapPin size={16} className="text-blue-400 mt-0.5" />
              <div>
                <div>{CONTACT_INFO.address}</div>
                <div className="text-xs text-gray-500 mt-0.5">{CONTACT_INFO.addressNote}</div>
              </div>
            </div>
          </ExpandableSection>
        </div>

        {/* Desktop View */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
          <div className="space-y-4">
            <img src="/src/images/logo-white.svg" alt="Logo"/>
            <p className="text-gray-400 text-sm leading-relaxed">
              Профессиональный кузовной ремонт и покраска автомобилей с 1999 года.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">Навигация</h3>
            <ul className="space-y-2">
              {NAVIGATION_ITEMS.map(({ name, path }) => (
                <li key={name}>
                  <Link to={path} className="text-gray-400 hover:text-blue-400 text-sm">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">Контакты</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 text-blue-400" />
                <div className="flex flex-col">
                  {CONTACT_INFO.phones.map((phone, i) => (
                    <PhoneNumber key={i} number={phone.number} provider={phone.provider} />
                  ))}
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-400" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white">{CONTACT_INFO.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-blue-400" />
                <div>
                  <div>{CONTACT_INFO.workHours.weekdays}</div>
                  <div className="text-xs text-gray-500">{CONTACT_INFO.workHours.weekends}</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">Адрес</h3>
            <div className="flex items-start gap-3 text-gray-400 text-sm">
              <MapPin size={18} className="text-blue-400 mt-0.5" />
              <div>
                <div>{CONTACT_INFO.address}</div>
                <div className="text-xs text-gray-500 mt-0.5">{CONTACT_INFO.addressNote}</div>
              </div>
            </div>

<div className="pt-1">
  <h4 className="text-sm font-medium text-white mb-2">Мы в соцсетях</h4>
  <div className="flex gap-4">
    {SOCIAL_LINKS.map(({ name, url, icon }) => (
      <a
        key={name}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-blue-400 transition-colors"
        aria-label={name}
      >
        <div
          className="w-5 h-5 bg-current h-[20px]" // Цвет берется из text-*
          style={{
            mask: `url(/src/images/icon/${icon}) no-repeat center / contain`,
            WebkitMask: `url(/src/images/icon/${icon}) no-repeat center / contain`,
          }}
        />
      </a>
    ))}
  </div>
</div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
            <span>© {new Date().getFullYear()} {COMPANY_INFO.companyName}. Все права защищены.</span>
            <Link to="/privacy-policy" className="hover:text-white">Обработка персональных данных</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}