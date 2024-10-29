import { StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"
import { BidLineType } from "../types/bids"
import { formatDate } from "../utils/helper"
import { AuctionLinesType } from "../types/auction"

interface props {
    auctionLines: AuctionLinesType[],
    bidLine: BidLineType[]
}

export const BidNegotaiteCard = ({auctionLines, bidLine}: props) => {

    return(
        <View style={styles.container}>
                {auctionLines.map((auctionLine, index) => (
                    <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Product Name</Text>
                        <Text style={styles.date}>{auctionLine.product_name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Quantity</Text>
                        <Text style={styles.date}>{auctionLine.quantity}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Brand</Text>
                        <Text style={styles.date}>{auctionLine.brand}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Price Quoted</Text>
                        <Text style={styles.date}>{bidLine[index].price}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Promised Date</Text>
                        <Text style={styles.date}>{formatDate(bidLine[index].promised_date)}</Text>
                    </View>
                </View>
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