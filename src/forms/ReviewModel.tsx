import React, { useState } from 'react';
import { X, Star, Check } from 'lucide-react';
import { sendToTelegram } from '../utils/telegram';
import servicesData from '../data/services.json';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: { 
    rating: number; 
    text: string; 
    name: string;
    carModel: string;
    workType: string;
  }) => void;
}

const CAR_MODELS = [
  'Audi A3', 'Audi A4', 'Audi A5', 'Audi A6', 'Audi Q5', 'Audi Q7',
  'BMW 3 Series', 'BMW 5 Series', 'BMW X3', 'BMW X5',
  'Mercedes-Benz C-Class', 'Mercedes-Benz E-Class', 'Mercedes-Benz GLC',
  'Volkswagen Golf', 'Volkswagen Passat', 'Volkswagen Tiguan',
  'Toyota Camry', 'Toyota RAV4', 'Toyota Corolla',
  'Honda Civic', 'Honda Accord', 'Honda CR-V',
  'Hyundai Tucson', 'Hyundai Santa Fe', 'Hyundai Elantra',
  'Kia Sportage', 'Kia Sorento', 'Kia Rio',
  'Lexus RX', 'Lexus NX', 'Lexus ES',
  'Mazda CX-5', 'Mazda 6', 'Mazda 3',
  'Nissan Qashqai', 'Nissan X-Trail', 'Nissan Sentra',
  'Ford Focus', 'Ford Mondeo', 'Ford Kuga',
  'Skoda Octavia', 'Skoda Superb', 'Skoda Kodiaq'
];

