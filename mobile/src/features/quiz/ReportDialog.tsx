import React, { useState } from 'react';
import { View } from 'react-native';
import { useCopy } from '@/i18n';
import quizCopy from '@/i18n/copy/quiz.js';
import { api } from '@/lib/api';
import { colors, radius } from '@/theme';
import { Button, Dialog, Icon, Input, Row, T } from '@/ui';
import type { Question } from './quizLogic';

/** "Report an error in this question": goes to the owner's review queue. */
export function ReportDialog({
  question,
  userId,
  userEmail,
  onClose,
}: {
  question: Pick<Question, 'id' | 'question_text'>;
  userId: number;
  userEmail: string;
  onClose: () => void;
}) {
  const t = useCopy(quizCopy).report;
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submit = async () => {
    if (status === 'loading' || status === 'success') return;
    setStatus('loading');
    try {
      await api.post('/api/question-reports', {
        question_id: question.id,
        user_id: userId,
        user_email: userEmail,
        reason: reason.trim() || null,
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <Dialog visible onClose={onClose}>
      <Row gap={8}>
        <Icon name="flag" size={17} color={colors.error} />
        <T weight="bold" size={17} style={{ flex: 1 }}>
          {t.title}
        </T>
      </Row>
      {status === 'success' ? (
        <>
          <Row gap={8} align="flex-start">
            <Icon name="check-circle" size={18} color={colors.success} />
            <T style={{ flex: 1 }}>{t.success}</T>
          </Row>
          <Button label={t.close} onPress={onClose} />
        </>
      ) : (
        <>
          {/* The question is exam material: shown as stored, left to right. */}
          <View style={{ backgroundColor: colors.surface2, borderRadius: radius.md, padding: 12 }}>
            <T ltr size={13} color={colors.textMedium} numberOfLines={6}>
              {question.question_text}
            </T>
          </View>
          <Input
            label={`${t.label} ${t.optional}`}
            placeholder={t.placeholder}
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={3}
            maxLength={500}
            inputStyle={{ minHeight: 76, textAlignVertical: 'top' }}
          />
          {status === 'error' ? (
            <T size={13} color={colors.error}>
              {t.error}
            </T>
          ) : null}
          <Row gap={10}>
            <View style={{ flex: 1 }}>
              <Button label={t.cancel} variant="secondary" onPress={onClose} />
            </View>
            <View style={{ flex: 1 }}>
              <Button label={status === 'loading' ? t.submitting : t.submit} onPress={submit} loading={status === 'loading'} />
            </View>
          </Row>
        </>
      )}
    </Dialog>
  );
}
