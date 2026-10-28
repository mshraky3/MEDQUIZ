import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useApp, useLang } from '@/i18n';
import { colors, radius } from '@/theme';
import { Card, Row, T } from '@/ui';
import { paletteCell } from './quizLogic';

/**
 * The question palette: every question as a numbered tile, so a tablet can jump around a
 * quiz or exam. Shows answered / not answered only, never right or wrong (exam mode).
 */
export function QuestionPalette({
  total,
  current,
  answers,
  onGo,
}: {
  total: number;
  current: number;
  answers: Record<number, string>;
  onGo: (index: number) => void;
}) {
  const app = useApp().palette;
  const { isRTL } = useLang();
  const answered = Object.keys(answers).length;
  return (
    <View style={{ width: 300, backgroundColor: colors.surface, borderColor: colors.border, borderLeftWidth: isRTL ? 0 : 1, borderRightWidth: isRTL ? 1 : 0 }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <T weight="extrabold" size={15}>
          {app.title}
        </T>
        <T size={12} color={colors.textMedium}>
          {app.progress(answered, total)}
        </T>
        <Row wrap gap={8} ltr>
          {Array.from({ length: total }, (_, i) => {
            const state = paletteCell(i, current, answers);
            return (
              <TouchableOpacity
                key={i}
                onPress={() => onGo(i)}
                accessibilityRole="button"
                accessibilityLabel={app.goTo(i + 1)}
                accessibilityState={{ selected: state === 'current' }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: radius.md,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: state === 'current' ? colors.primary : state === 'answered' ? colors.primary : colors.border,
                  backgroundColor: state === 'current' ? colors.primary : state === 'answered' ? colors.infoBg : colors.surface,
                }}
              >
                <T ltr weight="bold" size={13} color={state === 'current' ? colors.white : state === 'answered' ? colors.primary : colors.textMedium}>
                  {i + 1}
                </T>
              </TouchableOpacity>
            );
          })}
        </Row>
        <Card flat pad={10} style={{ gap: 6 }}>
          <T size={11} color={colors.textMedium}>
            {app.legend}
          </T>
        </Card>
      </ScrollView>
    </View>
  );
}
