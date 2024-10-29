import { Button, Modal, Text } from "react-native-paper"
import { SupplierActivityLogsType } from "../types/dashboard"
import { ScrollView, StyleSheet, View } from "react-native"
import { daysAgo } from "../utils/helper"

interface props {
    show: boolean,
    hideModal: () => void,
    logs: SupplierActivityLogsType[]
}

export const RecentUpdatesModal = ({hideModal, logs, show}: props) => {
    return(
        <Modal visible={show} onDismiss={hideModal} dismissable dismissableBackButton>
            <View style={styles.holder}>
                <View style={styles.container}>
                    <ScrollView style={styles.body}>
                        {logs.map((log, index) =>(
                            <View key={index} style={styles.row}>
                                    <Text style={styles.heading}>{log.activity_type}</Text>
                                    <View style={styles.descriptionRow}>
                                        <Text style={styles.description}>{log.description}</Text>
                                        <Text style={styles.date}>{daysAgo(log.updated_at)}</Text>
                                    </View>
                                </View>
                            )
                        )}
                    </ScrollView>
                    <View style={styles.footer}>
                        <Button onPress={hideModal} mode="text" textColor="#1BBB6B">Close</Button>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    holder: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '75%',
    },
    container: {
        borderWidth: 1,
        borderColor: '#00000033',
        borderRadius: 10,
        width: '80%',
        height: '100%',
        backgroundColor: '#FFFFFF'
    },
    body: {
        padding: 20,
        width: '100%',
        marginBottom: 10,
        marginTop: 10
    },
    row: {
        display: 'flex',
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderBottomColor: '#00000033',
        paddingVertical: 8,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingBottom: 16
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