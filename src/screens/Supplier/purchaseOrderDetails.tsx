import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, Icon, Portal, Text } from "react-native-paper";
import { CustomNavigationProp } from "../../types/common";
import usePurchaseOrder from "../../api/purchase order/usePurchaseOrder";
import { InfoCard } from "../../components/InfoCard";
import { useMemo, useState } from "react";
import { formatDate } from "../../utils/helper";
import useUpdatePurchaseOrderStatus from "../../api/purchase order/usePurchaseOrderStatusUpdate";
import { BidModal } from "../../components/Modal";

type RootStackParamList = {
    SupplierPurchaseOrderDetailsScreen: {
      orderId: string;
    };
};

const SupplierPurchaseorderDetailsScreen = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'SupplierPurchaseOrderDetailsScreen'>>();
    const {orderId} = route.params;
    
    const navigation = useNavigation<CustomNavigationProp>();

    const [statusLoading, setStatusLoading] = useState<0|1|2>(0);
    const [showModal, setShowModal] = useState<boolean>(false);

    const {data: purchaseOrder, isPending: loading, refetch} = usePurchaseOrder({id: orderId});

    const {mutateAsync: update, isPending: sendingStatusUpdate} = useUpdatePurchaseOrderStatus();

    const handleStatusUpdate = (status: string) => {
        if(status === "Approve") {
            setStatusLoading(1)
        }else{
            setStatusLoading(2)
        }
        update({
            id: orderId,
            status: status
        }).then((res) => setStatusLoading(0))        
    }

    const buyerDetails = useMemo(()=> {
        if (purchaseOrder) {
            return {
                Name: purchaseOrder.buyer_organisation_details.name,
                Address: purchaseOrder.buyer_organisation_details.address_line1,
                City: purchaseOrder.buyer_organisation_details.city,
                State: purchaseOrder.buyer_organisation_details.state
            };
        }else{
            return {}
        }
    }, [purchaseOrder]);

    const supplierDetails = useMemo(()=> {
        if (purchaseOrder) {
            return {
                Name: purchaseOrder.supplier_organisation_details.name,
                Address: purchaseOrder.supplier_organisation_details.address_line1,
                City: purchaseOrder.supplier_organisation_details.city,
                State: purchaseOrder.supplier_organisation_details.state,
                Country: purchaseOrder.supplier_organisation_details.country,
                'Postal Code': purchaseOrder.supplier_organisation_details.postal_code,
                Email: purchaseOrder.supplier_organisation_details.email,
                Contact: purchaseOrder.supplier_organisation_details.contact,
                'Total Turnover': purchaseOrder.supplier_organisation_details.total_turnover,
                'No of Employees': purchaseOrder.supplier_organisation_details.number_of_employees
            };
        }else{
            return {}
        }
    }, [purchaseOrder]);

    const organizationDetails = useMemo(()=> {
        if (purchaseOrder) {
            return {
                Name: purchaseOrder.buyer_organisation_details.name,
                Address: purchaseOrder.buyer_organisation_details.address_line1,
                City: purchaseOrder.buyer_organisation_details.city,
                State: purchaseOrder.buyer_organisation_details.state,
                Country: purchaseOrder.buyer_organisation_details.country,
                'Postal Code': purchaseOrder.buyer_organisation_details.postal_code,
                Email: purchaseOrder.buyer_organisation_details.email,
                Contact: purchaseOrder.buyer_organisation_details.contact,
                'Total Turnover': purchaseOrder.buyer_organisation_details.total_turnover,
                'No of Employees': purchaseOrder.buyer_organisation_details.number_of_employees
            };
        }else{
            return {}
        }
    }, [purchaseOrder])

    const bidDetails = useMemo(() => {
        if (purchaseOrder){
            return {
                'Bidders Bid Number': purchaseOrder.bid_header_details.bidders_bid_number,
                'Bid status': purchaseOrder.bid_header_details.bid_status,
                Status: purchaseOrder.bid_header_details.auction_header.status,
                'Bid count': purchaseOrder.bid_header_details.auction_header.bid_count
            }
        }else{
            return {}
        }
    }, [purchaseOrder])

    const itemsDetails = useMemo(() => {
        if (purchaseOrder){
            let items: any[] = [];
            purchaseOrder.details.map((item, index) => {
                items.push({
                    'sl no': index+1,
                    Name: item.product_name,
                    Quantity: item.quantity,
                    Price: item.price,
                    // 'Promised Date': formatDate(purchaseOrder.bid_header_details.auction_header.need_by_date)
                })
            })
            return items
        }else{
            return []
        }
    }, [purchaseOrder])

    const handleShowModal= () => {
        setShowModal(true)
    };

    const handleHideModal = () => {
        setShowModal(false)
    }

    const bidAdditionalDetails = useMemo(() => {
        if (purchaseOrder){
            return {
                'Bidders Bid Number': purchaseOrder.bid_header_details.bidders_bid_number,
                'Bid status': purchaseOrder.bid_header_details.bid_status,
                'Response Type': purchaseOrder.bid_header_details.type_of_response,
                'Bid Expiration Date': formatDate(purchaseOrder.bid_header_details.bid_expiration_date),
                'Supplier Note': purchaseOrder.bid_header_details.note_to_supplier ? purchaseOrder.bid_header_details.note_to_supplier: "",
                Status: purchaseOrder.bid_header_details.auction_header.status,
                'Bid count': purchaseOrder.bid_header_details.auction_header.bid_count
            }
        }else{
            return {}
        }
    }, [purchaseOrder])

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.replace("SupplierPurchaseOrder")}>
                    <Icon size={20} source={"arrow-left"} color="#000000"/>
                </TouchableOpacity>
                <Text style={styles.title}>Purchase Order Details</Text>
            </View>
            {(!loading && purchaseOrder) ? <ScrollView>
                <View style={styles.statusContainer}>
                    <Text style={styles.orderStatusLabel}>Order Status:</Text>
                    <View style={styles.statusValueContainer}>{purchaseOrder.int_status == -1 ? <Text style={styles.rejectedStatus}>REJECTED</Text>:purchaseOrder.int_status == 0? <Text style={styles.pendingStatus}>PENDING</Text> : <Text style={styles.acceptedStatus}>ACCEPTED</Text>}</View>
                </View>
                {purchaseOrder.int_status === 0 && <View style={styles.statusBtnContainer}>
                    <Button style={styles.approveBtn} labelStyle={styles.statusBtnText} disabled={sendingStatusUpdate} loading={statusLoading === 1} onPress={() => handleStatusUpdate("Approve")}>
                        Approve
                    </Button>
                    <Button style={styles.rejectBtn} labelStyle={styles.statusBtnText} disabled={sendingStatusUpdate} loading={statusLoading === 2} onPress={() => handleStatusUpdate("Reject")}>
                        Reject
                    </Button>
                </View>}
                <View style={styles.cardContainer}>
                    <InfoCard title="Buyer Details" iterative={false} contentData={buyerDetails}/>
                    <InfoCard title="Supplier Details" iterative={false} contentData={supplierDetails}/>
                    <InfoCard title="Organization Details" iterative={false} contentData={organizationDetails}/>
                    <InfoCard title="Items" iterative={true} contentData={itemsDetails}/>
                    <InfoCard title="Bid Details" iterative={false} contentData={bidDetails} footerButtonAvailable={true} buttonFn={handleShowModal}/>
                </View>
            </ScrollView>: <View style={styles.loadingContainer}><ActivityIndicator animating={true} size={"large"} color="#000000"/></View>}
            <Portal>
                <BidModal closeModal={handleHideModal} show={showModal} contentData={bidAdditionalDetails}/>
            </Portal>
        </View>
    )
}

export default SupplierPurchaseorderDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
        backgroundColor: '#FFFFFF'
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
        fontWeight: 500,
        color: '#000000'
    },
    cardContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 24,
        paddingTop: 16
    },
    statusContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderStatusLabel: {
        fontSize: 14,
        fontWeight: 400,
        color: '#00000099',
        marginLeft: 40
    },
    statusValueContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#D9D9D9B2',
        marginRight: 8,
        borderRadius: 2
    },
    pendingStatus: {
        fontSize: 12,
        fontWeight: 400,
        color: '#F7A64F'
    },
    rejectedStatus: {
        fontSize: 12,
        fontWeight: 400,
        color: '#FC555B'
    },
    acceptedStatus: {
        fontSize: 12,
        fontWeight: 400,
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
        fontWeight: 500,
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