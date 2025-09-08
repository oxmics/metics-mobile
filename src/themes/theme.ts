import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { colors } from './colors';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.light.primary,
    secondary: colors.light.secondary,
    background: colors.light.background,
    surface: colors.light.surface,
    text: colors.light.text,
    placeholder: colors.light.placeholder,
    error: colors.light.error,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.dark.primary,
    secondary: colors.dark.secondary,
    background: colors.dark.background,
    surface: colors.dark.surface,
    text: colors.dark.text,
    placeholder: colors.dark.placeholder,
    error: colors.dark.error,
  },
};
