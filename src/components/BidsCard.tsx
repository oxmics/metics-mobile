import { StyleSheet, TouchableOpacity, View } from "react-native"
import { Button, Divider, Text } from "react-native-paper"
import { BidType } from "../types/bids"
import { formatDate } from "../utils/helper"
import { useNavigation } from "@react-navigation/native"
import { CustomNavigationProp } from "../types/common"

interface props {
    contentData: BidType[],
    buttonFn: () => void
}

export const BidsCard = ({contentData, buttonFn}: props) => {
    const navigation = useNavigation<CustomNavigationProp>();

    return(
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>All Bids</Text>
                <Button style={styles.footerBtn} labelStyle={{color: '#FFFFFF', fontSize: 11, fontWeight: '600'}} onPress={() => buttonFn()}>Compare</Button>
            </View>
            <Divider style={{borderColor: "#00000080", backgroundColor: "#00000080", marginBottom:20, width: "100%"}}/>
            {contentData.map((bid) => (
                <TouchableOpacity onPress={() => navigation.navigate('BuyerBidsDetails', {bidId: bid.id, reqId: bid.auction_header.id})}>
                    <View style={styles.card}>
                        <Text style={styles.rowText}>Quoted By: {bid.organisation.name}:</Text>
                        <Text style={styles.date}>Expiration Date: {formatDate(bid.bid_expiration_date)}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 16,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#0000004D',
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 15,
        fontWeight: '500',
        color: '#000000CC',
        marginLeft: 12,
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
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 4,
        marginBottom: 12
    },
    row: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    rowText: {
        color: '#000000',
        fontWeight: '400',
        fontSize: 10
    },
    footerBtn: {
        backgroundColor: '#157F4C',
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleContainer: {
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
    }
    
})