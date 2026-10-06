import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { formatDate, useCopy, useLang } from '@/i18n';
import analysisCopy from '@/i18n/copy/analysis.js';
import { api, isAborted } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { getSourceLabel, getTypeLabel } from '@/lib/labels';
import { colors } from '@/theme';
import { Button, Card, EmptyState, Icon, Input, Row, Spinner, T } from '@/ui';
import { TabScreen } from '@/features/common/TabScreen';
import { ReviewCard } from './parts';

const DEBOUNCE_MS = 350;
const LIMIT = 20;

/**
 * The wrong-answer review list, with search.
 *
 * Search is a SERVER query, not a filter over the rows already on screen: the
 * list is paginated 20 at a time, so filtering the loaded page would search a
 * window rather than a history. The endpoint takes `q` and `type` and returns a
 * matching total plus per-specialty counts, so the header count and the filter
 * chips always describe the same result set.
 */
export default function WrongQuestionsScreen() {
  const t = useCopy(analysisCopy).wrong;
  const { lang } = useLang();
  const { user } = useAuth();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [byType, setByType] = useState<{ question_type: string; total: number }[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // `search` is what is being typed; `query` is what has actually been sent.
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const fetchPage = useCallback(
    async (nextPage = 0, append = false) => {
      if (!user?.id) return;
      // A fresh search aborts the previous one so a slow response to an earlier
      // keystroke cannot land after, and overwrite, a faster newer one.
      if (!append) {
        abortRef.current?.abort();
        abortRef.current = new AbortController();
      }
      try {
        setError(false);
        if (nextPage === 0) setLoading(true);
        const params: Record<string, unknown> = { limit: LIMIT, offset: nextPage * LIMIT };
        if (query) params.q = query;
        if (typeFilter) params.type = typeFilter;
        const res = await api.get(`/wrong-questions/user/${user.id}`, { params, signal: append ? undefined : abortRef.current!.signal });
        const next: any[] = res.wrongQuestions || [];
        setRows((prev) => (append ? [...prev, ...next] : next));
        setTotal(res.total || 0);
        if (Array.isArray(res.byType)) setByType(res.byType);
        setHasMore((nextPage + 1) * LIMIT < (res.total || 0));
        setPage(nextPage);
      } catch (err) {
        if (isAborted(err)) return;
        setError(true);
      }
      // Not in `finally`: an aborted request must not clear loading for the
      // newer request that superseded it.
      setLoading(false);
    },
    [user?.id, query, typeFilter]
  );

  // Any change of query or filter restarts pagination from page 0.
  useEffect(() => {
    void fetchPage(0, false);
  }, [fetchPage]);

  // Debounce the typed term into the committed one.
  useEffect(() => {
    const trimmed = search.trim();
    if (trimmed === query) return undefined;
    const handle = setTimeout(() => setQuery(trimmed), DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [search, query]);

  const clearSearch = () => {
    setSearch('');
    setQuery('');
    setTypeFilter('');
  };

  const isFiltering = !!(query || typeFilter);
  const pendingSearch = search.trim() !== query;
  // "No wrong questions" is only true when nothing is filtered: with a search
  // active an empty list is a no-results state, and congratulating someone for
  // a failed search would be absurd.
  const trulyEmpty = !isFiltering && !loading && rows.length === 0;

  return (
    <TabScreen
      contentStyle={{ gap: 14 }}
      onRefresh={async () => {
        await fetchPage(0, false);
      }}
      refreshing={false}
    >
      <View style={{ gap: 2 }}>
        <T weight="extrabold" size={22}>
          {t.title}
        </T>
        <T color={colors.textLight}>{t.subtitle}</T>
      </View>

      {loading && rows.length === 0 && !isFiltering ? (
        <Spinner fullScreen label={t.loading} />
      ) : error ? (
        <EmptyState icon="x-circle" tone="error" title={t.error}>
          <Button label={t.retry} onPress={() => void fetchPage(0, false)} />
        </EmptyState>
      ) : trulyEmpty ? (
        <EmptyState icon="sparkles" title={t.emptyTitle} body={t.emptyBody}>
          <Button label={t.emptyCta} onPress={() => router.replace('/(tabs)')} />
        </EmptyState>
      ) : (
        <>
          <View style={{ gap: 10 }}>
            <Input
              placeholder={t.searchPlaceholder}
              accessibilityLabel={t.searchLabel}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
              trailing={
                search ? (
                  <TouchableOpacity onPress={clearSearch} accessibilityLabel={t.searchClear} accessibilityRole="button" hitSlop={8}>
                    <Icon name="x" size={16} color={colors.textLight} />
                  </TouchableOpacity>
                ) : (
                  <Icon name="search" size={16} color={colors.textLight} />
                )
              }
            />
            {byType.length > 1 ? (
              <Row wrap gap={8} accessibilityLabel={t.filterAll}>
                {[{ question_type: '', total: undefined as number | undefined }, ...byType].map((f) => {
                  const on = typeFilter === f.question_type;
                  return (
                    <TouchableOpacity
                      key={f.question_type || 'all'}
                      onPress={() => setTypeFilter(f.question_type)}
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
                      <Row gap={6}>
                        <T size={12} weight="semibold" color={on ? colors.primary : colors.text}>
                          {f.question_type ? getTypeLabel(f.question_type, lang) : t.filterAll}
                        </T>
                        {f.total != null ? (
                          <T size={11} color={colors.textLight} ltr>
                            {f.total}
                          </T>
                        ) : null}
                      </Row>
                    </TouchableOpacity>
                  );
                })}
              </Row>
            ) : null}
            {isFiltering ? (
              <T size={13} color={colors.textLight} accessibilityRole="alert">
                {pendingSearch ? t.searching : query ? t.resultsFor(total, query) : t.resultsFiltered(total)}
              </T>
            ) : null}
          </View>

          {rows.length === 0 ? (
            <EmptyState icon="search" title={t.noResultsTitle} body={t.noResultsBody}>
              <Button label={t.noResultsCta} variant="secondary" onPress={clearSearch} />
            </EmptyState>
          ) : (
            <>
              <T size={13} color={colors.textLight}>
                {t.summary(total, rows.length)}
              </T>
              {rows.map((q, i) => (
                <ReviewCard
                  key={q.id || i}
                  typeLabel={getTypeLabel(q.question_type, lang)}
                  sourceLabel={getSourceLabel(q.source, lang)}
                  dateLabel={formatDate(q.attempted_at, lang)}
                  question={q.question_text}
                  yourAnswer={q.selected_option}
                  yourAnswerLabel={t.yourAnswer}
                  correctAnswer={q.correct_option}
                  correctAnswerLabel={t.correctAnswer}
                  isCorrect={false}
                  explanation={q.explanation}
                />
              ))}
              {hasMore ? (
                <Button
                  label={loading ? t.loadingMore : t.loadMore(Math.min(LIMIT, total - rows.length))}
                  variant="secondary"
                  disabled={loading}
                  onPress={() => void fetchPage(page + 1, true)}
                />
              ) : null}
            </>
          )}
        </>
      )}
    </TabScreen>
  );
}
