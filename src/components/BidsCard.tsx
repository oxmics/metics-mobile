import { StyleSheet, TouchableOpacity, View } from "react-native"
import { Button, Divider, Text, useTheme } from "react-native-paper"
import { BidType } from "../types/bids"
import { formatDate } from "../utils/helper"
import { useNavigation } from "@react-navigation/native"
import { CustomNavigationProp } from "../types/common"
import { useContext } from "react"
import { ThemeContext } from "../themes/ThemeContext"

interface props {
    contentData: BidType[],
    buttonFn: () => void
}

export const BidsCard = ({contentData, buttonFn}: props) => {
    const navigation = useNavigation<CustomNavigationProp>();
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    return(
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>All Bids</Text>
                <Button style={styles.footerBtn} labelStyle={{color: '#FFFFFF', fontSize: 11, fontWeight: '600'}} onPress={() => buttonFn()}>Compare</Button>
            </View>
            <Divider style={{borderColor: theme.colors.placeholder, backgroundColor: theme.colors.placeholder, marginBottom:20, width: "100%"}}/>
            {contentData.map((bid, index) => (
                <TouchableOpacity key={index} onPress={() => navigation.navigate('BuyerBidsDetails', {bidId: bid.id, reqId: bid.auction_header.id})}>
                    <View style={styles.card}>
                        <Text style={styles.rowText}>Quoted By: {bid.organisation.name}:</Text>
                        <Text style={styles.date}>Expiration Date: {formatDate(bid.bid_expiration_date)}</Text>
                    </View>
                </TouchableOpacity>
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