import { StyleSheet, View } from "react-native"
import { Divider, Text } from "react-native-paper"

interface props {
    status: string,
    titleLabel: string,
    title: string,
    footerLeftText: string,
    footerRightText: string
}

export const  DataCard = ({status, footerLeftText, footerRightText, title, titleLabel}: props) => {
    return (
        <View style={styles.dataCardContainer}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleLabel}>{titleLabel}</Text>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <Text style={status === "APPROVED" ? styles.statusGreen : status === "OPEN" ? styles.statusGreen : status === "PENDING" ? styles.statusYellow: status === "AWARDED" ? styles.statusGreen: status === "CANCELLED" ? styles.statusGray: status === "WITHDRAWN" ? styles.statusBlue : status === "DISQUALIFIED" ? styles.statusDarkRed : status === "CLOSED" ?  styles.statusRed : status === "IN-PROGRESS" ? styles.statusGreen : status === "DRAFT" ? styles.statusOrange : styles.statusRed}>{status}</Text>
            </View>
            <Divider/>
            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>{footerLeftText}</Text>
                <Text style={styles.footerText}>{footerRightText}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    dataCardContainer: {
        borderWidth: 1,
        borderColor: '#00000033',
        borderRadius: 10,
        width: "100%",
        marginBottom: 16
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 24,
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    titleLabel: {
        color: '#00000099',
        fontSize: 12,
        fontWeight: '400'
    },
    title: {
        fontSize: 12,
        fontWeight: '400',
        color: "#000000"
    },
    statusGreen: {
        fontSize: 12,
        fontWeight: '400',
        color: '#00FF00'
    },
    statusYellow: {
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
    statusOrange: {
        fontSize: 12,
        fontWeight: '400',
        color: '#F7A64F'
    },
    footerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 24,
    },
    footerText: {
        color: '#000000B2',
        fontSize: 12,
        fontWeight: '400'
    }
})