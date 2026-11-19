import { describe, expect, it } from 'vitest';
import { Palette, darkColors, lightColors } from './palettes';

/** WCAG relative luminance / contrast, for #rrggbb and rgba(r, g, b, a) strings. */
type RGB = [number, number, number];
function parse(color: string): { rgb: RGB; a: number } {
  const hex = /^#([0-9a-f]{6})$/i.exec(color);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return { rgb: [(n >> 16) & 255, (n >> 8) & 255, n & 255], a: 1 };
  }
  const m = /^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)$/.exec(color);
  if (!m) throw new Error(`unparsable colour ${color}`);
  return { rgb: [Number(m[1]), Number(m[2]), Number(m[3])], a: m[4] === undefined ? 1 : Number(m[4]) };
}
/** `top` painted over an opaque `base`. */
function over(top: string, base: string): RGB {
  const t = parse(top);
  const b = parse(base).rgb;
  return [0, 1, 2].map((i) => Math.round(t.rgb[i] * t.a + b[i] * (1 - t.a))) as RGB;
}
const lum = ([r, g, b]: RGB) => {
  const f = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (fg: RGB, bg: RGB) => {
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
};
const solid = (c: string): RGB => parse(c).rgb;

const PANELS: (keyof Palette)[] = ['bg', 'surface', 'surface2', 'surfaceTint'];
const TEXT: (keyof Palette)[] = ['text', 'textMedium', 'textLight'];
const INK: (keyof Palette)[] = ['primaryInk', 'primaryDarkInk', 'secondaryInk', 'secondaryDarkInk', 'successInk', 'errorInk', 'warningInk', 'infoInk'];
const ACCURACY: [keyof Palette, keyof Palette][] = [
  ['accuracyHigh', 'accuracyHighBg'],
  ['accuracyMid', 'accuracyMidBg'],
  ['accuracyLow', 'accuracyLowBg'],
];

describe('palettes', () => {
  it('light and dark have exactly the same keys', () => {
    expect(Object.keys(darkColors).sort()).toEqual(Object.keys(lightColors).sort());
  });

  it('brand fills are the same in both themes (white text on them keeps its contrast)', () => {
    for (const key of ['primary', 'primaryDark', 'primaryLight', 'secondary', 'secondaryDark', 'success', 'error', 'warning', 'info', 'white', 'navy'] as const) {
      expect(darkColors[key]).toBe(lightColors[key]);
    }
    // White on the primary fill is the button label.
    expect(contrast(solid('#ffffff'), solid(darkColors.primary))).toBeGreaterThanOrEqual(4.5);
  });

  it('light ink twins equal the brand fill they stand for (light theme unchanged)', () => {
    expect(lightColors.primaryInk).toBe(lightColors.primary);
    expect(lightColors.primaryDarkInk).toBe(lightColors.primaryDark);
    expect(lightColors.successInk).toBe(lightColors.success);
    expect(lightColors.errorInk).toBe(lightColors.error);
    expect(lightColors.warningInk).toBe(lightColors.warning);
    expect(lightColors.infoInk).toBe(lightColors.info);
  });

  describe('dark: every text colour clears WCAG AA (4.5:1) on every panel', () => {
    for (const panel of PANELS) {
      for (const key of [...TEXT, ...INK, 'accuracyHigh', 'accuracyMid', 'accuracyLow'] as (keyof Palette)[]) {
        it(`${key} on ${panel}`, () => {
          expect(contrast(solid(darkColors[key]), solid(darkColors[panel]))).toBeGreaterThanOrEqual(4.5);
        });
      }
    }
    it('status text on its own tinted background (over a card)', () => {
      const cases: [keyof Palette, keyof Palette][] = [
        ['successInk', 'successBg'],
        ['errorInk', 'errorBg'],
        ['warningInk', 'warningBg'],
        ['infoInk', 'infoBg'],
        ['primaryInk', 'infoBg'],
        ...ACCURACY,
      ];
      for (const [fg, bg] of cases) {
        for (const panel of ['surface', 'bg'] as const) {
          const tinted = over(darkColors[bg], darkColors[panel]);
          expect(contrast(solid(darkColors[fg]), tinted), `${fg} on ${bg} over ${panel}`).toBeGreaterThanOrEqual(4.5);
        }
      }
    });
  });

  describe('light: body text clears WCAG AA on every panel', () => {
    for (const panel of PANELS) {
      for (const key of TEXT) {
        it(`${key} on ${panel}`, () => {
          expect(contrast(solid(lightColors[key]), solid(lightColors[panel]))).toBeGreaterThanOrEqual(4.5);
        });
      }
    }
  });
});
