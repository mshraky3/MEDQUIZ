import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/i18n';
import { colors } from '@/theme';
import { Icon, Row, T } from '@/ui';

const TAB_ICONS: Record<string, string> = {
  index: 'home',
  summaries: 'book-open',
  analysis: 'bar-chart',
  review: 'x-circle',
  more: 'menu',
};

/** Bottom navigation. Laid out by the app (not Android) so it mirrors in Arabic. */
function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const app = useApp();
  const labels: Record<string, string> = {
    index: app.tabs.home,
    summaries: app.tabs.summaries,
    analysis: app.tabs.analysis,
    review: app.tabs.review,
    more: app.tabs.more,
  };
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: Math.max(insets.bottom, 6),
        paddingTop: 6,
      }}
    >
      <Row justify="space-around" align="flex-end">
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const color = focused ? colors.primary : colors.textLight;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
          };
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={labels[route.name]}
              onPress={onPress}
              activeOpacity={0.7}
              style={{ flex: 1, alignItems: 'center', gap: 2, paddingVertical: 4 }}
            >
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 4,
                  borderRadius: 16,
                  backgroundColor: focused ? colors.infoBg : 'transparent',
                }}
              >
                <Icon name={TAB_ICONS[route.name] || 'circle'} size={22} color={color} strokeWidth={focused ? 2.4 : 2} />
              </View>
              <T weight={focused ? 'bold' : 'medium'} size={11} color={color} align="center" numberOfLines={1}>
                {labels[route.name]}
              </T>
            </TouchableOpacity>
          );
        })}
      </Row>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="summaries" />
      <Tabs.Screen name="analysis" />
      <Tabs.Screen name="review" />
      <Tabs.Screen name="more" />
    </Tabs>
  );
}
