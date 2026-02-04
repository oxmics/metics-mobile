import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, typography, spacing, borderRadius } from '../theme';

interface props {
    title: string,
    value: number | string | undefined, // Support more types
    footer?: string,
    accentColor?: string,
    onPress?: () => void,
}

export const OverviewCard = ({ title, value, footer, accentColor = colors.primary[500], onPress }: props) => {
    // Safely format the value
    const displayValue = value !== undefined && value !== null
        ? (typeof value === 'number' ? value.toLocaleString() : value.toString())
        : '0';

    const CardContent = () => (
        <View style={styles.container}>
            {/* Left Accent Bar - Jira Dashboard Style */}
            <View style={[styles.leftAccent, { backgroundColor: accentColor }]} />

            <View style={styles.content}>
                <Text style={styles.title}>{title?.toUpperCase() || '—'}</Text>
                <Text style={styles.value}>{displayValue}</Text>

                {footer && (
                    <View style={styles.footerContainer}>
                        <Text style={styles.footer}>{footer}</Text>
                    </View>
                )}
            </View>
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                <CardContent />
            </TouchableOpacity>
        );
    }

    return <CardContent />;
};

const styles = StyleSheet.create({
    container: {
        width: 140, // Standardize width for dashboard grids
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.sm,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
        marginRight: spacing.md,
        flexDirection: 'row',
    },
    leftAccent: {
        width: 4,
        height: '100%',
    },
    content: {
        flex: 1,
        padding: spacing.md,
        justifyContent: 'center',
    },
    title: {
        ...typography.styles.labelSmall,
        color: colors.neutral.text.secondary,
        letterSpacing: 0.5,
        marginBottom: spacing.xs,
    },
    value: {
        fontSize: 24, // Clear, large number
        fontWeight: '600',
        color: colors.neutral.text.primary,
        letterSpacing: -0.5,
        marginBottom: 2,
    },
    footerContainer: {
        marginTop: spacing.xs,
    },
    footer: {
        fontSize: 10,
        color: colors.neutral.text.tertiary,
    },
});
