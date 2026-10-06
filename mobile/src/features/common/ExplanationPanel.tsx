import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useCommon } from '@/i18n';
import { api } from '@/lib/api';
import { colors, radius } from '@/theme';
import { Icon, Row, Span, T } from '@/ui';

/**
 * The "why this answer is correct" panel, shared by the quiz screen and every
 * review surface (results, wrong questions, mock-exam review, attempts).
 *
 * The explanation is study content: it comes from the database in English and
 * is rendered verbatim in both UI languages, so only the header label follows
 * the UI language and the body is pinned left-to-right. Same rule as the
 * question stem and its options.
 *
 * Props:
 *   explanation  the markdown-subset string; renders nothing when empty
 *   questionId   fetch the explanation on first open instead of receiving it,
 *                for rows that omit the column on purpose
 *   defaultOpen  start expanded (study mode) vs collapsed (reviews)
 */

/** `**bold**` and `*italic*`: the only inline markup these explanations use. */
export function inlineRuns(text: string): { text: string; bold?: boolean; italic?: boolean }[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part) => {
    if (part.startsWith('**') && part.endsWith('**')) return { text: part.slice(2, -2), bold: true };
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return { text: part.slice(1, -1), italic: true };
    return { text: part };
  });
}

export type ExplainBlock = { kind: 'p'; text: string; section: boolean } | { kind: 'ul'; items: string[] };

/**
 * Markdown subset: `- ` bullet runs become lists, every other non-empty line a
 * paragraph; a line opening with bold is a section label ("**Diagnosis:**").
 */
export function explainBlocks(explanation: string): ExplainBlock[] {
  const blocks: ExplainBlock[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (bullets.length) blocks.push({ kind: 'ul', items: bullets });
    bullets = [];
  };
  String(explanation)
    .split('\n')
    .forEach((raw) => {
      const line = raw.trim();
      if (!line) return flush();
      const bullet = /^-\s+(.*)$/.exec(line);
      if (bullet) {
        bullets.push(bullet[1]);
        return;
      }
      flush();
      blocks.push({ kind: 'p', text: line, section: line.startsWith('**') });
    });
  flush();
  return blocks;
}

function Inline({ text, size = 14 }: { text: string; size?: number }) {
  return (
    <T ltr size={size} color={colors.text} lh={1.55}>
      {inlineRuns(text).map((run, i) => (
        <Span key={i} ltr size={size} color={colors.text} weight={run.bold ? 'bold' : 'regular'} style={{ fontStyle: run.italic ? 'italic' : 'normal' }}>
          {run.text}
        </Span>
      ))}
    </T>
  );
}

export function ExplanationBody({ explanation }: { explanation: string }) {
  return (
    <View style={{ gap: 6 }}>
      {explainBlocks(explanation).map((block, i) =>
        block.kind === 'ul' ? (
          <View key={i} style={{ gap: 4 }}>
            {block.items.map((item, j) => (
              <Row key={j} gap={8} align="flex-start" ltr>
                <T ltr size={14} color={colors.primary} weight="bold">
                  •
                </T>
                <View style={{ flex: 1 }}>
                  <Inline text={item} />
                </View>
              </Row>
            ))}
          </View>
        ) : (
          <View key={i} style={{ marginTop: block.section ? 6 : 0 }}>
            <Inline text={block.text} />
          </View>
        )
      )}
    </View>
  );
}

export function ExplanationPanel({
  explanation,
  questionId = null,
  defaultOpen = false,
}: {
  explanation?: string | null;
  questionId?: number | null;
  defaultOpen?: boolean;
}) {
  const t = useCommon().explanation;
  const [open, setOpen] = useState(defaultOpen);
  // null = not fetched yet, '' = fetched and this question has none.
  const [fetched, setFetched] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const provided = explanation && String(explanation).trim() ? String(explanation) : null;
  const lazy = !provided && questionId != null;

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (!next || !lazy || fetched !== null || loading) return;
    setLoading(true);
    api
      .get(`/api/questions/${questionId}/explanation`)
      .then((res) => setFetched(res?.explanation || ''))
      .catch(() => setFetched(''))
      .finally(() => setLoading(false));
  };

  // Nothing to disclose and no way to go and get one.
  if (!provided && !lazy) return null;

  const body = provided ?? fetched;

  return (
    <View
      style={{
        borderRadius: radius.md,
        borderWidth: 1.5,
        borderColor: open ? colors.primary : colors.border,
        backgroundColor: open ? colors.surface2 : colors.surface,
        overflow: 'hidden',
      }}
    >
      <TouchableOpacity
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        activeOpacity={0.8}
        style={{ padding: 12 }}
      >
        <Row gap={8}>
          <Icon name="lightbulb" size={17} color={colors.primary} />
          <T weight="bold" size={14} color={colors.primary} style={{ flex: 1 }}>
            {t.title}
          </T>
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={17} color={colors.primary} />
        </Row>
      </TouchableOpacity>
      {open ? (
        <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
          {loading ? <T ltr>…</T> : body ? <ExplanationBody explanation={body} /> : <T size={13} color={colors.textLight}>{t.unavailable}</T>}
        </View>
      ) : null}
    </View>
  );
}
