import { StyleSheet, View } from "react-native"
import { Button, Divider, Text } from "react-native-paper"
import { formatDateString } from "../utils/helper"

interface props {
    title: string,
    contentData: any,
    organization_name: string
    date: string,
    buttonAvailable?: boolean,
    buttonFn?: () => void
}

export const RequestInfoCard = ({contentData, date, title, organization_name, buttonAvailable, buttonFn}: props) => {

    return(
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.date}>{formatDateString(date)}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.requestedLabel}>Requested By</Text>
                <Text style={styles.requestedValue}>{organization_name}</Text>
                <Divider style={{borderColor: "#00000080", backgroundColor: '#00000080', width: '100%'}}/>
                {Object.entries(contentData).map(([key, value], index) => (
                  <View key={index} style={styles.row}>
                    <Text style={styles.rowText}>{key}:</Text>
                    <Text style={styles.rowText}>{String(value)}</Text>
                  </View>
                ))}
            </View>
            {buttonAvailable && buttonFn &&
                <View style={styles.footer}>
                    <Button style={styles.footerBtn} labelStyle={{color: '#FFFFFF', fontSize: 11, fontWeight: 600}} onPress={() => buttonFn()}>See More</Button>
                </View>
            }
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
        color: '#00000099',
        fontWeight: '400',
        fontSize: 12
    },
    footer: {
        paddingTop: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    footerBtn: {
        backgroundColor: '#00B976',
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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