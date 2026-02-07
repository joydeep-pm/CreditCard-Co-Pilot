import { Platform, ViewStyle } from 'react-native';

export const colors = {
  bg: '#F8F9FB',
  surface: '#FFFFFF',
  text: '#1E293B',
  muted: '#64748B',
  muted2: '#94A3B8',
  sage: '#2DD4BF',
  sage2: '#1FBBA9',
  gold: '#D4AF37',
  dark: '#0F172A',
  white: '#FFFFFF',
} as const;

export const radii = {
  xl: 28,
  lg: 20,
  md: 14,
  sm: 8,
  pill: 999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  } as ViewStyle,
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  } as ViewStyle,
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  } as ViewStyle,
};

export const fonts = {
  heading: Platform.select({ ios: 'System', default: 'sans-serif' }) as string,
  body: Platform.select({ ios: 'System', default: 'sans-serif' }) as string,
  mono: Platform.select({ ios: 'Menlo', default: 'monospace' }) as string,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const TAB_BAR_HEIGHT = 88;
