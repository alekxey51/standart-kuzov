import React, { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import { sendToTelegram } from '../utils/telegram';
import { formatPhoneNumber, validatePhoneNumber, handlePhoneChange as handlePhoneChangeUtil } from '../utils/checkPhone';

interface RepairFormProps {
  onClose: () => void;
}

export function RepairForm({ onClose }: RepairFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    comment: '',
    consent: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ name: false, phone: false, consent: false });
  const phoneInputRef = useRef<HTMLInputElement>(null);

  // Получаем текущую дату в формате YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, onClose]);

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim(),
      phone: !validatePhoneNumber(formData.phone),
      consent: !formData.consent
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePhoneChangeUtil(
      e,
      formData.phone,
      (phone) => setFormData(prev => ({...prev, phone})),
      () => setErrors(prev => ({...prev, phone: false}))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await sendToTelegram(`
<b>Новая заявка на ремонт:</b>

👤 Имя: ${formData.name}
📞 Телефон: <code>${formData.phone.replace(/\s/g, '')}</code>
📅 Желаемая дата: ${formData.date || '-'}
💬 Комментарий: ${formData.comment || '-'}
      `);
      setIsSubmitted(true);
      setFormData({ name: '', phone: '', date: '', comment: '', consent: false });
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-xs sm:max-w-md overflow-hidden shadow-xl p-4 sm:p-6">
        <div className="text-center py-4 sm:py-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Check className="text-green-500 w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">Заявка отправлена!</h3>
          <p className="text-sm sm:text-base text-gray-600">Мы свяжемся с вами в ближайшее время</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-xs sm:max-w-md overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4 sm:p-6 text-white relative">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-bold">Запись на ремонт</h2>
            <button onClick={onClose} className="text-white opacity-80 hover:opacity-100">
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Ваше имя *</label>
              <input
                type="text"
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border rounded-lg ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              />
              {errors.name && <p className="mt-1 text-xs sm:text-sm text-red-500">Поле обязательно для заполнения</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Телефон *</label>
              <input
                type="tel"
                ref={phoneInputRef}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border rounded-lg ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                value={formData.phone}
                onChange={handlePhoneChange}
                onFocus={() => !formData.phone && setFormData(prev => ({...prev, phone: '+375 '}))}
                placeholder="+375 (__) ___-__-__"
              />
              {errors.phone && <p className="mt-1 text-xs sm:text-sm text-red-500">Введите корректный номер телефона</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Желаемая дата</label>
              <input
                type="date"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({...prev, date: e.target.value}))}
                min={today} // Запрещаем выбирать даты раньше сегодняшней
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Комментарий</label>
              <textarea
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({...prev, comment: e.target.value}))}
                rows={2}
              />
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => setFormData(prev => ({...prev, consent: e.target.checked}))}
                className={`mt-1 h-3 w-3 sm:h-4 sm:w-4 rounded focus:ring-blue-500 ${
                  errors.consent ? 'border-red-500 text-red-500' : 'border-gray-300 text-blue-600'
                }`}
              />
              <label className="ml-2 text-xs sm:text-sm text-gray-700">
                Я согласен на обработку персональных данных *
              </label>
            </div>
            {errors.consent && <p className="mt-1 text-xs sm:text-sm text-red-500">Необходимо ваше согласие</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-blue-700 to-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg font-medium hover:from-blue-800 hover:to-blue-700 transition-colors shadow-md ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Отправляется...' : 'Отправить заявку'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}