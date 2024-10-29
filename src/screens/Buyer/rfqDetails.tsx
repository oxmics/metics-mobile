import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Icon, Portal, Text } from "react-native-paper";
import { CustomNavigationProp } from "../../types/common";
import { useMemo, useState } from "react";
import useAuctionDetails from "../../api/auctions/useAuction";
import useAuctionLines from "../../api/auctions/useAuctionLineHeader";
import useComments from "../../api/auctions/useComments";
import useCreateComment from "../../api/auctions/useCreateComment";
import { RequestInfoCard } from "../../components/RequestCard";
import { CommentCard } from "../../components/CommentCard";
import { BidsCard } from "../../components/BidsCard";
import useBids from "../../api/bids/useBids";
import { RfqDetailedModal } from "../../components/RfqDetailedModal";
import { BottomNavbar } from "../../components/BottomNavbar";

type RootStackParamList = {
    BuyerRfqDetailsScreen: {
      reqId: string;
    };
};

const BuyerRfqDetailsScreen = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'BuyerRfqDetailsScreen'>>();
    const {reqId} = route.params;
    
    const navigation = useNavigation<CustomNavigationProp>();

    const [showModal, setShowModal] = useState<boolean>(false);

    const {data: auction, isPending: loading, refetch} = useAuctionDetails({id: reqId});
    const {data: auctionLines, isPending: linesLoading, refetch: refetchLines} = useAuctionLines({id: reqId});
    const {data: comments, isPending: commentsLoading, refetch: refetchComments} = useComments({id: reqId});
    const {mutateAsync: createComment, isPending: sendingComments} = useCreateComment();
    const {data: bids, isPending: bidsLoading} = useBids({id: reqId});

    const requestedByDetails = useMemo(() => {
        if(auction) {
            return {
                Title: auction.title,
                'Reference Number': auction.requisition_number,
                'Contract Type': auction.is_open ? "OPEN":  "CLOSED"
            }
        }
    }, [auction]);

    const handleShowModal= () => {
        setShowModal(true)
    };

    const handleHideModal = () => {
        setShowModal(false)
    }

    const handleComment = (value: string) => {
        createComment({id: reqId, message: value}).then((res) => {
            refetchComments();
        })
    }

    return(
        <View style={{position: 'relative', flex: 1, backgroundColor: '#FFFFFF'}}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.replace("BuyerRfqHistory")}>
                        <Icon size={20} source={"arrow-left"} color="#000000"/>
                    </TouchableOpacity>
                    <Text style={styles.title}>Details</Text>
                </View>
                {(!loading && auction) ? <ScrollView>
                    <View style={styles.cardContainer}>
                        <RequestInfoCard title={auction.title} contentData={requestedByDetails} organization_name={auction.organization_name} date={auction.created_at} buttonAvailable={true} buttonFn={handleShowModal}/>
                        <CommentCard comments={comments} buttonFn={handleComment} loading={sendingComments}/>
                        {bids && !bidsLoading ? <BidsCard buttonFn={()=>{}} contentData={bids}/>: <View style={styles.loadingContainer}><ActivityIndicator animating={true} size={"large"} color="#000000"/></View>}
                    </View>
                </ScrollView>: <View style={styles.loadingContainer}><ActivityIndicator animating={true} size={"large"} color="#000000"/></View>}
                <Portal>
                    {auctionLines && auction && <RfqDetailedModal auctionLines={auctionLines} auction={auction} closeModal={handleHideModal} show={showModal}/>}
                </Portal>
            </View>
            <BottomNavbar/>
        </View>
    )
}

export default BuyerRfqDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
        backgroundColor: '#FFFFFF',
        marginBottom: 80,
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