import React from 'react';
import { Linking, View } from 'react-native';
import { router } from 'expo-router';
import { appRouteForWebPath } from '@/lib/webPaths';
import { parseInline, type InlinePart } from './docInline';
import { colors } from '@/theme';
import { Row, Span, T } from '@/ui';

/**
 * Renders the structured copy the website uses for legal documents, study
 * guides and the exam pages. All three share one block language:
 *
 *   { p: 'text' }        a paragraph
 *   { h3: 'text' }       a sub-heading
 *   { ul: ['item', …] }  a bulleted list
 *
 * with inline markup inside any string:
 *   **bold**
 *   [[href|label]]       a link: in-app for site paths, the browser for URLs
 *
 * One renderer over one data shape keeps both languages structurally identical,
 * so a section can never exist in one language and go missing in the other.
 */
export type DocBlock = { p?: string; h3?: string; ul?: string[]; ad?: boolean };
export type DocSection = { heading?: string; blocks: DocBlock[]; ad?: boolean };

export { parseInline };
export type { InlinePart };

/** Opens a link from a document: an external URL in the browser, a site path inside the app. */
export function openDocLink(href: string): void {
  if (/^https?:/i.test(href) || /^mailto:/i.test(href)) {
    Linking.openURL(href).catch(() => {});
    return;
  }
  const target = appRouteForWebPath(href);
  if (target) router.push(target);
}

function Inline({ text, size = 15, color = colors.text }: { text: string; size?: number; color?: string }) {
  return (
    <T size={size} color={color} lh={1.7}>
      {parseInline(text).map((part, i) =>
        part.kind === 'bold' ? (
          <Span key={i} weight="bold" size={size} color={colors.text}>
            {part.text}
          </Span>
        ) : part.kind === 'link' ? (
          <Span key={i} weight="semibold" size={size} color={colors.primary} onPress={() => openDocLink(part.href!)} style={{ textDecorationLine: 'underline' }}>
            {part.text}
          </Span>
        ) : (
          <Span key={i} size={size} color={color}>
            {part.text}
          </Span>
        )
      )}
    </T>
  );
}

export function DocBlocks({ blocks }: { blocks: DocBlock[] }) {
  return (
    <View style={{ gap: 10 }}>
      {blocks.map((block, i) => {
        if (block.h3) {
          return (
            <T key={i} weight="extrabold" size={16} style={{ marginTop: 6 }}>
              {block.h3}
            </T>
          );
        }
        if (block.ul) {
          return (
            <View key={i} style={{ gap: 6 }}>
              {block.ul.map((item, j) => (
                <Row key={j} gap={8} align="flex-start">
                  <T color={colors.primary} weight="bold" style={{ marginTop: 1 }}>
                    •
                  </T>
                  <View style={{ flex: 1 }}>
                    <Inline text={item} />
                  </View>
                </Row>
              ))}
            </View>
          );
        }
        return block.p ? <Inline key={i} text={block.p} /> : null;
      })}
    </View>
  );
}

/** Sections of headed blocks (legal documents, guides, exam pages). The in-article ad slot is dropped: the app has none. */
export function DocSections({ sections }: { sections: DocSection[] }) {
  return (
    <View style={{ gap: 20 }}>
      {sections
        .filter((s) => !s.ad && s.blocks)
        .map((section, si) => (
          <View key={si} style={{ gap: 10 }}>
            {section.heading ? (
              <T weight="extrabold" size={19} style={{ lineHeight: 30 }}>
                {section.heading}
              </T>
            ) : null}
            <DocBlocks blocks={section.blocks} />
          </View>
        ))}
    </View>
  );
}
