import test from 'node:test';
import assert from 'node:assert/strict';
import { noteFor, altFor, resolveImageUrl, usableImages, DEFAULT_NOTES, TABLE_NOTES } from './questionImages.js';

test('default notes by kind and language', () => {
  assert.equal(noteFor({ kind: 'illustration' }, 'ar'), DEFAULT_NOTES.ar);
  assert.equal(noteFor({ kind: 'open_licence' }, 'en'), DEFAULT_NOTES.en);
  assert.equal(noteFor({ kind: 'table' }, 'en'), 'Table rebuilt from the recalled values.');
  assert.equal(noteFor({ kind: 'table' }, 'ar'), TABLE_NOTES.ar);
  assert.equal(noteFor({ kind: 'original' }, 'en'), '');
});
test('stored note wins', () => {
  assert.equal(noteFor({ kind: 'table', note_en: ' Custom ' }, 'en'), 'Custom');
  assert.equal(noteFor({ kind: 'table', note_en: 'Custom' }, 'ar'), TABLE_NOTES.ar);
});
test('alt falls back across languages', () => {
  assert.equal(altFor({ alt_en: 'x' }, 'ar'), 'x');
  assert.equal(altFor({}, 'en'), '');
});
test('resolveImageUrl', () => {
  assert.equal(resolveImageUrl('/api/question-images/file/a.webp', 'https://h.com/'), 'https://h.com/api/question-images/file/a.webp');
  assert.equal(resolveImageUrl('https://c.org/a.png', 'https://h.com'), 'https://c.org/a.png');
  assert.equal(resolveImageUrl('', 'x'), '');
});
test('usableImages drops malformed entries and non-arrays', () => {
  assert.deepEqual(usableImages(undefined), []);
  const good = { kind: 'table', table: { header: ['a'], rows: [['1']] } };
  const pic = { kind: 'illustration', url: '/x.webp' };
  assert.deepEqual(usableImages([good, pic, { kind: 'table' }, { kind: 'illustration' }, null]), [good, pic]);
});
