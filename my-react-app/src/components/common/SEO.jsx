import React, { useEffect } from 'react';

const MANAGED_ATTRIBUTE = 'data-seo-managed';
const MANAGED_SCRIPT_ATTRIBUTE = 'data-seo-script';
const defaultKeywords = 'اختبارات الهيئة السعودية للتخصصات الصحية, اختبار البرومترك, بنك أسئلة SMLE, اسئلة برومترك, Saudi Medical Licensing Examination, Prometric, medical questions, Saudi Prometric questions, medical MCQ';

const SEO = ({
  title,
  description,
  keywords,
  image,
  imageAlt,
  url,
  type = 'website',
  structuredData = [],
  siteName = 'SQB',
  robots = 'index, follow',
  lang = 'ar',
  dir = 'rtl',
  locale = 'ar_SA',
  alternates = []
}) => {
  useEffect(() => {
    const fullTitle = title || siteName;
    const schemaItems = Array.isArray(structuredData)
      ? structuredData.filter(Boolean)
      : structuredData
        ? [structuredData]
        : [];

    const setMeta = (selector, attributes, content) => {
      let element = document.head.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        Object.entries(attributes).forEach(([key, value]) => {
          element.setAttribute(key, value);
        });
        element.setAttribute(MANAGED_ATTRIBUTE, 'true');
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    const setLink = (selector, attributes) => {
      let element = document.head.querySelector(selector);

      if (!element) {
        element = document.createElement('link');
        element.setAttribute(MANAGED_ATTRIBUTE, 'true');
        document.head.appendChild(element);
      }

      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    };

    document.title = fullTitle;
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;

    setMeta('meta[name="description"]', { name: 'description' }, description);
    setMeta('meta[name="keywords"]', { name: 'keywords' }, keywords || defaultKeywords);
    setMeta('meta[name="author"]', { name: 'author' }, siteName);
    setMeta('meta[name="robots"]', { name: 'robots' }, robots);

    setLink('link[rel="canonical"]', { rel: 'canonical', href: url });

    setMeta('meta[property="og:type"]', { property: 'og:type' }, type);
    setMeta('meta[property="og:title"]', { property: 'og:title' }, fullTitle);
    setMeta('meta[property="og:description"]', { property: 'og:description' }, description);
    setMeta('meta[property="og:image"]', { property: 'og:image' }, image);
    setMeta('meta[property="og:image:alt"]', { property: 'og:image:alt' }, imageAlt || fullTitle);
    setMeta('meta[property="og:url"]', { property: 'og:url' }, url);
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name' }, siteName);
    setMeta('meta[property="og:locale"]', { property: 'og:locale' }, locale);

    setMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image');
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, fullTitle);
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description);
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, image);
    setMeta('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt' }, imageAlt || fullTitle);
    setMeta('meta[name="twitter:url"]', { name: 'twitter:url' }, url);

    document.head.querySelectorAll(`link[rel="alternate"][${MANAGED_ATTRIBUTE}="true"]`).forEach((element) => {
      element.remove();
    });

    alternates.forEach((hrefLang) => {
      const element = document.createElement('link');
      element.setAttribute('rel', 'alternate');
      element.setAttribute('hreflang', hrefLang);
      element.setAttribute('href', url);
      element.setAttribute(MANAGED_ATTRIBUTE, 'true');
      document.head.appendChild(element);
    });

    document.head.querySelectorAll(`script[${MANAGED_SCRIPT_ATTRIBUTE}="true"]`).forEach((element) => {
      element.remove();
    });

    schemaItems.forEach((item) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute(MANAGED_SCRIPT_ATTRIBUTE, 'true');
      script.textContent = JSON.stringify(item);
      document.head.appendChild(script);
    });
  }, [alternates, description, dir, image, imageAlt, keywords, lang, locale, robots, siteName, structuredData, title, type, url]);

  return null;
};

export default SEO;