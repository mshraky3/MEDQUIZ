/**
 * Pure helpers for the clarification pictures and rebuilt tables the server
 * attaches to some questions (`images` on a question). Ported from the website's
 * `utils/questionImages.js` so both show the same note under the same picture.
 */
export type QuestionImage = {
  kind?: string;
  url?: string;
  table?: { header: unknown[]; rows: unknown[] };
  alt_en?: string | null;
  alt_ar?: string | null;
  note_en?: string | null;
  note_ar?: string | null;
  attribution?: string | null;
};

export const DEFAULT_NOTES = {
  ar: 'صورة توضيحية: الصورة الأصلية للسؤال لم يتذكرها الطلاب أو غير موجودة في المصادر، وهذه صورة مشابهة للتوضيح فقط.',
  en: 'Clarification image: the original image was not recalled by the students or is not in the sources. This is an illustration for guidance only.',
};
export const TABLE_NOTES = {
  ar: 'جدول أُعيد بناؤه من القيم المتذكَّرة.',
  en: 'Table rebuilt from the recalled values.',
};

export const IMAGE_UI = {
  ar: { enlarge: 'تكبير الصورة', close: 'إغلاق', loading: 'جارٍ تحميل الصورة…', failed: 'تعذّر تحميل الصورة. تحقق من الاتصال.', retry: 'إعادة المحاولة' },
  en: { enlarge: 'Enlarge image', close: 'Close', loading: 'Loading image…', failed: 'The image could not be loaded. Check your connection.', retry: 'Try again' },
};

const langKey = (lang: string): 'ar' | 'en' => (lang === 'ar' ? 'ar' : 'en');

/** Note under the picture: the stored note in the UI language, else the default for its kind. */
export function noteFor(img: QuestionImage | null | undefined, lang: string): string {
  const l = langKey(lang);
  const own = img?.[`note_${l}` as 'note_ar' | 'note_en'];
  if (own && String(own).trim()) return String(own).trim();
  if (img?.kind === 'original') return '';
  return (img?.kind === 'table' ? TABLE_NOTES : DEFAULT_NOTES)[l];
}

export function altFor(img: QuestionImage | null | undefined, lang: string): string {
  const l = langKey(lang);
  return img?.[`alt_${l}` as 'alt_ar' | 'alt_en'] || img?.alt_en || img?.alt_ar || '';
}

/** The server returns a path like /api/question-images/file/x.webp; make it absolute against the API base. */
export function resolveImageUrl(url: string | undefined, base: string): string {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${String(base || '').replace(/\/+$/, '')}${url.startsWith('/') ? '' : '/'}${url}`;
}

/** Only render what is well formed; a malformed entry is dropped, never throws. */
export function usableImages(images: unknown): QuestionImage[] {
  if (!Array.isArray(images)) return [];
  return images.filter(
    (i): i is QuestionImage =>
      !!i &&
      ((i.kind === 'table' && i.table && Array.isArray(i.table.header) && Array.isArray(i.table.rows)) ||
        (i.kind !== 'table' && typeof i.url === 'string' && i.url.length > 0)),
  );
}

/** Height for a picture of the given pixel size at `width`, clamped so a tall scan cannot push the options off screen. */
export function pictureHeight(width: number, natural: { width: number; height: number } | null, max = 320): number {
  if (!natural || !natural.width || !natural.height) return Math.min(240, max);
  return Math.max(120, Math.min(max, Math.round((width * natural.height) / natural.width)));
}
