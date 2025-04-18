import React, { useState, useEffect, useCallback, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Phone, Clock, Menu, X, ChevronDown, Mail, Briefcase } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './Button';
import { QuizModal } from '../forms/QuizModalForm.tsx';
import config from '../data/config.json';

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return size;
};

const useScroll = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isScrolled;
};

const PhoneNumberItem = memo(({ number, provider, className = '' }) => (
  <a 
    href={`tel:${number.replace(/\D/g, '')}`} 
    className={`flex items-center justify-between gap-3 p-2 -m-2 rounded-lg transition-colors group ${className}`}
  >
    <div className="flex items-center gap-3">
      <Phone size={14} className="text-blue-600" />
      <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">{number}</p>
    </div>
    <span className="text-xs text-gray-500 whitespace-nowrap">({provider})</span>
  </a>
));

const ContactInfo = memo(() => (
  <div className="bg-blue-50/50 p-4 rounded-xl">
    <h4 className="text-sm text-center font-semibold text-gray-800 mb-3">Контактная информация</h4>
    <div className="space-y-3">
      {config.CONTACT_INFO.phones.map((phone, index) => (
        <PhoneNumberItem 
          key={`phone-${index}`} 
          number={phone.number} 
          provider={phone.provider} 
          className="font-semibold hover:text-blue-600" 
        />
      ))}
    </div>
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-3 text-gray-600 text-sm">
        <Clock size={16} className="text-blue-600" />
        <span>{config.CONTACT_INFO.workHours?.weekdays}</span>
      </div>
      <div className="flex items-center gap-3 text-gray-600 text-sm">
        <MapPin size={16} className="text-blue-600" />
        <span>{config.CONTACT_INFO.address}</span>
      </div>
      {config.CONTACT_INFO.email && (
        <div className="flex items-center gap-3 text-gray-600 text-sm">
          <Mail size={16} className="text-blue-600" />
          <span>{config.CONTACT_INFO.email}</span>
        </div>
      )}
    </div>
  </div>
));

