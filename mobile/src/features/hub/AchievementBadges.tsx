import React from 'react';
import { View } from 'react-native';
import { api } from '@/lib/api';
import { useLoad } from '@/lib/useLoad';
import { colors, radius } from '@/theme';
import { Icon, Row, T } from '@/ui';

type Achievement = {
  id: number | string;
  achievement_type: string;
  achievement_name: string;
  achievement_description?: string;
};

const iconFor = (type: string) =>
  type === 'cardinality_completion' ? 'target' : type === 'perfect_score' ? 'star' : type === 'streak' ? 'flame' : 'trophy';

const STOP_WORDS = new Set(['the', 'of', 'from', 'and', 'or', 'in', 'on', 'at', 'to', 'for']);

/** Shortens "Master of surgery from GameBoy" to "surgery gameboy" for a badge. */
export function shortAchievementText(name: string): string {
  const words = String(name || '').toLowerCase().split(' ');
  if (words.includes('master') && words.includes('from')) {
    const typeIndex = words.indexOf('of') + 1;
    const fromIndex = words.indexOf('from');
    if (typeIndex > 0 && fromIndex > typeIndex) return `${words[typeIndex]} ${words[fromIndex + 1]}`;
  }
  return words.filter((w) => !STOP_WORDS.has(w)).slice(0, 3).join(' ').substring(0, 20);
}

/** Small badges for finished (type, source) categories. Renders nothing when there are none. */
export function AchievementBadges({ userId }: { userId: number }) {
  const { data } = useLoad<Achievement[]>(
    async (signal) => {
      const res = await api.get(`/api/user-achievements/${userId}`, { signal });
      return res?.achievements || [];
    },
    [userId]
  );
  if (!data || data.length === 0) return null;
  return (
    <Row wrap gap={8}>
      {data.map((a) => (
        <Row
          key={a.id}
          gap={6}
          accessibilityLabel={a.achievement_description}
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1.5,
            borderColor: colors.border,
            borderRadius: radius.pill,
            paddingHorizontal: 10,
            paddingVertical: 6,
          }}
        >
          <View>
            <Icon name={iconFor(a.achievement_type)} size={16} color={colors.warning} />
          </View>
          <T size={12} weight="semibold" ltr>
            {shortAchievementText(a.achievement_name)}
          </T>
        </Row>
      ))}
    </Row>
  );
}
