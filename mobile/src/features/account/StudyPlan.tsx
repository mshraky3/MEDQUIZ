import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { formatNumber, useCopy, useLang } from '@/i18n';
import quizCopy from '@/i18n/copy/quiz.js';
import { ApiError, api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { getSourceLabel, getTypeLabel } from '@/lib/labels';
import { KEYS, getItem, setItem } from '@/lib/storage';
import type { Specialty } from '@/lib/tracks';
import { colors, radius } from '@/theme';
import { Button, Card, DatePickerDialog, Icon, Input, Row, T, toISO } from '@/ui';

const TYPE_PRESETS: Record<string, number[]> = {
  questions: [50, 100, 200, 300],
  quizzes: [5, 10, 20, 30],
  accuracy: [60, 70, 80, 90],
};

// 2*pi*r for r=34, the goal ring's radius: the dash length that makes
// strokeDashoffset behave as a 0-100% fill.
const RING_CIRCUMFERENCE = 2 * Math.PI * 34;

const LinkBtn = ({ label, onPress, muted }: { label: string; onPress: () => void; muted?: boolean }) => (
  <TouchableOpacity onPress={onPress} hitSlop={8} accessibilityRole="button">
    <T weight="semibold" size={13} color={muted ? colors.textLight : colors.primary}>
      {label}
    </T>
  </TouchableOpacity>
);

const Choice = ({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    accessibilityRole="button"
    accessibilityState={{ selected: on }}
    style={{
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      borderWidth: 1.5,
      borderColor: on ? colors.primary : colors.border,
      backgroundColor: on ? colors.infoBg : colors.surface,
    }}
  >
    <T size={12} weight="semibold" color={on ? colors.primary : colors.text}>
      {label}
    </T>
  </TouchableOpacity>
);

type Goal = {
  goalType: 'questions' | 'quizzes' | 'accuracy';
  period: 'weekly' | 'total';
  target: number;
  current: number;
  percent: number;
  achieved: boolean;
  questionType?: string | null;
  source?: string | null;
};

/**
 * The student's own commitment, and how far along it is. The number is theirs:
 * the card asks for a target instead of assigning one. A goal can be scoped to a
 * specialty and/or a collection; a quizzes goal has no scope (a quiz can mix
 * specialties) and the server drops any that are sent.
 */
export function GoalCard({ specialties, sources }: { specialties: Specialty[]; sources: { key: string }[] }) {
  const t = useCopy(quizCopy).hub;
  const { lang } = useLang();
  const g = t.goal;
  const p = t.progress;
  const fmt = (n: number) => formatNumber(n, lang);

  const [goal, setGoal] = useState<Goal | null>(null);
  const [progress, setProgress] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<{ goalType: Goal['goalType']; period: Goal['period']; target: string; questionType: string | null; source: string | null }>({
    goalType: 'questions',
    period: 'weekly',
    target: '100',
    questionType: null,
    source: null,
  });

  const load = useCallback(async () => {
    const [goalRes, progRes] = await Promise.allSettled([api.get('/api/goals'), api.get('/api/progress/weekly')]);
    if (goalRes.status === 'fulfilled' && goalRes.value?.success) setGoal(goalRes.value.goal);
    if (progRes.status === 'fulfilled' && progRes.value?.success) setProgress(progRes.value);
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const data = await api.put('/api/goals', {
        goalType: form.goalType,
        period: form.period,
        target: Number(form.target),
        // A quizzes goal cannot be scoped.
        questionType: form.goalType === 'quizzes' ? null : form.questionType,
        source: form.goalType === 'quizzes' ? null : form.source,
      });
      if (!data?.success) throw new Error(data?.message || 'failed');
      setGoal(data.goal);
      setEditing(false);
    } catch (err) {
      setError((err instanceof ApiError && err.data?.message) || g.saveError);
    } finally {
      setSaving(false);
    }
  };

  const clear = async () => {
    try {
      await api.delete('/api/goals');
      setGoal(null);
    } catch {
      /* leave the card as-is; nothing was lost */
    }
  };

  const startEditing = () => {
    if (goal) {
      setForm({
        goalType: goal.goalType,
        period: goal.period,
        target: String(goal.target),
        questionType: goal.questionType || null,
        source: goal.source || null,
      });
    }
    setError('');
    setEditing(true);
  };

  const isAccuracy = form.goalType === 'accuracy';
  const canScope = form.goalType !== 'quizzes';
  const showSources = canScope && sources.length > 1;

  if (editing) {
    return (
      <Card style={{ gap: 14 }}>
        <Row gap={8}>
          <Icon name="target" size={17} color={colors.primary} />
          <T weight="bold" size={16}>
            {g.title}
          </T>
        </Row>

        <View style={{ gap: 8 }}>
          <T size={12} weight="semibold" color={colors.textLight}>
            {g.typeLabel}
          </T>
          <Row wrap gap={8}>
            {(
              [
                ['questions', g.typeQuestions],
                ['quizzes', g.typeQuizzes],
                ['accuracy', g.typeAccuracy],
              ] as const
            ).map(([key, label]) => (
              <Choice
                key={key}
                label={label}
                on={form.goalType === key}
                onPress={() =>
                  setForm((f) => ({
                    ...f,
                    goalType: key,
                    target: String(TYPE_PRESETS[key][1]),
                    // Accuracy is a rate over a window; the server forces weekly and so do we.
                    period: key === 'accuracy' ? 'weekly' : f.period,
                  }))
                }
              />
            ))}
          </Row>
        </View>

        {!isAccuracy ? (
          <View style={{ gap: 8 }}>
            <T size={12} weight="semibold" color={colors.textLight}>
              {g.periodLabel}
            </T>
            <Row wrap gap={8}>
              {(
                [
                  ['weekly', g.periodWeekly],
                  ['total', g.periodTotal],
                ] as const
              ).map(([key, label]) => (
                <Choice key={key} label={label} on={form.period === key} onPress={() => setForm((f) => ({ ...f, period: key }))} />
              ))}
            </Row>
          </View>
        ) : null}

        <View style={{ gap: 8 }}>
          <T size={12} weight="semibold" color={colors.textLight}>
            {g.targetLabel}
          </T>
          <Row wrap gap={8}>
            {TYPE_PRESETS[form.goalType].map((n) => (
              <Choice
                key={n}
                label={`${fmt(n)}${isAccuracy ? g.accuracyUnit : ''}`}
                on={Number(form.target) === n}
                onPress={() => setForm((f) => ({ ...f, target: String(n) }))}
              />
            ))}
          </Row>
          <Input value={form.target} onChangeText={(v) => setForm((f) => ({ ...f, target: v.replace(/\D/g, '').slice(0, 4) }))} keyboardType="number-pad" ltr />
        </View>

        {canScope ? (
          <View style={{ gap: 8 }}>
            <T size={12} weight="semibold" color={colors.textLight}>
              {g.scopeLabel}
            </T>
            <Row wrap gap={8}>
              <Choice label={g.scopeAll} on={!form.questionType} onPress={() => setForm((f) => ({ ...f, questionType: null }))} />
              {specialties.map(({ key }) => (
                <Choice key={key} label={getTypeLabel(key, lang)} on={form.questionType === key} onPress={() => setForm((f) => ({ ...f, questionType: key }))} />
              ))}
            </Row>
            <T size={12} color={colors.textLight}>
              {g.scopeHint}
            </T>
          </View>
        ) : (
          <T size={12} color={colors.textLight}>
            {g.scopeNotForQuizzes}
          </T>
        )}

        {showSources ? (
          <View style={{ gap: 8 }}>
            <T size={12} weight="semibold" color={colors.textLight}>
              {g.scopeSourceLabel}
            </T>
            <Row wrap gap={8}>
              <Choice label={g.scopeSourceAll} on={!form.source} onPress={() => setForm((f) => ({ ...f, source: null }))} />
              {sources.map(({ key }) => (
                <Choice key={key} label={getSourceLabel(key, lang)} on={form.source === key} onPress={() => setForm((f) => ({ ...f, source: key }))} />
              ))}
            </Row>
          </View>
        ) : null}

        {error ? (
          <T size={13} color={colors.error}>
            {error}
          </T>
        ) : null}
        <Button label={g.saveCta} onPress={() => void save()} loading={saving} />
        <Button label={g.cancelCta} variant="ghost" onPress={() => setEditing(false)} disabled={saving} />
      </Card>
    );
  }

  if (!goal) {
    return (
      <Card style={{ gap: 10 }}>
        <Row gap={12} align="flex-start">
          <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.surfaceTint, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="target" size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <T weight="bold" size={15}>
              {g.noneTitle}
            </T>
            <T size={13} color={colors.textMedium}>
              {g.noneBody}
            </T>
          </View>
        </Row>
        <Button label={g.setCta} size="sm" onPress={startEditing} />
      </Card>
    );
  }

  const pctClamped = Math.max(0, Math.min(100, goal.percent));
  const remaining = Math.max(0, goal.target - goal.current);
  const unit = goal.goalType === 'accuracy' ? g.accuracyUnit : '';
  const delta =
    progress && progress.accuracyThisWeek != null && progress.accuracyLastWeek != null
      ? progress.accuracyThisWeek - progress.accuracyLastWeek
      : null;

  return (
    <Card style={{ gap: 14, borderColor: goal.achieved ? colors.success : colors.border }}>
      <Row justify="space-between">
        <Row gap={8}>
          <Icon name="target" size={17} color={colors.primary} />
          <T weight="bold" size={16}>
            {g.title}
          </T>
        </Row>
        <Row gap={14}>
          <LinkBtn label={g.changeCta} onPress={startEditing} />
          <LinkBtn label={g.clearCta} onPress={() => void clear()} muted />
        </Row>
      </Row>

      <Row gap={16}>
        <View style={{ width: 80, height: 80 }} accessibilityLabel={g.progressOf(fmt(goal.current), fmt(goal.target))}>
          <Svg width={80} height={80} viewBox="0 0 80 80" style={{ transform: [{ rotate: '-90deg' }] }}>
            <Circle cx={40} cy={40} r={34} stroke={colors.surfaceTint} strokeWidth={8} fill="none" />
            <Circle
              cx={40}
              cy={40}
              r={34}
              stroke={goal.achieved ? colors.success : colors.primary}
              strokeWidth={8}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE * (1 - pctClamped / 100)}
            />
          </Svg>
          <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
            <T weight="extrabold" size={16} ltr>
              {pctClamped}%
            </T>
          </View>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <T weight="extrabold" size={20} ltr>
            {fmt(goal.current)}
            {unit} / {fmt(goal.target)}
            {unit}
          </T>
          <T size={13} color={colors.textMedium}>
            {goal.goalType === 'questions' ? g.typeQuestions : goal.goalType === 'quizzes' ? g.typeQuizzes : g.typeAccuracy}
            {goal.period === 'weekly' ? ` · ${g.periodWeekly}` : ''}
          </T>
          {goal.questionType || goal.source ? (
            <Row wrap gap={6}>
              {goal.questionType ? (
                <View style={{ backgroundColor: colors.surface2, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
                  <T size={11} color={colors.textMedium}>
                    {g.inSpecialty(getTypeLabel(goal.questionType, lang))}
                  </T>
                </View>
              ) : null}
              {goal.source ? (
                <View style={{ backgroundColor: colors.surface2, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
                  <T size={11} color={colors.textMedium}>
                    {g.inSource(getSourceLabel(goal.source, lang))}
                  </T>
                </View>
              ) : null}
            </Row>
          ) : null}
          {goal.achieved ? (
            <T size={13} weight="bold" color={colors.success}>
              {g.achieved} <T size={13} color={colors.success}>{g.achievedBody}</T>
            </T>
          ) : (
            <T size={13} color={colors.textMedium}>
              {g.remaining(`${fmt(remaining)}${unit}`)}
            </T>
          )}
        </View>
      </Row>

      {/* Week-on-week comparison: the "am I improving?" answer. */}
      <View style={{ gap: 6, borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: 10 }}>
        <T size={12} weight="bold" color={colors.textLight}>
          {p.title}
        </T>
        {progress && progress.questionsThisWeek > 0 ? (
          <Row wrap gap={8}>
            <View style={{ backgroundColor: colors.surface2, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
              <T size={12}>
                <T size={12} weight="bold" ltr>{fmt(progress.questionsThisWeek)}</T> {p.questionsLabel}
              </T>
            </View>
            {progress.accuracyThisWeek != null ? (
              <View style={{ backgroundColor: colors.surface2, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
                <T size={12}>
                  <T size={12} weight="bold" ltr>{progress.accuracyThisWeek}%</T> {p.accuracyLabel}
                </T>
              </View>
            ) : null}
            {delta == null ? (
              <T size={12} color={colors.textLight}>
                {p.noComparison}
              </T>
            ) : delta > 0 ? (
              <Row gap={4}>
                <Icon name="trending-up" size={14} color={colors.success} />
                <T size={12} color={colors.success} weight="semibold">
                  {p.improved(delta)}
                </T>
              </Row>
            ) : delta < 0 ? (
              <Row gap={4}>
                <Icon name="trending-down" size={14} color={colors.error} />
                <T size={12} color={colors.error} weight="semibold">
                  {p.declined(Math.abs(delta))}
                </T>
              </Row>
            ) : (
              <T size={12} color={colors.textLight}>
                {p.steady}
              </T>
            )}
          </Row>
        ) : (
          <T size={12} color={colors.textLight}>
            {p.empty}
          </T>
        )}
      </View>
    </Card>
  );
}

// How long a "not sure yet" is respected before the ask comes back.
const ASK_AGAIN_AFTER_DAYS = 14;
// Roughly how many questions a day the remaining time allows (~40 per solid
// study hour); shown only when a goal-sized number is actually actionable.
const PACE_MIN_DAYS = 2;
const PACE_MAX_DAYS = 120;
const MAX_DAYS_AHEAD = 730;

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/**
 * The student's own exam countdown. `daysRemaining` comes from the server, not
 * from subtracting dates here: the app and the reminder emails must agree on
 * what "7 days out" means. A passed date is not silently cleared: someone
 * resitting should be asked, because deleting it would also switch off reminders.
 */
export function ExamDateCard({ questionsRemaining }: { questionsRemaining: number }) {
  const t = useCopy(quizCopy).hub;
  const { lang } = useLang();
  const e = t.exam;
  const username = useAuth().user?.username;
  const fmt = (n: number) => formatNumber(n, lang);

  const [exam, setExam] = useState<{ date: string; daysRemaining: number; passed: boolean } | null>(null);
  const [picking, setPicking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  // "No date set" versus "we have not asked the server yet", so the first-run
  // ask cannot flash up before the answer arrives.
  const [loaded, setLoaded] = useState(false);
  const askKey = `sqb.examAsk.${username || 'anon'}`;
  const [askDismissedAt, setAskDismissedAt] = useState(0);
  const [askOpen, setAskOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setAskDismissedAt(Number(await getItem(askKey)) || 0);
      try {
        const data = await api.get('/api/exam-date');
        if (alive && data?.success) setExam(data.exam);
      } catch {
        /* the card simply stays in its empty state */
      } finally {
        if (alive) setLoaded(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [askKey]);

  // The first-run ask: only once the server has answered, only with genuinely no
  // date, and only if the last "not sure yet" has aged out.
  useEffect(() => {
    if (!loaded || exam) return;
    const ageDays = askDismissedAt ? (Date.now() - askDismissedAt) / 86400000 : Infinity;
    if (ageDays >= ASK_AGAIN_AFTER_DAYS) setAskOpen(true);
  }, [loaded, exam, askDismissedAt]);

  const save = async (iso: string) => {
    setSaving(true);
    setError('');
    try {
      const data = await api.put('/api/exam-date', { date: iso });
      if (!data?.success) throw new Error(data?.message || 'failed');
      setExam(data.exam);
      setPicking(false);
      setAskOpen(false);
    } catch (err) {
      setPicking(false);
      setError((err instanceof ApiError && err.data?.message) || e.saveError);
    } finally {
      setSaving(false);
    }
  };

  const clear = async () => {
    try {
      await api.delete('/api/exam-date');
      setExam(null);
    } catch {
      /* leave the card as-is; nothing was lost */
    }
  };

  const dismissAsk = () => {
    const now = Date.now();
    void setItem(askKey, String(now));
    setAskDismissedAt(now);
    setAskOpen(false);
  };

  const today = useMemo(() => new Date(), []);
  const minISO = toISO(today);
  const maxISO = toISO(addDays(today, MAX_DAYS_AHEAD));

  const picker = (
    <DatePickerDialog
      visible={picking}
      value={exam?.date || ''}
      min={minISO}
      max={maxISO}
      title={e.dateLabel}
      confirmLabel={e.saveCta}
      cancelLabel={e.cancelCta}
      onConfirm={(iso) => void save(iso)}
      onClose={() => setPicking(false)}
    />
  );

  const head = (
    <Row justify="space-between">
      <Row gap={8}>
        <Icon name="calendar" size={16} color={colors.primary} />
        <T weight="bold" size={16}>
          {e.title}
        </T>
      </Row>
      {exam ? (
        <Row gap={14}>
          <LinkBtn label={e.changeCta} onPress={() => setPicking(true)} />
          <LinkBtn label={e.clearCta} onPress={() => void clear()} muted />
        </Row>
      ) : null}
    </Row>
  );

  if (!exam) {
    return (
      <>
        <Card style={{ gap: 10 }}>
          <Row gap={12} align="flex-start">
            <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.surfaceTint, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="calendar" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <T weight="bold" size={15}>
                {e.noneTitle}
              </T>
              <T size={13} color={colors.textMedium}>
                {e.noneBody}
              </T>
            </View>
          </Row>
          {error ? <T size={13} color={colors.error}>{error}</T> : null}
          <Button label={e.setCta} size="sm" onPress={() => setPicking(true)} loading={saving} />
        </Card>
        {picker}
        {/* The one proper ask: dismissable with one tap, never blocking. */}
        {askOpen && !picking ? (
          <Card style={{ gap: 10, borderColor: colors.primary, borderWidth: 2 }}>
            <Icon name="calendar" size={24} color={colors.primary} />
            <T weight="extrabold" size={16}>
              {e.askTitle}
            </T>
            <T size={13} color={colors.textMedium}>
              {e.askBody}
            </T>
            <Button label={e.saveCta} onPress={() => setPicking(true)} />
            <Button label={e.askSkip} variant="ghost" onPress={dismissAsk} />
            <T size={12} color={colors.textLight}>
              {e.remindersOn}
            </T>
          </Card>
        ) : null}
      </>
    );
  }

  if (exam.passed) {
    return (
      <>
        <Card style={{ gap: 8 }}>
          {head}
          <T size={13} color={colors.textMedium}>
            {e.passed}
          </T>
        </Card>
        {picker}
      </>
    );
  }

  const days = exam.daysRemaining;
  // Urgency is earned by the real number, never invented.
  const accent = days <= 3 ? colors.error : days <= 14 ? colors.warning : colors.primary;
  const weeks = Math.round(days / 7);
  const pace = questionsRemaining > 0 && days >= PACE_MIN_DAYS && days <= PACE_MAX_DAYS ? Math.ceil(questionsRemaining / days) : null;

  return (
    <>
      <Card style={{ gap: 8, borderColor: accent }}>
        {head}
        {days === 0 ? (
          <T weight="extrabold" size={22} color={accent}>
            {e.today}
          </T>
        ) : days === 1 ? (
          <T weight="extrabold" size={22} color={accent}>
            {e.tomorrow}
          </T>
        ) : (
          <Row gap={8} align="flex-end">
            <T weight="extrabold" size={40} color={accent} ltr style={{ lineHeight: 48 }}>
              {fmt(days)}
            </T>
            <T size={14} color={colors.textMedium} style={{ marginBottom: 8 }}>
              {e.daysLeft}
            </T>
          </Row>
        )}
        <T size={13} color={colors.textLight}>
          <T size={13} color={colors.textLight} ltr>{exam.date}</T>
          {days >= 14 ? ` · ${e.weeksLeft(weeks)}` : ''}
        </T>
        {pace != null ? (
          <T size={13} color={colors.primary} weight="semibold">
            {e.perDay(fmt(pace))}
          </T>
        ) : null}
      </Card>
      {picker}
    </>
  );
}

const MILESTONES = [3, 7, 14, 30, 60, 100, 200, 365];

/** Local YYYY-MM-DD, the same formatting the server uses for the study calendar. */
const ymd = (d: Date) => toISO(d);

/**
 * The streak as something you can act on: it leads with "is today already done,
 * or about to break it?" and shows the last seven days as a strip.
 */
export function StreakCard({ streak, onStartToday }: { streak: any; onStartToday: () => void }) {
  const t = useCopy(quizCopy).hub;
  const { lang } = useLang();
  const s = t.streak;
  const fmt = (n: number) => formatNumber(n, lang);

  const current = Number(streak?.current_streak) || 0;
  const longest = Number(streak?.longest_streak) || 0;
  const activeDays = useMemo(() => new Set<string>(Array.isArray(streak?.active_days) ? streak.active_days : []), [streak]);

  // The last seven calendar days, oldest first.
  const week = useMemo(() => {
    const out: { key: string; dow: number; done: boolean; isToday: boolean }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(today.getTime() - i * 86400000);
      out.push({ key: ymd(d), dow: d.getDay(), done: activeDays.has(ymd(d)), isToday: i === 0 });
    }
    return out;
  }, [activeDays]);

  const studiedToday = streak?.studied_today ?? week[6]?.done ?? false;
  const weekCount = week.filter((d) => d.done).length;
  const nextMilestone = MILESTONES.find((m) => m > current) || null;
  const hitMilestone = MILESTONES.includes(current) && current > 0;
  const isBest = current > 0 && current >= longest;

  if (current === 0) {
    return (
      <Card style={{ gap: 10 }}>
        <Row gap={12} align="flex-start">
          <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.warningBg, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="flame" size={22} color={colors.warning} />
          </View>
          <View style={{ flex: 1 }}>
            <T weight="bold" size={15}>
              {s.none}
            </T>
            <T size={13} color={colors.textMedium}>
              {s.noneBody}
            </T>
          </View>
        </Row>
        <Button label={s.startToday} size="sm" onPress={onStartToday} />
      </Card>
    );
  }

  return (
    <Card style={{ gap: 12, borderColor: studiedToday ? colors.success : colors.warning }}>
      <Row justify="space-between">
        <Row gap={8}>
          <Icon name="flame" size={16} color={colors.warning} />
          <T weight="bold" size={16}>
            {s.title}
          </T>
        </Row>
        {longest > 0 ? (
          <T size={12} color={colors.textLight}>
            {s.best} <T size={12} weight="bold" ltr>{fmt(longest)}</T>
          </T>
        ) : null}
      </Row>

      <Row gap={8} align="flex-end" accessibilityLabel={s.aria(current)}>
        <T weight="extrabold" size={40} color={colors.warning} ltr style={{ lineHeight: 48 }}>
          {fmt(current)}
        </T>
        <T size={14} color={colors.textMedium} style={{ marginBottom: 8 }}>
          {s.unit(current)}
        </T>
      </Row>

      <Row justify="space-between" accessibilityLabel={s.weekLabel}>
        {week.map((d) => (
          <View key={d.key} style={{ alignItems: 'center', gap: 4, flex: 1 }}>
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: d.done ? colors.success : colors.surfaceTint,
                borderWidth: d.isToday ? 2 : 0,
                borderColor: colors.primary,
              }}
            >
              {d.done ? <Icon name="check" size={13} color={colors.white} strokeWidth={3} /> : null}
            </View>
            <T size={10} color={colors.textLight} align="center">
              {s.dayNames[d.dow]}
            </T>
          </View>
        ))}
      </Row>

      {studiedToday ? (
        <T size={13} weight="semibold" color={colors.success}>
          {s.safeToday}
        </T>
      ) : (
        <Row gap={10} wrap>
          <T size={13} weight="semibold" color={colors.warning}>
            {s.atRisk}
          </T>
          <LinkBtn label={s.startToday} onPress={onStartToday} />
        </Row>
      )}
      <T size={12} color={colors.textLight}>
        {hitMilestone
          ? s.milestoneHit(current)
          : isBest
            ? s.bestNow
            : nextMilestone
              ? s.nextMilestone(nextMilestone - current)
              : s.thisWeekCount(fmt(weekCount))}
      </T>
    </Card>
  );
}

