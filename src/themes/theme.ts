import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { colors } from './colors';

const fontConfig = {
  fontFamily: 'Poppins-Regular',
  fontFamilyMedium: 'Poppins-Medium',
  fontFamilyBold: 'Poppins-Bold',
};

export const lightTheme = {
  ...MD3LightTheme,
  fonts: {
    ...MD3LightTheme.fonts,
    regular: {
      fontFamily: fontConfig.fontFamily,
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: fontConfig.fontFamilyMedium,
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: fontConfig.fontFamilyBold,
      fontWeight: 'normal',
    },
  },
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
  fonts: {
    ...MD3DarkTheme.fonts,
    regular: {
      fontFamily: fontConfig.fontFamily,
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: fontConfig.fontFamilyMedium,
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: fontConfig.fontFamilyBold,
      fontWeight: 'normal',
    },
  },
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
