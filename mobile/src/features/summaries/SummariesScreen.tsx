import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { router } from 'expo-router';
import { useCopy, useLang } from '@/i18n';
import summariesCopy from '@/i18n/copy/summaries.js';
import { useAuth } from '@/lib/auth';
import { examLabel, trackLabel, userTrack } from '@/lib/tracks';
import { colors, radius } from '@/theme';
import { Button, Card, Chevron, EmptyState, Icon, Input, ProgressBar, Row, Screen, Spinner, T } from '@/ui';
import { AppBar, FreeAllowanceBanner } from '@/features/common/chrome';
import { PathCheckpoint } from './PathCheckpoint';
// The path logic is the website's own (copied byte for byte, see scripts/sync-summaries.mjs).
import { EMPTY_PATH_SHAPE, isStepUnlocked, loadPath } from './pathMeta';
import { useSummaryProgress } from './summaryStore';

type Step = any;
type Milestone = any;
type Guide = {
  milestones: Milestone[];
  steps: Step[];
  stepById: Record<string, Step>;
  totalSteps: number;
  totalQuestions: number;
  ticks: { id: string; pos: number }[];
};

const Ring = ({ pct, color }: { pct: number; color: string }) => {
  const c = 2 * Math.PI * 16;
  return (
    <View style={{ width: 40, height: 40 }}>
      <Svg width={40} height={40} viewBox="0 0 40 40" style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={20} cy={20} r={16} stroke={colors.surfaceTint} strokeWidth={4} fill="none" />
        <Circle
          cx={20}
          cy={20}
          r={16}
          stroke={color}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
        />
      </Svg>
      <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
        <T size={10} weight="extrabold" ltr>
          {pct}%
        </T>
      </View>
    </View>
  );
};

/**
 * Guided study path: ordered milestones (specialties) made of numbered steps
 * (lessons), with a checkpoint at the end of each. Every step shows its state
 * (done / current / upcoming) and a one-line reason to read it. Nothing is
 * locked by order: "upcoming" is guidance, any step opens at any time. What a
 * free account cannot open is the lessons beyond the first of each specialty.
 *
 * The page chrome follows the UI language; the study material (titles, lesson
 * text, questions) is English in both.
 */
