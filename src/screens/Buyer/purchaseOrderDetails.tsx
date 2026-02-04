import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, StyleSheet, TouchableOpacity, View, StatusBar } from 'react-native';
import { ActivityIndicator, Button, Icon, Portal, Text } from 'react-native-paper';
import { CustomNavigationProp } from '../../types/common';
import usePurchaseOrder from '../../api/purchase order/usePurchaseOrder';
import { InfoCard } from '../../components/InfoCard';
import { useMemo, useState } from 'react';
import { formatDate } from '../../utils/helper';
import useUpdatePurchaseOrderStatus from '../../api/purchase order/usePurchaseOrderStatusUpdate';
import { BidModal } from '../../components/Modal';
import { BottomNavbar } from '../../components/BottomNavbar';
import { colors, typography, spacing, borderRadius } from '../../theme';

type RootStackParamList = {
    BuyerPurchaseOrderDetailsScreen: {
        orderId: string;
    };
};

const BuyerPurchaseorderDetailsScreen = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'BuyerPurchaseOrderDetailsScreen'>>();
    const { orderId } = route.params;

    const navigation = useNavigation<CustomNavigationProp>();

    const [statusLoading, setStatusLoading] = useState<0 | 1 | 2>(0);
    const [showModal, setShowModal] = useState<boolean>(false);

    const { data: purchaseOrder, isPending: loading } = usePurchaseOrder({ id: orderId });
    const { mutateAsync: update, isPending: sendingStatusUpdate } = useUpdatePurchaseOrderStatus();

    const handleStatusUpdate = (status: string) => {
        if (status === 'Approve') {
            setStatusLoading(1);
        } else {
            setStatusLoading(2);
        }
        update({
            id: orderId,
            status: status,
        }).then(() => setStatusLoading(0));
    };

    const auctionDetails = useMemo(() => {
        if (purchaseOrder?.auction_header) {
            return {
                Title: purchaseOrder.auction_header.title ?? '—',
                'Requisition Number': purchaseOrder.auction_header.requisition_number ?? '—',
                'Product Category': purchaseOrder.auction_header.product_category ?? '—',
                'Product Sub Category': purchaseOrder.auction_header.product_sub_category ?? '—',
                'Need By Date': purchaseOrder.auction_header.need_by_date
                    ? formatDate(purchaseOrder.auction_header.need_by_date)
                    : '—',
            };
        } else if (purchaseOrder?.bid_header_details?.auction_header) {
            return {
                Title: purchaseOrder.bid_header_details.auction_header.title ?? '—',
                'Requisition Number': purchaseOrder.bid_header_details.auction_header.requisition_number ?? '—',
                'Product Category': purchaseOrder.bid_header_details.auction_header.product_category ?? '—',
                'Product Sub Category': purchaseOrder.bid_header_details.auction_header.product_sub_category ?? '—',
                'Need By Date': purchaseOrder.bid_header_details.auction_header.need_by_date
                    ? formatDate(purchaseOrder.bid_header_details.auction_header.need_by_date)
                    : '—',
            };
        }
        return {};
    }, [purchaseOrder]);

    const supplierDetails = useMemo(() => {
        const details = purchaseOrder?.supplier_organisation_details || purchaseOrder?.bid_header_details?.organisation;
        if (details) {
            return {
                Name: details.name ?? '—',
                Address: details.address_line1 ?? '—',
                City: details.city ?? '—',
                State: details.state ?? '—',
                Country: details.country ?? '—',
                'Postal Code': details.postal_code ?? '—',
                Email: details.email ?? '—',
                Contact: details.contact ?? '—',
                // 'Total Turnover': details.total_turnover ?? '—', // Sometimes sensitive/missing
                // 'No of Employees': details.number_of_employees ?? '—',
            };
        }
        return {};
    }, [purchaseOrder]);

    const organizationDetails = useMemo(() => {
        if (purchaseOrder?.buyer_organisation_details) {
            return {
                Name: purchaseOrder.buyer_organisation_details.name ?? '—',
                Address: purchaseOrder.buyer_organisation_details.address_line1 ?? '—',
                City: purchaseOrder.buyer_organisation_details.city ?? '—',
                State: purchaseOrder.buyer_organisation_details.state ?? '—',
                Country: purchaseOrder.buyer_organisation_details.country ?? '—',
                'Postal Code': purchaseOrder.buyer_organisation_details.postal_code ?? '—',
                Email: purchaseOrder.buyer_organisation_details.email ?? '—',
                Contact: purchaseOrder.buyer_organisation_details.contact ?? '—',
            };
        }
        return {};
    }, [purchaseOrder]);

    const bidDetails = useMemo(() => {
        if (purchaseOrder?.bid_header_details) {
            return {
                'Bid Number': purchaseOrder.bid_header_details.bidders_bid_number ?? '—',
                'Bid Status': purchaseOrder.bid_header_details.bid_status ?? '—',
                'Auction Status': purchaseOrder.auction_header?.status ?? '—',
                'Bid Count': purchaseOrder.auction_header?.bid_count ?? '—',
            };
        }
        return {};
    }, [purchaseOrder]);

    const bidAdditionalDetails = useMemo(() => {
        if (purchaseOrder?.bid_header_details) {
            return {
                'Bid Number': purchaseOrder.bid_header_details.bidders_bid_number ?? '—',
                'Bid Status': purchaseOrder.bid_header_details.bid_status ?? '—',
                'Response Type': purchaseOrder.bid_header_details.type_of_response ?? '—',
                'Bid Expiration Date': purchaseOrder.bid_header_details.bid_expiration_date
                    ? formatDate(purchaseOrder.bid_header_details.bid_expiration_date)
                    : '—',
                'Supplier Note': purchaseOrder.bid_header_details.note_to_supplier ?? '',
            };
        }
        return {};
    }, [purchaseOrder]);

    const itemsDetails = useMemo(() => {
        if (purchaseOrder?.details && Array.isArray(purchaseOrder.details)) {
            return purchaseOrder.details.map((item, index) => ({
                'Sl No': index + 1,
                Name: item.product_name ?? '—',
                Quantity: item.quantity ?? '—',
                Price: item.price ?? '—',
                Total: item.total_price ?? (Number(item.quantity) * Number(item.price)).toString() ?? '—'
            }));
        }
        return [];
    }, [purchaseOrder]);

    const handleShowModal = () => setShowModal(true);
    const handleHideModal = () => setShowModal(false);

    const getStatusColor = (status: number) => {
        if (status === 0) { return colors.semantic.warning.default; }
        if (status === -1) { return colors.semantic.error.default; }
        return colors.semantic.success.default;
    };

    const getStatusText = (status: number) => {
        if (status === 0) { return 'PENDING'; }
        if (status === -1) { return 'REJECTED'; }
        return 'ACCEPTED';
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface.default} />

            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Icon size={24} source="arrow-left" color={colors.neutral.text.secondary} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerLabel}>Order Details</Text>
                    <Text style={styles.title} numberOfLines={1}>
                        {purchaseOrder?.bid_header_details?.auction_header?.requisition_number ?? '—'}
                    </Text>
                </View>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.scrollContainer}>
                    {purchaseOrder && (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            {/* Status Card */}
                            <View style={styles.statusCard}>
                                <View style={styles.statusHeader}>
                                    <Text style={styles.statusTitle}>Order Status</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(purchaseOrder.int_status) + '20' }]}>
                                        <Text style={[styles.statusText, { color: getStatusColor(purchaseOrder.int_status) }]}>
                                            {getStatusText(purchaseOrder.int_status)}
                                        </Text>
                                    </View>
                                </View>

                                {purchaseOrder.int_status === 0 && (
                                    <View style={styles.actionButtons}>
                                        <Button
                                            mode="contained"
                                            style={styles.approveButton}
                                            labelStyle={styles.buttonLabel}
                                            disabled={sendingStatusUpdate}
                                            loading={statusLoading === 1}
                                            onPress={() => handleStatusUpdate('Approve')}
                                            icon="check"
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            mode="outlined"
                                            style={styles.rejectButton}
                                            labelStyle={styles.rejectLabel}
                                            disabled={sendingStatusUpdate}
                                            loading={statusLoading === 2}
                                            onPress={() => handleStatusUpdate('Reject')}
                                            icon="close"
                                        >
                                            Reject
                                        </Button>
                                    </View>
                                )}
                            </View>

                            <View style={styles.sectionSpacer} />

                            <InfoCard title="Auction Details" iterative={false} contentData={auctionDetails} />
                            <View style={styles.sectionSpacer} />
                            <InfoCard title="Supplier Details" iterative={false} contentData={supplierDetails} />
                            <View style={styles.sectionSpacer} />
                            <View style={styles.sectionSpacer} />
                            <InfoCard title="Organization Details (Buyer)" iterative={false} contentData={organizationDetails} />
                            <View style={styles.sectionSpacer} />
                            <InfoCard title="Items" iterative={true} contentData={itemsDetails} />
                            <View style={styles.sectionSpacer} />
                            <InfoCard
                                title="Bid Details"
                                iterative={false}
                                contentData={bidDetails}
                                footerButtonAvailable={true}
                                buttonFn={handleShowModal}
                            />

                        </ScrollView>
                    )}

                    <Portal>
                        <BidModal closeModal={handleHideModal} show={showModal} contentData={bidAdditionalDetails} />
                    </Portal>
                </View>
            </View>
        </View>
    );
};

