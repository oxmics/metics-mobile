import { StyleSheet, Text, View } from "react-native"
import { SupplierActivityLogsType } from "../types/dashboard"
import { daysAgo } from "../utils/helper"
import { Button } from "react-native-paper"

interface props {
    logs: SupplierActivityLogsType[],
    viewAll: () => void
}

export const RecentUpdatesCard = ({logs, viewAll}: props) => {
    return(
        <View style={styles.container}>
            <View style={styles.body}>
                {logs.length > 0 ?logs.map((log, index) =>{ if (index < 5) {
                    return (
                        <View key={index} style={styles.row}>
                            <Text style={styles.heading}>{log.activity_type}</Text>
                            <View style={styles.descriptionRow}>
                                <Text style={styles.description}>{log.description}</Text>
                                <Text style={styles.date}>{daysAgo(log.updated_at)}</Text>
                            </View>
                        </View>
                    )
                }}): <View><Text>No recent updates</Text></View>}
            </View>
            {logs.length > 0 && <View style={styles.footer}>
                <Button onPress={viewAll} mode="text" textColor="#1BBB6B">View All</Button>
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#00000033',
        borderRadius: 10,
        width: '100%',
        backgroundColor: '#FFFFFF'
    },
    body: {
        padding: 20,
        width: '100%',
    },
    row: {
        display: 'flex',
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderBottomColor: '#00000033',
        paddingVertical: 8,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    heading: {
        fontSize: 13,
        fontWeight: '500',
        color: '#000000'
    },
    description: {
        width: '60%',
        flexWrap: 'wrap',
        color: '#00000099',
        fontSize: 12,
        fontWeight: '400'
    },
    date: {
        color: '#00000099',
        fontSize: 12,
        fontWeight: '400'
    },
    descriptionRow: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 4
    },
    footer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#00000033',
    }
})