import React, { useEffect } from 'react';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  structuredData = null 
}) => {
  const siteName = 'SQB';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultImage = 'https://medquiz.vercel.app/login-icon.png';
  const defaultUrl = 'https://medquiz.vercel.app/';
  const defaultKeywords = `اختبارات الهيئة السعودية للتخصصات الصحية, تدريب على اختبار الهيأة, اختبار البرومترك, كويزات برومترك, اسئلة الهيئة السعودية للتخصصات الصحية, بنك اسئلة برومترك, تجميعات برومترك, اسئلة اختبار البرومترك, تدريب برومترك, اسئلة طبية سعودية, اختبارات طبية, اختبار الرخصة الطبية السعودية, SMLE, Prometric, Saudi Medical Licensing Examination, medical questions, medical quiz, medical exam preparation, Saudi medical license, medical board exam, medical practice test, medical study guide, Saudi medical students, free trial, Prometric questions, Prometric Saudi, برومترك, اسئلة برومترك, اسئلة اختبار البرومترك, اسئلة الهيئة السعودية للتخصصات الصحية, بنك اسئلة برومترك, بنك اسئلة SMLE, تجميعات برومترك, تجميعات SMLE, اختبار البرومترك, اختبار الهيئة السعودية, اسئلة طبية, بنك اسئلة طبية, تدريب برومترك, تدريب SMLE, اسئلة امتحان برومترك, اسئلة امتحان SMLE, اسئلة طبية سعودية, اسئلة طبية برومترك, Saudi Prometric, Prometric exam, Prometric practice, Prometric medicine, Prometric Saudi Arabia, Saudi Prometric questions, Saudi Prometric bank, Saudi Prometric practice, Saudi Prometric free, Saudi Prometric trial, Saudi Prometric preparation, Saudi Prometric online, Saudi Prometric MCQ, Saudi Prometric test, Saudi Prometric review, Saudi Prometric study, Saudi Prometric guide, Saudi Prometric analytics, Saudi Prometric performance, Saudi Prometric topics, Saudi Prometric mobile, Saudi Prometric affordable, Saudi Prometric subscription, Saudi Prometric unlimited, Saudi Prometric 2024, Saudi Prometric 2025`;

  useEffect(() => {
    document.title = fullTitle;

    // Update meta tags
    const updateMetaTag = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords || defaultKeywords);
    updateMetaTag('author', siteName);
    updateMetaTag('robots', 'index, follow');

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url || defaultUrl;

    // Update Open Graph tags
    updatePropertyTag('og:type', type);
    updatePropertyTag('og:title', fullTitle);
    updatePropertyTag('og:description', description);
    updatePropertyTag('og:image', image || defaultImage);
    updatePropertyTag('og:url', url || defaultUrl);
    updatePropertyTag('og:site_name', siteName);
    updatePropertyTag('og:locale', 'ar_SA');

    // Update Twitter tags
    updatePropertyTag('twitter:card', 'summary_large_image');
    updatePropertyTag('twitter:title', fullTitle);
    updatePropertyTag('twitter:description', description);
    updatePropertyTag('twitter:image', image || defaultImage);
    updatePropertyTag('twitter:url', url || defaultUrl);

    // Add structured data
    if (structuredData) {
      // Remove existing structured data
      const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
      existingScripts.forEach(script => {
        if (script.textContent.includes('"@type":"WebPage"')) {
          script.remove();
        }
      });

      // Add new structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      // Optionally clean up meta tags on unmount
      // This is optional as the component will update them on next render
    };
  }, [fullTitle, description, keywords, url, image, type, structuredData]);

  // This component doesn't render anything visible
  return null;
};

export default SEO; 