import { useState } from 'react';

export function useToast() {
  const [showToast, setShowToast] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setToastVisible(true), 30);
    setTimeout(() => setToastVisible(false), 2500);
    setTimeout(() => setShowToast(false), 3000);
  };

  return { showToast, toastVisible, toastMessage, triggerToast };
}
