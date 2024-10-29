import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Icon, Portal, Text } from "react-native-paper";
import { CustomNavigationProp } from "../../types/common";
import { useMemo, useState } from "react";
import { CommentCard } from "../../components/CommentCard";
import useBid from "../../api/bids/useBid";
import useBidComments from "../../api/bids/useBidComments";
import useBidLines from "../../api/bids/useBidLines";
import useCreateBidComment from "../../api/bids/useCreateBidComment";
import { formatDate } from "../../utils/helper";
import useAuctionLines from "../../api/auctions/useAuctionLineHeader";
import { TemplatesCard } from "../../components/TemplatesCard";
import { BidNegotaiteCard } from "../../components/BidNegotiateCard";
import { BidDetailsCard } from "../../components/BidDetailsCard";
import { BottomNavbar } from "../../components/BottomNavbar";

type RootStackParamList = {
    BuyerBidsDetailsScreen: {
      bidId: string;
      reqId: string;
    };
};

const BuyerBidsDetailsScreen = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'BuyerBidsDetailsScreen'>>();
    const {bidId, reqId} = route.params;
    
    const navigation = useNavigation<CustomNavigationProp>();

    const [showModal, setShowModal] = useState<boolean>(false);

    const {data: bid, isPending: loading, refetch} = useBid({id: bidId});
    const {data: auctionLines, isPending: auctionLineLoading, refetch: refetchAuctionLines} = useAuctionLines({id: reqId});
    const {data: bidLines, isPending: linesLoading, refetch: refetchLines} = useBidLines({id: bidId});
    const {data: comments, isPending: commentsLoading, refetch: refetchComments} = useBidComments({id: bidId});
    const {mutateAsync: createComment, isPending: sendingComments} = useCreateBidComment();

    const handleShowModal= () => {
        setShowModal(true)
    };

    const handleHideModal = () => {
        setShowModal(false)
    }

    const handleComment = (value: string) => {
        createComment({id: bidId, message: value}).then((res) => {
            refetchComments();
        })
    }

    return(
        <View style={{position: 'relative', flex: 1, backgroundColor: '#FFFFFF'}}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.replace("BuyerRfqDetails", {reqId: reqId})}>
                        <Icon size={20} source={"arrow-left"} color="#000000"/>
                    </TouchableOpacity>
                    <Text style={styles.title}>Details</Text>
                </View>
                {(!loading && bid) ? <ScrollView>
                    <View style={styles.cardContainer}>
                        <BidDetailsCard name={bid.organisation.name} address={bid.organisation.address_line1} contact={bid.organisation.contact}/>
                        <BidDetailsCard title="Bid Details" bid_no={bid.bidders_bid_number} expiry_date={bid.bid_expiration_date} status={bid.bid_status}/>
                        <CommentCard comments={comments} buttonFn={handleComment} loading={sendingComments}/>
                        {bidLines && auctionLines && auctionLines.length > 0 && <BidNegotaiteCard auctionLines={auctionLines} bidLine={bidLines}/>}
                    </View>
                </ScrollView>: <View style={styles.loadingContainer}><ActivityIndicator animating={true} size={"large"} color="#000000"/></View>}
                {/* <Portal>
                    {auctionLines && auction && <RfqDetailedModal auctionLines={auctionLines} auction={auction} closeModal={handleHideModal} show={showModal}/>}
                </Portal> */}
            </View>
            <BottomNavbar/>
        </View>
    )
}

export default BuyerBidsDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
        backgroundColor: '#FFFFFF',
        marginBottom: 80
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 4,
        paddingVertical: 20
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        color: '#000000'
    },
    cardContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 24,
        paddingTop: 16,
        marginBottom: 16,
    },
    statusContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderStatusLabel: {
        fontSize: 20,
        fontWeight: '400',
        color: '#000000E5',
        marginLeft: 12
    },
    statusValueContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10
    },
    pendingStatus: {
        fontSize: 12,
        fontWeight: '400',
        color: '#F7A64F'
    },
    rejectedStatus: {
        fontSize: 12,
        fontWeight: '400',
        color: '#FC555B'
    },
    acceptedStatus: {
        fontSize: 12,
        fontWeight: '400',
        color: '#00B528'
    },
    statusBtnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        gap: 10,
        paddingHorizontal: 16,
        paddingTop: 12
    },
    approveBtn: {
        backgroundColor: '#00B528',
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rejectBtn: {
        backgroundColor: '#D92121',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusBtnText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#FFFFFF'
    },
    loadingContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})