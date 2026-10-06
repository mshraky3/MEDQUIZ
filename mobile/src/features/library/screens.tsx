import React, { useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCopy, useLang } from '@/i18n';
import pastPapersCopy from '@/i18n/copy/pastPapers.js';
import publicQuestionsCopy from '@/i18n/copy/publicQuestions.js';
import successStoriesCopy from '@/i18n/copy/successStories.js';
import { parseExplanation } from '@/lib/explanation';
import { colors, radius } from '@/theme';
import { Button, Card, Chevron, Icon, Row, Screen, ScreenHeader, Span, T } from '@/ui';
import { SiteFooter } from '@/features/common/SiteFooter';
import publicQuestionsData from './data/publicQuestions.json';
import storiesData from './data/successStories.json';
// The grouping logic is the website's own (copied byte for byte, see scripts/sync-library.mjs).
import { HONESTY_NOTE_AR, HONESTY_NOTE_EN, buildCollections } from './seo/pastPapers.js';
import { buildQuestionIndex, questionPath, relatedQuestions, specialtySlug, stemBody } from './seo/publicQuestions.js';
import { storiesFrom } from './seo/successStories.js';

// Built once: the payload is ~450 KB and the grouping is not free.
let cache: { index: any; payload: any } | null = null;
const data = () => {
  if (!cache) {
    const payload = publicQuestionsData as any;
    cache = { index: buildQuestionIndex(payload), payload };
  }
  return cache;
};

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function useBack(fallback: string) {
  return () => (router.canGoBack() ? router.back() : router.replace(fallback as any));
}

function SignupCta({ t }: { t: any }) {
  return (
    <Card pad={18} style={{ gap: 8, alignItems: 'center', backgroundColor: colors.infoBg, borderColor: colors.primary }}>
      <T weight="extrabold" size={17} align="center">
        {t.cta.title}
      </T>
      <T color={colors.textMedium} align="center">
        {t.cta.body}
      </T>
      <Button label={t.cta.button} onPress={() => router.push('/signup')} />
      <T size={12} color={colors.textLight} align="center">
        {t.cta.note}
      </T>
    </Card>
  );
}

function Faq({ title, items }: { title: string; items: { q: string; a: string }[] }) {
  if (!items?.length) return null;
  return (
    <View style={{ gap: 10 }}>
      <T weight="extrabold" size={17}>
        {title}
      </T>
      {items.map((item) => (
        <View key={item.q} style={{ gap: 2 }}>
          <T weight="bold" size={14}>
            {item.q}
          </T>
          <T size={13} color={colors.textMedium}>
            {item.a}
          </T>
        </View>
      ))}
    </View>
  );
}

function NotFound({ t, backTo }: { t: any; backTo: string }) {
  return (
    <Card style={{ gap: 10, alignItems: 'center' }}>
      <Icon name="help-circle" size={34} color={colors.primary} />
      <T weight="extrabold" size={18} align="center">
        {t.notFound.title}
      </T>
      <T color={colors.textMedium} align="center">
        {t.notFound.body}
      </T>
      <Button label={t.notFound.back} onPress={() => router.replace(backTo as any)} />
    </Card>
  );
}

function LinkRow({ label, sub, onPress }: { label: string; sub?: string; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} accessibilityRole="link">
      <Row gap={12} style={{ backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.border, padding: 14 }}>
        <View style={{ flex: 1, gap: 2 }}>
          <T weight="bold" size={15}>
            {label}
          </T>
          {sub ? (
            <T size={12} color={colors.textLight}>
              {sub}
            </T>
          ) : null}
        </View>
        <Chevron />
      </Row>
    </TouchableOpacity>
  );
}

