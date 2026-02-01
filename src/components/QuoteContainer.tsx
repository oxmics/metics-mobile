import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

interface props {
    contentData: any,
    footerButtonAvailable?: boolean,
    buttonFn?: () => void,
}

export const QuoteContainer = ({ footerButtonAvailable, buttonFn, contentData }: props) => {

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Quote Details</Text>
            </View>

            <View style={styles.content}>
                {Object.entries(contentData).map(([key, value], index) => (
                    <View key={index} style={styles.row}>
                        <Text style={styles.label}>{key}</Text>
                        <Text style={styles.value}>{String(value)}</Text>
                    </View>
                ))}
            </View>

            {footerButtonAvailable && buttonFn && (
                <View style={styles.footer}>
                    <Button
                        mode="contained"
                        style={styles.quoteBtn}
                        labelStyle={styles.btnLabel}
                        onPress={() => buttonFn()}
                        icon="file-document-edit-outline"
                    >
                        Update Quote
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
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        ...shadows.sm,
    },
    header: {
        marginBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
        paddingBottom: spacing.sm,
    },
    title: {
        ...typography.styles.h4,
        color: colors.primary[800],
    },
    content: {
        gap: spacing.sm,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        ...typography.styles.bodySmall,
        color: colors.neutral.text.secondary,
        flex: 1,
    },
    value: {
        ...typography.styles.bodySmall,
        color: colors.neutral.text.primary,
        fontWeight: '500',
        flex: 1,
        textAlign: 'right',
    },
    footer: {
        marginTop: spacing.lg,
        alignItems: 'flex-end',
    },
    quoteBtn: {
        borderRadius: borderRadius.base,
        backgroundColor: colors.primary[700],
    },
    btnLabel: {
        ...typography.styles.label,
        color: colors.neutral.white,
    },
});
