import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Button, Divider, Modal, Text, Icon } from 'react-native-paper';
import { AuctionLinesType, AuctionType } from '../types/auction';
import { formatDateString } from '../utils/helper';
import { InfoCard } from './InfoCard';
import { useMemo } from 'react';
import { colors, typography, spacing, borderRadius } from '../theme';

interface props {
    show: boolean,
    closeModal: () => void,
    auction: AuctionType,
    auctionLines: AuctionLinesType[]
}
export const RfqDetailedModal = ({ closeModal, auction, auctionLines, show }: props) => {

    const itemsDetails = useMemo(() => {
        if (auctionLines) {
            let items: any[] = [];
            auctionLines.map((item) => {
                items.push({
                    Name: item.product_name,
                    Quantity: item.quantity,
                    Brand: item.brand,
                    Price: item.target_price,
                });
            });
            return items;
        } else {
            return [];
        }
    }, [auctionLines]);

    return (
        <Modal visible={show} onDismiss={closeModal} dismissable contentContainerStyle={styles.modalContent}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Request Details</Text>
                    <TouchableOpacity onPress={closeModal} style={styles.closeIcon}>
                        <Icon source="close" size={20} color={colors.neutral.text.secondary} />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.metaRow}>
                        <View style={styles.metaCol}>
                            <Text style={styles.metaLabel}>Date</Text>
                            <Text style={styles.metaValue}>{formatDateString(auction.created_at)}</Text>
                        </View>
                        <View style={styles.metaCol}>
                            <Text style={styles.metaLabel}>Requested By</Text>
                            <Text style={styles.metaValue}>{auction.organization_name}</Text>
                        </View>
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.section}>
                        <DetailRow label="RFQ Title" value={auction.title} />
                        <DetailRow label="Reference Number" value={auction.requisition_number} />
                        <DetailRow label="Product Category" value={auction.product_category} />
                        <DetailRow label="Product Sub Category" value={auction.product_sub_category} />
                        <DetailRow label="Contract Type" value={auction.is_open ? 'Open' : 'Closed'} />
                    </View>

                    <InfoCard title="Line Items" footerButtonAvailable={false} iterative={true} contentData={itemsDetails} />
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        mode="contained"
                        onPress={closeModal}
                        style={styles.closeBtn}
                        labelStyle={styles.btnLabel}
                    >
                        Close
                    </Button>
                </View>
            </View>
        </Modal>
    );
};

const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value || ''}</Text>
    </View>
);

const styles = StyleSheet.create({
    modalContent: {
        padding: spacing.lg,
        maxHeight: '90%',
    },
    container: {
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
        paddingBottom: spacing.sm,
    },
    headerTitle: {
        ...typography.styles.h3,
        color: colors.primary[800],
    },
    closeIcon: {
        padding: 4,
    },
    metaRow: {
        flexDirection: 'row',
        marginBottom: spacing.md,
    },
    metaCol: {
        flex: 1,
    },
    metaLabel: {
        ...typography.styles.caption,
        color: colors.neutral.text.tertiary,
        marginBottom: 2,
    },
    metaValue: {
        ...typography.styles.bodySmall,
        color: colors.neutral.text.primary,
        fontWeight: '500',
    },
    divider: {
        backgroundColor: colors.neutral.border.default,
        marginBottom: spacing.md,
    },
    section: {
        marginBottom: spacing.lg,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    rowLabel: {
        ...typography.styles.bodySmall,
        color: colors.neutral.text.secondary,
        flex: 1,
    },
    rowValue: {
        ...typography.styles.bodySmall,
        color: colors.neutral.text.primary,
        fontWeight: '500',
        flex: 1,
        textAlign: 'right',
    },
    footer: {
        marginTop: spacing.lg,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.neutral.border.default,
        alignItems: 'center',
    },
    closeBtn: {
        backgroundColor: colors.neutral.surface.default,
        borderColor: colors.neutral.border.default,
        borderWidth: 1,
        borderRadius: borderRadius.base,
        width: '100%',
    },
    btnLabel: {
        ...typography.styles.label,
        color: colors.neutral.text.primary,
    },
});