/** /questions: the free sample library, one card per specialty. */
export function QuestionsHubScreen() {
  const t = useCopy(publicQuestionsCopy);
  const { lang } = useLang();
  const back = useBack('/');
  const { index } = data();
  return (
    <Screen header={<ScreenHeader title={t.breadcrumbRoot} onBack={back} />} contentStyle={{ gap: 18 }}>
      <View style={{ gap: 6 }}>
        <T weight="bold" size={12} color={colors.primary}>
          {t.hub.kicker}
        </T>
        <T weight="extrabold" size={24} style={{ lineHeight: 36 }}>
          {t.hub.title}
        </T>
        <T color={colors.textMedium}>{t.hub.intro(index.total)}</T>
      </View>
      {index.tracks.map((track: any) => (
        <View key={track.key} style={{ gap: 10 }}>
          <T weight="extrabold" size={18}>
            {(t.hub.tracks as Record<string, string>)[track.key] || track.key}
          </T>
          {track.specialties.map((specialty: any) => (
            <LinkRow
              key={specialty.slug}
              label={lang === 'en' ? specialty.labelEn : specialty.labelAr}
              sub={`${lang !== 'en' ? `${specialty.labelEn} · ` : ''}${t.hub.countLabel(specialty.questions.length)}`}
              onPress={() => router.push({ pathname: '/questions/[specialty]', params: { specialty: specialty.slug } })}
            />
          ))}
        </View>
      ))}
      <SignupCta t={t} />
      <Faq title={t.faqTitle} items={t.faq(index.total, index.bankTotal || index.total)} />
      <SiteFooter />
    </Screen>
  );
}

/** /questions/:specialty: every published question in one specialty. */
export function QuestionsSpecialtyScreen() {
  const { specialty } = useLocalSearchParams<{ specialty: string }>();
  const t = useCopy(publicQuestionsCopy);
  const { lang } = useLang();
  const back = useBack('/questions');
  const { index } = data();
  const group = index.bySpecialtySlug.get(specialty);

  if (!group) {
    return (
      <Screen header={<ScreenHeader title={t.breadcrumbRoot} onBack={back} />}>
        <NotFound t={t} backTo="/questions" />
      </Screen>
    );
  }
  const label = lang === 'en' ? group.labelEn : group.labelAr;
  const siblings = index.specialties.filter((s: any) => s.slug !== group.slug);
  return (
    <Screen header={<ScreenHeader title={label} onBack={back} />} contentStyle={{ gap: 16 }}>
      <View style={{ gap: 6 }}>
        <T ltr weight="bold" size={12} color={colors.primary}>
          {group.labelEn}
        </T>
        <T weight="extrabold" size={22} style={{ lineHeight: 34 }}>
          {t.specialty.title(label)}
        </T>
        <T color={colors.textMedium}>{t.specialty.intro(group.questions.length, label)}</T>
      </View>
      <View style={{ gap: 8 }}>
        <T weight="extrabold" size={17}>
          {t.specialty.listTitle}
        </T>
        {group.questions.map((question: any, i: number) => (
          <TouchableOpacity
            key={question.slug}
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: '/questions/[specialty]/[slug]', params: { specialty: group.slug, slug: question.slug } })}
            accessibilityRole="link"
          >
            <Row ltr gap={10} style={{ backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, padding: 12 }}>
              <T ltr size={12} weight="bold" color={colors.primary}>
                {i + 1}
              </T>
              <T ltr size={14} style={{ flex: 1 }}>
                {question.headline}
              </T>
            </Row>
          </TouchableOpacity>
        ))}
      </View>
      <SignupCta t={t} />
      {siblings.length > 0 ? (
        <View style={{ gap: 8 }}>
          <T weight="extrabold" size={17}>
            {t.specialty.siblingsTitle}
          </T>
          <Row wrap gap={8}>
            {siblings.map((s: any) => (
              <TouchableOpacity
                key={s.slug}
                onPress={() => router.push({ pathname: '/questions/[specialty]', params: { specialty: s.slug } })}
                accessibilityRole="link"
                style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface }}
              >
                <T size={13} color={colors.primary} weight="semibold">
                  {lang === 'en' ? s.labelEn : s.labelAr}
                </T>
              </TouchableOpacity>
            ))}
          </Row>
        </View>
      ) : null}
    </Screen>
  );
}

/** The explanation, as the website renders it (bold labels and bullets, nothing else). */
function ExplanationText({ text }: { text: string }) {
  const blocks = useMemo(() => parseExplanation(text), [text]);
  return (
    <View style={{ gap: 6 }}>
      {blocks.map((block, i) =>
        block.type === 'ul' ? (
          <View key={i} style={{ gap: 4 }}>
            {block.items.map((item, j) => (
              <Row key={j} ltr gap={8} align="flex-start">
                <T ltr color={colors.primary} weight="bold">
                  •
                </T>
                <T ltr size={14} style={{ flex: 1 }} lh={1.55}>
                  {item.map((run, k) => (
                    <Span key={k} ltr size={14} weight={run.bold ? 'bold' : 'regular'}>
                      {run.text}
                    </Span>
                  ))}
                </T>
              </Row>
            ))}
          </View>
        ) : (
          <T key={i} ltr size={14} lh={1.55}>
            {block.runs.map((run, k) => (
              <Span key={k} ltr size={14} weight={run.bold ? 'bold' : 'regular'}>
                {run.text}
              </Span>
            ))}
          </T>
        )
      )}
    </View>
  );
}

