import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, StyleSheet, TouchableOpacity, View, StatusBar } from 'react-native';
import { ActivityIndicator, Icon, Portal, Text } from 'react-native-paper';
import { CustomNavigationProp } from '../../types/common';
import { useMemo, useState } from 'react';
import useAuctionDetails from '../../api/auctions/useAuction';
import useAuctionLines from '../../api/auctions/useAuctionLineHeader';
import useComments from '../../api/auctions/useComments';
import useCreateComment from '../../api/auctions/useCreateComment';
import useBids from '../../api/bids/useBids';
import { RequestInfoCard } from '../../components/RequestCard';
import { CommentCard } from '../../components/CommentCard';
import { BidsCard } from '../../components/BidsCard';
import { RfqDetailedModal } from '../../components/RfqDetailedModal';
import { BottomNavbar } from '../../components/BottomNavbar';
import { colors, typography, spacing, borderRadius } from '../../theme';

type RootStackParamList = {
    BuyerRfqDetails: {
        reqId: string;
    };
};

const BuyerRfqDetailsScreen = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'BuyerRfqDetails'>>();
    const { reqId } = route.params;

    const navigation = useNavigation<CustomNavigationProp>();

    const [showModal, setShowModal] = useState<boolean>(false);

    const { data: auction, isPending: loading, isError: auctionError } = useAuctionDetails({ id: reqId });
    const { data: auctionLines } = useAuctionLines({ id: reqId });
    const { data: comments, refetch: refetchComments } = useComments({ id: reqId });
    const { mutateAsync: createComment, isPending: sendingComments } = useCreateComment();
    const { data: bids, isPending: bidsLoading } = useBids({ id: reqId });

    const requestedByDetails = useMemo(() => {
        if (auction) {
            return {
                Title: auction.title,
                'Reference Number': auction.requisition_number,
                'Contract Type': auction.is_open ? 'OPEN' : 'CLOSED',
            };
        }
        return {};
    }, [auction]);

    const handleShowModal = () => setShowModal(true);
    const handleHideModal = () => setShowModal(false);

    const handleComment = (value: string) => {
        createComment({ id: reqId, message: value }).then(() => {
            refetchComments();
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    if (!loading && (auctionError || !auction)) {
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
                        <Text style={styles.headerLabel}>Request Details</Text>
                        <Text style={styles.title} numberOfLines={1}>Error</Text>
                    </View>
                </View>

                <View style={styles.errorContainer}>
                    <Icon source="alert-circle-outline" size={64} color={colors.semantic.error.default} />
                    <Text style={styles.errorTitle}>Failed to Load RFQ</Text>
                    <Text style={styles.errorMessage}>
                        {auctionError ? 'Unable to fetch request details. Please try again.' : 'Request not found.'}
                    </Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.retryButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
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
                    <Text style={styles.headerLabel}>Request Details</Text>
                    <Text style={styles.title} numberOfLines={1}>{auction?.requisition_number || ''}</Text>
                </View>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.scrollContainer}>
                    {auction && (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            <RequestInfoCard
                                title={auction.title}
                                contentData={requestedByDetails}
                                organization_name={auction.organization_name}
                                date={auction.created_at}
                                buttonAvailable={true}
                                buttonFn={handleShowModal}
                            />

                            <View style={styles.sectionSpacer} />

                            <CommentCard
                                comments={comments}
                                buttonFn={handleComment}
                                loading={sendingComments}
                            />

                            <View style={styles.sectionSpacer} />

                            {bidsLoading ? (
                                <ActivityIndicator size="small" color={colors.primary[500]} />
                            ) : bids ? (
                                <BidsCard buttonFn={() => { }} contentData={bids} />
                            ) : null}
                        </ScrollView>
                    )}

                    <Portal>
                        {auctionLines && auction && (
                            <RfqDetailedModal
                                auctionLines={auctionLines}
                                auction={auction}
                                closeModal={handleHideModal}
                                show={showModal}
                            />
                        )}
                    </Portal>
                </View>
            </View>
        </View>
    );
};

export default BuyerRfqDetailsScreen;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: colors.neutral.surface.sunken, // Light gray for content background
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
        backgroundColor: colors.neutral.surface.default, // White header
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.neutral.surface.sunken,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        backgroundColor: colors.neutral.surface.sunken,
    },
    errorTitle: {
        ...typography.styles.h3,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
        color: colors.neutral.text.primary,
    },
    errorMessage: {
        ...typography.styles.body,
        textAlign: 'center',
        color: colors.neutral.text.secondary,
        marginBottom: spacing.xl,
    },
    retryButton: {
        backgroundColor: colors.primary[500],
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.base,
        marginTop: spacing.md,
    },
    retryButtonText: {
        ...typography.styles.label,
        color: colors.neutral.white,
    },
});
