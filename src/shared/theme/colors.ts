export type ColorTokens = {
  background: string;
  surface: string;
  surfaceVariant: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  success: string;
  error: string;
  warning: string;
};

export const lightColors: ColorTokens = {
  background: '#FFFFFF',
  surface: '#F1F5F9',
  surfaceVariant: '#E2E8F0',
  text: '#0F172A',
  textSecondary: '#64748B',
  border: '#CBD5E1',
  primary: '#6C63FF',
  primaryForeground: '#FFFFFF',
  secondary: '#FF6584',
  success: '#43A047',
  error: '#E53935',
  warning: '#FB8C00',
};

export const darkColors: ColorTokens = {
  background: '#0F1117',
  surface: '#1A1F2E',
  surfaceVariant: '#2D3748',
  text: '#E2E8F0',
  textSecondary: '#94A3B8',
  border: '#334155',
  primary: '#6C63FF',
  primaryForeground: '#FFFFFF',
  secondary: '#FF6584',
  success: '#43A047',
  error: '#E53935',
  warning: '#FB8C00',
};