/**
 * /questions/:specialty/:slug: one published question. The correct option is
 * marked from first paint and the explanation is always visible, exactly as on
 * the website (a page that showed a crawler more than a reader would be
 * cloaking). Picking an option adds your own answer on top: self-testing, not a gate.
 */
export function QuestionDetailScreen() {
  const { slug } = useLocalSearchParams<{ specialty: string; slug: string }>();
  const t = useCopy(publicQuestionsCopy);
  const { lang } = useLang();
  const back = useBack('/questions');
  const { index } = data();
  const [picked, setPicked] = useState<number | null>(null);
  const question = index.byQuestionSlug.get(slug);

  if (!question) {
    return (
      <Screen header={<ScreenHeader title={t.breadcrumbRoot} onBack={back} />}>
        <NotFound t={t} backTo="/questions" />
      </Screen>
    );
  }
  const related = relatedQuestions(index, question);
  const specialtyLabel = lang === 'en' ? question.specialtyLabelEn : question.specialtyLabelAr;

  return (
    <Screen header={<ScreenHeader title={specialtyLabel} onBack={back} />} contentStyle={{ gap: 16 }}>
      <View style={{ gap: 10 }}>
        <T ltr weight="bold" size={12} color={colors.primary}>
          {question.specialtyLabelEn}
        </T>
        <T ltr weight="extrabold" size={19} style={{ lineHeight: 28 }}>
          {question.headline}
        </T>
        <T ltr color={colors.textMedium} lh={1.6}>
          {stemBody(question)}
        </T>
      </View>

      <T size={13} color={colors.textLight}>
        {t.question.tryFirst}
      </T>

      <View style={{ gap: 8 }}>
        {question.options.map((option: string, i: number) => {
          const isCorrect = i === question.correctIndex;
          const isPicked = picked === i;
          const wrong = isPicked && !isCorrect;
          return (
            <TouchableOpacity key={i} activeOpacity={0.85} onPress={() => setPicked(i)} accessibilityRole="radio" accessibilityState={{ selected: isPicked }}>
              <Row
                ltr
                gap={10}
                align="flex-start"
                style={{
                  borderRadius: radius.md,
                  borderWidth: 2,
                  borderColor: isCorrect ? colors.success : wrong ? colors.error : colors.border,
                  backgroundColor: isCorrect ? colors.successBg : wrong ? colors.errorBg : colors.surface,
                  padding: 12,
                }}
              >
                <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: colors.surfaceTint, alignItems: 'center', justifyContent: 'center' }}>
                  <T ltr size={12} weight="bold" color={colors.primary}>
                    {LETTERS[i]}
                  </T>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <T ltr size={14}>
                    {option}
                  </T>
                  {isCorrect ? (
                    <T size={11} weight="bold" color={colors.success}>
                      {t.question.answerLabel}
                    </T>
                  ) : null}
                  {wrong ? (
                    <T size={11} weight="bold" color={colors.error}>
                      {t.question.yourAnswer}
                    </T>
                  ) : null}
                </View>
              </Row>
            </TouchableOpacity>
          );
        })}
      </View>

      <Card style={{ gap: 8 }}>
        <T weight="extrabold" size={16}>
          {t.question.explanationTitle}
        </T>
        <ExplanationText text={question.explanation} />
      </Card>

      <SignupCta t={t} />

      {related.length > 0 ? (
        <View style={{ gap: 8 }}>
          <T weight="extrabold" size={17}>
            {t.question.relatedTitle(specialtyLabel)}
          </T>
          {related.map((q: any) => (
            <LinkRow
              key={q.slug}
              label={q.headline}
              onPress={() => router.replace({ pathname: '/questions/[specialty]/[slug]', params: { specialty: specialtySlug(q.specialty), slug: q.slug } })}
            />
          ))}
          <Button
            label={t.question.allInSpecialty(specialtyLabel)}
            variant="secondary"
            onPress={() => router.push({ pathname: '/questions/[specialty]', params: { specialty: specialtySlug(question.specialty) } })}
          />
        </View>
      ) : null}
    </Screen>
  );
}

