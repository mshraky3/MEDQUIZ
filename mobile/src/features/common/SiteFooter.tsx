import React from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import { router, Href } from 'expo-router';
import { SUPPORT_EMAIL, TELEGRAM_CHANNEL_URL } from '@/config';
import { useCommon } from '@/i18n';
import { colors } from '@/theme';
import { Divider, Row, T } from '@/ui';

type FooterLink = { label: string; to?: Href; url?: string };

/** The site footer: information and legal links, contact, disclaimer. */
export function SiteFooter() {
  const t = useCommon();
  const f = t.footer;

  const groups: { title: string; links: FooterLink[] }[] = [
    {
      title: f.platform,
      links: [
        { label: f.groupPlans, to: '/groups' },
        { label: f.successStories, to: '/success-stories' },
        { label: f.freeQuestions, to: '/questions' },
        { label: f.collections, to: '/past-papers' },
        { label: t.nav.guides, to: '/guides' },
      ],
    },
    {
      title: f.information,
      links: [
        { label: t.nav.about, to: '/about' },
        { label: t.nav.faq, to: '/faq' },
        { label: f.suggestions, to: '/suggestions' },
        { label: t.nav.contact, to: '/contact' },
      ],
    },
    {
      title: f.legal,
      links: [
        { label: f.terms, to: '/terms' },
        { label: f.refund, to: '/refund-policy' },
        { label: f.privacy, to: '/privacy' },
      ],
    },
    {
      title: f.contactHeading,
      links: [
        { label: SUPPORT_EMAIL, url: `mailto:${SUPPORT_EMAIL}` },
        { label: f.telegram, url: TELEGRAM_CHANNEL_URL },
      ],
    },
  ];

  const open = (link: FooterLink) => {
    if (link.to) router.push(link.to);
    else if (link.url) Linking.openURL(link.url).catch(() => {});
  };

  return (
    <View style={{ gap: 16, paddingVertical: 8 }}>
      <Divider />
      <T weight="extrabold" size={22} color={colors.primary} ltr>
        SQB
      </T>
      <T size={13} color={colors.textMedium}>
        {f.tagline}
      </T>
      <View style={{ gap: 16 }}>
        {groups.map((g) => (
          <View key={g.title} style={{ gap: 6 }}>
            <T weight="bold" size={13} color={colors.text}>
              {g.title}
            </T>
            <Row wrap gap={14}>
              {g.links.map((l) => (
                <TouchableOpacity key={l.label} onPress={() => open(l)} hitSlop={6} accessibilityRole="link">
                  <T size={13} color={colors.primary} ltr={l.label === SUPPORT_EMAIL}>
                    {l.label}
                  </T>
                </TouchableOpacity>
              ))}
            </Row>
          </View>
        ))}
      </View>
      <Divider />
      <T size={12} color={colors.textLight}>
        {f.rights(new Date().getFullYear())}
      </T>
      <T size={12} color={colors.textLight}>
        {f.legalEntity}
      </T>
      <T size={12} color={colors.textLight}>
        {f.disclaimer}
      </T>
    </View>
  );
}
