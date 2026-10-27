// Pure helpers for the clarification image / rebuilt table shown above a question's options.
export const DEFAULT_NOTES = {
  ar: 'صورة توضيحية: الصورة الأصلية للسؤال لم يتذكرها الطلاب أو غير موجودة في المصادر، وهذه صورة مشابهة للتوضيح فقط.',
  en: 'Clarification image: the original image was not recalled by the students or is not in the sources. This is an illustration for guidance only.',
};
export const TABLE_NOTES = {
  ar: 'جدول أُعيد بناؤه من القيم المتذكَّرة.',
  en: 'Table rebuilt from the recalled values.',
};

/** Note under the picture: the stored note in the UI language, else the default for its kind. */
export function noteFor(img, lang) {
  const l = lang === 'ar' ? 'ar' : 'en';
  const own = img?.[`note_${l}`];
  if (own && String(own).trim()) return String(own).trim();
  if (img?.kind === 'original') return '';
  return (img?.kind === 'table' ? TABLE_NOTES : DEFAULT_NOTES)[l];
}

export function altFor(img, lang) {
  const l = lang === 'ar' ? 'ar' : 'en';
  return img?.[`alt_${l}`] || img?.alt_en || img?.alt_ar || '';
}

/** The server returns a path like /api/question-images/file/x.webp; make it absolute against the API base. */
export function resolveImageUrl(url, base) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${String(base || '').replace(/\/+$/, '')}${url.startsWith('/') ? '' : '/'}${url}`;
}

/** Only render what is well formed; a malformed entry is dropped, never throws. */
export function usableImages(images) {
  if (!Array.isArray(images)) return [];
  return images.filter((i) => i && (
    (i.kind === 'table' && i.table && Array.isArray(i.table.header) && Array.isArray(i.table.rows))
    || (i.kind !== 'table' && typeof i.url === 'string' && i.url)
  ));
}
