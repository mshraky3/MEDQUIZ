/**
 * Design tokens ported from web app's index.css CSS variables
 * Dark theme matching the web SQB identity
 */

export const Colors = {
    // Primary palette
    primary: '#22d3ee',
    primaryDark: '#0ea5e9',
    primaryLight: '#67e8f9',

    // Background hierarchy
    bgDark: '#0b1021',
    bgCard: '#111827',
    bgCardHover: '#1a2236',
    bgInput: '#1e293b',
    bgModal: 'rgba(0, 0, 0, 0.7)',

    // Text hierarchy
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    textInverse: '#0b1021',

    // Semantic
    success: '#22c55e',
    successBg: 'rgba(34, 197, 94, 0.1)',
    error: '#ef4444',
    errorBg: 'rgba(239, 68, 68, 0.1)',
    warning: '#f59e0b',
    warningBg: 'rgba(245, 158, 11, 0.1)',
    info: '#3b82f6',
    infoBg: 'rgba(59, 130, 246, 0.1)',

    // Borders
    border: '#1e293b',
    borderLight: '#334155',
    borderFocus: '#22d3ee',

    // Misc
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',

    // Answer specific
    correctGreen: '#22c55e',
    wrongRed: '#ef4444',
    selectedBlue: '#22d3ee',
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
};

export const FontSize = {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
};

export const FontWeight = {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
};

export const BorderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
};

export const Shadow = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
};
