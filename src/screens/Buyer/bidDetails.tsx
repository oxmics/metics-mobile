import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, StyleSheet, TouchableOpacity, View, StatusBar } from 'react-native';
import { ActivityIndicator, Icon, Text } from 'react-native-paper';
import { CustomNavigationProp } from '../../types/common';
import { CommentCard } from '../../components/CommentCard';
import useBid from '../../api/bids/useBid';
import useBidComments from '../../api/bids/useBidComments';
import useBidLines from '../../api/bids/useBidLines';
import useCreateBidComment from '../../api/bids/useCreateBidComment';
import useAuctionLines from '../../api/auctions/useAuctionLineHeader';
import { BidNegotaiteCard } from '../../components/BidNegotiateCard';
import { BidDetailsCard } from '../../components/BidDetailsCard';
import { BottomNavbar } from '../../components/BottomNavbar';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

type RootStackParamList = {
    BuyerBidsDetailsScreen: {
        bidId: string;
        reqId: string;
    };
};

const BuyerBidsDetailsScreen = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'BuyerBidsDetailsScreen'>>();
    const { bidId, reqId } = route.params;

    const navigation = useNavigation<CustomNavigationProp>();

    const { data: bid, isPending: loading } = useBid({ id: bidId });
    const { data: auctionLines } = useAuctionLines({ id: reqId });
    const { data: bidLines } = useBidLines({ id: bidId });
    const { data: comments, isPending: commentsLoading, refetch: refetchComments } = useBidComments({ id: bidId });
    const { mutateAsync: createComment, isPending: sendingComments } = useCreateBidComment();

    const handleComment = (value: string) => {
        createComment({ id: bidId, message: value }).then(() => {
            refetchComments();
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[800]} />
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.background} />

            <View style={styles.contentContainer}>
                <View style={styles.scrollContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                            activeOpacity={0.7}
                        >
                            <Icon size={24} source="arrow-left" color={colors.neutral.text.primary} />
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.headerLabel}>Bid Information</Text>
                            <Text style={styles.title}>Details</Text>
                        </View>
                    </View>

                    {bid && (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            <BidDetailsCard
                                name={bid.organisation?.name}
                                address={bid.organisation?.address_line1}
                                contact={bid.organisation?.contact}
                            />

                            <View style={styles.sectionSpacer} />

                            <BidDetailsCard
                                title="Bid Specification"
                                bid_no={bid.bidders_bid_number}
                                expiry_date={bid.bid_expiration_date}
                                status={bid.bid_status}
                            />

                            <View style={styles.sectionSpacer} />

                            {bidLines && auctionLines && auctionLines.length > 0 && (
                                <BidNegotaiteCard auctionLines={auctionLines} bidLine={bidLines} />
                            )}

                            <View style={styles.sectionSpacer} />

                            <CommentCard
                                comments={comments}
                                buttonFn={handleComment}
                                loading={sendingComments || commentsLoading}
                            />
                        </ScrollView>
                    )}
                </View>
            </View>
        </View>
    );
};

export default BuyerBidsDetailsScreen;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: colors.neutral.background,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: colors.neutral.background,
        paddingHorizontal: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: spacing['2xl'],
        paddingBottom: spacing.lg,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.base,
        backgroundColor: colors.neutral.surface.default,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
        ...shadows.sm,
    },
    headerLabel: {
        ...typography.styles.caption,
        marginBottom: 2,
    },
    title: {
        ...typography.styles.h2,
    },
    scrollContent: {
        paddingBottom: spacing.xl,
    },
    sectionSpacer: {
        height: spacing.xl,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.neutral.background,
    },
});
