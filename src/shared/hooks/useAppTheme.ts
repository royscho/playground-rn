import { useThemeStore } from '@/features/settings/store/themeStore';
import { darkColors, lightColors } from '@/shared/theme/colors';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const useAppTheme = () => {
  const isDark = useThemeStore((s) => s.isDark);
  return {
    isDark,
    colors: isDark ? darkColors : lightColors,
    spacing,
    typography,
  };
};
