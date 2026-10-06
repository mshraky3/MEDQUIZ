import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useCopy } from '@/i18n';
import summariesCopy from '@/i18n/copy/summaries.js';
import { colors, radius } from '@/theme';
import { Card, Icon, Row, Span, T } from '@/ui';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export type LessonQuestion = {
  q: string;
  options: string[];
  /** 0-based index of the correct option. */
  answer: number;
  explanation?: string;
  source?: string;
};

/**
 * Interactive single-best-answer MCQ from a lesson. Picking an option reveals
 * the answer (green), marks a wrong pick (red) and shows the explanation. Local
 * state only: nothing is sent anywhere. `onAnswer(isCorrect)` fires once, on the
 * first pick, so a checkpoint can score a small set of them.
 */
export function QuestionCard({
  question,
  number,
  onAnswer,
}: {
  question: LessonQuestion;
  number: number;
  onAnswer?: (isCorrect: boolean) => void;
}) {
  const t = useCopy(summariesCopy).question;
  const [selected, setSelected] = useState<number | null>(null);
  const revealed = selected !== null;
  const { q, options, answer, explanation, source } = question;

  const choose = (i: number) => {
    if (revealed) return;
    setSelected(i);
    onAnswer?.(i === answer);
  };

  return (
    <Card pad={14} style={{ gap: 10 }}>
      <T ltr size={15} weight="semibold">
        <Span ltr size={15} weight="extrabold" color={colors.primary}>
          {`Q${number}  `}
        </Span>
        {q}
      </T>
      <View style={{ gap: 8 }}>
        {options.map((opt, i) => {
          const correct = revealed && i === answer;
          const wrong = revealed && i === selected && i !== answer;
          const border = correct ? colors.success : wrong ? colors.error : colors.border;
          const bg = correct ? colors.successBg : wrong ? colors.errorBg : colors.surface;
          return (
            <TouchableOpacity
              key={i}
              activeOpacity={0.8}
              disabled={revealed}
              onPress={() => choose(i)}
              accessibilityRole="radio"
              accessibilityState={{ selected: i === selected, disabled: revealed }}
            >
              <Row ltr gap={10} style={{ borderRadius: radius.md, borderWidth: 2, borderColor: border, backgroundColor: bg, padding: 12 }}>
                <View
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: colors.surfaceTint,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <T ltr size={12} weight="bold" color={colors.primary}>
                    {LETTERS[i]}
                  </T>
                </View>
                <T ltr size={14} style={{ flex: 1 }}>
                  {opt}
                </T>
                {correct ? <Icon name="check" size={16} color={colors.success} strokeWidth={3} /> : null}
                {wrong ? <Icon name="x" size={16} color={colors.error} strokeWidth={3} /> : null}
              </Row>
            </TouchableOpacity>
          );
        })}
      </View>
      {revealed ? (
        <View style={{ gap: 4 }}>
          <Row gap={6}>
            <Icon name={selected === answer ? 'check' : 'x'} size={15} color={selected === answer ? colors.success : colors.error} strokeWidth={3} />
            <T weight="bold" size={14} color={selected === answer ? colors.success : colors.error}>
              {selected === answer ? t.correct : t.incorrect}
            </T>
          </Row>
          {explanation ? (
            <T ltr size={13} color={colors.textMedium}>
              {explanation}
            </T>
          ) : null}
          {source && source !== 'general' ? (
            <T ltr size={11} color={colors.textLight}>
              {source}
            </T>
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}
