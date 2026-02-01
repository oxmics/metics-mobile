import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, typography, spacing, borderRadius, shadows, getStatusColor } from '../theme';

interface props {
    status: string,
    titleLabel: string,
    title: string,
    footerLeftText: string,
    footerRightText: string
}

export const DataCard = ({ status, footerLeftText, footerRightText, title, titleLabel }: props) => {
    const safeText = (value: unknown, fallback = '—') => {
        if (value === null || value === undefined || value === '') {
            return fallback;
        }
        return String(value);
    };

    const safeStatus = safeText(status, 'UNKNOWN');
    const statusColors = getStatusColor(safeStatus);

    return (
        <View style={styles.card}>
            {/* Left Status Stripe - often seen in specialized ticket systems or just a nice accent */}
            {/* <View style={[styles.statusStripe, { backgroundColor: statusColors.border }]} /> */}

            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={styles.titleLabel}>{safeText(titleLabel, 'Label')}</Text>

                    {/* Lozenge Style Badge */}
                    <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                        <Text style={[styles.statusText, { color: statusColors.text }]}>
                            {safeStatus.toUpperCase()}
                        </Text>
                    </View>
                </View>

                <Text style={styles.title} numberOfLines={2}>{safeText(title)}</Text>

                <View style={styles.footer}>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaText}>{safeText(footerLeftText)}</Text>
                    </View>
                    <View style={styles.dotSeparator} />
                    <View style={styles.metaItem}>
                        <Text style={styles.metaText}>{safeText(footerRightText)}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.sm, // Atlassian cards often have small radius
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
        ...shadows.sm, // Subtle shadow
    },
    content: {
        padding: spacing.lg,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    titleLabel: {
        ...typography.styles.caption,
        color: colors.neutral.text.tertiary,
        fontWeight: '600',
    },
    title: {
        ...typography.styles.h4, // Stronger title
        color: colors.neutral.text.primary, // N800
        marginBottom: spacing.md,
        lineHeight: 22,
    },
    statusBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.base,
    },
    statusText: {
        ...typography.styles.labelSmall, // 11px uppercase bold
        fontSize: 10,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        ...typography.styles.caption,
        color: colors.neutral.text.secondary, // N500/N600
    },
    dotSeparator: {
        width: 3,
        height: 3,
        borderRadius: borderRadius.full,
        backgroundColor: colors.neutral.text.tertiary,
        marginHorizontal: spacing.sm,
    },
});
