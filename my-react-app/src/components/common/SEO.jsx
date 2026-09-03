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
    // `lang`/`dir` on <html> belong to LanguageProvider (src/i18n) — the site
    // language is a user choice, not a per-route SEO fact, and writing them
    // here would silently undo the language toggle on every navigation.

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

    // ALL of them, not just the ones this component added. A prerendered page
    // arrives with its own hreflang set written by scripts/postbuild-seo.mjs
    // and index.html ships a static set of its own; matching only on the
    // managed attribute left those in place and appended a second copy beside
    // them, so every prerendered route served two hreflang sets — one of them
    // (index.html's) pointing every language at the homepage.
    document.head.querySelectorAll('link[rel="alternate"]').forEach((element) => {
      element.remove();
    });

    // {hreflang, href} pairs, not bare language tags. These used to be strings
    // and every one of them was given THIS page's url — an "alternate" that
    // resolves to the same document as the canonical, which tells a crawler
    // nothing. Each variant now points at its own URL (see src/seo/locales.js).
    alternates.forEach((alternate) => {
      if (!alternate || !alternate.hreflang || !alternate.href) return;
      const element = document.createElement('link');
      element.setAttribute('rel', 'alternate');
      element.setAttribute('hreflang', alternate.hreflang);
      element.setAttribute('href', alternate.href);
      element.setAttribute(MANAGED_ATTRIBUTE, 'true');
      document.head.appendChild(element);
    });

    // Same reasoning as the alternates above: the prerendered <head> already
    // carries this route's JSON-LD, so keeping only the managed ones meant the
    // page ended up declaring each schema twice.
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach((element) => {
      element.remove();
    });

    schemaItems.forEach((item) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute(MANAGED_SCRIPT_ATTRIBUTE, 'true');
      script.textContent = JSON.stringify(item);
      document.head.appendChild(script);
    });
  }, [alternates, description, image, imageAlt, keywords, locale, robots, siteName, structuredData, title, type, url]);

  return null;
};

export default SEO;