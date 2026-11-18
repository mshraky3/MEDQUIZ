import { describe, expect, it } from 'vitest';
import { DEFAULT_THEME_PREF, THEME_PREFS, nativeSchemeFor, normalizeThemePref, resolveScheme } from './themePref';

describe('theme choice', () => {
  it('offers System, Light and Dark, and defaults to System', () => {
    expect([...THEME_PREFS]).toEqual(['system', 'light', 'dark']);
    expect(DEFAULT_THEME_PREF).toBe('system');
  });

  it('reads a stored value, and treats anything else as the default', () => {
    expect(normalizeThemePref('dark')).toBe('dark');
    expect(normalizeThemePref('light')).toBe('light');
    expect(normalizeThemePref('system')).toBe('system');
    for (const bad of [null, undefined, '', 'DARK', 'auto', 1, {}, 'automatic']) expect(normalizeThemePref(bad)).toBe('system');
  });

  it('a forced choice ignores the phone', () => {
    expect(resolveScheme('light', 'dark')).toBe('light');
    expect(resolveScheme('dark', 'light')).toBe('dark');
    expect(resolveScheme('dark', null)).toBe('dark');
  });

  it('System follows the phone, and an unknown phone reads as light', () => {
    expect(resolveScheme('system', 'dark')).toBe('dark');
    expect(resolveScheme('system', 'light')).toBe('light');
    expect(resolveScheme('system', null)).toBe('light');
    expect(resolveScheme('system', undefined)).toBe('light');
    expect(resolveScheme('system', 'unspecified')).toBe('light');
  });

  it('hands control back to the phone only for System', () => {
    expect(nativeSchemeFor('system')).toBe('unspecified');
    expect(nativeSchemeFor('light')).toBe('light');
    expect(nativeSchemeFor('dark')).toBe('dark');
  });
});
