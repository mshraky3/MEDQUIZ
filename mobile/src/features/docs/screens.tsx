import React, { useState } from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import { Href, router, useLocalSearchParams } from 'expo-router';
import { SUPPORT_EMAIL } from '@/config';
import { useCommon, useCopy, useLang } from '@/i18n';
import faqCopy from '@/i18n/copy/faq.js';
import guidesCopy from '@/i18n/copy/guides.js';
import legalCopy from '@/i18n/copy/legal.js';
import { appRouteForWebPath } from '@/lib/webPaths';
import { colors, radius } from '@/theme';
import { Button, Card, Chevron, Icon, Row, Screen, ScreenHeader, T } from '@/ui';
import { DocSections } from './RichDoc';
import { GUIDE_KEYS } from './guideKeys';
import { resolveExamRoute } from './examRoutes';
import { SiteFooter } from '@/features/common/SiteFooter';

/** The signed-out entry points bounce to the welcome screen, signed-in ones to the tabs. */
function useBack() {
  return () => (router.canGoBack() ? router.back() : router.replace('/'));
}

/** Terms, privacy, refund policy and about: one renderer over the website's structured legal copy. */
export function LegalScreen({ doc }: { doc: 'terms' | 'privacy' | 'refund' | 'about' }) {
  const data = useCopy(legalCopy)[doc];
  const back = useBack();
  return (
    <Screen header={<ScreenHeader title={data.title} onBack={back} />} contentStyle={{ gap: 14 }}>
      <T weight="extrabold" size={24} style={{ lineHeight: 36 }}>
        {data.title}
      </T>
      {data.updated ? (
        <T size={13} color={colors.textLight}>
          {data.updated}
        </T>
      ) : null}
      <DocSections sections={data.sections} />
      <SiteFooter />
    </Screen>
  );
}

/** Frequently asked questions: an accordion over the website's FAQ copy. */
export function FaqScreen() {
  const t = useCopy(faqCopy);
  const back = useBack();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Screen header={<ScreenHeader title={t.title} onBack={back} />} contentStyle={{ gap: 12 }}>
      <View style={{ gap: 4 }}>
        <T weight="extrabold" size={24}>
          {t.title}
        </T>
        <T color={colors.textMedium}>{t.subtitle}</T>
      </View>

      {(t.items as { question: string; answer: string }[]).map((faq, index) => {
        const isOpen = open === index;
        return (
          <Card key={faq.question} pad={0} style={{ overflow: 'hidden', borderColor: isOpen ? colors.primary : colors.border }}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setOpen(isOpen ? null : index)} accessibilityRole="button" accessibilityState={{ expanded: isOpen }}>
              <Row gap={10} style={{ padding: 14 }}>
                <T weight="bold" size={15} style={{ flex: 1 }}>
                  {faq.question}
                </T>
                <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color={colors.primary} />
              </Row>
            </TouchableOpacity>
            {isOpen ? (
              <View style={{ paddingHorizontal: 14, paddingBottom: 14, gap: 6 }}>
                {/* Answers keep their line breaks: the bulleted ones are unreadable as one paragraph. */}
                {faq.answer.split('\n').map((line, i) => (
                  <T key={i} color={colors.textMedium} lh={1.7}>
                    {line}
                  </T>
                ))}
              </View>
            ) : null}
          </Card>
        );
      })}

      <Card pad={18} style={{ gap: 10, alignItems: 'center', backgroundColor: colors.infoBg, borderColor: colors.primary }}>
        <T weight="extrabold" size={17} align="center">
          {t.ctaTitle}
        </T>
        <T color={colors.textMedium} align="center">
          {t.ctaBody}
        </T>
        <Button label={t.ctaContact} onPress={() => router.push('/contact')} />
        <Button label={t.ctaEmail} variant="secondary" icon="mail" onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() => {})} />
      </Card>
    </Screen>
  );
}

type CardEntry = { path: string; title: string; excerpt?: string };

function CardLink({ card, onPress }: { card: CardEntry; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} accessibilityRole="link">
      <Row gap={12} style={{ backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.border, padding: 14 }}>
        <View style={{ flex: 1, gap: 4 }}>
          <T weight="bold" size={15}>
            {card.title}
          </T>
          {card.excerpt ? (
            <T size={13} color={colors.textMedium}>
              {card.excerpt}
            </T>
          ) : null}
        </View>
        <Chevron />
      </Row>
    </TouchableOpacity>
  );
}

const open = (path: string) => {
  const target = appRouteForWebPath(path);
  if (target) router.push(target);
};

