import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { sendToTelegram } from '../utils/telegram';
import { formatPhoneNumber, validatePhoneNumber, handlePhoneChange as handlePhoneChangeUtil } from '../utils/checkPhone';

interface ApplyFormProps {
  vacancyTitle: string;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export const ApplyForm: React.FC<ApplyFormProps> = ({ vacancyTitle, onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    experience: '',
    consent: false
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    experience: false,
    consent: false
  });

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        onSubmitSuccess();
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, onClose, onSubmitSuccess]);

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim(),
      phone: !validatePhoneNumber(formData.phone),
      experience: !formData.experience.trim(),
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
    if (!validateForm()) {
      console.log('Validation failed', errors);
      return;
    }
    
    try {
      console.log('Submitting form...');
      await sendToTelegram(`
<b>Новый отклик на вакансию!</b>

Вакансия: ${vacancyTitle}

👤 Имя: ${formData.name}
📞 Телефон: <code>${formData.phone.replace(/\s/g, '')}</code>
📧 Email: ${formData.email || '-'}
💼 Опыт работы: ${formData.experience}
      `);
      console.log('Form submitted successfully');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-2xl w-full max-w-xs sm:max-w-md overflow-hidden shadow-xl p-4 sm:p-6">
          <div className="text-center py-4 sm:py-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Check className="text-green-500 w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">Отклик отправлен!</h3>
            <p className="text-sm sm:text-base text-gray-600">Мы свяжемся с вами в ближайшее время</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-xs sm:max-w-md overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4 sm:p-6 text-white relative">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-bold">Отклик на вакансию</h2>
            <button 
              onClick={onClose} 
              className="text-white opacity-80 hover:opacity-100"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-700">Вакансия: <span className="font-semibold">{vacancyTitle}</span></p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Ваше имя *</label>
              <input
                type="text"
                name="name"
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border rounded-lg ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                required
              />
              {errors.name && <p className="mt-0.5 text-xs sm:text-sm text-red-500">Поле обязательно для заполнения</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Телефон *</label>
              <input
                type="tel"
                name="phone"
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border rounded-lg ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                value={formData.phone}
                onChange={handlePhoneChange}
                onFocus={() => !formData.phone && setFormData(prev => ({...prev, phone: '+375 '}))}
                placeholder="+375 (__) ___-__-__"
                required
              />
              {errors.phone && <p className="mt-0.5 text-xs sm:text-sm text-red-500">Введите корректный номер телефона</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Опыт работы *</label>
              <textarea
                name="experience"
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border rounded-lg ${
                  errors.experience ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({...prev, experience: e.target.value}))}
                rows={3}
                required
              />
              {errors.experience && <p className="mt-0.5 text-xs sm:text-sm text-red-500">Поле обязательно для заполнения</p>}
            </div>

            <div className="mt-6">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={(e) => setFormData(prev => ({...prev, consent: e.target.checked}))}
                  className={`mt-1 h-4 w-4 rounded focus:ring-blue-500 ${
                    errors.consent ? 'border-red-500 text-red-500' : 'border-gray-300 text-blue-600'
                  }`}
                  required
                />
                <label className="ml-2 text-xs sm:text-sm text-gray-700">
                  Я согласен на обработку персональных данных *
                </label>
              </div>
              {errors.consent && <p className="mt-2 text-xs sm:text-sm text-red-500">Необходимо ваше согласие</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-700 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-800 hover:to-blue-700 transition-colors shadow-md mt-4"
            >
              Отправить отклик
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};