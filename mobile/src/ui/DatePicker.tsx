import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useLang } from '@/i18n/LanguageContext';
import { colors, radius } from '@/theme';
import { Button } from './Controls';
import { Icon } from './Icon';
import { Dialog } from './Feedback';
import { Row } from './Layout';
import { T } from './Text';

/** YYYY-MM-DD from a local date. */
export const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** A local-midnight Date from YYYY-MM-DD, or null. */
export function fromISO(iso: string | null | undefined): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return toISO(d) === iso ? d : null;
}

/** The weeks of a month as rows of 7 cells (null = padding), Sunday first. */
export function monthGrid(year: number, month: number): (number | null)[][] {
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const LOCALE = { ar: 'ar-SA-u-ca-gregory-nu-latn', en: 'en-GB' } as const;

type Props = {
  visible: boolean;
  /** Currently chosen date (YYYY-MM-DD) or ''. */
  value: string;
  /** Earliest / latest selectable date (YYYY-MM-DD). */
  min: string;
  max?: string;
  title: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: (iso: string) => void;
  onClose: () => void;
};

/**
 * A calendar dialog. It avoids a native date-picker module: it behaves the same
 * on Android and in the web preview, uses the Gregorian calendar with Latin
 * digits like the rest of the app, and mirrors in Arabic.
 */
export function DatePickerDialog({ visible, value, min, max, title, confirmLabel, cancelLabel, onConfirm, onClose }: Props) {
  const { lang } = useLang();
  const minDate = fromISO(min) || new Date();
  const maxDate = max ? fromISO(max) : null;
  const start = fromISO(value) || minDate;
  const [cursor, setCursor] = useState({ y: start.getFullYear(), m: start.getMonth() });
  const [picked, setPicked] = useState(value);

  // Re-open on the chosen month each time the dialog is shown.
  useEffect(() => {
    if (visible) {
      const s = fromISO(value) || minDate;
      setCursor({ y: s.getFullYear(), m: s.getMonth() });
      setPicked(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const weeks = useMemo(() => monthGrid(cursor.y, cursor.m), [cursor]);
  const monthTitle = useMemo(
    () => new Intl.DateTimeFormat(LOCALE[lang], { month: 'long', year: 'numeric' }).format(new Date(cursor.y, cursor.m, 1)),
    [cursor, lang]
  );
  const weekdays = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(LOCALE[lang], { weekday: 'short' });
    // 2024-01-07 was a Sunday.
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, 7 + i)));
  }, [lang]);

  const shift = (delta: number) =>
    setCursor((c) => {
      const d = new Date(c.y, c.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  const disabledDay = (day: number) => {
    const d = new Date(cursor.y, cursor.m, day);
    d.setHours(0, 0, 0, 0);
    const lo = new Date(minDate);
    lo.setHours(0, 0, 0, 0);
    if (d < lo) return true;
    if (maxDate) {
      const hi = new Date(maxDate);
      hi.setHours(0, 0, 0, 0);
      if (d > hi) return true;
    }
    return false;
  };

  return (
    <Dialog visible={visible} onClose={onClose} scroll={false}>
      <T weight="bold" size={17}>
        {title}
      </T>
      <Row justify="space-between">
        <TouchableOpacity onPress={() => shift(-1)} hitSlop={10} accessibilityRole="button" accessibilityLabel="Previous month">
          <Icon name="chevron-left" size={22} color={colors.text} flip />
        </TouchableOpacity>
        <T weight="bold" size={15}>
          {monthTitle}
        </T>
        <TouchableOpacity onPress={() => shift(1)} hitSlop={10} accessibilityRole="button" accessibilityLabel="Next month">
          <Icon name="chevron-right" size={22} color={colors.text} flip />
        </TouchableOpacity>
      </Row>

      <View style={{ gap: 4 }}>
        <Row justify="space-between">
          {weekdays.map((w, i) => (
            <View key={i} style={{ width: `${100 / 7}%` }}>
              <T size={11} color={colors.textLight} align="center" weight="semibold">
                {w}
              </T>
            </View>
          ))}
        </Row>
        {weeks.map((week, wi) => (
          <Row key={wi} justify="space-between">
            {week.map((day, di) => {
              if (day == null) return <View key={di} style={{ width: `${100 / 7}%`, height: 40 }} />;
              const iso = toISO(new Date(cursor.y, cursor.m, day));
              const off = disabledDay(day);
              const on = picked === iso;
              return (
                <TouchableOpacity
                  key={di}
                  disabled={off}
                  onPress={() => setPicked(iso)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on, disabled: off }}
                  style={{ width: `${100 / 7}%`, height: 40, alignItems: 'center', justifyContent: 'center' }}
                >
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: radius.pill,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: on ? colors.primary : 'transparent',
                    }}
                  >
                    <T weight={on ? 'bold' : 'regular'} size={14} ltr align="center" color={on ? colors.white : off ? colors.border : colors.text}>
                      {day}
                    </T>
                  </View>
                </TouchableOpacity>
              );
            })}
          </Row>
        ))}
      </View>

      <Button label={confirmLabel} disabled={!picked} onPress={() => onConfirm(picked)} />
      <Button label={cancelLabel} variant="ghost" onPress={onClose} />
    </Dialog>
  );
}

