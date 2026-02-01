import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { capitalizeFirstLetter, formatDate } from '../utils/helper';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

interface props {
    title?: string,
    name?: string,
    address?: string,
    contact?: string,
    bid_no?: number,
    expiry_date?: string,
    status?: 'awarded' | 'rejected' | 'cancelled' | 'disqualified' | 'withdrawn' | 'submitted' | 'draft'
}

export const BidDetailsCard = ({ address, contact, title, name, bid_no, expiry_date, status }: props) => {
    return (
        <View style={styles.container}>
            {title && <Text style={styles.headerTitle}>{title}</Text>}

            <View style={styles.content}>
                {name && (
                    <View style={styles.row}>
                        <Text style={styles.label}>Quoted By</Text>
                        <Text style={styles.value}>{name}</Text>
                    </View>
                )}

                {address && (
                    <View style={styles.row}>
                        <Text style={styles.label}>Address</Text>
                        <Text style={styles.value}>{address}</Text>
                    </View>
                )}

                {contact && (
                    <View style={styles.row}>
                        <Text style={styles.label}>Contact</Text>
                        <Text style={styles.value}>{contact}</Text>
                    </View>
                )}

                {bid_no && (
                    <View style={styles.row}>
                        <Text style={styles.label}>Bid No</Text>
                        <Text style={styles.value}>{bid_no}</Text>
                    </View>
                )}

                {expiry_date && (
                    <View style={styles.row}>
                        <Text style={styles.label}>Expiry Date</Text>
                        <Text style={styles.value}>{formatDate(expiry_date)}</Text>
                    </View>
                )}

                {status && (
                    <View style={styles.row}>
                        <Text style={styles.label}>Status</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColorHelper(status).bg }]}>
                            <Text style={[styles.statusText, { color: getStatusColorHelper(status).text }]}>
                                {capitalizeFirstLetter(status)}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

const getStatusColorHelper = (status: string) => {
    switch (status) {
        case 'submitted': return { bg: colors.semantic.success.light, text: colors.semantic.success.dark };
        case 'draft': return { bg: colors.semantic.warning.light, text: colors.semantic.warning.dark };
        case 'rejected': return { bg: colors.semantic.error.light, text: colors.semantic.error.dark };
        case 'awarded': return { bg: colors.semantic.success.light, text: colors.semantic.success.dark };
        default: return { bg: colors.neutral.surface.sunken, text: colors.neutral.text.secondary };
    }
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        ...shadows.sm,
    },
    headerTitle: {
        ...typography.styles.h4,
        marginBottom: spacing.md,
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
    statusBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
    },
    statusText: {
        ...typography.styles.caption,
        fontWeight: '600',
    },
});