/** Study guides: the hub of articles. */
export function GuidesHubScreen() {
  const t = useCopy(guidesCopy).hub;
  const back = useBack();
  return (
    <Screen header={<ScreenHeader title={t.title} onBack={back} />} contentStyle={{ gap: 14 }}>
      <View style={{ gap: 6 }}>
        <T weight="bold" size={12} color={colors.primary}>
          {t.kicker}
        </T>
        <T weight="extrabold" size={24} style={{ lineHeight: 36 }}>
          {t.title}
        </T>
        <T color={colors.textMedium}>{t.intro}</T>
      </View>
      {(t.cards as CardEntry[]).map((card) => (
        <CardLink key={card.path} card={card} onPress={() => open(card.path)} />
      ))}
      <View style={{ gap: 8 }}>
        <T weight="extrabold" size={17}>
          {t.notesTitle}
        </T>
        {(t.notes as string[]).map((note) => (
          <Row key={note} gap={8} align="flex-start">
            <T color={colors.primary} weight="bold">
              •
            </T>
            <T size={13} color={colors.textMedium} style={{ flex: 1 }}>
              {note}
            </T>
          </Row>
        ))}
      </View>
      <SiteFooter />
    </Screen>
  );
}

type Article = { kicker?: string; title: string; intro?: string; sections: any[] };

function ArticleView({ article, children }: { article: Article; children?: React.ReactNode }) {
  return (
    <>
      <View style={{ gap: 6 }}>
        {article.kicker ? (
          <T weight="bold" size={12} color={colors.primary}>
            {article.kicker}
          </T>
        ) : null}
        <T weight="extrabold" size={24} style={{ lineHeight: 36 }}>
          {article.title}
        </T>
        {article.intro ? <T color={colors.textMedium}>{article.intro}</T> : null}
      </View>
      <DocSections sections={article.sections} />
      {children}
    </>
  );
}

/** One study guide, by slug. */
export function GuideScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const copy = useCopy(guidesCopy);
  const back = useBack();
  const key = GUIDE_KEYS[String(slug)];
  const article = key ? (copy[key] as Article) : null;
  if (!article) {
    return (
      <Screen header={<ScreenHeader title={copy.hub.title} onBack={back} />}>
        <NotFoundBlock />
      </Screen>
    );
  }
  return (
    <Screen header={<ScreenHeader title={article.title} onBack={back} />} contentStyle={{ gap: 16 }}>
      <ArticleView article={article} />
      <Button label={copy.hub.title} variant="secondary" onPress={() => router.push('/guides')} />
      <SiteFooter />
    </Screen>
  );
}

function NotFoundBlock() {
  const common = useCommon();
  return (
    <Card style={{ gap: 10, alignItems: 'center' }}>
      <Icon name="help-circle" size={34} color={colors.primary} />
      <T weight="extrabold" size={18} align="center">
        {common.errors.notFoundTitle}
      </T>
      <T color={colors.textMedium} align="center">
        {common.errors.notFoundShort}
      </T>
      <Button label={common.actions.backHome} onPress={() => router.replace('/')} />
    </Card>
  );
}

/** Every page under /exams (thirteen routes, one component), resolved from the website's copy. */
export function ExamScreen() {
  const { parts } = useLocalSearchParams<{ parts?: string | string[] }>();
  const { lang } = useLang();
  const back = useBack();
  const segments = Array.isArray(parts) ? parts : parts ? [parts] : [];
  const path = `/exams${segments.length ? `/${segments.join('/')}` : ''}`;
  const resolved = resolveExamRoute(path, lang);
  const relatedLabel = lang === 'en' ? 'More about the exams' : 'صفحات أخرى عن الاختبار';

  if (!resolved) {
    return (
      <Screen header={<ScreenHeader onBack={back} />}>
        <NotFoundBlock />
      </Screen>
    );
  }

  const { page, cards } = resolved;
  const siblings = cards.filter((c) => c.path !== path);
  return (
    <Screen header={<ScreenHeader title={page.title} onBack={back} />} contentStyle={{ gap: 16 }}>
      <ArticleView article={page as Article} />
      {siblings.length > 0 ? (
        <View style={{ gap: 8 }}>
          <T weight="extrabold" size={17}>
            {relatedLabel}
          </T>
          {siblings.map((card) => (
            <CardLink key={card.path} card={card} onPress={() => router.push(card.path as Href)} />
          ))}
        </View>
      ) : null}
      <SiteFooter />
    </Screen>
  );
}
