import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

interface props {
    title: string,
    count: number,
    icon: string
}

export const DataCountCard = ({ count, icon, title }: props) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.count}>{count}</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Icon source={icon} size={24} color={colors.primary[800]} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        ...shadows.sm,
        marginBottom: spacing.md,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        ...typography.styles.labelSmall,
        marginBottom: spacing.xs,
        color: colors.neutral.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    count: {
        fontSize: typography.size['3xl'],
        fontWeight: '700',
        color: colors.neutral.text.primary,
        letterSpacing: -1,
        lineHeight: 36,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
    },
});