/** /past-papers: what each collection in the bank is, and how big it is. */
export function PastPapersHubScreen() {
  const t = useCopy(pastPapersCopy);
  const { lang } = useLang();
  const back = useBack('/');
  const collections = useMemo(() => buildCollections(data().payload), []);
  const note = lang === 'en' ? HONESTY_NOTE_EN : HONESTY_NOTE_AR;
  return (
    <Screen header={<ScreenHeader title={t.breadcrumbRoot} onBack={back} />} contentStyle={{ gap: 18 }}>
      <View style={{ gap: 6 }}>
        <T weight="bold" size={12} color={colors.primary}>
          {t.hub.kicker}
        </T>
        <T weight="extrabold" size={24} style={{ lineHeight: 36 }}>
          {t.hub.title}
        </T>
        <T color={colors.textMedium}>{t.hub.intro(collections.bankTotal, collections.collections.length)}</T>
        {/* Stated up front rather than in a footnote: SCFHS and Prometric do not publish past papers. */}
        <Card flat pad={12} style={{ backgroundColor: colors.warningBg, borderColor: colors.warning }}>
          <T size={13} color={colors.textMedium}>
            {note}
          </T>
        </Card>
      </View>
      {collections.tracks.map((track: any) => (
        <View key={track.key} style={{ gap: 10 }}>
          <T weight="extrabold" size={18}>
            {(t.hub.tracks as Record<string, string>)[track.key] || track.key}
          </T>
          {track.collections.map((c: any) => (
            <LinkRow
              key={c.slug}
              label={lang === 'en' ? c.labelEn : c.labelAr}
              sub={`${lang === 'en' ? c.blurbEn : c.blurbAr} · ${t.hub.countLabel(c.total)}`}
              onPress={() => router.push({ pathname: '/past-papers/[slug]', params: { slug: c.slug } })}
            />
          ))}
        </View>
      ))}
      <SignupCta t={t} />
      <Faq title={t.faqTitle} items={t.faq(collections.bankTotal, collections.collectionCount)} />
      <Row wrap gap={14}>
        <TouchableOpacity onPress={() => router.push('/questions')}>
          <T color={colors.primary} weight="semibold" size={14}>
            {t.links.allQuestions}
          </T>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/guides')}>
          <T color={colors.primary} weight="semibold" size={14}>
            {t.links.guides}
          </T>
        </TouchableOpacity>
      </Row>
      <SiteFooter />
    </Screen>
  );
}

