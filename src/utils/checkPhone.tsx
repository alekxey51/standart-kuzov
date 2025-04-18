export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  let formattedValue = '+375 ';
  
  if (cleaned.length > 3) formattedValue += `(${cleaned.substring(3, 5)}`;
  if (cleaned.length > 5) formattedValue += `) ${cleaned.substring(5, 8)}`;
  if (cleaned.length > 8) formattedValue += `-${cleaned.substring(8, 10)}`;
  if (cleaned.length > 10) formattedValue += `-${cleaned.substring(10, 12)}`;

  return formattedValue;
};

export const validatePhoneNumber = (phone: string): boolean => {
  return phone.replace(/\D/g, '').length >= 12;
};

export const handlePhoneChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  currentPhone: string,
  setPhone: (phone: string) => void,
  setError: (error: string) => void
) => {
  const value = e.target.value;
  // Если пытаемся удалить "+375 " - блокируем
  if (value.length <= 5 && value.startsWith('+375')) {
    setPhone('+375 ');
    return;
  }
  
  const formattedValue = formatPhoneNumber(value);
  setPhone(formattedValue);
  setError('');
};

export const handlePhoneFocus = (
  currentPhone: string,
  setPhone: (phone: string) => void
) => {
  if (!currentPhone || currentPhone === '+375') {
    setPhone('+375 ');
  }
};