import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, Trash2, Check } from 'lucide-react';
import quizData from '../data/quiz.json';
import { formatPhoneNumber, validatePhoneNumber, handlePhoneChange as handlePhoneChangeUtil } from '../utils/checkPhone';
import { sendToTelegram } from '../utils/telegram';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuizModal({ isOpen, onClose }: QuizModalProps) {
  const steps = quizData.steps;
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    consent: false,
  });
  const [phoneError, setPhoneError] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setCurrentStep(0);
    setAnswers({});
    setContactInfo({ name: '', phone: '', consent: false });
    setPhotos([]);
    setPhoneError('');
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  const handleAnswer = (answer: string) => {
    const step = steps[currentStep];
    
    if (step.multiple) {
      const current = (answers[currentStep] as string[]) || [];
      const newAnswers = current.includes(answer)
        ? current.filter(a => a !== answer)
        : [...current, answer];
      setAnswers({ ...answers, [currentStep]: newAnswers });
    } else {
      setAnswers({ ...answers, [currentStep]: answer });
      if (currentStep < steps.length - 1) {
        setTimeout(() => setCurrentStep(prev => prev + 1), 300);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!validatePhoneNumber(contactInfo.phone)) {
      setPhoneError('Введите полный номер телефона');
      return;
    }

    setIsSubmitting(true);

    const formattedAnswers = steps.map((step, i) => {
      const answer = answers[i];
      if (!answer || (Array.isArray(answer) && answer.length === 0)) {
        return null;
      }
      return `🔹 ${step.title}: ${Array.isArray(answer) ? answer.join(', ') : answer}`;
    }).filter(Boolean).join('\n');

    let message = `
<b>Новая заявка с квиза</b>

👤 Имя: ${contactInfo.name}
📞 Телефон: <code>${contactInfo.phone.replace(/\s/g, '')}</code>
${photos.length > 0 ? `📸 Кол-во фотографий: ${photos.length}\n` : ''}
Ответы:
${formattedAnswers}
    `;

    try {
      await sendToTelegram(message, photos.length > 0 ? photos : undefined);
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (error) {
      console.error('Ошибка отправки:', error);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const progress = ((currentStep + 1) / steps.length) * 100;
  const step = steps[currentStep];

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-2xl w-full max-w-xs sm:max-w-md p-4 sm:p-6 shadow-xl">
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
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-xs sm:max-w-md shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4 sm:p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg sm:text-xl font-bold">{step.title}</h2>
              <p className="text-xs sm:text-sm opacity-90 mt-1">Шаг {currentStep + 1} из {steps.length}</p>
            </div>
            <div className="text-xs sm:text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
              Пройдено: {Math.round(progress)}%
            </div>
            <button onClick={onClose} className="text-white opacity-80 hover:opacity-100">
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>
          
          <div className="mt-3 sm:mt-4 h-2 bg-white bg-opacity-30 rounded-full">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {step.isContactForm ? (
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Ваше имя*</label>
                <input
                  type="text"
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Телефон*</label>
                <input
                  type="tel"
                  ref={phoneInputRef}
                  value={contactInfo.phone}
                  onChange={(e) => handlePhoneChangeUtil(
                    e,
                    contactInfo.phone,
                    (phone) => setContactInfo({...contactInfo, phone}),
                    setPhoneError
                  )}
                  onFocus={() => !contactInfo.phone && setContactInfo({...contactInfo, phone: '+375 '})}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="+375 (__) ___-__-__"
                  required
                />
                {phoneError && <p className="mt-1 text-xs sm:text-sm text-red-500">{phoneError}</p>}
              </div>

              {step.withPhotos && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Фото повреждений</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {photos.map((photo, i) => (
                      <div key={i} className="relative group">
                        <img 
                          src={URL.createObjectURL(photo)} 
                          alt="" 
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-200" 
                        />
                        <button 
                          type="button"
                          onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                          className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                        >
                          <Trash2 size={12} className="sm:w-3 sm:h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={(e) => e.target.files && setPhotos([...photos, ...Array.from(e.target.files).slice(0, 5 - photos.length)])}
                    className="hidden" 
                    accept="image/*" 
                    multiple 
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={photos.length >= 5}
                    className={`w-full py-2 sm:py-3 text-xs sm:text-sm border-2 border-dashed rounded-lg flex items-center justify-center ${
                      photos.length >= 5 
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500'
                    }`}
                  >
                    <Camera size={14} className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium">Добавить фото</span>
                    <span className="ml-1 text-gray-500">({photos.length}/5)</span>
                  </button>
                </div>
              )}

              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={contactInfo.consent}
                  onChange={(e) => setContactInfo({...contactInfo, consent: e.target.checked})}
                  className="mt-1 h-3 w-3 sm:h-4 sm:w-4 text-blue-600 rounded-lg focus:ring-blue-500"
                  required
                />
                <label className="ml-2 text-xs sm:text-sm text-gray-700">
                  Согласен на обработку персональных данных*
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full text-sm sm:text-base bg-gradient-to-r from-blue-700 to-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:from-blue-800 hover:to-blue-700 shadow-md transition-opacity ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
              </button>
            </form>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {step.options?.map((option) => {
                const selected = step.multiple 
                  ? (answers[currentStep] as string[])?.includes(option)
                  : answers[currentStep] === option;
                
                return (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-3 sm:p-4 text-sm sm:text-base text-left rounded-lg border transition-all flex items-center ${
                      selected 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className={`mr-2 sm:mr-3 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center ${
                      selected ? 'bg-blue-500 text-white' : 'border border-gray-300'
                    }`}>
                      {selected && <Check size={12} className="sm:w-3 sm:h-3" />}
                    </div>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {!step.isContactForm && (
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex justify-between">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex items-center text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                <ChevronLeft size={14} className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />
                Назад
              </button>
            )}
            
            {step.multiple && (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!answers[currentStep] || (answers[currentStep] as string[]).length === 0}
                className={`ml-auto px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg flex items-center ${
                  (!answers[currentStep] || (answers[currentStep] as string[]).length === 0)
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                }`}
              >
                Далее <ChevronRight size={14} className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}