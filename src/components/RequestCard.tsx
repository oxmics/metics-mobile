import { StyleSheet, View } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import { formatDateString } from '../utils/helper';
import { colors, typography, spacing, borderRadius } from '../theme';

interface props {
    title: string,
    contentData: any,
    organization_name: string
    date: string,
    buttonAvailable?: boolean,
    buttonFn?: () => void
}

export const RequestInfoCard = ({ contentData, date, title, organization_name, buttonAvailable, buttonFn }: props) => {

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.categoryLabel}>{title.toUpperCase()}</Text>
                <Text style={styles.date}>{formatDateString(date)}</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.label}>Requested By</Text>
                    <Text style={styles.value}>{organization_name}</Text>
                </View>

                <Divider style={styles.divider} />

                {contentData && Object.entries(contentData).map(([key, value], index) => {
                    const isLast = index === Object.entries(contentData).length - 1;
                    return (
                        <View key={index} style={[styles.row, !isLast && styles.rowBorder]}>
                            <Text style={styles.rowLabel}>{String(key)}</Text>
                            <Text style={styles.rowValue}>{value != null ? String(value) : '—'}</Text>
                        </View>
                    );
                })}
            </View>

            {buttonAvailable && buttonFn && (
                <View style={styles.footer}>
                    <Button
                        mode="contained"
                        style={styles.footerBtn}
                        contentStyle={styles.btnContent}
                        labelStyle={styles.footerLabel}
                        onPress={() => buttonFn()}
                    >
                        View Full Details
                    </Button>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.sm,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: spacing.md,
    },
    categoryLabel: {
        ...typography.styles.labelSmall,
        color: colors.neutral.text.secondary,
    },
    date: {
        ...typography.styles.caption,
        color: colors.neutral.text.tertiary,
    },
    content: {
        backgroundColor: colors.neutral.surface.default, // Kept flat with container
    },
    section: {
        marginBottom: spacing.sm,
    },
    label: {
        fontSize: 11,
        color: colors.neutral.text.tertiary,
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        ...typography.styles.h4, // Emphasize organization name
        color: colors.neutral.text.primary,
    },
    divider: {
        marginVertical: spacing.md,
        backgroundColor: colors.neutral.border.default,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
    },
    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    rowLabel: {
        fontSize: 13,
        color: colors.neutral.text.secondary,
    },
    rowValue: {
        fontSize: 13,
        color: colors.neutral.text.primary,
        fontWeight: '500',
    },
    footer: {
        marginTop: spacing.lg,
    },
    footerBtn: {
        borderRadius: borderRadius.base,
        backgroundColor: colors.primary[600],
    },
    btnContent: {
        height: 36,
    },
    footerLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.neutral.white,
    },
});
