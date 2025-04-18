import React, { useState, useEffect, useCallback } from 'react';
import { Cookie, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

type CookieKey = 'necessary' | 'analytics' | 'marketing';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: true
  });

  useEffect(() => {
    if (!localStorage.getItem('cookieConsent')) setIsVisible(true);
  }, []);

  const handleAccept = useCallback(() => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setIsVisible(false);
  }, [preferences]);

  const handleReject = useCallback(() => {
    localStorage.setItem('cookieConsent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
    setIsVisible(false);
  }, []);

  const togglePreference = (key: CookieKey) => {
    if (key === 'necessary') return;
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isVisible) return null;

  const cookieTypes: { key: CookieKey; title: string; desc: string }[] = [
    { key: 'necessary', title: 'Необходимые', desc: 'Основные функции сайта' },
    { key: 'analytics', title: 'Аналитические', desc: 'Анализ использования сайта' },
    { key: 'marketing', title: 'Маркетинговые', desc: 'Персонализация рекламы' }
  ];

  return (
    <div className="fixed bottom-4 left-4 bg-white shadow-xl border border-gray-200 rounded-lg z-50 max-w-md p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-50 p-2 rounded-full">
            <Cookie className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Файлы cookie</h3>
            <p className="text-sm text-gray-900">
              Для корректной работы сайта и вашего удобства мы используем файлы cookie
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Нажимая «Принять», вы даёте согласие на обработку файлов cookie в соответствии с{' '}
              <Link to="/cookie-policy" className="text-blue-600 hover:text-blue-800 font-medium underline">
                Политикой обработки файлов cookie
              </Link>.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-xs"
        >
          {showDetails ? (
            <>
              <ChevronUp className="w-3 h-3 mr-1" />
              Скрыть расширенные настройки
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3 mr-1" />
              Показать расширенные настройки
            </>
          )}
        </button>

        {showDetails && (
          <div className="space-y-3">
            {cookieTypes.map(({ key, title, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{desc}</p>
                </div>
                <label className={`relative inline-flex items-center ${key === 'necessary' ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                  <input
                    type="checkbox"
                    checked={preferences[key]}
                    disabled={key === 'necessary'}
                    onChange={() => togglePreference(key)}
                    className="sr-only peer"
                  />
                  <div className={`w-9 h-5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all ${
                    preferences[key] ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                </label>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleReject}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded text-sm transition-colors"
          >
            Отклонить
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-2 px-4 rounded text-sm transition-all hover:from-blue-700 hover:to-blue-800 flex items-center justify-center gap-1"
          >
            <Check className="w-3 h-3" />
            Принять
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;