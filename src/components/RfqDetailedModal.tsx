import { StyleSheet, View } from "react-native"
import { Button, Divider, Modal, Text } from "react-native-paper"
import { AuctionLinesType, AuctionType } from "../types/auction"
import { formatDateString } from "../utils/helper"
import { InfoCard } from "./InfoCard"
import { useMemo } from "react"

interface props {
    show: boolean,
    closeModal: () => void,
    auction: AuctionType,
    auctionLines: AuctionLinesType[]
}
export const RfqDetailedModal = ({closeModal, auction, auctionLines, show}: props) => {
    
    const itemsDetails = useMemo(() => {
        if (auctionLines){
            let items: any[] = [];
            auctionLines.map((item) => {
                items.push({
                    Name: item.product_name,
                    Quantity: item.quantity,
                    Brand: item.brand,
                    Price: item.target_price,
                })
            })
            return items
        }else{
            return []
        }
    }, [auctionLines]);
    
    return(
        <Modal visible={show} onDismiss={closeModal}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{auction.title}</Text>
                    <Text style={styles.date}>{formatDateString(auction.created_at)}</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.requestedLabel}>Requested By</Text>
                    <Text style={styles.requestedValue}>{auction.organization_name}</Text>
                    <Divider style={{borderColor: "#00000080", backgroundColor: '#00000080', width: '100%'}}/>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>RFQ Title:</Text>
                        <Text style={styles.rowText}>{auction.title}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Reference Number:</Text>
                        <Text style={styles.rowText}>{auction.requisition_number}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Product Category:</Text>
                        <Text style={styles.rowText}>{auction.product_category}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Product Sub Category:</Text>
                        <Text style={styles.rowText}>{auction.product_sub_category}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Contract Type:</Text>
                        <Text style={styles.rowText}>{auction.is_open ? "Open" : "Closed"}</Text>
                    </View>
                    <InfoCard title="Lines" footerButtonAvailable={false} iterative={true} contentData={itemsDetails}/>
                </View>
                <Button style={styles.closeBtn} labelStyle={{color: '#FFFFFF', fontSize: 11, fontWeight: '600'}} onPress={closeModal}>Close</Button>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 20, 
        paddingHorizontal: 16,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 16,
        marginHorizontal: 16,
        borderRadius: 10
    },
    card: {
        width: '100%',
        padding: 16,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#0000004D',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection:'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 4,
    },
    row: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5,
        flexWrap: 'wrap',
        marginBottom: 12
    },
    rowText: {
        color: '#00000099',
        fontWeight: '400',
        fontSize: 12
    },
    title: {
        fontSize: 15,
        fontWeight: '500',
        color: '#000000CC'
    },
    closeBtn: {
        backgroundColor: '#00B976',
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16
    },
    date: {
        fontSize: 10,
        fontWeight: '400',
        color: '#000000B2'
    },
    requestedLabel: {
        color: '#000000B2',
        fontSize: 11,
        fontWeight: '300'
    },
    requestedValue: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '400'
    },
})