export default function SummariesScreen() {
  const { user } = useAuth();
  const t = useCopy(summariesCopy);
  const { lang } = useLang();
  const track = userTrack(user);
  // Paid, admin-created or grandfathered accounts read every lesson; everyone
  // else reads the first of each specialty. `accessAllowed` is the login's answer
  // to "is this a paying account": not a lockout flag.
  const isSubscriber = user?.accessAllowed !== false;
  const { done, path, toggleDone, updatePath, loaded } = useSummaryProgress();

  const [guide, setGuide] = useState<Guide>(EMPTY_PATH_SHAPE as unknown as Guide);
  const [guideState, setGuideState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [query, setQuery] = useState('');
  const [openMs, setOpenMs] = useState<Set<string>>(new Set());
  const [reload, setReload] = useState(0);
  const initialOpen = useRef(false);

  const scrollRef = useRef<ScrollView>(null);
  const offsets = useRef<Record<string, number>>({});
  const pathY = useRef(0);

  useEffect(() => {
    let alive = true;
    setGuideState('loading');
    loadPath(track)
      .then((p: Guide) => {
        if (alive) {
          setGuide(p);
          setGuideState('ready');
        }
      })
      .catch(() => {
        if (alive) setGuideState('error');
      });
    return () => {
      alive = false;
    };
  }, [track, reload]);

  const { milestones, steps, stepById, totalSteps, totalQuestions, ticks } = guide;
  const noContent = guideState === 'ready' && totalSteps === 0;

  // Open the milestone the student is currently in, once progress has loaded.
  useEffect(() => {
    if (!loaded || guideState !== 'ready' || initialOpen.current || totalSteps === 0) return;
    initialOpen.current = true;
    const last = path.lastStepId ? stepById[path.lastStepId] : null;
    const focus = last && !done[last.id] ? last : steps.find((s: Step) => !done[s.id]);
    setOpenMs(new Set([(focus || steps[0])?.milestoneId]));
  }, [loaded, guideState, totalSteps, path.lastStepId, done, stepById, steps]);

  const doneTotal = steps.reduce((n: number, s: Step) => n + (done[s.id] ? 1 : 0), 0);
  const pct = totalSteps ? Math.round((doneTotal / totalSteps) * 100) : 0;
  const currentIdx = steps.findIndex((s: Step) => !done[s.id]);
  const finished = currentIdx === -1 && totalSteps > 0;
  const currentStep: Step | null = finished || currentIdx < 0 ? null : steps[currentIdx];
  const position = finished ? totalSteps : currentIdx + 1;

  const lastStep: Step | null = path.lastStepId ? stepById[path.lastStepId] : null;
  const resuming = !!(lastStep && !done[lastStep.id]);
  const resumeStep: Step | null = resuming ? lastStep : currentStep;
  const freshStart = !resuming && doneTotal === 0;

  const stepState = (step: Step) => (done[step.id] ? 'done' : currentStep && step.id === currentStep.id ? 'current' : 'upcoming');
  const msDoneCount = (m: Milestone) => m.steps.reduce((n: number, s: Step) => n + (done[s.id] ? 1 : 0), 0);

  // Step search: matches a step on its title, the topics it covers or its milestone name.
  const q = query.trim().toLowerCase();
  const searching = q.length > 0;
  const results: Step[] = useMemo(
    () =>
      searching
        ? steps.filter((s: Step) => [s.title, s.covers, s.section.title, s.section.title_en].some((v) => (v || '').toLowerCase().includes(q)))
        : [],
    [searching, q, steps]
  );

  const openStep = useCallback(
    (step: Step) => {
      updatePath((p) => ({ ...p, lastStepId: step.id, lastAt: Date.now() }));
      router.push({ pathname: '/summaries/[slug]', params: { slug: step.id } });
    },
    [updatePath]
  );

  const toggleMilestone = (id: string) =>
    setOpenMs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const scrollToMilestone = (id: string) => {
    setOpenMs((prev) => new Set(prev).add(id));
    setTimeout(() => scrollRef.current?.scrollTo({ y: Math.max(0, pathY.current + (offsets.current[id] || 0) - 8), animated: true }), 250);
  };

  const passCheckpoint = (m: Milestone, next: Milestone | null) => {
    updatePath((p) => ({ ...p, checkpoints: { ...p.checkpoints, [m.id]: true } }));
    if (next) scrollToMilestone(next.id);
  };
  const redoCheckpoint = (m: Milestone) =>
    updatePath((p) => {
      const checkpoints = { ...p.checkpoints };
      delete checkpoints[m.id];
      return { ...p, checkpoints };
    });

  const header = (
    <View>
      <AppBar />
      <FreeAllowanceBanner />
    </View>
  );

  if (guideState === 'loading') {
    return (
      <Screen header={header}>
        <Spinner fullScreen label={t.loading} />
      </Screen>
    );
  }
  if (guideState === 'error') {
    return (
      <Screen header={header}>
        <EmptyState icon="alert-triangle" tone="error" title={t.errorTitle} body={t.errorBody}>
          <Button label={t.retry} onPress={() => setReload((n) => n + 1)} />
        </EmptyState>
      </Screen>
    );
  }
  if (noContent) {
    return (
      <Screen header={header}>
        <EmptyState icon="hourglass" title={t.comingSoonTitle(trackLabel(track, lang))} body={t.comingSoonBody(examLabel(track, lang))}>
          <T size={13} color={colors.textLight} align="center">
            {t.comingSoonNote}
          </T>
        </EmptyState>
      </Screen>
    );
  }

  const renderStep = (step: Step) => {
    const state = stepState(step);
    const isResume = resuming && lastStep && step.id === lastStep.id;
    const unlocked = isStepUnlocked(step, isSubscriber);

    // Locked steps still show their title and their "why": a student should see
    // exactly what the subscription contains before paying. What is withheld is
    // the lesson itself and its questions.
    if (!unlocked) {
      return (
        <Card key={step.id} pad={14} style={{ gap: 8, opacity: 0.95 }}>
          <Row gap={8} wrap>
            <T weight="bold" size={12} color={colors.textLight}>
              {t.stepNo(step.no)}
            </T>
            <Row gap={4}>
              <Icon name="lock" size={12} color={colors.warning} />
              <T weight="bold" size={12} color={colors.warning}>
                {t.lockedTag}
              </T>
            </Row>
          </Row>
          <T ltr weight="bold" size={16}>
            {step.title}
          </T>
          <T ltr size={13} color={colors.textMedium}>
            {step.why}
          </T>
          <Button label={t.lockedCta} size="sm" onPress={() => router.push('/subscribe')} />
        </Card>
      );
    }

    return (
      <Card
        key={step.id}
        pad={14}
        style={{ gap: 8, borderColor: state === 'current' ? colors.primary : colors.border, borderWidth: state === 'current' ? 2 : 1 }}
      >
        <Row gap={8} wrap>
          <T weight="bold" size={12} color={colors.textLight}>
            {t.stepNo(step.no)}
          </T>
          {state === 'done' ? (
            <Row gap={4}>
              <Icon name="check" size={12} color={colors.success} strokeWidth={3} />
              <T weight="bold" size={12} color={colors.success}>
                {t.stateDone}
              </T>
            </Row>
          ) : state === 'current' ? (
            <Row gap={4}>
              <Icon name="zap" size={12} color={colors.primary} />
              <T weight="bold" size={12} color={colors.primary}>
                {t.stateCurrent}
              </T>
            </Row>
          ) : (
            <T size={12} color={colors.textLight}>
              {t.stateUpcoming}
            </T>
          )}
          {isResume ? (
            <Row gap={4}>
              <Icon name="clock" size={12} color={colors.warning} />
              <T weight="bold" size={12} color={colors.warning}>
                {t.stateResume}
              </T>
            </Row>
          ) : null}
          {!isSubscriber && step.free ? (
            <T weight="bold" size={12} color={colors.success}>
              {t.freeTag}
            </T>
          ) : null}
        </Row>

        {/* Title, "why" and "covers" are authored study material: English in both languages. */}
        <T ltr weight="bold" size={16}>
          {step.title}
        </T>
        <T ltr size={13} color={colors.textMedium}>
          {step.why}
        </T>
        {step.covers ? (
          <T size={12} color={colors.textLight}>
            {t.willLearn} <T ltr size={12} color={colors.textLight}>{step.covers}</T>
          </T>
        ) : null}
        {step.questionCount > 0 ? (
          <Row gap={6}>
            <Icon name="target" size={13} color={colors.textLight} />
            <T size={12} color={colors.textLight}>
              {step.questionCount} {t.practiceQuestions}
            </T>
          </Row>
        ) : null}

        <Row gap={8} justify="space-between" wrap>
          <Button
            label={state === 'done' ? t.ctaReview : state === 'current' ? t.ctaContinue : t.ctaOpen}
            size="sm"
            full={false}
            onPress={() => openStep(step)}
          />
          <TouchableOpacity
            onPress={() => toggleDone(step.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: state === 'done' }}
            accessibilityLabel={state === 'done' ? t.markedTitle : t.markTitle}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1.5,
              borderColor: state === 'done' ? colors.success : colors.border,
              backgroundColor: state === 'done' ? colors.successBg : colors.surface,
            }}
          >
            <Icon name={state === 'done' ? 'check' : 'circle'} size={13} color={state === 'done' ? colors.success : colors.textLight} />
            <T size={12} weight="semibold" color={state === 'done' ? colors.success : colors.textMedium}>
              {state === 'done' ? t.marked : t.markDone}
            </T>
          </TouchableOpacity>
        </Row>
      </Card>
    );
  };

  return (
    <Screen header={header} scrollRef={scrollRef} contentStyle={{ gap: 16 }}>
      <View style={{ gap: 10 }}>
        <Row gap={6}>
          <Icon name="rocket" size={14} color={colors.primary} />
          <T weight="bold" size={12} color={colors.primary}>
            {t.eyebrow}
          </T>
        </Row>
        <T weight="extrabold" size={22}>
          {t.title}
        </T>
        <Row wrap gap={14}>
          {[
            ['flag', milestones.length, t.factMilestones],
            ['book-open', totalSteps, t.factSteps],
            ['target', totalQuestions, t.factQuestions],
          ].map(([icon, n, label]) => (
            <Row key={label as string} gap={6}>
              <Icon name={icon as string} size={15} color={colors.textMedium} />
              <T size={13} color={colors.textMedium}>
                <T size={13} weight="extrabold" ltr>{n as number}</T> {label as string}
              </T>
            </Row>
          ))}
        </Row>

        {/* Position on the path. */}
        <Card pad={14} style={{ gap: 10 }}>
          <Row justify="space-between" wrap gap={8}>
            <T size={13} weight="semibold">
              {finished ? (
                t.pathComplete
              ) : (
                <>
                  {t.stepXofYBefore} <T size={13} weight="extrabold" ltr>{position}</T> {t.stepXofYAfter(totalSteps)}
                </>
              )}
            </T>
            <T size={13} color={colors.textMedium}>
              <T size={13} weight="extrabold" ltr>{pct}%</T> {t.pctComplete} · <T size={13} ltr>{doneTotal}</T> {t.stepsDone}
            </T>
          </Row>
          <View accessibilityLabel={t.progressAria}>
            <ProgressBar pct={pct} height={10} />
            <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, flexDirection: 'row' }} pointerEvents="none">
              {ticks.map((tick) => (
                <View key={tick.id} style={{ position: 'absolute', top: 0, bottom: 0, width: 2, backgroundColor: colors.surface, left: `${tick.pos}%` }} />
              ))}
            </View>
          </View>
          <Row wrap gap={8}>
            {milestones.map((m: Milestone) => {
              const nDone = msDoneCount(m);
              return (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => scrollToMilestone(m.id)}
                  accessibilityRole="button"
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    borderRadius: 999,
                    borderWidth: 1.5,
                    borderColor: nDone === m.steps.length ? colors.success : colors.border,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: m.accent }} />
                  <T ltr size={12}>
                    {m.title}
                  </T>
                  <T ltr size={12} weight="bold">
                    {nDone}/{m.steps.length}
                  </T>
                </TouchableOpacity>
              );
            })}
          </Row>
        </Card>

        {/* Start / continue. */}
        {finished ? (
          <Card pad={14} style={{ gap: 4, borderColor: colors.success }}>
            <Row gap={8}>
              <Icon name="trophy" size={22} color={colors.warning} />
              <T weight="extrabold" size={15}>
                {t.pathComplete}
              </T>
            </Row>
            <T weight="bold">{t.finishedTitle(totalSteps)}</T>
            <T size={13} color={colors.textMedium}>
              {t.finishedWhy}
            </T>
          </Card>
        ) : resumeStep ? (
          <Card pad={14} style={{ gap: 6, borderColor: colors.primary, borderWidth: 2 }}>
            <Row gap={8}>
              <Icon name={resuming ? 'clock' : freshStart ? 'flag' : 'zap'} size={18} color={colors.primary} />
              <T weight="bold" size={12} color={colors.primary}>
                {resuming ? t.resumeKicker : freshStart ? t.startKicker : t.nextKicker}
              </T>
            </Row>
            <T weight="bold" size={15}>
              {t.resumeStepPrefix} {resumeStep.no} · <T ltr weight="bold" size={15}>{resumeStep.title}</T>
            </T>
            <T ltr size={13} color={colors.textMedium}>
              {resumeStep.why}
            </T>
            <T size={12} color={colors.textLight}>
              <T ltr size={12} color={colors.textLight}>{resumeStep.section.title}</T>
              {resumeStep.questionCount > 0 ? ` · ${resumeStep.questionCount} ${t.questionsSuffix}` : ''}
            </T>
            <Row gap={8} wrap>
              <Button label={resuming || !freshStart ? t.resumeCta : t.startCta} size="sm" full={false} onPress={() => openStep(resumeStep)} />
              <Button label={t.revealOnPath} variant="ghost" size="sm" full={false} onPress={() => scrollToMilestone(resumeStep.milestoneId)} />
            </Row>
          </Card>
        ) : null}

        <Input
          placeholder={t.searchPlaceholder}
          accessibilityLabel={t.searchAria}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          trailing={
            query ? (
              <TouchableOpacity onPress={() => setQuery('')} accessibilityLabel={t.clearSearch} accessibilityRole="button" hitSlop={8}>
                <Icon name="x" size={16} color={colors.textLight} />
              </TouchableOpacity>
            ) : (
              <Icon name="search" size={16} color={colors.textLight} />
            )
          }
        />
      </View>

      {searching ? (
        <View style={{ gap: 10 }}>
          <Row justify="space-between" wrap gap={8}>
            <T size={13} color={colors.textMedium}>
              {t.resultsCount(results.length)} &ldquo;{query.trim()}&rdquo;
            </T>
            <Button label={t.backToPath} icon="x" variant="ghost" size="sm" full={false} onPress={() => setQuery('')} />
          </Row>
          {results.length === 0 ? (
            <EmptyState icon="search" title={`${t.noResultsBefore} "${query.trim()}".`}>
              <Button label={t.clearSearch} variant="secondary" onPress={() => setQuery('')} />
            </EmptyState>
          ) : (
            results.map((step) => {
              const state = stepState(step);
              return (
                <TouchableOpacity key={step.id} activeOpacity={0.85} onPress={() => openStep(step)} accessibilityRole="button">
                  <Row gap={10} style={{ backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.border, padding: 12 }}>
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: state === 'done' ? colors.success : step.section.accent || colors.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {state === 'done' ? (
                        <Icon name="check" size={13} color={colors.white} strokeWidth={3} />
                      ) : (
                        <T size={12} weight="extrabold" color={colors.white} ltr>
                          {step.no}
                        </T>
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <T ltr weight="bold" size={14}>
                        {step.title}
                      </T>
                      <T ltr size={12} color={colors.textLight} numberOfLines={2}>
                        {step.covers}
                      </T>
                      <T ltr size={11} color={colors.textMedium}>
                        {step.section.title}
                      </T>
                    </View>
                    <Chevron />
                  </Row>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      ) : (
        <View style={{ gap: 14 }} onLayout={(e) => (pathY.current = e.nativeEvent.layout.y)}>
          {milestones.map((m: Milestone, mi: number) => {
            const nDone = msDoneCount(m);
            const nTotal = m.steps.length;
            const msPct = nTotal ? Math.round((nDone / nTotal) * 100) : 0;
            const complete = nDone === nTotal;
            const isOpen = openMs.has(m.id);
            const isCurrent = !!currentStep && currentStep.milestoneId === m.id;
            const next = milestones[mi + 1] || null;
            return (
              <View key={m.id} style={{ gap: 10 }} onLayout={(e) => (offsets.current[m.id] = e.nativeEvent.layout.y)}>
                <TouchableOpacity activeOpacity={0.85} onPress={() => toggleMilestone(m.id)} accessibilityRole="button" accessibilityState={{ expanded: isOpen }}>
                  <Card pad={14} style={{ gap: 8, borderColor: isCurrent ? m.accent : colors.border, borderWidth: isCurrent ? 2 : 1 }}>
                    <Row gap={12} align="flex-start">
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: complete ? colors.success : m.accent,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {complete ? <Icon name="check" size={18} color={colors.white} strokeWidth={3} /> : <T weight="extrabold" size={15} color={colors.white} ltr>{m.order}</T>}
                      </View>
                      <View style={{ flex: 1, gap: 2 }}>
                        <T size={12} color={colors.textLight}>
                          {t.milestoneKicker(m.order, milestones.length)} · <T size={12} color={colors.textLight} ltr>{m.tagline}</T>
                          {isCurrent ? <T size={12} weight="bold" color={colors.primary}>{`  ${t.youAreHere}`}</T> : null}
                        </T>
                        <Row gap={8}>
                          <Icon name={m.icon} size={18} color={m.accent} />
                          <T ltr weight="extrabold" size={17} style={{ flex: 1 }}>
                            {m.title}
                          </T>
                        </Row>
                        <T ltr size={12} color={colors.textMedium}>
                          {m.goal}
                        </T>
                        <T size={12} color={colors.textLight}>
                          {nTotal} {t.milestoneSteps} · {m.questionCount} {t.milestoneQuestions}
                        </T>
                      </View>
                      <View style={{ alignItems: 'center', gap: 2 }}>
                        <Ring pct={msPct} color={m.accent} />
                        <T size={10} color={colors.textLight} ltr>
                          {nDone}/{nTotal}
                        </T>
                        <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textLight} />
                      </View>
                    </Row>
                  </Card>
                </TouchableOpacity>

                {isOpen ? (
                  <View style={{ gap: 10 }}>
                    {m.steps.map(renderStep)}
                    {/* A checkpoint quizzes the whole milestone, most of which a free
                        account has not been shown, so it is subscribers only. */}
                    {isSubscriber ? (
                      <PathCheckpoint
                        milestone={m}
                        nextMilestone={next}
                        passed={!!path.checkpoints?.[m.id]}
                        doneCount={nDone}
                        onPass={() => passCheckpoint(m, next)}
                        onRedo={() => redoCheckpoint(m)}
                      />
                    ) : null}
                  </View>
                ) : null}
              </View>
            );
          })}

          <Card pad={16} style={{ gap: 6, alignItems: 'center', borderColor: finished ? colors.warning : colors.border }}>
            <Icon name="trophy" size={26} color={finished ? colors.warning : colors.textLight} />
            <T weight="extrabold" size={16} align="center">
              {finished ? t.endTitleDone : t.endTitle}
            </T>
            <T size={13} color={colors.textMedium} align="center">
              {finished ? t.endBodyDone(totalSteps, milestones.length) : t.endBody(totalSteps - doneTotal)}
            </T>
          </Card>
        </View>
      )}
    </Screen>
  );
}
