import React, { useState, useEffect } from 'react';
import Globals from '../../global';
import { useLang } from '../../i18n';
import { noteFor, altFor, resolveImageUrl, usableImages } from '../../utils/questionImages';
import './QuestionImages.css';

// Clarification picture or rebuilt table shown above the options, with a small note.
// The note follows the site language; the table cells are exam material and stay as stored.
const UI = {
  ar: { enlarge: 'تكبير الصورة', close: 'إغلاق', failed: 'تعذّر تحميل الصورة.' },
  en: { enlarge: 'Enlarge image', close: 'Close', failed: 'The image could not be loaded.' },
};

function Picture({ img, lang }) {
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const ui = UI[lang === 'ar' ? 'ar' : 'en'];
  const src = resolveImageUrl(img.url, Globals.URL);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (failed) return <p className="qimg-failed">{ui.failed}</p>;
  return (
    <>
      <button type="button" className="qimg-open" onClick={() => setOpen(true)} aria-label={ui.enlarge}>
        <img className="qimg-pic" src={src} alt={altFor(img, lang)} loading="lazy" decoding="async"
          onError={() => setFailed(true)} />
      </button>
      {open && (
        <div className="qimg-lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <button type="button" className="qimg-close" onClick={() => setOpen(false)} aria-label={ui.close}>×</button>
          <img className="qimg-big" src={src} alt={altFor(img, lang)} />
        </div>
      )}
    </>
  );
}

function RebuiltTable({ table }) {
  return (
    <div className="qimg-table-wrap">
      <table className="qimg-table">
        <thead><tr>{table.header.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr></thead>
        <tbody>
          {table.rows.map((r, ri) => (
            <tr key={ri}>{(Array.isArray(r) ? r : [r]).map((c, ci) => <td key={ci}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function QuestionImages({ images }) {
  const { lang } = useLang();
  const list = usableImages(images);
  if (list.length === 0) return null;
  return (
    <div className="qimg-block">
      {list.map((img, i) => {
        const note = noteFor(img, lang);
        return (
          <figure className="qimg-figure" key={img.url || `t${i}`}>
            {img.kind === 'table' ? <RebuiltTable table={img.table} /> : <Picture img={img} lang={lang} />}
            {note && <figcaption className="qimg-note">{note}</figcaption>}
            {img.attribution && <figcaption className="qimg-note qimg-credit">{img.attribution}</figcaption>}
          </figure>
        );
      })}
    </div>
  );
}
