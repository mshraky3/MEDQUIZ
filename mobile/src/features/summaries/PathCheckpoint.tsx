import React, { useState } from 'react';
import { View } from 'react-native';
import { useCopy } from '@/i18n';
import summariesCopy from '@/i18n/copy/summaries.js';
import { colors } from '@/theme';
import { Button, Card, Icon, Row, T } from '@/ui';
import { LessonQuestion, QuestionCard } from './QuestionCard';

type Milestone = {
  id: string;
  title: string;
  steps: unknown[];
  checkpoint: { prompt: string; questions: (LessonQuestion & { fromId: string; fromTitle: string })[] };
};

/**
 * The checkpoint that closes a milestone: a recap, two or three self-check
 * questions pulled from the milestone's own topics, and a "ready to continue"
 * prompt. The prompt is not a lock: nothing is withheld whether or not it is
 * passed, and the next milestone and every other step stay open.
 */
export function PathCheckpoint({
  milestone,
  nextMilestone,
  passed,
  doneCount,
  onPass,
  onRedo,
}: {
  milestone: Milestone;
  nextMilestone: { title: string } | null;
  passed: boolean;
  doneCount: number;
  onPass: () => void;
  onRedo: () => void;
}) {
  const t = useCopy(summariesCopy).checkpoint;
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = milestone.checkpoint.questions;
  const answered = Object.keys(answers).length;
  const correct = Object.values(answers).filter(Boolean).length;
  const total = milestone.steps.length;
  const allRead = doneCount === total;

  return (
    <Card style={{ gap: 12, borderColor: passed ? colors.success : colors.border }}>
      <View style={{ gap: 4 }}>
        <Row gap={6}>
          <Icon name={passed ? 'check-circle' : 'help-circle'} size={14} color={passed ? colors.success : colors.primary} />
          <T weight="bold" size={12} color={passed ? colors.success : colors.primary}>
            {passed ? t.passed : t.label}
          </T>
        </Row>
        <T weight="extrabold" size={16} ltr={false}>
          {passed ? t.titlePassed(milestone.title) : t.titleOpen(milestone.title)}
        </T>
        <T size={13} color={colors.textMedium}>
          {t.recapBefore} <T size={13} weight="bold" ltr>{`${doneCount} ${t.recapOf} ${total}`}</T> {t.recapAfter}
          {allRead ? t.allRead : t.notAllRead}
        </T>
      </View>

      {questions.length > 0 ? (
        <View style={{ gap: 12 }}>
          <T size={13} color={colors.textMedium} ltr>
            {milestone.checkpoint.prompt}
          </T>
          {questions.map((qq, i) => (
            <View key={`${qq.fromId}-${i}`} style={{ gap: 6 }}>
              <T size={12} color={colors.textLight}>
                {t.fromStep} <T size={12} color={colors.textLight} ltr>{qq.fromTitle}</T>
              </T>
              <QuestionCard question={qq} number={i + 1} onAnswer={(ok) => setAnswers((prev) => ({ ...prev, [i]: ok }))} />
            </View>
          ))}
        </View>
      ) : null}

      <Row justify="space-between" gap={10} wrap>
        <Row gap={6}>
          {answered > 0 ? <Icon name="target" size={13} color={colors.primary} /> : null}
          <T size={13} color={colors.textLight}>
            {answered === 0 ? t.notAttempted : t.score(correct, answered)}
          </T>
        </Row>
        {passed ? (
          <Button
            label={t.redo}
            icon="refresh"
            variant="secondary"
            size="sm"
            full={false}
            onPress={() => {
              setAnswers({});
              onRedo();
            }}
          />
        ) : (
          <Button label={nextMilestone ? t.readyNext(nextMilestone.title) : t.readyFinish} size="sm" full={false} onPress={onPass} />
        )}
      </Row>
    </Card>
  );
}
