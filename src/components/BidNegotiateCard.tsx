import { StyleSheet, View } from "react-native"
import { Text, useTheme } from "react-native-paper";
import { BidLineType } from "../types/bids"
import { formatDate } from "../utils/helper"
import { AuctionLinesType } from "../types/auction"
import { useContext } from "react";
import { ThemeContext } from "../themes/ThemeContext";

interface props {
    auctionLines: AuctionLinesType[],
    bidLine: BidLineType[]
}

export const BidNegotaiteCard = ({auctionLines, bidLine}: props) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    return(
        <View style={styles.container}>
                {auctionLines.map((auctionLine, index) => (
                    <View style={styles.card} key={index}>
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

const getStyles = (theme) => StyleSheet.create({
    container: {
        width: '100%',
        padding: 16,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: theme.colors.placeholder,
        backgroundColor: theme.colors.surface,
    },
    title: {
        fontSize: 15,
        fontWeight: '500',
        color: theme.colors.text,
        marginLeft: 12,
    },
    card: {
        width: '100%',
        padding: 16,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: theme.colors.placeholder,
        backgroundColor: theme.colors.surface,
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
        color: theme.colors.text,
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
        color: theme.colors.placeholder
    }
    
})