/** /past-papers/:slug: one collection, what it holds, and open samples from it. */
export function PastPaperCollectionScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const t = useCopy(pastPapersCopy);
  const { lang } = useLang();
  const back = useBack('/past-papers');
  const collections = useMemo(() => buildCollections(data().payload), []);
  const collection = collections.bySlug.get(slug);

  if (!collection) {
    return (
      <Screen header={<ScreenHeader title={t.breadcrumbRoot} onBack={back} />}>
        <NotFound t={t} backTo="/past-papers" />
      </Screen>
    );
  }
  const isEn = lang === 'en';
  const trackLabel = collection.track === 'medical' ? 'SMLE' : 'SNLE';
  const name = isEn ? collection.labelEn : collection.labelAr;

  return (
    <Screen header={<ScreenHeader title={name} onBack={back} />} contentStyle={{ gap: 16 }}>
      <View style={{ gap: 6 }}>
        <T ltr weight="bold" size={12} color={colors.primary}>
          {collection.labelEn}
        </T>
        <T weight="extrabold" size={22} style={{ lineHeight: 34 }}>
          {name}
        </T>
        <T color={colors.textMedium}>{t.collection.intro(isEn ? collection.blurbEn : collection.blurbAr, collection.total, trackLabel)}</T>
        <Card flat pad={12} style={{ backgroundColor: colors.warningBg, borderColor: colors.warning }}>
          <T size={13} color={colors.textMedium}>
            {isEn ? HONESTY_NOTE_EN : HONESTY_NOTE_AR}
          </T>
        </Card>
      </View>

      {collection.specialties.length > 0 ? (
        <View style={{ gap: 8 }}>
          <T weight="extrabold" size={17}>
            {t.collection.specialtiesTitle}
          </T>
          {collection.specialties.map((s: any) => (
            <LinkRow
              key={s.key}
              label={isEn ? s.labelEn : s.labelAr}
              sub={t.collection.openCount(s.count)}
              onPress={() => router.push({ pathname: '/questions/[specialty]', params: { specialty: specialtySlug(s.key) } })}
            />
          ))}
        </View>
      ) : null}

      {collection.samples.length > 0 ? (
        <View style={{ gap: 8 }}>
          <T weight="extrabold" size={17}>
            {t.collection.samplesTitle}
          </T>
          {/* Capped at 30 to match the website: a collection with 118 published
              questions would otherwise be a wall of links. */}
          {collection.samples.slice(0, 30).map((q: any) => (
            <LinkRow
              key={q.slug}
              label={q.headline}
              onPress={() => router.push({ pathname: '/questions/[specialty]/[slug]', params: { specialty: specialtySlug(q.specialty), slug: q.slug } })}
            />
          ))}
        </View>
      ) : null}

      <SignupCta t={t} />
      <Faq title={t.faqTitle} items={t.faq(collection.bankTotal, collection.collectionCount)} />

      {collections.collections.length > 1 ? (
        <View style={{ gap: 8 }}>
          <T weight="extrabold" size={17}>
            {t.collection.siblingsTitle}
          </T>
          <Row wrap gap={8}>
            {collections.collections
              .filter((c: any) => c.slug !== collection.slug)
              .map((c: any) => (
                <TouchableOpacity
                  key={c.slug}
                  onPress={() => router.replace({ pathname: '/past-papers/[slug]', params: { slug: c.slug } })}
                  accessibilityRole="link"
                  style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface }}
                >
                  <T size={13} color={colors.primary} weight="semibold">
                    {isEn ? c.labelEn : c.labelAr}
                  </T>
                </TouchableOpacity>
              ))}
          </Row>
        </View>
      ) : null}
    </Screen>
  );
}

/**
 * /success-stories: what students say, in their own words. Reads the same
 * committed JSON the website reads, so nothing appears here that a person did
 * not deliberately publish. With no stories it is an honest empty state: there
 * is no state in which it shows an example or a placeholder quote.
 */
export function SuccessStoriesScreen() {
  const t = useCopy(successStoriesCopy);
  const back = useBack('/');
  const stories = storiesFrom(storiesData as any) as any[];
  return (
    <Screen header={<ScreenHeader title={t.title} onBack={back} />} contentStyle={{ gap: 16 }}>
      <View style={{ gap: 6 }}>
        <T weight="bold" size={12} color={colors.primary}>
          {t.kicker}
        </T>
        <T weight="extrabold" size={24} style={{ lineHeight: 36 }}>
          {t.title}
        </T>
        {stories.length > 0 ? <T color={colors.textMedium}>{t.intro(stories.length)}</T> : null}
      </View>

      {stories.map((s) => (
        <Card key={s.id} style={{ gap: 8 }}>
          {/* The quote keeps the direction it was written in, not the page's. */}
          <T ltr={s.lang === 'en'} size={15} lh={1.7}>
            {s.quote}
          </T>
          <View style={{ gap: 2 }}>
            <T weight="bold" size={14}>
              {s.name}
            </T>
            {s.examResult ? (
              <T size={12} color={colors.success}>
                {s.examResult}
              </T>
            ) : null}
            {s.specialty ? (
              <T size={12} color={colors.textLight}>
                {s.specialty}
              </T>
            ) : null}
          </View>
        </Card>
      ))}

      <Card pad={18} style={{ gap: 8, alignItems: 'center', backgroundColor: colors.infoBg, borderColor: colors.primary }}>
        <T weight="extrabold" size={17} align="center">
          {t.ctaTitle}
        </T>
        <T color={colors.textMedium} align="center">
          {t.ctaBody}
        </T>
        <Button label={t.ctaSignup} onPress={() => router.push('/signup')} />
      </Card>
    </Screen>
  );
}

// `questionPath` is part of the website's public surface; kept importable for tests.
export { questionPath };
