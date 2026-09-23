import React, { useMemo, useState } from 'react';
import Icon from '../common/Icon.jsx';
import { useCopy, formatNumber, useLang } from '../../i18n';
import analysisCopy from '../../i18n/copy/analysis.js';
import './analysisPanels.css';

const tone = (pct) => (pct >= 75 ? 'high' : pct >= 50 ? 'mid' : 'low');

const coverageOf = (row) => (row.total > 0 ? row.covered / row.total : 0);

// Untouched rows sort last under "weakest": never having started something is
// not the same as doing badly at it, and putting them first would bury the
// specialties the student is actually struggling with.
const SORTS = {
  weakest: (a, b) => (a.accuracy == null) - (b.accuracy == null) || (a.accuracy ?? 0) - (b.accuracy ?? 0),
  covered: (a, b) => coverageOf(a) - coverageOf(b),
  name: (a, b) => a.label.localeCompare(b.label),
};

/**
 * One row per specialty or per source, carrying accuracy (how many were right)
 * and coverage (how much of the bank has been seen) on one baseline.
 *
 * rows: [{ key, label, icon, accuracy (0-100 or null when never attempted),
 *          covered, total }]
 * onPractise: optional — when given, each row gets a practise button.
 */
const BreakdownTable = ({ rows, onPractise }) => {
  const t = useCopy(analysisCopy).report;
  const { lang } = useLang();
  const [sort, setSort] = useState('weakest');

  const sorted = useMemo(() => [...rows].sort(SORTS[sort]), [rows, sort]);

  if (!rows.length) return null;

  const fmt = (n) => formatNumber(n, lang);

  return (
    <>
      <div className="an-sort" role="group" aria-label={t.sortLabel}>
        {[
          ['weakest', t.sortWeakest],
          ['covered', t.sortLeastCovered],
          ['name', t.sortName],
        ].map(([k, label]) => (
          <button
            key={k}
            type="button"
            className={`an-sort-btn${sort === k ? ' is-on' : ''}`}
            aria-pressed={sort === k}
            onClick={() => setSort(k)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="ap-tbl">
        <div className="ap-tbl-head" aria-hidden="true">
          <span>{t.colName}</span>
          <span>{t.accuracy}</span>
          <span>{t.coverage}</span>
          <span />
        </div>

        {sorted.map((row) => {
          const pct = Math.round(coverageOf(row) * 100);
          return (
            <div className="ap-tbl-row" key={row.key}>
              <span className="ap-tbl-name">
                <span className="ap-tbl-icon" aria-hidden="true"><Icon name={row.icon || 'book'} size={15} /></span>
                <span>{row.label}</span>
              </span>

              {row.accuracy == null ? (
                <span className="ap-tbl-none">{t.untouched}</span>
              ) : (
                <span className={`ap-acc ap-tbl-acc tone-${tone(row.accuracy)}`} aria-label={`${t.accuracy} ${Math.round(row.accuracy)}%`}>
                  <bdi>{Math.round(row.accuracy)}%</bdi>
                </span>
              )}

              <span className="ap-tbl-cov" aria-label={`${t.coverage} ${pct}%`}>
                <span className="ap-tbl-bar"><i style={{ width: `${pct}%` }} /></span>
                <small><bdi>{t.covered(fmt(row.covered), fmt(row.total))}</bdi> · <bdi>{pct}%</bdi></small>
              </span>

              {onPractise && (
                <button
                  type="button"
                  className="ap-tbl-go"
                  aria-label={t.practiseOn(row.label)}
                  onClick={() => onPractise(row)}
                >
                  {t.practise}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default BreakdownTable;
