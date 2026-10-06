import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useCopy, useLang } from '@/i18n';
import analysisCopy from '@/i18n/copy/analysis.js';
import { formatNumber } from '@/i18n';
import { Tone } from '@/lib/stats';
import { colors, radius, toneBg, toneColor } from '@/theme';
import { Button, Card, Icon, ProgressBar, Row, T } from '@/ui';
import { ExplanationPanel } from '@/features/common/ExplanationPanel';

/** A small labelled chip used in review card headers. */
export function Badge2({ icon, label }: { icon: string; label: string }) {
  return (
    <Row gap={5} style={{ backgroundColor: colors.surface2, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3 }}>
      <Icon name={icon} size={12} color={colors.textMedium} />
      <T size={11} weight="semibold" color={colors.textMedium}>
        {label}
      </T>
    </Row>
  );
}

export function AccuracyPill({ pct, tone }: { pct: number; tone: Tone }) {
  return (
    <View style={{ backgroundColor: toneBg[tone], borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
      <T weight="extrabold" size={13} color={toneColor[tone]} ltr>
        {Math.round(pct)}%
      </T>
    </View>
  );
}

type ReviewProps = {
  typeLabel?: string;
  sourceLabel?: string;
  dateLabel?: string;
  result?: { correct: boolean; label: string };
  question: string;
  yourAnswer: string;
  yourAnswerLabel: string;
  correctAnswer?: string | null;
  correctAnswerLabel: string;
  /** Whether the student's answer was right (colours the answer block). */
  isCorrect: boolean;
  explanation?: string | null;
  questionId?: number | null;
};

/**
 * The one review card in the product: a question the student has answered, what
 * they picked, what was right, and the explanation. Used by the wrong-answer
 * list, the last-quiz review and the session / mock-exam histories.
 */
export function ReviewCard(p: ReviewProps) {
  return (
    <Card pad={14} style={{ gap: 10 }}>
      <Row gap={6} wrap>
        {p.typeLabel ? <Badge2 icon="book" label={p.typeLabel} /> : null}
        {p.sourceLabel ? <Badge2 icon="book-open" label={p.sourceLabel} /> : null}
        {p.dateLabel ? <Badge2 icon="calendar" label={p.dateLabel} /> : null}
        {p.result ? (
          <Row gap={4}>
            <Icon name={p.result.correct ? 'check-circle' : 'x-circle'} size={14} color={p.result.correct ? colors.success : colors.error} />
            <T weight="bold" size={12} color={p.result.correct ? colors.success : colors.error}>
              {p.result.label}
            </T>
          </Row>
        ) : null}
      </Row>
      <T ltr size={15}>
        {p.question}
      </T>
      <View style={{ gap: 6 }}>
        <View style={{ backgroundColor: p.isCorrect ? colors.successBg : colors.errorBg, borderRadius: radius.md, padding: 10, gap: 2 }}>
          <T size={11} weight="bold" color={p.isCorrect ? colors.success : colors.error}>
            {p.yourAnswerLabel}
          </T>
          <T ltr size={14}>
            {p.yourAnswer || '—'}
          </T>
        </View>
        {!p.isCorrect ? (
          <View style={{ backgroundColor: colors.successBg, borderRadius: radius.md, padding: 10, gap: 2 }}>
            <T size={11} weight="bold" color={colors.success}>
              {p.correctAnswerLabel}
            </T>
            <T ltr size={14}>
              {p.correctAnswer || '—'}
            </T>
          </View>
        ) : null}
      </View>
      <ExplanationPanel explanation={p.explanation} questionId={p.questionId} />
    </Card>
  );
}

export function Pager({
  page,
  totalPages,
  onPage,
  labels,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
  labels: { previous: string; next: string; pageOf: (p: number, total: number) => string };
}) {
  if (totalPages <= 1) return null;
  return (
    <Row justify="space-between" gap={10}>
      <Button label={labels.previous} variant="secondary" size="sm" full={false} disabled={page <= 1} onPress={() => onPage(page - 1)} />
      <T size={13} color={colors.textLight}>
        {labels.pageOf(page, totalPages)}
      </T>
      <Button label={labels.next} variant="secondary" size="sm" full={false} disabled={page >= totalPages} onPress={() => onPage(page + 1)} />
    </Row>
  );
}

export type BreakdownRow = {
  key: string;
  label: string;
  icon?: string;
  /** 0-100, or null when never attempted. */
  accuracy: number | null;
  covered: number;
  total: number;
};

const coverageOf = (row: BreakdownRow) => (row.total > 0 ? row.covered / row.total : 0);

// Untouched rows sort last under "weakest": never having started something is
// not the same as doing badly at it, and putting them first would bury the
// specialties the student is actually struggling with.
export const BREAKDOWN_SORTS = {
  weakest: (a: BreakdownRow, b: BreakdownRow) =>
    Number(a.accuracy == null) - Number(b.accuracy == null) || (a.accuracy ?? 0) - (b.accuracy ?? 0),
  covered: (a: BreakdownRow, b: BreakdownRow) => coverageOf(a) - coverageOf(b),
  name: (a: BreakdownRow, b: BreakdownRow) => a.label.localeCompare(b.label),
};

/**
 * One row per specialty (or source), carrying accuracy (how many were right) and
 * coverage (how much of the bank has been seen) on one baseline.
 */
export function BreakdownTable({ rows, onPractise }: { rows: BreakdownRow[]; onPractise?: (row: BreakdownRow) => void }) {
  const t = useCopy(analysisCopy).report;
  const { lang } = useLang();
  const [sort, setSort] = React.useState<keyof typeof BREAKDOWN_SORTS>('weakest');
  const sorted = React.useMemo(() => [...rows].sort(BREAKDOWN_SORTS[sort]), [rows, sort]);
  const fmt = (n: number) => formatNumber(n, lang);
  if (!rows.length) return null;

  const tone = (pct: number): Tone => (pct >= 75 ? 'high' : pct >= 50 ? 'mid' : 'low');

  return (
    <View style={{ gap: 10 }}>
      <Row wrap gap={8} accessibilityLabel={t.sortLabel}>
        {(
          [
            ['weakest', t.sortWeakest],
            ['covered', t.sortLeastCovered],
            ['name', t.sortName],
          ] as const
        ).map(([k, label]) => {
          const on = sort === k;
          return (
            <TouchableOpacity
              key={k}
              onPress={() => setSort(k)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
                borderWidth: 1.5,
                borderColor: on ? colors.primary : colors.border,
                backgroundColor: on ? colors.infoBg : colors.surface,
              }}
            >
              <T size={12} weight="semibold" color={on ? colors.primary : colors.textMedium}>
                {label}
              </T>
            </TouchableOpacity>
          );
        })}
      </Row>

      {sorted.map((row) => {
        const pct = Math.round(coverageOf(row) * 100);
        return (
          <Card key={row.key} pad={14} style={{ gap: 10 }}>
            <Row gap={10}>
              <View style={{ width: 34, height: 34, borderRadius: radius.md, backgroundColor: colors.surfaceTint, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={row.icon || 'book'} size={17} color={colors.primary} />
              </View>
              <T weight="bold" size={15} style={{ flex: 1 }}>
                {row.label}
              </T>
              {row.accuracy == null ? (
                <T size={12} color={colors.textLight}>
                  {t.untouched}
                </T>
              ) : (
                <AccuracyPill pct={row.accuracy} tone={tone(row.accuracy)} />
              )}
            </Row>
            <View style={{ gap: 4 }}>
              <ProgressBar pct={pct} />
              <Row justify="space-between">
                <T size={12} color={colors.textLight} ltr>
                  {t.covered(fmt(row.covered), fmt(row.total))}
                </T>
                <T size={12} color={colors.textLight} ltr>
                  {pct}% {t.coverage}
                </T>
              </Row>
            </View>
            {onPractise ? <Button label={t.practise} variant="secondary" size="sm" onPress={() => onPractise(row)} accessibilityLabel={t.practiseOn(row.label)} /> : null}
          </Card>
        );
      })}
    </View>
  );
}