export function Header() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPhoneHovered, setIsPhoneHovered] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const { width: windowWidth } = useWindowSize();
  const location = useLocation();
  const isScrolled = useScroll();

  const isDesktop = windowWidth >= 1280;
  const isMobile = windowWidth < 640;
  const shouldRenderPhoneButton = isMobile && !isMenuOpen;
  const shouldRenderDesktopContact = !isMobile && config.CONTACT_INFO.phones.length > 0;

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenSubmenu(null);
  }, [windowWidth, location]);

  const toggleMenu = useCallback(() => {
    if (isDesktop) return;
    setIsMenuOpen(prev => !prev);
    if (isMenuOpen) setOpenSubmenu(null);
  }, [isMenuOpen, isDesktop]);

  const toggleSubmenu = useCallback((menuName) => {
    setOpenSubmenu(prev => prev === menuName ? null : menuName);
  }, []);

  const openQuizModal = useCallback(() => {
    setIsMenuOpen(false);
    setIsQuizOpen(true);
  }, []);

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
        {/* Top contact bar */}
        <motion.div 
          initial={{ y: -10, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="bg-gradient-to-r from-blue-600 to-blue-700 py-2 text-white"
        >
          <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm w-full md:w-auto justify-center md:justify-start">
              <MapPin size={14} className="text-white" />
              <span className="truncate max-w-[180px] sm:max-w-none">{config.CONTACT_INFO.address}</span>
              {config.CONTACT_INFO.addressNote && (
                <span className="text-white/90 hidden sm:inline">{config.CONTACT_INFO.addressNote}</span>
              )}
            </div>
            <div className="hidden lg:flex gap-5 text-sm">
              <div className="flex items-center gap-2 text-xs sm:text-xs">
                <Briefcase size={14} className="text-white" />
                <Link to="/vacancies" className="hover:text-gray-200 hover:underline" >Вакансии</Link>
                <Clock size={14} className="text-white" />
                <span>Прием заявок через сайт круглосуточно</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main header */}
        <div className="container mx-auto px-4 md:px-6 py-3 relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link to="/"><img src="src/images/logo-black.svg" alt="Logo"/></Link>
              <span className="hidden md:block text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                Кузовной ремонт и покраска <br /> автомобилей в Минске
              </span>
            </div>

            {/* Desktop Navigation */}
            {isDesktop && (
              <nav className="hidden xl:flex gap-6 text-sm">
                {config.NAVIGATION_ITEMS.map(item => (
                  <div 
                    key={item.path} 
                    className="relative group"
                    onMouseEnter={() => setOpenSubmenu(item.name)}
                    onMouseLeave={() => setOpenSubmenu(null)}
                  >
                    <div className="flex items-center">
                      <Link
                        to={item.path}
                        className={`${
                          location.pathname === item.path
                            ? 'text-blue-600'
                            : 'text-gray-800 hover:text-blue-600'
                        } font-medium`}
                      >
                        {item.name}
                      </Link>
                      {item.subItems && (
                        <button
                          className="p-1 -ml-1"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSubmenu(item.name);
                          }}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              openSubmenu === item.name 
                                ? 'text-blue-600 rotate-180'
                                : 'text-gray-500'
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {item.subItems && (
                      <AnimatePresence>
                        {openSubmenu === item.name && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden"
                          >
                            {item.subItems.map((subItem, index) => (
                              <Link
                                key={`subitem-${index}`}
                                to={subItem.path}
                                className={`block px-4 py-2.5 text-sm ${
                                  location.pathname === subItem.path
                                    ? 'text-blue-600'
                                    : 'text-gray-700 hover:text-blue-600'
                                } hover:bg-gray-50 rounded-md first:rounded-t-lg last:rounded-b-lg`} // Добавлены rounded-md и hover:bg-gray-50
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                ))}
              </nav>
            )}

            <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
              {shouldRenderPhoneButton && (
                <div className="sm:hidden">
                  <a 
                    href={`tel:${config.CONTACT_INFO.phones[0].number.replace(/\D/g, '')}`}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors whitespace-nowrap"
                  >
                    <Phone size={18} className="text-blue-600 flex-shrink-0" />
                    <span>Позвонить</span>
                  </a>
                </div>
              )}

              {shouldRenderDesktopContact && (
                <div 
                  className="relative hidden sm:block"
                  onMouseEnter={() => setIsPhoneHovered(true)}
                  onMouseLeave={() => setIsPhoneHovered(false)}
                >
                  <div className="flex flex-col items-end cursor-pointer group">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500 group-hover:text-blue-600 whitespace-nowrap">
                        {config.CONTACT_INFO.phones.map(p => p.provider).join(' ')}
                      </span>
                      <ChevronDown size={14} className="text-gray-500 group-hover:text-blue-600" />
                    </div>
                    <a 
                      href={`tel:${config.CONTACT_INFO.phones[0].number.replace(/\D/g, '')}`}
                      className="flex items-center gap-2 text-lg font-semibold text-gray-800 hover:text-blue-600 whitespace-nowrap"
                    >
                      <Phone size={18} className="text-blue-600" />
                      <span>{config.CONTACT_INFO.phones[0].number.split('-').join(' ').split(') ')[1]}</span>
                    </a>
                  </div>

                  <AnimatePresence>
                    {isPhoneHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden"
                      >
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-5 py-3 border-b border-blue-200 rounded-t-lg">
                          <h4 className="text-sm font-semibold text-gray-800">Контактная информация</h4>
                        </div>
                        <div className="p-4 space-y-4">
                          {config.CONTACT_INFO.workHours && (
                            <div className="bg-blue-50/30 p-3 rounded-lg border border-blue-100">
                              <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-blue-500" />
                                <p className="text-xs font-medium text-gray-600">Режим работы</p>
                              </div>
                              <div className="space-y-1 pl-6">
                                <p className="text-sm font-medium text-gray-800">{config.CONTACT_INFO.workHours.weekdays}</p>
                                {config.CONTACT_INFO.workHours.weekends && (
                                  <p className="text-sm font-medium text-gray-800">{config.CONTACT_INFO.workHours.weekends}</p>
                                )}
                              </div>
                            </div>
                          )}
                          <div className="space-y-3">
                            {config.CONTACT_INFO.phones.map((phone, index) => (
                              <PhoneNumberItem 
                                key={`hover-phone-${index}`}
                                number={phone.number} 
                                provider={phone.provider} 
                                className="hover:bg-gray-50" 
                              />
                            ))}
                          </div>
                          {config.CONTACT_INFO.email && (
                            <a 
                              href={`mailto:${config.CONTACT_INFO.email}`} 
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                            >
                              <div className="bg-blue-100 p-2 rounded-full">
                                <Mail className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-sm font-medium text-gray-800 hover:text-blue-600">
                                  {config.CONTACT_INFO.email}
                                </p>
                              </div>
                            </a>
                          )}
                        </div>
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
                          <p className="text-xs text-gray-500 text-center">Мы всегда рады помочь!</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <Button 
                onClick={openQuizModal}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white whitespace-nowrap shadow-md hover:shadow-lg max-w-[180px] overflow-hidden"
              >
                <span className="truncate">Оставить заявку</span>
              </Button>

              <button 
                onClick={toggleMenu}
                className="xl:hidden flex text-gray-700 p-2 rounded-lg hover:bg-gray-100"
                aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence initial={false}>
            {isMenuOpen && !isDesktop && (
              <motion.div 
                initial={{ 
                  opacity: 0,
                  height: 0,
                  overflow: 'hidden'
                }}
                animate={{ 
                  opacity: 1,
                  height: 'auto',
                  transition: {
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                    mass: 0.5
                  }
                }}
                exit={{ 
                  opacity: 0,
                  height: 0,
                  transition: {
                    duration: 0.2,
                    ease: "easeInOut"
                  }
                }}
                className="xl:hidden bg-white shadow-lg border-t border-gray-200 rounded-b-lg" // Добавлено rounded-b-lg
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  zIndex: 40,
                  top: '100%'
                }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="container mx-auto px-4 py-4">
                    <nav className="flex flex-col divide-y divide-gray-100">
                      {config.NAVIGATION_ITEMS.map((item) => (
                        <div key={`mobile-nav-${item.path}`}>
                          {item.subItems ? (
                            <div>
                              <div className="flex items-center justify-between w-full">
                                <Link
                                  to={item.path}
                                  onClick={() => setIsMenuOpen(false)}
                                  className={`py-3 px-1 text-base font-medium ${
                                    location.pathname === item.path
                                      ? 'text-blue-600'
                                      : 'text-gray-800 hover:text-blue-600'
                                  } rounded-md`}
                                >
                                  {item.name}
                                </Link>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toggleSubmenu(item.name);
                                  }}
                                  className="p-2"
                                >
                                  <ChevronDown
                                    className={`w-4 h-4 transition-transform ${
                                      openSubmenu === item.name 
                                        ? 'text-blue-600 rotate-180'
                                        : 'text-gray-500'
                                    }`}
                                  />
                                </button>
                              </div>
                              <AnimatePresence>
                                {openSubmenu === item.name && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pl-4"
                                  >
                                    {item.subItems.map((subItem, index) => (
                                      <Link
                                        key={`mobile-subitem-${index}`}
                                        to={subItem.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`block py-2.5 text-sm ${
                                          location.pathname === subItem.path
                                            ? 'text-blue-600'
                                            : 'text-gray-600 hover:text-blue-600'
                                        } rounded-md hover:bg-gray-50`} // Добавлено rounded-md и hover:bg-gray-50
                                      >
                                        {subItem.name}
                                      </Link>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ) : (
                            <Link
                              to={item.path}
                              onClick={() => setIsMenuOpen(false)}
                              className={`block py-3 px-1 text-base font-medium ${
                                location.pathname === item.path
                                  ? 'text-blue-600'
                                  : 'text-gray-800 hover:text-blue-600'
                              } rounded-md hover:bg-gray-50`} // Добавлено rounded-md и hover:bg-gray-50
                            >
                              {item.name}
                            </Link>
                          )}
                        </div>
                      ))}
                    </nav>

                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                      <ContactInfo />
                      <Button 
                        onClick={openQuizModal}
                        className="w-full py-3 text-base font-medium rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg flex items-center justify-center gap-2 max-w-full overflow-hidden"
                      >
                        <span className="truncate">Оставить заявку</span>
                      </Button>
                      <div className="text-center text-gray-500 text-sm mt-2 mb-4">
                        Прием заявок через сайт круглосуточно
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  );
}