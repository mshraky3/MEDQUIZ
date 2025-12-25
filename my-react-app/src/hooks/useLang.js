import { useEffect, useState } from 'react';

const getInitialLang = () => {
  if (typeof window === 'undefined') {
    return 'ar';
  }

  const storedPreference = window.localStorage.getItem('langPreference');
  if (storedPreference === 'ar' || storedPreference === 'en') {
    return storedPreference;
  }

  return 'ar';
};

export default function useLang() {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('langPreference', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  return [lang, setLang];
}