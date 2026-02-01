import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { colors, borderRadius } from './index';

export const paperTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.primary[500],
        onPrimary: '#FFFFFF',
        primaryContainer: colors.primary[50], // Light blue for selected states
        onPrimaryContainer: colors.primary[800],
        secondary: colors.neutral.text.secondary,
        onSecondary: '#FFFFFF',
        secondaryContainer: colors.neutral.surface.sunken,
        onSecondaryContainer: colors.neutral.text.primary,
        tertiary: colors.accent.teal,
        error: colors.semantic.error.default,
        background: colors.neutral.surface.sunken,
        surface: colors.neutral.surface.default,
        surfaceVariant: colors.neutral.surface.sunken,
        onSurface: colors.neutral.text.primary,
        onSurfaceVariant: colors.neutral.text.secondary,
        outline: colors.neutral.border.default,
        outlineVariant: colors.neutral.border.bold,
        inverseSurface: colors.neutral.text.primary,
        inverseOnSurface: colors.neutral.surface.default,
    },
    roundness: borderRadius.base,
    // Add typography mapping if strictly needed, but manual styling covers most
};
