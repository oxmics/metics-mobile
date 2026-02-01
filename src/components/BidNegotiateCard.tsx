import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { BidLineType } from '../types/bids';
import { formatDate } from '../utils/helper';
import { AuctionLinesType } from '../types/auction';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

interface props {
    auctionLines: AuctionLinesType[],
    bidLine: BidLineType[]
}

export const BidNegotaiteCard = ({ auctionLines, bidLine }: props) => {

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Items & Pricing</Text>
            {auctionLines.map((auctionLine, index) => (
                <View key={index} style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Product Name</Text>
                        <Text style={styles.value}>{auctionLine.product_name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Quantity</Text>
                        <Text style={styles.value}>{auctionLine.quantity}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Brand</Text>
                        <Text style={styles.value}>{auctionLine.brand}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Price Quoted</Text>
                        <Text style={styles.value}>{bidLine[index]?.price || 'N/A'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Promised Date</Text>
                        <Text style={styles.value}>{bidLine[index]?.promised_date ? formatDate(bidLine[index].promised_date) : 'N/A'}</Text>
                    </View>
                </View>
            ))}
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
    headerTitle: {
        ...typography.styles.h4,
        marginBottom: spacing.md,
        color: colors.primary[800],
    },
    card: {
        width: '100%',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        backgroundColor: colors.neutral.background,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    rowText: {
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
    divider: {
        height: 1,
        backgroundColor: colors.neutral.border.default,
        marginVertical: spacing.sm,
    },
});
