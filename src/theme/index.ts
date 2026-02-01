// Atlassian-inspired Design System Theme
// Modeled after AtlasKit principles: Clear, optimistic, and distinct.

export const colors = {
    // Primary Brand Colors (Pacific Blue)
    primary: {
        50: '#DEEBFF',
        100: '#B3D4FF',
        200: '#4C9AFF',
        300: '#2684FF',
        400: '#0065FF',
        500: '#0052CC', // Primary Action
        600: '#0747A6', // Hover/Active
        700: '#172B4D', // Deep Blue / Text
        800: '#091E42',
        900: '#253858',
    },

    // Neutrals (N-scale)
    neutral: {
        text: {
            primary: '#172B4D',   // N800 - Main Text
            secondary: '#42526E', // N600 - Secondary Text
            tertiary: '#6B778C',  // N500 - Meta Text / Icons
            disabled: '#A5ADBA',  // N400
            inverse: '#FFFFFF',   // Added for Dark Backgrounds
        },
        surface: {
            default: '#FFFFFF',   // Card background
            sunken: '#F4F5F7',    // App background
            hover: '#FAFBFC',
            pressed: '#F4F5F7',
            overlay: '#FFFFFF',
        },
        border: {
            default: '#DFE1E6',   // N50
            bold: '#C1C7D0',      // N60
            focus: '#4C9AFF',     // Focused Input Border
        },
        background: '#FAFBFC',    // Global App Background (N10)
        white: '#FFFFFF',         // Added explicit white token
    },

    // Semantic Colors (Function)
    semantic: {
        success: {
            default: '#36B37E', // G300
            light: '#E3FCEF',   // G50
            dark: '#006644',    // G500
        },
        warning: {
            default: '#FFAB00', // Y300
            light: '#FFFAE6',   // Y50
            dark: '#BF2600',    // Y500 (actually orange-red, but often used for warning text)
        },
        error: {
            default: '#FF5630', // R300
            light: '#FFEBE6',   // R50
            dark: '#DE350B',    // R500
        },
        info: {
            default: '#6554C0', // P300 (Purple for discovery/info)
            light: '#EAE6FF',   // P50
            dark: '#403294',    // P500
        },
    },

    // Accent Palette (Teal, Purple, etc. for avatars/tags)
    accent: {
        teal: '#00B8D9',
        purple: '#6554C0',
        rosy: '#DE350B',
    },
};

export const typography = {
    fontFamily: {
        regular: 'System', // iOS San Francisco / Android Roboto usually matches well
        medium: 'System',
        bold: 'System',
    },
    // Atlassian Typography Scale
    styles: {
        h1: {
            fontSize: 29,
            fontWeight: '600' as '600',
            lineHeight: 32,
            color: colors.neutral.text.primary,
            letterSpacing: -0.01,
        },
        h2: {
            fontSize: 24,
            fontWeight: '600' as '600',
            lineHeight: 28,
            color: colors.neutral.text.primary,
            letterSpacing: -0.01,
        },
        h3: {
            fontSize: 20,
            fontWeight: '500' as '500',
            lineHeight: 24,
            color: colors.neutral.text.primary,
            letterSpacing: 0,
        },
        h4: {
            fontSize: 16,
            fontWeight: '600' as '600',
            lineHeight: 20,
            color: colors.neutral.text.primary,
            letterSpacing: 0,
        },
        body: {
            fontSize: 14,
            fontWeight: '400' as '400',
            lineHeight: 20,
            color: colors.neutral.text.primary,
        },
        bodySmall: {
            fontSize: 12,
            fontWeight: '400' as '400',
            lineHeight: 16,
            color: colors.neutral.text.secondary,
        },
        label: {
            fontSize: 14,
            fontWeight: '600' as '600',
            lineHeight: 16,
            color: colors.neutral.text.secondary,
        },
        labelSmall: {
            fontSize: 11,
            fontWeight: '700' as '700',
            textTransform: 'uppercase' as 'uppercase',
            lineHeight: 14,
            letterSpacing: 0.5,
            color: colors.neutral.text.tertiary,
        },
        caption: {
            fontSize: 11,
            fontWeight: '400' as '400',
            lineHeight: 12,
            color: colors.neutral.text.tertiary,
        },
    },
    size: {
        xs: 11,
        sm: 12,
        body: 14,
        lg: 16,
        xl: 20,
        '2xl': 24,
        '3xl': 29,
    },
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12, // Standard grid unit often
    lg: 16, // Default padding
    xl: 24,
    '2xl': 32,
    '3xl': 40,
};

export const borderRadius = {
    xs: 2,
    sm: 3,   // Standard small elements
    base: 4, // Lozenge / Button default
    md: 8,   // Cards
    lg: 12,  // Modals / Large containers
    full: 9999,
};

export const shadows = {
    // AtlasKit prefers subtle elevation over heavy shadows
    none: {
        elevation: 0,
        shadowOpacity: 0,
    },
    sm: { // Card hover / interactive
        shadowColor: colors.neutral.text.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    md: { // Modals / Dropdowns
        shadowColor: colors.neutral.text.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: colors.neutral.text.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.14,
        shadowRadius: 16,
        elevation: 8,
    },
};

// Helper for status colors (Lozenge Style)
export const getStatusColor = (status: string | number) => {
    // Normalize status
    const statusLower = String(status).toLowerCase();

    // Success (Green)
    if (['accepted', 'approved', 'open', 'submitted', 'awarded', '1'].includes(statusLower)) {
        return { bg: colors.semantic.success.light, text: colors.semantic.success.dark, border: colors.semantic.success.default };
    }
    // Warning/Pending (Yellow/Orange)
    if (['pending', 'draft', 'in_progress', '0'].includes(statusLower)) {
        return { bg: colors.semantic.warning.light, text: colors.semantic.warning.dark, border: colors.semantic.warning.default };
    }
    // Error/Rejected (Red)
    if (['rejected', 'closed', 'cancelled', 'disqualified', '-1'].includes(statusLower)) {
        return { bg: colors.semantic.error.light, text: colors.semantic.error.dark, border: colors.semantic.error.default };
    }
    // Info/Neutral (Blue/Purple)
    if (['withdrawn', 'review'].includes(statusLower)) {
        return { bg: colors.semantic.info.light, text: colors.semantic.info.dark, border: colors.semantic.info.default };
    }

    // Default Neutral
    return { bg: colors.neutral.surface.sunken, text: colors.neutral.text.secondary, border: colors.neutral.border.bold };
};