export default BuyerPurchaseorderDetailsScreen;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: colors.neutral.surface.sunken,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: spacing['2xl'],
        paddingBottom: spacing.lg,
        paddingHorizontal: spacing.xl,
        backgroundColor: colors.neutral.surface.default,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    headerLabel: {
        ...typography.styles.caption,
        marginBottom: 2,
    },
    title: {
        ...typography.styles.h3,
        maxWidth: 250,
        color: colors.neutral.text.primary,
    },
    scrollContent: {
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
    },
    sectionSpacer: {
        height: spacing.xl,
    },
    statusCard: {
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.sm,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    statusTitle: {
        ...typography.styles.h4,
        color: colors.neutral.text.primary,
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
    actionButtons: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.sm,
    },
    approveButton: {
        flex: 1,
        backgroundColor: colors.semantic.success.default, // Fixed: use .default
        borderRadius: borderRadius.base,
    },
    rejectButton: {
        flex: 1,
        borderColor: colors.semantic.error.default, // Fixed: use .default
        borderRadius: borderRadius.base,
    },
    buttonLabel: {
        ...typography.styles.label,
        color: colors.neutral.white,
    },
    rejectLabel: {
        ...typography.styles.label,
        color: colors.semantic.error.default, // Fixed
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.neutral.surface.sunken,
    },
});
