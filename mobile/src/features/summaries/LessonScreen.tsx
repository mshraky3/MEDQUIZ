import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCopy, useLang } from '@/i18n';
import summariesCopy from '@/i18n/copy/summaries.js';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { userTrack } from '@/lib/tracks';
import { colors, radius, shadow } from '@/theme';
import { Button, Card, EmptyState, Icon, Row, Screen, Spinner, T, goBack } from '@/ui';
import { LessonCommands, LessonWebView } from './LessonWebView';
import { QuestionCard } from './QuestionCard';
import { isStepUnlocked, loadPath } from './pathMeta';
import { useSummaryProgress } from './summaryStore';

const TOOLS = [
  { id: 'move', icon: 'cursor', labelKey: 'move' },
  { id: 'pen', icon: 'pen', labelKey: 'pen' },
  { id: 'highlighter', icon: 'highlighter', labelKey: 'highlighter' },
  { id: 'eraser', icon: 'eraser', labelKey: 'eraser' },
] as const;
const COLORS = ['#2563eb', '#ef4444', '#16a34a', '#f59e0b', '#0f172a'];

// Each section/subtopic carries an Arabic `title` + English `title_en`. When the
// title is already English, keep it as the heading and use title_en as a
// descriptive subtitle; otherwise show title_en as the (single) English name.
const enLabel = (item: { title?: string; title_en?: string }) => {
  const hasLatin = /[A-Za-z]/.test(item?.title || '');
  return { primary: hasLatin ? item.title : item.title_en || item.title, secondary: hasLatin ? item.title_en : null };
};

/**
 * One lesson, full screen: the summary (with drawing tools) and the interactive
 * questions, with a "mark as done" toggle. The deep link /summaries/<id> lands
 * here and obeys the same rule as a tap: only the first lesson of a specialty
 * opens for a non-subscriber.
 */
