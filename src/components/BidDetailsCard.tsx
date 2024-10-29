import { StyleSheet, View } from "react-native"
import { Text } from "react-native-paper";
import { capitalizeFirstLetter, formatDate } from "../utils/helper";

interface props {
    title?: string,
    name?: string,
    address?: string,
    contact?: string,
    bid_no?: number,
    expiry_date?: string,
    status?: "awarded" | "rejected" | "cancelled" | "disqualified" | "withdrawn" | "submitted" | "draft"
}

export const BidDetailsCard = ({address, contact, title, name, bid_no, expiry_date, status}: props) => {
    return (
        <View style={styles.card}>
            {title && <Text style={styles.title}>{title}</Text>}
            {name && <Text style={styles.title}>Quoted By: {name}</Text>}
            {address && <View style={styles.row}>
                <Text style={styles.rowText}>Address:</Text>
                <Text style={styles.rowText}>{address}</Text>
            </View>}
            {contact && <View style={styles.row}>
                <Text style={styles.rowText}>Contact:</Text>
                <Text style={styles.rowText}>{contact}</Text>
            </View>}
            {bid_no && <View style={styles.row}>
                <Text style={styles.rowText}>Bid No:</Text>
                <Text style={styles.rowText}>{bid_no}</Text>
            </View>}
            {expiry_date && <View style={styles.row}>
                <Text style={styles.rowText}>Expiry Date:</Text>
                <Text style={styles.rowText}>{formatDate(expiry_date)}</Text>
            </View>}
            {status && <View style={styles.row}>
                <Text style={styles.rowText}>Status:</Text>
                <View style={styles.statusContainer}>
                    <Text style={status === "submitted" ? styles.statusGreen : status === "draft" ? styles.statusOrange : status === "withdrawn" ? styles.statusBlue : status === "disqualified" ? styles.statusDarkRed : status === "cancelled" ? styles.statusGray : status === "awarded" ? styles.statusYellow : styles.statusRed}>{capitalizeFirstLetter(status)}</Text>
                </View>
            </View>}
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
        marginBottom: 16
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
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 5,
        flexWrap: 'wrap'
    },
    rowText: {
        color: '#00000099',
        fontWeight: '400',
        fontSize: 12
    },
    statusContainer: {
        backgroundColor: '#D9D9D9B2',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4
    },
    statusGreen: {
        fontSize: 12,
        fontWeight: '400',
        color: '#00FF00'
    },
    statusOrange: {
        fontSize: 12,
        fontWeight: '400',
        color: '#F7A64F'
    },
    statusRed: {
        fontSize: 12,
        fontWeight: '400',
        color: '#FF003D'
    },
    statusBlue: {
        fontSize: 12,
        fontWeight: '400',
        color: '#B9D7FD'
    },
    statusGray: {
        fontSize: 12,
        fontWeight: '400',
        color: '#DBE1DF'
    },
    statusDarkRed: {
        fontSize: 12,
        fontWeight: '400',
        color: '#A80909'
    },
    statusYellow: {
        fontSize: 12,
        fontWeight: '400',
        color: '#F7A64F'
    },
});