export function ReviewModal({ isOpen, onClose, onSubmit }: ReviewModalProps) {
  const [state, setState] = useState({
    rating: 0,
    hoverRating: 0,
    hoverPosition: 0,
    reviewText: '',
    name: '',
    carModel: '',
    workType: '',
    consent: false,
    isSubmitting: false,
    showSuccess: false,
    errors: { name: false, reviewText: false, consent: false }
  });
  
  const [modelSuggestions, setModelSuggestions] = useState<string[]>([]);
  const workTypes = servicesData.SERVICES.flatMap(service => service.features);

  const updateState = (partial: Partial<typeof state>) => 
    setState(prev => ({ ...prev, ...partial }));

  const resetForm = () => {
    updateState({
      rating: 0,
      hoverRating: 0,
      hoverPosition: 0,
      reviewText: '',
      name: '',
      carModel: '',
      workType: '',
      consent: false,
      isSubmitting: false,
      showSuccess: false,
      errors: { name: false, reviewText: false, consent: false }
    });
    setModelSuggestions([]);
  };

  const validateForm = () => {
    const errors = {
      name: !state.name.trim(),
      reviewText: !state.reviewText.trim(),
      consent: !state.consent
    };
    updateState({ errors });
    return !Object.values(errors).some(Boolean);
  };

  const handleStarClick = (star: number, position: number) => 
    updateState({ rating: position > 50 ? star : star - 0.5 });

  const handleStarHover = (star: number, position: number) => 
    updateState({ hoverRating: star, hoverPosition: position });

  const handleCarModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateState({ carModel: value });
    setModelSuggestions(
      value.length > 1 ? CAR_MODELS.filter(m => m.toLowerCase().includes(value.toLowerCase())) : []
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.isSubmitting || state.rating === 0 || !validateForm()) return;

    updateState({ isSubmitting: true });

    try {
      await sendToTelegram(`
        <b>Новый отзыв:</b>
        Рейтинг: ${state.rating} ⭐
        Имя: ${state.name}
        Автомобиль: ${state.carModel || '-'}
        Вид работы: ${state.workType || '-'}
        Отзыв: ${state.reviewText}
      `);
      
      onSubmit({
        rating: state.rating,
        text: state.reviewText,
        name: state.name,
        carModel: state.carModel,
        workType: state.workType
      });

      onClose();
      updateState({ showSuccess: true });
      setTimeout(() => {
        updateState({ showSuccess: false });
        resetForm();
      }, 2000);
    } catch (error) {
      console.error('Ошибка отправки отзыва:', error);
    } finally {
      updateState({ isSubmitting: false });
    }
  };

  if (!isOpen && !state.showSuccess) return null;

  const renderModal = (content: React.ReactNode, isSuccess = false) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className={`bg-white rounded-2xl w-full max-w-xs sm:max-w-md overflow-hidden shadow-xl ${isSuccess ? 'p-4 sm:p-6' : ''}`}>
        {content}
      </div>
    </div>
  );

  const renderStars = () => [1, 2, 3, 4, 5].map((star) => {
    const isHoveredHalf = state.hoverRating === star && state.hoverPosition <= 50;
    const isSelectedHalf = state.rating >= star - 0.5 && state.rating < star;
    const showHalfStar = isHoveredHalf || isSelectedHalf;
    const isFilled = star <= (state.hoverRating || Math.ceil(state.rating)) && 
                    !(star === Math.ceil(state.rating) && state.rating % 1 !== 0);

    return (
      <div 
        key={star}
        className="relative mx-1"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          handleStarHover(star, ((e.clientX - rect.left) / rect.width) * 100);
        }}
        onMouseLeave={() => updateState({ hoverRating: 0, hoverPosition: 0 })}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          handleStarClick(star, ((e.clientX - rect.left) / rect.width) * 100);
        }}
      >
        <Star size={32} className="text-gray-300 fill-gray-300" />
        {(isFilled || showHalfStar) && (
          <div className="absolute inset-0 overflow-hidden" style={{ width: showHalfStar ? '50%' : '100%' }}>
            <Star size={32} className="text-yellow-400 fill-yellow-400 absolute top-0 left-0" />
          </div>
        )}
      </div>
    );
  });

  return (
    <>
      {isOpen && renderModal(
        <>
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4 sm:p-6 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold">Напишите отзыв</h2>
              <button onClick={() => { resetForm(); onClose(); }} className="text-white/80 hover:opacity-100">
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="flex justify-center mb-3 sm:mb-4">
                {renderStars()}
              </div>
              <div className="text-center text-sm text-gray-500 mb-2">
                {state.rating > 0 ? `Вы выбрали: ${state.rating} ${state.rating % 1 === 0 ? 'звёзд' : 'звезды'}` : 'Выберите оценку'}
              </div>
              
              {['name', 'carModel', 'workType', 'reviewText'].map((field) => (
                <div key={field} className={field === 'carModel' ? 'relative' : ''}>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    {field === 'name' ? 'Ваше имя *' : 
                     field === 'carModel' ? 'Марка и модель автомобиля' : 
                     field === 'workType' ? 'Вид работы' : 'Отзыв *'}
                  </label>
                  {field === 'workType' ? (
                    <select
                      value={state.workType}
                      onChange={(e) => updateState({ workType: e.target.value })}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Выберите вид работы</option>
                      {workTypes.map((type, i) => <option key={i} value={type}>{type}</option>)}
                    </select>
                  ) : field === 'reviewText' ? (
                    <>
                      <textarea
                        value={state.reviewText}
                        onChange={(e) => {
                          updateState({ reviewText: e.target.value });
                          updateState({ errors: { ...state.errors, reviewText: false } });
                        }}
                        rows={3}
                        className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border rounded-lg ${
                          state.errors.reviewText ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Расскажите о вашем опыте..."
                        required
                      />
                      {state.errors.reviewText && <p className="mt-1 text-xs text-red-500">Поле обязательно для заполнения</p>}
                    </>
                  ) : field === 'carModel' ? (
                    <>
                      <input
                        type="text"
                        value={state.carModel}
                        onChange={handleCarModelChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Например: Audi A5"
                      />
                      {modelSuggestions.length > 0 && (
                        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                          {modelSuggestions.map((model, i) => (
                            <li 
                              key={i}
                              className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                              onClick={() => {
                                updateState({ carModel: model });
                                setModelSuggestions([]);
                              }}
                            >
                              {model}
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={state.name}
                        onChange={(e) => {
                          updateState({ name: e.target.value });
                          updateState({ errors: { ...state.errors, name: false } });
                        }}
                        className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border rounded-lg ${
                          state.errors.name ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        required
                      />
                      {state.errors.name && <p className="mt-1 text-xs text-red-500">Поле обязательно для заполнения</p>}
                    </>
                  )}
                </div>
              ))}
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={state.consent}
                  onChange={(e) => {
                    updateState({ consent: e.target.checked });
                    updateState({ errors: { ...state.errors, consent: false } });
                  }}
                  className={`mt-1 h-3 w-3 sm:h-4 sm:w-4 rounded focus:ring-blue-500 ${
                    state.errors.consent ? 'border-red-500 text-red-500' : 'border-gray-300 text-blue-600'
                  }`}
                />
                <label className="ml-2 text-xs sm:text-sm text-gray-700">
                  Я согласен на обработку персональных данных *
                </label>
              </div>
              {state.errors.consent && <p className="mt-1 text-xs text-red-500">Необходимо ваше согласие</p>}
              
              <button
                type="submit"
                disabled={state.isSubmitting || state.rating === 0}
                className={`w-full text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium transition-colors shadow-md ${
                  state.isSubmitting || state.rating === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-700 to-blue-600 text-white hover:from-blue-800 hover:to-blue-700'
                }`}
              >
                {state.isSubmitting ? 'Отправляется...' : 'Отправить отзыв'}
              </button>
            </form>
          </div>
        </>
      )}

      {state.showSuccess && renderModal(
        <div className="text-center py-4 sm:py-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Check className="text-green-500 w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">Спасибо за отзыв!</h3>
          <p className="text-sm sm:text-base text-gray-600">Ваш отзыв успешно отправлен</p>
        </div>,
        true
      )}
    </>
  );
}