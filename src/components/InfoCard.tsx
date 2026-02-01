import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { colors, typography, spacing, borderRadius } from '../theme';

interface props {
    title: string,
    iterative: boolean,
    contentData: any,
    footerButtonAvailable?: boolean,
    buttonFn?: () => void
}

export const InfoCard = ({ footerButtonAvailable, buttonFn, contentData, iterative, title }: props) => {
    // Safely handle contentData
    const isArray = Array.isArray(contentData);
    const isValidObject = contentData && typeof contentData === 'object';

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>{title || 'Information'}</Text>
            {iterative ? (
                isArray ? (
                    contentData.map((item: any, index: number) => {
                        const itemEntries = item && typeof item === 'object' ? Object.entries(item) : [];
                        return (
                            <View key={index} style={[styles.groupContainer, index > 0 && styles.groupDivider]}>
                                {itemEntries.map(([key, value], idx) => (
                                    <View key={idx} style={styles.row}>
                                        <Text style={styles.label}>{String(key)}</Text>
                                        <Text style={styles.value}>{value !== null && value !== undefined ? String(value) : '—'}</Text>
                                    </View>
                                ))}
                                {itemEntries.length === 0 && (
                                    <Text style={styles.emptyText}>No data available</Text>
                                )}
                            </View>
                        );
                    })
                ) : (
                    <Text style={styles.emptyText}>No data available</Text>
                )
            ) : (
                <View style={styles.groupContainer}>
                    {isValidObject ? (
                        Object.entries(contentData).map(([key, value], index) => (
                            <View key={index} style={styles.row}>
                                <Text style={styles.label}>{String(key)}</Text>
                                <Text style={styles.value}>{value !== null && value !== undefined ? String(value) : '—'}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No data available</Text>
                    )}
                </View>
            )}

            {footerButtonAvailable && buttonFn && (
                <View style={styles.footer}>
                    <Button
                        mode="text"
                        style={styles.footerBtn}
                        textColor={colors.primary[500]}
                        labelStyle={styles.footerLabel}
                        onPress={() => buttonFn()}
                        contentStyle={styles.footerContent}
                    >
                        See More Details
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
        marginBottom: spacing.md,
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.neutral.text.secondary,
        marginBottom: spacing.md,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    groupContainer: {
        marginBottom: spacing.sm,
    },
    groupDivider: {
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.neutral.border.default,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.xs,
        minHeight: 32,
    },
    label: {
        fontSize: 14,
        color: colors.neutral.text.secondary,
        flex: 1,
        marginRight: spacing.md,
    },
    value: {
        fontSize: 14,
        color: colors.neutral.text.primary,
        fontWeight: '500',
        flex: 1,
        textAlign: 'right',
    },
    emptyText: {
        ...typography.styles.caption,
        color: colors.neutral.text.tertiary,
        textAlign: 'center',
        paddingVertical: spacing.md,
    },
    footer: {
        marginTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.neutral.border.default,
        paddingTop: spacing.xs,
        marginHorizontal: -spacing.lg, // extend to edges
        paddingHorizontal: spacing.sm,
    },
    footerBtn: {
        borderRadius: borderRadius.base,
        alignSelf: 'flex-start',
    },
    footerContent: {
        justifyContent: 'flex-start',
    },
    footerLabel: {
        fontSize: 13,
        fontWeight: '600',
    },
});