export default function LessonScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { user } = useAuth();
  const t = useCopy(summariesCopy);
  const { isRTL } = useLang();
  const track = userTrack(user);
  const isSubscriber = user?.accessAllowed !== false;
  const { done, toggleDone, updatePath } = useSummaryProgress();

  const [state, setState] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading');
  const [step, setStep] = useState<any>(null);
  const [total, setTotal] = useState(0);
  const [tab, setTab] = useState<'summary' | 'questions'>('summary');
  const [tool, setTool] = useState<(typeof TOOLS)[number]['id']>('move');
  const [color, setColor] = useState(COLORS[0]);
  const [toolsOpen, setToolsOpen] = useState(false);
  const lesson = useRef<LessonCommands>(null);

  useEffect(() => {
    let alive = true;
    loadPath(track)
      .then((p: any) => {
        if (!alive) return;
        const found = p.stepById[String(slug)];
        setTotal(p.totalSteps);
        setStep(found || null);
        setState(found ? 'ready' : 'missing');
      })
      .catch(() => alive && setState('error'));
    return () => {
      alive = false;
    };
  }, [slug, track]);

  // Remember the resume point and tell the server where the student is. The
  // server's "page" is the lesson's ordinal within its section. Silent on every
  // failure: telemetry must never interrupt someone reading, and the few legacy
  // decks the server still lists have no section in the catalog (a 404 here).
  useEffect(() => {
    if (state !== 'ready' || !step || !isStepUnlocked(step, isSubscriber)) return;
    updatePath((p) => (p.lastStepId === step.id ? p : { ...p, lastStepId: step.id, lastAt: Date.now() }));
    const section = step.section;
    const subtopics: { id: string }[] = section.subtopics || [];
    const ordinal = subtopics.findIndex((s) => s.id === step.id) + 1;
    if (ordinal < 1) return;
    const complete = subtopics.length > 0 && subtopics.every((s) => done[s.id]);
    void api
      .post(`/api/summaries/${encodeURIComponent(section.id)}/progress`, { last_page: ordinal, total_pages: subtopics.length, completed: complete })
      .catch(() => {});
    // Fired on open and when this lesson is ticked, not on every unrelated store change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, step?.id, done[step?.id]]);

  const changeTool = (id: (typeof TOOLS)[number]['id']) => {
    setTool(id);
    lesson.current?.setTool(id);
  };
  const pickColor = (c: string) => {
    setColor(c);
    lesson.current?.setColor(c);
    if (tool === 'move' || tool === 'eraser') changeTool('pen');
  };
  const closeTools = () => {
    setToolsOpen(false);
    changeTool('move');
  };
  const changeTab = (next: 'summary' | 'questions') => {
    setTab(next);
    if (next === 'questions') changeTool('move');
  };

  const close = () => goBack(true);

  if (state === 'loading') {
    return (
      <Screen>
        <Spinner fullScreen label={t.loading} />
      </Screen>
    );
  }
  if (state === 'missing' || state === 'error') {
    return (
      <Screen>
        <EmptyState icon="alert-triangle" tone={state === 'error' ? 'error' : 'neutral'} title={state === 'error' ? t.errorTitle : t.noResultsBefore} body={state === 'error' ? t.errorBody : undefined}>
          <Button label={t.close} onPress={close} />
        </EmptyState>
      </Screen>
    );
  }

  const subtopic = step.subtopic;
  const section = step.section;
  const questions = subtopic.questions || [];
  const isDone = !!done[step.id];

  // Locked lesson: the title and the reason to read it stay visible, the lesson does not.
  if (!isStepUnlocked(step, isSubscriber)) {
    return (
      <Screen>
        <Card pad={20} style={{ gap: 12, alignItems: 'center' }}>
          <Icon name="lock" size={36} color={colors.warning} />
          <T ltr weight="extrabold" size={19} align="center">
            {step.title}
          </T>
          <T ltr color={colors.textMedium} align="center">
            {step.why}
          </T>
          <Button label={t.lockedCta} onPress={() => router.replace('/subscribe')} />
          <Button label={t.close} variant="ghost" onPress={close} />
        </Card>
      </Screen>
    );
  }

  const sectionLabel = enLabel(section);
  const subLabel = enLabel(subtopic);

  return (
    <Screen
      scroll={false}
      padded={false}
      maxWidth={0}
      header={
        <View>
          <Row gap={10} style={{ paddingHorizontal: 14, paddingVertical: 10 }}>
            <View style={{ flex: 1 }}>
              <Row gap={6}>
                <Icon name={section.icon} size={15} color={section.accent || colors.primary} />
                <T ltr size={12} weight="bold" color={colors.textMedium} numberOfLines={1} style={{ flex: 1 }}>
                  {sectionLabel.primary}
                </T>
                <T size={11} color={colors.textLight}>
                  {t.panelStep(step.no, total)}
                </T>
              </Row>
              <T ltr weight="extrabold" size={16} numberOfLines={2}>
                {subLabel.primary}
              </T>
              {subLabel.secondary ? (
                <T ltr size={11} color={colors.textLight} numberOfLines={1}>
                  {subLabel.secondary}
                </T>
              ) : null}
            </View>
            <TouchableOpacity
              onPress={close}
              accessibilityRole="button"
              accessibilityLabel={t.close}
              hitSlop={10}
              style={{ width: 38, height: 38, borderRadius: radius.md, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="x" size={20} color={colors.text} />
            </TouchableOpacity>
          </Row>

          <Row gap={8} style={{ paddingHorizontal: 14, paddingBottom: 10 }}>
            {(
              [
                ['summary', t.tabSummary, 0],
                ...(questions.length > 0 ? [['questions', t.tabQuestions, questions.length]] : []),
              ] as [('summary' | 'questions'), string, number][]
            ).map(([key, label, count]) => {
              const on = tab === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => changeTab(key)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: on }}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 999,
                    borderWidth: 1.5,
                    borderColor: on ? colors.primary : colors.border,
                    backgroundColor: on ? colors.infoBg : colors.surface,
                  }}
                >
                  <Row gap={6}>
                    <T size={13} weight="bold" color={on ? colors.primary : colors.text}>
                      {label}
                    </T>
                    {count > 0 ? (
                      <View style={{ backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 7, paddingVertical: 1 }}>
                        <T size={11} weight="bold" color={colors.white} ltr>
                          {count}
                        </T>
                      </View>
                    ) : null}
                  </Row>
                </TouchableOpacity>
              );
            })}
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              onPress={() => toggleDone(step.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: isDone }}
              accessibilityLabel={isDone ? t.markedTitle : t.markTitle}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999,
                borderWidth: 1.5,
                borderColor: isDone ? colors.success : colors.border,
                backgroundColor: isDone ? colors.successBg : colors.surface,
              }}
            >
              <Icon name={isDone ? 'check' : 'circle'} size={15} color={isDone ? colors.success : colors.textLight} />
              <T size={12} weight="semibold" color={isDone ? colors.success : colors.textMedium}>
                {isDone ? t.panelStepDone : t.panelMarkDone}
              </T>
            </TouchableOpacity>
          </Row>
        </View>
      }
    >
      <View style={{ flex: 1, backgroundColor: colors.surface }}>
        {tab === 'summary' ? (
          <>
            <LessonWebView ref={lesson} key={step.id} summaryHtml={subtopic.summaryHtml} accent={section.accent} />

            {/* The study toolbar starts collapsed so it never obstructs reading. */}
            {!toolsOpen ? (
              <TouchableOpacity
                onPress={() => setToolsOpen(true)}
                accessibilityRole="button"
                accessibilityLabel={t.tools.openAria}
                activeOpacity={0.85}
                style={[
                  {
                    position: 'absolute',
                    bottom: 18,
                    ...(isRTL ? { left: 16 } : { right: 16 }),
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: colors.primary,
                    borderRadius: 999,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  },
                  shadow.md,
                ]}
              >
                <Icon name="pen" size={17} color={colors.white} />
                <T weight="bold" size={13} color={colors.white}>
                  {t.tools.open}
                </T>
              </TouchableOpacity>
            ) : (
              <View
                accessibilityRole="toolbar"
                accessibilityLabel={t.tools.toolbar}
                style={[
                  {
                    position: 'absolute',
                    bottom: 14,
                    left: 10,
                    right: 10,
                    backgroundColor: colors.surface,
                    borderRadius: radius.xl,
                    borderWidth: 1.5,
                    borderColor: colors.border,
                    padding: 10,
                    gap: 10,
                  },
                  shadow.lg,
                ]}
              >
                <Row justify="space-between" gap={6}>
                  {TOOLS.map((def) => (
                    <TouchableOpacity
                      key={def.id}
                      onPress={() => changeTool(def.id)}
                      accessibilityRole="button"
                      accessibilityLabel={t.tools[def.labelKey]}
                      accessibilityState={{ selected: tool === def.id }}
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        gap: 2,
                        paddingVertical: 8,
                        borderRadius: radius.md,
                        backgroundColor: tool === def.id ? colors.infoBg : colors.surface2,
                      }}
                    >
                      <Icon name={def.icon} size={18} color={tool === def.id ? colors.primary : colors.textMedium} />
                      <T size={10} weight="semibold" color={tool === def.id ? colors.primary : colors.textMedium}>
                        {t.tools[def.labelKey]}
                      </T>
                    </TouchableOpacity>
                  ))}
                </Row>
                <Row justify="space-between">
                  <Row gap={8}>
                    {COLORS.map((c) => (
                      <TouchableOpacity
                        key={c}
                        onPress={() => pickColor(c)}
                        accessibilityRole="button"
                        accessibilityLabel={t.tools.color(c)}
                        accessibilityState={{ selected: color === c }}
                        hitSlop={4}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          backgroundColor: c,
                          borderWidth: color === c ? 3 : 1,
                          borderColor: color === c ? colors.primary : colors.border,
                        }}
                      />
                    ))}
                  </Row>
                  <Row gap={8}>
                    <TouchableOpacity onPress={() => lesson.current?.undo()} accessibilityLabel={t.tools.undo} accessibilityRole="button" hitSlop={8}>
                      <Icon name="undo" size={20} color={colors.textMedium} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => lesson.current?.clear()} accessibilityLabel={t.tools.clear} accessibilityRole="button" hitSlop={8}>
                      <Icon name="trash" size={20} color={colors.textMedium} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={closeTools} accessibilityLabel={t.tools.hide} accessibilityRole="button" hitSlop={8}>
                      <Icon name="x" size={20} color={colors.textMedium} />
                    </TouchableOpacity>
                  </Row>
                </Row>
              </View>
            )}
          </>
        ) : (
          <Screen scroll contentStyle={{ gap: 12 }}>
            {questions.map((qq: any, i: number) => (
              <QuestionCard key={i} question={qq} number={i + 1} />
            ))}
          </Screen>
        )}
      </View>
    </Screen>
  );
}
