import { useEffect, useState } from 'react';

export default function useLang() {
  const [lang, setLang] = useState('en');
  useEffect(() => {
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && browserLang.startsWith('ar')) setLang('ar');
    else setLang('en');
  }, []);
  return lang;
}