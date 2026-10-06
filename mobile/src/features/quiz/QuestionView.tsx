import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useCopy, useLang } from '@/i18n';
import quizCopy from '@/i18n/copy/quiz.js';
import { useAuth } from '@/lib/auth';
import { formatClock } from '@/lib/stats';
import { colors, radius } from '@/theme';
import { Button, Card, Icon, ProgressBar, Row, Screen, T } from '@/ui';
import { ExplanationPanel } from '@/features/common/ExplanationPanel';
import { OPTION_KEYS, Question } from './quizLogic';
import { ReportDialog } from './ReportDialog';

const timerColor = (seconds: number | null) => {
  if (!seconds) return colors.textMedium;
  if (seconds <= 60) return colors.error;
  if (seconds <= 300) return colors.warning;
  return colors.success;
};

type Props = {
  question: Question;
  number: number;
  total: number;
  selected: string | null;
  revealed: boolean;
  timeRemaining: number | null;
  timed: boolean;
  onSelect: (option: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onFinish: () => void;
  onExit: () => void;
};

/**
 * One question. The stem and the four options are exam material: they stay in
 * English and run left to right whatever the UI language is, while the chrome
 * around them follows the app language.
 */
export function QuestionView({
  question,
  number,
  total,
  selected,
  revealed,
  timeRemaining,
  timed,
  onSelect,
  onNext,
  onPrevious,
  onFinish,
  onExit,
}: Props) {
  const t = useCopy(quizCopy).quiz;
  const { isRTL } = useLang();
  const { user } = useAuth();
  const [showReport, setShowReport] = useState(false);
  const isLast = number === total;

  return (
    <Screen
      scroll
      padded={false}
      header={
        <View>
          <Row justify="space-between" style={{ paddingHorizontal: 14, paddingVertical: 10 }}>
            <TouchableOpacity
              onPress={onExit}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={t.back}
              style={{ width: 38, height: 38, borderRadius: radius.md, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="x" size={19} color={colors.text} />
            </TouchableOpacity>
            <T weight="extrabold" size={16} ltr>
              {number}/{total}
            </T>
            {timed ? (
              <Row gap={5} style={{ minWidth: 70, justifyContent: 'flex-end' }}>
                <Icon name="clock" size={15} color={timerColor(timeRemaining)} />
                <T weight="bold" size={15} ltr color={timerColor(timeRemaining)}>
                  {formatClock(timeRemaining ?? 0)}
                </T>
              </Row>
            ) : (
              <View style={{ minWidth: 70 }} />
            )}
          </Row>
          <View style={{ paddingHorizontal: 14, paddingBottom: 10 }}>
            <ProgressBar pct={(number / total) * 100} />
          </View>
        </View>
      }
      footer={
        <Row
          gap={10}
          style={{ padding: 12, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border }}
        >
          <View style={{ flex: 1 }}>
            <Button
              label={t.previous}
              variant="secondary"
              disabled={number === 1}
              onPress={onPrevious}
              icon={undefined}
            />
          </View>
          <View style={{ flex: 1.4 }}>
            <Button
              label={isLast ? t.finish : t.next}
              disabled={isLast && !selected}
              onPress={isLast ? onFinish : onNext}
            />
          </View>
        </Row>
      }
    >
      <View style={{ padding: 16, gap: 14 }}>
        <T weight="bold" size={13} color={colors.primary}>
          {t.questionLabel(number)}
        </T>
        <Card pad={16}>
          <T ltr size={17} lh={1.5}>
            {question.question_text || t.questionUnavailable}
          </T>
        </Card>

        <View style={{ gap: 10 }}>
          {OPTION_KEYS.map((key) => {
            const option = question[key] as string | null | undefined;
            const isSelected = selected === option;
            const isCorrect = revealed && !!option && option === question.correct_option;
            const isWrong = revealed && isSelected && !isCorrect;
            const border = isCorrect ? colors.success : isWrong ? colors.error : isSelected ? colors.primary : colors.border;
            const bg = isCorrect ? colors.successBg : isWrong ? colors.errorBg : isSelected ? colors.infoBg : colors.surface;
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.8}
                disabled={!option || revealed}
                onPress={() => option && onSelect(option)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected, disabled: !option || revealed }}
              >
                <Row
                  ltr
                  gap={10}
                  style={{ borderRadius: radius.lg, borderWidth: 2, borderColor: border, backgroundColor: bg, padding: 14, minHeight: 54 }}
                >
                  <T ltr size={15} style={{ flex: 1 }} weight={isSelected || isCorrect ? 'semibold' : 'regular'}>
                    {option || t.optionUnavailable}
                  </T>
                  {isCorrect ? <Icon name="check-circle" size={20} color={colors.success} /> : null}
                  {isWrong ? <Icon name="x-circle" size={20} color={colors.error} /> : null}
                </Row>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Study mode: the answer is already on screen, so the explanation opens with it. */}
        {revealed ? <ExplanationPanel explanation={question.explanation} defaultOpen /> : null}

        {user?.id && user.email ? (
          <TouchableOpacity onPress={() => setShowReport(true)} hitSlop={8} accessibilityRole="button" style={{ alignSelf: isRTL ? 'flex-end' : 'flex-start' }}>
            <Row gap={6}>
              <Icon name="flag" size={15} color={colors.textLight} />
              <T size={13} color={colors.textLight} weight="semibold">
                {t.report}
              </T>
            </Row>
          </TouchableOpacity>
        ) : null}
      </View>

      {showReport && user?.id && user.email ? (
        <ReportDialog question={question} userId={user.id} userEmail={String(user.email)} onClose={() => setShowReport(false)} />
      ) : null}
    </Screen>
  );
}
