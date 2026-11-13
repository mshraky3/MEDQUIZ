import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { API_URL } from '@/config';
import { useLang } from '@/i18n';
import { altFor, IMAGE_UI, noteFor, pictureHeight, QuestionImage, resolveImageUrl, usableImages } from '@/lib/questionImages';
import { colors, radius } from '@/theme';
import { Icon, T } from '@/ui';

/**
 * Clarification pictures and rebuilt tables shown between a question's stem and
 * its options, the same place and note as the website. Display only: it reads
 * `question.images` and touches nothing about answers or scoring.
 * The note follows the UI language; table cells are exam material and stay as stored.
 */
function lightboxWidth(screenWidth: number, height: number, natural: { width: number; height: number } | null) {
  const fit = screenWidth - 24;
  if (!natural || !natural.height) return fit;
  return Math.round(Math.min(Math.max(fit, (height * natural.width) / natural.height), screenWidth * 3));
}

function Picture({ img }: { img: QuestionImage }) {
  const { lang } = useLang();
  const ui = IMAGE_UI[lang === 'ar' ? 'ar' : 'en'];
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [natural, setNatural] = useState<{ width: number; height: number } | null>(null);
  const [open, setOpen] = useState(false);
  const [boxWidth, setBoxWidth] = useState(300);
  const win = useWindowDimensions();
  const uri = resolveImageUrl(img.url, API_URL);
  // A retry bypasses a cached failure: the cache-buster only exists after a failure.
  const source = { uri: attempt ? `${uri}${uri.includes('?') ? '&' : '?'}r=${attempt}` : uri };
  const alt = altFor(img, lang);

  // The load event does not report the picture's size on every platform; ask for it so the box matches the ratio.
  useEffect(() => {
    let live = true;
    Image.getSize(
      uri,
      (width, height) => live && setNatural({ width, height }),
      () => {},
    );
    return () => {
      live = false;
    };
  }, [uri]);

  if (state === 'failed') {
    return (
      <View
        accessibilityRole="alert"
        style={{ padding: 14, gap: 8, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, borderRadius: radius.lg, alignItems: 'center' }}
      >
        <Icon name="alert-triangle" size={20} color={colors.textLight} />
        <T size={13} color={colors.textMedium} align="center">
          {ui.failed}
        </T>
        <TouchableOpacity
          onPress={() => {
            setState('loading');
            setAttempt((n) => n + 1);
          }}
          accessibilityRole="button"
          hitSlop={8}
        >
          <T size={13} weight="bold" color={colors.primary}>
            {ui.retry}
          </T>
        </TouchableOpacity>
      </View>
    );
  }

  const height = pictureHeight(boxWidth, natural);
  return (
    <>
      <Pressable
        onPress={() => state === 'ready' && setOpen(true)}
        accessibilityRole="imagebutton"
        accessibilityLabel={alt || ui.enlarge}
        accessibilityHint={ui.enlarge}
        onLayout={(e) => setBoxWidth(e.nativeEvent.layout.width)}
        style={{ borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: '#fff', height }}
      >
        <Image
          source={source}
          accessibilityLabel={alt}
          resizeMode="contain"
          style={{ width: '100%', height: '100%' }}
          onLoad={(e) => {
            const s = e.nativeEvent?.source;
            if (s?.width && s?.height) setNatural({ width: s.width, height: s.height });
            setState('ready');
          }}
          onError={() => setState('failed')}
        />
        {state === 'loading' ? (
          <View style={{ position: 'absolute', top: 0, bottom: 0, start: 0, end: 0, alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.surface2 }}>
            <ActivityIndicator color={colors.primary} />
            <T size={12} color={colors.textLight}>
              {ui.loading}
            </T>
          </View>
        ) : (
          <View
            pointerEvents="none"
            style={{ position: 'absolute', bottom: 8, end: 8, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(15,23,42,0.55)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="maximize" size={15} color="#fff" />
          </View>
        )}
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)} statusBarTranslucent>
        <Pressable onPress={() => setOpen(false)} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center' }}>
          {/* Tall enough to read on a phone: a wide scan scrolls sideways instead of shrinking to the screen width. */}
          <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingHorizontal: 12 }} showsHorizontalScrollIndicator={false}>
            <Image
              source={source}
              accessibilityLabel={alt}
              resizeMode="contain"
              style={{ height: Math.round(win.height * 0.6), width: lightboxWidth(win.width, win.height * 0.6, natural), backgroundColor: '#fff', borderRadius: radius.md }}
            />
          </ScrollView>
          <TouchableOpacity
            onPress={() => setOpen(false)}
            accessibilityRole="button"
            accessibilityLabel={ui.close}
            style={{ position: 'absolute', top: 36, end: 16, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="x" size={22} color="#fff" />
          </TouchableOpacity>
        </Pressable>
      </Modal>
    </>
  );
}

function RebuiltTable({ table }: { table: NonNullable<QuestionImage['table']> }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator style={{ borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.surface }}>
      <View>
        <View style={{ flexDirection: 'row', backgroundColor: colors.surface2 }}>
          {table.header.map((h, i) => (
            <View key={i} style={{ minWidth: 96, padding: 8 }}>
              <T ltr size={13} weight="semibold">
                {String(h)}
              </T>
            </View>
          ))}
        </View>
        {table.rows.map((r, ri) => (
          <View key={ri} style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border }}>
            {(Array.isArray(r) ? r : [r]).map((c, ci) => (
              <View key={ci} style={{ minWidth: 96, padding: 8 }}>
                <T ltr size={13}>
                  {String(c)}
                </T>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export function QuestionImages({ images }: { images: unknown }) {
  const { lang } = useLang();
  const list = usableImages(images);
  if (list.length === 0) return null;
  return (
    <View style={{ gap: 10 }}>
      {list.map((img, i) => {
        const note = noteFor(img, lang);
        return (
          <View key={img.url || `t${i}`} style={{ gap: 6 }}>
            {img.kind === 'table' && img.table ? <RebuiltTable table={img.table} /> : <Picture img={img} />}
            {note ? (
              <T size={12} color={colors.textLight} style={{ fontStyle: 'italic' }}>
                {note}
              </T>
            ) : null}
            {img.attribution ? (
              <T size={12} color={colors.textLight}>
                {img.attribution}
              </T>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
