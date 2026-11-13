import { describe, expect, it } from 'vitest';
import { altFor, noteFor, pictureHeight, resolveImageUrl, usableImages, DEFAULT_NOTES, TABLE_NOTES } from '@/lib/questionImages';

describe('questionImages helpers', () => {
  it('makes server paths absolute and leaves full URLs alone', () => {
    expect(resolveImageUrl('/api/question-images/file/a.webp', 'https://h.com/')).toBe('https://h.com/api/question-images/file/a.webp');
    expect(resolveImageUrl('api/x.png', 'https://h.com')).toBe('https://h.com/api/x.png');
    expect(resolveImageUrl('https://cdn.x/a.png', 'https://h.com')).toBe('https://cdn.x/a.png');
    expect(resolveImageUrl(undefined, 'https://h.com')).toBe('');
  });

  it('drops malformed entries and non-arrays without throwing', () => {
    expect(usableImages(undefined)).toEqual([]);
    expect(usableImages('x')).toEqual([]);
    const good = { kind: 'illustration', url: '/a.webp' };
    const table = { kind: 'table', table: { header: ['a'], rows: [['1']] } };
    expect(usableImages([null, {}, { kind: 'table' }, { kind: 'illustration' }, good, table])).toEqual([good, table]);
  });

  it('picks the note in the UI language, falling back to the default for the kind', () => {
    expect(noteFor({ kind: 'illustration', note_ar: ' مرحبا ' }, 'ar')).toBe('مرحبا');
    expect(noteFor({ kind: 'illustration' }, 'en')).toBe(DEFAULT_NOTES.en);
    expect(noteFor({ kind: 'table' }, 'ar')).toBe(TABLE_NOTES.ar);
    expect(noteFor({ kind: 'original' }, 'en')).toBe('');
  });

  it('prefers the alt text of the UI language', () => {
    expect(altFor({ alt_en: 'ECG', alt_ar: 'تخطيط' }, 'ar')).toBe('تخطيط');
    expect(altFor({ alt_en: 'ECG' }, 'ar')).toBe('ECG');
    expect(altFor({}, 'en')).toBe('');
  });

  it('clamps the picture height', () => {
    expect(pictureHeight(300, null)).toBe(240);
    expect(pictureHeight(300, { width: 100, height: 100 })).toBe(300);
    expect(pictureHeight(300, { width: 100, height: 400 })).toBe(320);
    expect(pictureHeight(300, { width: 400, height: 100 })).toBe(120);
  });
});
