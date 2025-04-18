import axios from 'axios';

const TELEGRAM_BOT_TOKEN = '7889251135:AAHnC3CcYAw8fm-dDVZrWGC3j2s_nLrmYtA';
const TELEGRAM_USER_ID = '-1002697333190';

export const sendToTelegram = async (message: string, photos: File[] = []) => {
  try {
    if (photos.length > 0) {
      // Создаем FormData для отправки медиагруппы
      const formData = new FormData();
      
      // Подготавливаем медиагруппу
      const media = photos.map((photo, index) => ({
        type: 'photo',
        media: `attach://photo_${index}`,
        caption: index === 0 ? message : undefined,
        parse_mode: 'HTML'
      }));

      // Добавляем фотографии
      photos.forEach((photo, index) => {
        formData.append(`photo_${index}`, photo);
      });

      // Добавляем метаданные
      formData.append('chat_id', TELEGRAM_USER_ID);
      formData.append('media', JSON.stringify(media));

      // Отправляем медиагруппу
      const response = await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMediaGroup`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return response.data;
    } else {
      // Если нет фото, отправляем просто текст
      const response = await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: TELEGRAM_USER_ID,
          text: message,
          parse_mode: 'HTML'
        }
      );
      return response.data;
    }
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    throw error;
  }
};